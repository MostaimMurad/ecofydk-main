@echo off
d:
cd "d:\Mostaim Dev\ecofydk-main"
echo === GIT STATUS === > C:\temp_git_output.txt
git status >> C:\temp_git_output.txt 2>&1
echo. >> C:\temp_git_output.txt
echo === GIT ADD === >> C:\temp_git_output.txt
git add -A >> C:\temp_git_output.txt 2>&1
echo. >> C:\temp_git_output.txt
echo === GIT COMMIT === >> C:\temp_git_output.txt
git commit -m "feat: Add Admin Issue Tracker with auto-screenshot and URL tracking" >> C:\temp_git_output.txt 2>&1
echo. >> C:\temp_git_output.txt
echo === GIT PUSH === >> C:\temp_git_output.txt
git push origin main >> C:\temp_git_output.txt 2>&1
echo. >> C:\temp_git_output.txt
echo === DONE === >> C:\temp_git_output.txt
