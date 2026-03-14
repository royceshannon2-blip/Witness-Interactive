@echo off
REM restore_empty_files.bat
REM Windows batch script to restore empty tracked files from remote GitHub

setlocal enabledelayedexpansion

set LOG_FILE=restore_empty_files.log
set DRY_RUN=false
set REMOTE=origin
set DEFAULT_BRANCH=

REM Parse arguments
:parse_args
if "%~1"=="" goto end_parse
if /i "%~1"=="--dry-run" (
    set DRY_RUN=true
    shift
    goto parse_args
)
if /i "%~1"=="--help" (
    echo Usage: %~nx0 [OPTIONS]
    echo.
    echo Options:
    echo   --dry-run          Show what would be restored without making changes
    echo   --help             Show this help message
    exit /b 0
)
echo Unknown option: %~1
echo Use --help for usage information
exit /b 1
:end_parse

REM Check if we're in a Git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo Error: Not a Git repository
    exit /b 1
)

REM Initialize log file
echo ========================================= > "%LOG_FILE%"
echo [%date% %time%] Starting empty file restoration >> "%LOG_FILE%"
echo [%date% %time%] Remote: %REMOTE% >> "%LOG_FILE%"
echo [%date% %time%] Dry run: %DRY_RUN% >> "%LOG_FILE%"
echo ========================================= >> "%LOG_FILE%"
echo.

REM Determine default branch
for /f "tokens=*" %%i in ('git remote show %REMOTE% 2^>nul ^| findstr "HEAD branch"') do (
    for %%j in (%%i) do set LAST_TOKEN=%%j
)
if not defined LAST_TOKEN (
    echo Warning: Could not determine default branch, trying 'main'
    set DEFAULT_BRANCH=main
) else (
    set DEFAULT_BRANCH=!LAST_TOKEN!
)

set REMOTE_BRANCH=%REMOTE%/%DEFAULT_BRANCH%

echo Fetching latest from %REMOTE%...
echo [%date% %time%] Fetching latest from %REMOTE%... >> "%LOG_FILE%"
git fetch %REMOTE% %DEFAULT_BRANCH% >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo ERROR: Failed to fetch from remote
    echo [%date% %time%] ERROR: Failed to fetch from remote >> "%LOG_FILE%"
    exit /b 1
)

REM Counters
set TOTAL_FILES=0
set EMPTY_FILES=0
set RESTORED_FILES=0
set FAILED_FILES=0

REM Get list of tracked files and process each
for /f "delims=" %%f in ('git ls-files') do (
    set /a TOTAL_FILES+=1
    
    REM Check if file exists
    if exist "%%f" (
        REM Check if file is empty (0 bytes)
        for %%a in ("%%f") do set FILE_SIZE=%%~za
        
        if !FILE_SIZE! equ 0 (
            set IS_EMPTY=true
        ) else (
            REM Check if file contains only whitespace
            findstr /r /c:"[^ \t\r\n]" "%%f" >nul 2>&1
            if errorlevel 1 (
                set IS_EMPTY=true
            ) else (
                set IS_EMPTY=false
            )
        )
        
        if "!IS_EMPTY!"=="true" (
            set /a EMPTY_FILES+=1
            echo EMPTY: %%f
            echo [%date% %time%] EMPTY: %%f >> "%LOG_FILE%"
            
            REM Check if file exists in remote branch
            git cat-file -e %REMOTE_BRANCH%:%%f >nul 2>&1
            if not errorlevel 1 (
                if "%DRY_RUN%"=="true" (
                    echo   [DRY-RUN] Would restore from %REMOTE_BRANCH%
                    echo [%date% %time%]   [DRY-RUN] Would restore from %REMOTE_BRANCH% >> "%LOG_FILE%"
                    set /a RESTORED_FILES+=1
                ) else (
                    REM Restore file from remote
                    git show %REMOTE_BRANCH%:%%f > "%%f" 2>> "%LOG_FILE%"
                    if not errorlevel 1 (
                        echo   SUCCESS: Restored from %REMOTE_BRANCH%
                        echo [%date% %time%]   SUCCESS: Restored from %REMOTE_BRANCH% >> "%LOG_FILE%"
                        set /a RESTORED_FILES+=1
                    ) else (
                        echo   ERROR: Failed to restore %%f
                        echo [%date% %time%]   ERROR: Failed to restore %%f >> "%LOG_FILE%"
                        set /a FAILED_FILES+=1
                    )
                )
            ) else (
                echo   SKIP: File not found in %REMOTE_BRANCH% (may be new)
                echo [%date% %time%]   SKIP: File not found in %REMOTE_BRANCH% >> "%LOG_FILE%"
            )
        )
    )
)

REM Summary
echo.
echo =========================================
echo Restoration complete
echo Total tracked files: %TOTAL_FILES%
echo Empty files found: %EMPTY_FILES%
echo Files restored: %RESTORED_FILES%
echo Failed restorations: %FAILED_FILES%
echo =========================================

echo [%date% %time%] ========================================= >> "%LOG_FILE%"
echo [%date% %time%] Restoration complete >> "%LOG_FILE%"
echo [%date% %time%] Total tracked files: %TOTAL_FILES% >> "%LOG_FILE%"
echo [%date% %time%] Empty files found: %EMPTY_FILES% >> "%LOG_FILE%"
echo [%date% %time%] Files restored: %RESTORED_FILES% >> "%LOG_FILE%"
echo [%date% %time%] Failed restorations: %FAILED_FILES% >> "%LOG_FILE%"
echo [%date% %time%] ========================================= >> "%LOG_FILE%"

if "%DRY_RUN%"=="true" (
    echo.
    echo This was a dry run. No files were modified.
    echo Run without --dry-run to actually restore files.
)

echo.
echo Full log saved to: %LOG_FILE%

endlocal
