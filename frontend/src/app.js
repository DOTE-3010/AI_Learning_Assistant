import "./styles.css";

const API_URL = window.__AI_LEARNING_ASSISTANT_API_URL || window.location.origin;
const TOKEN_KEY = "ai_learning_assistant_token";
const USER_KEY = "ai_learning_assistant_user";
const CONTEXT_LIMIT = 128000;
const RUN_POLL_INTERVAL_MS = 1200;
const TERMINAL_RUN_STATUSES = new Set(["succeeded", "failed", "cancelled"]);
const DEFAULT_MODEL_FORM = {
    displayName: "Qwen Default",
    provider: "openai_compatible",
    baseUrl: "https://example-compatible-endpoint/v1",
    model: "qwen-model-name",
    apiKey: "",
};

const intents = [
    {
        id: "auto",
        label: "Auto",
        short: "A",
        family: "Router",
        outputs: ["manifest.json"],
        accent: "plum",
    },
    {
        id: "code_homework",
        label: "Code",
        short: "PY",
        family: "Homework",
        outputs: ["solution.py", "solution.ipynb"],
        accent: "teal",
    },
    {
        id: "essay_latex",
        label: "Essay",
        short: "TEX",
        family: "LaTeX report",
        outputs: ["main.tex", "main.pdf"],
        accent: "blue",
    },
    {
        id: "beamer_slides",
        label: "Slides",
        short: "PDF",
        family: "Beamer deck",
        outputs: ["slides.tex", "slides.pdf"],
        accent: "amber",
    },
    {
        id: "cheat_sheet",
        label: "Cheat sheet",
        short: "A4",
        family: "Dense study sheet",
        outputs: ["cheat-sheet.tex", "cheat-sheet.pdf"],
        accent: "coral",
    },
];

const state = {
    authMode: "login",
    token: localStorage.getItem(TOKEN_KEY) || "",
    user: readStoredUser(),
    intent: "code_homework",
    searchMode: "auto",
    targetPages: 2,
    taskText: "",
    files: [],
    context: null,
    model: {
        editorOpen: false,
        profiles: [],
        profile: null,
        form: { ...DEFAULT_MODEL_FORM },
        fieldErrors: {},
        statusMessage: "",
        statusTone: "neutral",
        busy: "",
    },
    authMessage: "",
    authTone: "neutral",
    run: {
        id: "",
        status: "idle",
        stage: "compose",
        message: "Ready",
        error: null,
    },
};

const app = document.getElementById("app");
let runPollTimerId = null;

init();

function init() {
    refreshLocalContext();
    render();
    if (state.token) {
        refreshCurrentUser();
    }
}

