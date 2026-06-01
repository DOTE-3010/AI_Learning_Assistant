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
        id: "code_homework",
        label: "Code",
        short: "PY",
        title: "Homework code",
        description: "Script or notebook answer",
        outputs: ["solution.py", "solution.ipynb"],
        stages: ["route", "context", "generate", "validate"],
        accent: "teal",
    },
    {
        id: "essay_latex",
        label: "Essay",
        short: "TEX",
        title: "LaTeX essay",
        description: "Source plus compiled PDF",
        outputs: ["main.pdf", "main.tex"],
        stages: ["route", "context", "write", "compile"],
        accent: "blue",
    },
    {
        id: "beamer_slides",
        label: "Slides",
        short: "PDF",
        title: "Beamer deck",
        description: "Slide source plus PDF",
        outputs: ["slides.pdf", "slides.tex"],
        stages: ["route", "outline", "write", "compile"],
        accent: "amber",
    },
    {
        id: "cheat_sheet",
        label: "Cheat sheet",
        short: "A4",
        title: "Dense A4 sheet",
        description: "Course compression PDF",
        outputs: ["cheat-sheet.pdf", "cheat-sheet.tex"],
        stages: ["ingest", "compress", "layout", "compile"],
        accent: "coral",
    },
];

const stageVocabulary = {
    compose: "Compose",
    choose_intent: "Select artifact",
    validate_request: "Validate",
    upload_inputs: "Upload inputs",
    submit_run: "Submit run",
    queued: "Queued",
    running: "Running",
    resolve_model: "Model",
    extract_context: "Context",
    decide_search: "Search",
    generate_source: "Generate",
    validate_source: "Validate",
    compile_pdf: "Compile PDF",
    write_manifest: "Manifest",
    poll_status: "Refresh",
    output_files: "Output files",
};

const state = {
    authMode: "login",
    token: localStorage.getItem(TOKEN_KEY) || "",
    user: readStoredUser(),
    activePane: "console",
    intent: "code_homework",
    outputPreference: "py",
    searchMode: "auto",
    targetPages: 2,
    taskText: "",
    refinementText: "",
    files: [],
    fieldErrors: {},
    context: null,
    previewTab: "primary",
    activeFile: "solution.py",
    notice: { message: "", tone: "neutral" },
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
    run: initialRunState(),
    history: [
        {
            id: "session-ready",
            kind: "system",
            status: "idle",
            title: "Console ready",
            message: "Choose an artifact type, add source material, then run.",
            timestamp: new Date().toISOString(),
        },
    ],
};

const app = document.getElementById("app");
let runPollTimerId = null;

init();

