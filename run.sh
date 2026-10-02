#!/usr/bin/env bash

# Lumina Journal — Universal 1-Click Launcher for macOS & Linux
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "================================================================"
echo "          LUMINA JOURNAL — EDITORIAL BLOGGING PLATFORM"
echo "================================================================"
echo ""

# 1. Check for Node.js
if ! command -v node &> /dev/null; then
    echo "[!] Node.js is not installed on this system."
    echo "Opening https://nodejs.org to download Node.js LTS..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "https://nodejs.org/en/download"
    else
        xdg-open "https://nodejs.org/en/download" || true
    fi
    exit 1
fi

# 2. Check for dependencies
if [ ! -d "node_modules" ]; then
    echo "[*] First-time setup: Installing dependencies..."
    npm install
    echo "[*] Installation complete!"
    echo ""
fi

# 3. Open browser
echo "[*] Launching Lumina Journal at http://localhost:3000/ ..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    (sleep 2 && open "http://localhost:3000/") &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    (sleep 2 && xdg-open "http://localhost:3000/") &
fi

# 4. Start dev server
npm run dev
