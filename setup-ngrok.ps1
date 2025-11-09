# Download ngrok
Write-Host "Downloading ngrok..." -ForegroundColor Green
$ngrokUrl = "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip"
$ngrokZip = "ngrok.zip"
$ngrokExe = "ngrok.exe"

# Download ngrok
Invoke-WebRequest -Uri $ngrokUrl -OutFile $ngrokZip

# Extract ngrok
Write-Host "Extracting ngrok..." -ForegroundColor Green
Expand-Archive -Path $ngrokZip -DestinationPath . -Force

# Clean up zip file
Remove-Item $ngrokZip -Force

# Test ngrok
Write-Host "Testing ngrok..." -ForegroundColor Green
if (Test-Path $ngrokExe) {
    Write-Host "ngrok setup successful!" -ForegroundColor Green
    Write-Host "You can now run: .\ngrok.exe http 3000" -ForegroundColor Yellow
} else {
    Write-Host "ngrok setup failed!" -ForegroundColor Red
}
