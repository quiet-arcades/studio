# ThinCab M3 — Windows 11 Provisioning Script
# Installs official AVD (Windows App), Moonlight, Playnite, and optional OEM driver utility via winget.
# Usage:
#   .\setup.ps1                  # Core thin-client & arcade apps
#   .\setup.ps1 -WithDrivers     # Also installs OEM driver/BIOS updater (Dell/Lenovo)

param(
    [switch]$WithDrivers
)

$ErrorActionPreference = "Stop"

$packages = @(
    @{ Id = "Microsoft.WindowsApp";                     Name = "Microsoft Windows App (AVD / Windows 365)" },
    @{ Id = "MoonlightGameStreamingProject.Moonlight";  Name = "Moonlight" },
    @{ Id = "Playnite.Playnite";                        Name = "Playnite (Fullscreen Launcher)" },
    @{ Id = "Libretro.RetroArch";                       Name = "RetroArch (Optional Local Emulation)" }
)

Write-Host "Installing ThinCab Windows thin-client & arcade stack..." -ForegroundColor Cyan

foreach ($pkg in $packages) {
    Write-Host "-> $($pkg.Name) [$($pkg.Id)]"
    winget install --id $pkg.Id --exact --accept-package-agreements --accept-source-agreements --silent
}

if ($WithDrivers) {
    $vendor = (Get-CimInstance -ClassName Win32_ComputerSystem).Manufacturer
    Write-Host "`nDetected hardware vendor: $vendor" -ForegroundColor Cyan

    if ($vendor -match "Dell") {
        winget install --id "Dell.CommandUpdate" --exact --accept-package-agreements --accept-source-agreements --silent
        Write-Host "Installed Dell Command | Update. Run it once for BIOS/chipset/QuickSync drivers, then disable auto-run." -ForegroundColor Yellow
    }
    elseif ($vendor -match "Lenovo") {
        winget install --id "Lenovo.SystemUpdate" --exact --accept-package-agreements --accept-source-agreements --silent
        Write-Host "Installed Lenovo System Update. Run it once for BIOS/chipset/QuickSync drivers." -ForegroundColor Yellow
    }
    elseif ($vendor -match "HP|Hewlett") {
        Write-Host "For HP EliteDesk/ProDesk, use Windows Update Optional Driver Updates or HP Image Assistant (no bloated Support Assistant needed)." -ForegroundColor Yellow
    }
    else {
        Write-Host "Generic/custom hardware detected—use Windows Update (including Optional Driver Updates) for Intel iGPU/NIC drivers." -ForegroundColor Yellow
    }
}

Write-Host "`nNote: GP2040-CE in XInput mode uses Windows 11's built-in Xbox 360 controller driver (no extra driver needed)." -ForegroundColor DarkGray

Write-Host "`nDone! Next steps:" -ForegroundColor Green
Write-Host "  1. Run .\harden-kiosk.ps1 as Administrator."
Write-Host "  2. Open Playnite -> Settings -> General -> Start in Fullscreen Mode + Launch when Windows starts."
Write-Host "  3. Add Windows App (AVD) and Moonlight as Playnite entries so they launch from the joystick."