function init() {
    refreshLocalContext();
    normalizeActiveFile();
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
        <div class="studio-app ${isAuthenticated ? "" : "is-locked"}" data-mobile-pane="${escapeHtml(state.activePane)}">
            ${renderHeader(isAuthenticated)}
            <main class="studio-main">
                ${renderMobilePaneSwitch()}
                <section class="workbench-grid" aria-label="Conversational artifact workbench">
                    ${renderConsolePane(isAuthenticated)}
                    ${renderPreviewPane(isAuthenticated)}
                </section>
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
                <div class="brand-mark" aria-hidden="true">AL</div>
                <div>
                    <div class="brand-title">AI Learning Assistant</div>
                    <div class="brand-subtitle">CUHK artifact studio</div>
                </div>
            </div>
            <div class="header-actions">
                <div class="runtime-chip">
                    <span class="runtime-dot"></span>
                    <span>Docker backend</span>
                </div>
                ${
                    isAuthenticated
                        ? `<button class="identity-chip" type="button" data-action="logout">
                            <span>${escapeHtml(state.user.email)}</span>
                            <strong>${escapeHtml(state.user.role)}</strong>
                        </button>`
                        : `<span class="identity-chip is-muted">CUHK session required</span>`
                }
            </div>
        </header>
    `;
}

function renderMobilePaneSwitch() {
    return `
        <nav class="mobile-pane-switch" aria-label="Workbench panes">
            <button type="button" class="${state.activePane === "console" ? "is-active" : ""}" data-pane="console">Console</button>
            <button type="button" class="${state.activePane === "preview" ? "is-active" : ""}" data-pane="preview">Preview</button>
        </nav>
    `;
}

function renderConsolePane(isAuthenticated) {
    return `
        <section class="console-pane workbench-pane" aria-label="Production console">
            <div class="pane-head">
                <div>
                    <div class="pane-kicker">Production console</div>
                    <h1>Generate artifacts</h1>
                </div>
                <button class="tool-button" type="button" data-action="open-model-settings" ${isAuthenticated ? "" : "disabled"}>
                    <span class="tool-glyph" aria-hidden="true"></span>
                    <span>${escapeHtml(modelButtonLabel())}</span>
                </button>
            </div>

            <div class="console-utility-row">
                ${renderContextDial()}
                ${renderSearchModeControl()}
            </div>

            <div class="artifact-type-bar" role="radiogroup" aria-label="Artifact type">
                ${intents.map(renderIntentButton).join("")}
            </div>

            <section class="command-composer" aria-label="Generation command">
                <div class="composer-head">
                    <label class="field-label" for="task-text">Brief</label>
                    <span>${escapeHtml(getSelectedIntent().description)}</span>
                </div>
                <textarea
                    id="task-text"
                    class="task-input ${state.fieldErrors.task_text ? "has-error" : ""}"
                    rows="8"
                    placeholder="Paste the assignment brief, constraints, marking expectations, and any output notes."
                >${escapeHtml(state.taskText)}</textarea>
                ${state.fieldErrors.task_text ? `<div class="field-error">${escapeHtml(state.fieldErrors.task_text)}</div>` : ""}
                ${renderIntentOptions()}
                ${renderUploadArea()}
                <div class="composer-actions">
                    <button class="run-button" type="button" data-action="run" ${canSubmitRun(isAuthenticated) ? "" : "disabled"}>
                        <span class="run-glyph" aria-hidden="true"></span>
                        <span>${runButtonLabel()}</span>
                    </button>
                    <span class="run-note">${escapeHtml(runNote(isAuthenticated))}</span>
                </div>
            </section>

            ${renderRefinementComposer(isAuthenticated)}
            ${renderCommandHistory()}
        </section>
    `;
}

function renderIntentButton(intent) {
    const active = state.intent === intent.id;
    return `
        <button
            type="button"
            class="artifact-type ${active ? "is-active" : ""}"
            data-intent="${intent.id}"
            data-accent="${intent.accent}"
            role="radio"
            aria-checked="${active}"
        >
            <span class="artifact-short">${escapeHtml(intent.short)}</span>
            <span>
                <strong>${escapeHtml(intent.label)}</strong>
                <small>${escapeHtml(intent.title)}</small>
            </span>
        </button>
    `;
}

function renderSearchModeControl() {
    return `
        <div class="search-control">
            <span class="field-label">Search</span>
            <div class="segmented-control" data-control="search-mode">
                ${["auto", "on", "off"].map((mode) => `
                    <button type="button" class="${state.searchMode === mode ? "is-active" : ""}" data-search-mode="${mode}">
                        ${mode}
                    </button>
                `).join("")}
            </div>
        </div>
    `;
}

function renderIntentOptions() {
    if (state.intent === "code_homework") {
        return `
            <div class="option-row">
                <div>
                    <span class="field-label">Output</span>
                    <div class="segmented-control is-tight" data-control="code-output">
                        <button type="button" class="${state.outputPreference === "py" ? "is-active" : ""}" data-output-preference="py">.py</button>
                        <button type="button" class="${state.outputPreference === "ipynb" ? "is-active" : ""}" data-output-preference="ipynb">.ipynb</button>
                    </div>
                </div>
                <div class="status-capsule">Preview only</div>
            </div>
        `;
    }
    if (state.intent === "cheat_sheet") {
        return `
            <div class="option-row">
                <label class="number-field">
                    <span class="field-label">Target pages</span>
                    <input id="target-pages" class="${state.fieldErrors.target_pages ? "has-error" : ""}" type="number" min="1" max="12" value="${state.targetPages}">
                </label>
                <div class="status-capsule">A4</div>
                <div class="status-capsule">Dense</div>
            </div>
            ${state.fieldErrors.target_pages ? `<div class="field-error">${escapeHtml(state.fieldErrors.target_pages)}</div>` : ""}
        `;
    }
    return `
        <div class="option-row">
            <div class="status-capsule">PDF first</div>
            <div class="status-capsule">Source kept</div>
        </div>
    `;
}

function renderUploadArea() {
    const selectedText = state.files.length
        ? `${state.files.length} reference file${state.files.length === 1 ? "" : "s"} selected`
        : "Drop or choose reference files";
    return `
        <section class="upload-module" aria-label="Reference files">
            <div class="upload-zone" data-action="open-file-picker" role="button" tabindex="0">
                <input id="file-input" type="file" multiple>
                <span class="upload-mark" aria-hidden="true"></span>
                <div>
                    <strong>Reference files</strong>
                    <span>${escapeHtml(selectedText)}</span>
                </div>
            </div>
            ${state.files.length ? renderSelectedFiles() : ""}
            ${state.notice.message ? `<div class="inline-notice is-${state.notice.tone}">${escapeHtml(state.notice.message)}</div>` : ""}
        </section>
    `;
}

function renderSelectedFiles() {
    return `
        <div class="selected-files">
            ${state.files.map((item) => `
                <div class="selected-file" data-file-key="${escapeHtml(item.key)}">
                    <span class="file-kind">${escapeHtml(fileKind(item.name))}</span>
                    <span class="file-name">${escapeHtml(item.name)}</span>
                    <small>${escapeHtml(uploadStatusLabel(item))}</small>
                    <button class="icon-action" type="button" data-remove-file="${escapeHtml(item.key)}" aria-label="Remove ${escapeHtml(item.name)}">x</button>
                </div>
            `).join("")}
        </div>
    `;
}

function renderRefinementComposer(isAuthenticated) {
    const disabled = !isAuthenticated || !state.run.id || state.run.status === "queued" || state.run.status === "running";
    return `
        <section class="refinement-composer" aria-label="Follow-up refinement">
            <div class="composer-head">
                <label class="field-label" for="refinement-text">Follow-up</label>
                <span>${state.run.id ? `Revision source ${shortRunId(state.run.id)}` : "Available after first run"}</span>
            </div>
            <textarea
                id="refinement-text"
                rows="3"
                placeholder="Ask for a tighter proof, more comments, fewer slides, or a different structure."
                ${disabled ? "disabled" : ""}
            >${escapeHtml(state.refinementText)}</textarea>
            <div class="composer-actions">
                <button class="secondary-action" type="button" data-action="run-refinement" ${disabled || !state.refinementText.trim() ? "disabled" : ""}>
                    New revision run
                </button>
                <span class="run-note">Creates a new run; generated files stay source-of-truth on disk.</span>
            </div>
        </section>
    `;
}

function renderCommandHistory() {
    return `
        <section class="history-stream" aria-label="Run history">
            <div class="history-head">
                <span>Run history</span>
                <small>${state.history.length} entries</small>
            </div>
            <div class="history-list">
                ${state.history.slice().reverse().map(renderHistoryItem).join("")}
            </div>
        </section>
    `;
}

function renderHistoryItem(item) {
    return `
        <article class="history-item is-${escapeHtml(item.kind)}" data-status="${escapeHtml(item.status || "idle")}">
            <div class="history-marker"></div>
            <div class="history-content">
                <div class="history-title">
                    <strong>${escapeHtml(item.title)}</strong>
                    <span>${escapeHtml(formatHistoryTime(item.timestamp))}</span>
                </div>
                <p>${escapeHtml(item.message)}</p>
                ${
                    item.meta
                        ? `<div class="history-meta">${escapeHtml(item.meta)}</div>`
                        : ""
                }
            </div>
        </article>
    `;
}

function renderPreviewPane(isAuthenticated) {
    const intent = getSelectedIntent();
    return `
        <section class="preview-pane workbench-pane" aria-label="Artifact preview">
            <div class="preview-header">
                <div>
                    <div class="pane-kicker">Artifact preview</div>
                    <h2>${escapeHtml(intent.title)}</h2>
                </div>
                <div class="preview-actions">
                    <button class="secondary-action" type="button" data-action="copy-current-path" ${state.run.outputRoot ? "" : "disabled"}>Copy path</button>
                    <button class="secondary-action" type="button" data-action="reveal-run" ${state.run.outputRoot ? "" : "disabled"}>Reveal</button>
                    <button class="secondary-action" type="button" data-action="regenerate" ${canSubmitRun(isAuthenticated) ? "" : "disabled"}>Regenerate</button>
                </div>
            </div>

            <div class="preview-status-strip">
                ${renderRunStatusPill()}
                ${renderStageTrack(intent)}
            </div>

            <div class="preview-shell" data-intent="${escapeHtml(state.intent)}" data-run-status="${escapeHtml(state.run.status)}">
                ${renderPreviewTabs()}
                <div class="preview-body">
                    ${renderPreviewBody()}
                </div>
            </div>

            ${renderOutputFiles()}
        </section>
    `;
}

function renderRunStatusPill() {
    return `
        <div class="run-status-pill" data-status="${escapeHtml(state.run.status)}">
            <span class="status-light"></span>
            <div>
                <strong>${escapeHtml(state.run.status)}</strong>
                <span>${escapeHtml(stageLabel(state.run.stage))}</span>
            </div>
        </div>
        <p class="run-message">${escapeHtml(state.run.error || state.run.message)}</p>
    `;
}

function renderStageTrack(intent) {
    const current = normalizedStageBucket(state.run.stage, state.run.status);
    return `
        <div class="stage-track" aria-label="Generation stages">
            ${intent.stages.map((stage) => `
                <span class="${stage === current ? "is-active" : ""}">${escapeHtml(stage)}</span>
            `).join("")}
        </div>
    `;
}

function renderPreviewTabs() {
    const tabs = getPreviewTabs();
    return `
        <div class="preview-tabs" role="tablist" aria-label="Preview tabs">
            ${tabs.map((tab) => `
                <button type="button" role="tab" class="${state.previewTab === tab.id ? "is-active" : ""}" data-preview-tab="${tab.id}">
                    ${escapeHtml(tab.label)}
                </button>
            `).join("")}
        </div>
    `;
}

function renderPreviewBody() {
    if (state.previewTab === "source") return renderSourceInspection();
    if (state.previewTab === "logs") return renderLogInspection();
    if (state.previewTab === "manifest") return renderManifestInspection();
    if (state.intent === "code_homework") return renderCodePreview();
    if (state.intent === "essay_latex") return renderEssayPreview();
    if (state.intent === "beamer_slides") return renderSlidesPreview();
    return renderCheatSheetPreview();
}

function renderCodePreview() {
    if (state.outputPreference === "ipynb") {
        return renderNotebookPreview();
    }
    const files = getCodeFiles();
    return `
        <div class="code-product">
            <div class="code-tabs">
                ${files.map((file) => `
                    <button type="button" class="${state.activeFile === file ? "is-active" : ""}" data-active-file="${escapeHtml(file)}">
                        ${escapeHtml(file)}
                    </button>
                `).join("")}
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">Copy visible</button>
            </div>
            <div class="code-editor" aria-label="Syntax highlighted code preview">
                ${renderHighlightedCode(codePreviewText(state.activeFile))}
            </div>
            <div class="terminal-strip" data-status="${escapeHtml(state.run.status)}">
                <span>${escapeHtml(codeStatusTitle())}</span>
                <strong>${escapeHtml(codeStatusDetail())}</strong>
            </div>
        </div>
    `;
}

function renderNotebookPreview() {
    return `
        <div class="notebook-product">
            <div class="notebook-toolbar">
                <span>solution.ipynb</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">Copy visible</button>
            </div>
            <div class="notebook-cell is-markdown">
                <span class="cell-label">Markdown</span>
                <h3>Approach</h3>
                <p>State the algorithm, edge cases, and complexity before the implementation cell.</p>
            </div>
            <div class="notebook-cell">
                <span class="cell-label">Code</span>
                <div class="code-editor is-compact">${renderHighlightedCode(notebookCodeText())}</div>
            </div>
            <div class="terminal-strip" data-status="${escapeHtml(state.run.status)}">
                <span>Notebook validation</span>
                <strong>${state.run.status === "failed" ? "Preserved for inspection" : "Preview-only, no execution"}</strong>
            </div>
        </div>
    `;
}

function renderEssayPreview() {
    return `
        <div class="pdf-stage">
            <div class="page-rail">
                <span class="is-active">1</span>
                <span>2</span>
                <span>3</span>
            </div>
            <article class="pdf-page essay-page">
                <header>
                    <span class="paper-overline">LaTeX report</span>
                    <h3>${escapeHtml(briefTitle("Generated Essay"))}</h3>
                    <div class="paper-rule"></div>
                </header>
                <section>
                    <h4>Introduction</h4>
                    <p></p><p class="short"></p>
                    <h4>Argument</h4>
                    <p></p><p></p><p class="shorter"></p>
                    <h4>References</h4>
                    <p class="short"></p>
                </section>
            </article>
            ${renderPreviewOverlay("PDF renderer", "Pages are shown as PDF-like preview until artifact bytes are exposed.")}
        </div>
    `;
}

function renderSlidesPreview() {
    return `
        <div class="slide-product">
            <aside class="slide-thumbs" aria-label="Slide thumbnails">
                <span class="is-active"></span>
                <span></span>
                <span></span>
                <span></span>
            </aside>
            <div class="slide-canvas">
                <div class="slide-page">
                    <span class="slide-kicker">Beamer deck</span>
                    <h3>${escapeHtml(briefTitle("Course Presentation"))}</h3>
                    <div class="slide-columns">
                        <span></span><span></span><span></span><span></span>
                    </div>
                    <div class="slide-footer">Slide 1 / 12</div>
                </div>
            </div>
            ${renderPreviewOverlay("Deck preview", "Compiled PDF pages will replace this deck skeleton when a file endpoint is available.")}
        </div>
    `;
}

function renderCheatSheetPreview() {
    const pageCount = Math.max(1, Math.round(Number(state.targetPages) || 1));
    return `
        <div class="cheat-product">
            <div class="cheat-toolbar">
                <span>A4 dense layout</span>
                <strong>${pageCount} page${pageCount === 1 ? "" : "s"}</strong>
            </div>
            <div class="cheat-pages">
                ${Array.from({ length: Math.min(pageCount, 4) }, (_, pageIndex) => `
                    <article class="cheat-page">
                        <header>
                            <span></span><span></span>
                        </header>
                        <div class="cheat-grid">
                            ${Array.from({ length: 36 }, (_, index) => `
                                <i class="${(index + pageIndex) % 7 === 0 ? "is-strong" : ""}"></i>
                            `).join("")}
                        </div>
                    </article>
                `).join("")}
            </div>
            ${renderPreviewOverlay("Sheet preview", "Dense PDF-like pages stay visible while generation runs.")}
        </div>
    `;
}

function renderPreviewOverlay(title, message) {
    if (state.run.status === "succeeded" && state.run.outputRoot) return "";
    if (state.run.status === "failed") {
        return `
            <div class="preview-overlay is-error">
                <strong>${escapeHtml(state.run.errorCode || "Run failed")}</strong>
                <span>${escapeHtml(state.run.error || "Any preserved source or logs remain available from the run folder.")}</span>
            </div>
        `;
    }
    if (state.run.status === "queued" || state.run.status === "running") {
        return `
            <div class="preview-overlay is-running">
                <strong>${escapeHtml(stageLabel(state.run.stage))}</strong>
                <span>${escapeHtml(state.run.message)}</span>
            </div>
        `;
    }
    return `
        <div class="preview-overlay">
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(message)}</span>
        </div>
    `;
}

function renderSourceInspection() {
    const filename = sourceFilenameForIntent();
    const language = filename.endsWith(".tex") ? "latex" : filename.endsWith(".json") ? "json" : "python";
    return `
        <div class="inspection-product">
            <div class="inspection-head">
                <span>${escapeHtml(filename)}</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">Copy visible</button>
            </div>
            <div class="code-editor">${renderHighlightedCode(sourcePreviewText(), language)}</div>
            <div class="inspection-note">${escapeHtml(artifactAccessNote())}</div>
        </div>
    `;
}

function renderLogInspection() {
    return `
        <div class="inspection-product">
            <div class="inspection-head">
                <span>generation.log</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">Copy visible</button>
            </div>
            <div class="log-view">
                <p><span>${escapeHtml(timestampLabel())}</span> ${escapeHtml(stageLabel(state.run.stage))}: ${escapeHtml(state.run.message)}</p>
                <p><span>run</span> ${state.run.id ? escapeHtml(state.run.id) : "not-started"}</p>
                <p><span>status</span> ${escapeHtml(state.run.status)}</p>
                ${state.run.error ? `<p class="is-error"><span>error</span> ${escapeHtml(state.run.error)}</p>` : ""}
            </div>
            <div class="inspection-note">${escapeHtml(artifactAccessNote())}</div>
        </div>
    `;
}

function renderManifestInspection() {
    const manifest = {
        schema_version: 1,
        run_id: state.run.id || null,
        revision_of_run_id: state.run.revisionOfRunId || null,
        intent: state.intent,
        search: { mode: state.searchMode },
        status: state.run.status,
        outputs: getExpectedFiles().map((file) => ({ path: file.relativePath, kind: file.kind })),
    };
    return `
        <div class="inspection-product">
            <div class="inspection-head">
                <span>manifest.json</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">Copy visible</button>
            </div>
            <div class="code-editor">${renderHighlightedCode(JSON.stringify(manifest, null, 2), "json")}</div>
            <div class="inspection-note">${escapeHtml(artifactAccessNote())}</div>
        </div>
    `;
}

function renderOutputFiles() {
    const files = getExpectedFiles();
    return `
        <section class="output-dock" aria-label="Output files">
            <div class="output-head">
                <span>Files</span>
                <small>${state.run.outputRoot ? escapeHtml(truncatePath(state.run.outputRoot)) : "Run folder pending"}</small>
            </div>
            <div class="output-grid">
                ${files.map((file) => renderOutputFile(file)).join("")}
            </div>
        </section>
    `;
}

function renderOutputFile(file) {
    const path = artifactAbsolutePath(file.relativePath);
    const isReady = Boolean(state.run.outputRoot && (state.run.status === "succeeded" || file.kind !== "pdf"));
    return `
        <div class="output-file" data-kind="${escapeHtml(file.kind)}">
            <span class="file-kind">${escapeHtml(file.badge)}</span>
            <div>
                <strong>${escapeHtml(file.name)}</strong>
                <small>${escapeHtml(isReady ? file.readyLabel : file.pendingLabel)}</small>
            </div>
            <div class="file-actions">
                <button type="button" data-copy-file="${escapeHtml(path || file.relativePath)}" ${path ? "" : "disabled"}>Copy</button>
                <button type="button" data-open-file="${escapeHtml(path || "")}" ${path ? "" : "disabled"}>Open</button>
            </div>
        </div>
    `;
}

function renderContextDial() {
    const estimate = getCurrentContextEstimate();
    return `
        <div class="context-widget" tabindex="0" data-context-state="${escapeHtml(estimate.warning_level)}" aria-label="${escapeHtml(contextAriaLabel(estimate))}">
            <div class="dial-ring" aria-hidden="true">
                <span data-context-field="state">${escapeHtml(contextStateLabel(estimate.warning_level))}</span>
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
                <div><span>Use</span><strong data-context-field="utilization">${formatPercent(estimate.utilization_ratio)}</strong></div>
                <div><span>Warning</span><strong data-context-field="warning">${escapeHtml(contextStateLabel(estimate.warning_level))}</strong></div>
                <div><span>Source</span><strong data-context-field="source">${escapeHtml(contextSourceLabel(estimate.source))}</strong></div>
            </div>
        </div>
    `;
}

function renderAuthPanel() {
    return `
        <section class="auth-panel" aria-label="Authentication">
            <div class="auth-head">
                <div>
                    <div class="pane-kicker">CUHK weak auth</div>
                    <h2>${state.authMode === "login" ? "Login" : "Register"}</h2>
                </div>
                <div class="auth-tabs">
                    <button type="button" class="${state.authMode === "login" ? "is-active" : ""}" data-auth-mode="login">Login</button>
                    <button type="button" class="${state.authMode === "register" ? "is-active" : ""}" data-auth-mode="register">Register</button>
                </div>
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
                <button class="run-button is-full" type="submit">${state.authMode === "login" ? "Login" : "Create account"}</button>
                <div class="inline-notice is-${state.authTone}">${escapeHtml(state.authMessage)}</div>
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
            <div class="model-dialog">
                <div class="model-dialog-head">
                    <div>
                        <div class="pane-kicker">Model settings</div>
                        <h2>${escapeHtml(form.displayName || "Qwen Default")}</h2>
                    </div>
                    <button class="icon-action is-large" type="button" data-action="close-model-settings" aria-label="Close model settings">x</button>
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
                        <button class="secondary-action" type="button" data-action="test-model-settings" ${isBusy ? "disabled" : ""}>Test</button>
                        <button class="run-button" type="submit" ${isBusy ? "disabled" : ""}>${state.model.busy === "save" ? "Saving" : "Save"}</button>
                    </div>
                    <div class="inline-notice is-${state.model.statusTone}">${escapeHtml(state.model.statusMessage)}</div>
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
    document.querySelectorAll("[data-pane]").forEach((button) => {
        button.addEventListener("click", () => {
            state.activePane = button.dataset.pane;
            render();
        });
    });
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
        delete state.fieldErrors.task_text;
        refreshLocalContext();
        updateContextDial();
    });
    document.getElementById("refinement-text")?.addEventListener("input", (event) => {
        state.refinementText = event.target.value;
        refreshLocalContext();
        updateContextDial();
    });
    document.querySelectorAll("[data-intent]").forEach((button) => {
        button.addEventListener("click", () => {
            state.intent = button.dataset.intent;
            state.previewTab = "primary";
            state.fieldErrors = {};
            normalizeActiveFile();
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
    document.querySelectorAll("[data-output-preference]").forEach((button) => {
        button.addEventListener("click", () => {
            state.outputPreference = button.dataset.outputPreference;
            normalizeActiveFile();
            refreshLocalContext();
            render();
        });
    });
    document.getElementById("target-pages")?.addEventListener("input", (event) => {
        const value = Number(event.target.value);
        state.targetPages = Number.isFinite(value) && value > 0 ? Math.round(value) : 1;
        delete state.fieldErrors.target_pages;
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
        addLocalFiles(Array.from(event.target.files || []));
        render();
    });
    document.querySelectorAll("[data-remove-file]").forEach((button) => {
        button.addEventListener("click", () => {
            state.files = state.files.filter((file) => file.key !== button.dataset.removeFile);
            refreshLocalContext();
            render();
        });
    });
    document.querySelector("[data-action='run']")?.addEventListener("click", () => handleRun({ isRevision: false }));
    document.querySelector("[data-action='run-refinement']")?.addEventListener("click", () => handleRun({ isRevision: true }));
    document.querySelector("[data-action='regenerate']")?.addEventListener("click", () => handleRun({ isRevision: false, isRegenerate: true }));
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
    document.querySelectorAll("[data-preview-tab]").forEach((button) => {
        button.addEventListener("click", () => {
            state.previewTab = button.dataset.previewTab;
            render();
        });
    });
    document.querySelectorAll("[data-active-file]").forEach((button) => {
        button.addEventListener("click", () => {
            state.activeFile = button.dataset.activeFile;
            render();
        });
    });
    document.querySelector("[data-action='copy-visible-preview']")?.addEventListener("click", copyVisiblePreview);
    document.querySelector("[data-action='copy-current-path']")?.addEventListener("click", () => copyText(state.run.outputRoot || "", "Run folder path copied."));
    document.querySelector("[data-action='reveal-run']")?.addEventListener("click", revealRunFolder);
    document.querySelectorAll("[data-copy-file]").forEach((button) => {
        button.addEventListener("click", () => copyText(button.dataset.copyFile || "", "Artifact path copied."));
    });
    document.querySelectorAll("[data-open-file]").forEach((button) => {
        button.addEventListener("click", () => openLocalPath(button.dataset.openFile || ""));
    });
    document.onkeydown = handleGlobalKeydown;
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
        if (!response.ok) throw new Error(errorMessage(data, "Authentication failed."));
        if (state.authMode === "register") {
            state.authMode = "login";
            state.authMessage = "Account created. Login is ready.";
            state.authTone = "success";
            render();
            return;
        }
        setUser({ email: data.email, role: data.role }, data.token);
    } catch (error) {
        state.authMessage = safeDisplayMessage(error.message);
        state.authTone = "error";
        render();
    }
}

async function handleRun({ isRevision, isRegenerate = false }) {
    if (!state.user || !state.token) return;
    const promptText = isRevision ? state.refinementText.trim() : state.taskText.trim();
    const revisionOfRunId = isRevision ? state.run.id : null;

    if (!promptText) {
        state.fieldErrors.task_text = isRevision ? "" : "Required";
        state.run = {
            ...initialRunState(),
            status: "idle",
            stage: "validate_request",
            message: isRevision ? "Add a follow-up request before starting a revision." : "Add a task brief before running.",
        };
        render();
        return;
    }

    stopRunPolling();
    refreshLocalContext();
    state.fieldErrors = {};
    state.notice = { message: "", tone: "neutral" };
    state.run = {
        ...initialRunState(),
        status: "queued",
        stage: state.files.some((file) => !file.uploadId) ? "upload_inputs" : "submit_run",
        message: state.files.some((file) => !file.uploadId) ? "Preparing reference uploads." : "Submitting run to local backend.",
        revisionOfRunId,
    };
    addHistory({
        kind: isRevision ? "revision" : "command",
        status: "queued",
        title: isRevision ? "Follow-up request" : isRegenerate ? "Regenerate request" : "Generation request",
        message: promptText,
        meta: `${getSelectedIntent().label} / search ${state.searchMode}`,
    });
    state.activePane = "preview";
    render();

    try {
        const uploadIds = await uploadFilesIfNeeded();
        state.run = { ...state.run, stage: "submit_run", message: "Submitting run to local backend." };
        render();
        const response = await fetch(`${API_URL}/api/runs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.token}`,
            },
            body: JSON.stringify(buildRunPayload({ promptText, uploadIds, revisionOfRunId })),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            applyRunApiError(data, "Run request failed.");
            render();
            return;
        }
        applyRunPayload(data);
        upsertRunHistory();
        if (isRevision) state.refinementText = "";
        render();
        if (data.id) {
            await pollRunEvent(data.id);
            if (!TERMINAL_RUN_STATUSES.has(state.run.status)) startRunPolling(data.id);
        }
    } catch (error) {
        state.run = {
            ...state.run,
            status: "failed",
            stage: state.run.stage || "submit_run",
            message: "Run request failed.",
            error: safeDisplayMessage(error.message),
            errorCode: "frontend_request_failed",
        };
        upsertRunHistory();
        render();
    }
}

async function uploadFilesIfNeeded() {
    const pending = state.files.filter((file) => !file.uploadId);
    if (!pending.length) return state.files.map((file) => file.uploadId).filter(Boolean);

    pending.forEach((file) => {
        file.status = "uploading";
    });
    render();

    const formData = new FormData();
    pending.forEach((item) => formData.append("files", item.file, item.name));
    const response = await fetch(`${API_URL}/api/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${state.token}` },
        body: formData,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        pending.forEach((file) => {
            file.status = "failed";
        });
        const fallback = response.status === 404
            ? "Upload API is unavailable in this backend build."
            : "Upload failed.";
        throw new Error(errorMessage(data, fallback));
    }

    const uploads = Array.isArray(data.uploads) ? data.uploads : [];
    pending.forEach((file, index) => {
        const upload = uploads[index];
        file.uploadId = upload?.id || "";
        file.status = file.uploadId ? "uploaded" : "failed";
    });
    if (pending.some((file) => !file.uploadId)) {
        throw new Error("Upload response did not include every upload id.");
    }
    return state.files.map((file) => file.uploadId).filter(Boolean);
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
    state.model.statusMessage = state.model.profile ? "Saved profile loaded." : "Local defaults loaded.";
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
    if (event.key === "Escape" && state.model.editorOpen) closeModelSettings();
}

