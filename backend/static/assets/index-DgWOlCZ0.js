(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const o of l)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function i(l){const o={};return l.integrity&&(o.integrity=l.integrity),l.referrerPolicy&&(o.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?o.credentials="include":l.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(l){if(l.ep)return;l.ep=!0;const o=i(l);fetch(l.href,o)}})();const le=[{id:"en",label:"EN",name:"English"},{id:"zh-Hans",label:"简",name:"简体中文"},{id:"zh-Hant",label:"繁",name:"繁體中文"}],ie={en:{app:{title:"AI Learning Assistant - Artifact Studio",brand:"AI Learning Assistant",userFallback:"User"},locale:{label:"Interface language"},mobile:{console:"Console",preview:"Preview"},pane:{consoleKicker:"Production console",consoleTitle:"Generate artifacts",previewKicker:"Artifact preview"},actions:{model:"Model",copyPath:"Copy path",reveal:"Reveal",regenerate:"Regenerate",copy:"Copy",open:"Open",runArtifact:"Run artifact",runAgain:"Run again",running:"Running",newRevisionRun:"New revision run",copyVisible:"Copy visible",test:"Test",save:"Save",saving:"Saving",login:"Login",createAccount:"Create account",closeModel:"Close model settings",removeFile:"Remove {name}"},intents:{code_homework:{label:"Code",short:"PY",title:"Homework code",description:"Script or notebook answer",primaryTab:"Code",sourceTab:"Source"},essay_latex:{label:"Essay",short:"TEX",title:"LaTeX essay",description:"Source plus compiled PDF",primaryTab:"Rendered",sourceTab:"LaTeX"},beamer_slides:{label:"Slides",short:"PDF",title:"Beamer deck",description:"Slide source plus PDF",primaryTab:"Rendered",sourceTab:"LaTeX"},cheat_sheet:{label:"Cheat sheet",short:"A4",title:"Dense A4 sheet",description:"Course compression PDF",primaryTab:"Rendered",sourceTab:"LaTeX"}},controls:{artifactType:"Artifact type",search:"Search",searchMode:{auto:"Auto",on:"On",off:"Off"},output:"Output",previewOnly:"Preview only",targetPages:"Target pages",a4:"A4",dense:"Dense",pdfFirst:"PDF first",sourceKept:"Source kept"},composer:{brief:"Brief",briefPlaceholder:"Paste the assignment brief, constraints, marking expectations, and any output notes.",runNoteLogin:"Login activates generation controls.",runNoteBrief:"Add a task brief to enable generation.",runNoteUploads:"Selected files upload before run creation.",runNoteRunning:"Context and stage events update as the backend reports.",runNoteReady:"Ready for a local generation run."},uploads:{label:"Reference files",choose:"Drop or choose reference files",selected:"{count} reference file selected",selectedPlural:"{count} reference files selected",willUpload:"Files will upload before the next run.",duplicates:"Those files are already selected.",uploaded:"uploaded",uploading:"uploading",failed:"upload failed",unavailable:"Upload API is unavailable in this backend build.",failedGeneric:"Upload failed.",missingIds:"Upload response did not include every upload id."},refinement:{label:"Follow-up",availableAfterRun:"Available after first run",revisionSource:"Revision source {id}",placeholder:"Ask for a tighter proof, more comments, fewer slides, or a different structure.",note:"Creates a new run; generated files stay source-of-truth on disk.",missing:"Add a follow-up request before starting a revision."},history:{label:"Run history",entries:"{count} entries",readyTitle:"Console ready",readyMessage:"Choose an artifact type, add source material, then run.",followUpTitle:"Follow-up request",regenerateTitle:"Regenerate request",generationTitle:"Generation request",runTitle:"Run {id}",folderPending:"folder pending"},preview:{tabs:{logs:"Logs",manifest:"Manifest"},statusMessage:"Run status",stageProgress:"Stage progress",currentStage:"Current: {stage}",emptyPdfTitle:"PDF renderer",emptyPdfMessage:"Pages are shown as PDF-like preview until artifact bytes are exposed.",deckTitle:"Deck preview",deckMessage:"Compiled PDF pages will replace this deck skeleton when a file endpoint is available.",sheetTitle:"Sheet preview",sheetMessage:"Dense PDF-like pages stay visible while generation runs.",failedTitle:"Run failed",failedMessage:"Any preserved source or logs remain available from the run folder.",runFolderPending:"Run folder pending",files:"Files",pageLabel:"Slide 1 / 12",latexReport:"LaTeX report",generatedEssay:"Generated Essay",generatedSlidesSource:"Generated Slides",generatedSlides:"Course Presentation",introduction:"Introduction",argument:"Argument",references:"References",notebookApproach:"Approach",notebookApproachBody:"State the algorithm, edge cases, and complexity before the implementation cell.",markdown:"Markdown",code:"Code",notebookValidation:"Notebook validation",preservedForInspection:"Preserved for inspection",noExecution:"Preview-only, no execution",a4DenseLayout:"A4 dense layout",onePage:"{count} page",manyPages:"{count} pages",sourceTitle:"Source view",sourceMessage:"Shows generated source or a representative skeleton until backend artifact bytes are exposed.",logsTitle:"Run logs",logsMessage:"Shows live status now and sanitized run logs when they are available.",manifestTitle:"Manifest view",manifestMessage:"Shows the expected manifest shape before a real manifest is written."},files:{scriptReady:"script output",notebookReady:"notebook output",logReady:"run log",metadataReady:"metadata",pdfReady:"compiled PDF",deckReady:"compiled deck",sheetReady:"compiled sheet",sourceReady:"source preserved",compileLogReady:"compile log",pending:"pending",compilePending:"compile pending"},source:{artifactNoteReady:"Artifact bytes are in the run folder; browser byte rendering awaits an artifact file endpoint.",artifactNotePending:"Run folder appears after a run is accepted by the backend.",generationLog:"generation.log",notStarted:"not-started",status:"status",error:"error"},auth:{kicker:"CUHK auth",loginTitle:"Login",registerTitle:"Register",email:"CUHK email",password:"Password",confirmPassword:"Confirm password",contacting:"Contacting local backend...",failed:"Authentication failed.",expired:"Session expired",created:"Account created. Login is ready."},model:{settingsKicker:"Model settings",defaultName:"Qwen Default",defaultButton:"Default Qwen profile",needsAttention:"Model needs attention",displayName:"Display name",baseUrl:"Base URL",model:"Model",apiKey:"API key",newKey:"New key",savedKey:"Saved key configured",noSavedKey:"No saved key",environmentDefault:"environment-default",provider:"Provider",contextWindow:"Context window",streaming:"Streaming",streamingOn:"On",streamingOff:"Off",defaultsSummary:"Qwen non-secret defaults",defaultHelp:"The Qwen endpoint, model, context window, and streaming mode are already filled. Add only your API key to test or save.",savedLoaded:"Saved profile loaded.",defaultsLoaded:"Local defaults loaded.",loadFailed:"Model profile load failed.",saving:"Saving model profile.",saved:"Model profile saved.",saveFailed:"Model profile save failed.",testing:"Testing provider connection.",testFailed:"Provider connectivity test failed.",connectionOk:"Connection OK for {model}."},run:{ready:"Ready",required:"Required",addBrief:"Add a task brief before running.",preparingUploads:"Preparing reference uploads.",submitting:"Submitting run to local backend.",requestFailed:"Run request failed.",succeeded:"Run succeeded.",failed:"Run failed.",running:"Run is running.",queued:"Run queued.",refreshFailed:"Could not refresh run status.",statusRefreshFailed:"Run status refresh failed.",pathCopied:"Run folder path copied.",pathRevealCopied:"Run folder path copied for reveal.",artifactPathCopied:"Artifact path copied.",previewCopied:"Visible preview copied.",clipboardUnavailable:"Clipboard is not available in this browser context.",validationIssue:"Validation issue",artifactReady:"Artifact ready",generating:"Generating",rendererArmed:"Renderer armed",sourcePreserved:"source preserved if available",copyOpenAvailable:"copy/open paths available",completed:"completed",syntaxPreview:"syntax preview, no execution"},status:{idle:"Idle",queued:"Queued",running:"Running",succeeded:"Succeeded",failed:"Failed",cancelled:"Cancelled"},stages:{compose:"Compose",choose_intent:"Select artifact",validate_request:"Validate",upload_inputs:"Upload inputs",submit_run:"Submit run",queued:"Queued",running:"Running",resolve_model:"Model",extract_context:"Context",decide_search:"Search",generate_source:"Generate",validate_source:"Validate",repair_source:"Repair LaTeX",compile_pdf:"Compile PDF",write_manifest:"Manifest",poll_status:"Refresh",output_files:"Output files",route:"Route",context:"Context",generate:"Generate",validate:"Validate",write:"Write",compile:"Compile",outline:"Outline",ingest:"Ingest",compress:"Compress",layout:"Layout"},context:{ok:"OK",warning:"Warning",critical:"Critical",local:"Local estimate",heuristic:"Backend heuristic",provider:"Provider estimate",input:"Input",output:"Output",total:"Total",limit:"Limit",use:"Use",warningLabel:"Warning",source:"Source",criticalSummary:"Aggressive compression likely",warningSummary:"Compression may be needed",ratioSummary:"{percent} of context",aria:"Context budget {state}, {percent} utilized, {source}"},errors:{required:"Required",absoluteHttpUrl:"Use an absolute http or https URL",enum:"Choose a supported value",invalid:"Invalid value"}},"zh-Hans":{app:{title:"AI Learning Assistant - 成果工作室",brand:"AI Learning Assistant",userFallback:"用户"},locale:{label:"界面语言"},mobile:{console:"控制台",preview:"预览"},pane:{consoleKicker:"生产控制台",consoleTitle:"生成学术成果",previewKicker:"成果预览"},actions:{model:"模型",copyPath:"复制路径",reveal:"显示位置",regenerate:"重新生成",copy:"复制",open:"打开",runArtifact:"开始生成",runAgain:"再次运行",running:"运行中",newRevisionRun:"新修订运行",copyVisible:"复制当前",test:"测试",save:"保存",saving:"保存中",login:"登录",createAccount:"创建账户",closeModel:"关闭模型设置",removeFile:"移除 {name}"},intents:{code_homework:{label:"代码",short:"PY",title:"作业代码",description:"脚本或 Notebook 答案",primaryTab:"代码",sourceTab:"源文件"},essay_latex:{label:"论文",short:"TEX",title:"LaTeX 论文",description:"源文件与编译 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},beamer_slides:{label:"幻灯",short:"PDF",title:"Beamer 幻灯",description:"幻灯源文件与 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},cheat_sheet:{label:"速查表",short:"A4",title:"密集 A4 速查表",description:"课程内容压缩 PDF",primaryTab:"渲染",sourceTab:"LaTeX"}},controls:{artifactType:"成果类型",search:"检索",searchMode:{auto:"自动",on:"开启",off:"关闭"},output:"输出",previewOnly:"仅预览",targetPages:"目标页数",a4:"A4",dense:"密集",pdfFirst:"PDF 优先",sourceKept:"保留源文件"},composer:{brief:"任务说明",briefPlaceholder:"粘贴作业要求、约束条件、评分期望与输出说明。",runNoteLogin:"登录后可使用生成控制。",runNoteBrief:"填写任务说明后即可生成。",runNoteUploads:"已选文件会在创建运行前上传。",runNoteRunning:"后端报告上下文与阶段事件后会同步更新。",runNoteReady:"已准备好创建本地生成运行。"},uploads:{label:"参考文件",choose:"拖入或选择参考文件",selected:"已选择 {count} 个参考文件",selectedPlural:"已选择 {count} 个参考文件",willUpload:"文件将在下一次运行前上传。",duplicates:"这些文件已在选择列表中。",uploaded:"已上传",uploading:"上传中",failed:"上传失败",unavailable:"当前后端构建未提供上传 API。",failedGeneric:"上传失败。",missingIds:"上传响应未返回全部文件编号。"},refinement:{label:"后续修订",availableAfterRun:"首次运行后可用",revisionSource:"修订来源 {id}",placeholder:"要求证明更严谨、注释更充分、幻灯更少，或调整结构。",note:"将创建新的运行；生成文件仍以磁盘成果为准。",missing:"请先填写后续修订要求。"},history:{label:"运行记录",entries:"{count} 条记录",readyTitle:"控制台就绪",readyMessage:"请选择成果类型，补充材料后开始运行。",followUpTitle:"后续修订请求",regenerateTitle:"重新生成请求",generationTitle:"生成请求",runTitle:"运行 {id}",folderPending:"文件夹待生成"},preview:{tabs:{logs:"日志",manifest:"清单"},statusMessage:"运行状态",stageProgress:"阶段进度",currentStage:"当前：{stage}",emptyPdfTitle:"PDF 渲染器",emptyPdfMessage:"在成果文件可读取前，页面以 PDF 样式预览呈现。",deckTitle:"幻灯预览",deckMessage:"文件端点可用后，已编译 PDF 页面会替换当前骨架。",sheetTitle:"速查表预览",sheetMessage:"生成期间保持密集 PDF 样式页面可见。",failedTitle:"运行失败",failedMessage:"如源文件或日志已保留，可继续从运行文件夹检查。",runFolderPending:"运行文件夹待生成",files:"文件",pageLabel:"第 1 / 12 页",latexReport:"LaTeX 报告",generatedEssay:"生成论文",generatedSlidesSource:"生成幻灯",generatedSlides:"课程演示",introduction:"引言",argument:"论证",references:"参考文献",notebookApproach:"方法说明",notebookApproachBody:"先说明算法、边界情况与复杂度，再呈现实作单元。",markdown:"Markdown",code:"代码",notebookValidation:"Notebook 校验",preservedForInspection:"已保留供检查",noExecution:"仅预览，不执行",a4DenseLayout:"A4 密集版式",onePage:"{count} 页",manyPages:"{count} 页",sourceTitle:"源文件视图",sourceMessage:"在后端成果文件可读取前，显示生成源文件或相应骨架。",logsTitle:"运行日志",logsMessage:"先显示当前状态；日志可用后显示已清理的运行日志。",manifestTitle:"清单视图",manifestMessage:"真实清单写入前，先显示预计 manifest 结构。"},files:{scriptReady:"脚本输出",notebookReady:"Notebook 输出",logReady:"运行日志",metadataReady:"元数据",pdfReady:"已编译 PDF",deckReady:"已编译幻灯",sheetReady:"已编译速查表",sourceReady:"源文件已保留",compileLogReady:"编译日志",pending:"待生成",compilePending:"待编译"},source:{artifactNoteReady:"成果文件位于运行文件夹；浏览器内字节渲染需等待成果文件端点。",artifactNotePending:"后端接受运行后会生成运行文件夹。",generationLog:"generation.log",notStarted:"尚未开始",status:"状态",error:"错误"},auth:{kicker:"中大认证",loginTitle:"登录",registerTitle:"注册",email:"中大邮箱",password:"密码",confirmPassword:"确认密码",contacting:"正在联系本地后端...",failed:"认证失败。",expired:"会话已过期",created:"账户已创建，请登录。"},model:{settingsKicker:"模型设置",defaultName:"Qwen 默认配置",defaultButton:"默认 Qwen 配置",needsAttention:"模型需要处理",displayName:"显示名称",baseUrl:"Base URL",model:"模型",apiKey:"API key",newKey:"新密钥",savedKey:"已配置密钥",noSavedKey:"未保存密钥",environmentDefault:"环境默认配置",provider:"提供方",contextWindow:"上下文窗口",streaming:"流式输出",streamingOn:"开启",streamingOff:"关闭",defaultsSummary:"Qwen 非密钥默认值",defaultHelp:"Qwen 端点、模型、上下文窗口与流式模式已预填；只需填写 API key 即可测试或保存。",savedLoaded:"已载入保存配置。",defaultsLoaded:"已载入本地默认值。",loadFailed:"模型配置载入失败。",saving:"正在保存模型配置。",saved:"模型配置已保存。",saveFailed:"模型配置保存失败。",testing:"正在测试提供方连接。",testFailed:"提供方连接测试失败。",connectionOk:"{model} 连接正常。"},run:{ready:"就绪",required:"必填",addBrief:"请先填写任务说明。",preparingUploads:"正在准备参考文件上传。",submitting:"正在提交至本地后端。",requestFailed:"运行请求失败。",succeeded:"运行成功。",failed:"运行失败。",running:"运行正在进行。",queued:"运行已排队。",refreshFailed:"无法刷新运行状态。",statusRefreshFailed:"运行状态刷新失败。",pathCopied:"运行文件夹路径已复制。",pathRevealCopied:"运行文件夹路径已复制，可用于显示位置。",artifactPathCopied:"成果路径已复制。",previewCopied:"当前预览已复制。",clipboardUnavailable:"当前浏览器环境不可使用剪贴板。",validationIssue:"校验问题",artifactReady:"成果就绪",generating:"生成中",rendererArmed:"渲染器就绪",sourcePreserved:"可检查已保留源文件",copyOpenAvailable:"可复制或打开路径",completed:"已完成",syntaxPreview:"语法预览，不执行"},status:{idle:"空闲",queued:"排队中",running:"运行中",succeeded:"成功",failed:"失败",cancelled:"已取消"},stages:{compose:"编写",choose_intent:"选择成果",validate_request:"校验",upload_inputs:"上传输入",submit_run:"提交运行",queued:"排队",running:"运行",resolve_model:"模型",extract_context:"上下文",decide_search:"检索",generate_source:"生成",validate_source:"校验",repair_source:"修复 LaTeX",compile_pdf:"编译 PDF",write_manifest:"清单",poll_status:"刷新",output_files:"输出文件",route:"路由",context:"上下文",generate:"生成",validate:"校验",write:"写作",compile:"编译",outline:"提纲",ingest:"摄取",compress:"压缩",layout:"排版"},context:{ok:"正常",warning:"注意",critical:"紧张",local:"本地估算",heuristic:"后端估算",provider:"提供方估算",input:"输入",output:"输出",total:"合计",limit:"上限",use:"占用",warningLabel:"提示",source:"来源",criticalSummary:"可能需要强压缩",warningSummary:"可能需要压缩",ratioSummary:"占上下文 {percent}",aria:"上下文预算{state}，已占用 {percent}，{source}"},errors:{required:"必填",absoluteHttpUrl:"请使用完整 http 或 https URL",enum:"请选择受支持的值",invalid:"值无效"}},"zh-Hant":{app:{title:"AI Learning Assistant - 成果工作室",brand:"AI Learning Assistant",userFallback:"使用者"},locale:{label:"介面語言"},mobile:{console:"控制台",preview:"預覽"},pane:{consoleKicker:"生產控制台",consoleTitle:"生成學術成果",previewKicker:"成果預覽"},actions:{model:"模型",copyPath:"複製路徑",reveal:"顯示位置",regenerate:"重新生成",copy:"複製",open:"開啟",runArtifact:"開始生成",runAgain:"再次執行",running:"執行中",newRevisionRun:"新修訂執行",copyVisible:"複製目前",test:"測試",save:"儲存",saving:"儲存中",login:"登入",createAccount:"建立帳戶",closeModel:"關閉模型設定",removeFile:"移除 {name}"},intents:{code_homework:{label:"程式",short:"PY",title:"作業程式",description:"腳本或 Notebook 答案",primaryTab:"程式",sourceTab:"原始檔"},essay_latex:{label:"論文",short:"TEX",title:"LaTeX 論文",description:"原始檔與編譯 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},beamer_slides:{label:"投影片",short:"PDF",title:"Beamer 投影片",description:"投影片原始檔與 PDF",primaryTab:"渲染",sourceTab:"LaTeX"},cheat_sheet:{label:"速查表",short:"A4",title:"密集 A4 速查表",description:"課程內容壓縮 PDF",primaryTab:"渲染",sourceTab:"LaTeX"}},controls:{artifactType:"成果類型",search:"檢索",searchMode:{auto:"自動",on:"開啟",off:"關閉"},output:"輸出",previewOnly:"僅預覽",targetPages:"目標頁數",a4:"A4",dense:"密集",pdfFirst:"PDF 優先",sourceKept:"保留原始檔"},composer:{brief:"任務說明",briefPlaceholder:"貼上作業要求、限制條件、評分期望與輸出說明。",runNoteLogin:"登入後可使用生成控制。",runNoteBrief:"填寫任務說明後即可生成。",runNoteUploads:"已選文件會在建立執行前上傳。",runNoteRunning:"後端回報上下文與階段事件後會同步更新。",runNoteReady:"已準備好建立本地生成執行。"},uploads:{label:"參考文件",choose:"拖入或選擇參考文件",selected:"已選擇 {count} 個參考文件",selectedPlural:"已選擇 {count} 個參考文件",willUpload:"文件將在下一次執行前上傳。",duplicates:"這些文件已在選擇列表中。",uploaded:"已上傳",uploading:"上傳中",failed:"上傳失敗",unavailable:"目前後端構建未提供上傳 API。",failedGeneric:"上傳失敗。",missingIds:"上傳回應未返回全部文件編號。"},refinement:{label:"後續修訂",availableAfterRun:"首次執行後可用",revisionSource:"修訂來源 {id}",placeholder:"要求證明更嚴謹、註釋更充分、投影片更少，或調整結構。",note:"將建立新的執行；生成文件仍以磁碟成果為準。",missing:"請先填寫後續修訂要求。"},history:{label:"執行記錄",entries:"{count} 條記錄",readyTitle:"控制台就緒",readyMessage:"請選擇成果類型，補充材料後開始執行。",followUpTitle:"後續修訂請求",regenerateTitle:"重新生成請求",generationTitle:"生成請求",runTitle:"執行 {id}",folderPending:"資料夾待生成"},preview:{tabs:{logs:"日誌",manifest:"清單"},statusMessage:"執行狀態",stageProgress:"階段進度",currentStage:"目前：{stage}",emptyPdfTitle:"PDF 渲染器",emptyPdfMessage:"在成果文件可讀取前，頁面以 PDF 樣式預覽呈現。",deckTitle:"投影片預覽",deckMessage:"文件端點可用後，已編譯 PDF 頁面會替換目前骨架。",sheetTitle:"速查表預覽",sheetMessage:"生成期間保持密集 PDF 樣式頁面可見。",failedTitle:"執行失敗",failedMessage:"如原始檔或日誌已保留，可繼續從執行資料夾檢查。",runFolderPending:"執行資料夾待生成",files:"文件",pageLabel:"第 1 / 12 頁",latexReport:"LaTeX 報告",generatedEssay:"生成論文",generatedSlidesSource:"生成投影片",generatedSlides:"課程演示",introduction:"引言",argument:"論證",references:"參考文獻",notebookApproach:"方法說明",notebookApproachBody:"先說明演算法、邊界情況與複雜度，再呈現實作單元。",markdown:"Markdown",code:"程式",notebookValidation:"Notebook 校驗",preservedForInspection:"已保留供檢查",noExecution:"僅預覽，不執行",a4DenseLayout:"A4 密集版式",onePage:"{count} 頁",manyPages:"{count} 頁",sourceTitle:"原始檔視圖",sourceMessage:"在後端成果文件可讀取前，顯示生成原始檔或相應骨架。",logsTitle:"執行日誌",logsMessage:"先顯示目前狀態；日誌可用後顯示已清理的執行日誌。",manifestTitle:"清單視圖",manifestMessage:"真實清單寫入前，先顯示預計 manifest 結構。"},files:{scriptReady:"腳本輸出",notebookReady:"Notebook 輸出",logReady:"執行日誌",metadataReady:"元資料",pdfReady:"已編譯 PDF",deckReady:"已編譯投影片",sheetReady:"已編譯速查表",sourceReady:"原始檔已保留",compileLogReady:"編譯日誌",pending:"待生成",compilePending:"待編譯"},source:{artifactNoteReady:"成果文件位於執行資料夾；瀏覽器內位元組渲染需等待成果文件端點。",artifactNotePending:"後端接受執行後會生成執行資料夾。",generationLog:"generation.log",notStarted:"尚未開始",status:"狀態",error:"錯誤"},auth:{kicker:"中大認證",loginTitle:"登入",registerTitle:"註冊",email:"中大電郵",password:"密碼",confirmPassword:"確認密碼",contacting:"正在聯絡本地後端...",failed:"認證失敗。",expired:"會話已過期",created:"帳戶已建立，請登入。"},model:{settingsKicker:"模型設定",defaultName:"Qwen 預設配置",defaultButton:"預設 Qwen 配置",needsAttention:"模型需要處理",displayName:"顯示名稱",baseUrl:"Base URL",model:"模型",apiKey:"API key",newKey:"新密鑰",savedKey:"已配置密鑰",noSavedKey:"未儲存密鑰",environmentDefault:"環境預設配置",provider:"提供方",contextWindow:"上下文窗口",streaming:"串流輸出",streamingOn:"開啟",streamingOff:"關閉",defaultsSummary:"Qwen 非密鑰預設值",defaultHelp:"Qwen 端點、模型、上下文窗口與串流模式已預填；只需填寫 API key 即可測試或儲存。",savedLoaded:"已載入儲存配置。",defaultsLoaded:"已載入本地預設值。",loadFailed:"模型配置載入失敗。",saving:"正在儲存模型配置。",saved:"模型配置已儲存。",saveFailed:"模型配置儲存失敗。",testing:"正在測試提供方連線。",testFailed:"提供方連線測試失敗。",connectionOk:"{model} 連線正常。"},run:{ready:"就緒",required:"必填",addBrief:"請先填寫任務說明。",preparingUploads:"正在準備參考文件上傳。",submitting:"正在提交至本地後端。",requestFailed:"執行請求失敗。",succeeded:"執行成功。",failed:"執行失敗。",running:"執行正在進行。",queued:"執行已排隊。",refreshFailed:"無法刷新執行狀態。",statusRefreshFailed:"執行狀態刷新失敗。",pathCopied:"執行資料夾路徑已複製。",pathRevealCopied:"執行資料夾路徑已複製，可用於顯示位置。",artifactPathCopied:"成果路徑已複製。",previewCopied:"目前預覽已複製。",clipboardUnavailable:"目前瀏覽器環境不可使用剪貼簿。",validationIssue:"校驗問題",artifactReady:"成果就緒",generating:"生成中",rendererArmed:"渲染器就緒",sourcePreserved:"可檢查已保留原始檔",copyOpenAvailable:"可複製或開啟路徑",completed:"已完成",syntaxPreview:"語法預覽，不執行"},status:{idle:"閒置",queued:"排隊中",running:"執行中",succeeded:"成功",failed:"失敗",cancelled:"已取消"},stages:{compose:"撰寫",choose_intent:"選擇成果",validate_request:"校驗",upload_inputs:"上傳輸入",submit_run:"提交執行",queued:"排隊",running:"執行",resolve_model:"模型",extract_context:"上下文",decide_search:"檢索",generate_source:"生成",validate_source:"校驗",repair_source:"修復 LaTeX",compile_pdf:"編譯 PDF",write_manifest:"清單",poll_status:"刷新",output_files:"輸出文件",route:"路由",context:"上下文",generate:"生成",validate:"校驗",write:"寫作",compile:"編譯",outline:"提綱",ingest:"攝取",compress:"壓縮",layout:"排版"},context:{ok:"正常",warning:"注意",critical:"緊張",local:"本地估算",heuristic:"後端估算",provider:"提供方估算",input:"輸入",output:"輸出",total:"合計",limit:"上限",use:"佔用",warningLabel:"提示",source:"來源",criticalSummary:"可能需要強壓縮",warningSummary:"可能需要壓縮",ratioSummary:"佔上下文 {percent}",aria:"上下文預算{state}，已佔用 {percent}，{source}"},errors:{required:"必填",absoluteHttpUrl:"請使用完整 http 或 https URL",enum:"請選擇受支援的值",invalid:"值無效"}}},Be="/ui/assets/context-budget-dial-critical-NHRAQxeA.png",Ke="/ui/assets/context-budget-dial-ok-CjS2UYST.png",ze="/ui/assets/context-budget-dial-warning-D8umyfoM.png",je="/ui/assets/auth-entry-preview-D2ClQ5ne.png",He="/ui/assets/empty-workbench-preview-B8cAaNFx.png",We=Object.freeze(["code_homework","essay_latex","beamer_slides","cheat_sheet"]),Xe=Object.freeze(["auto","on","off"]),$=Object.freeze({displayName:"Qwen Default",provider:"openai_compatible",baseUrl:"https://dashscope.aliyuncs.com/compatible-mode/v1",model:"qwen-plus",contextWindowHint:1e6,supportsStreaming:!0});function Ve(e,n){const i={...e};return n.type==="selectIntent"&&(i.intent=K(n.intent),i.previewTab="primary",i.fieldErrors={},i.activeFile=V(i.outputPreference,i.activeFile)),n.type==="selectSearchMode"&&(i.searchMode=de(n.searchMode)),n.type==="selectOutputPreference"&&(i.outputPreference=ue(n.outputPreference),i.activeFile=V(i.outputPreference,i.activeFile)),n.type==="setTargetPages"&&(i.targetPages=ce(n.targetPages),i.fieldErrors={...i.fieldErrors||{}},delete i.fieldErrors.target_pages),i}function K(e){return We.includes(e)?e:"code_homework"}function de(e){return Xe.includes(e)?e:"auto"}function ue(e){return e==="ipynb"?"ipynb":"py"}function ce(e){const n=Number(e);return!Number.isFinite(n)||n<=0?1:Math.round(n)}function V(e,n){const i=e==="ipynb"?["solution.ipynb"]:["solution.py","tests.py","README.md"];return i.includes(n)?n:i[0]}function Ge({isAuthenticated:e,taskText:n,runStatus:i}){return!!(e&&String(n||"").trim()&&i!=="queued"&&i!=="running")}function Qe(e,n){return K(e)==="code_homework"?ue(n):"pdf"}function Je(e,n){return K(e)!=="cheat_sheet"?{}:{target_pages:ce(n),paper_size:"A4",density:"dense"}}function Ze({promptText:e,intent:n,outputPreference:i,searchMode:s,modelProfileId:l=null,uploadIds:o=[],targetPages:u=1,revisionOfRunId:c=null}){const w=K(n),R={task_text:String(e||""),intent:w,output_preference:Qe(w,i),search_mode:de(s),model_profile_id:l||null,upload_ids:Array.isArray(o)?o.filter(Boolean):[],options:Je(w,u)};return c&&(R.revision_of_run_id=c),R}const h=window.__AI_LEARNING_ASSISTANT_API_URL||window.location.origin,Q="ai_learning_assistant_token",J="ai_learning_assistant_user",pe="ai_learning_assistant_locale",C=$.contextWindowHint,Ye=1200,fe=new Set(["succeeded","failed","cancelled"]),Z="en",q={ok:Ke,warning:ze,critical:Be},W=hn(),p={displayName:$.displayName,provider:$.provider,baseUrl:$.baseUrl,model:$.model,contextWindowHint:$.contextWindowHint,supportsStreaming:$.supportsStreaming,apiKey:""},G=[{id:"code_homework",outputs:["solution.py","solution.ipynb"],stages:["route","context","generate","validate"],accent:"clay"},{id:"essay_latex",outputs:["main.pdf","main.tex"],stages:["route","context","write","compile"],accent:"sage"},{id:"beamer_slides",outputs:["slides.pdf","slides.tex"],stages:["route","outline","write","compile"],accent:"amber"},{id:"cheat_sheet",outputs:["cheat-sheet.pdf","cheat-sheet.tex"],stages:["ingest","compress","layout","compile"],accent:"coral"}],t={locale:W,authMode:"login",token:localStorage.getItem(Q)||"",user:kn(),activePane:"console",intent:"code_homework",outputPreference:"py",searchMode:"auto",targetPages:2,taskText:"",refinementText:"",files:[],fieldErrors:{},context:null,previewTab:"primary",activeFile:"solution.py",notice:{message:"",tone:"neutral"},model:{editorOpen:!1,profiles:[],profile:null,form:{...p},fieldErrors:{},statusMessage:"",statusTone:"neutral",busy:""},authMessage:"",authTone:"neutral",run:O(W),history:[$n(W)]},et=document.getElementById("app");let M=null;tt();function tt(){Ne(),g(),tn(),d(),t.token&&nt()}async function nt(){try{const e=await fetch(`${h}/api/auth/me`,{headers:{Authorization:`Bearer ${t.token}`}});if(!e.ok)throw new Error(a("auth.expired"));const n=await e.json();be(n,t.token)}catch{he(),d()}}function d(){const e=!!(t.user&&t.token);Ne(),et.innerHTML=`
        <div class="studio-app ${e?"":"is-auth-entry"}" data-mobile-pane="${r(t.activePane)}" lang="${r(t.locale)}">
            <main class="studio-main">
                ${e?`${at()}
                            <section class="workbench-grid" aria-label="${r(a("app.title"))}">
                                ${rt(e)}
                                ${mt(e)}
                            </section>`:ut()}
                ${e&&t.model.editorOpen?At():""}
            </main>
        </div>
    `,Mt(),e&&N()}function me(){return`
        <div class="locale-switch" role="group" aria-label="${r(a("locale.label"))}">
            ${le.map(e=>`
                <button
                    type="button"
                    class="${t.locale===e.id?"is-active":""}"
                    data-locale="${r(e.id)}"
                    title="${r(e.name)}"
                    aria-label="${r(e.name)}"
                >${r(e.label)}</button>
            `).join("")}
        </div>
    `}function at(){return`
        <nav class="mobile-pane-switch" aria-label="${r(a("app.title"))}">
            <button type="button" class="${t.activePane==="console"?"is-active":""}" data-pane="console">${r(a("mobile.console"))}</button>
            <button type="button" class="${t.activePane==="preview"?"is-active":""}" data-pane="preview">${r(a("mobile.preview"))}</button>
        </nav>
    `}function rt(e){return`
        <section class="console-pane workbench-pane" aria-label="${r(a("pane.consoleKicker"))}">
            <div class="pane-head">
                <div>
                    <div class="pane-kicker">${r(a("pane.consoleKicker"))}</div>
                    <h1>${r(a("pane.consoleTitle"))}</h1>
                </div>
                <div class="pane-actions">
                    ${me()}
                    <button class="tool-button" type="button" data-action="open-model-settings" ${e?"":"disabled"}>
                        <span class="tool-glyph" aria-hidden="true"></span>
                        <span>${r(qt())}</span>
                    </button>
                    <button class="identity-chip" type="button" data-action="logout">
                        <span>${r(t.user?.email||a("app.userFallback"))}</span>
                        <strong>${r(t.user?.role||"")}</strong>
                    </button>
                </div>
            </div>

            <div class="console-utility-row">
                ${Rt()}
                ${st()}
            </div>

            <div class="artifact-type-bar" role="radiogroup" aria-label="${r(a("controls.artifactType"))}">
                ${G.map(it).join("")}
            </div>

            <section class="command-composer" aria-label="${r(a("composer.brief"))}">
                <div class="composer-head">
                    <label class="field-label" for="task-text">${r(a("composer.brief"))}</label>
                    <span>${r(y(L().id,"description"))}</span>
                </div>
                <textarea
                    id="task-text"
                    class="task-input ${t.fieldErrors.task_text?"has-error":""}"
                    rows="8"
                    placeholder="${r(a("composer.briefPlaceholder"))}"
                >${r(t.taskText)}</textarea>
                ${t.fieldErrors.task_text?`<div class="field-error">${r(t.fieldErrors.task_text)}</div>`:""}
                ${ot()}
                ${lt()}
                <div class="composer-actions">
                    <button class="run-button" type="button" data-action="run" ${ne(e)?"":"disabled"}>
                        <span class="run-glyph" aria-hidden="true"></span>
                        <span data-run-button-label>${Me()}</span>
                    </button>
                    <span class="run-note" data-run-note>${r(Fe(e))}</span>
                </div>
            </section>

            ${ct(e)}
            ${pt()}
        </section>
    `}function it(e){const n=t.intent===e.id;return`
        <button
            type="button"
            class="artifact-type ${n?"is-active":""}"
            data-intent="${e.id}"
            data-accent="${e.accent}"
            role="radio"
            aria-checked="${n}"
        >
            <span class="artifact-short">${r(y(e.id,"short"))}</span>
            <span>
                <strong>${r(y(e.id,"label"))}</strong>
                <small>${r(y(e.id,"title"))}</small>
            </span>
        </button>
    `}function st(){return`
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
    `}function ot(){return t.intent==="code_homework"?`
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
    `}function lt(){const e=t.files.length?a(t.files.length===1?"uploads.selected":"uploads.selectedPlural",{count:t.files.length}):a("uploads.choose");return`
        <section class="upload-module" aria-label="${r(a("uploads.label"))}">
            <div class="upload-zone" data-action="open-file-picker" role="button" tabindex="0">
                <input id="file-input" type="file" multiple>
                <span class="upload-mark" aria-hidden="true"></span>
                <div>
                    <strong>${r(a("uploads.label"))}</strong>
                    <span>${r(e)}</span>
                </div>
            </div>
            ${t.files.length?dt():""}
            ${t.notice.message?`<div class="inline-notice is-${t.notice.tone}">${r(t.notice.message)}</div>`:""}
        </section>
    `}function dt(){return`
        <div class="selected-files">
            ${t.files.map(e=>`
                <div class="selected-file" data-file-key="${r(e.key)}">
                    <span class="file-kind">${r(bn(e.name))}</span>
                    <span class="file-name">${r(e.name)}</span>
                    <small>${r(yn(e))}</small>
                    <button class="icon-action" type="button" data-remove-file="${r(e.key)}" aria-label="${r(a("actions.removeFile",{name:e.name}))}">x</button>
                </div>
            `).join("")}
        </div>
    `}function ut(){return`
        <section class="auth-entry" aria-label="${r(a("auth.kicker"))}">
            <div class="auth-entry-shell">
                <div class="auth-entry-preview" aria-hidden="true">
                    <img src="${r(je)}" alt="">
                    <div class="auth-preview-paper">
                        <span class="auth-preview-rule"></span>
                        <div class="auth-preview-brand">${r(a("app.brand"))}</div>
                        <i></i><i></i><i></i>
                    </div>
                </div>
                ${ge()}
            </div>
        </section>
    `}function ct(e){const n=!e||!t.run.id||t.run.status==="queued"||t.run.status==="running";return`
        <section class="refinement-composer" aria-label="${r(a("refinement.label"))}">
            <div class="composer-head">
                <label class="field-label" for="refinement-text">${r(a("refinement.label"))}</label>
                <span>${r(t.run.id?a("refinement.revisionSource",{id:De(t.run.id)}):a("refinement.availableAfterRun"))}</span>
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
    `}function pt(){return`
        <section class="history-stream" aria-label="${r(a("history.label"))}">
            <div class="history-head">
                <span>${r(a("history.label"))}</span>
                <small>${r(a("history.entries",{count:t.history.length}))}</small>
            </div>
            <div class="history-list">
                ${t.history.slice().reverse().map(ft).join("")}
            </div>
        </section>
    `}function ft(e){return`
        <article class="history-item is-${r(e.kind)}" data-status="${r(e.status||"idle")}">
            <div class="history-marker"></div>
            <div class="history-content">
                <div class="history-title">
                    <strong>${r(e.title)}</strong>
                    <span>${r(xn(e.timestamp))}</span>
                </div>
                <p>${r(e.message)}</p>
                ${e.meta?`<div class="history-meta">${r(e.meta)}</div>`:""}
            </div>
        </article>
    `}function mt(e){const n=L();return`
        <section class="preview-pane workbench-pane" aria-label="${r(a("pane.previewKicker"))}">
            <div class="preview-header">
                <div>
                    <div class="pane-kicker">${r(a("pane.previewKicker"))}</div>
                    <h2>${r(y(n.id,"title"))}</h2>
                </div>
                <div class="preview-actions">
                    <button class="secondary-action" type="button" data-action="copy-current-path" ${t.run.outputRoot?"":"disabled"}>${r(a("actions.copyPath"))}</button>
                    <button class="secondary-action" type="button" data-action="reveal-run" ${t.run.outputRoot?"":"disabled"}>${r(a("actions.reveal"))}</button>
                    <button class="secondary-action" type="button" data-action="regenerate" ${ne(e)?"":"disabled"}>${r(a("actions.regenerate"))}</button>
                </div>
            </div>

            <div class="preview-status-strip">
                ${gt()}
                ${vt(n)}
            </div>

            <div class="preview-shell" data-intent="${r(t.intent)}" data-run-status="${r(t.run.status)}" style="--preview-empty-image: url('${r(He)}')">
                ${yt()}
                <div class="preview-body">
                    ${bt()}
                </div>
            </div>

            ${Tt()}
        </section>
    `}function gt(){return`
        <div class="run-status-pill" data-status="${r(t.run.status)}">
            <span class="status-light"></span>
            <div>
                <strong>${r(Ce(t.run.status))}</strong>
                <span>${r(a("preview.currentStage",{stage:b(t.run.stage)}))}</span>
            </div>
        </div>
        <p class="run-message">${r(t.run.error||t.run.message)}</p>
    `}function vt(e){const n=vn(t.run.stage,t.run.status);return`
        <div class="stage-track-shell" aria-label="${r(a("preview.statusMessage"))}">
            <div class="stage-track-head">
                <span>${r(a("preview.stageProgress"))}</span>
                <small>${r(a("preview.currentStage",{stage:b(t.run.stage)}))}</small>
            </div>
            <div class="stage-track" role="list">
                ${e.stages.map((i,s)=>`
                    <span class="stage-step ${i===n?"is-active":""}" role="listitem" ${i===n?'aria-current="step"':""}>
                        <small>${s+1}</small>
                        <strong>${r(b(i))}</strong>
                    </span>
                `).join("")}
            </div>
        </div>
    `}function yt(){const e=an();return`
        <div class="preview-tabs" role="tablist" aria-label="${r(a("pane.previewKicker"))}">
            ${e.map(n=>`
                <button
                    type="button"
                    role="tab"
                    class="${t.previewTab===n.id?"is-active":""}"
                    data-preview-tab="${n.id}"
                    aria-selected="${t.previewTab===n.id}"
                >
                    ${r(n.label)}
                </button>
            `).join("")}
        </div>
    `}function bt(){return t.previewTab==="source"?Pt():t.previewTab==="logs"?xt():t.previewTab==="manifest"?St():t.intent==="code_homework"?ht():t.intent==="essay_latex"?$t():t.intent==="beamer_slides"?_t():kt()}function ht(){return t.outputPreference==="ipynb"?wt():`
        <div class="code-product">
            <div class="code-tabs">
                ${nn().map(n=>`
                    <button type="button" class="${t.activeFile===n?"is-active":""}" data-active-file="${r(n)}">
                        ${r(n)}
                    </button>
                `).join("")}
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${r(a("actions.copyVisible"))}</button>
            </div>
            <div class="code-editor" aria-label="${r(a("preview.code"))}">
                ${z(re(t.activeFile))}
            </div>
            <div class="terminal-strip" data-status="${r(t.run.status)}">
                <span>${r(mn())}</span>
                <strong>${r(gn())}</strong>
            </div>
        </div>
    `}function wt(){return`
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
                <div class="code-editor is-compact">${z(Re())}</div>
            </div>
            <div class="terminal-strip" data-status="${r(t.run.status)}">
                <span>${r(a("preview.notebookValidation"))}</span>
                <strong>${r(t.run.status==="failed"?a("preview.preservedForInspection"):a("preview.noExecution"))}</strong>
            </div>
        </div>
    `}function $t(){return`
        <div class="pdf-stage">
            <div class="page-rail">
                <span class="is-active">1</span>
                <span>2</span>
                <span>3</span>
            </div>
            <article class="pdf-page essay-page">
                <header>
                    <span class="paper-overline">${r(a("preview.latexReport"))}</span>
                    <h3>${r(B(a("preview.generatedEssay")))}</h3>
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
            ${Y(a("preview.emptyPdfTitle"),a("preview.emptyPdfMessage"))}
        </div>
    `}function _t(){return`
        <div class="slide-product">
            <aside class="slide-thumbs" aria-label="${r(a("preview.deckTitle"))}">
                <span class="is-active"></span>
                <span></span>
                <span></span>
                <span></span>
            </aside>
            <div class="slide-canvas">
                <div class="slide-page">
                    <span class="slide-kicker">${r(y("beamer_slides","title"))}</span>
                    <h3>${r(B(a("preview.generatedSlides")))}</h3>
                    <div class="slide-columns">
                        <span></span><span></span><span></span><span></span>
                    </div>
                    <div class="slide-footer">${r(a("preview.pageLabel"))}</div>
                </div>
            </div>
            ${Y(a("preview.deckTitle"),a("preview.deckMessage"))}
        </div>
    `}function kt(){const e=Math.max(1,Math.round(Number(t.targetPages)||1));return`
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
            ${Y(a("preview.sheetTitle"),a("preview.sheetMessage"))}
        </div>
    `}function Y(e,n){return t.run.status==="succeeded"&&t.run.outputRoot?"":t.run.status==="failed"?`
            <div class="preview-overlay is-error">
                <strong>${r(t.run.errorCode||a("preview.failedTitle"))}</strong>
                <span>${r(t.run.error||a("preview.failedMessage"))}</span>
            </div>
        `:t.run.status==="queued"||t.run.status==="running"?`
            <div class="preview-overlay is-running">
                <strong>${r(b(t.run.stage))}</strong>
                <span>${r(t.run.message)}</span>
            </div>
        `:`
        <div class="preview-overlay">
            <strong>${r(e)}</strong>
            <span>${r(n)}</span>
        </div>
    `}function Pt(){const e=rn(),n=e.endsWith(".tex")?"latex":e.endsWith(".json")?"json":"python";return`
        <div class="inspection-product">
            ${ee(a("preview.sourceTitle"),a("preview.sourceMessage"))}
            <div class="inspection-head">
                <span>${r(e)}</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${r(a("actions.copyVisible"))}</button>
            </div>
            <div class="code-editor">${z(Ae(),n)}</div>
            <div class="inspection-note">${r(j())}</div>
        </div>
    `}function xt(){return`
        <div class="inspection-product">
            ${ee(a("preview.logsTitle"),a("preview.logsMessage"))}
            <div class="inspection-head">
                <span>${r(a("source.generationLog"))}</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${r(a("actions.copyVisible"))}</button>
            </div>
            <div class="log-view">
                <p><span>${r(Sn())}</span> ${r(b(t.run.stage))}: ${r(t.run.message)}</p>
                <p><span>run</span> ${t.run.id?r(t.run.id):r(a("source.notStarted"))}</p>
                <p><span>${r(a("source.status"))}</span> ${r(Ce(t.run.status))}</p>
                ${t.run.error?`<p class="is-error"><span>${r(a("source.error"))}</span> ${r(t.run.error)}</p>`:""}
            </div>
            <div class="inspection-note">${r(j())}</div>
        </div>
    `}function St(){const e={schema_version:1,run_id:t.run.id||null,revision_of_run_id:t.run.revisionOfRunId||null,intent:t.intent,search:{mode:t.searchMode},status:t.run.status,outputs:ae().map(n=>({path:n.relativePath,kind:n.kind}))};return`
        <div class="inspection-product">
            ${ee(a("preview.manifestTitle"),a("preview.manifestMessage"))}
            <div class="inspection-head">
                <span>manifest.json</span>
                <button class="copy-code-button" type="button" data-action="copy-visible-preview">${r(a("actions.copyVisible"))}</button>
            </div>
            <div class="code-editor">${z(JSON.stringify(e,null,2),"json")}</div>
            <div class="inspection-note">${r(j())}</div>
        </div>
    `}function ee(e,n){return`
        <div class="inspection-intro">
            <strong>${r(e)}</strong>
            <span>${r(n)}</span>
        </div>
    `}function Tt(){const e=ae();return`
        <section class="output-dock" aria-label="${r(a("preview.files"))}">
            <div class="output-head">
                <span>${r(a("preview.files"))}</span>
                <small>${t.run.outputRoot?r(Ue(t.run.outputRoot)):r(a("preview.runFolderPending"))}</small>
            </div>
            <div class="output-grid">
                ${e.map(n=>Lt(n)).join("")}
            </div>
        </section>
    `}function Lt(e){const n=fn(e.relativePath),i=!!(t.run.outputRoot&&(t.run.status==="succeeded"||e.kind!=="pdf"));return`
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
    `}function Rt(){const e=Se();return`
        <div class="context-widget" tabindex="0" data-context-state="${r(e.warning_level)}" aria-label="${r(Oe(e))}">
            <div class="dial-ring" aria-hidden="true">
                <img src="${r(q[e.warning_level]||q.ok)}" alt="">
                <span data-context-field="state">${r(S(e.warning_level))}</span>
            </div>
            <div class="context-copy">
                <strong data-context-field="source-label">${r(T(e.source))}</strong>
                <span data-context-field="summary">${r(qe(e))}</span>
            </div>
            <div class="context-popover" role="tooltip">
                <div><span>${r(a("context.input"))}</span><strong data-context-field="input">${v(e.estimated_input_tokens)}</strong></div>
                <div><span>${r(a("context.output"))}</span><strong data-context-field="output">${v(e.estimated_output_tokens)}</strong></div>
                <div><span>${r(a("context.total"))}</span><strong data-context-field="total">${v(e.estimated_total_tokens)}</strong></div>
                <div><span>${r(a("context.limit"))}</span><strong data-context-field="limit">${v(e.context_window_limit)}</strong></div>
                <div><span>${r(a("context.use"))}</span><strong data-context-field="utilization">${H(e.utilization_ratio)}</strong></div>
                <div><span>${r(a("context.warningLabel"))}</span><strong data-context-field="warning">${r(S(e.warning_level))}</strong></div>
                <div><span>${r(a("context.source"))}</span><strong data-context-field="source">${r(T(e.source))}</strong></div>
            </div>
        </div>
    `}function ge(){return`
        <section class="auth-panel" aria-label="${r(a("auth.kicker"))}">
            <div class="auth-head">
                <div>
                    <div class="pane-kicker">${r(a("auth.kicker"))}</div>
                    <h2>${r(t.authMode==="login"?a("auth.loginTitle"):a("auth.registerTitle"))}</h2>
                </div>
                <div class="auth-head-actions">
                    ${me()}
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
    `}function At(){const e=t.model.form,n=t.model.profile,i=n?.api_key_ref?a("model.savedKey"):a("model.noSavedKey"),s=!!t.model.busy;return`
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
                    <p class="model-helper">${r(a("model.defaultHelp"))}</p>
                    ${A("displayName",a("model.displayName"),"text",e.displayName,a("model.defaultName"),!1)}
                    ${A("baseUrl",a("model.baseUrl"),"url",e.baseUrl,p.baseUrl,!0)}
                    ${A("model",a("model.model"),"text",e.model,p.model,!0)}
                    ${Et(e)}
                    ${A("apiKey",a("model.apiKey"),"password",e.apiKey,n?.api_key_ref?a("model.newKey"):a("model.apiKey"),!1,"new-password")}
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
    `}function Et(e){return`
        <div class="model-default-grid" aria-label="${r(a("model.defaultsSummary"))}">
            <div>
                <span>${r(a("model.provider"))}</span>
                <strong>${r(e.provider||p.provider)}</strong>
            </div>
            <div>
                <span>${r(a("model.contextWindow"))}</span>
                <strong>${r(v(e.contextWindowHint||p.contextWindowHint))}</strong>
            </div>
            <div>
                <span>${r(a("model.streaming"))}</span>
                <strong>${r(e.supportsStreaming?a("model.streamingOn"):a("model.streamingOff"))}</strong>
            </div>
        </div>
    `}function A(e,n,i,s,l,o,u="off"){const c=t.model.fieldErrors[e]||"";return`
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
    `}function Mt(){ve(),ye(),document.querySelectorAll("[data-pane]").forEach(n=>{n.addEventListener("click",()=>{t.activePane=n.dataset.pane,d()})}),document.getElementById("task-text")?.addEventListener("input",n=>{t.taskText=n.target.value,delete t.fieldErrors.task_text,n.target.classList.remove("has-error"),n.target.closest(".command-composer")?.querySelector(".field-error")?.remove(),g(),N(),se()}),document.getElementById("refinement-text")?.addEventListener("input",n=>{t.refinementText=n.target.value,g(),N(),se()}),document.querySelectorAll("button[data-intent]").forEach(n=>{n.addEventListener("click",()=>{E({type:"selectIntent",intent:n.dataset.intent}),g(),d()})}),document.querySelectorAll("[data-search-mode]").forEach(n=>{n.addEventListener("click",()=>{E({type:"selectSearchMode",searchMode:n.dataset.searchMode}),d()})}),document.querySelectorAll("[data-output-preference]").forEach(n=>{n.addEventListener("click",()=>{E({type:"selectOutputPreference",outputPreference:n.dataset.outputPreference}),g(),d()})}),document.getElementById("target-pages")?.addEventListener("input",n=>{E({type:"setTargetPages",targetPages:n.target.value}),g(),N()});const e=document.querySelector("[data-action='open-file-picker']");e?.addEventListener("click",()=>document.getElementById("file-input")?.click()),e?.addEventListener("keydown",n=>{n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),document.getElementById("file-input")?.click())}),document.getElementById("file-input")?.addEventListener("change",n=>{Yt(Array.from(n.target.files||[])),d()}),document.querySelectorAll("[data-remove-file]").forEach(n=>{n.addEventListener("click",()=>{t.files=t.files.filter(i=>i.key!==n.dataset.removeFile),g(),d()})}),document.querySelector("[data-action='run']")?.addEventListener("click",()=>X({isRevision:!1})),document.querySelector("[data-action='run-refinement']")?.addEventListener("click",()=>X({isRevision:!0})),document.querySelector("[data-action='regenerate']")?.addEventListener("click",()=>X({isRevision:!1,isRegenerate:!0})),document.querySelector("[data-action='logout']")?.addEventListener("click",()=>{P(),he(),d()}),document.querySelector("[data-action='open-model-settings']")?.addEventListener("click",Ot),document.querySelector("[data-action='close-model-settings']")?.addEventListener("click",we),document.getElementById("model-settings-form")?.addEventListener("submit",Bt),document.querySelector("[data-action='test-model-settings']")?.addEventListener("click",Kt),document.querySelectorAll("[data-model-field]").forEach(n=>{n.addEventListener("input",()=>{t.model.form[n.dataset.modelField]=n.value,delete t.model.fieldErrors[n.dataset.modelField],n.closest(".model-field")?.classList.remove("has-error");const i=n.closest(".model-field")?.querySelector(".field-error");i&&(i.textContent="")})}),document.querySelector(".preview-tabs")?.addEventListener("click",n=>{const i=n.target.closest("[data-preview-tab]");i&&(t.previewTab=i.dataset.previewTab,d())}),document.querySelectorAll("[data-active-file]").forEach(n=>{n.addEventListener("click",()=>{t.activeFile=n.dataset.activeFile,d()})}),document.querySelector("[data-action='copy-visible-preview']")?.addEventListener("click",un),document.querySelector("[data-action='copy-current-path']")?.addEventListener("click",()=>D(t.run.outputRoot||"",a("run.pathCopied"))),document.querySelector("[data-action='reveal-run']")?.addEventListener("click",cn),document.querySelectorAll("[data-copy-file]").forEach(n=>{n.addEventListener("click",()=>D(n.dataset.copyFile||"",a("run.artifactPathCopied")))}),document.querySelectorAll("[data-open-file]").forEach(n=>{n.addEventListener("click",()=>pn(n.dataset.openFile||""))}),document.onkeydown=Dt}function E(e){Object.assign(t,Ve({intent:t.intent,previewTab:t.previewTab,fieldErrors:t.fieldErrors,activeFile:t.activeFile,outputPreference:t.outputPreference,searchMode:t.searchMode,targetPages:t.targetPages},e))}function ve(e=document){e.querySelectorAll("[data-locale]").forEach(n=>{n.addEventListener("click",()=>{wn(n.dataset.locale)})})}function ye(e=document){e.querySelectorAll("[data-auth-mode]").forEach(n=>{n.addEventListener("click",()=>{Ft(n.dataset.authMode)})}),e.querySelector("#auth-form")?.addEventListener("submit",It)}function Ft(e){t.authMode=e==="register"?"register":"login",t.authMessage="",t.authTone="neutral",F()}function F(){const e=document.querySelector(".auth-panel");if(!e){d();return}const i=document.createRange().createContextualFragment(ge()).querySelector(".auth-panel");if(!i){d();return}e.replaceWith(i),ve(i),ye(i)}async function It(e){e.preventDefault();const n=document.getElementById("auth-email")?.value.trim().toLowerCase()||"",i=document.getElementById("auth-password")?.value||"",s=document.getElementById("auth-confirm")?.value||"",l=t.authMode==="login"?"/api/auth/login":"/api/auth/register",o=t.authMode==="login"?{email:n,password:i}:{email:n,password:i,confirm_password:s};t.authMessage=a("auth.contacting"),t.authTone="neutral",F();try{const u=await fetch(`${h}${l}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),c=await u.json().catch(()=>({}));if(!u.ok)throw new Error(_(c,a("auth.failed")));if(t.authMode==="register"){t.authMode="login",t.authMessage=a("auth.created"),t.authTone="success",F();return}be({email:c.email,role:c.role},c.token)}catch(u){t.authMessage=f(u.message),t.authTone="error",F()}}async function X({isRevision:e,isRegenerate:n=!1}){if(!t.user||!t.token)return;const i=e?t.refinementText.trim():t.taskText.trim(),s=e?t.run.id:null;if(!i){t.fieldErrors.task_text=e?"":a("run.required"),t.run={...O(),status:"idle",stage:"validate_request",message:a(e?"refinement.missing":"run.addBrief")},d();return}P(),g(),t.fieldErrors={},t.notice={message:"",tone:"neutral"},t.run={...O(),status:"queued",stage:t.files.some(l=>!l.uploadId)?"upload_inputs":"submit_run",message:t.files.some(l=>!l.uploadId)?a("run.preparingUploads"):a("run.submitting"),revisionOfRunId:s},en({kind:e?"revision":"command",status:"queued",title:a(e?"history.followUpTitle":n?"history.regenerateTitle":"history.generationTitle"),message:i,meta:`${y(L().id,"label")} / ${a("controls.search")} ${a(`controls.searchMode.${t.searchMode}`)}`}),t.activePane="preview",d();try{const l=await Nt();t.run={...t.run,stage:"submit_run",message:a("run.submitting")},d();const o=await fetch(`${h}/api/runs`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(Ht({promptText:i,uploadIds:l,revisionOfRunId:s}))}),u=await o.json().catch(()=>({}));if(!o.ok){Wt(u,a("run.requestFailed")),d();return}Pe(u),x(),e&&(t.refinementText=""),d(),u.id&&(await xe(u.id),fe.has(t.run.status)||Jt(u.id))}catch(l){t.run={...t.run,status:"failed",stage:t.run.stage||"submit_run",message:a("run.requestFailed"),error:f(l.message),errorCode:"frontend_request_failed"},x(),d()}}async function Nt(){const e=t.files.filter(o=>!o.uploadId);if(!e.length)return t.files.map(o=>o.uploadId).filter(Boolean);e.forEach(o=>{o.status="uploading"}),d();const n=new FormData;e.forEach(o=>n.append("files",o.file,o.name));const i=await fetch(`${h}/api/uploads`,{method:"POST",headers:{Authorization:`Bearer ${t.token}`},body:n}),s=await i.json().catch(()=>({}));if(!i.ok){e.forEach(u=>{u.status="failed"});const o=i.status===404?a("uploads.unavailable"):a("uploads.failedGeneric");throw new Error(_(s,o))}const l=Array.isArray(s.uploads)?s.uploads:[];if(e.forEach((o,u)=>{const c=l[u];o.uploadId=c?.id||"",o.status=o.uploadId?"uploaded":"failed"}),e.some(o=>!o.uploadId))throw new Error(a("uploads.missingIds"));return t.files.map(o=>o.uploadId).filter(Boolean)}function be(e,n){t.user=e,t.token=n,localStorage.setItem(Q,n),localStorage.setItem(J,JSON.stringify(e)),t.authMessage="",t.run=O(),g(),d(),Ut()}function he(){Ct(),t.user=null,t.token="",localStorage.removeItem(Q),localStorage.removeItem(J)}function Ct(){t.model={editorOpen:!1,profiles:[],profile:null,form:{...p},fieldErrors:{},statusMessage:"",statusTone:"neutral",busy:""}}function qt(){const e=t.model.profile;return e?.model?e.model:t.model.statusTone==="error"?a("model.needsAttention"):a("model.defaultButton")}function Ot(){te(),t.model.editorOpen=!0,t.model.statusMessage=t.model.profile?a("model.savedLoaded"):a("model.defaultsLoaded"),t.model.statusTone="neutral",t.model.fieldErrors={},d()}function we(){t.model.editorOpen=!1,t.model.form.apiKey="",t.model.fieldErrors={},t.model.busy="",d()}function Dt(e){e.key==="Escape"&&t.model.editorOpen&&we()}async function Ut(){if(t.token)try{const e=await fetch(`${h}/api/settings/model-profiles`,{headers:{Authorization:`Bearer ${t.token}`}}),n=await e.json().catch(()=>[]);if(!e.ok)throw new Error(_(n,a("model.loadFailed")));const i=Array.isArray(n)?n.map($e):[];t.model.profiles=i,t.model.profile=i.find(s=>s.is_default)||i[0]||null,te(),t.model.editorOpen&&(t.model.statusMessage=t.model.profile?a("model.savedLoaded"):a("model.defaultsLoaded"),t.model.statusTone="neutral"),d()}catch(e){t.model.statusMessage=f(e.message),t.model.statusTone="error",t.model.editorOpen&&d()}}function $e(e){return{id:String(e?.id||"default-qwen"),display_name:String(e?.display_name||a("model.defaultName")),provider:String(e?.provider||"openai_compatible"),base_url:String(e?.base_url||p.baseUrl),model:String(e?.model||p.model),api_key_ref:e?.api_key_ref?String(e.api_key_ref):null,context_window_hint:Number(e?.context_window_hint||p.contextWindowHint),supports_streaming:e?.supports_streaming===void 0?p.supportsStreaming:!!e.supports_streaming,is_default:!!e?.is_default}}function te(){const e=t.model.profile;t.model.form={displayName:e?.display_name||a("model.defaultName"),provider:e?.provider||p.provider,baseUrl:e?.base_url||p.baseUrl,model:e?.model||p.model,contextWindowHint:Number(e?.context_window_hint||p.contextWindowHint),supportsStreaming:e?.supports_streaming===void 0?p.supportsStreaming:!!e.supports_streaming,apiKey:""}}async function Bt(e){e.preventDefault(),t.model.busy="save",t.model.statusMessage=a("model.saving"),t.model.statusTone="neutral",t.model.fieldErrors={},d();try{const n=await fetch(`${h}/api/settings/model-profiles/default`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(_e({includeApiKey:!0}))}),i=await n.json().catch(()=>({}));if(!n.ok){ke(i,a("model.saveFailed"));return}t.model.profile=$e(i),t.model.profiles=[t.model.profile],te(),t.model.statusMessage=a("model.saved"),t.model.statusTone="success",t.model.fieldErrors={}}catch(n){t.model.statusMessage=f(n.message),t.model.statusTone="error"}finally{t.model.busy="",t.model.form.apiKey="",d()}}async function Kt(){t.model.busy="test",t.model.statusMessage=a("model.testing"),t.model.statusTone="neutral",t.model.fieldErrors={},d();try{const e=!!t.model.form.apiKey.trim(),n=await fetch(`${h}/api/settings/model-profiles/test`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.token}`},body:JSON.stringify(e?_e({includeApiKey:!0}):{})}),i=await n.json().catch(()=>({}));if(!n.ok){ke(i,a("model.testFailed"));return}t.model.statusMessage=a("model.connectionOk",{model:i.model||t.model.form.model}),t.model.statusTone="success",t.model.fieldErrors={}}catch(e){t.model.statusMessage=f(e.message),t.model.statusTone="error"}finally{t.model.busy="",d()}}function _e({includeApiKey:e}){const n=t.model.form,i={display_name:n.displayName.trim()||a("model.defaultName"),provider:n.provider||"openai_compatible",base_url:n.baseUrl.trim()||p.baseUrl,model:n.model.trim()||p.model,context_window_hint:Number(n.contextWindowHint||p.contextWindowHint),supports_streaming:!!(n.supportsStreaming??p.supportsStreaming)};return n.apiKey.trim()&&(i.api_key=n.apiKey.trim()),i}function ke(e,n){const i=e?.error||{};t.model.statusMessage=i.code?`${i.code}: ${f(i.message||n)}`:_(e,n),t.model.statusTone="error",t.model.fieldErrors=zt(i.fields||[])}function zt(e){return e.reduce((n,i)=>{const s=jt(i.field);return s&&(n[s]=I(i.rule)),n},{})}function jt(e){return e==="base_url"?"baseUrl":e==="model"?"model":e==="api_key"?"apiKey":e==="display_name"?"displayName":""}function I(e){return e==="required"?a("errors.required"):e==="absolute_http_url"?a("errors.absoluteHttpUrl"):e==="enum"?a("errors.enum"):e||a("errors.invalid")}function O(e){const n=e||t.locale;return{id:"",status:"idle",stage:"compose",message:U(n,"run.ready"),error:null,errorCode:"",outputRoot:"",revisionOfRunId:null}}function Ht({promptText:e,uploadIds:n,revisionOfRunId:i}){return Ze({promptText:e,uploadIds:n,revisionOfRunId:i,intent:t.intent,outputPreference:t.outputPreference,searchMode:t.searchMode,modelProfileId:t.model.profile?.id||null,targetPages:t.targetPages})}function ne(e){return Ge({isAuthenticated:e,taskText:t.taskText,runStatus:t.run.status})}function Wt(e,n){const i=e?.error||{};t.fieldErrors=Xt(i.fields||[]),t.run={...t.run,status:"failed",stage:"submit_run",message:a("run.requestFailed"),error:_(e,n),errorCode:String(i.code||"request_failed")},x()}function Xt(e){return e.reduce((n,i)=>(i.field==="task_text"&&(n.task_text=I(i.rule)),i.field==="options.target_pages"&&(n.target_pages=I(i.rule)),i.field==="output_preference"&&(n.output_preference=I(i.rule)),n),{})}function Pe(e){e.context&&(t.context=Le(e.context,"backend")),t.run={...t.run,id:e.id||e.run_id||t.run.id||"",status:e.status||t.run.status,stage:e.stage||t.run.stage||"queued",message:Vt(e),error:Gt(e),errorCode:Qt(e),outputRoot:e.output_root||t.run.outputRoot||""}}function Vt(e){return e.message?f(e.message):e.error?.message?f(e.error.message):e.error_message?f(e.error_message):e.status==="succeeded"?a("run.succeeded"):e.status==="failed"?a("run.failed"):e.status==="running"?a("run.running"):a("run.queued")}function Gt(e){return e.error?.message?f(e.error.message):e.status==="failed"&&e.error_message?f(e.error_message):null}function Qt(e){return e.error?.code?String(e.error.code):e.status==="failed"&&typeof e.error_message=="string"?e.error_message.split(":")[0]||"run_failed":""}function Jt(e){P(),M=window.setInterval(()=>{xe(e).catch(n=>{P(),t.run={...t.run,status:"failed",stage:"poll_status",message:a("run.refreshFailed"),error:f(n.message),errorCode:"status_refresh_failed"},x(),d()})},Ye)}function P(){M&&(window.clearInterval(M),M=null)}async function xe(e){if(!e||!t.token)return;const n=await fetch(`${h}/api/runs/${encodeURIComponent(e)}/events`,{headers:{Authorization:`Bearer ${t.token}`}}),i=await n.json().catch(()=>({}));if(!n.ok)throw new Error(_(i,a("run.statusRefreshFailed")));Pe(i),x(),d(),fe.has(t.run.status)&&P()}function N(){const e=Se(),n=document.querySelector(".dial-ring"),i=document.querySelector(".context-widget");if(!n||!i)return;n.style.setProperty("--context-ratio",`${Math.min(100,e.utilization_ratio*100)}%`);const s=n.querySelector("img");s&&(s.src=q[e.warning_level]||q.ok),i.dataset.contextState=e.warning_level,i.setAttribute("aria-label",Oe(e)),m("state",S(e.warning_level)),m("source-label",T(e.source)),m("summary",qe(e)),m("input",v(e.estimated_input_tokens)),m("output",v(e.estimated_output_tokens)),m("total",v(e.estimated_total_tokens)),m("limit",v(e.context_window_limit)),m("utilization",H(e.utilization_ratio)),m("warning",S(e.warning_level)),m("source",T(e.source))}function se(){const e=!!(t.user&&t.token),n=document.querySelector("[data-action='run']");if(n){n.disabled=!ne(e);const o=n.querySelector("[data-run-button-label]");o&&(o.textContent=Me())}const i=document.querySelector("[data-run-note]");i&&(i.textContent=Fe(e));const s=!e||!t.run.id||t.run.status==="queued"||t.run.status==="running",l=document.querySelector("[data-action='run-refinement']");l&&(l.disabled=s||!t.refinementText.trim())}function m(e,n){document.querySelectorAll(`[data-context-field="${e}"]`).forEach(i=>{i.textContent=n})}function g(){t.context=Te()}function Se(){return t.context||Te()}function Te(){const e=L(),n=t.files.reduce((w,R)=>w+Number(R.size||0),0),i=`${t.taskText}
${t.refinementText}`.trim(),s=Math.max(1,Math.ceil((i.length+Math.min(n,2e5))/4)),l=e.id==="cheat_sheet"?Math.max(5e3,t.targetPages*1800):e.id==="beamer_slides"?7e3:e.id==="essay_latex"?6e3:t.outputPreference==="ipynb"?5200:4e3,o=s+l,u=o/C;let c="ok";return u>.85?c="critical":u>=.7&&(c="warning"),Le({estimated_input_tokens:s,estimated_output_tokens:l,estimated_total_tokens:o,context_window_limit:C,utilization_ratio:u,warning_level:c,source:"local"},"local")}function Le(e,n){const i=k(e?.estimated_input_tokens,0),s=k(e?.estimated_output_tokens,0),l=k(e?.context_window_limit,C)||C,o=k(e?.estimated_total_tokens,i+s),u=k(e?.utilization_ratio,l?o/l:0),c=Zt(e?.warning_level,u);return{estimated_input_tokens:i,estimated_output_tokens:s,estimated_total_tokens:o,context_window_limit:l,utilization_ratio:u,warning_level:c,source:String(e?.source||n||"local")}}function k(e,n){const i=Number(e);return!Number.isFinite(i)||i<0?n:i}function Zt(e,n){return e==="ok"||e==="warning"||e==="critical"?e:n>.85?"critical":n>=.7?"warning":"ok"}function Yt(e){const n=new Set(t.files.map(s=>s.key)),i=e.map(s=>({key:`${s.name}-${s.size}-${s.lastModified}`,file:s,name:s.name,size:s.size,status:"pending",uploadId:""})).filter(s=>!n.has(s.key));t.files=[...t.files,...i],t.notice=i.length?{message:a("uploads.willUpload"),tone:"neutral"}:{message:a("uploads.duplicates"),tone:"neutral"},g()}function en(e){t.history.push({id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,timestamp:new Date().toISOString(),...e})}function x(){if(!t.run.id)return;const e=`run-${t.run.id}`,n=t.history.find(s=>s.id===e),i={id:e,kind:"run",status:t.run.status,title:a("history.runTitle",{id:De(t.run.id)}),message:t.run.error||t.run.message,meta:`${b(t.run.stage)} / ${t.run.outputRoot?Ue(t.run.outputRoot):a("history.folderPending")}`,timestamp:new Date().toISOString()};n?Object.assign(n,i):t.history.push(i)}function L(){return G.find(e=>e.id===t.intent)||G[0]}function tn(){t.activeFile=V(t.outputPreference,t.activeFile)}function nn(){return t.outputPreference==="ipynb"?["solution.ipynb"]:["solution.py","tests.py","README.md"]}function an(){return[{id:"primary",label:y(t.intent,"primaryTab")},{id:"source",label:y(t.intent,"sourceTab")},{id:"logs",label:a("preview.tabs.logs")},{id:"manifest",label:a("preview.tabs.manifest")}]}function ae(){return t.intent==="code_homework"?[t.outputPreference==="ipynb"?{name:"solution.ipynb",relativePath:"output/solution.ipynb",kind:"notebook",badge:"NB",readyLabel:a("files.notebookReady"),pendingLabel:a("files.pending")}:{name:"solution.py",relativePath:"output/solution.py",kind:"script",badge:"PY",readyLabel:a("files.scriptReady"),pendingLabel:a("files.pending")},{name:"generation.log",relativePath:"logs/generation.log",kind:"log",badge:"LOG",readyLabel:a("files.logReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]:t.intent==="essay_latex"?[{name:"main.pdf",relativePath:"output/main.pdf",kind:"pdf",badge:"PDF",readyLabel:a("files.pdfReady"),pendingLabel:a("files.compilePending")},{name:"main.tex",relativePath:"output/main.tex",kind:"source",badge:"TEX",readyLabel:a("files.sourceReady"),pendingLabel:a("files.pending")},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:a("files.compileLogReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]:t.intent==="beamer_slides"?[{name:"slides.pdf",relativePath:"output/slides.pdf",kind:"pdf",badge:"PDF",readyLabel:a("files.deckReady"),pendingLabel:a("files.compilePending")},{name:"slides.tex",relativePath:"output/slides.tex",kind:"source",badge:"TEX",readyLabel:a("files.sourceReady"),pendingLabel:a("files.pending")},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:a("files.compileLogReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]:[{name:"cheat-sheet.pdf",relativePath:"output/cheat-sheet.pdf",kind:"pdf",badge:"PDF",readyLabel:a("files.sheetReady"),pendingLabel:a("files.compilePending")},{name:"cheat-sheet.tex",relativePath:"output/cheat-sheet.tex",kind:"source",badge:"TEX",readyLabel:a("files.sourceReady"),pendingLabel:a("files.pending")},{name:"latex.log",relativePath:"logs/latex.log",kind:"log",badge:"LOG",readyLabel:a("files.compileLogReady"),pendingLabel:a("files.pending")},{name:"manifest.json",relativePath:"manifest.json",kind:"manifest",badge:"JS",readyLabel:a("files.metadataReady"),pendingLabel:a("files.pending")}]}function rn(){return t.intent==="code_homework"?t.outputPreference==="ipynb"?"solution.ipynb":"solution.py":t.intent==="beamer_slides"?"slides.tex":t.intent==="cheat_sheet"?"cheat-sheet.tex":"main.tex"}function re(e){return e==="tests.py"?`from solution import solve


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
`}function Re(){return`def solve(values):
    total = 0
    for value in values:
        total += value
    return total

solve([1, 2, 3])`}function Ae(){return t.intent==="code_homework"?re("solution.py"):t.intent==="beamer_slides"?`\\documentclass{beamer}
\\title{${B(a("preview.generatedSlidesSource"))}}
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
\\title{${B(a("preview.generatedEssay"))}}
\\begin{document}
\\maketitle
\\section{Introduction}
The generated source is preserved even if PDF compilation fails.
\\section{Discussion}
Evidence and citations are recorded in the run manifest.
\\end{document}
`}function z(e,n="python"){return`
        <ol class="code-lines">
            ${String(e).replace(/\s+$/u,"").split(`
`).map((s,l)=>`
                <li>
                    <span class="line-no">${l+1}</span>
                    <code>${sn(s,n)}</code>
                </li>
            `).join("")}
        </ol>
    `}function sn(e,n){return n==="json"?ln(e):n==="latex"?dn(e):on(e)}function on(e){const n=e.match(/#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|./g)||[],i=new Set(["def","class","from","import","for","if","else","elif","return","continue","in","as","print","with","try","except","raise","while","True","False","None"]);return n.map((s,l)=>s.startsWith("#")?`<span class="syntax-comment">${r(s)}</span>`:s.startsWith('"')||s.startsWith("'")?`<span class="syntax-string">${r(s)}</span>`:/^\d+$/u.test(s)?`<span class="syntax-number">${r(s)}</span>`:i.has(s)?`<span class="syntax-keyword">${r(s)}</span>`:/^[A-Za-z_][A-Za-z0-9_]*$/u.test(s)&&Ee(n,l)==="("?`<span class="syntax-function">${r(s)}</span>`:r(s)).join("")||" "}function ln(e){const n=e.match(/"(?:\\.|[^"\\])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?|\s+|./g)||[];return n.map((i,s)=>i.startsWith('"')?`<span class="${Ee(n,s)===":"?"syntax-keyword":"syntax-string"}">${r(i)}</span>`:/^(true|false|null)$/u.test(i)?`<span class="syntax-keyword">${r(i)}</span>`:/^-?\d+(?:\.\d+)?$/u.test(i)?`<span class="syntax-number">${r(i)}</span>`:r(i)).join("")||" "}function dn(e){return(e.match(/%.*$|\\[A-Za-z*]+|\{[^}]*\}|\s+|./g)||[]).map(i=>i.startsWith("%")?`<span class="syntax-comment">${r(i)}</span>`:i.startsWith("\\")?`<span class="syntax-keyword">${r(i)}</span>`:i.startsWith("{")&&i.endsWith("}")?`<span class="syntax-string">${r(i)}</span>`:r(i)).join("")||" "}function Ee(e,n){for(let i=n+1;i<e.length;i+=1)if(!/^\s+$/u.test(e[i]))return e[i];return""}async function un(){const e=t.previewTab==="logs"?`${b(t.run.stage)}: ${t.run.message}`:t.previewTab==="manifest"?JSON.stringify({run_id:t.run.id||null,intent:t.intent,status:t.run.status,outputs:ae().map(n=>n.relativePath)},null,2):t.previewTab==="source"?Ae():t.intent==="code_homework"?t.outputPreference==="ipynb"?Re():re(t.activeFile):t.run.outputRoot||j();await D(e,a("run.previewCopied"))}async function D(e,n){if(e){try{await navigator.clipboard.writeText(e),t.notice={message:n,tone:"success"}}catch{t.notice={message:a("run.clipboardUnavailable"),tone:"error"}}d()}}function cn(){t.run.outputRoot&&D(t.run.outputRoot,a("run.pathRevealCopied"))}function pn(e){if(!e)return;const n=e.startsWith("file://")?e:`file://${e}`;window.open(n,"_blank","noopener,noreferrer")}function fn(e){return t.run.outputRoot?`${t.run.outputRoot.replace(/\/$/u,"")}/${e}`:""}function j(){return t.run.outputRoot?a("source.artifactNoteReady"):a("source.artifactNotePending")}function Me(){return t.run.status==="queued"||t.run.status==="running"?a("actions.running"):t.run.status==="failed"?a("actions.runAgain"):a("actions.runArtifact")}function Fe(e){return e?t.taskText.trim()?t.files.some(n=>!n.uploadId)?a("composer.runNoteUploads"):t.run.status==="queued"||t.run.status==="running"?a("composer.runNoteRunning"):a("composer.runNoteReady"):a("composer.runNoteBrief"):a("composer.runNoteLogin")}function mn(){return t.run.status==="failed"?a("run.validationIssue"):t.run.status==="succeeded"?a("run.artifactReady"):t.run.status==="queued"||t.run.status==="running"?a("run.generating"):a("run.rendererArmed")}function gn(){return t.run.status==="failed"?t.run.errorCode||a("run.sourcePreserved"):t.run.status==="succeeded"?t.run.outputRoot?a("run.copyOpenAvailable"):a("run.completed"):t.run.status==="queued"||t.run.status==="running"?b(t.run.stage):a("run.syntaxPreview")}function vn(e,n){return n==="queued"?"route":n==="succeeded"?t.intent==="code_homework"?"validate":"compile":e?.includes("context")||e?.includes("upload")?t.intent==="cheat_sheet"?"ingest":"context":e?.includes("search")||e?.includes("route")?"route":e?.includes("compile")?"compile":e?.includes("validate")?"validate":e?.includes("outline")?"outline":e?.includes("layout")?"layout":e?.includes("compress")?"compress":e?.includes("generate")||e?.includes("source")?t.intent==="beamer_slides"?"write":"generate":L().stages[0]}function b(e){const n=String(e||"compose"),i=a(`stages.${n}`);return i===`stages.${n}`?n.replaceAll("_"," "):i}function yn(e){return e.status==="uploaded"?a("uploads.uploaded"):e.status==="uploading"?a("uploads.uploading"):e.status==="failed"?a("uploads.failed"):Pn(e.size)}function bn(e){return String(e).split(".").pop()?.slice(0,3).toUpperCase()||"FILE"}function hn(){const e=localStorage.getItem(pe);if(Ie(e))return e;const n=navigator.language||"";return n.toLowerCase().startsWith("zh")?n.toLowerCase().includes("tw")||n.toLowerCase().includes("hk")?"zh-Hant":"zh-Hans":Z}function wn(e){const n=Ie(e)?e:Z;t.locale!==n&&(t.locale=n,localStorage.setItem(pe,n),_n(),t.run.status==="idle"&&t.run.stage==="compose"&&(t.run.message=a("run.ready")),d())}function Ie(e){return le.some(n=>n.id===e)}function Ne(){document.documentElement.lang=t.locale,document.title=a("app.title")}function $n(e){return{id:"session-ready",kind:"system",status:"idle",title:U(e,"history.readyTitle"),message:U(e,"history.readyMessage"),timestamp:new Date().toISOString()}}function _n(){const e=t.history.find(n=>n.id==="session-ready");e&&(e.title=a("history.readyTitle"),e.message=a("history.readyMessage"))}function y(e,n){return a(`intents.${e}.${n}`)}function Ce(e){const n=String(e||"idle"),i=a(`status.${n}`);return i===`status.${n}`?n:i}function a(e,n={}){return U(t.locale,e,n)}function U(e,n,i={}){const s=ie[Z]||{},l=ie[e]||s,o=oe(s,n),u=oe(l,n)??o??n;return typeof u!="string"?n:u.replace(/\{([A-Za-z0-9_]+)\}/g,(c,w)=>String(i[w]??""))}function oe(e,n){return String(n).split(".").reduce((i,s)=>{if(i&&Object.prototype.hasOwnProperty.call(i,s))return i[s]},e)}function kn(){try{return JSON.parse(localStorage.getItem(J)||"null")}catch{return null}}function _(e,n){const i=e?.error?.message||(typeof e?.detail=="string"?e.detail:"")||(typeof e?.message=="string"?e.message:"")||n,s=e?.error?.code?`${e.error.code}: `:"";return f(`${s}${i}`)}function f(e){return String(e||"").replace(/sk-[A-Za-z0-9_-]+/g,"[redacted-key]").replace(/Bearer\s+[A-Za-z0-9._-]+/gi,"Bearer [redacted-token]").replace(/api[_-]?key["'\s:=]+[A-Za-z0-9._-]+/gi,"api_key [redacted]").split(`
`).filter(n=>!/\s+at\s+/.test(n)&&!/Traceback/.test(n)).slice(0,3).join(" ").trim()}function v(e){return Number(e||0).toLocaleString()}function H(e){return`${Math.round(Number(e||0)*100)}%`}function Pn(e){const n=Number(e||0);return n>=1024*1024?`${(n/(1024*1024)).toFixed(1)} MB`:n>=1024?`${Math.round(n/1024)} KB`:`${n} B`}function S(e){return a(e==="critical"?"context.critical":e==="warning"?"context.warning":"context.ok")}function T(e){const n=String(e||"local").toLowerCase();return n==="local"?a("context.local"):n==="heuristic"?a("context.heuristic"):n==="provider"?a("context.provider"):e}function qe(e){return e.warning_level==="critical"?a("context.criticalSummary"):e.warning_level==="warning"?a("context.warningSummary"):a("context.ratioSummary",{percent:H(e.utilization_ratio)})}function Oe(e){return a("context.aria",{state:S(e.warning_level),percent:H(e.utilization_ratio),source:T(e.source)})}function B(e){const i=(t.taskText.trim().split(`
`).find(Boolean)||"").replace(/[^\w\s:,-]/g,"").trim();return i?i.length>52?`${i.slice(0,49)}...`:i:e}function De(e){return String(e||"").slice(0,8)||"pending"}function xn(e){try{return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"}).format(new Date(e))}catch{return""}}function Sn(){return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date)}function Ue(e){const n=String(e||"");return n.length<=46?n:`...${n.slice(-43)}`}function r(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}
