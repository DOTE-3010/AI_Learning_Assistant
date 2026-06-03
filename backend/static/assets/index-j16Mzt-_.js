(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const o of l)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function i(l){const o={};return l.integrity&&(o.integrity=l.integrity),l.referrerPolicy&&(o.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?o.credentials="include":l.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(l){if(l.ep)return;l.ep=!0;const o=i(l);fetch(l.href,o)}})();const ae=[{id:"en",label:"EN",name:"English"},{id:"zh-Hans",label:"简",name:"简体中文"},{id:"zh-Hant",label:"繁",name:"繁體中文"}],ee={en:{app:{title:"AI Learning Assistant - Artifact Studio",brand:"AI Learning Assistant",userFallback:"User"},locale:{label:"Interface language"},mobile:{console:"Console",preview:"Preview"},pane:{consoleKicker:"Production console",consoleTitle:"Generate artifacts",previewKicker:"Artifact preview"},actions:{model:"Model",copyPath:"Copy path",reveal:"Reveal",regenerate:"Regenerate",copy:"Copy",open:"Open",runArtifact:"Run artifact",runAgain:"Run again",running:"Running",newRevisionRun:"New revision run",copyVisible:"Copy visible",test:"Test",save:"Save",saving:"Saving",login:"Login",createAccount:"Create account",closeModel:"Close model settings",removeFile:"Remove {name}"},intents:{code_homework:{label:"Code",short:"PY",title:"Homework code",description:"Script or notebook answer",primaryTab:"Code",sourceTab:"Source"},essay_latex:{label:"Essay",short:"TEX",title:"LaTeX essay",description:"Source plus compiled PDF",primaryTab:"Rendered",sourceTab:"LaTeX"},beamer_slides:{label:"Slides",short:"PDF",title:"Beamer deck",description:"Slide source plus PDF",primaryTab:"Rendered",sourceTab:"LaTeX"},cheat_sheet:{label:"Cheat sheet",short:"A4",title:"Dense A4 sheet",description:"Course compression PDF",primaryTab:"Rendered",sourceTab:"LaTeX"}},controls:{artifactType:"Artifact type",search:"Search",searchMode:{auto:"Auto",on:"On",off:"Off"},output:"Output",previewOnly:"Preview only",targetPages:"Target pages",a4:"A4",dense:"Dense",pdfFirst:"PDF first",sourceKept:"Source kept"},composer:{brief:"Brief",briefPlaceholder:"Paste the assignment brief, constraints, marking expectations, and any output notes.",runNoteLogin:"Login activates generation controls.",runNoteBrief:"Add a task brief to enable generation.",runNoteUploads:"Selected files upload before run creation.",runNoteRunning:"Context and stage events update as the backend reports.",runNoteReady:"Ready for a local generation run."},uploads:{label:"Reference files",choose:"Drop or choose reference files",selected:"{count} reference file selected",selectedPlural:"{count} reference files selected",willUpload:"Files will upload before the next run.",duplicates:"Those files are already selected.",uploaded:"uploaded",uploading:"uploading",failed:"upload failed",unavailable:"Upload API is unavailable in this backend build.",failedGeneric:"Upload failed.",missingIds:"Upload response did not include every upload id."},refinement:{label:"Follow-up",availableAfterRun:"Available after first run",revisionSource:"Revision source {id}",placeholder:"Ask for a tighter proof, more comments, fewer slides, or a different structure.",note:"Creates a new run; generated files stay source-of-truth on disk.",missing:"Add a follow-up request before starting a revision."},history:{label:"Run history",entries:"{count} entries",readyTitle:"Console ready",readyMessage:"Choose an artifact type, add source material, then run.",followUpTitle:"Follow-up request",regenerateTitle:"Regenerate request",generationTitle:"Generation request",runTitle:"Run {id}",folderPending:"folder pending"},preview:{tabs:{logs:"Logs",manifest:"Manifest"},statusMessage:"Run status",emptyPdfTitle:"PDF renderer",emptyPdfMessage:"Pages are shown as PDF-like preview until artifact bytes are exposed.",deckTitle:"Deck preview",deckMessage:"Compiled PDF pages will replace this deck skeleton when a file endpoint is available.",sheetTitle:"Sheet preview",sheetMessage:"Dense PDF-like pages stay visible while generation runs.",failedTitle:"Run failed",failedMessage:"Any preserved source or logs remain available from the run folder.",runFolderPending:"Run folder pending",files:"Files",pageLabel:"Slide 1 / 12",latexReport:"LaTeX report",generatedEssay:"Generated Essay",generatedSlidesSource:"Generated Slides",generatedSlides:"Course Presentation",introduction:"Introduction",argument:"Argument",references:"References",notebookApproach:"Approach",notebookApproachBody:"State the algorithm, edge cases, and complexity before the implementation cell.",markdown:"Markdown",code:"Code",notebookValidation:"Notebook validation",preservedForInspection:"Preserved for inspection",noExecution:"Preview-only, no execution",a4DenseLayout:"A4 dense layout",onePage:"{count} page",manyPages:"{count} pages"},files:{scriptReady:"script output",notebookReady:"notebook output",logReady:"run log",metadataReady:"metadata",pdfReady:"compiled PDF",deckReady:"compiled deck",sheetReady:"compiled sheet",sourceReady:"source preserved",compileLogReady:"compile log",pending:"pending",compilePending:"compile pending"},source:{artifactNoteReady:"Artifact bytes are in the run folder; browser byte rendering awaits an artifact file endpoint.",artifactNotePending:"Run folder appears after a run is accepted by the backend.",generationLog:"generation.log",notStarted:"not-started",status:"status",error:"error"},auth:{kicker:"CUHK auth",loginTitle:"Login",registerTitle:"Register",email:"CUHK email",password:"Password",confirmPassword:"Confirm password",contacting:"Contacting local backend...",failed:"Authentication failed.",expired:"Session expired",created:"Account created. Login is ready."},model:{settingsKicker:"Model settings",defaultName:"Qwen Default",defaultButton:"Default Qwen profile",needsAttention:"Model needs attention",displayName:"Display name",baseUrl:"Base URL",model:"Model",apiKey:"API key",newKey:"New key",savedKey:"Saved key configured",noSavedKey:"No saved key",environmentDefault:"environment-default",savedLoaded:"Saved profile loaded.",defaultsLoaded:"Local defaults loaded.",loadFailed:"Model profile load failed.",saving:"Saving model profile.",saved:"Model profile saved.",saveFailed:"Model profile save failed.",testing:"Testing provider connection.",testFailed:"Provider connectivity test failed.",connectionOk:"Connection OK for {model}."},run:{ready:"Ready",required:"Required",addBrief:"Add a task brief before running.",preparingUploads:"Preparing reference uploads.",submitting:"Submitting run to local backend.",requestFailed:"Run request failed.",succeeded:"Run succeeded.",failed:"Run failed.",running:"Run is running.",queued:"Run queued.",refreshFailed:"Could not refresh run status.",statusRefreshFailed:"Run status refresh failed.",pathCopied:"Run folder path copied.",pathRevealCopied:"Run folder path copied for reveal.",artifactPathCopied:"Artifact path copied.",previewCopied:"Visible preview copied.",clipboardUnavailable:"Clipboard is not available in this browser context.",validationIssue:"Validation issue",artifactReady:"Artifact ready",generating:"Generating",rendererArmed:"Renderer armed",sourcePreserved:"source preserved if available",copyOpenAvailable:"copy/open paths available",completed:"completed",syntaxPreview:"syntax preview, no execution"},status:{idle:"Idle",queued:"Queued",running:"Running",succeeded:"Succeeded",failed:"Failed",cancelled:"Cancelled"},stages:{compose:"Compose",choose_intent:"Select artifact",validate_request:"Validate",upload_inputs:"Upload inputs",submit_run:"Submit run",queued:"Queued",running:"Running",resolve_model:"Model",extract_context:"Context",decide_search:"Search",generate_source:"Generate",validate_source:"Validate",compile_pdf:"Compile PDF",write_manifest:"Manifest",poll_status:"Refresh",output_files:"Output files",route:"Route",context:"Context",generate:"Generate",validate:"Validate",write:"Write",compile:"Compile",outline:"Outline",ingest:"Ingest",compress:"Compress",layout:"Layout"},context:{ok:"OK",warning:"Warning",critical:"Critical",local:"Local estimate",heuristic:"Backend heuristic",provider:"Provider estimate",input:"Input",output:"Output",total:"Total",limit:"Limit",use:"Use",warningLabel:"Warning",source:"Source",criticalSummary:"Aggressive compression likely",warningSummary:"Compression may be needed",ratioSummary:"{percent} of context",aria:"Context budget {state}, {percent} utilized, {source}"},errors:{required:"Required",absoluteHttpUrl:"Use an absolute http or https URL",enum:"Choose a supported value",invalid:"Invalid value"}},"zh-Hans":{app:{title:"AI Learning Assistant - 成果工作室",brand:"AI Learning Assistant",userFallback:"用户"},locale:{label:"界面语言"},mobile:{console:"控制台",preview:"预览"},pane:{consoleKicker:"生产控制台",consoleTitle:"生成学术成果",previewKicker:"成果预览"},actions:{model:"模型",copyPath:"复制路径",reveal:"显示位置",regenerate:"重新生成",copy:"复制",open:"打开",runArtifact:"开始生成",runAgain:"再次运行",running:"运行中",newRevisionRun:"新修订运行",copyVisible:"复制当前",test:"测试",save:"保存",saving:"保存中",login:"登录",createAccount:"创建账户",closeModel:"关闭模型设置",removeFile:"移除 {name}"},intents:{code_homework:{label:"代码",short:"PY",title:"作业代码",description:"脚本或 Notebook 答案",primaryTab:"代码",sourceTab:"源文件"},essay_latex:{label:"论文",short:"TEX",title:"LaTeX 论文",description:"源文件与编译 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},beamer_slides:{label:"幻灯",short:"PDF",title:"Beamer 幻灯",description:"幻灯源文件与 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},cheat_sheet:{label:"速查表",short:"A4",title:"密集 A4 速查表",description:"课程内容压缩 PDF",primaryTab:"渲染",sourceTab:"LaTeX"}},controls:{artifactType:"成果类型",search:"检索",searchMode:{auto:"自动",on:"开启",off:"关闭"},output:"输出",previewOnly:"仅预览",targetPages:"目标页数",a4:"A4",dense:"密集",pdfFirst:"PDF 优先",sourceKept:"保留源文件"},composer:{brief:"任务说明",briefPlaceholder:"粘贴作业要求、约束条件、评分期望与输出说明。",runNoteLogin:"登录后可使用生成控制。",runNoteBrief:"填写任务说明后即可生成。",runNoteUploads:"已选文件会在创建运行前上传。",runNoteRunning:"后端报告上下文与阶段事件后会同步更新。",runNoteReady:"已准备好创建本地生成运行。"},uploads:{label:"参考文件",choose:"拖入或选择参考文件",selected:"已选择 {count} 个参考文件",selectedPlural:"已选择 {count} 个参考文件",willUpload:"文件将在下一次运行前上传。",duplicates:"这些文件已在选择列表中。",uploaded:"已上传",uploading:"上传中",failed:"上传失败",unavailable:"当前后端构建未提供上传 API。",failedGeneric:"上传失败。",missingIds:"上传响应未返回全部文件编号。"},refinement:{label:"后续修订",availableAfterRun:"首次运行后可用",revisionSource:"修订来源 {id}",placeholder:"要求证明更严谨、注释更充分、幻灯更少，或调整结构。",note:"将创建新的运行；生成文件仍以磁盘成果为准。",missing:"请先填写后续修订要求。"},history:{label:"运行记录",entries:"{count} 条记录",readyTitle:"控制台就绪",readyMessage:"请选择成果类型，补充材料后开始运行。",followUpTitle:"后续修订请求",regenerateTitle:"重新生成请求",generationTitle:"生成请求",runTitle:"运行 {id}",folderPending:"文件夹待生成"},preview:{tabs:{logs:"日志",manifest:"清单"},statusMessage:"运行状态",emptyPdfTitle:"PDF 渲染器",emptyPdfMessage:"在成果文件可读取前，页面以 PDF 样式预览呈现。",deckTitle:"幻灯预览",deckMessage:"文件端点可用后，已编译 PDF 页面会替换当前骨架。",sheetTitle:"速查表预览",sheetMessage:"生成期间保持密集 PDF 样式页面可见。",failedTitle:"运行失败",failedMessage:"如源文件或日志已保留，可继续从运行文件夹检查。",runFolderPending:"运行文件夹待生成",files:"文件",pageLabel:"第 1 / 12 页",latexReport:"LaTeX 报告",generatedEssay:"生成论文",generatedSlidesSource:"生成幻灯",generatedSlides:"课程演示",introduction:"引言",argument:"论证",references:"参考文献",notebookApproach:"方法说明",notebookApproachBody:"先说明算法、边界情况与复杂度，再呈现实作单元。",markdown:"Markdown",code:"代码",notebookValidation:"Notebook 校验",preservedForInspection:"已保留供检查",noExecution:"仅预览，不执行",a4DenseLayout:"A4 密集版式",onePage:"{count} 页",manyPages:"{count} 页"},files:{scriptReady:"脚本输出",notebookReady:"Notebook 输出",logReady:"运行日志",metadataReady:"元数据",pdfReady:"已编译 PDF",deckReady:"已编译幻灯",sheetReady:"已编译速查表",sourceReady:"源文件已保留",compileLogReady:"编译日志",pending:"待生成",compilePending:"待编译"},source:{artifactNoteReady:"成果文件位于运行文件夹；浏览器内字节渲染需等待成果文件端点。",artifactNotePending:"后端接受运行后会生成运行文件夹。",generationLog:"generation.log",notStarted:"尚未开始",status:"状态",error:"错误"},auth:{kicker:"中大认证",loginTitle:"登录",registerTitle:"注册",email:"中大邮箱",password:"密码",confirmPassword:"确认密码",contacting:"正在联系本地后端...",failed:"认证失败。",expired:"会话已过期",created:"账户已创建，请登录。"},model:{settingsKicker:"模型设置",defaultName:"Qwen 默认配置",defaultButton:"默认 Qwen 配置",needsAttention:"模型需要处理",displayName:"显示名称",baseUrl:"Base URL",model:"模型",apiKey:"API key",newKey:"新密钥",savedKey:"已配置密钥",noSavedKey:"未保存密钥",environmentDefault:"环境默认配置",savedLoaded:"已载入保存配置。",defaultsLoaded:"已载入本地默认值。",loadFailed:"模型配置载入失败。",saving:"正在保存模型配置。",saved:"模型配置已保存。",saveFailed:"模型配置保存失败。",testing:"正在测试提供方连接。",testFailed:"提供方连接测试失败。",connectionOk:"{model} 连接正常。"},run:{ready:"就绪",required:"必填",addBrief:"请先填写任务说明。",preparingUploads:"正在准备参考文件上传。",submitting:"正在提交至本地后端。",requestFailed:"运行请求失败。",succeeded:"运行成功。",failed:"运行失败。",running:"运行正在进行。",queued:"运行已排队。",refreshFailed:"无法刷新运行状态。",statusRefreshFailed:"运行状态刷新失败。",pathCopied:"运行文件夹路径已复制。",pathRevealCopied:"运行文件夹路径已复制，可用于显示位置。",artifactPathCopied:"成果路径已复制。",previewCopied:"当前预览已复制。",clipboardUnavailable:"当前浏览器环境不可使用剪贴板。",validationIssue:"校验问题",artifactReady:"成果就绪",generating:"生成中",rendererArmed:"渲染器就绪",sourcePreserved:"可检查已保留源文件",copyOpenAvailable:"可复制或打开路径",completed:"已完成",syntaxPreview:"语法预览，不执行"},status:{idle:"空闲",queued:"排队中",running:"运行中",succeeded:"成功",failed:"失败",cancelled:"已取消"},stages:{compose:"编写",choose_intent:"选择成果",validate_request:"校验",upload_inputs:"上传输入",submit_run:"提交运行",queued:"排队",running:"运行",resolve_model:"模型",extract_context:"上下文",decide_search:"检索",generate_source:"生成",validate_source:"校验",compile_pdf:"编译 PDF",write_manifest:"清单",poll_status:"刷新",output_files:"输出文件",route:"路由",context:"上下文",generate:"生成",validate:"校验",write:"写作",compile:"编译",outline:"提纲",ingest:"摄取",compress:"压缩",layout:"排版"},context:{ok:"正常",warning:"注意",critical:"紧张",local:"本地估算",heuristic:"后端估算",provider:"提供方估算",input:"输入",output:"输出",total:"合计",limit:"上限",use:"占用",warningLabel:"提示",source:"来源",criticalSummary:"可能需要强压缩",warningSummary:"可能需要压缩",ratioSummary:"占上下文 {percent}",aria:"上下文预算{state}，已占用 {percent}，{source}"},errors:{required:"必填",absoluteHttpUrl:"请使用完整 http 或 https URL",enum:"请选择受支持的值",invalid:"值无效"}},"zh-Hant":{app:{title:"AI Learning Assistant - 成果工作室",brand:"AI Learning Assistant",userFallback:"使用者"},locale:{label:"介面語言"},mobile:{console:"控制台",preview:"預覽"},pane:{consoleKicker:"生產控制台",consoleTitle:"生成學術成果",previewKicker:"成果預覽"},actions:{model:"模型",copyPath:"複製路徑",reveal:"顯示位置",regenerate:"重新生成",copy:"複製",open:"開啟",runArtifact:"開始生成",runAgain:"再次執行",running:"執行中",newRevisionRun:"新修訂執行",copyVisible:"複製目前",test:"測試",save:"儲存",saving:"儲存中",login:"登入",createAccount:"建立帳戶",closeModel:"關閉模型設定",removeFile:"移除 {name}"},intents:{code_homework:{label:"程式",short:"PY",title:"作業程式",description:"腳本或 Notebook 答案",primaryTab:"程式",sourceTab:"原始檔"},essay_latex:{label:"論文",short:"TEX",title:"LaTeX 論文",description:"原始檔與編譯 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},beamer_slides:{label:"投影片",short:"PDF",title:"Beamer 投影片",description:"投影片原始檔與 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},cheat_sheet:{label:"速查表",short:"A4",title:"密集 A4 速查表",description:"課程內容壓縮 PDF",primaryTab:"渲染",sourceTab:"LaTeX"}},controls:{artifactType:"成果類型",search:"檢索",searchMode:{auto:"自動",on:"開啟",off:"關閉"},output:"輸出",previewOnly:"僅預覽",targetPages:"目標頁數",a4:"A4",dense:"密集",pdfFirst:"PDF 優先",sourceKept:"保留原始檔"},composer:{brief:"任務說明",briefPlaceholder:"貼上作業要求、限制條件、評分期望與輸出說明。",runNoteLogin:"登入後可使用生成控制。",runNoteBrief:"填寫任務說明後即可生成。",runNoteUploads:"已選文件會在建立執行前上傳。",runNoteRunning:"後端回報上下文與階段事件後會同步更新。",runNoteReady:"已準備好建立本地生成執行。"},uploads:{label:"參考文件",choose:"拖入或選擇參考文件",selected:"已選擇 {count} 個參考文件",selectedPlural:"已選擇 {count} 個參考文件",willUpload:"文件將在下一次執行前上傳。",duplicates:"這些文件已在選擇列表中。",uploaded:"已上傳",uploading:"上傳中",failed:"上傳失敗",unavailable:"目前後端構建未提供上傳 API。",failedGeneric:"上傳失敗。",missingIds:"上傳回應未返回全部文件編號。"},refinement:{label:"後續修訂",availableAfterRun:"首次執行後可用",revisionSource:"修訂來源 {id}",placeholder:"要求證明更嚴謹、註釋更充分、投影片更少，或調整結構。",note:"將建立新的執行；生成文件仍以磁碟成果為準。",missing:"請先填寫後續修訂要求。"},history:{label:"執行記錄",entries:"{count} 條記錄",readyTitle:"控制台就緒",readyMessage:"請選擇成果類型，補充材料後開始執行。",followUpTitle:"後續修訂請求",regenerateTitle:"重新生成請求",generationTitle:"生成請求",runTitle:"執行 {id}",folderPending:"資料夾待生成"},preview:{tabs:{logs:"日誌",manifest:"清單"},statusMessage:"執行狀態",emptyPdfTitle:"PDF 渲染器",emptyPdfMessage:"在成果文件可讀取前，頁面以 PDF 樣式預覽呈現。",deckTitle:"投影片預覽",deckMessage:"文件端點可用後，已編譯 PDF 頁面會替換目前骨架。",sheetTitle:"速查表預覽",sheetMessage:"生成期間保持密集 PDF 樣式頁面可見。",failedTitle:"執行失敗",failedMessage:"如原始檔或日誌已保留，可繼續從執行資料夾檢查。",runFolderPending:"執行資料夾待生成",files:"文件",pageLabel:"第 1 / 12 頁",latexReport:"LaTeX 報告",generatedEssay:"生成論文",generatedSlidesSource:"生成投影片",generatedSlides:"課程演示",introduction:"引言",argument:"論證",references:"參考文獻",notebookApproach:"方法說明",notebookApproachBody:"先說明演算法、邊界情況與複雜度，再呈現實作單元。",markdown:"Markdown",code:"程式",notebookValidation:"Notebook 校驗",preservedForInspection:"已保留供檢查",noExecution:"僅預覽，不執行",a4DenseLayout:"A4 密集版式",onePage:"{count} 頁",manyPages:"{count} 頁"},files:{scriptReady:"腳本輸出",notebookReady:"Notebook 輸出",logReady:"執行日誌",metadataReady:"元資料",pdfReady:"已編譯 PDF",deckReady:"已編譯投影片",sheetReady:"已編譯速查表",sourceReady:"原始檔已保留",compileLogReady:"編譯日誌",pending:"待生成",compilePending:"待編譯"},source:{artifactNoteReady:"成果文件位於執行資料夾；瀏覽器內位元組渲染需等待成果文件端點。",artifactNotePending:"後端接受執行後會生成執行資料夾。",generationLog:"generation.log",notStarted:"尚未開始",status:"狀態",error:"錯誤"},auth:{kicker:"中大認證",loginTitle:"登入",registerTitle:"註冊",email:"中大電郵",password:"密碼",confirmPassword:"確認密碼",contacting:"正在聯絡本地後端...",failed:"認證失敗。",expired:"會話已過期",created:"帳戶已建立，請登入。"},model:{settingsKicker:"模型設定",defaultName:"Qwen 預設配置",defaultButton:"預設 Qwen 配置",needsAttention:"模型需要處理",displayName:"顯示名稱",baseUrl:"Base URL",model:"模型",apiKey:"API key",newKey:"新密鑰",savedKey:"已配置密鑰",noSavedKey:"未儲存密鑰",environmentDefault:"環境預設配置",savedLoaded:"已載入儲存配置。",defaultsLoaded:"已載入本地預設值。",loadFailed:"模型配置載入失敗。",saving:"正在儲存模型配置。",saved:"模型配置已儲存。",saveFailed:"模型配置儲存失敗。",testing:"正在測試提供方連線。",testFailed:"提供方連線測試失敗。",connectionOk:"{model} 連線正常。"},run:{ready:"就緒",required:"必填",addBrief:"請先填寫任務說明。",preparingUploads:"正在準備參考文件上傳。",submitting:"正在提交至本地後端。",requestFailed:"執行請求失敗。",succeeded:"執行成功。",failed:"執行失敗。",running:"執行正在進行。",queued:"執行已排隊。",refreshFailed:"無法刷新執行狀態。",statusRefreshFailed:"執行狀態刷新失敗。",pathCopied:"執行資料夾路徑已複製。",pathRevealCopied:"執行資料夾路徑已複製，可用於顯示位置。",artifactPathCopied:"成果路徑已複製。",previewCopied:"目前預覽已複製。",clipboardUnavailable:"目前瀏覽器環境不可使用剪貼簿。",validationIssue:"校驗問題",artifactReady:"成果就緒",generating:"生成中",rendererArmed:"渲染器就緒",sourcePreserved:"可檢查已保留原始檔",copyOpenAvailable:"可複製或開啟路徑",completed:"已完成",syntaxPreview:"語法預覽，不執行"},status:{idle:"閒置",queued:"排隊中",running:"執行中",succeeded:"成功",failed:"失敗",cancelled:"已取消"},stages:{compose:"撰寫",choose_intent:"選擇成果",validate_request:"校驗",upload_inputs:"上傳輸入",submit_run:"提交執行",queued:"排隊",running:"執行",resolve_model:"模型",extract_context:"上下文",decide_search:"檢索",generate_source:"生成",validate_source:"校驗",compile_pdf:"編譯 PDF",write_manifest:"清單",poll_status:"刷新",output_files:"輸出文件",route:"路由",context:"上下文",generate:"生成",validate:"校驗",write:"寫作",compile:"編譯",outline:"提綱",ingest:"攝取",compress:"壓縮",layout:"排版"},context:{ok:"正常",warning:"注意",critical:"緊張",local:"本地估算",heuristic:"後端估算",provider:"提供方估算",input:"輸入",output:"輸出",total:"合計",limit:"上限",use:"佔用",warningLabel:"提示",source:"來源",criticalSummary:"可能需要強壓縮",warningSummary:"可能需要壓縮",ratioSummary:"佔上下文 {percent}",aria:"上下文預算{state}，已佔用 {percent}，{source}"},errors:{required:"必填",absoluteHttpUrl:"請使用完整 http 或 https URL",enum:"請選擇受支援的值",invalid:"值無效"}}},Ie="/ui/assets/context-budget-dial-critical-NHRAQxeA.png",Ce="/ui/assets/context-budget-dial-ok-CjS2UYST.png",qe="/ui/assets/context-budget-dial-warning-D8umyfoM.png",De="/ui/assets/auth-entry-preview-D2ClQ5ne.png",Oe="/ui/assets/empty-workbench-preview-B8cAaNFx.png",b=window.__AI_LEARNING_ASSISTANT_API_URL||window.location.origin,X="ai_learning_assistant_token",V="ai_learning_assistant_user",re="ai_learning_assistant_locale",w=128e3,Ue=1200,ie=new Set(["succeeded","failed","cancelled"]),W="en",M={ok:Ce,warning:qe,critical:Ie},K=rn(),y={displayName:"Qwen Default",provider:"openai_compatible",baseUrl:"https://example-compatible-endpoint/v1",model:"qwen-model-name",apiKey:""},j=[{id:"code_homework",outputs:["solution.py","solution.ipynb"],stages:["route","context","generate","validate"],accent:"clay"},{id:"essay_latex",outputs:["main.pdf","main.tex"],stages:["route","context","write","compile"],accent:"sage"},{id:"beamer_slides",outputs:["slides.pdf","slides.tex"],stages:["route","outline","write","compile"],accent:"amber"},{id:"cheat_sheet",outputs:["cheat-sheet.pdf","cheat-sheet.tex"],stages:["ingest","compress","layout","compile"],accent:"coral"}],t={locale:K,authMode:"login",token:localStorage.getItem(X)||"",user:dn(),activePane:"console",intent:"code_homework",outputPreference:"py",searchMode:"auto",targetPages:2,taskText:"",refinementText:"",files:[],fieldErrors:{},context:null,previewTab:"primary",activeFile:"solution.py",notice:{message:"",tone:"neutral"},model:{editorOpen:!1,profiles:[],profile:null,form:{...y},fieldErrors:{},statusMessage:"",statusTone:"neutral",busy:""},authMessage:"",authTone:"neutral",run:N(K),history:[on(K)]},Be=document.getElementById("app");let R=null;Ke();function Ke(){Se(),m(),H(),d(),t.token&&ze()}async function ze(){try{const e=await fetch(`${b}/api/auth/me`,{headers:{Authorization:`Bearer ${t.token}`}});if(!e.ok)throw new Error(a("auth.expired"));const n=await e.json();ue(n,t.token)}catch{ce(),d()}}function d(){const e=!!(t.user&&t.token);Se(),Be.innerHTML=`
        <div class="studio-app ${e?"":"is-auth-entry"}" data-mobile-pane="${r(t.activePane)}" lang="${r(t.locale)}">
            <main class="studio-main">
                ${e?`${je()}
                            <section class="workbench-grid" aria-label="${r(a("app.title"))}">
                                ${He(e)}
                                ${tt(e)}
                            </section>`:Qe()}
                ${e&&t.model.editorOpen?bt():""}
            </main>
        </div>
    `,yt(),e&&F()}function se(){return`
        <div class="locale-switch" role="group" aria-label="${r(a("locale.label"))}">
            ${ae.map(e=>`
                <button
                    type="button"
                    class="${t.locale===e.id?"is-active":""}"
                    data-locale="${r(e.id)}"
                    title="${r(e.name)}"
                    aria-label="${r(e.name)}"
                >${r(e.label)}</button>
            `).join("")}
        </div>
    `}function je(){return`
        <nav class="mobile-pane-switch" aria-label="${r(a("app.title"))}">
            <button type="button" class="${t.activePane==="console"?"is-active":""}" data-pane="console">${r(a("mobile.console"))}</button>
            <button type="button" class="${t.activePane==="preview"?"is-active":""}" data-pane="preview">${r(a("mobile.preview"))}</button>
        </nav>
    `}function He(e){return`
        <section class="console-pane workbench-pane" aria-label="${r(a("pane.consoleKicker"))}">
            <div class="pane-head">
                <div>
                    <div class="pane-kicker">${r(a("pane.consoleKicker"))}</div>
                    <h1>${r(a("pane.consoleTitle"))}</h1>
                </div>
                <div class="pane-actions">
                    ${se()}
                    <button class="tool-button" type="button" data-action="open-model-settings" ${e?"":"disabled"}>
                        <span class="tool-glyph" aria-hidden="true"></span>
                        <span>${r(_t())}</span>
                    </button>
                    <button class="identity-chip" type="button" data-action="logout">
                        <span>${r(t.user?.email||a("app.userFallback"))}</span>
                        <strong>${r(t.user?.role||"")}</strong>
                    </button>
                </div>
            </div>

            <div class="console-utility-row">
                ${vt()}
                ${Ve()}
            </div>

            <div class="artifact-type-bar" role="radiogroup" aria-label="${r(a("controls.artifactType"))}">
                ${j.map(Xe).join("")}
            </div>

            <section class="command-composer" aria-label="${r(a("composer.brief"))}">
                <div class="composer-head">
                    <label class="field-label" for="task-text">${r(a("composer.brief"))}</label>
                    <span>${r(g(L().id,"description"))}</span>
                </div>
                <textarea
                    id="task-text"
                    class="task-input ${t.fieldErrors.task_text?"has-error":""}"
                    rows="8"
                    placeholder="${r(a("composer.briefPlaceholder"))}"
                >${r(t.taskText)}</textarea>
                ${t.fieldErrors.task_text?`<div class="field-error">${r(t.fieldErrors.task_text)}</div>`:""}
                ${We()}
                ${Ge()}
                <div class="composer-actions">
                    <button class="run-button" type="button" data-action="run" ${Q(e)?"":"disabled"}>
                        <span class="run-glyph" aria-hidden="true"></span>
                        <span data-run-button-label>${xe()}</span>
                    </button>
                    <span class="run-note" data-run-note>${r(Te(e))}</span>
                </div>
            </section>

            ${Ze(e)}
            ${Ye()}
        </section>
    `}function Xe(e){const n=t.intent===e.id;return`
        <button
            type="button"
            class="artifact-type ${n?"is-active":""}"
            data-intent="${e.id}"
            data-accent="${e.accent}"
            role="radio"
            aria-checked="${n}"
        >
            <span class="artifact-short">${r(g(e.id,"short"))}</span>
            <span>
                <strong>${r(g(e.id,"label"))}</strong>
                <small>${r(g(e.id,"title"))}</small>
            </span>
        </button>
    `}function Ve(){return`
        <div class="search-control">
            <span class="field-label">${r(a("controls.search"))}</span>
            <div class="segmented-control" data-control="search-mode">
                ${["auto","on","off"].map(e=>`
                    <button type="button" class="${t.searchMode===e?"is-active":""}" data-search-mode="${e}">
                        ${r(a(`controls.searchMode.${e}`))}
                    </button>
                `).join("")}
            </div>
        </div>
    `}function We(){return t.intent==="code_homework"?`
            <div class="option-row">
                <div>
                    <span class="field-label">${r(a("controls.output"))}</span>
                    <div class="segmented-control is-tight" data-control="code-output">
                        <button type="button" class="${t.outputPreference==="py"?"is-active":""}" data-output-preference="py">.py</button>
                        <button type="button" class="${t.outputPreference==="ipynb"?"is-active":""}" data-output-preference="ipynb">.ipynb</button>
                    </div>
                </div>
                <div class="status-capsule">${r(a("controls.previewOnly"))}</div>
            </div>
        `:t.intent==="cheat_sheet"?`
            <div class="option-row">
                <label class="number-field">
                    <span class="field-label">${r(a("controls.targetPages"))}</span>
                    <input id="target-pages" class="${t.fieldErrors.target_pages?"has-error":""}" type="number" min="1" max="12" value="${t.targetPages}">
                </label>
                <div class="status-capsule">${r(a("controls.a4"))}</div>
                <div class="status-capsule">${r(a("controls.dense"))}</div>
            </div>
            ${t.fieldErrors.target_pages?`<div class="field-error">${r(t.fieldErrors.target_pages)}</div>`:""}
        `:`
        <div class="option-row">
            <div class="status-capsule">${r(a("controls.pdfFirst"))}</div>
            <div class="status-capsule">${r(a("controls.sourceKept"))}</div>
        </div>
    `}function Ge(){const e=t.files.length?a(t.files.length===1?"uploads.selected":"uploads.selectedPlural",{count:t.files.length}):a("uploads.choose");return`
        <section class="upload-module" aria-label="${r(a("uploads.label"))}">
            <div class="upload-zone" data-action="open-file-picker" role="button" tabindex="0">
                <input id="file-input" type="file" multiple>
                <span class="upload-mark" aria-hidden="true"></span>
                <div>
                    <strong>${r(a("uploads.label"))}</strong>
                    <span>${r(e)}</span>
                </div>
            </div>
            ${t.files.length?Je():""}
            ${t.notice.message?`<div class="inline-notice is-${t.notice.tone}">${r(t.notice.message)}</div>`:""}
        </section>
    `}function Je(){return`
        <div class="selected-files">
            ${t.files.map(e=>`
                <div class="selected-file" data-file-key="${r(e.key)}">
                    <span class="file-kind">${r(an(e.name))}</span>
                    <span class="file-name">${r(e.name)}</span>
                    <small>${r(nn(e))}</small>
                    <button class="icon-action" type="button" data-remove-file="${r(e.key)}" aria-label="${r(a("actions.removeFile",{name:e.name}))}">x</button>
                </div>
            `).join("")}
        </div>
    `}function Qe(){return`
        <section class="auth-entry" aria-label="${r(a("auth.kicker"))}">
            <div class="auth-entry-shell">
                <div class="auth-entry-preview" aria-hidden="true">
                    <img src="${r(De)}" alt="">
                    <div class="auth-preview-paper">
                        <span class="auth-preview-rule"></span>
                        <div class="auth-preview-brand">${r(a("app.brand"))}</div>
                        <i></i><i></i><i></i>
                    </div>
                </div>
                ${oe()}
            </div>
        </section>
    `}function Ze(e){const n=!e||!t.run.id||t.run.status==="queued"||t.run.status==="running";return`
        <section class="refinement-composer" aria-label="${r(a("refinement.label"))}">
            <div class="composer-head">
                <label class="field-label" for="refinement-text">${r(a("refinement.label"))}</label>
                <span>${r(t.run.id?a("refinement.revisionSource",{id:Fe(t.run.id)}):a("refinement.availableAfterRun"))}</span>
            </div>
            <textarea
                id="refinement-text"
                rows="3"
                placeholder="${r(a("refinement.placeholder"))}"
                ${n?"disabled":""}
            >${r(t.refinementText)}</textarea>
            <div class="composer-actions">
                <button class="secondary-action" type="button" data-action="run-refinement" ${n||!t.refinementText.trim()?"disabled":""}>
                    ${r(a("actions.newRevisionRun"))}
                </button>
                <span class="run-note" data-refinement-note>${r(a("refinement.note"))}</span>
            </div>
        </section>
    `}function Ye(){return`
        <section class="history-stream" aria-label="${r(a("history.label"))}">
            <div class="history-head">
                <span>${r(a("history.label"))}</span>
                <small>${r(a("history.entries",{count:t.history.length}))}</small>
            </div>
            <div class="history-list">
                ${t.history.slice().reverse().map(et).join("")}
            </div>
        </section>
    `}function et(e){return`
        <article class="history-item is-${r(e.kind)}" data-status="${r(e.status||"idle")}">
            <div class="history-marker"></div>
            <div class="history-content">
                <div class="history-title">
                    <strong>${r(e.title)}</strong>
                    <span>${r(cn(e.timestamp))}</span>
                </div>
                <p>${r(e.message)}</p>
                ${e.meta?`<div class="history-meta">${r(e.meta)}</div>`:""}
            </div>
        </article>
    `}function tt(e){const n=L();return`
        <section class="preview-pane workbench-pane" aria-label="${r(a("pane.previewKicker"))}">
            <div class="preview-header">
                <div>
                    <div class="pane-kicker">${r(a("pane.previewKicker"))}</div>
                    <h2>${r(g(n.id,"title"))}</h2>
                </div>
                <div class="preview-actions">
                    <button class="secondary-action" type="button" data-action="copy-current-path" ${t.run.outputRoot?"":"disabled"}>${r(a("actions.copyPath"))}</button>
                    <button class="secondary-action" type="button" data-action="reveal-run" ${t.run.outputRoot?"":"disabled"}>${r(a("actions.reveal"))}</button>
                    <button class="secondary-action" type="button" data-action="regenerate" ${Q(e)?"":"disabled"}>${r(a("actions.regenerate"))}</button>
                </div>
            </div>

            <div class="preview-status-strip">
                ${nt()}
                ${at(n)}
            </div>

            <div class="preview-shell" data-intent="${r(t.intent)}" data-run-status="${r(t.run.status)}" style="--preview-empty-image: url('${r(Oe)}')">
                ${rt()}
                <div class="preview-body">
                    ${it()}
                </div>
            </div>

            ${mt()}
        </section>
    `}function nt(){return`
        <div class="run-status-pill" data-status="${r(t.run.status)}">
            <span class="status-light"></span>
            <div>
                <strong>${r(Re(t.run.status))}</strong>
                <span>${r(h(t.run.stage))}</span>
            </div>
        </div>
        <p class="run-message">${r(t.run.error||t.run.message)}</p>
    `}function at(e){const n=tn(t.run.stage,t.run.status);return`
        <div class="stage-track" aria-label="${r(a("preview.statusMessage"))}">
            ${e.stages.map(i=>`
                <span class="${i===n?"is-active":""}">${r(h(i))}</span>
            `).join("")}
        </div>
    `}function rt(){const e=zt();return`
        <div class="preview-tabs" role="tablist" aria-label="${r(a("pane.previewKicker"))}">
            ${e.map(n=>`
                <button type="button" role="tab" class="${t.previewTab===n.id?"is-active":""}" data-preview-tab="${n.id}">
                    ${r(n.label)}
                </button>
            `).join("")}
        </div>
    `}function it(){return t.previewTab==="source"?ct():t.previewTab==="logs"?pt():t.previewTab==="manifest"?ft():t.intent==="code_homework"?st():t.intent==="essay_latex"?lt():t.intent==="beamer_slides"?dt():ut()}function st(){return t.outputPreference==="ipynb"?ot():`
        <div class="code-product">
            <div class="code-tabs">
                ${$e().map(n=>`
                    <button type="button" class="${t.activeFile===n?"is-active":""}" data-active-file="${r(n)}">
                        ${r(n)}
                    </button>
                `).join("")}
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${r(a("actions.copyVisible"))}</button>
            </div>
            <div class="code-editor" aria-label="${r(a("preview.code"))}">
                ${D(Y(t.activeFile))}
            </div>
            <div class="terminal-strip" data-status="${r(t.run.status)}">
                <span>${r(Yt())}</span>
                <strong>${r(en())}</strong>
            </div>
        </div>
    `}function ot(){return`
        <div class="notebook-product">
            <div class="notebook-toolbar">
                <span>solution.ipynb</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${r(a("actions.copyVisible"))}</button>
            </div>
            <div class="notebook-cell is-markdown">
                <span class="cell-label">${r(a("preview.markdown"))}</span>
                <h3>${r(a("preview.notebookApproach"))}</h3>
                <p>${r(a("preview.notebookApproachBody"))}</p>
            </div>
            <div class="notebook-cell">
                <span class="cell-label">${r(a("preview.code"))}</span>
                <div class="code-editor is-compact">${D(ke())}</div>
            </div>
            <div class="terminal-strip" data-status="${r(t.run.status)}">
                <span>${r(a("preview.notebookValidation"))}</span>
                <strong>${r(t.run.status==="failed"?a("preview.preservedForInspection"):a("preview.noExecution"))}</strong>
            </div>
        </div>
    `}function lt(){return`
        <div class="pdf-stage">
            <div class="page-rail">
                <span class="is-active">1</span>
                <span>2</span>
                <span>3</span>
            </div>
            <article class="pdf-page essay-page">
                <header>
                    <span class="paper-overline">${r(a("preview.latexReport"))}</span>
                    <h3>${r(q(a("preview.generatedEssay")))}</h3>
                    <div class="paper-rule"></div>
                </header>
                <section>
                    <h4>${r(a("preview.introduction"))}</h4>
                    <p></p><p class="short"></p>
                    <h4>${r(a("preview.argument"))}</h4>
                    <p></p><p></p><p class="shorter"></p>
                    <h4>${r(a("preview.references"))}</h4>
                    <p class="short"></p>
                </section>
            </article>
            ${G(a("preview.emptyPdfTitle"),a("preview.emptyPdfMessage"))}
        </div>
    `}function dt(){return`
        <div class="slide-product">
            <aside class="slide-thumbs" aria-label="${r(a("preview.deckTitle"))}">
                <span class="is-active"></span>
                <span></span>
                <span></span>
                <span></span>
            </aside>
            <div class="slide-canvas">
                <div class="slide-page">
                    <span class="slide-kicker">${r(g("beamer_slides","title"))}</span>
                    <h3>${r(q(a("preview.generatedSlides")))}</h3>
                    <div class="slide-columns">
                        <span></span><span></span><span></span><span></span>
                    </div>
                    <div class="slide-footer">${r(a("preview.pageLabel"))}</div>
                </div>
            </div>
            ${G(a("preview.deckTitle"),a("preview.deckMessage"))}
        </div>
    `}function ut(){const e=Math.max(1,Math.round(Number(t.targetPages)||1));return`
        <div class="cheat-product">
            <div class="cheat-toolbar">
                <span>${r(a("preview.a4DenseLayout"))}</span>
                <strong>${r(a(e===1?"preview.onePage":"preview.manyPages",{count:e}))}</strong>
            </div>
            <div class="cheat-pages">
                ${Array.from({length:Math.min(e,4)},(n,i)=>`
                    <article class="cheat-page">
                        <header>
                            <span></span><span></span>
                        </header>
                        <div class="cheat-grid">
                            ${Array.from({length:36},(s,l)=>`
                                <i class="${(l+i)%7===0?"is-strong":""}"></i>
                            `).join("")}
                        </div>
                    </article>
                `).join("")}
            </div>
            ${G(a("preview.sheetTitle"),a("preview.sheetMessage"))}
        </div>
    `}function G(e,n){return t.run.status==="succeeded"&&t.run.outputRoot?"":t.run.status==="failed"?`
            <div class="preview-overlay is-error">
                <strong>${r(t.run.errorCode||a("preview.failedTitle"))}</strong>
                <span>${r(t.run.error||a("preview.failedMessage"))}</span>
            </div>
        `:t.run.status==="queued"||t.run.status==="running"?`
            <div class="preview-overlay is-running">
                <strong>${r(h(t.run.stage))}</strong>
                <span>${r(t.run.message)}</span>
            </div>
        `:`
        <div class="preview-overlay">
            <strong>${r(e)}</strong>
            <span>${r(n)}</span>
        </div>
    `}function ct(){const e=jt(),n=e.endsWith(".tex")?"latex":e.endsWith(".json")?"json":"python";return`
        <div class="inspection-product">
            <div class="inspection-head">
                <span>${r(e)}</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${r(a("actions.copyVisible"))}</button>
            </div>
            <div class="code-editor">${D(_e(),n)}</div>
            <div class="inspection-note">${r(O())}</div>
        </div>
    `}function pt(){return`
        <div class="inspection-product">
            <div class="inspection-head">
                <span>${r(a("source.generationLog"))}</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${r(a("actions.copyVisible"))}</button>
            </div>
            <div class="log-view">
                <p><span>${r(pn())}</span> ${r(h(t.run.stage))}: ${r(t.run.message)}</p>
                <p><span>run</span> ${t.run.id?r(t.run.id):r(a("source.notStarted"))}</p>
                <p><span>${r(a("source.status"))}</span> ${r(Re(t.run.status))}</p>
                ${t.run.error?`<p class="is-error"><span>${r(a("source.error"))}</span> ${r(t.run.error)}</p>`:""}
            </div>
            <div class="inspection-note">${r(O())}</div>
        </div>
    `}function ft(){const e={schema_version:1,run_id:t.run.id||null,revision_of_run_id:t.run.revisionOfRunId||null,intent:t.intent,search:{mode:t.searchMode},status:t.run.status,outputs:Z().map(n=>({path:n.relativePath,kind:n.kind}))};return`
        <div class="inspection-product">
            <div class="inspection-head">
                <span>manifest.json</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${r(a("actions.copyVisible"))}</button>
            </div>
            <div class="code-editor">${D(JSON.stringify(e,null,2),"json")}</div>
            <div class="inspection-note">${r(O())}</div>
        </div>
    `}function mt(){const e=Z();return`
        <section class="output-dock" aria-label="${r(a("preview.files"))}">
            <div class="output-head">
                <span>${r(a("preview.files"))}</span>
                <small>${t.run.outputRoot?r(Me(t.run.outputRoot)):r(a("preview.runFolderPending"))}</small>
            </div>
            <div class="output-grid">
                ${e.map(n=>gt(n)).join("")}
            </div>
        </section>
    `}function gt(e){const n=Zt(e.relativePath),i=!!(t.run.outputRoot&&(t.run.status==="succeeded"||e.kind!=="pdf"));return`
        <div class="output-file" data-kind="${r(e.kind)}">
            <span class="file-kind">${r(e.badge)}</span>
            <div>
                <strong>${r(e.name)}</strong>
                <small>${r(i?e.readyLabel:e.pendingLabel)}</small>
            </div>
            <div class="file-actions">
                <button type="button" data-copy-file="${r(n||e.relativePath)}" ${n?"":"disabled"}>${r(a("actions.copy"))}</button>
                <button type="button" data-open-file="${r(n||"")}" ${n?"":"disabled"}>${r(a("actions.open"))}</button>
            </div>
        </div>
    `}function vt(){const e=ye();return`
        <div class="context-widget" tabindex="0" data-context-state="${r(e.warning_level)}" aria-label="${r(Ee(e))}">
            <div class="dial-ring" aria-hidden="true">
                <img src="${r(M[e.warning_level]||M.ok)}" alt="">
                <span data-context-field="state">${r(x(e.warning_level))}</span>
            </div>
            <div class="context-copy">
                <strong data-context-field="source-label">${r(T(e.source))}</strong>
                <span data-context-field="summary">${r(Ae(e))}</span>
            </div>
            <div class="context-popover" role="tooltip">
                <div><span>${r(a("context.input"))}</span><strong data-context-field="input">${v(e.estimated_input_tokens)}</strong></div>
                <div><span>${r(a("context.output"))}</span><strong data-context-field="output">${v(e.estimated_output_tokens)}</strong></div>
                <div><span>${r(a("context.total"))}</span><strong data-context-field="total">${v(e.estimated_total_tokens)}</strong></div>
                <div><span>${r(a("context.limit"))}</span><strong data-context-field="limit">${v(e.context_window_limit)}</strong></div>
                <div><span>${r(a("context.use"))}</span><strong data-context-field="utilization">${U(e.utilization_ratio)}</strong></div>
                <div><span>${r(a("context.warningLabel"))}</span><strong data-context-field="warning">${r(x(e.warning_level))}</strong></div>
                <div><span>${r(a("context.source"))}</span><strong data-context-field="source">${r(T(e.source))}</strong></div>
            </div>
        </div>
    `}function oe(){return`
        <section class="auth-panel" aria-label="${r(a("auth.kicker"))}">
            <div class="auth-head">
                <div>
                    <div class="pane-kicker">${r(a("auth.kicker"))}</div>
                    <h2>${r(t.authMode==="login"?a("auth.loginTitle"):a("auth.registerTitle"))}</h2>
                </div>
                <div class="auth-head-actions">
                    ${se()}
                    <div class="auth-tabs">
                        <button type="button" class="${t.authMode==="login"?"is-active":""}" data-auth-mode="login">${r(a("actions.login"))}</button>
                        <button type="button" class="${t.authMode==="register"?"is-active":""}" data-auth-mode="register">${r(a("auth.registerTitle"))}</button>
                    </div>
                </div>
            </div>
            <form id="auth-form" class="auth-form">
                <label>
                    <span class="field-label">${r(a("auth.email"))}</span>
                    <input id="auth-email" type="email" autocomplete="email" placeholder="name@cuhk.edu.hk">
                </label>
                <label>
                    <span class="field-label">${r(a("auth.password"))}</span>
                    <input id="auth-password" type="password" autocomplete="${t.authMode==="login"?"current-password":"new-password"}">
                </label>
                ${t.authMode==="register"?`<label>
                            <span class="field-label">${r(a("auth.confirmPassword"))}</span>
                            <input id="auth-confirm" type="password" autocomplete="new-password">
                        </label>`:""}
                <button class="run-button is-full" type="submit">${r(t.authMode==="login"?a("actions.login"):a("actions.createAccount"))}</button>
                <div class="inline-notice is-${t.authTone}">${r(t.authMessage)}</div>
            </form>
        </section>
    `}function bt(){const e=t.model.form,n=t.model.profile,i=n?.api_key_ref?a("model.savedKey"):a("model.noSavedKey"),s=!!t.model.busy;return`
        <section class="model-modal" role="dialog" aria-modal="true" aria-label="${r(a("model.settingsKicker"))}">
            <div class="model-dialog">
                <div class="model-dialog-head">
                    <div>
                        <div class="pane-kicker">${r(a("model.settingsKicker"))}</div>
                        <h2>${r(e.displayName||a("model.defaultName"))}</h2>
                    </div>
                    <button class="icon-action is-large" type="button" data-action="close-model-settings" aria-label="${r(a("actions.closeModel"))}">x</button>
                </div>
                <form id="model-settings-form" class="model-form" novalidate>
                    ${S("displayName",a("model.displayName"),"text",e.displayName,a("model.defaultName"),!1)}
                    ${S("baseUrl",a("model.baseUrl"),"url",e.baseUrl,"https://example-compatible-endpoint/v1",!0)}
                    ${S("model",a("model.model"),"text",e.model,"qwen-model-name",!0)}
                    ${S("apiKey",a("model.apiKey"),"password",e.apiKey,n?.api_key_ref?a("model.newKey"):a("model.apiKey"),!1,"new-password")}
                    <div class="model-secret-row">
                        <span class="key-state ${n?.api_key_ref?"is-ready":""}">${r(i)}</span>
                        <span class="profile-id">${r(n?.id||a("model.environmentDefault"))}</span>
                    </div>
                    <div class="model-actions">
                        <button class="secondary-action" type="button" data-action="test-model-settings" ${s?"disabled":""}>${r(a("actions.test"))}</button>
                        <button class="run-button" type="submit" ${s?"disabled":""}>${r(t.model.busy==="save"?a("actions.saving"):a("actions.save"))}</button>
                    </div>
                    <div class="inline-notice is-${t.model.statusTone}">${r(t.model.statusMessage)}</div>
                </form>
            </div>
        </section>
    `}function S(e,n,i,s,l,o,u="off"){const c=t.model.fieldErrors[e]||"";return`
        <label class="model-field ${c?"has-error":""}">
            <span class="field-label">${r(n)}</span>
            <input
                data-model-field="${e}"
                type="${i}"
                value="${r(s)}"
                placeholder="${r(l)}"
                autocomplete="${r(u)}"
                ${o?"required":""}
            >
            <span class="field-error">${r(c)}</span>
        </label>
    `}function yt(){le(),de(),document.querySelectorAll("[data-pane]").forEach(n=>{n.addEventListener("click",()=>{t.activePane=n.dataset.pane,d()})}),document.getElementById("task-text")?.addEventListener("input",n=>{t.taskText=n.target.value,delete t.fieldErrors.task_text,n.target.classList.remove("has-error"),n.target.closest(".command-composer")?.querySelector(".field-error")?.remove(),m(),F(),te()}),document.getElementById("refinement-text")?.addEventListener("input",n=>{t.refinementText=n.target.value,m(),F(),te()}),document.querySelectorAll("[data-intent]").forEach(n=>{n.addEventListener("click",()=>{t.intent=n.dataset.intent,t.previewTab="primary",t.fieldErrors={},H(),m(),d()})}),document.querySelectorAll("[data-search-mode]").forEach(n=>{n.addEventListener("click",()=>{t.searchMode=n.dataset.searchMode,d()})}),document.querySelectorAll("[data-output-preference]").forEach(n=>{n.addEventListener("click",()=>{t.outputPreference=n.dataset.outputPreference,H(),m(),d()})}),document.getElementById("target-pages")?.addEventListener("input",n=>{const i=Number(n.target.value);t.targetPages=Number.isFinite(i)&&i>0?Math.round(i):1,delete t.fieldErrors.target_pages,m(),F()});const e=document.querySelector("[data-action='open-file-picker']");e?.addEventListener("click",()=>document.getElementById("file-input")?.click()),e?.addEventListener("keydown",n=>{n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),document.getElementById("file-input")?.click())}),document.getElementById("file-input")?.addEventListener("change",n=>{Bt(Array.from(n.target.files||[])),d()}),document.querySelectorAll("[data-remove-file]").forEach(n=>{n.addEventListener("click",()=>{t.files=t.files.filter(i=>i.key!==n.dataset.removeFile),m(),d()})}),document.querySelector("[data-action='run']")?.addEventListener("click",()=>z({isRevision:!1})),document.querySelector("[data-action='run-refinement']")?.addEventListener("click",()=>z({isRevision:!0})),document.querySelector("[data-action='regenerate']")?.addEventListener("click",()=>z({isRevision:!1,isRegenerate:!0})),document.querySelector("[data-action='logout']")?.addEventListener("click",()=>{_(),ce(),d()}),document.querySelector("[data-action='open-model-settings']")?.addEventListener("click",Pt),document.querySelector("[data-action='close-model-settings']")?.addEventListener("click",pe),document.getElementById("model-settings-form")?.addEventListener("submit",Lt),document.querySelector("[data-action='test-model-settings']")?.addEventListener("click",St),document.querySelectorAll("[data-model-field]").forEach(n=>{n.addEventListener("input",()=>{t.model.form[n.dataset.modelField]=n.value,delete t.model.fieldErrors[n.dataset.modelField],n.closest(".model-field")?.classList.remove("has-error");const i=n.closest(".model-field")?.querySelector(".field-error");i&&(i.textContent="")})}),document.querySelectorAll("[data-preview-tab]").forEach(n=>{n.addEventListener("click",()=>{t.previewTab=n.dataset.previewTab,d()})}),document.querySelectorAll("[data-active-file]").forEach(n=>{n.addEventListener("click",()=>{t.activeFile=n.dataset.activeFile,d()})}),document.querySelector("[data-action='copy-visible-preview']")?.addEventListener("click",Gt),document.querySelector("[data-action='copy-current-path']")?.addEventListener("click",()=>I(t.run.outputRoot||"",a("run.pathCopied"))),document.querySelector("[data-action='reveal-run']")?.addEventListener("click",Jt),document.querySelectorAll("[data-copy-file]").forEach(n=>{n.addEventListener("click",()=>I(n.dataset.copyFile||"",a("run.artifactPathCopied")))}),document.querySelectorAll("[data-open-file]").forEach(n=>{n.addEventListener("click",()=>Qt(n.dataset.openFile||""))}),document.onkeydown=xt}function le(e=document){e.querySelectorAll("[data-locale]").forEach(n=>{n.addEventListener("click",()=>{sn(n.dataset.locale)})})}function de(e=document){e.querySelectorAll("[data-auth-mode]").forEach(n=>{n.addEventListener("click",()=>{ht(n.dataset.authMode)})}),e.querySelector("#auth-form")?.addEventListener("submit",wt)}function ht(e){t.authMode=e==="register"?"register":"login",t.authMessage="",t.authTone="neutral",A()}function A(){const e=document.querySelector(".auth-panel");if(!e){d();return}const i=document.createRange().createContextualFragment(oe()).querySelector(".auth-panel");if(!i){d();return}e.replaceWith(i),le(i),de(i)}async function wt(e){e.preventDefault();const n=document.getElementById("auth-email")?.value.trim().toLowerCase()||"",i=document.getElementById("auth-password")?.value||"",s=document.getElementById("auth-confirm")?.value||"",l=t.authMode==="login"?"/api/auth/login":"/api/auth/register",o=t.authMode==="login"?{email:n,password:i}:{email:n,password:i,confirm_password:s};t.authMessage=a("auth.contacting"),t.authTone="neutral",A();try{const u=await fetch(`${b}${l}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),c=await u.json().catch(()=>({}));if(!u.ok)throw new Error($(c,a("auth.failed")));if(t.authMode==="register"){t.authMode="login",t.authMessage=a("auth.created"),t.authTone="success",A();return}ue({email:c.email,role:c.role},c.token)}catch(u){t.authMessage=p(u.message),t.authTone="error",A()}}async function z({isRevision:e,isRegenerate:n=!1}){if(!t.user||!t.token)return;const i=e?t.refinementText.trim():t.taskText.trim(),s=e?t.run.id:null;if(!i){t.fieldErrors.task_text=e?"":a("run.required"),t.run={...N(),status:"idle",stage:"validate_request",message:a(e?"refinement.missing":"run.addBrief")},d();return}_(),m(),t.fieldErrors={},t.notice={message:"",tone:"neutral"},t.run={...N(),status:"queued",stage:t.files.some(l=>!l.uploadId)?"upload_inputs":"submit_run",message:t.files.some(l=>!l.uploadId)?a("run.preparingUploads"):a("run.submitting"),revisionOfRunId:s},Kt({kind:e?"revision":"command",status:"queued",title:a(e?"history.followUpTitle":n?"history.regenerateTitle":"history.generationTitle"),message:i,meta:`${g(L().id,"label")} / ${a("controls.search")} ${a(`controls.searchMode.${t.searchMode}`)}`}),t.activePane="preview",d();try{const l=await $t();t.run={...t.run,stage:"submit_run",message:a("run.submitting")},d();const o=await fetch(`${b}/api/runs`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(Et({promptText:i,uploadIds:l,revisionOfRunId:s}))}),u=await o.json().catch(()=>({}));if(!o.ok){Nt(u,a("run.requestFailed")),d();return}ve(u),P(),e&&(t.refinementText=""),d(),u.id&&(await be(u.id),ie.has(t.run.status)||Ot(u.id))}catch(l){t.run={...t.run,status:"failed",stage:t.run.stage||"submit_run",message:a("run.requestFailed"),error:p(l.message),errorCode:"frontend_request_failed"},P(),d()}}async function $t(){const e=t.files.filter(o=>!o.uploadId);if(!e.length)return t.files.map(o=>o.uploadId).filter(Boolean);e.forEach(o=>{o.status="uploading"}),d();const n=new FormData;e.forEach(o=>n.append("files",o.file,o.name));const i=await fetch(`${b}/api/uploads`,{method:"POST",headers:{Authorization:`Bearer ${t.token}`},body:n}),s=await i.json().catch(()=>({}));if(!i.ok){e.forEach(u=>{u.status="failed"});const o=i.status===404?a("uploads.unavailable"):a("uploads.failedGeneric");throw new Error($(s,o))}const l=Array.isArray(s.uploads)?s.uploads:[];if(e.forEach((o,u)=>{const c=l[u];o.uploadId=c?.id||"",o.status=o.uploadId?"uploaded":"failed"}),e.some(o=>!o.uploadId))throw new Error(a("uploads.missingIds"));return t.files.map(o=>o.uploadId).filter(Boolean)}function ue(e,n){t.user=e,t.token=n,localStorage.setItem(X,n),localStorage.setItem(V,JSON.stringify(e)),t.authMessage="",t.run=N(),m(),d(),Tt()}function ce(){kt(),t.user=null,t.token="",localStorage.removeItem(X),localStorage.removeItem(V)}function kt(){t.model={editorOpen:!1,profiles:[],profile:null,form:{...y},fieldErrors:{},statusMessage:"",statusTone:"neutral",busy:""}}function _t(){const e=t.model.profile;return e?.model?e.model:t.model.statusTone==="error"?a("model.needsAttention"):a("model.defaultButton")}function Pt(){J(),t.model.editorOpen=!0,t.model.statusMessage=t.model.profile?a("model.savedLoaded"):a("model.defaultsLoaded"),t.model.statusTone="neutral",t.model.fieldErrors={},d()}function pe(){t.model.editorOpen=!1,t.model.form.apiKey="",t.model.fieldErrors={},t.model.busy="",d()}function xt(e){e.key==="Escape"&&t.model.editorOpen&&pe()}async function Tt(){if(t.token)try{const e=await fetch(`${b}/api/settings/model-profiles`,{headers:{Authorization:`Bearer ${t.token}`}}),n=await e.json().catch(()=>[]);if(!e.ok)throw new Error($(n,a("model.loadFailed")));const i=Array.isArray(n)?n.map(fe):[];t.model.profiles=i,t.model.profile=i.find(s=>s.is_default)||i[0]||null,J(),t.model.editorOpen&&(t.model.statusMessage=t.model.profile?a("model.savedLoaded"):a("model.defaultsLoaded"),t.model.statusTone="neutral"),d()}catch(e){t.model.statusMessage=p(e.message),t.model.statusTone="error",t.model.editorOpen&&d()}}function fe(e){return{id:String(e?.id||"default-qwen"),display_name:String(e?.display_name||a("model.defaultName")),provider:String(e?.provider||"openai_compatible"),base_url:String(e?.base_url||y.baseUrl),model:String(e?.model||y.model),api_key_ref:e?.api_key_ref?String(e.api_key_ref):null,context_window_hint:Number(e?.context_window_hint||w),supports_streaming:!!e?.supports_streaming,is_default:!!e?.is_default}}function J(){const e=t.model.profile;t.model.form={displayName:e?.display_name||a("model.defaultName"),provider:e?.provider||y.provider,baseUrl:e?.base_url||y.baseUrl,model:e?.model||y.model,apiKey:""}}async function Lt(e){e.preventDefault(),t.model.busy="save",t.model.statusMessage=a("model.saving"),t.model.statusTone="neutral",t.model.fieldErrors={},d();try{const n=await fetch(`${b}/api/settings/model-profiles/default`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(me({includeApiKey:!0}))}),i=await n.json().catch(()=>({}));if(!n.ok){ge(i,a("model.saveFailed"));return}t.model.profile=fe(i),t.model.profiles=[t.model.profile],J(),t.model.statusMessage=a("model.saved"),t.model.statusTone="success",t.model.fieldErrors={}}catch(n){t.model.statusMessage=p(n.message),t.model.statusTone="error"}finally{t.model.busy="",t.model.form.apiKey="",d()}}async function St(){t.model.busy="test",t.model.statusMessage=a("model.testing"),t.model.statusTone="neutral",t.model.fieldErrors={},d();try{const e=!!t.model.form.apiKey.trim(),n=await fetch(`${b}/api/settings/model-profiles/test`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(e?me({includeApiKey:!0}):{})}),i=await n.json().catch(()=>({}));if(!n.ok){ge(i,a("model.testFailed"));return}t.model.statusMessage=a("model.connectionOk",{model:i.model||t.model.form.model}),t.model.statusTone="success",t.model.fieldErrors={}}catch(e){t.model.statusMessage=p(e.message),t.model.statusTone="error"}finally{t.model.busy="",d()}}function me({includeApiKey:e}){const n=t.model.form,i={display_name:n.displayName.trim()||a("model.defaultName"),provider:n.provider||"openai_compatible",base_url:n.baseUrl.trim(),model:n.model.trim(),context_window_hint:w,supports_streaming:!0};return n.apiKey.trim()&&(i.api_key=n.apiKey.trim()),i}function ge(e,n){const i=e?.error||{};t.model.statusMessage=i.code?`${i.code}: ${p(i.message||n)}`:$(e,n),t.model.statusTone="error",t.model.fieldErrors=Rt(i.fields||[])}function Rt(e){return e.reduce((n,i)=>{const s=At(i.field);return s&&(n[s]=E(i.rule)),n},{})}function At(e){return e==="base_url"?"baseUrl":e==="model"?"model":e==="api_key"?"apiKey":e==="display_name"?"displayName":""}function E(e){return e==="required"?a("errors.required"):e==="absolute_http_url"?a("errors.absoluteHttpUrl"):e==="enum"?a("errors.enum"):e||a("errors.invalid")}function N(e){const n=e||t.locale;return{id:"",status:"idle",stage:"compose",message:C(n,"run.ready"),error:null,errorCode:"",outputRoot:"",revisionOfRunId:null}}function Et({promptText:e,uploadIds:n,revisionOfRunId:i}){const s={task_text:e,intent:t.intent,output_preference:Ft(t.intent),search_mode:t.searchMode,model_profile_id:t.model.profile?.id||null,upload_ids:n,options:Mt(t.intent)};return i&&(s.revision_of_run_id=i),s}function Ft(e){return e==="code_homework"?t.outputPreference:"pdf"}function Mt(e){return e!=="cheat_sheet"?{}:{target_pages:Math.max(1,Math.round(Number(t.targetPages)||1)),paper_size:"A4",density:"dense"}}function Q(e){return e&&t.taskText.trim()&&t.run.status!=="queued"&&t.run.status!=="running"}function Nt(e,n){const i=e?.error||{};t.fieldErrors=It(i.fields||[]),t.run={...t.run,status:"failed",stage:"submit_run",message:a("run.requestFailed"),error:$(e,n),errorCode:String(i.code||"request_failed")},P()}function It(e){return e.reduce((n,i)=>(i.field==="task_text"&&(n.task_text=E(i.rule)),i.field==="options.target_pages"&&(n.target_pages=E(i.rule)),i.field==="output_preference"&&(n.output_preference=E(i.rule)),n),{})}function ve(e){e.context&&(t.context=we(e.context,"backend")),t.run={...t.run,id:e.id||e.run_id||t.run.id||"",status:e.status||t.run.status,stage:e.stage||t.run.stage||"queued",message:Ct(e),error:qt(e),errorCode:Dt(e),outputRoot:e.output_root||t.run.outputRoot||""}}function Ct(e){return e.message?p(e.message):e.error?.message?p(e.error.message):e.error_message?p(e.error_message):e.status==="succeeded"?a("run.succeeded"):e.status==="failed"?a("run.failed"):e.status==="running"?a("run.running"):a("run.queued")}function qt(e){return e.error?.message?p(e.error.message):e.status==="failed"&&e.error_message?p(e.error_message):null}function Dt(e){return e.error?.code?String(e.error.code):e.status==="failed"&&typeof e.error_message=="string"?e.error_message.split(":")[0]||"run_failed":""}function Ot(e){_(),R=window.setInterval(()=>{be(e).catch(n=>{_(),t.run={...t.run,status:"failed",stage:"poll_status",message:a("run.refreshFailed"),error:p(n.message),errorCode:"status_refresh_failed"},P(),d()})},Ue)}function _(){R&&(window.clearInterval(R),R=null)}async function be(e){if(!e||!t.token)return;const n=await fetch(`${b}/api/runs/${encodeURIComponent(e)}/events`,{headers:{Authorization:`Bearer ${t.token}`}}),i=await n.json().catch(()=>({}));if(!n.ok)throw new Error($(i,a("run.statusRefreshFailed")));ve(i),P(),d(),ie.has(t.run.status)&&_()}function F(){const e=ye(),n=document.querySelector(".dial-ring"),i=document.querySelector(".context-widget");if(!n||!i)return;n.style.setProperty("--context-ratio",`${Math.min(100,e.utilization_ratio*100)}%`);const s=n.querySelector("img");s&&(s.src=M[e.warning_level]||M.ok),i.dataset.contextState=e.warning_level,i.setAttribute("aria-label",Ee(e)),f("state",x(e.warning_level)),f("source-label",T(e.source)),f("summary",Ae(e)),f("input",v(e.estimated_input_tokens)),f("output",v(e.estimated_output_tokens)),f("total",v(e.estimated_total_tokens)),f("limit",v(e.context_window_limit)),f("utilization",U(e.utilization_ratio)),f("warning",x(e.warning_level)),f("source",T(e.source))}function te(){const e=!!(t.user&&t.token),n=document.querySelector("[data-action='run']");if(n){n.disabled=!Q(e);const o=n.querySelector("[data-run-button-label]");o&&(o.textContent=xe())}const i=document.querySelector("[data-run-note]");i&&(i.textContent=Te(e));const s=!e||!t.run.id||t.run.status==="queued"||t.run.status==="running",l=document.querySelector("[data-action='run-refinement']");l&&(l.disabled=s||!t.refinementText.trim())}function f(e,n){document.querySelectorAll(`[data-context-field="${e}"]`).forEach(i=>{i.textContent=n})}function m(){t.context=he()}function ye(){return t.context||he()}function he(){const e=L(),n=t.files.reduce((B,Ne)=>B+Number(Ne.size||0),0),i=`${t.taskText}
${t.refinementText}`.trim(),s=Math.max(1,Math.ceil((i.length+Math.min(n,2e5))/4)),l=e.id==="cheat_sheet"?Math.max(5e3,t.targetPages*1800):e.id==="beamer_slides"?7e3:e.id==="essay_latex"?6e3:t.outputPreference==="ipynb"?5200:4e3,o=s+l,u=o/w;let c="ok";return u>.85?c="critical":u>=.7&&(c="warning"),we({estimated_input_tokens:s,estimated_output_tokens:l,estimated_total_tokens:o,context_window_limit:w,utilization_ratio:u,warning_level:c,source:"local"},"local")}function we(e,n){const i=k(e?.estimated_input_tokens,0),s=k(e?.estimated_output_tokens,0),l=k(e?.context_window_limit,w)||w,o=k(e?.estimated_total_tokens,i+s),u=k(e?.utilization_ratio,o/l),c=Ut(e?.warning_level,u);return{estimated_input_tokens:i,estimated_output_tokens:s,estimated_total_tokens:o,context_window_limit:l,utilization_ratio:u,warning_level:c,source:String(e?.source||n||"local")}}function k(e,n){const i=Number(e);return!Number.isFinite(i)||i<0?n:i}function Ut(e,n){return e==="ok"||e==="warning"||e==="critical"?e:n>.85?"critical":n>=.7?"warning":"ok"}function Bt(e){const n=new Set(t.files.map(s=>s.key)),i=e.map(s=>({key:`${s.name}-${s.size}-${s.lastModified}`,file:s,name:s.name,size:s.size,status:"pending",uploadId:""})).filter(s=>!n.has(s.key));t.files=[...t.files,...i],t.notice=i.length?{message:a("uploads.willUpload"),tone:"neutral"}:{message:a("uploads.duplicates"),tone:"neutral"},m()}function Kt(e){t.history.push({id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,timestamp:new Date().toISOString(),...e})}function P(){if(!t.run.id)return;const e=`run-${t.run.id}`,n=t.history.find(s=>s.id===e),i={id:e,kind:"run",status:t.run.status,title:a("history.runTitle",{id:Fe(t.run.id)}),message:t.run.error||t.run.message,meta:`${h(t.run.stage)} / ${t.run.outputRoot?Me(t.run.outputRoot):a("history.folderPending")}`,timestamp:new Date().toISOString()};n?Object.assign(n,i):t.history.push(i)}function L(){return j.find(e=>e.id===t.intent)||j[0]}function H(){const e=$e();e.includes(t.activeFile)||(t.activeFile=e[0])}function $e(){return t.outputPreference==="ipynb"?["solution.ipynb"]:["solution.py","tests.py","README.md"]}function zt(){return[{id:"primary",label:g(t.intent,"primaryTab")},{id:"source",label:g(t.intent,"sourceTab")},{id:"logs",label:a("preview.tabs.logs")},{id:"manifest",label:a("preview.tabs.manifest")}]}function Z(){return t.intent==="code_homework"?[t.outputPreference==="ipynb"?{name:"solution.ipynb",relativePath:"output/solution.ipynb",kind:"notebook",badge:"NB",readyLabel:a("files.notebookReady"),pendingLabel:a("files.pending")}:{name:"solution.py",relativePath:"output/solution.py",kind:"script",badge:"PY",readyLabel:a("files.scriptReady"),pendingLabel:a("files.pending")},{name:"generation.log",relativePath:"logs/generation.log",kind:"log",badge:"LOG",readyLabel:a("files.logReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]:t.intent==="essay_latex"?[{name:"main.pdf",relativePath:"output/main.pdf",kind:"pdf",badge:"PDF",readyLabel:a("files.pdfReady"),pendingLabel:a("files.compilePending")},{name:"main.tex",relativePath:"output/main.tex",kind:"source",badge:"TEX",readyLabel:a("files.sourceReady"),pendingLabel:a("files.pending")},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:a("files.compileLogReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]:t.intent==="beamer_slides"?[{name:"slides.pdf",relativePath:"output/slides.pdf",kind:"pdf",badge:"PDF",readyLabel:a("files.deckReady"),pendingLabel:a("files.compilePending")},{name:"slides.tex",relativePath:"output/slides.tex",kind:"source",badge:"TEX",readyLabel:a("files.sourceReady"),pendingLabel:a("files.pending")},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:a("files.compileLogReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]:[{name:"cheat-sheet.pdf",relativePath:"output/cheat-sheet.pdf",kind:"pdf",badge:"PDF",readyLabel:a("files.sheetReady"),pendingLabel:a("files.compilePending")},{name:"cheat-sheet.tex",relativePath:"output/cheat-sheet.tex",kind:"source",badge:"TEX",readyLabel:a("files.sourceReady"),pendingLabel:a("files.pending")},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:a("files.compileLogReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]}function jt(){return t.intent==="code_homework"?t.outputPreference==="ipynb"?"solution.ipynb":"solution.py":t.intent==="beamer_slides"?"slides.tex":t.intent==="cheat_sheet"?"cheat-sheet.tex":"main.tex"}function Y(e){return e==="tests.py"?`from solution import solve


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
`}function ke(){return`def solve(values):
    total = 0
    for value in values:
        total += value
    return total

solve([1, 2, 3])`}function _e(){return t.intent==="code_homework"?Y("solution.py"):t.intent==="beamer_slides"?`\\documentclass{beamer}
\\title{${q(a("preview.generatedSlidesSource"))}}
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
\\title{${q(a("preview.generatedEssay"))}}
\\begin{document}
\\maketitle
\\section{Introduction}
The generated source is preserved even if PDF compilation fails.
\\section{Discussion}
Evidence and citations are recorded in the run manifest.
\\end{document}
`}function D(e,n="python"){return`
        <ol class="code-lines">
            ${String(e).replace(/\s+$/u,"").split(`
`).map((s,l)=>`
                <li>
                    <span class="line-no">${l+1}</span>
                    <code>${Ht(s,n)}</code>
                </li>
            `).join("")}
        </ol>
    `}function Ht(e,n){return n==="json"?Vt(e):n==="latex"?Wt(e):Xt(e)}function Xt(e){const n=e.match(/#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|./g)||[],i=new Set(["def","class","from","import","for","if","else","elif","return","continue","in","as","print","with","try","except","raise","while","True","False","None"]);return n.map((s,l)=>s.startsWith("#")?`<span class="syntax-comment">${r(s)}</span>`:s.startsWith('"')||s.startsWith("'")?`<span class="syntax-string">${r(s)}</span>`:/^\d+$/u.test(s)?`<span class="syntax-number">${r(s)}</span>`:i.has(s)?`<span class="syntax-keyword">${r(s)}</span>`:/^[A-Za-z_][A-Za-z0-9_]*$/u.test(s)&&Pe(n,l)==="("?`<span class="syntax-function">${r(s)}</span>`:r(s)).join("")||" "}function Vt(e){const n=e.match(/"(?:\\.|[^"\\])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?|\s+|./g)||[];return n.map((i,s)=>i.startsWith('"')?`<span class="${Pe(n,s)===":"?"syntax-keyword":"syntax-string"}">${r(i)}</span>`:/^(true|false|null)$/u.test(i)?`<span class="syntax-keyword">${r(i)}</span>`:/^-?\d+(?:\.\d+)?$/u.test(i)?`<span class="syntax-number">${r(i)}</span>`:r(i)).join("")||" "}function Wt(e){return(e.match(/%.*$|\\[A-Za-z*]+|\{[^}]*\}|\s+|./g)||[]).map(i=>i.startsWith("%")?`<span class="syntax-comment">${r(i)}</span>`:i.startsWith("\\")?`<span class="syntax-keyword">${r(i)}</span>`:i.startsWith("{")&&i.endsWith("}")?`<span class="syntax-string">${r(i)}</span>`:r(i)).join("")||" "}function Pe(e,n){for(let i=n+1;i<e.length;i+=1)if(!/^\s+$/u.test(e[i]))return e[i];return""}async function Gt(){const e=t.previewTab==="logs"?`${h(t.run.stage)}: ${t.run.message}`:t.previewTab==="manifest"?JSON.stringify({run_id:t.run.id||null,intent:t.intent,status:t.run.status,outputs:Z().map(n=>n.relativePath)},null,2):t.previewTab==="source"?_e():t.intent==="code_homework"?t.outputPreference==="ipynb"?ke():Y(t.activeFile):t.run.outputRoot||O();await I(e,a("run.previewCopied"))}async function I(e,n){if(e){try{await navigator.clipboard.writeText(e),t.notice={message:n,tone:"success"}}catch{t.notice={message:a("run.clipboardUnavailable"),tone:"error"}}d()}}function Jt(){t.run.outputRoot&&I(t.run.outputRoot,a("run.pathRevealCopied"))}function Qt(e){if(!e)return;const n=e.startsWith("file://")?e:`file://${e}`;window.open(n,"_blank","noopener,noreferrer")}function Zt(e){return t.run.outputRoot?`${t.run.outputRoot.replace(/\/$/u,"")}/${e}`:""}function O(){return t.run.outputRoot?a("source.artifactNoteReady"):a("source.artifactNotePending")}function xe(){return t.run.status==="queued"||t.run.status==="running"?a("actions.running"):t.run.status==="failed"?a("actions.runAgain"):a("actions.runArtifact")}function Te(e){return e?t.taskText.trim()?t.files.some(n=>!n.uploadId)?a("composer.runNoteUploads"):t.run.status==="queued"||t.run.status==="running"?a("composer.runNoteRunning"):a("composer.runNoteReady"):a("composer.runNoteBrief"):a("composer.runNoteLogin")}function Yt(){return t.run.status==="failed"?a("run.validationIssue"):t.run.status==="succeeded"?a("run.artifactReady"):t.run.status==="queued"||t.run.status==="running"?a("run.generating"):a("run.rendererArmed")}function en(){return t.run.status==="failed"?t.run.errorCode||a("run.sourcePreserved"):t.run.status==="succeeded"?t.run.outputRoot?a("run.copyOpenAvailable"):a("run.completed"):t.run.status==="queued"||t.run.status==="running"?h(t.run.stage):a("run.syntaxPreview")}function tn(e,n){return n==="queued"?"route":n==="succeeded"?t.intent==="code_homework"?"validate":"compile":e?.includes("context")||e?.includes("upload")?t.intent==="cheat_sheet"?"ingest":"context":e?.includes("search")||e?.includes("route")?"route":e?.includes("compile")?"compile":e?.includes("validate")?"validate":e?.includes("outline")?"outline":e?.includes("layout")?"layout":e?.includes("compress")?"compress":e?.includes("generate")||e?.includes("source")?t.intent==="beamer_slides"?"write":"generate":L().stages[0]}function h(e){const n=String(e||"compose"),i=a(`stages.${n}`);return i===`stages.${n}`?n.replaceAll("_"," "):i}function nn(e){return e.status==="uploaded"?a("uploads.uploaded"):e.status==="uploading"?a("uploads.uploading"):e.status==="failed"?a("uploads.failed"):un(e.size)}function an(e){return String(e).split(".").pop()?.slice(0,3).toUpperCase()||"FILE"}function rn(){const e=localStorage.getItem(re);if(Le(e))return e;const n=navigator.language||"";return n.toLowerCase().startsWith("zh")?n.toLowerCase().includes("tw")||n.toLowerCase().includes("hk")?"zh-Hant":"zh-Hans":W}function sn(e){const n=Le(e)?e:W;t.locale!==n&&(t.locale=n,localStorage.setItem(re,n),ln(),t.run.status==="idle"&&t.run.stage==="compose"&&(t.run.message=a("run.ready")),d())}function Le(e){return ae.some(n=>n.id===e)}function Se(){document.documentElement.lang=t.locale,document.title=a("app.title")}function on(e){return{id:"session-ready",kind:"system",status:"idle",title:C(e,"history.readyTitle"),message:C(e,"history.readyMessage"),timestamp:new Date().toISOString()}}function ln(){const e=t.history.find(n=>n.id==="session-ready");e&&(e.title=a("history.readyTitle"),e.message=a("history.readyMessage"))}function g(e,n){return a(`intents.${e}.${n}`)}function Re(e){const n=String(e||"idle"),i=a(`status.${n}`);return i===`status.${n}`?n:i}function a(e,n={}){return C(t.locale,e,n)}function C(e,n,i={}){const s=ee[W]||{},l=ee[e]||s,o=ne(s,n),u=ne(l,n)??o??n;return typeof u!="string"?n:u.replace(/\{([A-Za-z0-9_]+)\}/g,(c,B)=>String(i[B]??""))}function ne(e,n){return String(n).split(".").reduce((i,s)=>{if(i&&Object.prototype.hasOwnProperty.call(i,s))return i[s]},e)}function dn(){try{return JSON.parse(localStorage.getItem(V)||"null")}catch{return null}}function $(e,n){const i=e?.error?.message||(typeof e?.detail=="string"?e.detail:"")||(typeof e?.message=="string"?e.message:"")||n,s=e?.error?.code?`${e.error.code}: `:"";return p(`${s}${i}`)}function p(e){return String(e||"").replace(/sk-[A-Za-z0-9_-]+/g,"[redacted-key]").replace(/Bearer\s+[A-Za-z0-9._-]+/gi,"Bearer [redacted-token]").replace(/api[_-]?key["'\s:=]+[A-Za-z0-9._-]+/gi,"api_key [redacted]").split(`
`).filter(n=>!/\s+at\s+/.test(n)&&!/Traceback/.test(n)).slice(0,3).join(" ").trim()}function v(e){return Number(e||0).toLocaleString()}function U(e){return`${Math.round(Number(e||0)*100)}%`}function un(e){const n=Number(e||0);return n>=1024*1024?`${(n/(1024*1024)).toFixed(1)} MB`:n>=1024?`${Math.round(n/1024)} KB`:`${n} B`}function x(e){return a(e==="critical"?"context.critical":e==="warning"?"context.warning":"context.ok")}function T(e){const n=String(e||"local").toLowerCase();return n==="local"?a("context.local"):n==="heuristic"?a("context.heuristic"):n==="provider"?a("context.provider"):e}function Ae(e){return e.warning_level==="critical"?a("context.criticalSummary"):e.warning_level==="warning"?a("context.warningSummary"):a("context.ratioSummary",{percent:U(e.utilization_ratio)})}function Ee(e){return a("context.aria",{state:x(e.warning_level),percent:U(e.utilization_ratio),source:T(e.source)})}function q(e){const i=(t.taskText.trim().split(`
`).find(Boolean)||"").replace(/[^\w\s:,-]/g,"").trim();return i?i.length>52?`${i.slice(0,49)}...`:i:e}function Fe(e){return String(e||"").slice(0,8)||"pending"}function cn(e){try{return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"}).format(new Date(e))}catch{return""}}function pn(){return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date)}function Me(e){const n=String(e||"");return n.length<=46?n:`...${n.slice(-43)}`}function r(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}