async function loadModelProfiles() {
    if (!state.token) return;
    try {
        const response = await fetch(`${API_URL}/api/settings/model-profiles`, {
            headers: { Authorization: `Bearer ${state.token}` },
        });
        const data = await response.json().catch(() => []);
        if (!response.ok) throw new Error(errorMessage(data, "Model profile load failed."));
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
        state.model.statusMessage = safeDisplayMessage(error.message);
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
        state.model.statusMessage = safeDisplayMessage(error.message);
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
        state.model.statusMessage = safeDisplayMessage(error.message);
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
    if (includeApiKey && form.apiKey.trim()) payload.api_key = form.apiKey.trim();
    return payload;
}

function applyModelApiError(data, fallback) {
    const error = data?.error || {};
    state.model.statusMessage = error.code
        ? `${error.code}: ${safeDisplayMessage(error.message || fallback)}`
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
        errorCode: "",
        outputRoot: "",
        revisionOfRunId: null,
    };
}

function buildRunPayload({ promptText, uploadIds, revisionOfRunId }) {
    const payload = {
        task_text: promptText,
        intent: state.intent,
        output_preference: outputPreferenceForIntent(state.intent),
        search_mode: state.searchMode,
        model_profile_id: state.model.profile?.id || null,
        upload_ids: uploadIds,
        options: optionsForIntent(state.intent),
    };
    if (revisionOfRunId) payload.revision_of_run_id = revisionOfRunId;
    return payload;
}

