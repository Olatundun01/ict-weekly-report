// In-memory storage for demo purposes
        let currentUser = null;
        let users = {
            // Pre-seeded demo accounts
            'john': { 
                password: 'pass123', 
                role: 'staff', 
                name: 'John Doe',
                email: 'john@company.com',
                department: 'ict'
            },
            'admin': { 
                password: 'admin123', 
                role: 'hod', 
                name: 'Admin Manager',
                email: 'admin@company.com',
                department: 'ict'
            }
        };
        let reports = [
            {
                id: 1,
                staff: 'john',
                weekEnding: '2024-07-26',
                achievements: 'Completed project phase 1, improved team collaboration',
                pendingtask: 'Database integration took longer than expected',
                suggestions: 'Start phase 2, conduct user testing',
                status: 'approved',
                submittedDate: '2024-07-27'
            },
            {
                id: 2,
                staff: 'jane',
                weekEnding: '2024-07-26',
                achievements: 'Redesigned UI components, fixed critical bugs',
                pendingtask: 'Limited time for thorough testing',
                suggestions: 'Implement new features, code review',
                status: 'pending',
                submittedDate: '2024-07-27'
            }
        ];

        function showLogin() {
            document.getElementById('loginForm').classList.add('active');
            document.getElementById('registerForm').classList.remove('active');
            clearMessages();
        }

        function showRegister() {
            document.getElementById('registerForm').classList.add('active');
            document.getElementById('loginForm').classList.remove('active');
            clearMessages();
        }

        function clearMessages() {
            document.getElementById('loginMessage').innerHTML = '';
            document.getElementById('registerMessage').innerHTML = '';
        }

        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function register() {
            const fullName = document.getElementById('regFullName').value.trim();
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const role = document.getElementById('regRole').value;
            const department = document.getElementById('regDepartment').value;

            // Validation
            if (!fullName || !username || !email || !password || !confirmPassword) {
                showMessage('registerMessage', 'Please fill in all fields', 'error');
                return;
            }

            if (password.length < 6) {
                showMessage('registerMessage', 'Password must be at least 6 characters long', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showMessage('registerMessage', 'Passwords do not match', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showMessage('registerMessage', 'Please enter a valid email address', 'error');
                return;
            }

            // Check if username already exists
            if (users[username]) {
                showMessage('registerMessage', 'Username already exists. Please choose a different one.', 'error');
                return;
            }

            // Check if email already exists
            const existingUser = Object.values(users).find(user => user.email === email);
            if (existingUser) {
                showMessage('registerMessage', 'Email already registered. Please use a different email.', 'error');
                return;
            }

            // Create new user
            users[username] = {
                password: password,
                role: role,
                name: fullName,
                email: email,
                department: department
            };

            showMessage('registerMessage', 'Registration successful! You can now login.', 'success');
            
            // Clear form
            document.getElementById('regFullName').value = '';
            document.getElementById('regUsername').value = '';
            document.getElementById('regEmail').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regConfirmPassword').value = '';
            
            // Switch to login form after 2 seconds
            setTimeout(() => {
                showLogin();
            }, 2000);
        }

        function login() {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!username || !password) {
                showMessage('loginMessage', 'Please enter both username and password', 'error');
                return;
            }

            if (users[username] && users[username].password === password) {
                currentUser = {
                    username: username,
                    role: users[username].role,
                    name: users[username].name,
                    email: users[username].email,
                    department: users[username].department
                };

                document.getElementById('loginForm').classList.remove('active');
                document.getElementById('registerForm').classList.remove('active');
                document.getElementById('dashboard').classList.add('active');
                document.getElementById('userInfo').style.display = 'flex';
                document.getElementById('userBadge').textContent = `${currentUser.name} (${currentUser.role})`;

                if (currentUser.role === 'staff') {
                    document.getElementById('staffDashboard').style.display = 'block';
                    document.getElementById('hodDashboard').style.display = 'none';
                    loadStaffReports();
                } else {
                    document.getElementById('staffDashboard').style.display = 'none';
                    document.getElementById('hodDashboard').style.display = 'block';
                    loadPendingReports();
                    loadAllReports();
                }

                // Set default date to current week ending
                const today = new Date();
                const weekEnding = new Date(today);
                weekEnding.setDate(today.getDate() + (5 - today.getDay()));
                document.getElementById('reportWeek').value = weekEnding.toISOString().split('T')[0];
            } else {
                showMessage('loginMessage', 'Invalid username or password', 'error');
            }
        }

        function logout() {
            currentUser = null;
            document.getElementById('loginForm').classList.add('active');
            document.getElementById('registerForm').classList.remove('active');
            document.getElementById('dashboard').classList.remove('active');
            document.getElementById('userInfo').style.display = 'none';
            
            // Clear login form
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
            clearMessages();
            
            // Reset tabs
            switchTab(currentUser?.role === 'hod' ? 'pending' : 'submit');
        }

        function switchTab(tabName) {
            // Remove active class from all tabs and content
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            event.target.classList.add('active');
            document.getElementById(tabName).classList.add('active');

            // Load data based on tab
            if (tabName === 'myreports') {
                loadStaffReports();
            } else if (tabName === 'pending') {
                loadPendingReports();
            } else if (tabName === 'allreports') {
                loadAllReports();
            }
        }

        function submitReport() {
            const weekEnding = document.getElementById('reportWeek').value;
            const achievements = document.getElementById('acheivements').value;
            const pendingtask = document.getElementById('pendingtask').value;
            const suggestions = document.getElementById('suggestions').value;

            if (!weekEnding || !activity || !pendingtask || !suggestions) {
                showMessage('submitMessage', 'Please fill in all fields', 'error');
                return;
            }

            const newReport = {
                id: reports.length + 1,
                staff: currentUser.username,
                weekEnding: weekEnding,
                activity: activity,
                pendingtask: pendingtask,
                suggestions: suggestions,
                status: 'pending',
                submittedDate: new Date().toISOString().split('T')[0]
            };

            reports.push(newReport);
            
            showMessage('submitMessage', 'Report submitted successfully!', 'success');
            
            // Clear form
            document.getElementById('activity').value = '';
            document.getElementById('pendingtask').value = '';
            document.getElementById('suggestions').value = '';
        }

        function loadStaffReports() {
            const staffReports = reports.filter(report => report.staff === currentUser.username);
            const container = document.getElementById('staffReports');
            
            if (staffReports.length === 0) {
                container.innerHTML = '<div class="empty-state"><h3>No reports found</h3><p>You haven\'t submitted any reports yet.</p></div>';
                return;
            }

            container.innerHTML = staffReports.map(report => `
                <div class="report-card">
                    <div class="report-header">
                        <div>
                            <div class="report-title">Week Ending: ${formatDate(report.weekEnding)}</div>
                            <div class="report-date">Submitted: ${formatDate(report.submittedDate)}</div>
                        </div>
                        <span class="status-badge status-${report.status}">${report.status}</span>
                    </div>
                    <div><strong>Achievements:</strong> ${report.achievements}</div>
                    <div><strong>Challenges:</strong> ${report.pendingtask}</div>
                    <div><strong>Next Week Plans:</strong> ${report.suggestion}</div>
                </div>
            `).join('');
        }

        function loadPendingReports() {
            const pendingReports = reports.filter(report => report.status === 'pending');
            const container = document.getElementById('pendingReports');
            
            if (pendingReports.length === 0) {
                container.innerHTML = '<div class="empty-state"><h3>No pending reports</h3><p>All reports have been reviewed.</p></div>';
                return;
            }

            container.innerHTML = pendingReports.map(report => `
                <div class="report-card">
                    <div class="report-header">
                        <div>
                            <div class="report-title">staff: ${users[report.staff]?.name || report.staff}</div>
                            <div class="report-date">Week Ending: ${formatDate(report.weekEnding)} | Submitted: ${formatDate(report.submittedDate)} | Dept: ${users[report.staff]?.department || 'N/A'}</div>
                        </div>
                        <span class="status-badge status-${report.status}">${report.status}</span>
                    </div>
                    <div><strong>Achievements:</strong> ${report.achievements}</div>
                    <div><strong>Pending Task:</strong> ${report.pendingtask}</div>
                    <div><strong>Suggestion:</strong> ${report.suggestions}</div>
                    <div style="margin-top: 15px;">
                        <button class="btn" onclick="reviewReport(${report.id}, 'approved')">Approve</button>
                        <button class="btn btn-secondary" onclick="reviewReport(${report.id}, 'rejected')">Reject</button>
                    </div>
                </div>
            `).join('');
        }

        function loadAllReports() {
            const container = document.getElementById('allReportsList');
            
            if (reports.length === 0) {
                container.innerHTML = '<div class="empty-state"><h3>No reports found</h3><p>No reports have been submitted yet.</p></div>';
                return;
            }

            container.innerHTML = reports.map(report => `
                <div class="report-card">
                    <div class="report-header">
                        <div>
                            <div class="report-title">Staff: ${users[report.staff]?.name || report.staff}</div>
                            <div class="report-date">Week Ending: ${formatDate(report.weekEnding)} | Submitted: ${formatDate(report.submittedDate)} | Dept: ${users[report.staff]?.department || 'N/A'}</div>
                        </div>
                        <span class="status-badge status-${report.status}">${report.status}</span>
                    </div>
                    <div><strong>Achievements:</strong> ${report.achievements}</div>
                    <div><strong>Pending Task:</strong> ${report.pendingtask}</div>
                    <div><strong>Suggestions:</strong> ${report.suggestions}</div>
                </div>
            `).join('');
        }

        function reviewReport(reportId, status) {
            const reportIndex = reports.findIndex(report => report.id === reportId);
            if (reportIndex !== -1) {
                reports[reportIndex].status = status;
                loadPendingReports();
                loadAllReports();
            }
        }

        function showMessage(containerId, message, type) {
            const container = document.getElementById(containerId);
            container.innerHTML = `<div class="${type}-message">${message}</div>`;
            setTimeout(() => {
                container.innerHTML = '';
            }, 3000);
        }

        function formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        // Initialize with current date
        window.onload = () => {
            const today = new Date();
            const weekEnding = new Date(today);
            weekEnding.setDate(today.getDate() + (5 - today.getDay()));
            document.getElementById('reportWeek').value = weekEnding.toISOString().split('T')[0];
        };