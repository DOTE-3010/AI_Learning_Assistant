import assert from "node:assert/strict";
import { test } from "node:test";

import { LOCALES, messages } from "../src/locales.js";
import {
    DEFAULT_MODEL_PROFILE,
    applyWorkbenchInteraction,
    buildRunRequest,
    canSubmitRun,
    normalizeActiveCodeFile,
    optionsForIntent,
    outputPreferenceForIntent,
} from "../src/workbench-core.js";

const requiredLocaleKeys = [
    "app.title",
    "actions.runArtifact",
    "controls.artifactType",
    "controls.searchMode.auto",
    "intents.code_homework.label",
    "intents.essay_latex.label",
    "intents.beamer_slides.label",
    "intents.cheat_sheet.label",
    "preview.tabs.manifest",
    "preview.stageProgress",
    "preview.sourceTitle",
    "preview.logsTitle",
    "preview.manifestTitle",
    "stages.repair_source",
    "model.defaultHelp",
    "model.provider",
    "model.contextWindow",
    "model.streaming",
    "context.warningLabel",
];

test("locale catalogs include the required workbench keys", () => {
    for (const locale of LOCALES) {
        for (const key of requiredLocaleKeys) {
            assert.equal(typeof messageAt(messages[locale.id], key), "string", `${locale.id}:${key}`);
            assert.notEqual(messageAt(messages[locale.id], key).trim(), "", `${locale.id}:${key}`);
        }
    }
});

test("artifact interactions reset preview state and normalize controls", () => {
    let state = {
        intent: "code_homework",
        previewTab: "logs",
        fieldErrors: { task_text: "required" },
        activeFile: "README.md",
        outputPreference: "py",
        searchMode: "auto",
        targetPages: 2,
    };

    state = applyWorkbenchInteraction(state, { type: "selectIntent", intent: "cheat_sheet" });
    assert.equal(state.intent, "cheat_sheet");
    assert.equal(state.previewTab, "primary");
    assert.deepEqual(state.fieldErrors, {});

    state = applyWorkbenchInteraction(state, { type: "selectSearchMode", searchMode: "manual" });
    assert.equal(state.searchMode, "auto");

    state = applyWorkbenchInteraction(state, { type: "selectOutputPreference", outputPreference: "ipynb" });
    assert.equal(state.outputPreference, "ipynb");
    assert.equal(state.activeFile, "solution.ipynb");

    state = applyWorkbenchInteraction(state, { type: "setTargetPages", targetPages: "3.6" });
    assert.equal(state.targetPages, 4);
});

test("run payload builder preserves backend contract fields", () => {
    const cheatSheet = buildRunRequest({
        promptText: "Compress these lecture slides.",
        intent: "cheat_sheet",
        outputPreference: "ipynb",
        searchMode: "on",
        modelProfileId: "default-qwen",
        uploadIds: ["upl_1", "", "upl_2"],
        targetPages: 2,
    });

    assert.deepEqual(cheatSheet, {
        task_text: "Compress these lecture slides.",
        intent: "cheat_sheet",
        output_preference: "pdf",
        search_mode: "on",
        model_profile_id: "default-qwen",
        upload_ids: ["upl_1", "upl_2"],
        options: { target_pages: 2, paper_size: "A4", density: "dense" },
    });

    const revision = buildRunRequest({
        promptText: "Add comments to the solution.",
        intent: "code_homework",
        outputPreference: "ipynb",
        searchMode: "off",
        revisionOfRunId: "run_prior",
    });

    assert.equal(revision.output_preference, "ipynb");
    assert.equal(revision.revision_of_run_id, "run_prior");
    assert.deepEqual(revision.options, {});
});

test("default Qwen profile only omits the API key", () => {
    assert.equal(DEFAULT_MODEL_PROFILE.provider, "openai_compatible");
    assert.equal(DEFAULT_MODEL_PROFILE.baseUrl, "https://dashscope.aliyuncs.com/compatible-mode/v1");
    assert.equal(DEFAULT_MODEL_PROFILE.model, "qwen-plus");
    assert.equal(DEFAULT_MODEL_PROFILE.contextWindowHint, 1000000);
    assert.equal(DEFAULT_MODEL_PROFILE.supportsStreaming, true);
    assert.equal(Object.hasOwn(DEFAULT_MODEL_PROFILE, "apiKey"), false);
});

test("submission and artifact helpers match workbench expectations", () => {
    assert.equal(canSubmitRun({
        isAuthenticated: true,
        taskText: "Write the answer.",
        runStatus: "idle",
    }), true);
    assert.equal(canSubmitRun({
        isAuthenticated: true,
        taskText: "Write the answer.",
        runStatus: "running",
    }), false);
    assert.equal(canSubmitRun({
        isAuthenticated: false,
        taskText: "Write the answer.",
        runStatus: "idle",
    }), false);

    assert.equal(outputPreferenceForIntent("essay_latex", "ipynb"), "pdf");
    assert.equal(outputPreferenceForIntent("code_homework", "ipynb"), "ipynb");
    assert.deepEqual(optionsForIntent("cheat_sheet", 0), {
        target_pages: 1,
        paper_size: "A4",
        density: "dense",
    });
    assert.equal(normalizeActiveCodeFile("py", "solution.ipynb"), "solution.py");
});

function messageAt(catalog, path) {
    return path.split(".").reduce((value, segment) => value?.[segment], catalog);
}
