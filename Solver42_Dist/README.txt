Solver#42 - Local Offline Edition
=================================

Thank you for using Solver#42! This package allows you to run the system locally on your machine without complex setup.

------------------------------------------------------------------------
📋 1. PRE-REQUISITES (MUST READ)
------------------------------------------------------------------------

Before you start, you MUST have "Docker Desktop" installed and running.

[For Mac Users]
1. Download & Install Docker Desktop for Mac: https://www.docker.com/products/docker-desktop/
2. Open "Docker" from your Applications.
3. Wait until the whale icon in the menu bar stops animating.

[For Windows Users]
1. Download & Install Docker Desktop for Windows: https://www.docker.com/products/docker-desktop/
2. During installation, ensure "Use WSL 2 instead of Hyper-V" is CHECKED (Recommended).
   - If asked to update WSL kernel, please follow the link provided by the installer.
   - Or run "wsl --update" in PowerShell as Administrator.
3. Open "Docker Desktop" and wait for the bottom-left status bar to turn GREEN.

------------------------------------------------------------------------
🚀 2. HOW TO START
------------------------------------------------------------------------

Once Docker is running:

[Mac OS]
1. Right-click 'start_dist_mac.command' > Open.
   (If it says "Unidentified Developer", click Open again in the dialog).
2. A terminal window will appear.
3. If it's your first time, it will ask for your API Key.
4. Wait for the system to initialize (First run takes 1-2 mins to install images).
5. The browser will open automatically at: http://localhost:14242

[Windows]
1. Double-click 'start_dist_win.bat'.
2. If Windows SmartScreen appears, click "More Info" > "Run Anyway".
3. Follow the on-screen prompts.
4. The browser will open automatically at: http://localhost:14242

------------------------------------------------------------------------
❓ TROUBLESHOOTING
------------------------------------------------------------------------
Q: It says "Docker is not running"?
A: Please open the Docker Desktop app first and wait for it to fully start.

Q: The browser shows "This site can't be reached"?
A: The system might still be starting up. Wait 10 seconds and refresh the page.

Q: How do I stop it?
A: Open Docker Desktop, go to "Containers", and click the Stop (square) button on the "solver42" group.

=================================
Solver#42 Team