async function refreshCurrentUser() {
    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${state.token}` },
        });
        if (!response.ok) throw new Error("Session expired");
        const user = await response.json();
        setUser(user, state.token);
    } catch {
        clearSession();
        render();
    }
}

function render() {
    const isAuthenticated = Boolean(state.user && state.token);
    app.innerHTML = `
        <div class="studio-app ${isAuthenticated ? "" : "is-locked"}">
            ${renderHeader(isAuthenticated)}
            <main class="studio-main">
                ${renderWorkbench(isAuthenticated)}
                ${isAuthenticated ? "" : renderAuthPanel()}
                ${isAuthenticated && state.model.editorOpen ? renderModelSettingsPanel() : ""}
            </main>
        </div>
    `;
    bindEvents();
    updateContextDial();
}

function renderHeader(isAuthenticated) {
    return `
        <header class="studio-header">
            <div class="brand-lockup" aria-label="AI Learning Assistant">
                <div class="brand-mark">AI</div>
                <div>
                    <div class="brand-title">AI Learning Assistant</div>
                    <div class="brand-subtitle">Artifact Studio</div>
                </div>
            </div>
            <div class="header-actions">
                <div class="runtime-pill">
                    <span class="runtime-dot"></span>
                    <span>Local runtime</span>
                </div>
                ${
                    isAuthenticated
                        ? `<button class="user-chip" type="button" data-action="logout">
                            <span>${escapeHtml(state.user.email)}</span>
                            <strong>${escapeHtml(state.user.role)}</strong>
                        </button>`
                        : `<span class="user-chip is-muted">CUHK session</span>`
                }
            </div>
        </header>
    `;
}

function renderWorkbench(isAuthenticated) {
    const selectedIntent = getSelectedIntent();
    return `
        <section class="workbench-shell" aria-label="Artifact studio workbench">
            <section class="composer-panel studio-panel">
                <div class="panel-kicker">Compose</div>
                <label class="field-label" for="task-text">Task brief</label>
                <textarea id="task-text" class="task-input" rows="9" placeholder="Describe the assignment, deliverable, constraints, and source material.">${escapeHtml(state.taskText)}</textarea>

                <div class="control-block">
                    <div class="field-label">Artifact type</div>
                    <div class="intent-grid" role="radiogroup" aria-label="Artifact type">
                        ${intents.map(renderIntentButton).join("")}
                    </div>
                </div>

                <div class="composer-row">
                    <label class="compact-field">
                        <span class="field-label">Search</span>
                        <div class="segmented-control" data-control="search-mode">
                            ${["auto", "on", "off"].map((mode) => `
                                <button type="button" class="${state.searchMode === mode ? "is-active" : ""}" data-search-mode="${mode}">
                                    ${mode}
                                </button>
                            `).join("")}
                        </div>
                    </label>
                    <label class="compact-field">
                        <span class="field-label">Model</span>
                        <button class="model-select" type="button" data-action="open-model-settings">
                            <span>${escapeHtml(modelButtonLabel())}</span>
                            <span class="chevron" aria-hidden="true">v</span>
                        </button>
                    </label>
                </div>

                ${state.intent === "cheat_sheet" ? renderCheatSheetOptions() : ""}

                <div class="run-row">
                    <button class="run-button" type="button" data-action="run" ${canSubmitRun(isAuthenticated) ? "" : "disabled"}>
                        <span class="button-glyph"></span>
                        <span>Run artifact</span>
                    </button>
                    <div class="run-note">${escapeHtml(runNote(isAuthenticated))}</div>
                </div>
            </section>

            <section class="stage-panel studio-panel">
                <div class="stage-toolbar">
                    <div>
                        <div class="panel-kicker">Preview</div>
                        <h1>${escapeHtml(selectedIntent.family)}</h1>
                    </div>
                    <div class="stage-badge">${escapeHtml(selectedIntent.short)}</div>
                </div>
                ${renderArtifactPreview(selectedIntent)}
                ${renderUploadArea()}
            </section>

            <aside class="status-panel studio-panel">
                <div class="panel-kicker">Run state</div>
                ${renderContextDial()}
                ${renderRunStatus()}
                ${renderOutputList(selectedIntent)}
            </aside>
        </section>
    `;
}

function renderIntentButton(intent) {
    const active = state.intent === intent.id;
    return `
        <button type="button" class="intent-button ${active ? "is-active" : ""}" data-intent="${intent.id}" data-accent="${intent.accent}" role="radio" aria-checked="${active}">
            <span class="intent-short">${escapeHtml(intent.short)}</span>
            <span>
                <strong>${escapeHtml(intent.label)}</strong>
                <small>${escapeHtml(intent.family)}</small>
            </span>
        </button>
    `;
}

function renderCheatSheetOptions() {
    return `
        <div class="option-strip">
            <label class="stepper-field">
                <span class="field-label">Target pages</span>
                <input id="target-pages" type="number" min="1" max="12" value="${state.targetPages}">
            </label>
            <div class="paper-pill">A4</div>
            <div class="paper-pill">Dense</div>
        </div>
    `;
}

function renderArtifactPreview(intent) {
    const previewClass = `artifact-preview is-${intent.id.replace("_", "-")}`;
    return `
        <div class="${previewClass}" data-preview="${intent.id}">
            <div class="preview-source-rail">
                <span></span><span></span><span></span>
            </div>
            <div class="preview-canvas">
                ${previewMarkup(intent.id)}
            </div>
        </div>
    `;
}

function previewMarkup(intentId) {
    if (intentId === "code_homework") {
        return `
            <div class="code-window">
                <span class="code-line wide"></span>
                <span class="code-line"></span>
                <span class="code-line short"></span>
                <span class="code-line accent"></span>
                <span class="code-line"></span>
            </div>
        `;
    }
    if (intentId === "beamer_slides") {
        return `
            <div class="slide-stack">
                <div class="slide-card"></div>
                <div class="slide-card is-front">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
    }
    if (intentId === "cheat_sheet") {
        return `
            <div class="sheet-grid">
                ${Array.from({ length: 18 }, (_, index) => `<span class="${index % 5 === 0 ? "is-strong" : ""}"></span>`).join("")}
            </div>
        `;
    }
    if (intentId === "auto") {
        return `
            <div class="routing-map">
                <span></span><span></span><span></span><span></span>
            </div>
        `;
    }
    return `
        <div class="paper-preview">
            <span class="paper-title"></span>
            <span></span><span></span><span></span><span class="paper-rule"></span><span></span>
        </div>
    `;
}

