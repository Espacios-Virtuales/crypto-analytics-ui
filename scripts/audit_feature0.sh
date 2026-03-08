#!/usr/bin/env bash
set -euo pipefail

mkdir -p audits docs/baseline/screenshots docs/crypto-ui

echo "[audit] env" | tee audits/00_env.txt
date | tee -a audits/00_env.txt
uname -a | tee -a audits/00_env.txt
node -v | tee -a audits/00_env.txt || true
npm -v | tee -a audits/00_env.txt || true

echo "[audit] install" | tee audits/00_install.txt
npm ci 2>&1 | tee -a audits/00_install.txt || npm install 2>&1 | tee -a audits/00_install.txt

echo "[audit] deps snapshot" | tee audits/00_dependencies_snapshot.txt
npm list --depth=0 2>&1 | tee audits/00_dependencies_snapshot.txt || true

echo "[audit] build" | tee audits/00_build.txt
npm run build 2>&1 | tee audits/00_build.txt

echo "[audit] test" | tee audits/00_tests.txt
npm test 2>&1 | tee audits/00_tests.txt || true

echo "[audit] done ✅"
echo "Screenshots folder: docs/baseline/screenshots/"