function outputPreferenceForIntent(intent) {
    if (intent === "code_homework") return state.outputPreference;
    return "pdf";
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
    return isAuthenticated && state.taskText.trim() && state.run.status !== "queued" && state.run.status !== "running";
}

function applyRunApiError(data, fallback) {
    const error = data?.error || {};
    state.fieldErrors = runFieldErrors(error.fields || []);
    state.run = {
        ...state.run,
        status: "failed",
        stage: "submit_run",
        message: "Run request failed.",
        error: errorMessage(data, fallback),
        errorCode: String(error.code || "request_failed"),
    };
    upsertRunHistory();
}

function runFieldErrors(fields) {
    return fields.reduce((errors, field) => {
        if (field.field === "task_text") errors.task_text = fieldErrorText(field.rule);
        if (field.field === "options.target_pages") errors.target_pages = fieldErrorText(field.rule);
        if (field.field === "output_preference") errors.output_preference = fieldErrorText(field.rule);
        return errors;
    }, {});
}

function applyRunPayload(payload) {
    if (payload.context) state.context = normalizeContextEstimate(payload.context, "backend");
    state.run = {
        ...state.run,
        id: payload.id || payload.run_id || state.run.id || "",
        status: payload.status || state.run.status,
        stage: payload.stage || state.run.stage || "queued",
        message: runMessageFromPayload(payload),
        error: errorFromPayload(payload),
        errorCode: errorCodeFromPayload(payload),
        outputRoot: payload.output_root || state.run.outputRoot || "",
    };
}