function renderUploadArea() {
    return `
        <div class="upload-zone" data-action="open-file-picker" role="button" tabindex="0" aria-label="Choose reference files">
            <input id="file-input" type="file" multiple>
            <div class="upload-glyph"></div>
            <div>
                <strong>Reference files</strong>
                <span>${fileLabel()}</span>
            </div>
        </div>
    `;
}

function renderContextDial() {
    const estimate = getCurrentContextEstimate();
    return `
        <div class="context-widget" tabindex="0" data-context-state="${escapeHtml(estimate.warning_level)}" aria-label="${escapeHtml(contextAriaLabel(estimate))}">
            <div class="context-dial" aria-label="Context budget">
                <div class="dial-ring">
                    <span data-context-field="state">${escapeHtml(contextStateLabel(estimate.warning_level))}</span>
                </div>
            </div>
            <div class="context-copy">
                <strong data-context-field="source-label">${escapeHtml(contextSourceLabel(estimate.source))}</strong>
                <span data-context-field="summary">${escapeHtml(contextSummary(estimate))}</span>
            </div>
            <div class="context-popover" role="tooltip">
                <div><span>Input</span><strong data-context-field="input">${formatInt(estimate.estimated_input_tokens)}</strong></div>
                <div><span>Output</span><strong data-context-field="output">${formatInt(estimate.estimated_output_tokens)}</strong></div>
                <div><span>Total</span><strong data-context-field="total">${formatInt(estimate.estimated_total_tokens)}</strong></div>
                <div><span>Limit</span><strong data-context-field="limit">${formatInt(estimate.context_window_limit)}</strong></div>
                <div><span>Utilization</span><strong data-context-field="utilization">${formatPercent(estimate.utilization_ratio)}</strong></div>
                <div><span>Warning</span><strong data-context-field="warning">${escapeHtml(contextStateLabel(estimate.warning_level))}</strong></div>
                <div><span>Source</span><strong data-context-field="source">${escapeHtml(contextSourceLabel(estimate.source))}</strong></div>
            </div>
        </div>
    `;
}

function renderRunStatus() {
    return `
        <div class="status-stack">
            <div class="status-line">
                <span class="status-light" data-status="${state.run.status}"></span>
                <div>
                    <strong>${escapeHtml(state.run.status)}</strong>
                    <span>${escapeHtml(state.run.stage)}</span>
                </div>
            </div>
            <p>${escapeHtml(state.run.message)}</p>
            ${state.run.error ? `<p class="status-error">${escapeHtml(state.run.error)}</p>` : ""}
        </div>
    `;
}

function renderOutputList(intent) {
    return `
        <div class="output-list">
            <div class="list-head">
                <span>Output files</span>
                <button type="button" data-action="reveal-placeholder">Reveal</button>
            </div>
            ${intent.outputs.map((output) => `
                <div class="file-row">
                    <span class="file-icon">${fileKind(output)}</span>
                    <span>${escapeHtml(output)}</span>
                    <small>${state.run.status === "succeeded" ? "ready" : "pending"}</small>
                </div>
            `).join("")}
            <div class="file-row">
                <span class="file-icon">JS</span>
                <span>manifest.json</span>
                <small>pending</small>
            </div>
        </div>
    `;
}

function renderAuthPanel() {
    return `
        <section class="auth-panel studio-panel" aria-label="Authentication">
            <div class="auth-tabs">
                <button type="button" class="${state.authMode === "login" ? "is-active" : ""}" data-auth-mode="login">Login</button>
                <button type="button" class="${state.authMode === "register" ? "is-active" : ""}" data-auth-mode="register">Register</button>
            </div>
            <form id="auth-form" class="auth-form">
                <label>
                    <span class="field-label">CUHK email</span>
                    <input id="auth-email" type="email" autocomplete="email" placeholder="name@cuhk.edu.hk">
                </label>
                <label>
                    <span class="field-label">Password</span>
                    <input id="auth-password" type="password" autocomplete="${state.authMode === "login" ? "current-password" : "new-password"}">
                </label>
                ${
                    state.authMode === "register"
                        ? `<label>
                            <span class="field-label">Confirm password</span>
                            <input id="auth-confirm" type="password" autocomplete="new-password">
                        </label>`
                        : ""
                }
                <button class="auth-submit" type="submit">${state.authMode === "login" ? "Login" : "Create account"}</button>
                <div class="auth-message is-${state.authTone}">${escapeHtml(state.authMessage)}</div>
            </form>
        </section>
    `;
}

