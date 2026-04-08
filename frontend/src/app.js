        const API_URL = window.__SOLVER42_API_URL || window.location.origin;
        let currentUser = null;
        let currentCourseId = null;
        let currentAssignmentId = null;
        let currentAssignmentSnapshot = null;
        let coursesCache = [];
        let activePollIntervalId = null;
        let currentStatusBubble = null;
        const LOCAL_CONTEXT_WINDOW_LIMIT = 128000;
        const LOCAL_TARGET_OUTPUT_TOKENS = 1200;

        function switchAuthMode(mode) {
            const formLogin = document.getElementById('form-login');
            const formReg = document.getElementById('form-register');
            const tabLogin = document.getElementById('tab-login');
            const tabReg = document.getElementById('tab-register');

            if (mode === 'login') {
                formLogin.classList.remove('hidden');
                formReg.classList.add('hidden');
                tabLogin.classList.add('text-white', 'border-b-2', 'border-blue-500', 'font-bold');
                tabLogin.classList.remove('text-slate-500');
                tabReg.classList.remove('text-white', 'border-b-2', 'border-blue-500', 'font-bold');
                tabReg.classList.add('text-slate-500');
            } else {
                formLogin.classList.add('hidden');
                formReg.classList.remove('hidden');
                tabReg.classList.add('text-white', 'border-b-2', 'border-blue-500', 'font-bold');
                tabReg.classList.remove('text-slate-500');
                tabLogin.classList.remove('text-white', 'border-b-2', 'border-blue-500', 'font-bold');
                tabLogin.classList.add('text-slate-500');
            }
        }

        function getStorageSetKey(type) {
            if (!currentUser?.email) return null;
            if (type === 'courses') return `hidden_courses_${currentUser.email}`;
            return `hidden_assignments_${currentUser.email}`;
        }

        function loadHiddenSet(type) {
            const key = getStorageSetKey(type);
            if (!key) return new Set();
            try {
                const raw = localStorage.getItem(key);
                const list = raw ? JSON.parse(raw) : [];
                return new Set(list.map(String));
            } catch {
                return new Set();
            }
        }

        function saveHiddenSet(type, setData) {
            const key = getStorageSetKey(type);
            if (!key) return;
            localStorage.setItem(key, JSON.stringify(Array.from(setData)));
        }

        function isCourseHidden(courseId) {
            return loadHiddenSet('courses').has(String(courseId));
        }

        function isAssignmentHidden(assignmentId) {
            return loadHiddenSet('assignments').has(String(assignmentId));
        }

        function getVisibleCourses() {
            return coursesCache.filter(course => !isCourseHidden(course.id));
        }

        function getCurrentCourse() {
            return getVisibleCourses().find(course => String(course.id) === String(currentCourseId)) || null;
        }

        function escapeHtml(text) {
            return String(text ?? '')
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
                .replaceAll("'", '&#39;');
        }

        function clearActivePollLoop() {
            if (activePollIntervalId) {
                clearInterval(activePollIntervalId);
                activePollIntervalId = null;
            }
        }

        function formatInt(value) {
            if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
            return Number(value).toLocaleString();
        }

        function resetContextWindowPanel() {
            const panel = document.getElementById('context-window-panel');
            panel?.classList.remove('hidden');
            document.getElementById('cw-source').textContent = 'LOCAL';
            document.getElementById('cw-warning-level').textContent = '-';
            document.getElementById('cw-warning-level').className = 'text-[10px] font-mono text-slate-400';
            document.getElementById('cw-input').textContent = '-';
            document.getElementById('cw-total').textContent = '-';
            document.getElementById('cw-limit').textContent = '-';
            document.getElementById('cw-ratio').textContent = '-';
        }

        function estimateTokensFromText(text) {
            const normalized = String(text || '');
            return Math.max(1, Math.floor(normalized.length / 4));
        }

        function buildLocalContextEstimate() {
            const format = document.getElementById('output-format')?.value || 'md';
            const customQuestion = document.getElementById('custom-question')?.value || '';
            const file = document.getElementById('file-upload')?.files?.[0];

            const assignmentTitle = currentAssignmentSnapshot?.title || '';
            const assignmentInstructions = currentAssignmentSnapshot?.instructions || '';
            const formatHint = format === 'pdf' ? 'latex beamer output' : `${format} output`;
            const fileApproxChars = file ? Math.min(Number(file.size || 0), 20000) : 0;

            const estimatedInputTokens =
                estimateTokensFromText(assignmentTitle) +
                estimateTokensFromText(assignmentInstructions) +
                estimateTokensFromText(customQuestion) +
                estimateTokensFromText(formatHint) +
                Math.floor(fileApproxChars / 4);

            const estimatedTotalTokens = estimatedInputTokens + LOCAL_TARGET_OUTPUT_TOKENS;
            const utilizationRatio = estimatedTotalTokens / LOCAL_CONTEXT_WINDOW_LIMIT;
            let warningLevel = 'ok';
            if (utilizationRatio > 0.85) warningLevel = 'critical';
            else if (utilizationRatio >= 0.70) warningLevel = 'warning';

            return {
                estimated_input_tokens: estimatedInputTokens,
                estimated_total_tokens: estimatedTotalTokens,
                context_window_limit: LOCAL_CONTEXT_WINDOW_LIMIT,
                utilization_ratio: utilizationRatio,
                warning_level: warningLevel,
                source: 'LOCAL',
            };
        }

        function updateContextWindowPanel(estimate) {
            const panel = document.getElementById('context-window-panel');
            panel?.classList.remove('hidden');
            if (!estimate) return;

            const source = String(estimate.source || 'BACKEND').toUpperCase();
            document.getElementById('cw-source').textContent = source;
            const warning = String(estimate.warning_level || 'ok').toLowerCase();
            const warningEl = document.getElementById('cw-warning-level');
            warningEl.textContent = warning.toUpperCase();
            warningEl.className = 'text-[10px] font-mono';
            if (warning === 'critical') warningEl.classList.add('text-red-400');
            else if (warning === 'warning') warningEl.classList.add('text-yellow-400');
            else warningEl.classList.add('text-green-400');

            document.getElementById('cw-input').textContent = formatInt(estimate.estimated_input_tokens);
            document.getElementById('cw-total').textContent = formatInt(estimate.estimated_total_tokens);
            document.getElementById('cw-limit').textContent = formatInt(estimate.context_window_limit);
            const ratio = Number(estimate.utilization_ratio || 0);
            document.getElementById('cw-ratio').textContent = `${(ratio * 100).toFixed(1)}%`;
        }

        function refreshPersistentContextEstimate() {
            updateContextWindowPanel(buildLocalContextEstimate());
        }

        function clearChatContextPanel(message = "Select an assignment to start.") {
            const history = document.getElementById('chat-history');
            history.innerHTML = `
                <div class="text-center text-slate-500 text-sm py-12">
                    ${escapeHtml(message)}
                </div>
            `;
            currentStatusBubble = null;
        }

        function renderCourseSelector() {
            const select = document.getElementById('current-course-select');
            const deleteBtn = document.getElementById('delete-current-course-btn');
            const visibleCourses = getVisibleCourses();

            select.innerHTML = '';
            if (visibleCourses.length === 0) {
                currentCourseId = null;
                currentAssignmentId = null;
                currentAssignmentSnapshot = null;
                deleteBtn.disabled = true;
                deleteBtn.classList.add('opacity-40', 'cursor-not-allowed');
                select.disabled = true;
                select.innerHTML = `<option value="">No Courses</option>`;
                document.getElementById('assignment-list').innerHTML = `<div class="p-4 text-center text-slate-600 text-xs">No courses found. Create one!</div>`;
                clearChatContextPanel("No course selected.");
                return;
            }

            deleteBtn.disabled = false;
            deleteBtn.classList.remove('opacity-40', 'cursor-not-allowed');
            select.disabled = false;

            const hasCurrent = visibleCourses.some(course => String(course.id) === String(currentCourseId));
            if (!hasCurrent) {
                currentCourseId = visibleCourses[0].id;
                currentAssignmentId = null;
            }

            visibleCourses.forEach(course => {
                const option = document.createElement('option');
                option.value = String(course.id);
                option.textContent = course.title;
                select.appendChild(option);
            });
            select.value = String(currentCourseId);
        }

        async function register() {
            const email = document.getElementById('reg-email').value;
            const pass = document.getElementById('reg-pass').value;
            const confirm = document.getElementById('reg-confirm').value;
            const msg = document.getElementById('reg-msg');

            if (!email || !pass) {
                msg.innerText = "All fields required";
                msg.classList.add('text-red-400');
                return;
            }

            try {
                const res = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password: pass, confirm_password: confirm })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.detail);

                msg.innerText = "Success! Switching to login...";
                msg.classList.remove('text-red-400');
                msg.classList.add('text-green-400');

                setTimeout(() => {
                    document.getElementById('email-input').value = email;
                    switchAuthMode('login');
                }, 1500);

            } catch (e) {
                msg.innerText = e.message;
                msg.classList.add('text-red-400');
            }
        }

        async function login() {
            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;
            const msg = document.getElementById('login-msg');

            if (!email || !password) {
                msg.innerText = "Please enter email and password";
                return;
            }

            try {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.detail);

                currentUser = {
                    email: data.email,
                    role: data.role,
                    token: data.token
                };
                currentCourseId = null;
                currentAssignmentId = null;
                clearActivePollLoop();

                document.getElementById('user-info').innerText = email;
                document.getElementById('login-screen').classList.add('hidden');

                document.getElementById('workspace').classList.remove('hidden');
                document.getElementById('workspace').classList.add('flex');

                const navControls = document.getElementById('nav-controls');
                navControls.classList.remove('hidden');
                navControls.classList.add('flex');

                const sidebar = document.getElementById('app-sidebar');
                sidebar.classList.remove('hidden');
                sidebar.classList.add('flex');

                await loadCourses();

            } catch (e) {
                msg.innerText = e.message || "Login failed";
            }
        }

        async function loadCourses(preferredCourseId = null) {
            document.getElementById('assignments-loading')?.classList.remove('hidden');
            try {
                const res = await fetch(`${API_URL}/courses`, {
                    headers: {
                        "X-User-Email": currentUser.email,
                        "X-User-Token": currentUser.token
                    }
                });
                const courses = await res.json();
                coursesCache = Array.isArray(courses) ? courses : [];

                if (preferredCourseId !== null && preferredCourseId !== undefined) {
                    currentCourseId = preferredCourseId;
                }

                renderCourseSelector();
                await loadAssignments();
            } finally {
                document.getElementById('assignments-loading')?.classList.add('hidden');
            }
        }

        async function createCourse() {
            const title = document.getElementById('course-title').value.trim();
            const term = document.getElementById('course-term').value.trim();
            if (!title) return;

            try {
                const res = await fetch(`${API_URL}/courses`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "X-User-Email": currentUser.email,
                        "X-User-Token": currentUser.token
                    },
                    body: JSON.stringify({ title, term })
                });
                const newCourse = await res.json();
                if (!res.ok) throw new Error(newCourse.detail || "Failed to create course");

                document.getElementById('course-title').value = '';
                document.getElementById('course-term').value = '';
                document.getElementById('new-course-modal').classList.add('hidden');

                currentAssignmentId = null;
                clearChatContextPanel("Course created! Add an assignment to get started.");
                await loadCourses(newCourse.id);
            } catch (e) {
                alert(e.message || "Failed to create course");
            }
        }

        async function loadAssignments() {
            const list = document.getElementById('assignment-list');
            const currentCourse = getCurrentCourse();

            if (!currentCourse) {
                list.innerHTML = `<div class="p-4 text-center text-slate-600 text-xs">No courses found. Create one!</div>`;
                return;
            }

            const res = await fetch(`${API_URL}/assignments`, {
                headers: {
                    "X-User-Email": currentUser.email,
                    "X-User-Token": currentUser.token
                }
            });
            const allAssignments = await res.json();
            const assignments = allAssignments.filter(a =>
                String(a.course_id) === String(currentCourse.id) && !isAssignmentHidden(a.id)
            );

            if (currentAssignmentId && !assignments.some(a => String(a.id) === String(currentAssignmentId))) {
                currentAssignmentId = null;
                currentAssignmentSnapshot = null;
                clearChatContextPanel("Select an assignment to start.");
                refreshPersistentContextEstimate();
            }

            list.innerHTML = "";
            if (assignments.length === 0) {
                list.innerHTML = `<div class="p-4 text-center text-slate-600 text-xs">No assignments yet.</div>`;
                return;
            }

            assignments.forEach((assignment, index) => {
                const div = document.createElement('div');
                const isActive = String(currentAssignmentId) === String(assignment.id);
                div.className = `group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-all border mb-1 ${isActive ? 'bg-slate-800 border-slate-700' : 'border-transparent hover:border-slate-700'}`;
                div.innerHTML = `
                    <div class="h-8 w-8 rounded-lg bg-slate-800 group-hover:bg-blue-900/30 text-slate-400 group-hover:text-blue-400 flex items-center justify-center font-mono text-xs transition-colors">#${index + 1}</div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-slate-300 group-hover:text-white truncate">${escapeHtml(assignment.title)}</div>
                    </div>
                    <button class="assignment-delete-btn h-7 w-7 rounded-md border border-slate-700 text-slate-400 hover:text-red-300 hover:border-red-500 text-xs transition-colors" title="Delete assignment">X</button>
                `;

                div.onclick = () => selectAssignment(assignment);

                const deleteBtn = div.querySelector('.assignment-delete-btn');
                deleteBtn.addEventListener('click', async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    await softDeleteAssignment(assignment.id);
                });

                list.appendChild(div);
            });
        }

        async function createAssignment() {
            const currentCourse = getCurrentCourse();
            if (!currentCourse) return alert("Please create a course first.");

            const title = document.getElementById('assign-title').value.trim();
            const instr = document.getElementById('assign-instr').value.trim();
            if (!title) return;

            const res = await fetch(`${API_URL}/assignments`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Email": currentUser.email,
                    "X-User-Token": currentUser.token
                },
                body: JSON.stringify({ course_id: currentCourse.id, title, instructions: instr })
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.detail || "Failed to create assignment");
                return;
            }

            // If this ID was previously soft-hidden in localStorage (e.g. DB reset reused IDs),
            // unhide it so the newly created assignment is visible immediately.
            const hiddenAssignments = loadHiddenSet('assignments');
            if (hiddenAssignments.delete(String(data.id))) {
                saveHiddenSet('assignments', hiddenAssignments);
            }

            document.getElementById('new-assign-modal').classList.add('hidden');
            document.getElementById('assign-title').value = '';
            document.getElementById('assign-instr').value = '';
            await loadAssignments();
            selectAssignment({
                id: data.id,
                title: data.title || title,
                instructions: instr,
                course_id: currentCourse.id
            });
        }

        function showNewCourseModal() {
            document.getElementById('new-course-modal').classList.remove('hidden');
        }

        function showNewAssignmentModal() {
            if (!getCurrentCourse()) {
                alert("Please create a course first.");
                return;
            }
            document.getElementById('new-assign-modal').classList.remove('hidden');
        }

        async function softDeleteCurrentCourse(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            const currentCourse = getCurrentCourse();
            if (!currentCourse) return;
            if (!confirm("Do you really want to delete this?")) return;

            const hiddenCourses = loadHiddenSet('courses');
            hiddenCourses.add(String(currentCourse.id));
            saveHiddenSet('courses', hiddenCourses);

            if (String(currentCourseId) === String(currentCourse.id)) {
                currentCourseId = null;
                currentAssignmentId = null;
                clearChatContextPanel("No course selected.");
            }

            renderCourseSelector();
            await loadAssignments();
        }

        async function softDeleteAssignment(assignmentId) {
            if (!confirm("Do you really want to delete this?")) return;

            const hiddenAssignments = loadHiddenSet('assignments');
            hiddenAssignments.add(String(assignmentId));
            saveHiddenSet('assignments', hiddenAssignments);

            if (String(currentAssignmentId) === String(assignmentId)) {
                currentAssignmentId = null;
                clearActivePollLoop();
                clearChatContextPanel("Selected assignment has been removed.");
            }

            await loadAssignments();
        }

        function appendAssignmentContextBubble(assignment) {
            const history = document.getElementById('chat-history');
            const div = document.createElement('div');
            div.className = "chat-bubble ai shadow-lg";
            div.innerHTML = `
                <div class="flex items-center gap-2 mb-2 border-b border-slate-600/50 pb-1">
                    <div class="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span class="text-[10px] font-mono text-slate-400 uppercase">Solver#42 Core</span>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="text-xs font-mono text-cyan-400 uppercase tracking-wide">New Context Loaded</div>
                    <div class="text-lg font-bold text-white">${escapeHtml(assignment.title)}</div>
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-2 border-cyan-500 text-slate-300 text-sm">
                        ${escapeHtml(assignment.instructions || '').replaceAll('\n', '<br>')}
                    </div>
                </div>
            `;
            history.appendChild(div);
        }

        function addMessage(role, content) {
            const history = document.getElementById('chat-history');
            const div = document.createElement('div');
            div.className = `chat-bubble ${role} shadow-lg`;
            if (role === 'ai') {
                content = `<div class="flex items-center gap-2 mb-2 border-b border-slate-600/50 pb-1"><div class="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div><span class="text-[10px] font-mono text-slate-400 uppercase">Solver#42 Core</span></div>${content}`;
            }
            div.innerHTML = marked.parse(content);
            history.appendChild(div);
            history.scrollTop = history.scrollHeight;
            return div;
        }

        function removeGeneratedOutputBubbles() {
            document.querySelectorAll('.generated-output-bubble').forEach(node => node.remove());
        }

        function addGeneratedOutputBubble(output, timestamp = null) {
            const history = document.getElementById('chat-history');
            const div = document.createElement('div');
            div.className = "chat-bubble ai shadow-lg generated-output-bubble";
            const ts = timestamp ? `<div class="text-[10px] text-slate-500 mt-3">Restored from ${escapeHtml(new Date(timestamp).toLocaleString())}</div>` : '';
            div.innerHTML = `
                <div class="flex items-center gap-2 mb-2 border-b border-slate-600/50 pb-1">
                    <div class="h-2 w-2 rounded-full bg-green-400"></div>
                    <span class="text-[10px] font-mono text-slate-400 uppercase">Solver#42 Core</span>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="text-sm text-slate-300">Latest generated output</div>
                    <div class="max-h-80 overflow-y-auto bg-slate-950 p-3 rounded border border-slate-800 text-xs text-slate-200">${marked.parse(String(output || ''))}</div>
                    ${ts}
                </div>
            `;
            history.appendChild(div);
            history.scrollTop = history.scrollHeight;
        }

        function createOrReuseStatusBubble() {
            const history = document.getElementById('chat-history');
            if (currentStatusBubble && currentStatusBubble.isConnected) {
                return currentStatusBubble;
            }
            const div = document.createElement('div');
            div.className = "chat-bubble ai shadow-lg";
            div.innerHTML = `
                <div class="flex items-center gap-2 mb-2 border-b border-slate-600/50 pb-1">
                    <div class="h-2 w-2 rounded-full bg-green-400"></div>
                    <span class="text-[10px] font-mono text-slate-400 uppercase">Solver#42 Core</span>
                </div>
                <div class="text-sm font-mono text-cyan-400 flex items-center gap-2">
                    <span class="status-indicator-dot h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span class="status-indicator-text">Generating...</span>
                </div>
            `;
            history.appendChild(div);
            history.scrollTop = history.scrollHeight;
            currentStatusBubble = div;
            return div;
        }

        function setStatusBubbleState(text, isPulsing, textClass = "text-cyan-400") {
            const bubble = createOrReuseStatusBubble();
            const dot = bubble.querySelector('.status-indicator-dot');
            const statusText = bubble.querySelector('.status-indicator-text');
            const textContainer = statusText?.parentElement;
            if (!dot || !statusText || !textContainer) return;

            statusText.textContent = text;
            dot.classList.toggle('animate-pulse', isPulsing);
            textContainer.classList.remove('text-cyan-400', 'text-green-400', 'text-red-400');
            textContainer.classList.add(textClass);
        }

        function selectAssignment(assignment) {
            if (isAssignmentHidden(assignment.id)) {
                currentAssignmentId = null;
                clearChatContextPanel("Selected assignment has been removed.");
                return;
            }
            currentAssignmentId = assignment.id;
            currentAssignmentSnapshot = assignment;
            clearActivePollLoop();

            const history = document.getElementById('chat-history');
            history.innerHTML = '';
            currentStatusBubble = null;
            appendAssignmentContextBubble(assignment);
            loadAssignments();
            fetchAssignmentHistory(assignment.id);
            refreshPersistentContextEstimate();
        }

        async function fetchAssignmentHistory(assignmentId) {
            try {
                const res = await fetch(`${API_URL}/assignments/${assignmentId}/history`, {
                    headers: {
                        "X-User-Email": currentUser.email,
                        "X-User-Token": currentUser.token
                    }
                });
                const history = await res.json();
                removeGeneratedOutputBubbles();
                if (history && history.length > 0) {
                    const latest = history[history.length - 1];
                    addGeneratedOutputBubble(latest.content, latest.timestamp);
                }
            } catch (e) {
                console.error("Failed to load history", e);
            }
        }

        function handleFileSelect(input) {
            const label = document.getElementById('file-label');
            if (input.files && input.files[0]) {
                label.innerText = input.files[0].name;
                label.classList.add('text-cyan-400');
            } else {
                label.innerText = "Click to attach";
                label.classList.remove('text-cyan-400');
            }
            refreshPersistentContextEstimate();
        }

        async function generateAnswer() {
            if (!currentAssignmentId) return;
            const format = document.getElementById('output-format').value;
            const customContext = document.getElementById('custom-question').value;
            const fileInput = document.getElementById('file-upload');
            const assignmentAtSubmit = currentAssignmentId;

            let msg = `Requesting standard answer generation in **${format.toUpperCase()}** format.`;
            if (customContext) msg += `\n\n> **Constraints**: ${customContext}`;
            if (fileInput.files.length > 0) msg += `\n\n> **Attachment**: ${fileInput.files[0].name}`;
            addMessage('teacher', msg);

            clearActivePollLoop();
            refreshPersistentContextEstimate();
            setStatusBubbleState("Generating...", true, "text-cyan-400");

            const formData = new FormData();
            formData.append('assignment_id', String(currentAssignmentId));
            formData.append('output_format', format);
            if (customContext) formData.append('custom_context', customContext);
            if (fileInput.files.length > 0) formData.append('file', fileInput.files[0]);

            try {
                const res = await fetch(`${API_URL}/generate-answer`, {
                    method: 'POST',
                    headers: {
                        "X-User-Email": currentUser.email,
                        "X-User-Token": currentUser.token
                    },
                    body: formData
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.detail || "Failed to start generation");
                if (data.job_id) {
                    // Clear prompt input after backend accepts the request.
                    document.getElementById('custom-question').value = '';
                    fileInput.value = '';
                    document.getElementById('file-label').innerText = "Click to attach";
                    document.getElementById('file-label').classList.remove('text-cyan-400');
                    pollJob(data.job_id, assignmentAtSubmit);
                }
            } catch (e) {
                clearActivePollLoop();
                setStatusBubbleState("Failed", false, "text-red-400");
                addMessage('ai', `<span class="text-red-400">System Error: ${escapeHtml(e.message)}</span>`);
            }
        }

        function pollJob(jobId, assignmentAtSubmit) {
            clearActivePollLoop();
            activePollIntervalId = setInterval(async () => {
                try {
                    const res = await fetch(`${API_URL}/jobs/${jobId}`, {
                        headers: {
                            "X-User-Email": currentUser.email,
                            "X-User-Token": currentUser.token
                        }
                    });
                    const data = await res.json();
                    if (data.context_window_estimate) {
                        updateContextWindowPanel({
                            ...data.context_window_estimate,
                            source: 'BACKEND'
                        });
                    } else {
                        refreshPersistentContextEstimate();
                    }

                    if (data.status === 'succeeded') {
                        clearActivePollLoop();
                        setStatusBubbleState("Finished", false, "text-green-400");
                        if (String(currentAssignmentId) !== String(assignmentAtSubmit)) return;
                        removeGeneratedOutputBubbles();
                        addGeneratedOutputBubble(data.output || '');
                    } else if (data.status === 'failed') {
                        clearActivePollLoop();
                        setStatusBubbleState("Failed", false, "text-red-400");
                        addMessage('ai', `<span class="text-red-400">Generation failed.</span>`);
                    }
                } catch {
                    clearActivePollLoop();
                    setStatusBubbleState("Failed", false, "text-red-400");
                }
            }, 2000);
        }

        function setupCourseSelectorEvents() {
            const select = document.getElementById('current-course-select');
            select.addEventListener('change', async (event) => {
                currentCourseId = event.target.value || null;
                currentAssignmentId = null;
                clearActivePollLoop();
                clearChatContextPanel("Select an assignment to start.");
                await loadAssignments();
            });
        }

        function setupQuestionKeyboardSubmit() {
            const questionBox = document.getElementById('custom-question');
            if (!questionBox) return;
            let composing = false;

            questionBox.addEventListener('compositionstart', () => {
                composing = true;
            });
            questionBox.addEventListener('compositionend', () => {
                composing = false;
            });
            questionBox.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter') return;
                if (event.shiftKey) return;
                if (composing || event.isComposing) return;
                event.preventDefault();
                generateAnswer();
            });
            questionBox.addEventListener('input', refreshPersistentContextEstimate);
        }

        document.getElementById('output-format')?.addEventListener('change', refreshPersistentContextEstimate);
        resetContextWindowPanel();
        refreshPersistentContextEstimate();
        setupCourseSelectorEvents();
        setupQuestionKeyboardSubmit();
    

Object.assign(window, {
    switchAuthMode,
    login,
    register,
    showNewCourseModal,
    showNewAssignmentModal,
    createCourse,
    createAssignment,
    softDeleteCurrentCourse,
    handleFileSelect,
    generateAnswer
});

