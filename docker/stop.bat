@echo off

FOR /F "tokens=* USEBACKQ" %%F IN (`"docker ps -a -q -f name=arya-dispatcher"`) DO docker rm -f %%F