function renderModelSettingsPanel() {
    const form = state.model.form;
    const profile = state.model.profile;
    const keyState = profile?.api_key_ref ? "Saved key configured" : "No saved key";
    const isBusy = Boolean(state.model.busy);
    return `
        <section class="model-modal" role="dialog" aria-modal="true" aria-label="Model settings">
            <div class="model-dialog studio-panel">
                <div class="model-dialog-head">
                    <div>
                        <div class="panel-kicker">Model settings</div>
                        <h2>${escapeHtml(form.displayName || "Qwen Default")}</h2>
                    </div>
                    <button class="icon-button" type="button" data-action="close-model-settings" aria-label="Close model settings">x</button>
                </div>
                <form id="model-settings-form" class="model-form" novalidate>
                    ${renderModelField("displayName", "Display name", "text", form.displayName, "Qwen Default", false)}
                    ${renderModelField("baseUrl", "Base URL", "url", form.baseUrl, "https://example-compatible-endpoint/v1", true)}
                    ${renderModelField("model", "Model", "text", form.model, "qwen-model-name", true)}
                    ${renderModelField("apiKey", "API key", "password", form.apiKey, profile?.api_key_ref ? "New key" : "API key", false, "new-password")}
                    <div class="model-secret-row">
                        <span class="key-state ${profile?.api_key_ref ? "is-ready" : ""}">${escapeHtml(keyState)}</span>
                        <span class="profile-id">${escapeHtml(profile?.id || "environment-default")}</span>
                    </div>
                    <div class="model-actions">
                        <button class="secondary-button" type="button" data-action="test-model-settings" ${isBusy ? "disabled" : ""}>Test</button>
                        <button class="auth-submit" type="submit" ${isBusy ? "disabled" : ""}>${state.model.busy === "save" ? "Saving" : "Save"}</button>
                    </div>
                    <div class="auth-message is-${state.model.statusTone}">${escapeHtml(state.model.statusMessage)}</div>
                </form>
            </div>
        </section>
    `;
}

function renderModelField(field, label, type, value, placeholder, required, autocomplete = "off") {
    const error = state.model.fieldErrors[field] || "";
    return `
        <label class="model-field ${error ? "has-error" : ""}">
            <span class="field-label">${escapeHtml(label)}</span>
            <input
                data-model-field="${field}"
                type="${type}"
                value="${escapeHtml(value)}"
                placeholder="${escapeHtml(placeholder)}"
                autocomplete="${escapeHtml(autocomplete)}"
                ${required ? "required" : ""}
            >
            <span class="field-error">${escapeHtml(error)}</span>
        </label>
    `;
}

function bindEvents() {
    document.querySelectorAll("[data-auth-mode]").forEach((button) => {
        button.addEventListener("click", () => {
            state.authMode = button.dataset.authMode;
            state.authMessage = "";
            render();
        });
    });

    document.getElementById("auth-form")?.addEventListener("submit", handleAuthSubmit);
    document.getElementById("task-text")?.addEventListener("input", (event) => {
        state.taskText = event.target.value;
        refreshLocalContext();
        updateContextDial();
    });
    document.querySelectorAll("[data-intent]").forEach((button) => {
        button.addEventListener("click", () => {
            state.intent = button.dataset.intent;
            stopRunPolling();
            state.run = initialRunState();
            refreshLocalContext();
            render();
        });
    });
    document.querySelectorAll("[data-search-mode]").forEach((button) => {
        button.addEventListener("click", () => {
            state.searchMode = button.dataset.searchMode;
            render();
        });
    });
    document.getElementById("target-pages")?.addEventListener("input", (event) => {
        const value = Number(event.target.value);
        state.targetPages = Number.isFinite(value) && value > 0 ? Math.round(value) : 1;
        refreshLocalContext();
        updateContextDial();
    });
    const uploadZone = document.querySelector("[data-action='open-file-picker']");
    uploadZone?.addEventListener("click", () => document.getElementById("file-input")?.click());
    uploadZone?.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        document.getElementById("file-input")?.click();
    });
    document.getElementById("file-input")?.addEventListener("change", (event) => {
        state.files = Array.from(event.target.files || []);
        refreshLocalContext();
        render();
    });
    document.querySelector("[data-action='run']")?.addEventListener("click", handleRun);
    document.querySelector("[data-action='logout']")?.addEventListener("click", () => {
        stopRunPolling();
        clearSession();
        render();
    });
    document.querySelector("[data-action='open-model-settings']")?.addEventListener("click", openModelSettings);
    document.querySelector("[data-action='close-model-settings']")?.addEventListener("click", closeModelSettings);
    document.getElementById("model-settings-form")?.addEventListener("submit", handleModelSettingsSave);
    document.querySelector("[data-action='test-model-settings']")?.addEventListener("click", handleModelSettingsTest);
    document.querySelectorAll("[data-model-field]").forEach((input) => {
        input.addEventListener("input", () => {
            state.model.form[input.dataset.modelField] = input.value;
            delete state.model.fieldErrors[input.dataset.modelField];
            input.closest(".model-field")?.classList.remove("has-error");
            const error = input.closest(".model-field")?.querySelector(".field-error");
            if (error) error.textContent = "";
        });
    });
    document.onkeydown = handleGlobalKeydown;
    document.querySelector("[data-action='reveal-placeholder']")?.addEventListener("click", () => {
        state.run = {
            id: state.run.id,
            status: "idle",
            stage: "output_files",
            message: "Output list is ready.",
            error: null,
        };
        render();
    });
}