function runMessageFromPayload(payload) {
    if (payload.message) return safeDisplayMessage(payload.message);
    if (payload.error?.message) return safeDisplayMessage(payload.error.message);
    if (payload.error_message) return safeDisplayMessage(payload.error_message);
    if (payload.status === "succeeded") return "Run succeeded.";
    if (payload.status === "failed") return "Run failed.";
    if (payload.status === "running") return "Run is running.";
    return "Run queued.";
}

function errorFromPayload(payload) {
    if (payload.error?.message) return safeDisplayMessage(payload.error.message);
    if (payload.status === "failed" && payload.error_message) return safeDisplayMessage(payload.error_message);
    return null;
}

function errorCodeFromPayload(payload) {
    if (payload.error?.code) return String(payload.error.code);
    if (payload.status === "failed" && typeof payload.error_message === "string") {
        return payload.error_message.split(":")[0] || "run_failed";
    }
    return "";
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
                error: safeDisplayMessage(error.message),
                errorCode: "status_refresh_failed",
            };
            upsertRunHistory();
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
    if (!response.ok) throw new Error(errorMessage(data, "Run status refresh failed."));
    applyRunPayload(data);
    upsertRunHistory();
    render();
    if (TERMINAL_RUN_STATUSES.has(state.run.status)) stopRunPolling();
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
    const fileBytes = state.files.reduce((total, item) => total + Number(item.size || 0), 0);
    const promptText = `${state.taskText}\n${state.refinementText}`.trim();
    const estimatedInput = Math.max(1, Math.ceil((promptText.length + Math.min(fileBytes, 200000)) / 4));
    const outputBase = selected.id === "cheat_sheet"
        ? Math.max(5000, state.targetPages * 1800)
        : selected.id === "beamer_slides"
            ? 7000
            : selected.id === "essay_latex"
                ? 6000
                : state.outputPreference === "ipynb"
                    ? 5200
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

