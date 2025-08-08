@echo off
echo.
echo 🚀 Starting GitHub Push Script...
echo.

:: Ask for commit message
set /p commitMsg="Enter commit message: "

:: Initialize git if not already
if not exist ".git" (
    echo 🧱 Initializing Git repository...
    git init
)

:: Set main branch (optional: skip if already set)
git branch -M main

:: Add files
echo ➕ Staging files...
git add .

:: Commit
echo 💬 Committing...
git commit -m "%commitMsg%"

:: Check if remote exists
git remote -v | findstr "origin"
if errorlevel 1 (
    set /p repoUrl="https://github.com/gopiy3k/lexirank-dashboard.git"
    git remote add origin %repoUrl%
)

:: Push
echo 🚀 Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Done!
pause
