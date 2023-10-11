@echo off
if %1. == . goto noparm
if exist %1.res del %1.res
echo Task: Домино >%1.res
echo Program to test: %1 >>%1.res
echo ................ >>%1.res 
for %%i in (01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20) do call test.bat %%i %1
if exist input.txt del input.txt>Nul
if exist output.txt del output.txt>Nul
exit
:noparm
@echo Usage: test_all filename
@echo filename must be without extension!