function addLocalFiles(files) {
    const existingKeys = new Set(state.files.map((file) => file.key));
    const additions = files.map((file) => ({
        key: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        name: file.name,
        size: file.size,
        status: "pending",
        uploadId: "",
    })).filter((file) => !existingKeys.has(file.key));
    state.files = [...state.files, ...additions];
    state.notice = additions.length
        ? { message: "Files will upload before the next run.", tone: "neutral" }
        : { message: "Those files are already selected.", tone: "neutral" };
    refreshLocalContext();
}

function addHistory(entry) {
    state.history.push({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        timestamp: new Date().toISOString(),
        ...entry,
    });
}

function upsertRunHistory() {
    if (!state.run.id) return;
    const id = `run-${state.run.id}`;
    const existing = state.history.find((item) => item.id === id);
    const entry = {
        id,
        kind: "run",
        status: state.run.status,
        title: `Run ${shortRunId(state.run.id)}`,
        message: state.run.error || state.run.message,
        meta: `${stageLabel(state.run.stage)} / ${state.run.outputRoot ? truncatePath(state.run.outputRoot) : "folder pending"}`,
        timestamp: new Date().toISOString(),
    };
    if (existing) Object.assign(existing, entry);
    else state.history.push(entry);
}

function getSelectedIntent() {
    return intents.find((intent) => intent.id === state.intent) || intents[0];
}

function normalizeActiveFile() {
    const files = getCodeFiles();
    if (!files.includes(state.activeFile)) state.activeFile = files[0];
}

function getCodeFiles() {
    if (state.outputPreference === "ipynb") return ["solution.ipynb"];
    return ["solution.py", "tests.py", "README.md"];
}

function getPreviewTabs() {
    return [
        { id: "primary", label: state.intent === "code_homework" ? "Code" : "Rendered" },
        { id: "source", label: state.intent === "code_homework" ? "Source" : "LaTeX" },
        { id: "logs", label: "Logs" },
        { id: "manifest", label: "Manifest" },
    ];
}

