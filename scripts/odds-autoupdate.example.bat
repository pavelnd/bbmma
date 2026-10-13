@echo off
rem ─────────────────────────────────────────────────────────────
rem  ШАБЛОН автообновления для Планировщика заданий Windows.
rem
rem  1) Скопируйте файл как odds-autoupdate.bat
rem  2) Впишите свой URL и MAP ниже
rem  3) Поставьте его на расписание (см. инструкцию в ответе):
rem
rem     schtasks /Create /TN "OddsUpdate" /SC MINUTE /MO 15 ^
rem       /TR "\"C:\путь\к\проекту\scripts\odds-autoupdate.bat\""
rem
rem  Триггер /SC MINUTE /MO 15 = каждые 15 минут (можете сменить).
rem ─────────────────────────────────────────────────────────────

cd /d "%~dp0\.."

set ODDS_URL=https://your-proxy.example/line.json
set ODDS_MAP={"fon.p1":"fonbet.p1","fon.x":"fonbet.x","fon.p2":"fonbet.p2","win.p1":"winline.p1","win.p2":"winline.p2","olimp.p1":"olimp.p1","olimp.x":"olimp.x","olimp.p2":"olimp.p2"}

node scripts\update-odds.mjs --url "%ODDS_URL%" --map "%ODDS_MAP%"
