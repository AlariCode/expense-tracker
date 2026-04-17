#!/bin/bash
osascript -e 'display notification "Claude ждёт вашего ввода" with title "Claude Code"'

# Linux: notify-send 'Claude Code' 'Claude ждёт вашего ввода'
# Windows: powershell.exe -Command "Add-Type -AssemblyName System.Windows.Forms; $n = New-Object System.Windows.Forms.NotifyIcon; $n.Icon = [System.Drawing.SystemIcons]::Information; $n.Visible = $true; $n.ShowBalloonTip(5000, 'Claude Code', 'Claude needs your input', 'Info'); Start-Sleep 6; $n.Dispose()"