function getExpectedFiles() {
    if (state.intent === "code_homework") {
        const main = state.outputPreference === "ipynb"
            ? { name: "solution.ipynb", relativePath: "output/solution.ipynb", kind: "notebook", badge: "NB", readyLabel: "notebook output", pendingLabel: "pending" }
            : { name: "solution.py", relativePath: "output/solution.py", kind: "script", badge: "PY", readyLabel: "script output", pendingLabel: "pending" };
        return [
            main,
            { name: "generation.log", relativePath: "logs/generation.log", kind: "log", badge: "LOG", readyLabel: "run log", pendingLabel: "pending" },
            { name: "manifest.json", relativePath: "manifest.json", kind: "manifest", badge: "JS", readyLabel: "metadata", pendingLabel: "pending" },
        ];
    }
    if (state.intent === "essay_latex") {
        return [
            { name: "main.pdf", relativePath: "output/main.pdf", kind: "pdf", badge: "PDF", readyLabel: "compiled PDF", pendingLabel: "compile pending" },
            { name: "main.tex", relativePath: "output/main.tex", kind: "source", badge: "TEX", readyLabel: "source preserved", pendingLabel: "pending" },
            { name: "latex.log", relativePath: "logs/latex.log", kind: "log", badge: "LOG", readyLabel: "compile log", pendingLabel: "pending" },
            { name: "manifest.json", relativePath: "manifest.json", kind: "manifest", badge: "JS", readyLabel: "metadata", pendingLabel: "pending" },
        ];
    }
    if (state.intent === "beamer_slides") {
        return [
            { name: "slides.pdf", relativePath: "output/slides.pdf", kind: "pdf", badge: "PDF", readyLabel: "compiled deck", pendingLabel: "compile pending" },
            { name: "slides.tex", relativePath: "output/slides.tex", kind: "source", badge: "TEX", readyLabel: "source preserved", pendingLabel: "pending" },
            { name: "latex.log", relativePath: "logs/latex.log", kind: "log", badge: "LOG", readyLabel: "compile log", pendingLabel: "pending" },
            { name: "manifest.json", relativePath: "manifest.json", kind: "manifest", badge: "JS", readyLabel: "metadata", pendingLabel: "pending" },
        ];
    }
    return [
        { name: "cheat-sheet.pdf", relativePath: "output/cheat-sheet.pdf", kind: "pdf", badge: "PDF", readyLabel: "compiled sheet", pendingLabel: "compile pending" },
        { name: "cheat-sheet.tex", relativePath: "output/cheat-sheet.tex", kind: "source", badge: "TEX", readyLabel: "source preserved", pendingLabel: "pending" },
        { name: "latex.log", relativePath: "logs/latex.log", kind: "log", badge: "LOG", readyLabel: "compile log", pendingLabel: "pending" },
        { name: "manifest.json", relativePath: "manifest.json", kind: "manifest", badge: "JS", readyLabel: "metadata", pendingLabel: "pending" },
    ];
}

function sourceFilenameForIntent() {
    if (state.intent === "code_homework") return state.outputPreference === "ipynb" ? "solution.ipynb" : "solution.py";
    if (state.intent === "beamer_slides") return "slides.tex";
    if (state.intent === "cheat_sheet") return "cheat-sheet.tex";
    return "main.tex";
}

function codePreviewText(filename) {
    if (filename === "tests.py") {
        return `from solution import solve\n\n\ndef test_sample_case():\n    assert solve([2, 4, 6]) == 12\n`;
    }
    if (filename === "README.md") {
        return `# Solution Notes\n\n- Parse the assignment input explicitly.\n- Keep edge cases near the solver.\n- Include complexity in the final answer.\n`;
    }
    return `from __future__ import annotations\n\n\ndef solve(values: list[int]) -> int:\n    \"\"\"Return the requested aggregate for the homework task.\"\"\"\n    total = 0\n    for value in values:\n        if value < 0:\n            continue\n        total += value\n    return total\n\n\nif __name__ == \"__main__\":\n    print(solve([1, 2, 3]))\n`;
}

function notebookCodeText() {
    return `def solve(values):\n    total = 0\n    for value in values:\n        total += value\n    return total\n\nsolve([1, 2, 3])`;
}

function sourcePreviewText() {
    if (state.intent === "code_homework") return codePreviewText("solution.py");
    if (state.intent === "beamer_slides") {
        return `\\documentclass{beamer}\n\\title{${briefTitle("Generated Slides")}}\n\\begin{document}\n\\begin{frame}{Overview}\n  \\begin{itemize}\n    \\item Motivation\n    \\item Method\n    \\item Result\n  \\end{itemize}\n\\end{frame}\n\\end{document}\n`;
    }
    if (state.intent === "cheat_sheet") {
        return `\\documentclass[a4paper]{article}\n\\usepackage[margin=0.45cm]{geometry}\n\\usepackage{multicol}\n\\begin{document}\n\\begin{multicols}{4}\n\\section*{Dense Review}\nKey definitions, formulas, and proof templates.\n\\end{multicols}\n\\end{document}\n`;
    }
    return `\\documentclass{article}\n\\title{${briefTitle("Generated Essay")}}\n\\begin{document}\n\\maketitle\n\\section{Introduction}\nThe generated source is preserved even if PDF compilation fails.\n\\section{Discussion}\nEvidence and citations are recorded in the run manifest.\n\\end{document}\n`;
}

function renderHighlightedCode(text, language = "python") {
    const lines = String(text).replace(/\s+$/u, "").split("\n");
    return `
        <ol class="code-lines">
            ${lines.map((line, index) => `
                <li>
                    <span class="line-no">${index + 1}</span>
                    <code>${highlightLine(line, language)}</code>
                </li>
            `).join("")}
        </ol>
    `;
}

function highlightLine(line, language) {
    if (language === "json") return highlightJson(line);
    if (language === "latex") return highlightLatex(line);
    return highlightPython(line);
}

function highlightPython(line) {
    const tokens = line.match(/#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|./g) || [];
    const keywords = new Set(["def", "class", "from", "import", "for", "if", "else", "elif", "return", "continue", "in", "as", "print", "with", "try", "except", "raise", "while", "True", "False", "None"]);
    return tokens.map((token, index) => {
        if (token.startsWith("#")) return `<span class="syntax-comment">${escapeHtml(token)}</span>`;
        if (token.startsWith("\"") || token.startsWith("'")) return `<span class="syntax-string">${escapeHtml(token)}</span>`;
        if (/^\d+$/u.test(token)) return `<span class="syntax-number">${escapeHtml(token)}</span>`;
        if (keywords.has(token)) return `<span class="syntax-keyword">${escapeHtml(token)}</span>`;
        if (/^[A-Za-z_][A-Za-z0-9_]*$/u.test(token) && nextNonSpaceToken(tokens, index) === "(") {
            return `<span class="syntax-function">${escapeHtml(token)}</span>`;
        }
        return escapeHtml(token);
    }).join("") || " ";
}

function highlightJson(line) {
    const tokens = line.match(/"(?:\\.|[^"\\])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?|\s+|./g) || [];
    return tokens.map((token, index) => {
        if (token.startsWith("\"")) {
            const cls = nextNonSpaceToken(tokens, index) === ":" ? "syntax-keyword" : "syntax-string";
            return `<span class="${cls}">${escapeHtml(token)}</span>`;
        }
        if (/^(true|false|null)$/u.test(token)) return `<span class="syntax-keyword">${escapeHtml(token)}</span>`;
        if (/^-?\d+(?:\.\d+)?$/u.test(token)) return `<span class="syntax-number">${escapeHtml(token)}</span>`;
        return escapeHtml(token);
    }).join("") || " ";
}

