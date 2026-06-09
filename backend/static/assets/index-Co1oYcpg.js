(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const o of l)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function r(l){const o={};return l.integrity&&(o.integrity=l.integrity),l.referrerPolicy&&(o.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?o.credentials="include":l.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(l){if(l.ep)return;l.ep=!0;const o=r(l);fetch(l.href,o)}})();const be=[{id:"en",label:"EN",name:"English"},{id:"zh-Hans",label:"简",name:"简体中文"},{id:"zh-Hant",label:"繁",name:"繁體中文"}],ge={en:{app:{title:"AI Learning Assistant - Artifact Studio",brand:"AI Learning Assistant",userFallback:"User"},locale:{label:"Interface language"},mobile:{console:"Console",preview:"Preview"},pane:{consoleKicker:"Production console",previewKicker:"Artifact preview"},actions:{model:"Model",copyPath:"Copy path",reveal:"Reveal",regenerate:"Regenerate",copy:"Copy",open:"Open",runArtifact:"Run artifact",runAgain:"Run again",running:"Running",newRevisionRun:"New revision run",copyVisible:"Copy visible",test:"Test",save:"Save",saving:"Saving",login:"Login",createAccount:"Create account",closeModel:"Close model settings",removeFile:"Remove {name}"},intents:{code_homework:{label:"Code",short:"PY",title:"Homework code",description:"Script or notebook answer",primaryTab:"Code",sourceTab:"Source"},essay_latex:{label:"Essay",short:"TEX",title:"LaTeX essay",description:"Source plus compiled PDF",primaryTab:"Rendered",sourceTab:"LaTeX"},beamer_slides:{label:"Slides",short:"PDF",title:"Beamer deck",description:"Slide source plus PDF",primaryTab:"Rendered",sourceTab:"LaTeX"},cheat_sheet:{label:"Cheat sheet",short:"A4",title:"Dense A4 sheet",description:"Course compression PDF",primaryTab:"Rendered",sourceTab:"LaTeX"}},controls:{artifactType:"Artifact type",search:"Search",searchMode:{auto:"Auto",on:"On",off:"Off"},output:"Output",previewOnly:"Preview only",targetPages:"Target pages",a4:"A4",dense:"Dense",pdfFirst:"PDF first",sourceKept:"Source kept"},composer:{brief:"Brief",briefPlaceholder:"Paste the assignment brief, constraints, marking expectations, and any output notes.",runNoteLogin:"Login activates generation controls.",runNoteBrief:"Add a task brief to enable generation.",runNoteUploads:"Selected files upload before run creation.",runNoteRunning:"Context and stage events update as the backend reports.",runNoteReady:"Ready for a local generation run.",progressLabel:"Approximate progress",progressNote:"This bar is a comfort estimate while the backend works; stage text is authoritative.",progressAria:"Approximate generation progress"},uploads:{label:"Reference files",choose:"Drop or choose reference files",selected:"{count} reference file selected",selectedPlural:"{count} reference files selected",willUpload:"Files will upload before the next run.",duplicates:"Those files are already selected.",uploaded:"uploaded",uploading:"uploading",failed:"upload failed",unavailable:"Upload API is unavailable in this backend build.",failedGeneric:"Upload failed.",missingIds:"Upload response did not include every upload id."},refinement:{label:"Follow-up",availableAfterRun:"Available after first run",revisionSource:"Revision source {id}",placeholder:"Ask for a tighter proof, more comments, fewer slides, or a different structure.",note:"Creates a new run; generated files stay source-of-truth on disk.",missing:"Add a follow-up request before starting a revision."},history:{label:"Run history",entries:"{count} entries",readyTitle:"Console ready",readyMessage:"Choose an artifact type, add source material, then run.",followUpTitle:"Follow-up request",regenerateTitle:"Regenerate request",generationTitle:"Generation request",runTitle:"Run {id}",folderPending:"folder pending"},preview:{tabs:{logs:"Logs",manifest:"Manifest"},statusMessage:"Run status",stageProgress:"Stage progress",currentStage:"Current: {stage}",emptyPdfTitle:"PDF renderer",emptyPdfMessage:"Pages are shown as PDF-like preview until artifact bytes are exposed.",deckTitle:"Deck preview",deckMessage:"Compiled PDF pages will replace this deck skeleton when a file endpoint is available.",sheetTitle:"Sheet preview",sheetMessage:"Dense PDF-like pages stay visible while generation runs.",failedTitle:"Run failed",failedMessage:"Any preserved source or logs remain available from the run folder.",runFolderPending:"Run folder pending",files:"Files",pageLabel:"Slide 1 / 12",latexReport:"LaTeX report",generatedEssay:"Generated Essay",generatedSlidesSource:"Generated Slides",generatedSlides:"Course Presentation",introduction:"Introduction",argument:"Argument",references:"References",notebookApproach:"Approach",notebookApproachBody:"State the algorithm, edge cases, and complexity before the implementation cell.",markdown:"Markdown",code:"Code",notebookValidation:"Notebook validation",preservedForInspection:"Preserved for inspection",noExecution:"Preview-only, no execution",a4DenseLayout:"A4 dense layout",onePage:"{count} page",manyPages:"{count} pages",sourceTitle:"Source view",sourceMessage:"Shows generated source or a representative skeleton until backend artifact bytes are exposed.",logsTitle:"Run logs",logsMessage:"Shows live status now and sanitized run logs when they are available.",manifestTitle:"Manifest view",manifestMessage:"Shows the expected manifest shape before a real manifest is written."},files:{scriptReady:"script output",notebookReady:"notebook output",logReady:"run log",metadataReady:"metadata",pdfReady:"compiled PDF",deckReady:"compiled deck",sheetReady:"compiled sheet",sourceReady:"source preserved",compileLogReady:"compile log",pending:"pending",compilePending:"compile pending"},source:{artifactNoteReady:"Artifact bytes are available through authenticated access.",artifactNotePending:"Run folder appears after a run is accepted by the backend.",artifactLoading:"Reading generated artifacts...",artifactLoaded:"Generated artifact content loaded.",artifactMetadataLoaded:"Generated manifest metadata loaded.",artifactLoadFailed:"Could not load generated artifacts.",artifactReadFailed:"Could not read this artifact safely.",noArtifactText:"No readable artifact text is available.",generationLog:"generation.log",notStarted:"not-started",status:"status",error:"error"},auth:{kicker:"CUHK auth",loginTitle:"Login",registerTitle:"Register",email:"CUHK email",password:"Password",confirmPassword:"Confirm password",contacting:"Contacting local backend...",failed:"Authentication failed.",expired:"Session expired",created:"Account created. Login is ready."},model:{settingsKicker:"Model settings",defaultName:"Qwen Default",defaultButton:"Default Qwen profile",needsAttention:"Model needs attention",displayName:"Display name",baseUrl:"Base URL",model:"Model",apiKey:"API key",newKey:"New key",savedKey:"Saved key configured",noSavedKey:"No saved key",environmentDefault:"environment-default",provider:"Provider",contextWindow:"Context window",streaming:"Streaming",streamingOn:"On",streamingOff:"Off",defaultsSummary:"Qwen non-secret defaults",defaultHelp:"The Qwen endpoint, model, context window, and streaming mode are already filled. Add only your API key to test or save.",savedLoaded:"Saved profile loaded.",defaultsLoaded:"Local defaults loaded.",loadFailed:"Model profile load failed.",saving:"Saving model profile.",saved:"Model profile saved.",saveFailed:"Model profile save failed.",testing:"Testing provider connection.",testFailed:"Provider connectivity test failed.",connectionOk:"Connection OK for {model}."},run:{ready:"Ready",required:"Required",addBrief:"Add a task brief before running.",preparingUploads:"Preparing reference uploads.",submitting:"Submitting run to local backend.",requestFailed:"Run request failed.",succeeded:"Run succeeded.",failed:"Run failed.",running:"Run is running.",queued:"Run queued.",refreshFailed:"Could not refresh run status.",statusRefreshFailed:"Run status refresh failed.",pathCopied:"Run folder path copied.",pathRevealCopied:"Run folder path copied for reveal.",artifactPathCopied:"Artifact path copied.",previewCopied:"Visible preview copied.",clipboardUnavailable:"Clipboard is not available in this browser context.",validationIssue:"Validation issue",artifactReady:"Artifact ready",generating:"Generating",rendererArmed:"Renderer armed",sourcePreserved:"source preserved if available",copyOpenAvailable:"copy/open paths available",completed:"completed",syntaxPreview:"syntax preview, no execution"},status:{idle:"Idle",queued:"Queued",running:"Running",succeeded:"Succeeded",failed:"Failed",cancelled:"Cancelled"},stages:{compose:"Compose",choose_intent:"Select artifact",validate_request:"Validate",upload_inputs:"Upload inputs",submit_run:"Submit run",queued:"Queued",running:"Running",resolve_model:"Model",extract_context:"Context",decide_search:"Search",generate_source:"Generate",validate_source:"Validate",repair_source:"Repair LaTeX",compile_pdf:"Compile PDF",write_manifest:"Manifest",poll_status:"Refresh",output_files:"Output files",route:"Route",context:"Context",generate:"Generate",validate:"Validate",write:"Write",compile:"Compile",outline:"Outline",ingest:"Ingest",compress:"Compress",layout:"Layout"},context:{ok:"OK",warning:"Warning",critical:"Critical",local:"Local estimate",heuristic:"Backend heuristic",provider:"Provider estimate",input:"Input",output:"Output",total:"Total",limit:"Limit",use:"Use",warningLabel:"Warning",source:"Source",criticalSummary:"Aggressive compression likely",warningSummary:"Compression may be needed",ratioSummary:"{percent} of context",aria:"Context budget {state}, {percent} utilized, {source}"},errors:{required:"Required",absoluteHttpUrl:"Use an absolute http or https URL",enum:"Choose a supported value",invalid:"Invalid value"}},"zh-Hans":{app:{title:"AI Learning Assistant - 成果工作室",brand:"AI Learning Assistant",userFallback:"用户"},locale:{label:"界面语言"},mobile:{console:"控制台",preview:"预览"},pane:{consoleKicker:"生产控制台",previewKicker:"成果预览"},actions:{model:"模型",copyPath:"复制路径",reveal:"显示位置",regenerate:"重新生成",copy:"复制",open:"打开",runArtifact:"开始生成",runAgain:"再次运行",running:"运行中",newRevisionRun:"新修订运行",copyVisible:"复制当前",test:"测试",save:"保存",saving:"保存中",login:"登录",createAccount:"创建账户",closeModel:"关闭模型设置",removeFile:"移除 {name}"},intents:{code_homework:{label:"代码",short:"PY",title:"作业代码",description:"脚本或 Notebook 答案",primaryTab:"代码",sourceTab:"源文件"},essay_latex:{label:"论文",short:"TEX",title:"LaTeX 论文",description:"源文件与编译 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},beamer_slides:{label:"幻灯",short:"PDF",title:"Beamer 幻灯",description:"幻灯源文件与 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},cheat_sheet:{label:"速查表",short:"A4",title:"密集 A4 速查表",description:"课程内容压缩 PDF",primaryTab:"渲染",sourceTab:"LaTeX"}},controls:{artifactType:"成果类型",search:"检索",searchMode:{auto:"自动",on:"开启",off:"关闭"},output:"输出",previewOnly:"仅预览",targetPages:"目标页数",a4:"A4",dense:"密集",pdfFirst:"PDF 优先",sourceKept:"保留源文件"},composer:{brief:"任务说明",briefPlaceholder:"粘贴作业要求、约束条件、评分期望与输出说明。",runNoteLogin:"登录后可使用生成控制。",runNoteBrief:"填写任务说明后即可生成。",runNoteUploads:"已选文件会在创建运行前上传。",runNoteRunning:"后端报告上下文与阶段事件后会同步更新。",runNoteReady:"已准备好创建本地生成运行。",progressLabel:"近似进度",progressNote:"此进度条仅用于等待时的节奏提示；实际状态以后端阶段为准。",progressAria:"近似生成进度"},uploads:{label:"参考文件",choose:"拖入或选择参考文件",selected:"已选择 {count} 个参考文件",selectedPlural:"已选择 {count} 个参考文件",willUpload:"文件将在下一次运行前上传。",duplicates:"这些文件已在选择列表中。",uploaded:"已上传",uploading:"上传中",failed:"上传失败",unavailable:"当前后端构建未提供上传 API。",failedGeneric:"上传失败。",missingIds:"上传响应未返回全部文件编号。"},refinement:{label:"后续修订",availableAfterRun:"首次运行后可用",revisionSource:"修订来源 {id}",placeholder:"要求证明更严谨、注释更充分、幻灯更少，或调整结构。",note:"将创建新的运行；生成文件仍以磁盘成果为准。",missing:"请先填写后续修订要求。"},history:{label:"运行记录",entries:"{count} 条记录",readyTitle:"控制台就绪",readyMessage:"请选择成果类型，补充材料后开始运行。",followUpTitle:"后续修订请求",regenerateTitle:"重新生成请求",generationTitle:"生成请求",runTitle:"运行 {id}",folderPending:"文件夹待生成"},preview:{tabs:{logs:"日志",manifest:"清单"},statusMessage:"运行状态",stageProgress:"阶段进度",currentStage:"当前：{stage}",emptyPdfTitle:"PDF 渲染器",emptyPdfMessage:"在成果文件可读取前，页面以 PDF 样式预览呈现。",deckTitle:"幻灯预览",deckMessage:"文件端点可用后，已编译 PDF 页面会替换当前骨架。",sheetTitle:"速查表预览",sheetMessage:"生成期间保持密集 PDF 样式页面可见。",failedTitle:"运行失败",failedMessage:"如源文件或日志已保留，可继续从运行文件夹检查。",runFolderPending:"运行文件夹待生成",files:"文件",pageLabel:"第 1 / 12 页",latexReport:"LaTeX 报告",generatedEssay:"生成论文",generatedSlidesSource:"生成幻灯",generatedSlides:"课程演示",introduction:"引言",argument:"论证",references:"参考文献",notebookApproach:"方法说明",notebookApproachBody:"先说明算法、边界情况与复杂度，再呈现实作单元。",markdown:"Markdown",code:"代码",notebookValidation:"Notebook 校验",preservedForInspection:"已保留供检查",noExecution:"仅预览，不执行",a4DenseLayout:"A4 密集版式",onePage:"{count} 页",manyPages:"{count} 页",sourceTitle:"源文件视图",sourceMessage:"在后端成果文件可读取前，显示生成源文件或相应骨架。",logsTitle:"运行日志",logsMessage:"先显示当前状态；日志可用后显示已清理的运行日志。",manifestTitle:"清单视图",manifestMessage:"真实清单写入前，先显示预计 manifest 结构。"},files:{scriptReady:"脚本输出",notebookReady:"Notebook 输出",logReady:"运行日志",metadataReady:"元数据",pdfReady:"已编译 PDF",deckReady:"已编译幻灯",sheetReady:"已编译速查表",sourceReady:"源文件已保留",compileLogReady:"编译日志",pending:"待生成",compilePending:"待编译"},source:{artifactNoteReady:"成果文件已可通过认证访问读取。",artifactNotePending:"后端接受运行后会生成运行文件夹。",artifactLoading:"正在读取生成成果...",artifactLoaded:"已载入生成成果内容。",artifactMetadataLoaded:"已载入生成清单元数据。",artifactLoadFailed:"无法载入生成成果。",artifactReadFailed:"无法安全读取此成果文件。",noArtifactText:"暂无可读取的成果文本。",generationLog:"generation.log",notStarted:"尚未开始",status:"状态",error:"错误"},auth:{kicker:"中大认证",loginTitle:"登录",registerTitle:"注册",email:"中大邮箱",password:"密码",confirmPassword:"确认密码",contacting:"正在联系本地后端...",failed:"认证失败。",expired:"会话已过期",created:"账户已创建，请登录。"},model:{settingsKicker:"模型设置",defaultName:"Qwen 默认配置",defaultButton:"默认 Qwen 配置",needsAttention:"模型需要处理",displayName:"显示名称",baseUrl:"Base URL",model:"模型",apiKey:"API key",newKey:"新密钥",savedKey:"已配置密钥",noSavedKey:"未保存密钥",environmentDefault:"环境默认配置",provider:"提供方",contextWindow:"上下文窗口",streaming:"流式输出",streamingOn:"开启",streamingOff:"关闭",defaultsSummary:"Qwen 非密钥默认值",defaultHelp:"Qwen 端点、模型、上下文窗口与流式模式已预填；只需填写 API key 即可测试或保存。",savedLoaded:"已载入保存配置。",defaultsLoaded:"已载入本地默认值。",loadFailed:"模型配置载入失败。",saving:"正在保存模型配置。",saved:"模型配置已保存。",saveFailed:"模型配置保存失败。",testing:"正在测试提供方连接。",testFailed:"提供方连接测试失败。",connectionOk:"{model} 连接正常。"},run:{ready:"就绪",required:"必填",addBrief:"请先填写任务说明。",preparingUploads:"正在准备参考文件上传。",submitting:"正在提交至本地后端。",requestFailed:"运行请求失败。",succeeded:"运行成功。",failed:"运行失败。",running:"运行正在进行。",queued:"运行已排队。",refreshFailed:"无法刷新运行状态。",statusRefreshFailed:"运行状态刷新失败。",pathCopied:"运行文件夹路径已复制。",pathRevealCopied:"运行文件夹路径已复制，可用于显示位置。",artifactPathCopied:"成果路径已复制。",previewCopied:"当前预览已复制。",clipboardUnavailable:"当前浏览器环境不可使用剪贴板。",validationIssue:"校验问题",artifactReady:"成果就绪",generating:"生成中",rendererArmed:"渲染器就绪",sourcePreserved:"可检查已保留源文件",copyOpenAvailable:"可复制或打开路径",completed:"已完成",syntaxPreview:"语法预览，不执行"},status:{idle:"空闲",queued:"排队中",running:"运行中",succeeded:"成功",failed:"失败",cancelled:"已取消"},stages:{compose:"编写",choose_intent:"选择成果",validate_request:"校验",upload_inputs:"上传输入",submit_run:"提交运行",queued:"排队",running:"运行",resolve_model:"模型",extract_context:"上下文",decide_search:"检索",generate_source:"生成",validate_source:"校验",repair_source:"修复 LaTeX",compile_pdf:"编译 PDF",write_manifest:"清单",poll_status:"刷新",output_files:"输出文件",route:"路由",context:"上下文",generate:"生成",validate:"校验",write:"写作",compile:"编译",outline:"提纲",ingest:"摄取",compress:"压缩",layout:"排版"},context:{ok:"正常",warning:"注意",critical:"紧张",local:"本地估算",heuristic:"后端估算",provider:"提供方估算",input:"输入",output:"输出",total:"合计",limit:"上限",use:"占用",warningLabel:"提示",source:"来源",criticalSummary:"可能需要强压缩",warningSummary:"可能需要压缩",ratioSummary:"占上下文 {percent}",aria:"上下文预算{state}，已占用 {percent}，{source}"},errors:{required:"必填",absoluteHttpUrl:"请使用完整 http 或 https URL",enum:"请选择受支持的值",invalid:"值无效"}},"zh-Hant":{app:{title:"AI Learning Assistant - 成果工作室",brand:"AI Learning Assistant",userFallback:"使用者"},locale:{label:"介面語言"},mobile:{console:"控制台",preview:"預覽"},pane:{consoleKicker:"生產控制台",previewKicker:"成果預覽"},actions:{model:"模型",copyPath:"複製路徑",reveal:"顯示位置",regenerate:"重新生成",copy:"複製",open:"開啟",runArtifact:"開始生成",runAgain:"再次執行",running:"執行中",newRevisionRun:"新修訂執行",copyVisible:"複製目前",test:"測試",save:"儲存",saving:"儲存中",login:"登入",createAccount:"建立帳戶",closeModel:"關閉模型設定",removeFile:"移除 {name}"},intents:{code_homework:{label:"程式",short:"PY",title:"作業程式",description:"腳本或 Notebook 答案",primaryTab:"程式",sourceTab:"原始檔"},essay_latex:{label:"論文",short:"TEX",title:"LaTeX 論文",description:"原始檔與編譯 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},beamer_slides:{label:"投影片",short:"PDF",title:"Beamer 投影片",description:"投影片原始檔與 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},cheat_sheet:{label:"速查表",short:"A4",title:"密集 A4 速查表",description:"課程內容壓縮 PDF",primaryTab:"渲染",sourceTab:"LaTeX"}},controls:{artifactType:"成果類型",search:"檢索",searchMode:{auto:"自動",on:"開啟",off:"關閉"},output:"輸出",previewOnly:"僅預覽",targetPages:"目標頁數",a4:"A4",dense:"密集",pdfFirst:"PDF 優先",sourceKept:"保留原始檔"},composer:{brief:"任務說明",briefPlaceholder:"貼上作業要求、限制條件、評分期望與輸出說明。",runNoteLogin:"登入後可使用生成控制。",runNoteBrief:"填寫任務說明後即可生成。",runNoteUploads:"已選文件會在建立執行前上傳。",runNoteRunning:"後端回報上下文與階段事件後會同步更新。",runNoteReady:"已準備好建立本地生成執行。",progressLabel:"近似進度",progressNote:"此進度條僅用於等待時的節奏提示；實際狀態以後端階段為準。",progressAria:"近似生成進度"},uploads:{label:"參考文件",choose:"拖入或選擇參考文件",selected:"已選擇 {count} 個參考文件",selectedPlural:"已選擇 {count} 個參考文件",willUpload:"文件將在下一次執行前上傳。",duplicates:"這些文件已在選擇列表中。",uploaded:"已上傳",uploading:"上傳中",failed:"上傳失敗",unavailable:"目前後端構建未提供上傳 API。",failedGeneric:"上傳失敗。",missingIds:"上傳回應未返回全部文件編號。"},refinement:{label:"後續修訂",availableAfterRun:"首次執行後可用",revisionSource:"修訂來源 {id}",placeholder:"要求證明更嚴謹、註釋更充分、投影片更少，或調整結構。",note:"將建立新的執行；生成文件仍以磁碟成果為準。",missing:"請先填寫後續修訂要求。"},history:{label:"執行記錄",entries:"{count} 條記錄",readyTitle:"控制台就緒",readyMessage:"請選擇成果類型，補充材料後開始執行。",followUpTitle:"後續修訂請求",regenerateTitle:"重新生成請求",generationTitle:"生成請求",runTitle:"執行 {id}",folderPending:"資料夾待生成"},preview:{tabs:{logs:"日誌",manifest:"清單"},statusMessage:"執行狀態",stageProgress:"階段進度",currentStage:"目前：{stage}",emptyPdfTitle:"PDF 渲染器",emptyPdfMessage:"在成果文件可讀取前，頁面以 PDF 樣式預覽呈現。",deckTitle:"投影片預覽",deckMessage:"文件端點可用後，已編譯 PDF 頁面會替換目前骨架。",sheetTitle:"速查表預覽",sheetMessage:"生成期間保持密集 PDF 樣式頁面可見。",failedTitle:"執行失敗",failedMessage:"如原始檔或日誌已保留，可繼續從執行資料夾檢查。",runFolderPending:"執行資料夾待生成",files:"文件",pageLabel:"第 1 / 12 頁",latexReport:"LaTeX 報告",generatedEssay:"生成論文",generatedSlidesSource:"生成投影片",generatedSlides:"課程演示",introduction:"引言",argument:"論證",references:"參考文獻",notebookApproach:"方法說明",notebookApproachBody:"先說明演算法、邊界情況與複雜度，再呈現實作單元。",markdown:"Markdown",code:"程式",notebookValidation:"Notebook 校驗",preservedForInspection:"已保留供檢查",noExecution:"僅預覽，不執行",a4DenseLayout:"A4 密集版式",onePage:"{count} 頁",manyPages:"{count} 頁",sourceTitle:"原始檔視圖",sourceMessage:"在後端成果文件可讀取前，顯示生成原始檔或相應骨架。",logsTitle:"執行日誌",logsMessage:"先顯示目前狀態；日誌可用後顯示已清理的執行日誌。",manifestTitle:"清單視圖",manifestMessage:"真實清單寫入前，先顯示預計 manifest 結構。"},files:{scriptReady:"腳本輸出",notebookReady:"Notebook 輸出",logReady:"執行日誌",metadataReady:"元資料",pdfReady:"已編譯 PDF",deckReady:"已編譯投影片",sheetReady:"已編譯速查表",sourceReady:"原始檔已保留",compileLogReady:"編譯日誌",pending:"待生成",compilePending:"待編譯"},source:{artifactNoteReady:"成果文件已可透過認證存取讀取。",artifactNotePending:"後端接受執行後會生成執行資料夾。",artifactLoading:"正在讀取生成成果...",artifactLoaded:"已載入生成成果內容。",artifactMetadataLoaded:"已載入生成清單元資料。",artifactLoadFailed:"無法載入生成成果。",artifactReadFailed:"無法安全讀取此成果文件。",noArtifactText:"暫無可讀取的成果文字。",generationLog:"generation.log",notStarted:"尚未開始",status:"狀態",error:"錯誤"},auth:{kicker:"中大認證",loginTitle:"登入",registerTitle:"註冊",email:"中大電郵",password:"密碼",confirmPassword:"確認密碼",contacting:"正在聯絡本地後端...",failed:"認證失敗。",expired:"會話已過期",created:"帳戶已建立，請登入。"},model:{settingsKicker:"模型設定",defaultName:"Qwen 預設配置",defaultButton:"預設 Qwen 配置",needsAttention:"模型需要處理",displayName:"顯示名稱",baseUrl:"Base URL",model:"模型",apiKey:"API key",newKey:"新密鑰",savedKey:"已配置密鑰",noSavedKey:"未儲存密鑰",environmentDefault:"環境預設配置",provider:"提供方",contextWindow:"上下文窗口",streaming:"串流輸出",streamingOn:"開啟",streamingOff:"關閉",defaultsSummary:"Qwen 非密鑰預設值",defaultHelp:"Qwen 端點、模型、上下文窗口與串流模式已預填；只需填寫 API key 即可測試或儲存。",savedLoaded:"已載入儲存配置。",defaultsLoaded:"已載入本地預設值。",loadFailed:"模型配置載入失敗。",saving:"正在儲存模型配置。",saved:"模型配置已儲存。",saveFailed:"模型配置儲存失敗。",testing:"正在測試提供方連線。",testFailed:"提供方連線測試失敗。",connectionOk:"{model} 連線正常。"},run:{ready:"就緒",required:"必填",addBrief:"請先填寫任務說明。",preparingUploads:"正在準備參考文件上傳。",submitting:"正在提交至本地後端。",requestFailed:"執行請求失敗。",succeeded:"執行成功。",failed:"執行失敗。",running:"執行正在進行。",queued:"執行已排隊。",refreshFailed:"無法刷新執行狀態。",statusRefreshFailed:"執行狀態刷新失敗。",pathCopied:"執行資料夾路徑已複製。",pathRevealCopied:"執行資料夾路徑已複製，可用於顯示位置。",artifactPathCopied:"成果路徑已複製。",previewCopied:"目前預覽已複製。",clipboardUnavailable:"目前瀏覽器環境不可使用剪貼簿。",validationIssue:"校驗問題",artifactReady:"成果就緒",generating:"生成中",rendererArmed:"渲染器就緒",sourcePreserved:"可檢查已保留原始檔",copyOpenAvailable:"可複製或開啟路徑",completed:"已完成",syntaxPreview:"語法預覽，不執行"},status:{idle:"閒置",queued:"排隊中",running:"執行中",succeeded:"成功",failed:"失敗",cancelled:"已取消"},stages:{compose:"撰寫",choose_intent:"選擇成果",validate_request:"校驗",upload_inputs:"上傳輸入",submit_run:"提交執行",queued:"排隊",running:"執行",resolve_model:"模型",extract_context:"上下文",decide_search:"檢索",generate_source:"生成",validate_source:"校驗",repair_source:"修復 LaTeX",compile_pdf:"編譯 PDF",write_manifest:"清單",poll_status:"刷新",output_files:"輸出文件",route:"路由",context:"上下文",generate:"生成",validate:"校驗",write:"寫作",compile:"編譯",outline:"提綱",ingest:"攝取",compress:"壓縮",layout:"排版"},context:{ok:"正常",warning:"注意",critical:"緊張",local:"本地估算",heuristic:"後端估算",provider:"提供方估算",input:"輸入",output:"輸出",total:"合計",limit:"上限",use:"佔用",warningLabel:"提示",source:"來源",criticalSummary:"可能需要強壓縮",warningSummary:"可能需要壓縮",ratioSummary:"佔上下文 {percent}",aria:"上下文預算{state}，已佔用 {percent}，{source}"},errors:{required:"必填",absoluteHttpUrl:"請使用完整 http 或 https URL",enum:"請選擇受支援的值",invalid:"值無效"}}},it="/ui/assets/context-budget-dial-critical-NHRAQxeA.png",st="/ui/assets/context-budget-dial-ok-CjS2UYST.png",ot="/ui/assets/context-budget-dial-warning-D8umyfoM.png",lt="/ui/assets/auth-entry-preview-D2ClQ5ne.png",dt="/ui/assets/empty-workbench-preview-B8cAaNFx.png",ct=Object.freeze(["code_homework","essay_latex","beamer_slides","cheat_sheet"]),ut=Object.freeze(["auto","on","off"]),pt=".txt,.md,.py,.ipynb,.pdf,text/plain,text/markdown,text/x-python,application/json,application/pdf",k=Object.freeze({displayName:"Qwen Default",provider:"openai_compatible",baseUrl:"https://dashscope.aliyuncs.com/compatible-mode/v1",model:"qwen-plus",contextWindowHint:1e6,supportsStreaming:!0});function ft(e,n){const r={...e};return n.type==="selectIntent"&&(r.intent=Q(n.intent),r.previewTab="primary",r.fieldErrors={},r.activeFile=re(r.outputPreference,r.activeFile)),n.type==="selectSearchMode"&&(r.searchMode=we(n.searchMode)),n.type==="selectOutputPreference"&&(r.outputPreference=$e(n.outputPreference),r.activeFile=re(r.outputPreference,r.activeFile)),n.type==="setTargetPages"&&(r.targetPages=ke(n.targetPages),r.fieldErrors={...r.fieldErrors||{}},delete r.fieldErrors.target_pages),r}function Q(e){return ct.includes(e)?e:"code_homework"}function we(e){return ut.includes(e)?e:"auto"}function $e(e){return e==="ipynb"?"ipynb":"py"}function ke(e){const n=Number(e);return!Number.isFinite(n)||n<=0?1:Math.round(n)}function re(e,n){const r=e==="ipynb"?["solution.ipynb"]:["solution.py","tests.py","README.md"];return r.includes(n)?n:r[0]}function mt({isAuthenticated:e,taskText:n,runStatus:r}){return!!(e&&String(n||"").trim()&&!b(r))}function b(e){return e==="queued"||e==="running"}function gt(e,n){return Q(e)==="code_homework"?$e(n):"pdf"}function vt(e,n){return Q(e)!=="cheat_sheet"?{}:{target_pages:ke(n),paper_size:"A4",density:"dense"}}function yt({promptText:e,intent:n,outputPreference:r,searchMode:s,modelProfileId:l=null,uploadIds:o=[],targetPages:d=1,revisionOfRunId:u=null}){const $=Q(n),I={task_text:String(e||""),intent:$,output_preference:gt($,r),search_mode:we(s),model_profile_id:l||null,upload_ids:Array.isArray(o)?o.filter(Boolean):[],options:vt($,d)};return u&&(I.revision_of_run_id=u),I}function ht(e){return Array.isArray(e)?e.map(n=>({path:bt(n?.path),kind:String(n?.kind||""),mediaType:String(n?.media_type||""),sizeBytes:Number.isFinite(Number(n?.size_bytes))?Number(n.size_bytes):null,url:String(n?.url||"")})).filter(n=>n.path):[]}function S(e,n,{intent:r="code_homework",outputPreference:s="py",activeFile:l=""}={}){const o=Array.isArray(e)?e:[];return n==="manifest"?wt(o,"manifest","manifest.json"):n==="log"?ee(o,kt(r))||o.find(d=>d.kind==="log"||d.path.startsWith("logs/"))||null:n==="source"?ee(o,$t(r,s,l))||o.find(d=>_t().has(d.kind)&&ie(d))||null:n==="primaryCode"?ee(o,_e(s,l))||o.find(d=>["script","notebook","source"].includes(d.kind)&&ie(d))||null:n==="primaryPdf"&&o.find(d=>d.kind==="pdf"||d.mediaType==="application/pdf")||null}function ie(e){const n=e?.mediaType||e?.media_type||"",r=e?.path||"";return!!(n.startsWith("text/")||n==="application/json"||r.endsWith(".json")||r.endsWith(".py")||r.endsWith(".ipynb")||r.endsWith(".md")||r.endsWith(".tex")||r.endsWith(".log"))}function bt(e){return String(e||"").replace(/^\/+/u,"")}function wt(e,n,r){return e.find(s=>s.kind===n||s.path===r)||null}function ee(e,n){const r=new Set(n.filter(Boolean));return e.find(s=>r.has(s.path))||null}function _e(e,n){return e==="ipynb"?["output/solution.ipynb"]:[`output/${n||"solution.py"}`,"output/solution.py","solution.py"]}function $t(e,n,r){return e==="code_homework"?_e(n,r):e==="beamer_slides"?["output/slides.tex","slides.tex"]:e==="cheat_sheet"?["output/cheat-sheet.tex","cheat-sheet.tex"]:["output/main.tex","main.tex"]}function kt(e){return e==="code_homework"?["logs/generation.log","generation.log"]:["logs/latex.log","logs/generation.log","latex.log","generation.log"]}function _t(){return new Set(["source","script","notebook"])}const v=window.__AI_LEARNING_ASSISTANT_API_URL||window.location.origin,oe="ai_learning_assistant_token",le="ai_learning_assistant_user",xe="ai_learning_assistant_locale",K=k.contextWindowHint,xt=1200,j=new Set(["succeeded","failed","cancelled"]),de="en",W={ok:st,warning:ot,critical:it},te=ea(),p={displayName:k.displayName,provider:k.provider,baseUrl:k.baseUrl,model:k.model,contextWindowHint:k.contextWindowHint,supportsStreaming:k.supportsStreaming,apiKey:""},se=[{id:"code_homework",outputs:["solution.py","solution.ipynb"],stages:["route","context","generate","validate"],accent:"clay"},{id:"essay_latex",outputs:["main.pdf","main.tex"],stages:["route","context","write","compile"],accent:"sage"},{id:"beamer_slides",outputs:["slides.pdf","slides.tex"],stages:["route","outline","write","compile"],accent:"amber"},{id:"cheat_sheet",outputs:["cheat-sheet.pdf","cheat-sheet.tex"],stages:["ingest","compress","layout","compile"],accent:"coral"}],t={locale:te,authMode:"login",token:localStorage.getItem(oe)||"",user:ra(),activePane:"console",intent:"code_homework",outputPreference:"py",searchMode:"auto",targetPages:2,taskText:"",refinementText:"",files:[],fieldErrors:{},context:null,previewTab:"primary",activeFile:"solution.py",notice:{message:"",tone:"neutral"},model:{editorOpen:!1,profiles:[],profile:null,form:{...p},fieldErrors:{},statusMessage:"",statusTone:"neutral",busy:""},authMessage:"",authTone:"neutral",run:H(te),artifacts:_(),history:[na(te)]},Pt=document.getElementById("app");let D=null;St();function St(){Ye(),g(),An(),c(),t.token&&Tt()}async function Tt(){try{const e=await fetch(`${v}/api/auth/me`,{headers:{Authorization:`Bearer ${t.token}`}});if(!e.ok)throw new Error(a("auth.expired"));const n=await e.json();Re(n,t.token)}catch{Fe(),c()}}function c(){const e=!!(t.user&&t.token);Ye(),Pt.innerHTML=`
        <div class="studio-app ${e?"":"is-auth-entry"}" data-mobile-pane="${i(t.activePane)}" lang="${i(t.locale)}">
            <main class="studio-main">
                ${e?`${Lt()}
                            <section class="workbench-grid" aria-label="${i(a("app.title"))}">
                                ${At(e)}
                                ${Dt(e)}
                            </section>`:Nt()}
                ${e&&t.model.editorOpen?tn():""}
            </main>
        </div>
    `,an(),e&&z()}function Pe(){return`
        <div class="locale-switch" role="group" aria-label="${i(a("locale.label"))}">
            ${be.map(e=>`
                <button
                    type="button"
                    class="${t.locale===e.id?"is-active":""}"
                    data-locale="${i(e.id)}"
                    title="${i(e.name)}"
                    aria-label="${i(e.name)}"
                >${i(e.label)}</button>
            `).join("")}
        </div>
    `}function Lt(){return`
        <nav class="mobile-pane-switch" aria-label="${i(a("app.title"))}">
            <button type="button" class="${t.activePane==="console"?"is-active":""}" data-pane="console">${i(a("mobile.console"))}</button>
            <button type="button" class="${t.activePane==="preview"?"is-active":""}" data-pane="preview">${i(a("mobile.preview"))}</button>
        </nav>
    `}function At(e){return`
        <section class="console-pane workbench-pane" aria-label="${i(a("pane.consoleKicker"))}">
            <div class="pane-head">
                <div>
                    <div class="pane-kicker">${i(a("pane.consoleKicker"))}</div>
                </div>
                <div class="pane-actions">
                    ${Pe()}
                    <button class="tool-button" type="button" data-action="open-model-settings" ${e?"":"disabled"}>
                        <span class="tool-glyph" aria-hidden="true"></span>
                        <span>${i(dn())}</span>
                    </button>
                    <button class="identity-chip" type="button" data-action="logout">
                        <span>${i(t.user?.email||a("app.userFallback"))}</span>
                        <strong>${i(t.user?.role||"")}</strong>
                    </button>
                </div>
            </div>

            <div class="console-utility-row">
                ${en()}
                ${Ft()}
            </div>

            <div class="artifact-type-bar" role="radiogroup" aria-label="${i(a("controls.artifactType"))}">
                ${se.map(Rt).join("")}
            </div>

            <section class="command-composer" aria-label="${i(a("composer.brief"))}">
                <div class="composer-head">
                    <label class="field-label" for="task-text">${i(a("composer.brief"))}</label>
                    <span>${i(h(N().id,"description"))}</span>
                </div>
                <textarea
                    id="task-text"
                    class="task-input ${t.fieldErrors.task_text?"has-error":""}"
                    rows="8"
                    placeholder="${i(a("composer.briefPlaceholder"))}"
                >${i(t.taskText)}</textarea>
                ${t.fieldErrors.task_text?`<div class="field-error">${i(t.fieldErrors.task_text)}</div>`:""}
                ${Mt()}
                ${Et()}
                <div class="composer-actions">
                    <button class="run-button" type="button" data-action="run" data-run-status="${i(t.run.status)}" ${fe(e)?"":"disabled"}>
                        <span class="run-glyph" aria-hidden="true"></span>
                        <span data-run-button-label>${Qe()}</span>
                    </button>
                    ${Je(e)}
                </div>
            </section>

            ${It(e)}
            ${Ot()}
        </section>
    `}function Rt(e){const n=t.intent===e.id;return`
        <button
            type="button"
            class="artifact-type ${n?"is-active":""}"
            data-intent="${e.id}"
            data-accent="${e.accent}"
            role="radio"
            aria-checked="${n}"
        >
            <span class="artifact-short">${i(h(e.id,"short"))}</span>
            <span>
                <strong>${i(h(e.id,"label"))}</strong>
                <small>${i(h(e.id,"title"))}</small>
            </span>
        </button>
    `}function Ft(){return`
        <div class="search-control">
            <span class="field-label">${i(a("controls.search"))}</span>
            <div class="segmented-control" data-control="search-mode">
                ${["auto","on","off"].map(e=>`
                    <button type="button" class="${t.searchMode===e?"is-active":""}" data-search-mode="${e}">
                        ${i(a(`controls.searchMode.${e}`))}
                    </button>
                `).join("")}
            </div>
        </div>
    `}function Mt(){return t.intent==="code_homework"?`
            <div class="option-row">
                <div>
                    <span class="field-label">${i(a("controls.output"))}</span>
                    <div class="segmented-control is-tight" data-control="code-output">
                        <button type="button" class="${t.outputPreference==="py"?"is-active":""}" data-output-preference="py">.py</button>
                        <button type="button" class="${t.outputPreference==="ipynb"?"is-active":""}" data-output-preference="ipynb">.ipynb</button>
                    </div>
                </div>
                <div class="status-capsule">${i(a("controls.previewOnly"))}</div>
            </div>
        `:t.intent==="cheat_sheet"?`
            <div class="option-row">
                <label class="number-field">
                    <span class="field-label">${i(a("controls.targetPages"))}</span>
                    <input id="target-pages" class="${t.fieldErrors.target_pages?"has-error":""}" type="number" min="1" max="12" value="${t.targetPages}">
                </label>
                <div class="status-capsule">${i(a("controls.a4"))}</div>
                <div class="status-capsule">${i(a("controls.dense"))}</div>
            </div>
            ${t.fieldErrors.target_pages?`<div class="field-error">${i(t.fieldErrors.target_pages)}</div>`:""}
        `:`
        <div class="option-row">
            <div class="status-capsule">${i(a("controls.pdfFirst"))}</div>
            <div class="status-capsule">${i(a("controls.sourceKept"))}</div>
        </div>
    `}function Et(){const e=t.files.length?a(t.files.length===1?"uploads.selected":"uploads.selectedPlural",{count:t.files.length}):a("uploads.choose");return`
        <section class="upload-module" aria-label="${i(a("uploads.label"))}">
            <div class="upload-zone" data-action="open-file-picker" role="button" tabindex="0">
                <input id="file-input" type="file" multiple accept="${pt}">
                <span class="upload-mark" aria-hidden="true"></span>
                <div>
                    <strong>${i(a("uploads.label"))}</strong>
                    <span>${i(e)}</span>
                </div>
            </div>
            ${t.files.length?Ct():""}
            ${t.notice.message?`<div class="inline-notice is-${t.notice.tone}">${i(t.notice.message)}</div>`:""}
        </section>
    `}function Ct(){return`
        <div class="selected-files">
            ${t.files.map(e=>`
                <div class="selected-file" data-file-key="${i(e.key)}">
                    <span class="file-kind">${i(Yn(e.name))}</span>
                    <span class="file-name">${i(e.name)}</span>
                    <small>${i(Zn(e))}</small>
                    <button class="icon-action" type="button" data-remove-file="${i(e.key)}" aria-label="${i(a("actions.removeFile",{name:e.name}))}">x</button>
                </div>
            `).join("")}
        </div>
    `}function Nt(){return`
        <section class="auth-entry" aria-label="${i(a("auth.kicker"))}">
            <div class="auth-entry-shell">
                <div class="auth-entry-preview" aria-hidden="true">
                    <img src="${i(lt)}" alt="">
                    <div class="auth-preview-paper">
                        <span class="auth-preview-rule"></span>
                        <div class="auth-preview-brand">${i(a("app.brand"))}</div>
                        <i></i><i></i><i></i>
                    </div>
                </div>
                ${Te()}
            </div>
        </section>
    `}function It(e){const n=!e||!t.run.id||b(t.run.status);return`
        <section class="refinement-composer" aria-label="${i(a("refinement.label"))}">
            <div class="composer-head">
                <label class="field-label" for="refinement-text">${i(a("refinement.label"))}</label>
                <span>${i(t.run.id?a("refinement.revisionSource",{id:at(t.run.id)}):a("refinement.availableAfterRun"))}</span>
            </div>
            <textarea
                id="refinement-text"
                rows="3"
                placeholder="${i(a("refinement.placeholder"))}"
                ${n?"disabled":""}
            >${i(t.refinementText)}</textarea>
            <div class="composer-actions">
                <button class="secondary-action" type="button" data-action="run-refinement" ${n||!t.refinementText.trim()?"disabled":""}>
                    ${i(a("actions.newRevisionRun"))}
                </button>
                <span class="run-note" data-refinement-note>${i(a("refinement.note"))}</span>
            </div>
        </section>
    `}function Ot(){return`
        <section class="history-stream" aria-label="${i(a("history.label"))}">
            <div class="history-head">
                <span>${i(a("history.label"))}</span>
                <small>${i(a("history.entries",{count:t.history.length}))}</small>
            </div>
            <div class="history-list">
                ${t.history.slice().reverse().map(Bt).join("")}
            </div>
        </section>
    `}function Bt(e){return`
        <article class="history-item is-${i(e.kind)}" data-status="${i(e.status||"idle")}">
            <div class="history-marker"></div>
            <div class="history-content">
                <div class="history-title">
                    <strong>${i(e.title)}</strong>
                    <span>${i(oa(e.timestamp))}</span>
                </div>
                <p>${i(e.message)}</p>
                ${e.meta?`<div class="history-meta">${i(e.meta)}</div>`:""}
            </div>
        </article>
    `}function Dt(e){const n=N();return`
        <section class="preview-pane workbench-pane" aria-label="${i(a("pane.previewKicker"))}">
            <div class="preview-header">
                <div>
                    <div class="pane-kicker">${i(a("pane.previewKicker"))}</div>
                    <h2>${i(h(n.id,"title"))}</h2>
                </div>
                <div class="preview-actions">
                    <button class="secondary-action" type="button" data-action="copy-current-path" ${t.run.outputRoot?"":"disabled"}>${i(a("actions.copyPath"))}</button>
                    <button class="secondary-action" type="button" data-action="reveal-run" ${t.run.outputRoot?"":"disabled"}>${i(a("actions.reveal"))}</button>
                    <button class="secondary-action" type="button" data-action="regenerate" ${fe(e)?"":"disabled"}>${i(a("actions.regenerate"))}</button>
                </div>
            </div>

            <div class="preview-status-strip">
                ${qt()}
                ${Ut(n)}
            </div>

            <div class="preview-shell" data-intent="${i(t.intent)}" data-run-status="${i(t.run.status)}" style="--preview-empty-image: url('${i(dt)}')">
                ${zt()}
                <div class="preview-body">
                    ${Kt()}
                </div>
            </div>

            ${Zt()}
        </section>
    `}function qt(){return`
        <div class="run-status-pill" data-status="${i(t.run.status)}">
            <span class="status-light"></span>
            <div>
                <strong>${i(et(t.run.status))}</strong>
                <span>${i(a("preview.currentStage",{stage:w(t.run.stage)}))}</span>
            </div>
        </div>
        <p class="run-message">${i(t.run.error||t.run.message)}</p>
    `}function Ut(e){const n=Jn(t.run.stage,t.run.status);return`
        <div class="stage-track-shell" aria-label="${i(a("preview.statusMessage"))}">
            <div class="stage-track-head">
                <span>${i(a("preview.stageProgress"))}</span>
                <small>${i(a("preview.currentStage",{stage:w(t.run.stage)}))}</small>
            </div>
            <div class="stage-track" role="list">
                ${e.stages.map((r,s)=>`
                    <span class="stage-step ${r===n?"is-active":""}" role="listitem" ${r===n?'aria-current="step"':""}>
                        <small>${s+1}</small>
                        <strong>${i(w(r))}</strong>
                    </span>
                `).join("")}
            </div>
        </div>
    `}function zt(){const e=Fn();return`
        <div class="preview-tabs" role="tablist" aria-label="${i(a("pane.previewKicker"))}">
            ${e.map(n=>`
                <button
                    type="button"
                    role="tab"
                    class="${t.previewTab===n.id?"is-active":""}"
                    data-preview-tab="${n.id}"
                    aria-selected="${t.previewTab===n.id}"
                >
                    ${i(n.label)}
                </button>
            `).join("")}
        </div>
    `}function Kt(){return t.previewTab==="source"?Gt():t.previewTab==="logs"?Qt():t.previewTab==="manifest"?Jt():t.intent==="code_homework"?jt():t.intent==="essay_latex"?Ht():t.intent==="beamer_slides"?Xt():Vt()}function jt(){return t.outputPreference==="ipynb"?Wt():`
        <div class="code-product">
            <div class="code-tabs">
                ${Rn().map(n=>`
                    <button type="button" class="${t.activeFile===n?"is-active":""}" data-active-file="${i(n)}">
                        ${i(n)}
                    </button>
                `).join("")}
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${i(a("actions.copyVisible"))}</button>
            </div>
            <div class="code-editor" aria-label="${i(a("preview.code"))}">
                ${J(me(t.activeFile),Bn(t.activeFile))}
            </div>
            <div class="terminal-strip" data-status="${i(t.run.status)}">
                <span>${i(Gn())}</span>
                <strong>${i(Qn())}</strong>
            </div>
        </div>
    `}function Wt(){const e=In();return`
        <div class="notebook-product">
            <div class="notebook-toolbar">
                <span>solution.ipynb</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${i(a("actions.copyVisible"))}</button>
            </div>
            <div class="notebook-cell is-markdown">
                <span class="cell-label">${i(a("preview.markdown"))}</span>
                <h3>${i(e.title)}</h3>
                <p>${i(e.body)}</p>
            </div>
            <div class="notebook-cell">
                <span class="cell-label">${i(a("preview.code"))}</span>
                <div class="code-editor is-compact">${J(e.code)}</div>
            </div>
            <div class="terminal-strip" data-status="${i(t.run.status)}">
                <span>${i(a("preview.notebookValidation"))}</span>
                <strong>${i(e.detail)}</strong>
            </div>
        </div>
    `}function Ht(){return`
        <div class="pdf-stage">
            <div class="page-rail">
                <span class="is-active">1</span>
                <span>2</span>
                <span>3</span>
            </div>
            <article class="pdf-page essay-page">
                <header>
                    <span class="paper-overline">${i(a("preview.latexReport"))}</span>
                    <h3>${i(G(a("preview.generatedEssay")))}</h3>
                    <div class="paper-rule"></div>
                </header>
                <section>
                    <h4>${i(a("preview.introduction"))}</h4>
                    <p></p><p class="short"></p>
                    <h4>${i(a("preview.argument"))}</h4>
                    <p></p><p></p><p class="shorter"></p>
                    <h4>${i(a("preview.references"))}</h4>
                    <p class="short"></p>
                </section>
            </article>
            ${ce(a("preview.emptyPdfTitle"),a("preview.emptyPdfMessage"))}
        </div>
    `}function Xt(){return`
        <div class="slide-product">
            <aside class="slide-thumbs" aria-label="${i(a("preview.deckTitle"))}">
                <span class="is-active"></span>
                <span></span>
                <span></span>
                <span></span>
            </aside>
            <div class="slide-canvas">
                <div class="slide-page">
                    <span class="slide-kicker">${i(h("beamer_slides","title"))}</span>
                    <h3>${i(G(a("preview.generatedSlides")))}</h3>
                    <div class="slide-columns">
                        <span></span><span></span><span></span><span></span>
                    </div>
                    <div class="slide-footer">${i(a("preview.pageLabel"))}</div>
                </div>
            </div>
            ${ce(a("preview.deckTitle"),a("preview.deckMessage"))}
        </div>
    `}function Vt(){const e=Math.max(1,Math.round(Number(t.targetPages)||1));return`
        <div class="cheat-product">
            <div class="cheat-toolbar">
                <span>${i(a("preview.a4DenseLayout"))}</span>
                <strong>${i(a(e===1?"preview.onePage":"preview.manyPages",{count:e}))}</strong>
            </div>
            <div class="cheat-pages">
                ${Array.from({length:Math.min(e,4)},(n,r)=>`
                    <article class="cheat-page">
                        <header>
                            <span></span><span></span>
                        </header>
                        <div class="cheat-grid">
                            ${Array.from({length:36},(s,l)=>`
                                <i class="${(l+r)%7===0?"is-strong":""}"></i>
                            `).join("")}
                        </div>
                    </article>
                `).join("")}
            </div>
            ${ce(a("preview.sheetTitle"),a("preview.sheetMessage"))}
        </div>
    `}function ce(e,n){return t.run.status==="succeeded"&&t.run.outputRoot?"":t.run.status==="failed"?`
            <div class="preview-overlay is-error">
                <strong>${i(t.run.errorCode||a("preview.failedTitle"))}</strong>
                <span>${i(t.run.error||a("preview.failedMessage"))}</span>
            </div>
        `:b(t.run.status)?`
            <div class="preview-overlay is-running">
                <strong>${i(w(t.run.stage))}</strong>
                <span>${i(t.run.message)}</span>
            </div>
        `:`
        <div class="preview-overlay">
            <strong>${i(e)}</strong>
            <span>${i(n)}</span>
        </div>
    `}function Gt(){const e=We(),n=P(e.artifact,Ke()),r=n.endsWith(".tex")?"latex":n.endsWith(".json")?"json":"python";return`
        <div class="inspection-product">
            ${ue(a("preview.sourceTitle"),e.message,e.tone)}
            <div class="inspection-head">
                <span>${i(n)}</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${i(a("actions.copyVisible"))}</button>
            </div>
            <div class="code-editor">${J(e.text,r)}</div>
            <div class="inspection-note">${i(Z())}</div>
        </div>
    `}function Qt(){const e=He();return`
        <div class="inspection-product">
            ${ue(a("preview.logsTitle"),e.message,e.tone)}
            <div class="inspection-head">
                <span>${i(P(e.artifact,a("source.generationLog")))}</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${i(a("actions.copyVisible"))}</button>
            </div>
            <div class="log-view">
                ${On(e.text)}
            </div>
            <div class="inspection-note">${i(Z())}</div>
        </div>
    `}function Jt(){const e=Xe(),n=e.text||JSON.stringify(Se(),null,2);return`
        <div class="inspection-product">
            ${ue(a("preview.manifestTitle"),e.message,e.tone)}
            <div class="inspection-head">
                <span>${i(P(e.artifact,"manifest.json"))}</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${i(a("actions.copyVisible"))}</button>
            </div>
            <div class="code-editor">${J(n,"json")}</div>
            <div class="inspection-note">${i(Z())}</div>
        </div>
    `}function Se(){return{schema_version:1,run_id:t.run.id||null,revision_of_run_id:t.run.revisionOfRunId||null,intent:t.intent,search:{mode:t.searchMode},status:t.run.status,outputs:ze().map(e=>({path:e.relativePath,kind:e.kind}))}}function ue(e,n,r="neutral"){return`
        <div class="inspection-intro is-${i(r)}">
            <strong>${i(e)}</strong>
            <span>${i(n)}</span>
        </div>
    `}function Zt(){const e=Mn();return`
        <section class="output-dock" aria-label="${i(a("preview.files"))}">
            <div class="output-head">
                <span>${i(a("preview.files"))}</span>
                <small>${t.run.outputRoot?i(rt(t.run.outputRoot)):i(a("preview.runFolderPending"))}</small>
            </div>
            <div class="output-grid">
                ${e.map(n=>Yt(n)).join("")}
            </div>
        </section>
    `}function Yt(e){const n=Xn(e.relativePath),r=!!(e.artifact||t.run.outputRoot&&(t.run.status==="succeeded"||e.kind!=="pdf"));return`
        <div class="output-file" data-kind="${i(e.kind)}">
            <span class="file-kind">${i(e.badge)}</span>
            <div>
                <strong>${i(e.name)}</strong>
                <small>${i(r?e.readyLabel:e.pendingLabel)}</small>
            </div>
            <div class="file-actions">
                <button type="button" data-copy-file="${i(n||e.relativePath)}" ${n?"":"disabled"}>${i(a("actions.copy"))}</button>
                <button type="button" data-open-file="${i(n||"")}" ${n?"":"disabled"}>${i(a("actions.open"))}</button>
            </div>
        </div>
    `}function en(){const e=De();return`
        <div class="context-widget" tabindex="0" data-context-state="${i(e.warning_level)}" aria-label="${i(nt(e))}">
            <div class="dial-ring" aria-hidden="true">
                <img src="${i(W[e.warning_level]||W.ok)}" alt="">
                <span data-context-field="state">${i(E(e.warning_level))}</span>
            </div>
            <div class="context-copy">
                <strong data-context-field="source-label">${i(C(e.source))}</strong>
                <span data-context-field="summary">${i(tt(e))}</span>
            </div>
            <div class="context-popover" role="tooltip">
                <div><span>${i(a("context.input"))}</span><strong data-context-field="input">${y(e.estimated_input_tokens)}</strong></div>
                <div><span>${i(a("context.output"))}</span><strong data-context-field="output">${y(e.estimated_output_tokens)}</strong></div>
                <div><span>${i(a("context.total"))}</span><strong data-context-field="total">${y(e.estimated_total_tokens)}</strong></div>
                <div><span>${i(a("context.limit"))}</span><strong data-context-field="limit">${y(e.context_window_limit)}</strong></div>
                <div><span>${i(a("context.use"))}</span><strong data-context-field="utilization">${Y(e.utilization_ratio)}</strong></div>
                <div><span>${i(a("context.warningLabel"))}</span><strong data-context-field="warning">${i(E(e.warning_level))}</strong></div>
                <div><span>${i(a("context.source"))}</span><strong data-context-field="source">${i(C(e.source))}</strong></div>
            </div>
        </div>
    `}function Te(){return`
        <section class="auth-panel" aria-label="${i(a("auth.kicker"))}">
            <div class="auth-head">
                <div>
                    <div class="pane-kicker">${i(a("auth.kicker"))}</div>
                    <h2>${i(t.authMode==="login"?a("auth.loginTitle"):a("auth.registerTitle"))}</h2>
                </div>
                <div class="auth-head-actions">
                    ${Pe()}
                    <div class="auth-tabs">
                        <button type="button" class="${t.authMode==="login"?"is-active":""}" data-auth-mode="login">${i(a("actions.login"))}</button>
                        <button type="button" class="${t.authMode==="register"?"is-active":""}" data-auth-mode="register">${i(a("auth.registerTitle"))}</button>
                    </div>
                </div>
            </div>
            <form id="auth-form" class="auth-form">
                <label>
                    <span class="field-label">${i(a("auth.email"))}</span>
                    <input id="auth-email" type="email" autocomplete="email" placeholder="name@cuhk.edu.hk">
                </label>
                <label>
                    <span class="field-label">${i(a("auth.password"))}</span>
                    <input id="auth-password" type="password" autocomplete="${t.authMode==="login"?"current-password":"new-password"}">
                </label>
                ${t.authMode==="register"?`<label>
                            <span class="field-label">${i(a("auth.confirmPassword"))}</span>
                            <input id="auth-confirm" type="password" autocomplete="new-password">
                        </label>`:""}
                <button class="run-button is-full" type="submit">${i(t.authMode==="login"?a("actions.login"):a("actions.createAccount"))}</button>
                <div class="inline-notice is-${t.authTone}">${i(t.authMessage)}</div>
            </form>
        </section>
    `}function tn(){const e=t.model.form,n=t.model.profile,r=n?.api_key_ref?a("model.savedKey"):a("model.noSavedKey"),s=!!t.model.busy;return`
        <section class="model-modal" role="dialog" aria-modal="true" aria-label="${i(a("model.settingsKicker"))}">
            <div class="model-dialog">
                <div class="model-dialog-head">
                    <div>
                        <div class="pane-kicker">${i(a("model.settingsKicker"))}</div>
                        <h2>${i(e.displayName||a("model.defaultName"))}</h2>
                    </div>
                    <button class="icon-action is-large" type="button" data-action="close-model-settings" aria-label="${i(a("actions.closeModel"))}">x</button>
                </div>
                <form id="model-settings-form" class="model-form" novalidate>
                    <p class="model-helper">${i(a("model.defaultHelp"))}</p>
                    ${O("displayName",a("model.displayName"),"text",e.displayName,a("model.defaultName"),!1)}
                    ${O("baseUrl",a("model.baseUrl"),"url",e.baseUrl,p.baseUrl,!0)}
                    ${O("model",a("model.model"),"text",e.model,p.model,!0)}
                    ${nn(e)}
                    ${O("apiKey",a("model.apiKey"),"password",e.apiKey,n?.api_key_ref?a("model.newKey"):a("model.apiKey"),!1,"new-password")}
                    <div class="model-secret-row">
                        <span class="key-state ${n?.api_key_ref?"is-ready":""}">${i(r)}</span>
                        <span class="profile-id">${i(n?.id||a("model.environmentDefault"))}</span>
                    </div>
                    <div class="model-actions">
                        <button class="secondary-action" type="button" data-action="test-model-settings" ${s?"disabled":""}>${i(a("actions.test"))}</button>
                        <button class="run-button" type="submit" ${s?"disabled":""}>${i(t.model.busy==="save"?a("actions.saving"):a("actions.save"))}</button>
                    </div>
                    <div class="inline-notice is-${t.model.statusTone}">${i(t.model.statusMessage)}</div>
                </form>
            </div>
        </section>
    `}function nn(e){return`
        <div class="model-default-grid" aria-label="${i(a("model.defaultsSummary"))}">
            <div>
                <span>${i(a("model.provider"))}</span>
                <strong>${i(e.provider||p.provider)}</strong>
            </div>
            <div>
                <span>${i(a("model.contextWindow"))}</span>
                <strong>${i(y(e.contextWindowHint||p.contextWindowHint))}</strong>
            </div>
            <div>
                <span>${i(a("model.streaming"))}</span>
                <strong>${i(e.supportsStreaming?a("model.streamingOn"):a("model.streamingOff"))}</strong>
            </div>
        </div>
    `}function O(e,n,r,s,l,o,d="off"){const u=t.model.fieldErrors[e]||"";return`
        <label class="model-field ${u?"has-error":""}">
            <span class="field-label">${i(n)}</span>
            <input
                data-model-field="${e}"
                type="${r}"
                value="${i(s)}"
                placeholder="${i(l)}"
                autocomplete="${i(d)}"
                ${o?"required":""}
            >
            <span class="field-error">${i(u)}</span>
        </label>
    `}function an(){Le(),Ae(),document.querySelectorAll("[data-pane]").forEach(n=>{n.addEventListener("click",()=>{t.activePane=n.dataset.pane,c()})}),document.getElementById("task-text")?.addEventListener("input",n=>{t.taskText=n.target.value,delete t.fieldErrors.task_text,n.target.classList.remove("has-error"),n.target.closest(".command-composer")?.querySelector(".field-error")?.remove(),g(),z(),ve()}),document.getElementById("refinement-text")?.addEventListener("input",n=>{t.refinementText=n.target.value,g(),z(),ve()}),document.querySelectorAll("button[data-intent]").forEach(n=>{n.addEventListener("click",()=>{B({type:"selectIntent",intent:n.dataset.intent}),g(),c()})}),document.querySelectorAll("[data-search-mode]").forEach(n=>{n.addEventListener("click",()=>{B({type:"selectSearchMode",searchMode:n.dataset.searchMode}),c()})}),document.querySelectorAll("[data-output-preference]").forEach(n=>{n.addEventListener("click",()=>{B({type:"selectOutputPreference",outputPreference:n.dataset.outputPreference}),g(),c()})}),document.getElementById("target-pages")?.addEventListener("input",n=>{B({type:"setTargetPages",targetPages:n.target.value}),g(),z()});const e=document.querySelector("[data-action='open-file-picker']");e?.addEventListener("click",()=>document.getElementById("file-input")?.click()),e?.addEventListener("keydown",n=>{n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),document.getElementById("file-input")?.click())}),document.getElementById("file-input")?.addEventListener("change",n=>{Tn(Array.from(n.target.files||[])),c()}),document.querySelectorAll("[data-remove-file]").forEach(n=>{n.addEventListener("click",()=>{t.files=t.files.filter(r=>r.key!==n.dataset.removeFile),g(),c()})}),document.querySelector("[data-action='run']")?.addEventListener("click",()=>ne({isRevision:!1})),document.querySelector("[data-action='run-refinement']")?.addEventListener("click",()=>ne({isRevision:!0})),document.querySelector("[data-action='regenerate']")?.addEventListener("click",()=>ne({isRevision:!1,isRegenerate:!0})),document.querySelector("[data-action='logout']")?.addEventListener("click",()=>{F(),Fe(),c()}),document.querySelector("[data-action='open-model-settings']")?.addEventListener("click",cn),document.querySelector("[data-action='close-model-settings']")?.addEventListener("click",Me),document.getElementById("model-settings-form")?.addEventListener("submit",fn),document.querySelector("[data-action='test-model-settings']")?.addEventListener("click",mn),document.querySelectorAll("[data-model-field]").forEach(n=>{n.addEventListener("input",()=>{t.model.form[n.dataset.modelField]=n.value,delete t.model.fieldErrors[n.dataset.modelField],n.closest(".model-field")?.classList.remove("has-error");const r=n.closest(".model-field")?.querySelector(".field-error");r&&(r.textContent="")})}),document.querySelector(".preview-tabs")?.addEventListener("click",n=>{const r=n.target.closest("[data-preview-tab]");r&&(t.previewTab=r.dataset.previewTab,c())}),document.querySelectorAll("[data-active-file]").forEach(n=>{n.addEventListener("click",()=>{t.activeFile=n.dataset.activeFile,c()})}),document.querySelector("[data-action='copy-visible-preview']")?.addEventListener("click",jn),document.querySelector("[data-action='copy-current-path']")?.addEventListener("click",()=>X(t.run.outputRoot||"",a("run.pathCopied"))),document.querySelector("[data-action='reveal-run']")?.addEventListener("click",Wn),document.querySelectorAll("[data-copy-file]").forEach(n=>{n.addEventListener("click",()=>X(n.dataset.copyFile||"",a("run.artifactPathCopied")))}),document.querySelectorAll("[data-open-file]").forEach(n=>{n.addEventListener("click",()=>Hn(n.dataset.openFile||""))}),document.onkeydown=un}function B(e){Object.assign(t,ft({intent:t.intent,previewTab:t.previewTab,fieldErrors:t.fieldErrors,activeFile:t.activeFile,outputPreference:t.outputPreference,searchMode:t.searchMode,targetPages:t.targetPages},e))}function Le(e=document){e.querySelectorAll("[data-locale]").forEach(n=>{n.addEventListener("click",()=>{ta(n.dataset.locale)})})}function Ae(e=document){e.querySelectorAll("[data-auth-mode]").forEach(n=>{n.addEventListener("click",()=>{rn(n.dataset.authMode)})}),e.querySelector("#auth-form")?.addEventListener("submit",sn)}function rn(e){t.authMode=e==="register"?"register":"login",t.authMessage="",t.authTone="neutral",q()}function q(){const e=document.querySelector(".auth-panel");if(!e){c();return}const r=document.createRange().createContextualFragment(Te()).querySelector(".auth-panel");if(!r){c();return}e.replaceWith(r),Le(r),Ae(r)}async function sn(e){e.preventDefault();const n=document.getElementById("auth-email")?.value.trim().toLowerCase()||"",r=document.getElementById("auth-password")?.value||"",s=document.getElementById("auth-confirm")?.value||"",l=t.authMode==="login"?"/api/auth/login":"/api/auth/register",o=t.authMode==="login"?{email:n,password:r}:{email:n,password:r,confirm_password:s};t.authMessage=a("auth.contacting"),t.authTone="neutral",q();try{const d=await fetch(`${v}${l}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),u=await d.json().catch(()=>({}));if(!d.ok)throw new Error(x(u,a("auth.failed")));if(t.authMode==="register"){t.authMode="login",t.authMessage=a("auth.created"),t.authTone="success",q();return}Re({email:u.email,role:u.role},u.token)}catch(d){t.authMessage=f(d.message),t.authTone="error",q()}}async function ne({isRevision:e,isRegenerate:n=!1}){if(!t.user||!t.token)return;const r=e?t.refinementText.trim():t.taskText.trim(),s=e?t.run.id:null;if(!r){t.fieldErrors.task_text=e?"":a("run.required"),t.run={...H(),status:"idle",stage:"validate_request",message:a(e?"refinement.missing":"run.addBrief")},c();return}F(),g(),t.fieldErrors={},t.notice={message:"",tone:"neutral"},t.run={...H(),status:"queued",stage:t.files.some(l=>!l.uploadId)?"upload_inputs":"submit_run",message:t.files.some(l=>!l.uploadId)?a("run.preparingUploads"):a("run.submitting"),revisionOfRunId:s},t.artifacts=_(),Ln({kind:e?"revision":"command",status:"queued",title:a(e?"history.followUpTitle":n?"history.regenerateTitle":"history.generationTitle"),message:r,meta:`${h(N().id,"label")} / ${a("controls.search")} ${a(`controls.searchMode.${t.searchMode}`)}`}),t.activePane="preview",c();try{const l=await on();t.run={...t.run,stage:"submit_run",message:a("run.submitting")},c();const o=await fetch(`${v}/api/runs`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(yn({promptText:r,uploadIds:l,revisionOfRunId:s}))}),d=await o.json().catch(()=>({}));if(!o.ok){hn(d,a("run.requestFailed")),c();return}Ie(d),M(),e&&(t.refinementText=""),c();const u=d.id||d.run_id||t.run.id;u&&(j.has(t.run.status)?await Be(u):await Oe(u),j.has(t.run.status)||_n(u))}catch(l){t.run={...t.run,status:"failed",stage:t.run.stage||"submit_run",message:a("run.requestFailed"),error:f(l.message),errorCode:"frontend_request_failed"},M(),c()}}async function on(){const e=t.files.filter(o=>!o.uploadId);if(!e.length)return t.files.map(o=>o.uploadId).filter(Boolean);e.forEach(o=>{o.status="uploading"}),c();const n=new FormData;e.forEach(o=>n.append("files",o.file,o.name));const r=await fetch(`${v}/api/uploads`,{method:"POST",headers:{Authorization:`Bearer ${t.token}`},body:n}),s=await r.json().catch(()=>({}));if(!r.ok){e.forEach(d=>{d.status="failed"});const o=r.status===404?a("uploads.unavailable"):a("uploads.failedGeneric");throw new Error(x(s,o))}const l=Array.isArray(s.uploads)?s.uploads:[];if(e.forEach((o,d)=>{const u=l[d];o.uploadId=u?.id||"",o.status=o.uploadId?"uploaded":"failed"}),e.some(o=>!o.uploadId))throw new Error(a("uploads.missingIds"));return t.files.map(o=>o.uploadId).filter(Boolean)}function Re(e,n){t.user=e,t.token=n,localStorage.setItem(oe,n),localStorage.setItem(le,JSON.stringify(e)),t.authMessage="",t.run=H(),t.artifacts=_(),g(),c(),pn()}function Fe(){ln(),t.user=null,t.token="",t.artifacts=_(),localStorage.removeItem(oe),localStorage.removeItem(le)}function ln(){t.model={editorOpen:!1,profiles:[],profile:null,form:{...p},fieldErrors:{},statusMessage:"",statusTone:"neutral",busy:""}}function dn(){const e=t.model.profile;return e?.model?e.model:t.model.statusTone==="error"?a("model.needsAttention"):a("model.defaultButton")}function cn(){pe(),t.model.editorOpen=!0,t.model.statusMessage=t.model.profile?a("model.savedLoaded"):a("model.defaultsLoaded"),t.model.statusTone="neutral",t.model.fieldErrors={},c()}function Me(){t.model.editorOpen=!1,t.model.form.apiKey="",t.model.fieldErrors={},t.model.busy="",c()}function un(e){e.key==="Escape"&&t.model.editorOpen&&Me()}async function pn(){if(t.token)try{const e=await fetch(`${v}/api/settings/model-profiles`,{headers:{Authorization:`Bearer ${t.token}`}}),n=await e.json().catch(()=>[]);if(!e.ok)throw new Error(x(n,a("model.loadFailed")));const r=Array.isArray(n)?n.map(Ee):[];t.model.profiles=r,t.model.profile=r.find(s=>s.is_default)||r[0]||null,pe(),t.model.editorOpen&&(t.model.statusMessage=t.model.profile?a("model.savedLoaded"):a("model.defaultsLoaded"),t.model.statusTone="neutral"),c()}catch(e){t.model.statusMessage=f(e.message),t.model.statusTone="error",t.model.editorOpen&&c()}}function Ee(e){return{id:String(e?.id||"default-qwen"),display_name:String(e?.display_name||a("model.defaultName")),provider:String(e?.provider||"openai_compatible"),base_url:String(e?.base_url||p.baseUrl),model:String(e?.model||p.model),api_key_ref:e?.api_key_ref?String(e.api_key_ref):null,context_window_hint:Number(e?.context_window_hint||p.contextWindowHint),supports_streaming:e?.supports_streaming===void 0?p.supportsStreaming:!!e.supports_streaming,is_default:!!e?.is_default}}function pe(){const e=t.model.profile;t.model.form={displayName:e?.display_name||a("model.defaultName"),provider:e?.provider||p.provider,baseUrl:e?.base_url||p.baseUrl,model:e?.model||p.model,contextWindowHint:Number(e?.context_window_hint||p.contextWindowHint),supportsStreaming:e?.supports_streaming===void 0?p.supportsStreaming:!!e.supports_streaming,apiKey:""}}async function fn(e){e.preventDefault(),t.model.busy="save",t.model.statusMessage=a("model.saving"),t.model.statusTone="neutral",t.model.fieldErrors={},c();try{const n=await fetch(`${v}/api/settings/model-profiles/default`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(Ce({includeApiKey:!0}))}),r=await n.json().catch(()=>({}));if(!n.ok){Ne(r,a("model.saveFailed"));return}t.model.profile=Ee(r),t.model.profiles=[t.model.profile],pe(),t.model.statusMessage=a("model.saved"),t.model.statusTone="success",t.model.fieldErrors={}}catch(n){t.model.statusMessage=f(n.message),t.model.statusTone="error"}finally{t.model.busy="",t.model.form.apiKey="",c()}}async function mn(){t.model.busy="test",t.model.statusMessage=a("model.testing"),t.model.statusTone="neutral",t.model.fieldErrors={},c();try{const e=!!t.model.form.apiKey.trim(),n=await fetch(`${v}/api/settings/model-profiles/test`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(e?Ce({includeApiKey:!0}):{})}),r=await n.json().catch(()=>({}));if(!n.ok){Ne(r,a("model.testFailed"));return}t.model.statusMessage=a("model.connectionOk",{model:r.model||t.model.form.model}),t.model.statusTone="success",t.model.fieldErrors={}}catch(e){t.model.statusMessage=f(e.message),t.model.statusTone="error"}finally{t.model.busy="",c()}}function Ce({includeApiKey:e}){const n=t.model.form,r={display_name:n.displayName.trim()||a("model.defaultName"),provider:n.provider||"openai_compatible",base_url:n.baseUrl.trim()||p.baseUrl,model:n.model.trim()||p.model,context_window_hint:Number(n.contextWindowHint||p.contextWindowHint),supports_streaming:!!(n.supportsStreaming??p.supportsStreaming)};return n.apiKey.trim()&&(r.api_key=n.apiKey.trim()),r}function Ne(e,n){const r=e?.error||{};t.model.statusMessage=r.code?`${r.code}: ${f(r.message||n)}`:x(e,n),t.model.statusTone="error",t.model.fieldErrors=gn(r.fields||[])}function gn(e){return e.reduce((n,r)=>{const s=vn(r.field);return s&&(n[s]=U(r.rule)),n},{})}function vn(e){return e==="base_url"?"baseUrl":e==="model"?"model":e==="api_key"?"apiKey":e==="display_name"?"displayName":""}function U(e){return e==="required"?a("errors.required"):e==="absolute_http_url"?a("errors.absoluteHttpUrl"):e==="enum"?a("errors.enum"):e||a("errors.invalid")}function H(e){const n=e||t.locale;return{id:"",status:"idle",stage:"compose",message:V(n,"run.ready"),error:null,errorCode:"",outputRoot:"",revisionOfRunId:null}}function _(){return{runId:"",loading:!1,loaded:!1,error:"",items:[],manifest:null,textByPath:{},errorsByPath:{}}}function yn({promptText:e,uploadIds:n,revisionOfRunId:r}){return yt({promptText:e,uploadIds:n,revisionOfRunId:r,intent:t.intent,outputPreference:t.outputPreference,searchMode:t.searchMode,modelProfileId:t.model.profile?.id||null,targetPages:t.targetPages})}function fe(e){return mt({isAuthenticated:e,taskText:t.taskText,runStatus:t.run.status})}function hn(e,n){const r=e?.error||{};t.fieldErrors=bn(r.fields||[]),t.run={...t.run,status:"failed",stage:"submit_run",message:a("run.requestFailed"),error:x(e,n),errorCode:String(r.code||"request_failed")},M()}function bn(e){return e.reduce((n,r)=>(r.field==="task_text"&&(n.task_text=U(r.rule)),r.field==="options.target_pages"&&(n.target_pages=U(r.rule)),r.field==="output_preference"&&(n.output_preference=U(r.rule)),n),{})}function Ie(e){const n=e.id||e.run_id||t.run.id||"";n&&t.run.id&&n!==t.run.id&&(t.artifacts=_()),e.context&&(t.context=Ue(e.context,"backend")),t.run={...t.run,id:n,status:e.status||t.run.status,stage:e.stage||t.run.stage||"queued",message:wn(e),error:$n(e),errorCode:kn(e),outputRoot:e.output_root||t.run.outputRoot||""},!j.has(t.run.status)&&t.artifacts.runId&&(t.artifacts=_())}function wn(e){return e.message?f(e.message):e.error?.message?f(e.error.message):e.error_message?f(e.error_message):e.status==="succeeded"?a("run.succeeded"):e.status==="failed"?a("run.failed"):e.status==="running"?a("run.running"):a("run.queued")}function $n(e){return e.error?.message?f(e.error.message):e.status==="failed"&&e.error_message?f(e.error_message):null}function kn(e){return e.error?.code?String(e.error.code):e.status==="failed"&&typeof e.error_message=="string"?e.error_message.split(":")[0]||"run_failed":""}function _n(e){F(),D=window.setInterval(()=>{Oe(e).catch(n=>{F(),t.run={...t.run,status:"failed",stage:"poll_status",message:a("run.refreshFailed"),error:f(n.message),errorCode:"status_refresh_failed"},M(),c()})},xt)}function F(){D&&(window.clearInterval(D),D=null)}async function Oe(e){if(!e||!t.token)return;const n=await fetch(`${v}/api/runs/${encodeURIComponent(e)}/events`,{headers:{Authorization:`Bearer ${t.token}`}}),r=await n.json().catch(()=>({}));if(!n.ok)throw new Error(x(r,a("run.statusRefreshFailed")));Ie(r),M(),c(),j.has(t.run.status)&&(F(),Be(e).catch(()=>{}))}async function Be(e){if(!(!e||!t.token)&&!(t.artifacts.runId===e&&(t.artifacts.loading||t.artifacts.loaded))){t.artifacts={..._(),runId:e,loading:!0},c();try{const n=await fetch(`${v}/api/runs/${encodeURIComponent(e)}/artifacts`,{headers:{Authorization:`Bearer ${t.token}`}}),r=await n.json().catch(()=>({}));if(!n.ok)throw new Error(x(r,a("source.artifactLoadFailed")));if(t.run.id!==e)return;const s=ht(r.artifacts);if(t.artifacts={...t.artifacts,loading:!0,items:s,manifest:r.manifest&&typeof r.manifest=="object"?r.manifest:null,error:""},c(),await xn(e,s),t.run.id!==e)return;t.artifacts={...t.artifacts,loading:!1,loaded:!0},c()}catch(n){if(t.run.id!==e)return;t.artifacts={...t.artifacts,loading:!1,loaded:!1,error:f(n.message||a("source.artifactLoadFailed"))},c()}}}async function xn(e,n){const r=n.filter(o=>ie(o)),s={},l={};await Promise.all(r.map(async o=>{try{const d=await fetch(Pn(e,o),{headers:{Authorization:`Bearer ${t.token}`}}),u=await d.text();if(!d.ok)throw new Error(f(u||a("source.artifactReadFailed")));s[o.path]=ia(u)}catch(d){l[o.path]=f(d.message||a("source.artifactReadFailed"))}})),t.run.id===e&&(t.artifacts={...t.artifacts,textByPath:s,errorsByPath:l})}function Pn(e,n){const r=n.url||`/api/runs/${encodeURIComponent(e)}/artifacts/files/${n.path.split("/").map(encodeURIComponent).join("/")}`;return r.startsWith("http://")||r.startsWith("https://")?r:`${v}${r}`}function z(){const e=De(),n=document.querySelector(".dial-ring"),r=document.querySelector(".context-widget");if(!n||!r)return;n.style.setProperty("--context-ratio",`${Math.min(100,e.utilization_ratio*100)}%`);const s=n.querySelector("img");s&&(s.src=W[e.warning_level]||W.ok),r.dataset.contextState=e.warning_level,r.setAttribute("aria-label",nt(e)),m("state",E(e.warning_level)),m("source-label",C(e.source)),m("summary",tt(e)),m("input",y(e.estimated_input_tokens)),m("output",y(e.estimated_output_tokens)),m("total",y(e.estimated_total_tokens)),m("limit",y(e.context_window_limit)),m("utilization",Y(e.utilization_ratio)),m("warning",E(e.warning_level)),m("source",C(e.source))}function ve(){const e=!!(t.user&&t.token),n=document.querySelector("[data-action='run']");if(n){n.disabled=!fe(e),n.dataset.runStatus=t.run.status;const o=n.querySelector("[data-run-button-label]");o&&(o.textContent=Qe())}const r=document.querySelector("[data-run-note-shell]");r&&(r.outerHTML=Je(e));const s=!e||!t.run.id||b(t.run.status),l=document.querySelector("[data-action='run-refinement']");l&&(l.disabled=s||!t.refinementText.trim())}function m(e,n){document.querySelectorAll(`[data-context-field="${e}"]`).forEach(r=>{r.textContent=n})}function g(){t.context=qe()}function De(){return t.context||qe()}function qe(){const e=N(),n=t.files.reduce(($,I)=>$+Number(I.size||0),0),r=`${t.taskText}
${t.refinementText}`.trim(),s=Math.max(1,Math.ceil((r.length+Math.min(n,2e5))/4)),l=e.id==="cheat_sheet"?Math.max(5e3,t.targetPages*1800):e.id==="beamer_slides"?7e3:e.id==="essay_latex"?6e3:t.outputPreference==="ipynb"?5200:4e3,o=s+l,d=o/K;let u="ok";return d>.85?u="critical":d>=.7&&(u="warning"),Ue({estimated_input_tokens:s,estimated_output_tokens:l,estimated_total_tokens:o,context_window_limit:K,utilization_ratio:d,warning_level:u,source:"local"},"local")}function Ue(e,n){const r=R(e?.estimated_input_tokens,0),s=R(e?.estimated_output_tokens,0),l=R(e?.context_window_limit,K)||K,o=R(e?.estimated_total_tokens,r+s),d=R(e?.utilization_ratio,l?o/l:0),u=Sn(e?.warning_level,d);return{estimated_input_tokens:r,estimated_output_tokens:s,estimated_total_tokens:o,context_window_limit:l,utilization_ratio:d,warning_level:u,source:String(e?.source||n||"local")}}function R(e,n){const r=Number(e);return!Number.isFinite(r)||r<0?n:r}function Sn(e,n){return e==="ok"||e==="warning"||e==="critical"?e:n>.85?"critical":n>=.7?"warning":"ok"}function Tn(e){const n=new Set(t.files.map(s=>s.key)),r=e.map(s=>({key:`${s.name}-${s.size}-${s.lastModified}`,file:s,name:s.name,size:s.size,status:"pending",uploadId:""})).filter(s=>!n.has(s.key));t.files=[...t.files,...r],t.notice=r.length?{message:a("uploads.willUpload"),tone:"neutral"}:{message:a("uploads.duplicates"),tone:"neutral"},g()}function Ln(e){t.history.push({id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,timestamp:new Date().toISOString(),...e})}function M(){if(!t.run.id)return;const e=`run-${t.run.id}`,n=t.history.find(s=>s.id===e),r={id:e,kind:"run",status:t.run.status,title:a("history.runTitle",{id:at(t.run.id)}),message:t.run.error||t.run.message,meta:`${w(t.run.stage)} / ${t.run.outputRoot?rt(t.run.outputRoot):a("history.folderPending")}`,timestamp:new Date().toISOString()};n?Object.assign(n,r):t.history.push(r)}function N(){return se.find(e=>e.id===t.intent)||se[0]}function An(){t.activeFile=re(t.outputPreference,t.activeFile)}function Rn(){return t.outputPreference==="ipynb"?["solution.ipynb"]:["solution.py","tests.py","README.md"]}function Fn(){return[{id:"primary",label:h(t.intent,"primaryTab")},{id:"source",label:h(t.intent,"sourceTab")},{id:"logs",label:a("preview.tabs.logs")},{id:"manifest",label:a("preview.tabs.manifest")}]}function ze(){return t.intent==="code_homework"?[t.outputPreference==="ipynb"?{name:"solution.ipynb",relativePath:"output/solution.ipynb",kind:"notebook",badge:"NB",readyLabel:a("files.notebookReady"),pendingLabel:a("files.pending")}:{name:"solution.py",relativePath:"output/solution.py",kind:"script",badge:"PY",readyLabel:a("files.scriptReady"),pendingLabel:a("files.pending")},{name:"generation.log",relativePath:"logs/generation.log",kind:"log",badge:"LOG",readyLabel:a("files.logReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]:t.intent==="essay_latex"?[{name:"main.pdf",relativePath:"output/main.pdf",kind:"pdf",badge:"PDF",readyLabel:a("files.pdfReady"),pendingLabel:a("files.compilePending")},{name:"main.tex",relativePath:"output/main.tex",kind:"source",badge:"TEX",readyLabel:a("files.sourceReady"),pendingLabel:a("files.pending")},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:a("files.compileLogReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]:t.intent==="beamer_slides"?[{name:"slides.pdf",relativePath:"output/slides.pdf",kind:"pdf",badge:"PDF",readyLabel:a("files.deckReady"),pendingLabel:a("files.compilePending")},{name:"slides.tex",relativePath:"output/slides.tex",kind:"source",badge:"TEX",readyLabel:a("files.sourceReady"),pendingLabel:a("files.pending")},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:a("files.compileLogReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]:[{name:"cheat-sheet.pdf",relativePath:"output/cheat-sheet.pdf",kind:"pdf",badge:"PDF",readyLabel:a("files.sheetReady"),pendingLabel:a("files.compilePending")},{name:"cheat-sheet.tex",relativePath:"output/cheat-sheet.tex",kind:"source",badge:"TEX",readyLabel:a("files.sourceReady"),pendingLabel:a("files.pending")},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:a("files.compileLogReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]}function Mn(){const e=ze(),n=new Map(t.artifacts.items.map(s=>[s.path,s])),r=e.map(s=>{const l=n.get(s.relativePath);return l?{...s,artifact:l,kind:l.kind||s.kind}:s});for(const s of t.artifacts.items)r.some(l=>l.relativePath===s.path)||s.path.startsWith("input/")||r.push(En(s));return r}function En(e){const n=P(e,e.path),r=n.split(".").pop()?.slice(0,3).toUpperCase()||"OUT";return{name:n,relativePath:e.path,kind:e.kind||"artifact",badge:r,readyLabel:Cn(e),pendingLabel:a("files.pending"),artifact:e}}function Cn(e){return e.kind==="pdf"?a("files.pdfReady"):e.kind==="log"?a("files.logReady"):e.kind==="manifest"?a("files.metadataReady"):e.kind==="notebook"?a("files.notebookReady"):e.kind==="script"?a("files.scriptReady"):a("files.sourceReady")}function Ke(){return t.intent==="code_homework"?t.outputPreference==="ipynb"?"solution.ipynb":"solution.py":t.intent==="beamer_slides"?"slides.tex":t.intent==="cheat_sheet"?"cheat-sheet.tex":"main.tex"}function me(e){const n=S(t.artifacts.items,"primaryCode",{intent:t.intent,outputPreference:t.outputPreference,activeFile:e}),r=n?T(n.path):"";return r||(n&&L(n.path)?A(n):t.artifacts.loading&&t.run.id?a("source.artifactLoading"):e==="tests.py"?`from solution import solve


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
`)}function je(){const e=S(t.artifacts.items,"primaryCode",{intent:t.intent,outputPreference:"ipynb",activeFile:"solution.ipynb"}),n=e?T(e.path):"";return n?Ve(n):e&&L(e.path)?A(e):t.artifacts.loading&&t.run.id?a("source.artifactLoading"):`def solve(values):
    total = 0
    for value in values:
        total += value
    return total

solve([1, 2, 3])`}function Nn(){return We().text}function We(){const e=S(t.artifacts.items,"source",{intent:t.intent,outputPreference:t.outputPreference,activeFile:Ke()}),n=e?T(e.path):"";return n?{artifact:e,text:n,message:a("source.artifactLoaded"),tone:"success"}:e&&L(e.path)?{artifact:e,text:A(e),message:a("source.artifactReadFailed"),tone:"error"}:t.artifacts.loading&&t.run.id?{artifact:e,text:a("source.artifactLoading"),message:a("source.artifactLoading"),tone:"loading"}:t.artifacts.error?{artifact:null,text:ye(),message:t.artifacts.error,tone:"error"}:{artifact:null,text:ye(),message:a("preview.sourceMessage"),tone:"neutral"}}function He(){const e=S(t.artifacts.items,"log",{intent:t.intent}),n=e?T(e.path):"";return n?{artifact:e,text:n,message:a("source.artifactLoaded"),tone:"success"}:e&&L(e.path)?{artifact:e,text:A(e),message:a("source.artifactReadFailed"),tone:"error"}:t.artifacts.loading&&t.run.id?{artifact:e,text:ae(),message:a("source.artifactLoading"),tone:"loading"}:t.artifacts.error?{artifact:null,text:ae(),message:t.artifacts.error,tone:"error"}:{artifact:null,text:ae(),message:a("preview.logsMessage"),tone:"neutral"}}function Xe(){const e=S(t.artifacts.items,"manifest"),n=e?T(e.path):"";return n?{artifact:e,text:n,message:a("source.artifactLoaded"),tone:"success"}:e&&L(e.path)?{artifact:e,text:A(e),message:a("source.artifactReadFailed"),tone:"error"}:t.artifacts.manifest?{artifact:e,text:JSON.stringify(t.artifacts.manifest,null,2),message:a("source.artifactMetadataLoaded"),tone:"success"}:t.artifacts.loading&&t.run.id?{artifact:e,text:"",message:a("source.artifactLoading"),tone:"loading"}:t.artifacts.error?{artifact:null,text:"",message:t.artifacts.error,tone:"error"}:{artifact:null,text:"",message:a("preview.manifestMessage"),tone:"neutral"}}function In(){const e=S(t.artifacts.items,"primaryCode",{intent:t.intent,outputPreference:"ipynb",activeFile:"solution.ipynb"}),n=e?T(e.path):"";return n?{title:P(e,"solution.ipynb"),body:Dn(n),code:Ve(n),detail:a("source.artifactLoaded")}:e&&L(e.path)?{title:P(e,"solution.ipynb"),body:a("source.artifactReadFailed"),code:A(e),detail:a("preview.preservedForInspection")}:{title:a("preview.notebookApproach"),body:a("preview.notebookApproachBody"),code:je(),detail:t.run.status==="failed"?a("preview.preservedForInspection"):a("preview.noExecution")}}function ye(){return t.intent==="code_homework"?me("solution.py"):t.intent==="beamer_slides"?`\\documentclass{beamer}
\\title{${G(a("preview.generatedSlidesSource"))}}
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
\\title{${G(a("preview.generatedEssay"))}}
\\begin{document}
\\maketitle
\\section{Introduction}
The generated source is preserved even if PDF compilation fails.
\\section{Discussion}
Evidence and citations are recorded in the run manifest.
\\end{document}
`}function ae(){const e=[`${la()} ${w(t.run.stage)}: ${t.run.message}`,`run ${t.run.id||a("source.notStarted")}`,`${a("source.status")} ${et(t.run.status)}`];return t.run.error&&e.push(`${a("source.error")} ${t.run.error}`),e.join(`
`)}function On(e){return String(e||"").split(`
`).filter(Boolean).map(n=>{const r=n.indexOf(" "),s=r>0?n.slice(0,r):"log",l=r>0?n.slice(r+1):n;return`<p${/error|failed|traceback|exception|compile_failed/iu.test(n)?' class="is-error"':""}><span>${i(s)}</span> ${i(l)}</p>`}).join("")||`<p><span>${i(a("source.status"))}</span> ${i(a("source.noArtifactText"))}</p>`}function T(e){return t.artifacts.textByPath[e]||""}function L(e){return!!t.artifacts.errorsByPath[e]}function A(e){const n=t.artifacts.errorsByPath[e.path]||a("source.artifactReadFailed");return`${a("source.artifactReadFailed")}
${e.path}
${n}`}function P(e,n){return(e?.path||"").split("/").filter(Boolean).pop()||n}function Bn(e){return e.endsWith(".json")||e.endsWith(".ipynb")?"json":e.endsWith(".tex")?"latex":"python"}function Dn(e){try{const n=JSON.parse(e),s=(Array.isArray(n.cells)?n.cells:[]).find(o=>o.cell_type==="markdown");return(Array.isArray(s?.source)?s.source.join(""):String(s?.source||"")).trim().replace(/\s+/gu," ").slice(0,220)||a("preview.notebookApproachBody")}catch{return a("preview.notebookApproachBody")}}function Ve(e){try{const n=JSON.parse(e),s=(Array.isArray(n.cells)?n.cells:[]).find(o=>o.cell_type==="code");return(Array.isArray(s?.source)?s.source.join(""):String(s?.source||"")).trim()||e}catch{return e}}function J(e,n="python"){return`
        <ol class="code-lines">
            ${String(e).replace(/\s+$/u,"").split(`
`).map((s,l)=>`
                <li>
                    <span class="line-no">${l+1}</span>
                    <code>${qn(s,n)}</code>
                </li>
            `).join("")}
        </ol>
    `}function qn(e,n){return n==="json"?zn(e):n==="latex"?Kn(e):Un(e)}function Un(e){const n=e.match(/#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|./g)||[],r=new Set(["def","class","from","import","for","if","else","elif","return","continue","in","as","print","with","try","except","raise","while","True","False","None"]);return n.map((s,l)=>s.startsWith("#")?`<span class="syntax-comment">${i(s)}</span>`:s.startsWith('"')||s.startsWith("'")?`<span class="syntax-string">${i(s)}</span>`:/^\d+$/u.test(s)?`<span class="syntax-number">${i(s)}</span>`:r.has(s)?`<span class="syntax-keyword">${i(s)}</span>`:/^[A-Za-z_][A-Za-z0-9_]*$/u.test(s)&&Ge(n,l)==="("?`<span class="syntax-function">${i(s)}</span>`:i(s)).join("")||" "}function zn(e){const n=e.match(/"(?:\\.|[^"\\])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?|\s+|./g)||[];return n.map((r,s)=>r.startsWith('"')?`<span class="${Ge(n,s)===":"?"syntax-keyword":"syntax-string"}">${i(r)}</span>`:/^(true|false|null)$/u.test(r)?`<span class="syntax-keyword">${i(r)}</span>`:/^-?\d+(?:\.\d+)?$/u.test(r)?`<span class="syntax-number">${i(r)}</span>`:i(r)).join("")||" "}function Kn(e){return(e.match(/%.*$|\\[A-Za-z*]+|\{[^}]*\}|\s+|./g)||[]).map(r=>r.startsWith("%")?`<span class="syntax-comment">${i(r)}</span>`:r.startsWith("\\")?`<span class="syntax-keyword">${i(r)}</span>`:r.startsWith("{")&&r.endsWith("}")?`<span class="syntax-string">${i(r)}</span>`:i(r)).join("")||" "}function Ge(e,n){for(let r=n+1;r<e.length;r+=1)if(!/^\s+$/u.test(e[r]))return e[r];return""}async function jn(){const e=t.previewTab==="logs"?He().text:t.previewTab==="manifest"?Xe().text||JSON.stringify(Se(),null,2):t.previewTab==="source"?Nn():t.intent==="code_homework"?t.outputPreference==="ipynb"?je():me(t.activeFile):t.run.outputRoot||Z();await X(e,a("run.previewCopied"))}async function X(e,n){if(e){try{await navigator.clipboard.writeText(e),t.notice={message:n,tone:"success"}}catch{t.notice={message:a("run.clipboardUnavailable"),tone:"error"}}c()}}function Wn(){t.run.outputRoot&&X(t.run.outputRoot,a("run.pathRevealCopied"))}function Hn(e){if(!e)return;const n=e.startsWith("file://")?e:`file://${e}`;window.open(n,"_blank","noopener,noreferrer")}function Xn(e){return t.run.outputRoot?`${t.run.outputRoot.replace(/\/$/u,"")}/${e}`:""}function Z(){return t.artifacts.error?t.artifacts.error:t.artifacts.loading?a("source.artifactLoading"):t.artifacts.loaded?a("source.artifactLoaded"):t.run.outputRoot?a("source.artifactNoteReady"):a("source.artifactNotePending")}function Qe(){return b(t.run.status)?a("actions.running"):t.run.status==="failed"?a("actions.runAgain"):a("actions.runArtifact")}function Je(e){return b(t.run.status)?`
        <div class="comfort-progress" data-run-note-shell role="status" aria-live="polite" aria-label="${i(a("composer.progressAria"))}">
            <div class="comfort-progress-head">
                <strong>${i(a("composer.progressLabel"))}</strong>
                <span>${i(w(t.run.stage))}</span>
            </div>
            <div class="comfort-progress-track" aria-hidden="true">
                <span class="comfort-progress-fill"></span>
            </div>
            <p>${i(a("composer.progressNote"))}</p>
        </div>
    `:`<span class="run-note" data-run-note-shell>${i(Vn(e))}</span>`}function Vn(e){return e?t.taskText.trim()?t.files.some(n=>!n.uploadId)?a("composer.runNoteUploads"):b(t.run.status)?a("composer.runNoteRunning"):a("composer.runNoteReady"):a("composer.runNoteBrief"):a("composer.runNoteLogin")}function Gn(){return t.run.status==="failed"?a("run.validationIssue"):t.run.status==="succeeded"?a("run.artifactReady"):b(t.run.status)?a("run.generating"):a("run.rendererArmed")}function Qn(){return t.run.status==="failed"?t.run.errorCode||a("run.sourcePreserved"):t.run.status==="succeeded"?t.run.outputRoot?a("run.copyOpenAvailable"):a("run.completed"):b(t.run.status)?w(t.run.stage):a("run.syntaxPreview")}function Jn(e,n){return n==="queued"?"route":n==="succeeded"?t.intent==="code_homework"?"validate":"compile":e?.includes("context")||e?.includes("upload")?t.intent==="cheat_sheet"?"ingest":"context":e?.includes("search")||e?.includes("route")?"route":e?.includes("compile")?"compile":e?.includes("validate")?"validate":e?.includes("outline")?"outline":e?.includes("layout")?"layout":e?.includes("compress")?"compress":e?.includes("generate")||e?.includes("source")?t.intent==="beamer_slides"?"write":"generate":N().stages[0]}function w(e){const n=String(e||"compose"),r=a(`stages.${n}`);return r===`stages.${n}`?n.replaceAll("_"," "):r}function Zn(e){return e.status==="uploaded"?a("uploads.uploaded"):e.status==="uploading"?a("uploads.uploading"):e.status==="failed"?a("uploads.failed"):sa(e.size)}function Yn(e){return String(e).split(".").pop()?.slice(0,3).toUpperCase()||"FILE"}function ea(){const e=localStorage.getItem(xe);if(Ze(e))return e;const n=navigator.language||"";return n.toLowerCase().startsWith("zh")?n.toLowerCase().includes("tw")||n.toLowerCase().includes("hk")?"zh-Hant":"zh-Hans":de}function ta(e){const n=Ze(e)?e:de;t.locale!==n&&(t.locale=n,localStorage.setItem(xe,n),aa(),t.run.status==="idle"&&t.run.stage==="compose"&&(t.run.message=a("run.ready")),c())}function Ze(e){return be.some(n=>n.id===e)}function Ye(){document.documentElement.lang=t.locale,document.title=a("app.title")}function na(e){return{id:"session-ready",kind:"system",status:"idle",title:V(e,"history.readyTitle"),message:V(e,"history.readyMessage"),timestamp:new Date().toISOString()}}function aa(){const e=t.history.find(n=>n.id==="session-ready");e&&(e.title=a("history.readyTitle"),e.message=a("history.readyMessage"))}function h(e,n){return a(`intents.${e}.${n}`)}function et(e){const n=String(e||"idle"),r=a(`status.${n}`);return r===`status.${n}`?n:r}function a(e,n={}){return V(t.locale,e,n)}function V(e,n,r={}){const s=ge[de]||{},l=ge[e]||s,o=he(s,n),d=he(l,n)??o??n;return typeof d!="string"?n:d.replace(/\{([A-Za-z0-9_]+)\}/g,(u,$)=>String(r[$]??""))}function he(e,n){return String(n).split(".").reduce((r,s)=>{if(r&&Object.prototype.hasOwnProperty.call(r,s))return r[s]},e)}function ra(){try{return JSON.parse(localStorage.getItem(le)||"null")}catch{return null}}function x(e,n){const r=e?.error?.message||(typeof e?.detail=="string"?e.detail:"")||(typeof e?.message=="string"?e.message:"")||n,s=e?.error?.code?`${e.error.code}: `:"";return f(`${s}${r}`)}function f(e){return String(e||"").replace(/sk-[A-Za-z0-9_-]+/g,"[redacted-key]").replace(/Bearer\s+[A-Za-z0-9._-]+/gi,"Bearer [redacted-token]").replace(/api[_-]?key["'\s:=]+[A-Za-z0-9._-]+/gi,"api_key [redacted]").split(`
`).filter(n=>!/\s+at\s+/.test(n)&&!/Traceback/.test(n)).slice(0,3).join(" ").trim()}function ia(e){return String(e||"").replace(/sk-[A-Za-z0-9_-]+/g,"[redacted-key]").replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi,"Bearer [redacted-token]").replace(/(api[_-]?key["'\s:=]+)[A-Za-z0-9._~+/=-]+/gi,"$1[redacted]").replace(/(authorization["'\s:=]+)[A-Za-z0-9._~+/=-]+/gi,"$1[redacted]")}function y(e){return Number(e||0).toLocaleString()}function Y(e){return`${Math.round(Number(e||0)*100)}%`}function sa(e){const n=Number(e||0);return n>=1024*1024?`${(n/(1024*1024)).toFixed(1)} MB`:n>=1024?`${Math.round(n/1024)} KB`:`${n} B`}function E(e){return a(e==="critical"?"context.critical":e==="warning"?"context.warning":"context.ok")}function C(e){const n=String(e||"local").toLowerCase();return n==="local"?a("context.local"):n==="heuristic"?a("context.heuristic"):n==="provider"?a("context.provider"):e}function tt(e){return e.warning_level==="critical"?a("context.criticalSummary"):e.warning_level==="warning"?a("context.warningSummary"):a("context.ratioSummary",{percent:Y(e.utilization_ratio)})}function nt(e){return a("context.aria",{state:E(e.warning_level),percent:Y(e.utilization_ratio),source:C(e.source)})}function G(e){const r=(t.taskText.trim().split(`
`).find(Boolean)||"").replace(/[^\w\s:,-]/g,"").trim();return r?r.length>52?`${r.slice(0,49)}...`:r:e}function at(e){return String(e||"").slice(0,8)||"pending"}function oa(e){try{return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"}).format(new Date(e))}catch{return""}}function la(){return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date)}function rt(e){const n=String(e||"");return n.length<=46?n:`...${n.slice(-43)}`}function i(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}
