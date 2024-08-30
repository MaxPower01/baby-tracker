@echo off
for %%p in (9099,5001,8080,9000,5000,8085,9199,4000) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%p') do (
        if not "%%a"=="0" taskkill /PID %%a /F
    )
)