async function handleAuthSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("auth-email")?.value.trim().toLowerCase() || "";
    const password = document.getElementById("auth-password")?.value || "";
    const confirm = document.getElementById("auth-confirm")?.value || "";

    const endpoint = state.authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload = state.authMode === "login"
        ? { email, password }
        : { email, password, confirm_password: confirm };

    state.authMessage = "Contacting local backend...";
    state.authTone = "neutral";
    render();

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(errorMessage(data, "Authentication failed."));
        }
        if (state.authMode === "register") {
            state.authMode = "login";
            state.authMessage = "Account created. Login is ready.";
            state.authTone = "success";
            render();
            return;
        }
        setUser({ email: data.email, role: data.role }, data.token);
    } catch (error) {
        state.authMessage = error.message;
        state.authTone = "error";
        render();
    }
}

async function handleRun() {
    if (!state.user || !state.token) return;

    if (state.intent === "auto") {
        state.run = {
            id: "",
            status: "idle",
            stage: "choose_intent",
            message: "Choose Code, Essay, Slides, or Cheat sheet before running.",
            error: null,
        };
        render();
        return;
    }

    if (!state.taskText.trim()) {
        state.run = {
            id: "",
            status: "idle",
            stage: "validate_request",
            message: "Add a task brief before running.",
            error: null,
        };
        render();
        return;
    }

    stopRunPolling();
    refreshLocalContext();
    state.run = {
        id: "",
        status: "queued",
        stage: "submit_run",
        message: "Submitting run to local backend.",
        error: null,
    };
    render();

    try {
        const response = await fetch(`${API_URL}/api/runs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.token}`,
            },
            body: JSON.stringify(buildRunPayload()),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(errorMessage(data, "Run request failed."));
        }
        applyRunPayload(data);
        render();
        if (data.id) {
            await pollRunEvent(data.id);
            if (!TERMINAL_RUN_STATUSES.has(state.run.status)) {
                startRunPolling(data.id);
            }
        }
    } catch (error) {
        state.run = {
            id: "",
            status: "failed",
            stage: "submit_run",
            message: "Run request failed.",
            error: error.message,
        };
        render();
    }
}

function setUser(user, token) {
    state.user = user;
    state.token = token;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    state.authMessage = "";
    state.run = initialRunState();
    refreshLocalContext();
    render();
    loadModelProfiles();
}

