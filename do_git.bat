@echo off
cd /d "d:\Mostaim Dev\ecofydk-main"
git status > "d:\Mostaim Dev\ecofydk-main\git_out.txt" 2>&1
git add -A >> "d:\Mostaim Dev\ecofydk-main\git_out.txt" 2>&1
git commit -m "feat: Add Admin Issue Tracker" >> "d:\Mostaim Dev\ecofydk-main\git_out.txt" 2>&1
git push origin main >> "d:\Mostaim Dev\ecofydk-main\git_out.txt" 2>&1
echo DONE >> "d:\Mostaim Dev\ecofydk-main\git_out.txt"
