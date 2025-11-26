import subprocess
import time
import sys
import webbrowser
import os
import socket

# Defined low-conflict ports
APP_PORT = 14242
DB_PORT_PG = 15432
DB_PORT_MONGO = 27017 # Mongo default is usually fine, but can change if needed. Keeping for now as 27017 is standard.

def is_port_open(host, port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex((host, port)) == 0

def run_command(cmd, cwd=None, env=None):
    print(f"Running: {cmd}")
    try:
        subprocess.check_call(cmd, shell=True, cwd=cwd, env=env)
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        sys.exit(1)

def main():
    print("🚀 Starting Solver#42 Local MVP...")
    
    # 1. Check Docker
    print("Checking Docker...")
    try:
        subprocess.check_output("docker ps", shell=True)
    except:
        print("❌ Docker is not running. Please start Docker Desktop.")
        sys.exit(1)
        
    # 2. Start Databases
    print(f"📦 Starting Databases (PG: {DB_PORT_PG})...")
    # Need to export ports for docker-compose to pick up if we parameterize them, 
    # BUT standard docker-compose.yml uses static ports. 
    # We will rely on docker-compose.yml having been updated to 15432.
    run_command("docker-compose up -d postgres mongo")
    
    # 3. Wait for DBs
    print("⏳ Waiting for Database readiness...")
    retries = 30
    while retries > 0:
        if is_port_open("localhost", DB_PORT_PG) and is_port_open("localhost", DB_PORT_MONGO):
            print("✅ Databases are ready.")
            break
        time.sleep(1)
        retries -= 1
        if retries % 5 == 0:
            print("   Waiting...")
    
    if retries == 0:
        print("❌ Timed out waiting for databases.")
        sys.exit(1)
        
    time.sleep(2) 

    # 4. Initialize DB (Seed Data)
    print("🌱 Seeding Database...")
    env = os.environ.copy()
    env["PYTHONPATH"] = os.getcwd()
    # Pass custom DB URL to script via env var to override default config
    env["POSTGRES_URL"] = f"postgresql://postgres:postgres@localhost:{DB_PORT_PG}/solver42"
    
    run_command(f"{sys.executable} -m backend.scripts.init_db", env=env)

    # 5. Start Backend
    print(f"🔥 Starting Backend Server on port {APP_PORT}...")
    
    def wait_and_open():
        print("⏳ Waiting for Backend to accept connections...")
        # Poll for backend readiness
        for _ in range(20):
            if is_port_open("127.0.0.1", APP_PORT):
                print("✅ Backend is ready!")
                time.sleep(0.5)
                print("🌐 Opening Browser...")
                webbrowser.open(f"http://localhost:{APP_PORT}/ui")
                return
            time.sleep(1)
        print("⚠️ Backend startup slow, trying to open browser anyway...")
        webbrowser.open(f"http://localhost:{APP_PORT}/ui")
    
    import threading
    threading.Thread(target=wait_and_open).start()
    
    try:
        # Pass DB config to backend process
        env["POSTGRES_URL"] = f"postgresql://postgres:postgres@localhost:{DB_PORT_PG}/solver42"
        subprocess.call(f"{sys.executable} -m uvicorn backend.main:app --reload --host 0.0.0.0 --port {APP_PORT}", shell=True, env=env)
    except KeyboardInterrupt:
        print("\n🛑 Stopping...")
        run_command("docker-compose stop")
        print("Bye!")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("action", nargs="?", default="start", help="start, reset")
    args = parser.parse_args()
    
    if args.action == "reset":
        print("🧹 Resetting Demo...")
        run_command("docker-compose down -v")
        print("Done. Run 'python demo_launcher.py' to start.")
    else:
        main()