function clearSession() {
    resetModelState();
    state.user = null;
    state.token = "";
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

function resetModelState() {
    state.model = {
        editorOpen: false,
        profiles: [],
        profile: null,
        form: { ...DEFAULT_MODEL_FORM },
        fieldErrors: {},
        statusMessage: "",
        statusTone: "neutral",
        busy: "",
    };
}

function modelButtonLabel() {
    const profile = state.model.profile;
    if (profile?.model) return profile.model;
    if (state.model.statusTone === "error") return "Model needs attention";
    return "Default Qwen profile";
}

function openModelSettings() {
    hydrateModelFormFromProfile();
    state.model.editorOpen = true;
    state.model.statusMessage = state.model.profile
        ? "Saved profile loaded."
        : "Local defaults loaded.";
    state.model.statusTone = "neutral";
    state.model.fieldErrors = {};
    render();
}

function closeModelSettings() {
    state.model.editorOpen = false;
    state.model.form.apiKey = "";
    state.model.fieldErrors = {};
    state.model.busy = "";
    render();
}

function handleGlobalKeydown(event) {
    if (event.key === "Escape" && state.model.editorOpen) {
        closeModelSettings();
    }
}

async function loadModelProfiles() {
    if (!state.token) return;
    try {
        const response = await fetch(`${API_URL}/api/settings/model-profiles`, {
            headers: { Authorization: `Bearer ${state.token}` },
        });
        const data = await response.json().catch(() => []);
        if (!response.ok) {
            throw new Error(errorMessage(data, "Model profile load failed."));
        }
        const profiles = Array.isArray(data) ? data.map(sanitizeModelProfile) : [];
        state.model.profiles = profiles;
        state.model.profile = profiles.find((profile) => profile.is_default) || profiles[0] || null;
        hydrateModelFormFromProfile();
        if (state.model.editorOpen) {
            state.model.statusMessage = state.model.profile ? "Saved profile loaded." : "Local defaults loaded.";
            state.model.statusTone = "neutral";
        }
        render();
    } catch (error) {
        state.model.statusMessage = error.message;
        state.model.statusTone = "error";
        if (state.model.editorOpen) render();
    }
}

function sanitizeModelProfile(profile) {
    return {
        id: String(profile?.id || "default-qwen"),
        display_name: String(profile?.display_name || "Qwen Default"),
        provider: String(profile?.provider || "openai_compatible"),
        base_url: String(profile?.base_url || DEFAULT_MODEL_FORM.baseUrl),
        model: String(profile?.model || DEFAULT_MODEL_FORM.model),
        api_key_ref: profile?.api_key_ref ? String(profile.api_key_ref) : null,
        context_window_hint: Number(profile?.context_window_hint || CONTEXT_LIMIT),
        supports_streaming: Boolean(profile?.supports_streaming),
        is_default: Boolean(profile?.is_default),
    };
}

function hydrateModelFormFromProfile() {
    const profile = state.model.profile;
    state.model.form = {
        displayName: profile?.display_name || DEFAULT_MODEL_FORM.displayName,
        provider: profile?.provider || DEFAULT_MODEL_FORM.provider,
        baseUrl: profile?.base_url || DEFAULT_MODEL_FORM.baseUrl,
        model: profile?.model || DEFAULT_MODEL_FORM.model,
        apiKey: "",
    };
}

async function handleModelSettingsSave(event) {
    event.preventDefault();
    state.model.busy = "save";
    state.model.statusMessage = "Saving model profile.";
    state.model.statusTone = "neutral";
    state.model.fieldErrors = {};
    render();

    try {
        const response = await fetch(`${API_URL}/api/settings/model-profiles/default`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.token}`,
            },
            body: JSON.stringify(buildModelProfilePayload({ includeApiKey: true })),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            applyModelApiError(data, "Model profile save failed.");
            return;
        }
        state.model.profile = sanitizeModelProfile(data);
        state.model.profiles = [state.model.profile];
        hydrateModelFormFromProfile();
        state.model.statusMessage = "Model profile saved.";
        state.model.statusTone = "success";
        state.model.fieldErrors = {};
    } catch (error) {
        state.model.statusMessage = error.message;
        state.model.statusTone = "error";
    } finally {
        state.model.busy = "";
        state.model.form.apiKey = "";
        render();
    }
}

async function handleModelSettingsTest() {
    state.model.busy = "test";
    state.model.statusMessage = "Testing provider connection.";
    state.model.statusTone = "neutral";
    state.model.fieldErrors = {};
    render();

    try {
        const useSubmittedProfile = Boolean(state.model.form.apiKey.trim());
        const response = await fetch(`${API_URL}/api/settings/model-profiles/test`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.token}`,
            },
            body: JSON.stringify(useSubmittedProfile ? buildModelProfilePayload({ includeApiKey: true }) : {}),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            applyModelApiError(data, "Provider connectivity test failed.");
            return;
        }
        state.model.statusMessage = `Connection OK for ${data.model || state.model.form.model}.`;
        state.model.statusTone = "success";
        state.model.fieldErrors = {};
    } catch (error) {
        state.model.statusMessage = error.message;
        state.model.statusTone = "error";
    } finally {
        state.model.busy = "";
        render();
    }
}

function buildModelProfilePayload({ includeApiKey }) {
    const form = state.model.form;
    const payload = {
        display_name: form.displayName.trim() || "Qwen Default",
        provider: form.provider || "openai_compatible",
        base_url: form.baseUrl.trim(),
        model: form.model.trim(),
        context_window_hint: CONTEXT_LIMIT,
        supports_streaming: true,
    };
    if (includeApiKey && form.apiKey.trim()) {
        payload.api_key = form.apiKey.trim();
    }
    return payload;
}

function applyModelApiError(data, fallback) {
    const error = data?.error || {};
    state.model.statusMessage = error.code
        ? `${error.code}: ${error.message || fallback}`
        : errorMessage(data, fallback);
    state.model.statusTone = "error";
    state.model.fieldErrors = modelFieldErrors(error.fields || []);
}

function modelFieldErrors(fields) {
    return fields.reduce((errors, field) => {
        const key = modelFieldKey(field.field);
        if (key) errors[key] = fieldErrorText(field.rule);
        return errors;
    }, {});
}

