(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))l(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&l(d)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();const g=window.__AI_LEARNING_ASSISTANT_API_URL||window.location.origin,M="ai_learning_assistant_token",E="ai_learning_assistant_user",v=128e3,Q=1200,T=new Set(["succeeded","failed","cancelled"]),p={displayName:"Qwen Default",provider:"openai_compatible",baseUrl:"https://example-compatible-endpoint/v1",model:"qwen-model-name",apiKey:""},S=[{id:"auto",label:"Auto",short:"A",family:"Router",outputs:["manifest.json"],accent:"plum"},{id:"code_homework",label:"Code",short:"PY",family:"Homework",outputs:["solution.py","solution.ipynb"],accent:"teal"},{id:"essay_latex",label:"Essay",short:"TEX",family:"LaTeX report",outputs:["main.tex","main.pdf"],accent:"blue"},{id:"beamer_slides",label:"Slides",short:"PDF",family:"Beamer deck",outputs:["slides.tex","slides.pdf"],accent:"amber"},{id:"cheat_sheet",label:"Cheat sheet",short:"A4",family:"Dense study sheet",outputs:["cheat-sheet.tex","cheat-sheet.pdf"],accent:"coral"}],t={authMode:"login",token:localStorage.getItem(M)||"",user:Te(),intent:"code_homework",searchMode:"auto",targetPages:2,taskText:"",files:[],context:null,model:{editorOpen:!1,profiles:[],profile:null,form:{...p},fieldErrors:{},statusMessage:"",statusTone:"neutral",busy:""},authMessage:"",authTone:"neutral",run:{id:"",status:"idle",stage:"compose",message:"Ready",error:null}},W=document.getElementById("app");let $=null;X();function X(){f(),o(),t.token&&Y()}async function Y(){try{const e=await fetch(`${g}/api/auth/me`,{headers:{Authorization:`Bearer ${t.token}`}});if(!e.ok)throw new Error("Session expired");const a=await e.json();P(a,t.token)}catch{I(),o()}}function o(){const e=!!(t.user&&t.token);W.innerHTML=`
        <div class="studio-app ${e?"":"is-locked"}">
            ${G(e)}
            <main class="studio-main">
                ${V(e)}
                ${e?"":ie()}
                ${e&&t.model.editorOpen?le():""}
            </main>
        </div>
    `,de(),x()}function G(e){return`
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
                ${e?`<button class="user-chip" type="button" data-action="logout">
                            <span>${s(t.user.email)}</span>
                            <strong>${s(t.user.role)}</strong>
                        </button>`:'<span class="user-chip is-muted">CUHK session</span>'}
            </div>
        </header>
    `}function V(e){const a=F();return`
        <section class="workbench-shell" aria-label="Artifact studio workbench">
            <section class="composer-panel studio-panel">
                <div class="panel-kicker">Compose</div>
                <label class="field-label" for="task-text">Task brief</label>
                <textarea id="task-text" class="task-input" rows="9" placeholder="Describe the assignment, deliverable, constraints, and source material.">${s(t.taskText)}</textarea>

                <div class="control-block">
                    <div class="field-label">Artifact type</div>
                    <div class="intent-grid" role="radiogroup" aria-label="Artifact type">
                        ${S.map(Z).join("")}
                    </div>
                </div>

                <div class="composer-row">
                    <label class="compact-field">
                        <span class="field-label">Search</span>
                        <div class="segmented-control" data-control="search-mode">
                            ${["auto","on","off"].map(n=>`
                                <button type="button" class="${t.searchMode===n?"is-active":""}" data-search-mode="${n}">
                                    ${n}
                                </button>
                            `).join("")}
                        </div>
                    </label>
                    <label class="compact-field">
                        <span class="field-label">Model</span>
                        <button class="model-select" type="button" data-action="open-model-settings">
                            <span>${s(me())}</span>
                            <span class="chevron" aria-hidden="true">v</span>
                        </button>
                    </label>
                </div>

                ${t.intent==="cheat_sheet"?ee():""}

                <div class="run-row">
                    <button class="run-button" type="button" data-action="run" ${xe(e)?"":"disabled"}>
                        <span class="button-glyph"></span>
                        <span>Run artifact</span>
                    </button>
                    <div class="run-note">${s(Ne(e))}</div>
                </div>
            </section>

            <section class="stage-panel studio-panel">
                <div class="stage-toolbar">
                    <div>
                        <div class="panel-kicker">Preview</div>
                        <h1>${s(a.family)}</h1>
                    </div>
                    <div class="stage-badge">${s(a.short)}</div>
                </div>
                ${te(a)}
                ${ne()}
            </section>

            <aside class="status-panel studio-panel">
                <div class="panel-kicker">Run state</div>
                ${se()}
                ${oe()}
                ${re(a)}
            </aside>
        </section>
    `}function Z(e){const a=t.intent===e.id;return`
        <button type="button" class="intent-button ${a?"is-active":""}" data-intent="${e.id}" data-accent="${e.accent}" role="radio" aria-checked="${a}">
            <span class="intent-short">${s(e.short)}</span>
            <span>
                <strong>${s(e.label)}</strong>
                <small>${s(e.family)}</small>
            </span>
        </button>
    `}function ee(){return`
        <div class="option-strip">
            <label class="stepper-field">
                <span class="field-label">Target pages</span>
                <input id="target-pages" type="number" min="1" max="12" value="${t.targetPages}">
            </label>
            <div class="paper-pill">A4</div>
            <div class="paper-pill">Dense</div>
        </div>
    `}function te(e){return`
        <div class="${`artifact-preview is-${e.id.replace("_","-")}`}" data-preview="${e.id}">
            <div class="preview-source-rail">
                <span></span><span></span><span></span>
            </div>
            <div class="preview-canvas">
                ${ae(e.id)}
            </div>
        </div>
    `}function ae(e){return e==="code_homework"?`
            <div class="code-window">
                <span class="code-line wide"></span>
                <span class="code-line"></span>
                <span class="code-line short"></span>
                <span class="code-line accent"></span>
                <span class="code-line"></span>
            </div>
        `:e==="beamer_slides"?`
            <div class="slide-stack">
                <div class="slide-card"></div>
                <div class="slide-card is-front">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `:e==="cheat_sheet"?`
            <div class="sheet-grid">
                ${Array.from({length:18},(a,n)=>`<span class="${n%5===0?"is-strong":""}"></span>`).join("")}
            </div>
        `:e==="auto"?`
            <div class="routing-map">
                <span></span><span></span><span></span><span></span>
            </div>
        `:`
        <div class="paper-preview">
            <span class="paper-title"></span>
            <span></span><span></span><span></span><span class="paper-rule"></span><span></span>
        </div>
    `}function ne(){return`
        <div class="upload-zone" data-action="open-file-picker" role="button" tabindex="0" aria-label="Choose reference files">
            <input id="file-input" type="file" multiple>
            <div class="upload-glyph"></div>
            <div>
                <strong>Reference files</strong>
                <span>${Pe()}</span>
            </div>
        </div>
    `}function se(){const e=z();return`
        <div class="context-widget" tabindex="0" data-context-state="${s(e.warning_level)}" aria-label="${s(J(e))}">
            <div class="context-dial" aria-label="Context budget">
                <div class="dial-ring">
                    <span data-context-field="state">${s(y(e.warning_level))}</span>
                </div>
            </div>
            <div class="context-copy">
                <strong data-context-field="source-label">${s(_(e.source))}</strong>
                <span data-context-field="summary">${s(j(e))}</span>
            </div>
            <div class="context-popover" role="tooltip">
                <div><span>Input</span><strong data-context-field="input">${m(e.estimated_input_tokens)}</strong></div>
                <div><span>Output</span><strong data-context-field="output">${m(e.estimated_output_tokens)}</strong></div>
                <div><span>Total</span><strong data-context-field="total">${m(e.estimated_total_tokens)}</strong></div>
                <div><span>Limit</span><strong data-context-field="limit">${m(e.context_window_limit)}</strong></div>
                <div><span>Utilization</span><strong data-context-field="utilization">${L(e.utilization_ratio)}</strong></div>
                <div><span>Warning</span><strong data-context-field="warning">${s(y(e.warning_level))}</strong></div>
                <div><span>Source</span><strong data-context-field="source">${s(_(e.source))}</strong></div>
            </div>
        </div>
    `}function oe(){return`
        <div class="status-stack">
            <div class="status-line">
                <span class="status-light" data-status="${t.run.status}"></span>
                <div>
                    <strong>${s(t.run.status)}</strong>
                    <span>${s(t.run.stage)}</span>
                </div>
            </div>
            <p>${s(t.run.message)}</p>
            ${t.run.error?`<p class="status-error">${s(t.run.error)}</p>`:""}
        </div>
    `}function re(e){return`
        <div class="output-list">
            <div class="list-head">
                <span>Output files</span>
                <button type="button" data-action="reveal-placeholder">Reveal</button>
            </div>
            ${e.outputs.map(a=>`
                <div class="file-row">
                    <span class="file-icon">${Ie(a)}</span>
                    <span>${s(a)}</span>
                    <small>${t.run.status==="succeeded"?"ready":"pending"}</small>
                </div>
            `).join("")}
            <div class="file-row">
                <span class="file-icon">JS</span>
                <span>manifest.json</span>
                <small>pending</small>
            </div>
        </div>
    `}function ie(){return`
        <section class="auth-panel studio-panel" aria-label="Authentication">
            <div class="auth-tabs">
                <button type="button" class="${t.authMode==="login"?"is-active":""}" data-auth-mode="login">Login</button>
                <button type="button" class="${t.authMode==="register"?"is-active":""}" data-auth-mode="register">Register</button>
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
                <button class="auth-submit" type="submit">${t.authMode==="login"?"Login":"Create account"}</button>
                <div class="auth-message is-${t.authTone}">${s(t.authMessage)}</div>
            </form>
        </section>
    `}function le(){const e=t.model.form,a=t.model.profile,n=a?.api_key_ref?"Saved key configured":"No saved key",l=!!t.model.busy;return`
        <section class="model-modal" role="dialog" aria-modal="true" aria-label="Model settings">
            <div class="model-dialog studio-panel">
                <div class="model-dialog-head">
                    <div>
                        <div class="panel-kicker">Model settings</div>
                        <h2>${s(e.displayName||"Qwen Default")}</h2>
                    </div>
                    <button class="icon-button" type="button" data-action="close-model-settings" aria-label="Close model settings">x</button>
                </div>
                <form id="model-settings-form" class="model-form" novalidate>
                    ${k("displayName","Display name","text",e.displayName,"Qwen Default",!1)}
                    ${k("baseUrl","Base URL","url",e.baseUrl,"https://example-compatible-endpoint/v1",!0)}
                    ${k("model","Model","text",e.model,"qwen-model-name",!0)}
                    ${k("apiKey","API key","password",e.apiKey,a?.api_key_ref?"New key":"API key",!1,"new-password")}
                    <div class="model-secret-row">
                        <span class="key-state ${a?.api_key_ref?"is-ready":""}">${s(n)}</span>
                        <span class="profile-id">${s(a?.id||"environment-default")}</span>
                    </div>
                    <div class="model-actions">
                        <button class="secondary-button" type="button" data-action="test-model-settings" ${l?"disabled":""}>Test</button>
                        <button class="auth-submit" type="submit" ${l?"disabled":""}>${t.model.busy==="save"?"Saving":"Save"}</button>
                    </div>
                    <div class="auth-message is-${t.model.statusTone}">${s(t.model.statusMessage)}</div>
                </form>
            </div>
        </section>
    `}function k(e,a,n,l,r,i,d="off"){const u=t.model.fieldErrors[e]||"";return`
        <label class="model-field ${u?"has-error":""}">
            <span class="field-label">${s(a)}</span>
            <input
                data-model-field="${e}"
                type="${n}"
                value="${s(l)}"
                placeholder="${s(r)}"
                autocomplete="${s(d)}"
                ${i?"required":""}
            >
            <span class="field-error">${s(u)}</span>
        </label>
    `}function de(){document.querySelectorAll("[data-auth-mode]").forEach(a=>{a.addEventListener("click",()=>{t.authMode=a.dataset.authMode,t.authMessage="",o()})}),document.getElementById("auth-form")?.addEventListener("submit",ue),document.getElementById("task-text")?.addEventListener("input",a=>{t.taskText=a.target.value,f(),x()}),document.querySelectorAll("[data-intent]").forEach(a=>{a.addEventListener("click",()=>{t.intent=a.dataset.intent,h(),t.run=B(),f(),o()})}),document.querySelectorAll("[data-search-mode]").forEach(a=>{a.addEventListener("click",()=>{t.searchMode=a.dataset.searchMode,o()})}),document.getElementById("target-pages")?.addEventListener("input",a=>{const n=Number(a.target.value);t.targetPages=Number.isFinite(n)&&n>0?Math.round(n):1,f(),x()});const e=document.querySelector("[data-action='open-file-picker']");e?.addEventListener("click",()=>document.getElementById("file-input")?.click()),e?.addEventListener("keydown",a=>{a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),document.getElementById("file-input")?.click())}),document.getElementById("file-input")?.addEventListener("change",a=>{t.files=Array.from(a.target.files||[]),f(),o()}),document.querySelector("[data-action='run']")?.addEventListener("click",ce),document.querySelector("[data-action='logout']")?.addEventListener("click",()=>{h(),I(),o()}),document.querySelector("[data-action='open-model-settings']")?.addEventListener("click",fe),document.querySelector("[data-action='close-model-settings']")?.addEventListener("click",N),document.getElementById("model-settings-form")?.addEventListener("submit",he),document.querySelector("[data-action='test-model-settings']")?.addEventListener("click",be),document.querySelectorAll("[data-model-field]").forEach(a=>{a.addEventListener("input",()=>{t.model.form[a.dataset.modelField]=a.value,delete t.model.fieldErrors[a.dataset.modelField],a.closest(".model-field")?.classList.remove("has-error");const n=a.closest(".model-field")?.querySelector(".field-error");n&&(n.textContent="")})}),document.onkeydown=ge,document.querySelector("[data-action='reveal-placeholder']")?.addEventListener("click",()=>{t.run={id:t.run.id,status:"idle",stage:"output_files",message:"Output list is ready.",error:null},o()})}async function ue(e){e.preventDefault();const a=document.getElementById("auth-email")?.value.trim().toLowerCase()||"",n=document.getElementById("auth-password")?.value||"",l=document.getElementById("auth-confirm")?.value||"",r=t.authMode==="login"?"/api/auth/login":"/api/auth/register",i=t.authMode==="login"?{email:a,password:n}:{email:a,password:n,confirm_password:l};t.authMessage="Contacting local backend...",t.authTone="neutral",o();try{const d=await fetch(`${g}${r}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}),u=await d.json().catch(()=>({}));if(!d.ok)throw new Error(w(u,"Authentication failed."));if(t.authMode==="register"){t.authMode="login",t.authMessage="Account created. Login is ready.",t.authTone="success",o();return}P({email:u.email,role:u.role},u.token)}catch(d){t.authMessage=d.message,t.authTone="error",o()}}async function ce(){if(!(!t.user||!t.token)){if(t.intent==="auto"){t.run={id:"",status:"idle",stage:"choose_intent",message:"Choose Code, Essay, Slides, or Cheat sheet before running.",error:null},o();return}if(!t.taskText.trim()){t.run={id:"",status:"idle",stage:"validate_request",message:"Add a task brief before running.",error:null},o();return}h(),f(),t.run={id:"",status:"queued",stage:"submit_run",message:"Submitting run to local backend.",error:null},o();try{const e=await fetch(`${g}/api/runs`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(ke())}),a=await e.json().catch(()=>({}));if(!e.ok)throw new Error(w(a,"Run request failed."));q(a),o(),a.id&&(await U(a.id),T.has(t.run.status)||Ae(a.id))}catch(e){t.run={id:"",status:"failed",stage:"submit_run",message:"Run request failed.",error:e.message},o()}}}function P(e,a){t.user=e,t.token=a,localStorage.setItem(M,a),localStorage.setItem(E,JSON.stringify(e)),t.authMessage="",t.run=B(),f(),o(),ve()}function I(){pe(),t.user=null,t.token="",localStorage.removeItem(M),localStorage.removeItem(E)}function pe(){t.model={editorOpen:!1,profiles:[],profile:null,form:{...p},fieldErrors:{},statusMessage:"",statusTone:"neutral",busy:""}}function me(){const e=t.model.profile;return e?.model?e.model:t.model.statusTone==="error"?"Model needs attention":"Default Qwen profile"}function fe(){A(),t.model.editorOpen=!0,t.model.statusMessage=t.model.profile?"Saved profile loaded.":"Local defaults loaded.",t.model.statusTone="neutral",t.model.fieldErrors={},o()}function N(){t.model.editorOpen=!1,t.model.form.apiKey="",t.model.fieldErrors={},t.model.busy="",o()}function ge(e){e.key==="Escape"&&t.model.editorOpen&&N()}async function ve(){if(t.token)try{const e=await fetch(`${g}/api/settings/model-profiles`,{headers:{Authorization:`Bearer ${t.token}`}}),a=await e.json().catch(()=>[]);if(!e.ok)throw new Error(w(a,"Model profile load failed."));const n=Array.isArray(a)?a.map(C):[];t.model.profiles=n,t.model.profile=n.find(l=>l.is_default)||n[0]||null,A(),t.model.editorOpen&&(t.model.statusMessage=t.model.profile?"Saved profile loaded.":"Local defaults loaded.",t.model.statusTone="neutral"),o()}catch(e){t.model.statusMessage=e.message,t.model.statusTone="error",t.model.editorOpen&&o()}}function C(e){return{id:String(e?.id||"default-qwen"),display_name:String(e?.display_name||"Qwen Default"),provider:String(e?.provider||"openai_compatible"),base_url:String(e?.base_url||p.baseUrl),model:String(e?.model||p.model),api_key_ref:e?.api_key_ref?String(e.api_key_ref):null,context_window_hint:Number(e?.context_window_hint||v),supports_streaming:!!e?.supports_streaming,is_default:!!e?.is_default}}function A(){const e=t.model.profile;t.model.form={displayName:e?.display_name||p.displayName,provider:e?.provider||p.provider,baseUrl:e?.base_url||p.baseUrl,model:e?.model||p.model,apiKey:""}}async function he(e){e.preventDefault(),t.model.busy="save",t.model.statusMessage="Saving model profile.",t.model.statusTone="neutral",t.model.fieldErrors={},o();try{const a=await fetch(`${g}/api/settings/model-profiles/default`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(R({includeApiKey:!0}))}),n=await a.json().catch(()=>({}));if(!a.ok){O(n,"Model profile save failed.");return}t.model.profile=C(n),t.model.profiles=[t.model.profile],A(),t.model.statusMessage="Model profile saved.",t.model.statusTone="success",t.model.fieldErrors={}}catch(a){t.model.statusMessage=a.message,t.model.statusTone="error"}finally{t.model.busy="",t.model.form.apiKey="",o()}}async function be(){t.model.busy="test",t.model.statusMessage="Testing provider connection.",t.model.statusTone="neutral",t.model.fieldErrors={},o();try{const e=!!t.model.form.apiKey.trim(),a=await fetch(`${g}/api/settings/model-profiles/test`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(e?R({includeApiKey:!0}):{})}),n=await a.json().catch(()=>({}));if(!a.ok){O(n,"Provider connectivity test failed.");return}t.model.statusMessage=`Connection OK for ${n.model||t.model.form.model}.`,t.model.statusTone="success",t.model.fieldErrors={}}catch(e){t.model.statusMessage=e.message,t.model.statusTone="error"}finally{t.model.busy="",o()}}function R({includeApiKey:e}){const a=t.model.form,n={display_name:a.displayName.trim()||"Qwen Default",provider:a.provider||"openai_compatible",base_url:a.baseUrl.trim(),model:a.model.trim(),context_window_hint:v,supports_streaming:!0};return a.apiKey.trim()&&(n.api_key=a.apiKey.trim()),n}function O(e,a){const n=e?.error||{};t.model.statusMessage=n.code?`${n.code}: ${n.message||a}`:w(e,a),t.model.statusTone="error",t.model.fieldErrors=ye(n.fields||[])}function ye(e){return e.reduce((a,n)=>{const l=_e(n.field);return l&&(a[l]=we(n.rule)),a},{})}function _e(e){return e==="base_url"?"baseUrl":e==="model"?"model":e==="api_key"?"apiKey":e==="display_name"?"displayName":""}function we(e){return e==="required"?"Required":e==="absolute_http_url"?"Use an absolute http or https URL":e==="enum"?"Choose a supported value":e||"Invalid value"}function B(){return{id:"",status:"idle",stage:"compose",message:"Ready",error:null}}function ke(){return{task_text:t.taskText.trim(),intent:t.intent,output_preference:$e(t.intent),search_mode:t.searchMode,model_profile_id:t.model.profile?.id||null,upload_ids:[],options:Se(t.intent)}}function $e(e){return e==="code_homework"?"py":e==="essay_latex"||e==="beamer_slides"||e==="cheat_sheet"?"pdf":null}function Se(e){return e!=="cheat_sheet"?{}:{target_pages:Math.max(1,Math.round(Number(t.targetPages)||1)),paper_size:"A4",density:"dense"}}function xe(e){return e&&t.intent!=="auto"}function q(e){e.context&&(t.context=D(e.context,"backend")),t.run={id:e.id||e.run_id||t.run.id||"",status:e.status||t.run.status,stage:e.stage||t.run.stage||"queued",message:Me(e),error:Ee(e)}}function Me(e){return e.message?e.message:e.error?.message?e.error.message:e.error_message?e.error_message:e.status==="succeeded"?"Run succeeded.":e.status==="failed"?"Run failed.":e.status==="running"?"Run is running.":"Run queued."}function Ee(e){return e.error?.message?e.error.message:e.status==="failed"&&e.error_message?e.error_message:null}function Ae(e){h(),$=window.setInterval(()=>{U(e).catch(a=>{h(),t.run={...t.run,status:"failed",stage:"poll_status",message:"Could not refresh run status.",error:a.message},o()})},Q)}function h(){$&&(window.clearInterval($),$=null)}async function U(e){if(!e||!t.token)return;const a=await fetch(`${g}/api/runs/${encodeURIComponent(e)}/events`,{headers:{Authorization:`Bearer ${t.token}`}}),n=await a.json().catch(()=>({}));if(!a.ok)throw new Error(w(n,"Run status refresh failed."));q(n),o(),T.has(t.run.status)&&h()}function x(){const e=z(),a=document.querySelector(".dial-ring"),n=document.querySelector(".context-widget");!a||!n||(a.style.setProperty("--context-ratio",`${Math.min(100,e.utilization_ratio*100)}%`),n.dataset.contextState=e.warning_level,n.setAttribute("aria-label",J(e)),c("state",y(e.warning_level)),c("source-label",_(e.source)),c("summary",j(e)),c("input",m(e.estimated_input_tokens)),c("output",m(e.estimated_output_tokens)),c("total",m(e.estimated_total_tokens)),c("limit",m(e.context_window_limit)),c("utilization",L(e.utilization_ratio)),c("warning",y(e.warning_level)),c("source",_(e.source)))}function c(e,a){document.querySelectorAll(`[data-context-field="${e}"]`).forEach(n=>{n.textContent=a})}function f(){t.context=K()}function z(){return t.context||K()}function K(){const e=F(),a=t.files.reduce((u,H)=>u+Number(H.size||0),0),n=Math.max(1,Math.ceil((t.taskText.length+Math.min(a,2e5))/4)),l=e.id==="cheat_sheet"?Math.max(5e3,t.targetPages*1800):e.id==="beamer_slides"?7e3:e.id==="essay_latex"?6e3:(e.id==="code_homework",4e3),r=n+l,i=r/v;let d="ok";return i>.85?d="critical":i>=.7&&(d="warning"),D({estimated_input_tokens:n,estimated_output_tokens:l,estimated_total_tokens:r,context_window_limit:v,utilization_ratio:i,warning_level:d,source:"local"},"local")}function D(e,a){const n=b(e?.estimated_input_tokens,0),l=b(e?.estimated_output_tokens,0),r=b(e?.context_window_limit,v)||v,i=b(e?.estimated_total_tokens,n+l),d=b(e?.utilization_ratio,i/r),u=Le(e?.warning_level,d);return{estimated_input_tokens:n,estimated_output_tokens:l,estimated_total_tokens:i,context_window_limit:r,utilization_ratio:d,warning_level:u,source:String(e?.source||a||"local")}}function b(e,a){const n=Number(e);return!Number.isFinite(n)||n<0?a:n}function Le(e,a){return e==="ok"||e==="warning"||e==="critical"?e:a>.85?"critical":a>=.7?"warning":"ok"}function F(){return S.find(e=>e.id===t.intent)||S[1]}function Te(){try{return JSON.parse(localStorage.getItem(E)||"null")}catch{return null}}function Pe(){return t.files.length?t.files.length===1?t.files[0].name:`${t.files.length} files selected`:"Drop or choose files"}function Ie(e){return e.split(".").pop()?.slice(0,3).toUpperCase()||"FILE"}function Ne(e){return e?t.intent==="auto"?"Choose a concrete artifact type for generation.":t.run.status==="queued"||t.run.status==="running"?"Backend context events are updating the dial.":"Ready for a local run.":"Login to activate run controls."}function w(e,a){return e?.error?.message?e.error.message:typeof e?.detail=="string"?e.detail:typeof e?.message=="string"?e.message:a}function m(e){return Number(e||0).toLocaleString()}function L(e){return`${Math.round(Number(e||0)*100)}%`}function y(e){return e==="critical"?"Critical":e==="warning"?"Warning":"OK"}function _(e){const a=String(e||"local").toLowerCase();return a==="local"?"Local estimate":a==="heuristic"?"Backend heuristic":a==="provider"?"Provider estimate":e}function j(e){return e.warning_level==="critical"?"Aggressive compression likely":e.warning_level==="warning"?"Compression may be needed":"Budget looks healthy"}function J(e){return`Context budget ${y(e.warning_level)}, ${L(e.utilization_ratio)} utilized, ${_(e.source)}`}function s(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}
