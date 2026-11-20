# ThinCab — Send Wake-on-LAN Magic Packet (Windows)
# Usage: .\wol-host.ps1 -MacAddress "AA:BB:CC:DD:EE:FF"

param(
    [Parameter(Mandatory = $true)]
    [string]$MacAddress
)

$cleanMac = $MacAddress -replace '[:\-]', ''
if ($cleanMac.Length -ne 12) {
    throw "Invalid MAC address: $MacAddress"
}

$macBytes = 0..5 | ForEach-Object { [Convert]::ToByte($cleanMac.Substring($_ * 2, 2), 16) }
$packet = ([byte[]](@(0xFF) * 6)) + ($macBytes * 16)

$udp = New-Object System.Net.Sockets.UdpClient
$udp.Connect([System.Net.IPAddress]::Broadcast, 9)
[void]$udp.Send($packet, $packet.Length)
$udp.Close()

Write-Host "Sent Wake-on-LAN packet to $MacAddress" -ForegroundColor Green
