# ThinCab — Windows 11 Appliance Hardening & Optimization
# Run as Administrator in PowerShell after setup.ps1.
# Keeps explorer.exe and Microsoft Defender intact for full AVD/VDI compatibility
# while reducing attack surface, background bloat, and SSD wear.

$ErrorActionPreference = "Stop"

Write-Host "[1/8] Disabling AC sleep & hibernate (frees hiberfil.sys SSD space)..." -ForegroundColor Cyan
powercfg /change standby-timeout-ac 0
powercfg /change hibernate-timeout-ac 0
powercfg /hibernate off

Write-Host "[2/8] Ensuring Windows Defender Firewall & Real-Time Protection are enabled..." -ForegroundColor Cyan
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled True
Set-MpPreference -DisableRealtimeMonitoring $false -ErrorAction SilentlyContinue

Write-Host "[3/8] Shrinking inbound attack surface (disable SMBv1, Remote Assistance, inbound RDP)..." -ForegroundColor Cyan
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol -NoRestart -ErrorAction SilentlyContinue | Out-Null
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Remote Assistance" -Name "fAllowToGetHelp" -Type DWord -Value 0
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server" -Name "fDenyTSConnections" -Type DWord -Value 1

Write-Host "[4/8] Blocking surprise Windows Update reboots while logged in..." -ForegroundColor Cyan
$wuPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU"
New-Item -Path $wuPath -Force | Out-Null
Set-ItemProperty -Path $wuPath -Name "NoAutoRebootWithLoggedOnUsers" -Type DWord -Value 1

Write-Host "[5/8] Blocking silent consumer app installs & Start web search..." -ForegroundColor Cyan
$cloudPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\CloudContent"
New-Item -Path $cloudPath -Force | Out-Null
Set-ItemProperty -Path $cloudPath -Name "DisableWindowsConsumerFeatures" -Type DWord -Value 1

$searchPath = "HKCU:\Software\Policies\Microsoft\Windows\Explorer"
New-Item -Path $searchPath -Force | Out-Null
Set-ItemProperty -Path $searchPath -Name "DisableSearchBoxSuggestions" -Type DWord -Value 1

Write-Host "[6/8] Disabling Xbox Game Bar Guide-button capture (frees Coin+Start for Playnite/RetroArch)..." -ForegroundColor Cyan
$gameBarPath = "HKCU:\Software\Microsoft\GameBar"
New-Item -Path $gameBarPath -Force | Out-Null
Set-ItemProperty -Path $gameBarPath -Name "UseNexusForGameBarEnabled" -Type DWord -Value 0

Write-Host "[7/8] Hiding desktop icons & silencing toast notifications..." -ForegroundColor Cyan
$advPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
Set-ItemProperty -Path $advPath -Name "HideIcons" -Type DWord -Value 1

$notifPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Notifications\Settings"
New-Item -Path $notifPath -Force | Out-Null
Set-ItemProperty -Path $notifPath -Name "NOC_GLOBAL_SETTING_TOASTS_ENABLED" -Type DWord -Value 0

Write-Host "[8/8] Disabling taskbar Widgets..." -ForegroundColor Cyan
$feedsPath = "HKLM:\SOFTWARE\Policies\Microsoft\Dsh"
New-Item -Path $feedsPath -Force | Out-Null
Set-ItemProperty -Path $feedsPath -Name "AllowNewsAndInterests" -Type DWord -Value 0

Write-Host "`nDone! Recommended security & appliance steps:" -ForegroundColor Green
Write-Host "  1. Run daily sessions as a Standard (non-Admin) local user; keep a separate Admin account for updates."
Write-Host "  2. If using Sysinternals Autologon, use it only in trusted spaces and on the Standard user account."
Write-Host "  3. Set Desktop Wallpaper to Solid Black, Taskbar -> Auto-hide, and Playnite -> Start in Fullscreen on login."
Write-Host "  4. Keep Windows Update enabled and run 'winget upgrade --all' periodically."