function modelFieldKey(field) {
    if (field === "base_url") return "baseUrl";
    if (field === "model") return "model";
    if (field === "api_key") return "apiKey";
    if (field === "display_name") return "displayName";
    return "";
}

function fieldErrorText(rule) {
    if (rule === "required") return "Required";
    if (rule === "absolute_http_url") return "Use an absolute http or https URL";
    if (rule === "enum") return "Choose a supported value";
    return rule || "Invalid value";
}

function initialRunState() {
    return {
        id: "",
        status: "idle",
        stage: "compose",
        message: "Ready",
        error: null,
    };
}

function buildRunPayload() {
    const payload = {
        task_text: state.taskText.trim(),
        intent: state.intent,
        output_preference: outputPreferenceForIntent(state.intent),
        search_mode: state.searchMode,
        model_profile_id: state.model.profile?.id || null,
        upload_ids: [],
        options: optionsForIntent(state.intent),
    };
    return payload;
}

function outputPreferenceForIntent(intent) {
    if (intent === "code_homework") return "py";
    if (intent === "essay_latex" || intent === "beamer_slides" || intent === "cheat_sheet") return "pdf";
    return null;
}

function optionsForIntent(intent) {
    if (intent !== "cheat_sheet") return {};
    return {
        target_pages: Math.max(1, Math.round(Number(state.targetPages) || 1)),
        paper_size: "A4",
        density: "dense",
    };
}

function canSubmitRun(isAuthenticated) {
    return isAuthenticated && state.intent !== "auto";
}

function applyRunPayload(payload) {
    if (payload.context) {
        state.context = normalizeContextEstimate(payload.context, "backend");
    }
    state.run = {
        id: payload.id || payload.run_id || state.run.id || "",
        status: payload.status || state.run.status,
        stage: payload.stage || state.run.stage || "queued",
        message: runMessageFromPayload(payload),
        error: errorFromPayload(payload),
    };
}

function runMessageFromPayload(payload) {
    if (payload.message) return payload.message;
    if (payload.error?.message) return payload.error.message;
    if (payload.error_message) return payload.error_message;
    if (payload.status === "succeeded") return "Run succeeded.";
    if (payload.status === "failed") return "Run failed.";
    if (payload.status === "running") return "Run is running.";
    return "Run queued.";
}

function errorFromPayload(payload) {
    if (payload.error?.message) return payload.error.message;
    if (payload.status === "failed" && payload.error_message) return payload.error_message;
    return null;
}

function startRunPolling(runId) {
    stopRunPolling();
    runPollTimerId = window.setInterval(() => {
        pollRunEvent(runId).catch((error) => {
            stopRunPolling();
            state.run = {
                ...state.run,
                status: "failed",
                stage: "poll_status",
                message: "Could not refresh run status.",
                error: error.message,
            };
            render();
        });
    }, RUN_POLL_INTERVAL_MS);
}

function stopRunPolling() {
    if (!runPollTimerId) return;
    window.clearInterval(runPollTimerId);
    runPollTimerId = null;
}

