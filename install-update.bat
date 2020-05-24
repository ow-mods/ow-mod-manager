@ECHO OFF
if exist ../../resources/install-update.bat (
  echo Waiting for Mod Manager to close...
  ping -n 2 127.0.0.1 >nul
  echo Replacing outdated files with updated ones...
  robocopy .. ../.. /e
  echo Running Mod Manager...
  cd ../..
  start "" "Outer Wilds Mod Manager.exe"
  echo Exiting updater...
  exit
) else (
  echo ERROR: Couldn't find install-update.bat in parent directory.
  echo This script should only be executed by the Outer Wilds Mod Manager, not manually.
  pause
  exit
)
