export const ARTIFACT_INTENTS = Object.freeze([
    "code_homework",
    "essay_latex",
    "beamer_slides",
    "cheat_sheet",
]);

export const SEARCH_MODES = Object.freeze(["auto", "on", "off"]);

export const UPLOAD_ACCEPT_ATTRIBUTE = ".txt,.md,.py,.ipynb,.pdf,text/plain,text/markdown,text/x-python,application/json,application/pdf";

export const DEFAULT_MODEL_PROFILE = Object.freeze({
    displayName: "Qwen Default",
    provider: "openai_compatible",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-plus",
    contextWindowHint: 1000000,
    supportsStreaming: true,
});

export function applyWorkbenchInteraction(currentState, action) {
    const next = { ...currentState };
    if (action.type === "selectIntent") {
        next.intent = normalizeIntent(action.intent);
        next.previewTab = "primary";
        next.fieldErrors = {};
        next.activeFile = normalizeActiveCodeFile(next.outputPreference, next.activeFile);
    }
    if (action.type === "selectSearchMode") {
        next.searchMode = normalizeSearchMode(action.searchMode);
    }
    if (action.type === "selectOutputPreference") {
        next.outputPreference = normalizeCodeOutputPreference(action.outputPreference);
        next.activeFile = normalizeActiveCodeFile(next.outputPreference, next.activeFile);
    }
    if (action.type === "setTargetPages") {
        next.targetPages = normalizeTargetPages(action.targetPages);
        next.fieldErrors = { ...(next.fieldErrors || {}) };
        delete next.fieldErrors.target_pages;
    }
    return next;
}

export function normalizeIntent(intent) {
    return ARTIFACT_INTENTS.includes(intent) ? intent : "code_homework";
}

export function normalizeSearchMode(mode) {
    return SEARCH_MODES.includes(mode) ? mode : "auto";
}

export function normalizeCodeOutputPreference(preference) {
    return preference === "ipynb" ? "ipynb" : "py";
}

export function normalizeTargetPages(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return 1;
    return Math.round(number);
}

export function normalizeActiveCodeFile(outputPreference, activeFile) {
    const files = outputPreference === "ipynb"
        ? ["solution.ipynb"]
        : ["solution.py", "tests.py", "README.md"];
    return files.includes(activeFile) ? activeFile : files[0];
}

export function canSubmitRun({ isAuthenticated, taskText, runStatus }) {
    return Boolean(
        isAuthenticated
        && String(taskText || "").trim()
        && !isActiveRunStatus(runStatus)
    );
}

export function isActiveRunStatus(runStatus) {
    return runStatus === "queued" || runStatus === "running";
}

export function outputPreferenceForIntent(intent, codeOutputPreference) {
    if (normalizeIntent(intent) === "code_homework") {
        return normalizeCodeOutputPreference(codeOutputPreference);
    }
    return "pdf";
}

export function optionsForIntent(intent, targetPages) {
    if (normalizeIntent(intent) !== "cheat_sheet") return {};
    return {
        target_pages: normalizeTargetPages(targetPages),
        paper_size: "A4",
        density: "dense",
    };
}

export function buildRunRequest({
    promptText,
    intent,
    outputPreference,
    searchMode,
    modelProfileId = null,
    uploadIds = [],
    targetPages = 1,
    revisionOfRunId = null,
}) {
    const normalizedIntent = normalizeIntent(intent);
    const payload = {
        task_text: String(promptText || ""),
        intent: normalizedIntent,
        output_preference: outputPreferenceForIntent(normalizedIntent, outputPreference),
        search_mode: normalizeSearchMode(searchMode),
        model_profile_id: modelProfileId || null,
        upload_ids: Array.isArray(uploadIds) ? uploadIds.filter(Boolean) : [],
        options: optionsForIntent(normalizedIntent, targetPages),
    };
    if (revisionOfRunId) payload.revision_of_run_id = revisionOfRunId;
    return payload;
}
