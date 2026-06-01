(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function a(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=a(o);fetch(o.href,i)}})();const v=window.__AI_LEARNING_ASSISTANT_API_URL||window.location.origin,D="ai_learning_assistant_token",B="ai_learning_assistant_user",h=128e3,me=1200,G=new Set(["succeeded","failed","cancelled"]),m={displayName:"Qwen Default",provider:"openai_compatible",baseUrl:"https://example-compatible-endpoint/v1",model:"qwen-model-name",apiKey:""},O=[{id:"code_homework",label:"Code",short:"PY",title:"Homework code",description:"Script or notebook answer",outputs:["solution.py","solution.ipynb"],stages:["route","context","generate","validate"],accent:"teal"},{id:"essay_latex",label:"Essay",short:"TEX",title:"LaTeX essay",description:"Source plus compiled PDF",outputs:["main.pdf","main.tex"],stages:["route","context","write","compile"],accent:"blue"},{id:"beamer_slides",label:"Slides",short:"PDF",title:"Beamer deck",description:"Slide source plus PDF",outputs:["slides.pdf","slides.tex"],stages:["route","outline","write","compile"],accent:"amber"},{id:"cheat_sheet",label:"Cheat sheet",short:"A4",title:"Dense A4 sheet",description:"Course compression PDF",outputs:["cheat-sheet.pdf","cheat-sheet.tex"],stages:["ingest","compress","layout","compile"],accent:"coral"}],ge={compose:"Compose",choose_intent:"Select artifact",validate_request:"Validate",upload_inputs:"Upload inputs",submit_run:"Submit run",queued:"Queued",running:"Running",resolve_model:"Model",extract_context:"Context",decide_search:"Search",generate_source:"Generate",validate_source:"Validate",compile_pdf:"Compile PDF",write_manifest:"Manifest",poll_status:"Refresh",output_files:"Output files"},t={authMode:"login",token:localStorage.getItem(D)||"",user:Ft(),activePane:"console",intent:"code_homework",outputPreference:"py",searchMode:"auto",targetPages:2,taskText:"",refinementText:"",files:[],fieldErrors:{},context:null,previewTab:"primary",activeFile:"solution.py",notice:{message:"",tone:"neutral"},model:{editorOpen:!1,profiles:[],profile:null,form:{...m},fieldErrors:{},statusMessage:"",statusTone:"neutral",busy:""},authMessage:"",authTone:"neutral",run:M(),history:[{id:"session-ready",kind:"system",status:"idle",title:"Console ready",message:"Choose an artifact type, add source material, then run.",timestamp:new Date().toISOString()}]},ve=document.getElementById("app");let E=null;he();function he(){f(),N(),l(),t.token&&be()}async function be(){try{const e=await fetch(`${v}/api/auth/me`,{headers:{Authorization:`Bearer ${t.token}`}});if(!e.ok)throw new Error("Session expired");const n=await e.json();W(n,t.token)}catch{H(),l()}}function l(){const e=!!(t.user&&t.token);ve.innerHTML=`
        <div class="studio-app ${e?"":"is-locked"}" data-mobile-pane="${s(t.activePane)}">
            ${ye(e)}
            <main class="studio-main">
                ${$e()}
                <section class="workbench-grid" aria-label="Conversational artifact workbench">
                    ${_e(e)}
                    ${Me(e)}
                </section>
                ${e?"":We()}
                ${e&&t.model.editorOpen?He():""}
            </main>
        </div>
    `,Je(),T()}function ye(e){return`
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
                ${e?`<button class="identity-chip" type="button" data-action="logout">
                            <span>${s(t.user.email)}</span>
                            <strong>${s(t.user.role)}</strong>
                        </button>`:'<span class="identity-chip is-muted">CUHK session required</span>'}
            </div>
        </header>
    `}function $e(){return`
        <nav class="mobile-pane-switch" aria-label="Workbench panes">
            <button type="button" class="${t.activePane==="console"?"is-active":""}" data-pane="console">Console</button>
            <button type="button" class="${t.activePane==="preview"?"is-active":""}" data-pane="preview">Preview</button>
        </nav>
    `}function _e(e){return`
        <section class="console-pane workbench-pane" aria-label="Production console">
            <div class="pane-head">
                <div>
                    <div class="pane-kicker">Production console</div>
                    <h1>Generate artifacts</h1>
                </div>
                <button class="tool-button" type="button" data-action="open-model-settings" ${e?"":"disabled"}>
                    <span class="tool-glyph" aria-hidden="true"></span>
                    <span>${s(Ve())}</span>
                </button>
            </div>

            <div class="console-utility-row">
                ${Ge()}
                ${ke()}
            </div>

            <div class="artifact-type-bar" role="radiogroup" aria-label="Artifact type">
                ${O.map(we).join("")}
            </div>

            <section class="command-composer" aria-label="Generation command">
                <div class="composer-head">
                    <label class="field-label" for="task-text">Brief</label>
                    <span>${s(S().description)}</span>
                </div>
                <textarea
                    id="task-text"
                    class="task-input ${t.fieldErrors.task_text?"has-error":""}"
                    rows="8"
                    placeholder="Paste the assignment brief, constraints, marking expectations, and any output notes."
                >${s(t.taskText)}</textarea>
                ${t.fieldErrors.task_text?`<div class="field-error">${s(t.fieldErrors.task_text)}</div>`:""}
                ${xe()}
                ${Se()}
                <div class="composer-actions">
                    <button class="run-button" type="button" data-action="run" ${V(e)?"":"disabled"}>
                        <span class="run-glyph" aria-hidden="true"></span>
                        <span>${Lt()}</span>
                    </button>
                    <span class="run-note">${s(Tt(e))}</span>
                </div>
            </section>

            ${Ee(e)}
            ${Le()}
        </section>
    `}function we(e){const n=t.intent===e.id;return`
        <button
            type="button"
            class="artifact-type ${n?"is-active":""}"
            data-intent="${e.id}"
            data-accent="${e.accent}"
            role="radio"
            aria-checked="${n}"
        >
            <span class="artifact-short">${s(e.short)}</span>
            <span>
                <strong>${s(e.label)}</strong>
                <small>${s(e.title)}</small>
            </span>
        </button>
    `}function ke(){return`
        <div class="search-control">
            <span class="field-label">Search</span>
            <div class="segmented-control" data-control="search-mode">
                ${["auto","on","off"].map(e=>`
                    <button type="button" class="${t.searchMode===e?"is-active":""}" data-search-mode="${e}">
                        ${e}
                    </button>
                `).join("")}
            </div>
        </div>
    `}function xe(){return t.intent==="code_homework"?`
            <div class="option-row">
                <div>
                    <span class="field-label">Output</span>
                    <div class="segmented-control is-tight" data-control="code-output">
                        <button type="button" class="${t.outputPreference==="py"?"is-active":""}" data-output-preference="py">.py</button>
                        <button type="button" class="${t.outputPreference==="ipynb"?"is-active":""}" data-output-preference="ipynb">.ipynb</button>
                    </div>
                </div>
                <div class="status-capsule">Preview only</div>
            </div>
        `:t.intent==="cheat_sheet"?`
            <div class="option-row">
                <label class="number-field">
                    <span class="field-label">Target pages</span>
                    <input id="target-pages" class="${t.fieldErrors.target_pages?"has-error":""}" type="number" min="1" max="12" value="${t.targetPages}">
                </label>
                <div class="status-capsule">A4</div>
                <div class="status-capsule">Dense</div>
            </div>
            ${t.fieldErrors.target_pages?`<div class="field-error">${s(t.fieldErrors.target_pages)}</div>`:""}
        `:`
        <div class="option-row">
            <div class="status-capsule">PDF first</div>
            <div class="status-capsule">Source kept</div>
        </div>
    `}function Se(){const e=t.files.length?`${t.files.length} reference file${t.files.length===1?"":"s"} selected`:"Drop or choose reference files";return`
        <section class="upload-module" aria-label="Reference files">
            <div class="upload-zone" data-action="open-file-picker" role="button" tabindex="0">
                <input id="file-input" type="file" multiple>
                <span class="upload-mark" aria-hidden="true"></span>
                <div>
                    <strong>Reference files</strong>
                    <span>${s(e)}</span>
                </div>
            </div>
            ${t.files.length?Pe():""}
            ${t.notice.message?`<div class="inline-notice is-${t.notice.tone}">${s(t.notice.message)}</div>`:""}
        </section>
    `}function Pe(){return`
        <div class="selected-files">
            ${t.files.map(e=>`
                <div class="selected-file" data-file-key="${s(e.key)}">
                    <span class="file-kind">${s(Ct(e.name))}</span>
                    <span class="file-name">${s(e.name)}</span>
                    <small>${s(It(e))}</small>
                    <button class="icon-action" type="button" data-remove-file="${s(e.key)}" aria-label="Remove ${s(e.name)}">x</button>
                </div>
            `).join("")}
        </div>
    `}function Ee(e){const n=!e||!t.run.id||t.run.status==="queued"||t.run.status==="running";return`
        <section class="refinement-composer" aria-label="Follow-up refinement">
            <div class="composer-head">
                <label class="field-label" for="refinement-text">Follow-up</label>
                <span>${t.run.id?`Revision source ${ue(t.run.id)}`:"Available after first run"}</span>
            </div>
            <textarea
                id="refinement-text"
                rows="3"
                placeholder="Ask for a tighter proof, more comments, fewer slides, or a different structure."
                ${n?"disabled":""}
            >${s(t.refinementText)}</textarea>
            <div class="composer-actions">
                <button class="secondary-action" type="button" data-action="run-refinement" ${n||!t.refinementText.trim()?"disabled":""}>
                    New revision run
                </button>
                <span class="run-note">Creates a new run; generated files stay source-of-truth on disk.</span>
            </div>
        </section>
    `}function Le(){return`
        <section class="history-stream" aria-label="Run history">
            <div class="history-head">
                <span>Run history</span>
                <small>${t.history.length} entries</small>
            </div>
            <div class="history-list">
                ${t.history.slice().reverse().map(Te).join("")}
            </div>
        </section>
    `}function Te(e){return`
        <article class="history-item is-${s(e.kind)}" data-status="${s(e.status||"idle")}">
            <div class="history-marker"></div>
            <div class="history-content">
                <div class="history-title">
                    <strong>${s(e.title)}</strong>
                    <span>${s(Ot(e.timestamp))}</span>
                </div>
                <p>${s(e.message)}</p>
                ${e.meta?`<div class="history-meta">${s(e.meta)}</div>`:""}
            </div>
        </article>
    `}function Me(e){const n=S();return`
        <section class="preview-pane workbench-pane" aria-label="Artifact preview">
            <div class="preview-header">
                <div>
                    <div class="pane-kicker">Artifact preview</div>
                    <h2>${s(n.title)}</h2>
                </div>
                <div class="preview-actions">
                    <button class="secondary-action" type="button" data-action="copy-current-path" ${t.run.outputRoot?"":"disabled"}>Copy path</button>
                    <button class="secondary-action" type="button" data-action="reveal-run" ${t.run.outputRoot?"":"disabled"}>Reveal</button>
                    <button class="secondary-action" type="button" data-action="regenerate" ${V(e)?"":"disabled"}>Regenerate</button>
                </div>
            </div>

            <div class="preview-status-strip">
                ${Ae()}
                ${Re(n)}
            </div>

            <div class="preview-shell" data-intent="${s(t.intent)}" data-run-status="${s(t.run.status)}">
                ${Ie()}
                <div class="preview-body">
                    ${Ce()}
                </div>
            </div>

            ${Ue()}
        </section>
    `}function Ae(){return`
        <div class="run-status-pill" data-status="${s(t.run.status)}">
            <span class="status-light"></span>
            <div>
                <strong>${s(t.run.status)}</strong>
                <span>${s(b(t.run.stage))}</span>
            </div>
        </div>
        <p class="run-message">${s(t.run.error||t.run.message)}</p>
    `}function Re(e){const n=Rt(t.run.stage,t.run.status);return`
        <div class="stage-track" aria-label="Generation stages">
            ${e.stages.map(a=>`
                <span class="${a===n?"is-active":""}">${s(a)}</span>
            `).join("")}
        </div>
    `}function Ie(){return`
        <div class="preview-tabs" role="tablist" aria-label="Preview tabs">
            ${bt().map(n=>`
                <button type="button" role="tab" class="${t.previewTab===n.id?"is-active":""}" data-preview-tab="${n.id}">
                    ${s(n.label)}
                </button>
            `).join("")}
        </div>
    `}function Ce(){return t.previewTab==="source"?Be():t.previewTab==="logs"?je():t.previewTab==="manifest"?ze():t.intent==="code_homework"?Fe():t.intent==="essay_latex"?Oe():t.intent==="beamer_slides"?Ne():De()}function Fe(){return t.outputPreference==="ipynb"?qe():`
        <div class="code-product">
            <div class="code-tabs">
                ${se().map(n=>`
                    <button type="button" class="${t.activeFile===n?"is-active":""}" data-active-file="${s(n)}">
                        ${s(n)}
                    </button>
                `).join("")}
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">Copy visible</button>
            </div>
            <div class="code-editor" aria-label="Syntax highlighted code preview">
                ${I(K(t.activeFile))}
            </div>
            <div class="terminal-strip" data-status="${s(t.run.status)}">
                <span>${s(Mt())}</span>
                <strong>${s(At())}</strong>
            </div>
        </div>
    `}function qe(){return`
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
                <div class="code-editor is-compact">${I(re())}</div>
            </div>
            <div class="terminal-strip" data-status="${s(t.run.status)}">
                <span>Notebook validation</span>
                <strong>${t.run.status==="failed"?"Preserved for inspection":"Preview-only, no execution"}</strong>
            </div>
        </div>
    `}function Oe(){return`
        <div class="pdf-stage">
            <div class="page-rail">
                <span class="is-active">1</span>
                <span>2</span>
                <span>3</span>
            </div>
            <article class="pdf-page essay-page">
                <header>
                    <span class="paper-overline">LaTeX report</span>
                    <h3>${s(R("Generated Essay"))}</h3>
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
            ${j("PDF renderer","Pages are shown as PDF-like preview until artifact bytes are exposed.")}
        </div>
    `}function Ne(){return`
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
                    <h3>${s(R("Course Presentation"))}</h3>
                    <div class="slide-columns">
                        <span></span><span></span><span></span><span></span>
                    </div>
                    <div class="slide-footer">Slide 1 / 12</div>
                </div>
            </div>
            ${j("Deck preview","Compiled PDF pages will replace this deck skeleton when a file endpoint is available.")}
        </div>
    `}function De(){const e=Math.max(1,Math.round(Number(t.targetPages)||1));return`
        <div class="cheat-product">
            <div class="cheat-toolbar">
                <span>A4 dense layout</span>
                <strong>${e} page${e===1?"":"s"}</strong>
            </div>
            <div class="cheat-pages">
                ${Array.from({length:Math.min(e,4)},(n,a)=>`
                    <article class="cheat-page">
                        <header>
                            <span></span><span></span>
                        </header>
                        <div class="cheat-grid">
                            ${Array.from({length:36},(r,o)=>`
                                <i class="${(o+a)%7===0?"is-strong":""}"></i>
                            `).join("")}
                        </div>
                    </article>
                `).join("")}
            </div>
            ${j("Sheet preview","Dense PDF-like pages stay visible while generation runs.")}
        </div>
    `}function j(e,n){return t.run.status==="succeeded"&&t.run.outputRoot?"":t.run.status==="failed"?`
            <div class="preview-overlay is-error">
                <strong>${s(t.run.errorCode||"Run failed")}</strong>
                <span>${s(t.run.error||"Any preserved source or logs remain available from the run folder.")}</span>
            </div>
        `:t.run.status==="queued"||t.run.status==="running"?`
            <div class="preview-overlay is-running">
                <strong>${s(b(t.run.stage))}</strong>
                <span>${s(t.run.message)}</span>
            </div>
        `:`
        <div class="preview-overlay">
            <strong>${s(e)}</strong>
            <span>${s(n)}</span>
        </div>
    `}function Be(){const e=yt(),n=e.endsWith(".tex")?"latex":e.endsWith(".json")?"json":"python";return`
        <div class="inspection-product">
            <div class="inspection-head">
                <span>${s(e)}</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">Copy visible</button>
            </div>
            <div class="code-editor">${I(ie(),n)}</div>
            <div class="inspection-note">${s(C())}</div>
        </div>
    `}function je(){return`
        <div class="inspection-product">
            <div class="inspection-head">
                <span>generation.log</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">Copy visible</button>
            </div>
            <div class="log-view">
                <p><span>${s(Nt())}</span> ${s(b(t.run.stage))}: ${s(t.run.message)}</p>
                <p><span>run</span> ${t.run.id?s(t.run.id):"not-started"}</p>
                <p><span>status</span> ${s(t.run.status)}</p>
                ${t.run.error?`<p class="is-error"><span>error</span> ${s(t.run.error)}</p>`:""}
            </div>
            <div class="inspection-note">${s(C())}</div>
        </div>
    `}function ze(){const e={schema_version:1,run_id:t.run.id||null,revision_of_run_id:t.run.revisionOfRunId||null,intent:t.intent,search:{mode:t.searchMode},status:t.run.status,outputs:U().map(n=>({path:n.relativePath,kind:n.kind}))};return`
        <div class="inspection-product">
            <div class="inspection-head">
                <span>manifest.json</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">Copy visible</button>
            </div>
            <div class="code-editor">${I(JSON.stringify(e,null,2),"json")}</div>
            <div class="inspection-note">${s(C())}</div>
        </div>
    `}function Ue(){const e=U();return`
        <section class="output-dock" aria-label="Output files">
            <div class="output-head">
                <span>Files</span>
                <small>${t.run.outputRoot?s(ce(t.run.outputRoot)):"Run folder pending"}</small>
            </div>
            <div class="output-grid">
                ${e.map(n=>Ke(n)).join("")}
            </div>
        </section>
    `}function Ke(e){const n=Et(e.relativePath),a=!!(t.run.outputRoot&&(t.run.status==="succeeded"||e.kind!=="pdf"));return`
        <div class="output-file" data-kind="${s(e.kind)}">
            <span class="file-kind">${s(e.badge)}</span>
            <div>
                <strong>${s(e.name)}</strong>
                <small>${s(a?e.readyLabel:e.pendingLabel)}</small>
            </div>
            <div class="file-actions">
                <button type="button" data-copy-file="${s(n||e.relativePath)}" ${n?"":"disabled"}>Copy</button>
                <button type="button" data-open-file="${s(n||"")}" ${n?"":"disabled"}>Open</button>
            </div>
        </div>
    `}function Ge(){const e=te();return`
        <div class="context-widget" tabindex="0" data-context-state="${s(e.warning_level)}" aria-label="${s(de(e))}">
            <div class="dial-ring" aria-hidden="true">
                <span data-context-field="state">${s(k(e.warning_level))}</span>
            </div>
            <div class="context-copy">
                <strong data-context-field="source-label">${s(x(e.source))}</strong>
                <span data-context-field="summary">${s(le(e))}</span>
            </div>
            <div class="context-popover" role="tooltip">
                <div><span>Input</span><strong data-context-field="input">${g(e.estimated_input_tokens)}</strong></div>
                <div><span>Output</span><strong data-context-field="output">${g(e.estimated_output_tokens)}</strong></div>
                <div><span>Total</span><strong data-context-field="total">${g(e.estimated_total_tokens)}</strong></div>
                <div><span>Limit</span><strong data-context-field="limit">${g(e.context_window_limit)}</strong></div>
                <div><span>Use</span><strong data-context-field="utilization">${F(e.utilization_ratio)}</strong></div>
                <div><span>Warning</span><strong data-context-field="warning">${s(k(e.warning_level))}</strong></div>
                <div><span>Source</span><strong data-context-field="source">${s(x(e.source))}</strong></div>
            </div>
        </div>
    `}function We(){return`
        <section class="auth-panel" aria-label="Authentication">
            <div class="auth-head">
                <div>
                    <div class="pane-kicker">CUHK weak auth</div>
                    <h2>${t.authMode==="login"?"Login":"Register"}</h2>
                </div>
                <div class="auth-tabs">
                    <button type="button" class="${t.authMode==="login"?"is-active":""}" data-auth-mode="login">Login</button>
                    <button type="button" class="${t.authMode==="register"?"is-active":""}" data-auth-mode="register">Register</button>
                </div>
            </div>
            <form id="auth-form" class="auth-form">
                <label>
                    <span class="field-label">CUHK email</span>
                    <input id="auth-email" type="email" autocomplete="email" placeholder="name@cuhk.edu.hk">
                </label>
                <label>
                    <span class="field-label">Password</span>
                    <input id="auth-password" type="password" autocomplete="${t.authMode==="login"?"current-password":"new-password"}">
                </label>
                ${t.authMode==="register"?`<label>
                            <span class="field-label">Confirm password</span>
                            <input id="auth-confirm" type="password" autocomplete="new-password">
                        </label>`:""}
                <button class="run-button is-full" type="submit">${t.authMode==="login"?"Login":"Create account"}</button>
                <div class="inline-notice is-${t.authTone}">${s(t.authMessage)}</div>
            </form>
        </section>
    `}function He(){const e=t.model.form,n=t.model.profile,a=n?.api_key_ref?"Saved key configured":"No saved key",r=!!t.model.busy;return`
        <section class="model-modal" role="dialog" aria-modal="true" aria-label="Model settings">
            <div class="model-dialog">
                <div class="model-dialog-head">
                    <div>
                        <div class="pane-kicker">Model settings</div>
                        <h2>${s(e.displayName||"Qwen Default")}</h2>
                    </div>
                    <button class="icon-action is-large" type="button" data-action="close-model-settings" aria-label="Close model settings">x</button>
                </div>
                <form id="model-settings-form" class="model-form" novalidate>
                    ${P("displayName","Display name","text",e.displayName,"Qwen Default",!1)}
                    ${P("baseUrl","Base URL","url",e.baseUrl,"https://example-compatible-endpoint/v1",!0)}
                    ${P("model","Model","text",e.model,"qwen-model-name",!0)}
                    ${P("apiKey","API key","password",e.apiKey,n?.api_key_ref?"New key":"API key",!1,"new-password")}
                    <div class="model-secret-row">
                        <span class="key-state ${n?.api_key_ref?"is-ready":""}">${s(a)}</span>
                        <span class="profile-id">${s(n?.id||"environment-default")}</span>
                    </div>
                    <div class="model-actions">
                        <button class="secondary-action" type="button" data-action="test-model-settings" ${r?"disabled":""}>Test</button>
                        <button class="run-button" type="submit" ${r?"disabled":""}>${t.model.busy==="save"?"Saving":"Save"}</button>
                    </div>
                    <div class="inline-notice is-${t.model.statusTone}">${s(t.model.statusMessage)}</div>
                </form>
            </div>
        </section>
    `}function P(e,n,a,r,o,i,d="off"){const u=t.model.fieldErrors[e]||"";return`
        <label class="model-field ${u?"has-error":""}">
            <span class="field-label">${s(n)}</span>
            <input
                data-model-field="${e}"
                type="${a}"
                value="${s(r)}"
                placeholder="${s(o)}"
                autocomplete="${s(d)}"
                ${i?"required":""}
            >
            <span class="field-error">${s(u)}</span>
        </label>
    `}function Je(){document.querySelectorAll("[data-pane]").forEach(n=>{n.addEventListener("click",()=>{t.activePane=n.dataset.pane,l()})}),document.querySelectorAll("[data-auth-mode]").forEach(n=>{n.addEventListener("click",()=>{t.authMode=n.dataset.authMode,t.authMessage="",l()})}),document.getElementById("auth-form")?.addEventListener("submit",Ze),document.getElementById("task-text")?.addEventListener("input",n=>{t.taskText=n.target.value,delete t.fieldErrors.task_text,f(),T()}),document.getElementById("refinement-text")?.addEventListener("input",n=>{t.refinementText=n.target.value,f(),T()}),document.querySelectorAll("[data-intent]").forEach(n=>{n.addEventListener("click",()=>{t.intent=n.dataset.intent,t.previewTab="primary",t.fieldErrors={},N(),f(),l()})}),document.querySelectorAll("[data-search-mode]").forEach(n=>{n.addEventListener("click",()=>{t.searchMode=n.dataset.searchMode,l()})}),document.querySelectorAll("[data-output-preference]").forEach(n=>{n.addEventListener("click",()=>{t.outputPreference=n.dataset.outputPreference,N(),f(),l()})}),document.getElementById("target-pages")?.addEventListener("input",n=>{const a=Number(n.target.value);t.targetPages=Number.isFinite(a)&&a>0?Math.round(a):1,delete t.fieldErrors.target_pages,f(),T()});const e=document.querySelector("[data-action='open-file-picker']");e?.addEventListener("click",()=>document.getElementById("file-input")?.click()),e?.addEventListener("keydown",n=>{n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),document.getElementById("file-input")?.click())}),document.getElementById("file-input")?.addEventListener("change",n=>{vt(Array.from(n.target.files||[])),l()}),document.querySelectorAll("[data-remove-file]").forEach(n=>{n.addEventListener("click",()=>{t.files=t.files.filter(a=>a.key!==n.dataset.removeFile),f(),l()})}),document.querySelector("[data-action='run']")?.addEventListener("click",()=>q({isRevision:!1})),document.querySelector("[data-action='run-refinement']")?.addEventListener("click",()=>q({isRevision:!0})),document.querySelector("[data-action='regenerate']")?.addEventListener("click",()=>q({isRevision:!1,isRegenerate:!0})),document.querySelector("[data-action='logout']")?.addEventListener("click",()=>{_(),H(),l()}),document.querySelector("[data-action='open-model-settings']")?.addEventListener("click",Ye),document.querySelector("[data-action='close-model-settings']")?.addEventListener("click",J),document.getElementById("model-settings-form")?.addEventListener("submit",nt),document.querySelector("[data-action='test-model-settings']")?.addEventListener("click",at),document.querySelectorAll("[data-model-field]").forEach(n=>{n.addEventListener("input",()=>{t.model.form[n.dataset.modelField]=n.value,delete t.model.fieldErrors[n.dataset.modelField],n.closest(".model-field")?.classList.remove("has-error");const a=n.closest(".model-field")?.querySelector(".field-error");a&&(a.textContent="")})}),document.querySelectorAll("[data-preview-tab]").forEach(n=>{n.addEventListener("click",()=>{t.previewTab=n.dataset.previewTab,l()})}),document.querySelectorAll("[data-active-file]").forEach(n=>{n.addEventListener("click",()=>{t.activeFile=n.dataset.activeFile,l()})}),document.querySelector("[data-action='copy-visible-preview']")?.addEventListener("click",xt),document.querySelector("[data-action='copy-current-path']")?.addEventListener("click",()=>A(t.run.outputRoot||"","Run folder path copied.")),document.querySelector("[data-action='reveal-run']")?.addEventListener("click",St),document.querySelectorAll("[data-copy-file]").forEach(n=>{n.addEventListener("click",()=>A(n.dataset.copyFile||"","Artifact path copied."))}),document.querySelectorAll("[data-open-file]").forEach(n=>{n.addEventListener("click",()=>Pt(n.dataset.openFile||""))}),document.onkeydown=et}async function Ze(e){e.preventDefault();const n=document.getElementById("auth-email")?.value.trim().toLowerCase()||"",a=document.getElementById("auth-password")?.value||"",r=document.getElementById("auth-confirm")?.value||"",o=t.authMode==="login"?"/api/auth/login":"/api/auth/register",i=t.authMode==="login"?{email:n,password:a}:{email:n,password:a,confirm_password:r};t.authMessage="Contacting local backend...",t.authTone="neutral",l();try{const d=await fetch(`${v}${o}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}),u=await d.json().catch(()=>({}));if(!d.ok)throw new Error(y(u,"Authentication failed."));if(t.authMode==="register"){t.authMode="login",t.authMessage="Account created. Login is ready.",t.authTone="success",l();return}W({email:u.email,role:u.role},u.token)}catch(d){t.authMessage=c(d.message),t.authTone="error",l()}}async function q({isRevision:e,isRegenerate:n=!1}){if(!t.user||!t.token)return;const a=e?t.refinementText.trim():t.taskText.trim(),r=e?t.run.id:null;if(!a){t.fieldErrors.task_text=e?"":"Required",t.run={...M(),status:"idle",stage:"validate_request",message:e?"Add a follow-up request before starting a revision.":"Add a task brief before running."},l();return}_(),f(),t.fieldErrors={},t.notice={message:"",tone:"neutral"},t.run={...M(),status:"queued",stage:t.files.some(o=>!o.uploadId)?"upload_inputs":"submit_run",message:t.files.some(o=>!o.uploadId)?"Preparing reference uploads.":"Submitting run to local backend.",revisionOfRunId:r},ht({kind:e?"revision":"command",status:"queued",title:e?"Follow-up request":n?"Regenerate request":"Generation request",message:a,meta:`${S().label} / search ${t.searchMode}`}),t.activePane="preview",l();try{const o=await Xe();t.run={...t.run,stage:"submit_run",message:"Submitting run to local backend."},l();const i=await fetch(`${v}/api/runs`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(it({promptText:a,uploadIds:o,revisionOfRunId:r}))}),d=await i.json().catch(()=>({}));if(!i.ok){dt(d,"Run request failed."),l();return}Y(d),w(),e&&(t.refinementText=""),l(),d.id&&(await ee(d.id),G.has(t.run.status)||mt(d.id))}catch(o){t.run={...t.run,status:"failed",stage:t.run.stage||"submit_run",message:"Run request failed.",error:c(o.message),errorCode:"frontend_request_failed"},w(),l()}}async function Xe(){const e=t.files.filter(i=>!i.uploadId);if(!e.length)return t.files.map(i=>i.uploadId).filter(Boolean);e.forEach(i=>{i.status="uploading"}),l();const n=new FormData;e.forEach(i=>n.append("files",i.file,i.name));const a=await fetch(`${v}/api/uploads`,{method:"POST",headers:{Authorization:`Bearer ${t.token}`},body:n}),r=await a.json().catch(()=>({}));if(!a.ok){e.forEach(d=>{d.status="failed"});const i=a.status===404?"Upload API is unavailable in this backend build.":"Upload failed.";throw new Error(y(r,i))}const o=Array.isArray(r.uploads)?r.uploads:[];if(e.forEach((i,d)=>{const u=o[d];i.uploadId=u?.id||"",i.status=i.uploadId?"uploaded":"failed"}),e.some(i=>!i.uploadId))throw new Error("Upload response did not include every upload id.");return t.files.map(i=>i.uploadId).filter(Boolean)}function W(e,n){t.user=e,t.token=n,localStorage.setItem(D,n),localStorage.setItem(B,JSON.stringify(e)),t.authMessage="",t.run=M(),f(),l(),tt()}function H(){Qe(),t.user=null,t.token="",localStorage.removeItem(D),localStorage.removeItem(B)}function Qe(){t.model={editorOpen:!1,profiles:[],profile:null,form:{...m},fieldErrors:{},statusMessage:"",statusTone:"neutral",busy:""}}function Ve(){const e=t.model.profile;return e?.model?e.model:t.model.statusTone==="error"?"Model needs attention":"Default Qwen profile"}function Ye(){z(),t.model.editorOpen=!0,t.model.statusMessage=t.model.profile?"Saved profile loaded.":"Local defaults loaded.",t.model.statusTone="neutral",t.model.fieldErrors={},l()}function J(){t.model.editorOpen=!1,t.model.form.apiKey="",t.model.fieldErrors={},t.model.busy="",l()}function et(e){e.key==="Escape"&&t.model.editorOpen&&J()}async function tt(){if(t.token)try{const e=await fetch(`${v}/api/settings/model-profiles`,{headers:{Authorization:`Bearer ${t.token}`}}),n=await e.json().catch(()=>[]);if(!e.ok)throw new Error(y(n,"Model profile load failed."));const a=Array.isArray(n)?n.map(Z):[];t.model.profiles=a,t.model.profile=a.find(r=>r.is_default)||a[0]||null,z(),t.model.editorOpen&&(t.model.statusMessage=t.model.profile?"Saved profile loaded.":"Local defaults loaded.",t.model.statusTone="neutral"),l()}catch(e){t.model.statusMessage=c(e.message),t.model.statusTone="error",t.model.editorOpen&&l()}}function Z(e){return{id:String(e?.id||"default-qwen"),display_name:String(e?.display_name||"Qwen Default"),provider:String(e?.provider||"openai_compatible"),base_url:String(e?.base_url||m.baseUrl),model:String(e?.model||m.model),api_key_ref:e?.api_key_ref?String(e.api_key_ref):null,context_window_hint:Number(e?.context_window_hint||h),supports_streaming:!!e?.supports_streaming,is_default:!!e?.is_default}}function z(){const e=t.model.profile;t.model.form={displayName:e?.display_name||m.displayName,provider:e?.provider||m.provider,baseUrl:e?.base_url||m.baseUrl,model:e?.model||m.model,apiKey:""}}async function nt(e){e.preventDefault(),t.model.busy="save",t.model.statusMessage="Saving model profile.",t.model.statusTone="neutral",t.model.fieldErrors={},l();try{const n=await fetch(`${v}/api/settings/model-profiles/default`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(X({includeApiKey:!0}))}),a=await n.json().catch(()=>({}));if(!n.ok){Q(a,"Model profile save failed.");return}t.model.profile=Z(a),t.model.profiles=[t.model.profile],z(),t.model.statusMessage="Model profile saved.",t.model.statusTone="success",t.model.fieldErrors={}}catch(n){t.model.statusMessage=c(n.message),t.model.statusTone="error"}finally{t.model.busy="",t.model.form.apiKey="",l()}}async function at(){t.model.busy="test",t.model.statusMessage="Testing provider connection.",t.model.statusTone="neutral",t.model.fieldErrors={},l();try{const e=!!t.model.form.apiKey.trim(),n=await fetch(`${v}/api/settings/model-profiles/test`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(e?X({includeApiKey:!0}):{})}),a=await n.json().catch(()=>({}));if(!n.ok){Q(a,"Provider connectivity test failed.");return}t.model.statusMessage=`Connection OK for ${a.model||t.model.form.model}.`,t.model.statusTone="success",t.model.fieldErrors={}}catch(e){t.model.statusMessage=c(e.message),t.model.statusTone="error"}finally{t.model.busy="",l()}}function X({includeApiKey:e}){const n=t.model.form,a={display_name:n.displayName.trim()||"Qwen Default",provider:n.provider||"openai_compatible",base_url:n.baseUrl.trim(),model:n.model.trim(),context_window_hint:h,supports_streaming:!0};return n.apiKey.trim()&&(a.api_key=n.apiKey.trim()),a}function Q(e,n){const a=e?.error||{};t.model.statusMessage=a.code?`${a.code}: ${c(a.message||n)}`:y(e,n),t.model.statusTone="error",t.model.fieldErrors=st(a.fields||[])}function st(e){return e.reduce((n,a)=>{const r=rt(a.field);return r&&(n[r]=L(a.rule)),n},{})}function rt(e){return e==="base_url"?"baseUrl":e==="model"?"model":e==="api_key"?"apiKey":e==="display_name"?"displayName":""}function L(e){return e==="required"?"Required":e==="absolute_http_url"?"Use an absolute http or https URL":e==="enum"?"Choose a supported value":e||"Invalid value"}function M(){return{id:"",status:"idle",stage:"compose",message:"Ready",error:null,errorCode:"",outputRoot:"",revisionOfRunId:null}}function it({promptText:e,uploadIds:n,revisionOfRunId:a}){const r={task_text:e,intent:t.intent,output_preference:ot(t.intent),search_mode:t.searchMode,model_profile_id:t.model.profile?.id||null,upload_ids:n,options:lt(t.intent)};return a&&(r.revision_of_run_id=a),r}function ot(e){return e==="code_homework"?t.outputPreference:"pdf"}function lt(e){return e!=="cheat_sheet"?{}:{target_pages:Math.max(1,Math.round(Number(t.targetPages)||1)),paper_size:"A4",density:"dense"}}function V(e){return e&&t.taskText.trim()&&t.run.status!=="queued"&&t.run.status!=="running"}function dt(e,n){const a=e?.error||{};t.fieldErrors=ut(a.fields||[]),t.run={...t.run,status:"failed",stage:"submit_run",message:"Run request failed.",error:y(e,n),errorCode:String(a.code||"request_failed")},w()}function ut(e){return e.reduce((n,a)=>(a.field==="task_text"&&(n.task_text=L(a.rule)),a.field==="options.target_pages"&&(n.target_pages=L(a.rule)),a.field==="output_preference"&&(n.output_preference=L(a.rule)),n),{})}function Y(e){e.context&&(t.context=ae(e.context,"backend")),t.run={...t.run,id:e.id||e.run_id||t.run.id||"",status:e.status||t.run.status,stage:e.stage||t.run.stage||"queued",message:ct(e),error:pt(e),errorCode:ft(e),outputRoot:e.output_root||t.run.outputRoot||""}}function ct(e){return e.message?c(e.message):e.error?.message?c(e.error.message):e.error_message?c(e.error_message):e.status==="succeeded"?"Run succeeded.":e.status==="failed"?"Run failed.":e.status==="running"?"Run is running.":"Run queued."}function pt(e){return e.error?.message?c(e.error.message):e.status==="failed"&&e.error_message?c(e.error_message):null}function ft(e){return e.error?.code?String(e.error.code):e.status==="failed"&&typeof e.error_message=="string"?e.error_message.split(":")[0]||"run_failed":""}function mt(e){_(),E=window.setInterval(()=>{ee(e).catch(n=>{_(),t.run={...t.run,status:"failed",stage:"poll_status",message:"Could not refresh run status.",error:c(n.message),errorCode:"status_refresh_failed"},w(),l()})},me)}function _(){E&&(window.clearInterval(E),E=null)}async function ee(e){if(!e||!t.token)return;const n=await fetch(`${v}/api/runs/${encodeURIComponent(e)}/events`,{headers:{Authorization:`Bearer ${t.token}`}}),a=await n.json().catch(()=>({}));if(!n.ok)throw new Error(y(a,"Run status refresh failed."));Y(a),w(),l(),G.has(t.run.status)&&_()}function T(){const e=te(),n=document.querySelector(".dial-ring"),a=document.querySelector(".context-widget");!n||!a||(n.style.setProperty("--context-ratio",`${Math.min(100,e.utilization_ratio*100)}%`),a.dataset.contextState=e.warning_level,a.setAttribute("aria-label",de(e)),p("state",k(e.warning_level)),p("source-label",x(e.source)),p("summary",le(e)),p("input",g(e.estimated_input_tokens)),p("output",g(e.estimated_output_tokens)),p("total",g(e.estimated_total_tokens)),p("limit",g(e.context_window_limit)),p("utilization",F(e.utilization_ratio)),p("warning",k(e.warning_level)),p("source",x(e.source)))}function p(e,n){document.querySelectorAll(`[data-context-field="${e}"]`).forEach(a=>{a.textContent=n})}function f(){t.context=ne()}function te(){return t.context||ne()}function ne(){const e=S(),n=t.files.reduce((pe,fe)=>pe+Number(fe.size||0),0),a=`${t.taskText}
${t.refinementText}`.trim(),r=Math.max(1,Math.ceil((a.length+Math.min(n,2e5))/4)),o=e.id==="cheat_sheet"?Math.max(5e3,t.targetPages*1800):e.id==="beamer_slides"?7e3:e.id==="essay_latex"?6e3:t.outputPreference==="ipynb"?5200:4e3,i=r+o,d=i/h;let u="ok";return d>.85?u="critical":d>=.7&&(u="warning"),ae({estimated_input_tokens:r,estimated_output_tokens:o,estimated_total_tokens:i,context_window_limit:h,utilization_ratio:d,warning_level:u,source:"local"},"local")}function ae(e,n){const a=$(e?.estimated_input_tokens,0),r=$(e?.estimated_output_tokens,0),o=$(e?.context_window_limit,h)||h,i=$(e?.estimated_total_tokens,a+r),d=$(e?.utilization_ratio,i/o),u=gt(e?.warning_level,d);return{estimated_input_tokens:a,estimated_output_tokens:r,estimated_total_tokens:i,context_window_limit:o,utilization_ratio:d,warning_level:u,source:String(e?.source||n||"local")}}function $(e,n){const a=Number(e);return!Number.isFinite(a)||a<0?n:a}function gt(e,n){return e==="ok"||e==="warning"||e==="critical"?e:n>.85?"critical":n>=.7?"warning":"ok"}function vt(e){const n=new Set(t.files.map(r=>r.key)),a=e.map(r=>({key:`${r.name}-${r.size}-${r.lastModified}`,file:r,name:r.name,size:r.size,status:"pending",uploadId:""})).filter(r=>!n.has(r.key));t.files=[...t.files,...a],t.notice=a.length?{message:"Files will upload before the next run.",tone:"neutral"}:{message:"Those files are already selected.",tone:"neutral"},f()}function ht(e){t.history.push({id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,timestamp:new Date().toISOString(),...e})}function w(){if(!t.run.id)return;const e=`run-${t.run.id}`,n=t.history.find(r=>r.id===e),a={id:e,kind:"run",status:t.run.status,title:`Run ${ue(t.run.id)}`,message:t.run.error||t.run.message,meta:`${b(t.run.stage)} / ${t.run.outputRoot?ce(t.run.outputRoot):"folder pending"}`,timestamp:new Date().toISOString()};n?Object.assign(n,a):t.history.push(a)}function S(){return O.find(e=>e.id===t.intent)||O[0]}function N(){const e=se();e.includes(t.activeFile)||(t.activeFile=e[0])}function se(){return t.outputPreference==="ipynb"?["solution.ipynb"]:["solution.py","tests.py","README.md"]}function bt(){return[{id:"primary",label:t.intent==="code_homework"?"Code":"Rendered"},{id:"source",label:t.intent==="code_homework"?"Source":"LaTeX"},{id:"logs",label:"Logs"},{id:"manifest",label:"Manifest"}]}function U(){return t.intent==="code_homework"?[t.outputPreference==="ipynb"?{name:"solution.ipynb",relativePath:"output/solution.ipynb",kind:"notebook",badge:"NB",readyLabel:"notebook output",pendingLabel:"pending"}:{name:"solution.py",relativePath:"output/solution.py",kind:"script",badge:"PY",readyLabel:"script output",pendingLabel:"pending"},{name:"generation.log",relativePath:"logs/generation.log",kind:"log",badge:"LOG",readyLabel:"run log",pendingLabel:"pending"},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:"metadata",pendingLabel:"pending"}]:t.intent==="essay_latex"?[{name:"main.pdf",relativePath:"output/main.pdf",kind:"pdf",badge:"PDF",readyLabel:"compiled PDF",pendingLabel:"compile pending"},{name:"main.tex",relativePath:"output/main.tex",kind:"source",badge:"TEX",readyLabel:"source preserved",pendingLabel:"pending"},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:"compile log",pendingLabel:"pending"},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:"metadata",pendingLabel:"pending"}]:t.intent==="beamer_slides"?[{name:"slides.pdf",relativePath:"output/slides.pdf",kind:"pdf",badge:"PDF",readyLabel:"compiled deck",pendingLabel:"compile pending"},{name:"slides.tex",relativePath:"output/slides.tex",kind:"source",badge:"TEX",readyLabel:"source preserved",pendingLabel:"pending"},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:"compile log",pendingLabel:"pending"},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:"metadata",pendingLabel:"pending"}]:[{name:"cheat-sheet.pdf",relativePath:"output/cheat-sheet.pdf",kind:"pdf",badge:"PDF",readyLabel:"compiled sheet",pendingLabel:"compile pending"},{name:"cheat-sheet.tex",relativePath:"output/cheat-sheet.tex",kind:"source",badge:"TEX",readyLabel:"source preserved",pendingLabel:"pending"},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:"compile log",pendingLabel:"pending"},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:"metadata",pendingLabel:"pending"}]}function yt(){return t.intent==="code_homework"?t.outputPreference==="ipynb"?"solution.ipynb":"solution.py":t.intent==="beamer_slides"?"slides.tex":t.intent==="cheat_sheet"?"cheat-sheet.tex":"main.tex"}function K(e){return e==="tests.py"?`from solution import solve


def test_sample_case():
    assert solve([2, 4, 6]) == 12
`:e==="README.md"?`# Solution Notes

- Parse the assignment input explicitly.
- Keep edge cases near the solver.
- Include complexity in the final answer.
`:`from __future__ import annotations


def solve(values: list[int]) -> int:
    """Return the requested aggregate for the homework task."""
    total = 0
    for value in values:
        if value < 0:
            continue
        total += value
    return total


if __name__ == "__main__":
    print(solve([1, 2, 3]))
`}function re(){return`def solve(values):
    total = 0
    for value in values:
        total += value
    return total

solve([1, 2, 3])`}function ie(){return t.intent==="code_homework"?K("solution.py"):t.intent==="beamer_slides"?`\\documentclass{beamer}
\\title{${R("Generated Slides")}}
\\begin{document}
\\begin{frame}{Overview}
  \\begin{itemize}
    \\item Motivation
    \\item Method
    \\item Result
  \\end{itemize}
\\end{frame}
\\end{document}
`:t.intent==="cheat_sheet"?`\\documentclass[a4paper]{article}
\\usepackage[margin=0.45cm]{geometry}
\\usepackage{multicol}
\\begin{document}
\\begin{multicols}{4}
\\section*{Dense Review}
Key definitions, formulas, and proof templates.
\\end{multicols}
\\end{document}
`:`\\documentclass{article}
\\title{${R("Generated Essay")}}
\\begin{document}
\\maketitle
\\section{Introduction}
The generated source is preserved even if PDF compilation fails.
\\section{Discussion}
Evidence and citations are recorded in the run manifest.
\\end{document}
`}function I(e,n="python"){return`
        <ol class="code-lines">
            ${String(e).replace(/\s+$/u,"").split(`
`).map((r,o)=>`
                <li>
                    <span class="line-no">${o+1}</span>
                    <code>${$t(r,n)}</code>
                </li>
            `).join("")}
        </ol>
    `}function $t(e,n){return n==="json"?wt(e):n==="latex"?kt(e):_t(e)}function _t(e){const n=e.match(/#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|./g)||[],a=new Set(["def","class","from","import","for","if","else","elif","return","continue","in","as","print","with","try","except","raise","while","True","False","None"]);return n.map((r,o)=>r.startsWith("#")?`<span class="syntax-comment">${s(r)}</span>`:r.startsWith('"')||r.startsWith("'")?`<span class="syntax-string">${s(r)}</span>`:/^\d+$/u.test(r)?`<span class="syntax-number">${s(r)}</span>`:a.has(r)?`<span class="syntax-keyword">${s(r)}</span>`:/^[A-Za-z_][A-Za-z0-9_]*$/u.test(r)&&oe(n,o)==="("?`<span class="syntax-function">${s(r)}</span>`:s(r)).join("")||" "}function wt(e){const n=e.match(/"(?:\\.|[^"\\])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?|\s+|./g)||[];return n.map((a,r)=>a.startsWith('"')?`<span class="${oe(n,r)===":"?"syntax-keyword":"syntax-string"}">${s(a)}</span>`:/^(true|false|null)$/u.test(a)?`<span class="syntax-keyword">${s(a)}</span>`:/^-?\d+(?:\.\d+)?$/u.test(a)?`<span class="syntax-number">${s(a)}</span>`:s(a)).join("")||" "}function kt(e){return(e.match(/%.*$|\\[A-Za-z*]+|\{[^}]*\}|\s+|./g)||[]).map(a=>a.startsWith("%")?`<span class="syntax-comment">${s(a)}</span>`:a.startsWith("\\")?`<span class="syntax-keyword">${s(a)}</span>`:a.startsWith("{")&&a.endsWith("}")?`<span class="syntax-string">${s(a)}</span>`:s(a)).join("")||" "}function oe(e,n){for(let a=n+1;a<e.length;a+=1)if(!/^\s+$/u.test(e[a]))return e[a];return""}async function xt(){const e=t.previewTab==="logs"?`${b(t.run.stage)}: ${t.run.message}`:t.previewTab==="manifest"?JSON.stringify({run_id:t.run.id||null,intent:t.intent,status:t.run.status,outputs:U().map(n=>n.relativePath)},null,2):t.previewTab==="source"?ie():t.intent==="code_homework"?t.outputPreference==="ipynb"?re():K(t.activeFile):t.run.outputRoot||C();await A(e,"Visible preview copied.")}async function A(e,n){if(e){try{await navigator.clipboard.writeText(e),t.notice={message:n,tone:"success"}}catch{t.notice={message:"Clipboard is not available in this browser context.",tone:"error"}}l()}}function St(){t.run.outputRoot&&A(t.run.outputRoot,"Run folder path copied for reveal.")}function Pt(e){if(!e)return;const n=e.startsWith("file://")?e:`file://${e}`;window.open(n,"_blank","noopener,noreferrer")}function Et(e){return t.run.outputRoot?`${t.run.outputRoot.replace(/\/$/u,"")}/${e}`:""}function C(){return t.run.outputRoot?"Artifact bytes are in the run folder; browser byte rendering awaits an artifact file endpoint.":"Run folder appears after a run is accepted by the backend."}function Lt(){return t.run.status==="queued"||t.run.status==="running"?"Running":t.run.status==="failed"?"Run again":"Run artifact"}function Tt(e){return e?t.taskText.trim()?t.files.some(n=>!n.uploadId)?"Selected files upload before run creation.":t.run.status==="queued"||t.run.status==="running"?"Context and stage events update as the backend reports.":"Ready for a local generation run.":"Add a task brief to enable generation.":"Login activates generation controls."}function Mt(){return t.run.status==="failed"?"Validation issue":t.run.status==="succeeded"?"Artifact ready":t.run.status==="queued"||t.run.status==="running"?"Generating":"Renderer armed"}function At(){return t.run.status==="failed"?t.run.errorCode||"source preserved if available":t.run.status==="succeeded"?t.run.outputRoot?"copy/open paths available":"completed":t.run.status==="queued"||t.run.status==="running"?b(t.run.stage):"syntax preview, no execution"}function Rt(e,n){return n==="queued"?"route":n==="succeeded"?t.intent==="code_homework"?"validate":"compile":e?.includes("context")||e?.includes("upload")?t.intent==="cheat_sheet"?"ingest":"context":e?.includes("search")||e?.includes("route")?"route":e?.includes("compile")?"compile":e?.includes("validate")?"validate":e?.includes("outline")?"outline":e?.includes("layout")?"layout":e?.includes("compress")?"compress":e?.includes("generate")||e?.includes("source")?t.intent==="beamer_slides"?"write":"generate":S().stages[0]}function b(e){return ge[e]||String(e||"compose").replaceAll("_"," ")}function It(e){return e.status==="uploaded"?"uploaded":e.status==="uploading"?"uploading":e.status==="failed"?"upload failed":qt(e.size)}function Ct(e){return String(e).split(".").pop()?.slice(0,3).toUpperCase()||"FILE"}function Ft(){try{return JSON.parse(localStorage.getItem(B)||"null")}catch{return null}}function y(e,n){const a=e?.error?.message||(typeof e?.detail=="string"?e.detail:"")||(typeof e?.message=="string"?e.message:"")||n,r=e?.error?.code?`${e.error.code}: `:"";return c(`${r}${a}`)}function c(e){return String(e||"").replace(/sk-[A-Za-z0-9_-]+/g,"[redacted-key]").replace(/Bearer\s+[A-Za-z0-9._-]+/gi,"Bearer [redacted-token]").replace(/api[_-]?key["'\s:=]+[A-Za-z0-9._-]+/gi,"api_key [redacted]").split(`
`).filter(n=>!/\s+at\s+/.test(n)&&!/Traceback/.test(n)).slice(0,3).join(" ").trim()}function g(e){return Number(e||0).toLocaleString()}function F(e){return`${Math.round(Number(e||0)*100)}%`}function qt(e){const n=Number(e||0);return n>=1024*1024?`${(n/(1024*1024)).toFixed(1)} MB`:n>=1024?`${Math.round(n/1024)} KB`:`${n} B`}function k(e){return e==="critical"?"Critical":e==="warning"?"Warning":"OK"}function x(e){const n=String(e||"local").toLowerCase();return n==="local"?"Local estimate":n==="heuristic"?"Backend heuristic":n==="provider"?"Provider estimate":e}function le(e){return e.warning_level==="critical"?"Aggressive compression likely":e.warning_level==="warning"?"Compression may be needed":`${F(e.utilization_ratio)} of context`}function de(e){return`Context budget ${k(e.warning_level)}, ${F(e.utilization_ratio)} utilized, ${x(e.source)}`}function R(e){const a=(t.taskText.trim().split(`
`).find(Boolean)||"").replace(/[^\w\s:,-]/g,"").trim();return a?a.length>52?`${a.slice(0,49)}...`:a:e}function ue(e){return String(e||"").slice(0,8)||"pending"}function Ot(e){try{return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"}).format(new Date(e))}catch{return""}}function Nt(){return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date)}function ce(e){const n=String(e||"");return n.length<=46?n:`...${n.slice(-43)}`}function s(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}
