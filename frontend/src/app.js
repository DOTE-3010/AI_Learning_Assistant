import './styles.css';

        const API_URL = "http://localhost:14242"; // Changed default port
        let currentUser = null;
        let currentCourse = null; 
        let allCourses = [];
        let currentAssignmentId = null;
        let activeJobInterval = null;
        let activeJobId = null;
        const HIDDEN_COURSE_KEY_PREFIX = "hidden_courses_";
        const HIDDEN_ASSIGNMENT_KEY_PREFIX = "hidden_assignments_";

        function getStorageKey(prefix) {
            return `${prefix}${currentUser?.email || 'guest'}`;
        }

        function getHiddenIds(prefix) {
            const raw = localStorage.getItem(getStorageKey(prefix));
            if (!raw) return new Set();
            try {
                return new Set(JSON.parse(raw).map(Number));
            } catch {
                return new Set();
            }
        }

        function saveHiddenIds(prefix, ids) {
            localStorage.setItem(getStorageKey(prefix), JSON.stringify([...ids]));
        }

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

        async function register() {
            const email = document.getElementById('reg-email').value;
            const pass = document.getElementById('reg-pass').value;
            const confirm = document.getElementById('reg-confirm').value;
            const msg = document.getElementById('reg-msg');
            
            if (!email || !pass || !confirm) {
                msg.innerText = "All fields required";
                msg.classList.add('text-red-400');
                return;
            }

            if (pass !== confirm) {
                msg.innerText = "Passwords do not match";
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
                    document.getElementById('password-input').value = pass;
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
            
            if(!email || !password) {
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
                
                // Success
                currentUser = { 
                    email: data.email, 
                    role: data.role, 
                    token: data.token 
                };
                
                document.getElementById('user-info').innerText = email;
                document.getElementById('login-screen').classList.add('hidden');
                
                // Show Workspace Elements
                document.getElementById('workspace').classList.remove('hidden');
                document.getElementById('workspace').classList.add('flex');
                
                // Show Navbar Controls
                const navControls = document.getElementById('nav-controls');
                navControls.classList.remove('hidden');
                navControls.classList.add('flex');

                // Show Sidebar (restore responsiveness)
                const sidebar = document.getElementById('app-sidebar');
                // Ensure it matches "hidden md:flex" pattern for responsive display
                sidebar.classList.add('hidden', 'md:flex'); 
                
                loadCourses(); 
                
            } catch (e) {
                msg.innerText = e.message || "Login failed";
            }
        }

        async function loadCourses(preferredCourseId = null) {
            document.getElementById('assignments-loading').classList.remove('hidden');
            const res = await fetch(`${API_URL}/courses?ts=${Date.now()}`, {
                cache: 'no-store',
                headers: { 
                    "X-User-Email": currentUser.email,
                    "X-User-Token": currentUser.token
                } 
            });
            const courses = await res.json();
            const hiddenCourseIds = getHiddenIds(HIDDEN_COURSE_KEY_PREFIX);
            allCourses = (Array.isArray(courses) ? courses : []).filter(c => !hiddenCourseIds.has(Number(c.id)));

            if (allCourses.length > 0) {
                renderCourseOptions();

                const selectedByPreference = preferredCourseId
                    ? allCourses.find(c => c.id === Number(preferredCourseId))
                    : null;
                const selectedByCurrent = currentCourse
                    ? allCourses.find(c => c.id === Number(currentCourse.id))
                    : null;

                currentCourse = selectedByPreference || selectedByCurrent || allCourses[0];
                updateCourseUI();
                await loadAssignments();
            } else {
                currentCourse = null;
                currentAssignmentId = null;
                renderCourseOptions();
                document.getElementById('assignment-list').innerHTML = `<div class="p-4 text-center text-slate-600 text-xs">No courses found. Create one!</div>`;
            }
            document.getElementById('assignments-loading').classList.add('hidden');
        }

        function renderCourseOptions() {
            const selector = document.getElementById('course-selector');
            selector.innerHTML = "";

            if (!allCourses || allCourses.length === 0) {
                const option = document.createElement('option');
                option.value = "";
                option.innerText = "No Courses";
                selector.appendChild(option);
                selector.disabled = true;
                return;
            }

            allCourses.forEach(course => {
                const option = document.createElement('option');
                option.value = String(course.id);
                option.innerText = `${course.title} (${course.term || 'N/A'})`;
                selector.appendChild(option);
            });

            selector.disabled = false;
        }

        function onCourseChange(courseId) {
            if (!courseId) return;
            const selected = allCourses.find(c => c.id === Number(courseId));
            if (!selected) return;

            currentCourse = selected;
            currentAssignmentId = null;
            updateCourseUI();
            loadAssignments();
        }

        function deleteCurrentCourse() {
            if (!currentCourse) {
                alert("No course selected.");
                return;
            }

            if (!confirm("Do you really want to delete this?")) return;

            const hiddenCourseIds = getHiddenIds(HIDDEN_COURSE_KEY_PREFIX);
            hiddenCourseIds.add(Number(currentCourse.id));
            saveHiddenIds(HIDDEN_COURSE_KEY_PREFIX, hiddenCourseIds);

            allCourses = allCourses.filter(c => Number(c.id) !== Number(currentCourse.id));
            currentAssignmentId = null;

            if (allCourses.length > 0) {
                currentCourse = allCourses[0];
                renderCourseOptions();
                updateCourseUI();
                loadAssignments();
            } else {
                currentCourse = null;
                renderCourseOptions();
                document.getElementById('assignment-list').innerHTML = `<div class="p-4 text-center text-slate-600 text-xs">No courses found. Create one!</div>`;
            }
        }

        function updateCourseUI() {
            const selector = document.getElementById('course-selector');
            if (!currentCourse || !selector) return;
            selector.value = String(currentCourse.id);
        }

        async function createCourse() {
            const title = document.getElementById('course-title').value;
            const term = document.getElementById('course-term').value;
            if(!title || !term) {
                alert("Course title and term are required.");
                return;
            }
            
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
            if (!res.ok) {
                alert(newCourse.detail || newCourse.error || "Failed to create course.");
                return;
            }

            // Update UI immediately so user can switch/use the new course without refresh.
            const normalizedCourse = {
                id: newCourse.id,
                title: newCourse.title || title,
                term: newCourse.term || term
            };
            allCourses = [
                ...allCourses.filter(c => Number(c.id) !== Number(normalizedCourse.id)),
                normalizedCourse
            ];
            currentCourse = normalizedCourse;
            renderCourseOptions();
            updateCourseUI();

            document.getElementById('new-course-modal').classList.add('hidden');
            document.getElementById('course-title').value = "";
            document.getElementById('course-term').value = "";
            await loadAssignments();
            // Sync back with server truth in background (no UI flicker).
            loadCourses(normalizedCourse.id);
        }

        async function loadAssignments() {
            if (!currentCourse) return;
            const res = await fetch(`${API_URL}/assignments`, { 
                headers: { 
                    "X-User-Email": currentUser.email,
                    "X-User-Token": currentUser.token 
                } 
            });
            const allAssignments = await res.json();
            const hiddenAssignmentIds = getHiddenIds(HIDDEN_ASSIGNMENT_KEY_PREFIX);
            // Client-side filter for demo simplicity (ideally backend filters)
            const assignments = allAssignments.filter(a =>
                a.course_id === currentCourse.id && !hiddenAssignmentIds.has(Number(a.id))
            );
            
            const list = document.getElementById('assignment-list');
            list.innerHTML = "";
            
            if (assignments.length === 0) {
                list.innerHTML = `<div class="p-4 text-center text-slate-600 text-xs">No assignments yet.</div>`;
                return;
            }

            assignments.forEach((a, index) => {
                const div = document.createElement('div');
                div.className = "group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-all border border-transparent hover:border-slate-700 mb-1";
                div.innerHTML = `
                    <div class="h-8 w-8 rounded-lg bg-slate-800 group-hover:bg-blue-900/30 text-slate-400 group-hover:text-blue-400 flex items-center justify-center font-mono text-xs transition-colors">#${index + 1}</div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-slate-300 group-hover:text-white truncate">${a.title}</div>
                    </div>
                    <button class="assignment-delete-btn text-xs text-red-400 border border-red-700/50 rounded h-5 w-5 hover:bg-red-900/20 flex items-center justify-center font-bold" title="Delete">X</button>
                `;
                div.onclick = () => {
                    document.querySelectorAll('#assignment-list > div').forEach(d => d.classList.remove('bg-slate-800', 'border-slate-700'));
                    div.classList.add('bg-slate-800', 'border-slate-700');
                    selectAssignment(a);
                };
                const delBtn = div.querySelector('.assignment-delete-btn');
                delBtn.onclick = (event) => {
                    event.stopPropagation();
                    deleteAssignmentLocally(a);
                };
                list.appendChild(div);
            });
        }

        function deleteAssignmentLocally(assignment) {
            if (!confirm("Do you really want to delete this?")) return;

            const hiddenAssignmentIds = getHiddenIds(HIDDEN_ASSIGNMENT_KEY_PREFIX);
            hiddenAssignmentIds.add(Number(assignment.id));
            saveHiddenIds(HIDDEN_ASSIGNMENT_KEY_PREFIX, hiddenAssignmentIds);

            if (Number(currentAssignmentId) === Number(assignment.id)) {
                currentAssignmentId = null;
                document.getElementById('chat-history').innerHTML = "";
            }
            loadAssignments();
        }

        async function createAssignment() {
            if (!currentCourse) return alert("Please create a course first.");
            const title = document.getElementById('assign-title').value;
            const instr = document.getElementById('assign-instr').value;
            if (!title || !instr) {
                alert("Assignment title and instructions are required.");
                return;
            }
            
            const res = await fetch(`${API_URL}/assignments`, {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json", 
                    "X-User-Email": currentUser.email,
                    "X-User-Token": currentUser.token
                },
                body: JSON.stringify({ course_id: currentCourse.id, title, instructions: instr })
            });

            const created = await res.json();
            if (!res.ok) {
                alert(created.detail || created.error || "Failed to create assignment.");
                return;
            }

            document.getElementById('new-assign-modal').classList.add('hidden');
            document.getElementById('assign-title').value = "";
            document.getElementById('assign-instr').value = "";
            await loadAssignments();
        }
        
        function showNewCourseModal() {
            document.getElementById('new-course-modal').classList.remove('hidden');
        }
        
        function showNewAssignmentModal() {
            document.getElementById('new-assign-modal').classList.remove('hidden');
        }

        function selectAssignment(assignment) {
            currentAssignmentId = assignment.id;
            const history = document.getElementById('chat-history');
            history.innerHTML = ''; 
            
            // Add Initial Assignment Info
            addMessage('ai', `
                <div class="flex flex-col gap-2">
                    <div class="text-xs font-mono text-cyan-400 uppercase tracking-wide">New Context Loaded</div>
                    <div class="text-lg font-bold text-white">${assignment.title}</div>
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-2 border-cyan-500 text-slate-300 text-sm">
                        ${assignment.instructions}
                    </div>
                </div>
            `);
            
            // Fetch & Render History
            fetchAssignmentHistory(assignment.id);
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
                
                if (history && history.length > 0) {
                    // Keep only the latest output to avoid repeated historical render.
                    const latest = history[history.length - 1];
                    renderLatestOutput(latest.content + `<br><br><span class="text-[10px] text-slate-500">Restored from ${new Date(latest.timestamp).toLocaleString()}</span>`);
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
        }

        function addMessage(role, content) {
            const history = document.getElementById('chat-history');
            const div = document.createElement('div');
            div.className = `chat-bubble ${role} shadow-lg`;
            if (role === 'ai') {
                content = `<div class="flex items-center gap-2 mb-2 border-b border-slate-600/50 pb-1"><div class="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div><span class="text-[10px] font-mono text-slate-400 uppercase">AI Learning Assistant Core</span></div>` + content;
            }
            div.innerHTML = marked.parse(content);
            history.appendChild(div);
            history.scrollTop = history.scrollHeight;
            return div;
        }

        function renderLatestOutput(content) {
            document.querySelectorAll('[data-generated-output="true"]').forEach(node => node.remove());
            const bubble = addMessage('ai', content);
            bubble.setAttribute('data-generated-output', 'true');
            return bubble;
        }

        async function generateAnswer() {
            if (!currentAssignmentId) return;
            const format = document.getElementById('output-format').value;
            const customContext = document.getElementById('custom-question').value;
            const fileInput = document.getElementById('file-upload');
            
            let msg = `Requesting standard answer generation in **${format.toUpperCase()}** format.`;
            if (customContext) msg += `\n\n> **Constraints**: ${customContext}`;
            if (fileInput.files.length > 0) msg += `\n\n> **Attachment**: ${fileInput.files[0].name}`;
            addMessage('teacher', msg);
            
            // Build FormData
            const formData = new FormData();
            formData.append('assignment_id', currentAssignmentId);
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
                if (data.job_id) {
                    if (activeJobInterval) {
                        clearInterval(activeJobInterval);
                        activeJobInterval = null;
                    }
                    activeJobId = data.job_id;
                    addMessage('ai', `<span id="job-status-${data.job_id}" class="text-cyan-400 font-mono text-xs animate-pulse">Generating...</span>`);
                    pollJob(data.job_id);
                }
            } catch (e) {
                addMessage('ai', `<span class="text-red-400">System Error: ${e.message}</span>`);
            }
        }

        async function pollJob(jobId) {
            activeJobInterval = setInterval(async () => {
                try {
                    const res = await fetch(`${API_URL}/jobs/${jobId}`, { 
                        headers: { 
                            "X-User-Email": currentUser.email,
                            "X-User-Token": currentUser.token
                        } 
                    });
                    const data = await res.json();
                    
                    if (data.status === 'succeeded') {
                        clearInterval(activeJobInterval);
                        activeJobInterval = null;
                        const statusNode = document.getElementById(`job-status-${jobId}`);
                        if (statusNode) {
                            statusNode.classList.remove('animate-pulse');
                            statusNode.classList.remove('text-cyan-400');
                            statusNode.classList.add('text-green-400');
                            statusNode.innerText = "Finished";
                        }
                        if (activeJobId === jobId && data.output) {
                            renderLatestOutput(data.output);
                        }
                    } else if (data.status === 'failed') {
                        clearInterval(activeJobInterval);
                        activeJobInterval = null;
                        addMessage('ai', `<span class="text-red-400">Generation failed.</span>`);
                    }
                } catch (e) {
                    clearInterval(activeJobInterval);
                    activeJobInterval = null;
                }
            }, 2000);
        }

        function setupInputShortcuts() {
            const customQuestion = document.getElementById('custom-question');
            if (!customQuestion) return;

            customQuestion.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
                    event.preventDefault();
                    generateAnswer();
                }
            });
        }

        setupInputShortcuts();

Object.assign(window, {
    switchAuthMode,
    register,
    login,
    onCourseChange,
    deleteCurrentCourse,
    createCourse,
    createAssignment,
    showNewCourseModal,
    showNewAssignmentModal,
    handleFileSelect,
    generateAnswer
});