function highlightLatex(line) {
    const tokens = line.match(/%.*$|\\[A-Za-z*]+|\{[^}]*\}|\s+|./g) || [];
    return tokens.map((token) => {
        if (token.startsWith("%")) return `<span class="syntax-comment">${escapeHtml(token)}</span>`;
        if (token.startsWith("\\")) return `<span class="syntax-keyword">${escapeHtml(token)}</span>`;
        if (token.startsWith("{") && token.endsWith("}")) return `<span class="syntax-string">${escapeHtml(token)}</span>`;
        return escapeHtml(token);
    }).join("") || " ";
}

function nextNonSpaceToken(tokens, index) {
    for (let cursor = index + 1; cursor < tokens.length; cursor += 1) {
        if (!/^\s+$/u.test(tokens[cursor])) return tokens[cursor];
    }
    return "";
}

async function copyVisiblePreview() {
    const text = state.previewTab === "logs"
        ? `${stageLabel(state.run.stage)}: ${state.run.message}`
        : state.previewTab === "manifest"
            ? JSON.stringify({
                run_id: state.run.id || null,
                intent: state.intent,
                status: state.run.status,
                outputs: getExpectedFiles().map((file) => file.relativePath),
            }, null, 2)
            : state.previewTab === "source"
                ? sourcePreviewText()
                : state.intent === "code_homework"
                    ? state.outputPreference === "ipynb" ? notebookCodeText() : codePreviewText(state.activeFile)
                    : state.run.outputRoot || artifactAccessNote();
    await copyText(text, "Visible preview copied.");
}

async function copyText(text, message) {
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
        state.notice = { message, tone: "success" };
    } catch {
        state.notice = { message: "Clipboard is not available in this browser context.", tone: "error" };
    }
    render();
}

function revealRunFolder() {
    if (!state.run.outputRoot) return;
    copyText(state.run.outputRoot, "Run folder path copied for reveal.");
}

function openLocalPath(path) {
    if (!path) return;
    const url = path.startsWith("file://") ? path : `file://${path}`;
    window.open(url, "_blank", "noopener,noreferrer");
}

function artifactAbsolutePath(relativePath) {
    if (!state.run.outputRoot) return "";
    return `${state.run.outputRoot.replace(/\/$/u, "")}/${relativePath}`;
}

function artifactAccessNote() {
    if (state.run.outputRoot) return "Artifact bytes are in the run folder; browser byte rendering awaits an artifact file endpoint.";
    return "Run folder appears after a run is accepted by the backend.";
}

function runButtonLabel() {
    if (state.run.status === "queued" || state.run.status === "running") return "Running";
    if (state.run.status === "failed") return "Run again";
    return "Run artifact";
}

function runNote(isAuthenticated) {
    if (!isAuthenticated) return "Login activates generation controls.";
    if (!state.taskText.trim()) return "Add a task brief to enable generation.";
    if (state.files.some((file) => !file.uploadId)) return "Selected files upload before run creation.";
    if (state.run.status === "queued" || state.run.status === "running") return "Context and stage events update as the backend reports.";
    return "Ready for a local generation run.";
}

function codeStatusTitle() {
    if (state.run.status === "failed") return "Validation issue";
    if (state.run.status === "succeeded") return "Artifact ready";
    if (state.run.status === "queued" || state.run.status === "running") return "Generating";
    return "Renderer armed";
}

function codeStatusDetail() {
    if (state.run.status === "failed") return state.run.errorCode || "source preserved if available";
    if (state.run.status === "succeeded") return state.run.outputRoot ? "copy/open paths available" : "completed";
    if (state.run.status === "queued" || state.run.status === "running") return stageLabel(state.run.stage);
    return "syntax preview, no execution";
}

function normalizedStageBucket(stage, status) {
    if (status === "queued") return "route";
    if (status === "succeeded") {
        if (state.intent === "code_homework") return "validate";
        return "compile";
    }
    if (stage?.includes("context") || stage?.includes("upload")) return state.intent === "cheat_sheet" ? "ingest" : "context";
    if (stage?.includes("search") || stage?.includes("route")) return "route";
    if (stage?.includes("compile")) return "compile";
    if (stage?.includes("validate")) return "validate";
    if (stage?.includes("outline")) return "outline";
    if (stage?.includes("layout")) return "layout";
    if (stage?.includes("compress")) return "compress";
    if (stage?.includes("generate") || stage?.includes("source")) return state.intent === "beamer_slides" ? "write" : "generate";
    return getSelectedIntent().stages[0];
}

function stageLabel(stage) {
    return stageVocabulary[stage] || String(stage || "compose").replaceAll("_", " ");
}

function uploadStatusLabel(item) {
    if (item.status === "uploaded") return "uploaded";
    if (item.status === "uploading") return "uploading";
    if (item.status === "failed") return "upload failed";
    return formatBytes(item.size);
}

function fileKind(filename) {
    const ext = String(filename).split(".").pop()?.slice(0, 3).toUpperCase();
    return ext || "FILE";
}

function readStoredUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
        return null;
    }
}

function errorMessage(data, fallback) {
    const message = data?.error?.message || (typeof data?.detail === "string" ? data.detail : "") || (typeof data?.message === "string" ? data.message : "") || fallback;
    const code = data?.error?.code ? `${data.error.code}: ` : "";
    return safeDisplayMessage(`${code}${message}`);
}

function safeDisplayMessage(message) {
    return String(message || "")
        .replace(/sk-[A-Za-z0-9_-]+/g, "[redacted-key]")
        .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted-token]")
        .replace(/api[_-]?key["'\s:=]+[A-Za-z0-9._-]+/gi, "api_key [redacted]")
        .split("\n")
        .filter((line) => !/\s+at\s+/.test(line) && !/Traceback/.test(line))
        .slice(0, 3)
        .join(" ")
        .trim();
}

function formatInt(value) {
    return Number(value || 0).toLocaleString();
}

function formatPercent(value) {
    return `${Math.round(Number(value || 0) * 100)}%`;
}

function formatBytes(value) {
    const bytes = Number(value || 0);
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${bytes} B`;
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
    return `${formatPercent(estimate.utilization_ratio)} of context`;
}

function contextAriaLabel(estimate) {
    return `Context budget ${contextStateLabel(estimate.warning_level)}, ${formatPercent(estimate.utilization_ratio)} utilized, ${contextSourceLabel(estimate.source)}`;
}

function briefTitle(fallback) {
    const firstLine = state.taskText.trim().split("\n").find(Boolean) || "";
    const cleaned = firstLine.replace(/[^\w\s:,-]/g, "").trim();
    if (!cleaned) return fallback;
    return cleaned.length > 52 ? `${cleaned.slice(0, 49)}...` : cleaned;
}

function shortRunId(runId) {
    return String(runId || "").slice(0, 8) || "pending";
}

function formatHistoryTime(timestamp) {
    try {
        return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(timestamp));
    } catch {
        return "";
    }
}

function timestampLabel() {
    return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
}

function truncatePath(path) {
    const text = String(path || "");
    if (text.length <= 46) return text;
    return `...${text.slice(-43)}`;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