async function pollRunEvent(runId) {
    if (!runId || !state.token) return;
    const response = await fetch(`${API_URL}/api/runs/${encodeURIComponent(runId)}/events`, {
        headers: { Authorization: `Bearer ${state.token}` },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(errorMessage(data, "Run status refresh failed."));
    }
    applyRunPayload(data);
    render();
    if (TERMINAL_RUN_STATUSES.has(state.run.status)) {
        stopRunPolling();
    }
}

function updateContextDial() {
    const estimate = getCurrentContextEstimate();
    const dial = document.querySelector(".dial-ring");
    const widget = document.querySelector(".context-widget");
    if (!dial || !widget) return;
    dial.style.setProperty("--context-ratio", `${Math.min(100, estimate.utilization_ratio * 100)}%`);
    widget.dataset.contextState = estimate.warning_level;
    widget.setAttribute("aria-label", contextAriaLabel(estimate));
    setContextText("state", contextStateLabel(estimate.warning_level));
    setContextText("source-label", contextSourceLabel(estimate.source));
    setContextText("summary", contextSummary(estimate));
    setContextText("input", formatInt(estimate.estimated_input_tokens));
    setContextText("output", formatInt(estimate.estimated_output_tokens));
    setContextText("total", formatInt(estimate.estimated_total_tokens));
    setContextText("limit", formatInt(estimate.context_window_limit));
    setContextText("utilization", formatPercent(estimate.utilization_ratio));
    setContextText("warning", contextStateLabel(estimate.warning_level));
    setContextText("source", contextSourceLabel(estimate.source));
}

function setContextText(field, text) {
    document.querySelectorAll(`[data-context-field="${field}"]`).forEach((element) => {
        element.textContent = text;
    });
}

function refreshLocalContext() {
    state.context = calculateLocalContextEstimate();
}

function getCurrentContextEstimate() {
    return state.context || calculateLocalContextEstimate();
}

function calculateLocalContextEstimate() {
    const selected = getSelectedIntent();
    const fileBytes = state.files.reduce((total, file) => total + Number(file.size || 0), 0);
    const estimatedInput = Math.max(1, Math.ceil((state.taskText.length + Math.min(fileBytes, 200000)) / 4));
    const outputBase = selected.id === "cheat_sheet"
        ? Math.max(5000, state.targetPages * 1800)
        : selected.id === "beamer_slides"
            ? 7000
            : selected.id === "essay_latex"
                ? 6000
                : selected.id === "code_homework"
                    ? 4000
                    : 4000;
    const estimatedTotal = estimatedInput + outputBase;
    const ratio = estimatedTotal / CONTEXT_LIMIT;
    let warning = "ok";
    if (ratio > 0.85) warning = "critical";
    else if (ratio >= 0.70) warning = "warning";
    return normalizeContextEstimate({
        estimated_input_tokens: estimatedInput,
        estimated_output_tokens: outputBase,
        estimated_total_tokens: estimatedTotal,
        context_window_limit: CONTEXT_LIMIT,
        utilization_ratio: ratio,
        warning_level: warning,
        source: "local",
    }, "local");
}

function normalizeContextEstimate(rawContext, fallbackSource) {
    const input = cleanNumber(rawContext?.estimated_input_tokens, 0);
    const output = cleanNumber(rawContext?.estimated_output_tokens, 0);
    const limit = cleanNumber(rawContext?.context_window_limit, CONTEXT_LIMIT) || CONTEXT_LIMIT;
    const total = cleanNumber(rawContext?.estimated_total_tokens, input + output);
    const ratio = cleanNumber(rawContext?.utilization_ratio, limit ? total / limit : 0);
    const warning = normalizeWarningLevel(rawContext?.warning_level, ratio);
    return {
        estimated_input_tokens: input,
        estimated_output_tokens: output,
        estimated_total_tokens: total,
        context_window_limit: limit,
        utilization_ratio: ratio,
        warning_level: warning,
        source: String(rawContext?.source || fallbackSource || "local"),
    };
}

function cleanNumber(value, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) return fallback;
    return number;
}

function normalizeWarningLevel(level, ratio) {
    if (level === "ok" || level === "warning" || level === "critical") return level;
    if (ratio > 0.85) return "critical";
    if (ratio >= 0.70) return "warning";
    return "ok";
}

function getSelectedIntent() {
    return intents.find((intent) => intent.id === state.intent) || intents[1];
}

function readStoredUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
        return null;
    }
}

function fileLabel() {
    if (!state.files.length) return "Drop or choose files";
    if (state.files.length === 1) return state.files[0].name;
    return `${state.files.length} files selected`;
}

function fileKind(filename) {
    const ext = filename.split(".").pop()?.slice(0, 3).toUpperCase();
    return ext || "FILE";
}

function runNote(isAuthenticated) {
    if (!isAuthenticated) return "Login to activate run controls.";
    if (state.intent === "auto") return "Choose a concrete artifact type for generation.";
    if (state.run.status === "queued" || state.run.status === "running") return "Backend context events are updating the dial.";
    return "Ready for a local run.";
}

function errorMessage(data, fallback) {
    if (data?.error?.message) return data.error.message;
    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.message === "string") return data.message;
    return fallback;
}

function formatInt(value) {
    return Number(value || 0).toLocaleString();
}

function formatPercent(value) {
    return `${Math.round(Number(value || 0) * 100)}%`;
}

function contextStateLabel(level) {
    if (level === "critical") return "Critical";
    if (level === "warning") return "Warning";
    return "OK";
}

function contextSourceLabel(source) {
    const normalized = String(source || "local").toLowerCase();
    if (normalized === "local") return "Local estimate";
    if (normalized === "heuristic") return "Backend heuristic";
    if (normalized === "provider") return "Provider estimate";
    return source;
}

function contextSummary(estimate) {
    if (estimate.warning_level === "critical") return "Aggressive compression likely";
    if (estimate.warning_level === "warning") return "Compression may be needed";
    return "Budget looks healthy";
}

function contextAriaLabel(estimate) {
    return `Context budget ${contextStateLabel(estimate.warning_level)}, ${formatPercent(estimate.utilization_ratio)} utilized, ${contextSourceLabel(estimate.source)}`;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
