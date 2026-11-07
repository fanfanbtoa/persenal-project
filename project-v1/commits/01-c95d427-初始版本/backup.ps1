$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dest = Join-Path $root "backups"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$files = @(
  "index.html",
  "styles.css",
  "app.js",
  "server.mjs",
  "README.md",
  "bg-water.jpg",
  "favicon.svg",
  "preview-desktop.png",
  "preview-mobile.png",
  ".env",
  ".env.example",
  ".gitignore",
  "start-server.bat",
  "preview.bat"
) | ForEach-Object { Join-Path $root $_ } | Where-Object { Test-Path $_ }

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipPath = Join-Path $dest ("project-v1-" + $stamp + ".zip")

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, "Create")
try {
  foreach ($file in $files) {
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $zip, $file, [System.IO.Path]::GetFileName($file), [System.IO.Compression.CompressionLevel]::Optimal
    ) | Out-Null
  }
} finally {
  $zip.Dispose()
}

Write-Host ""
Write-Host ("备份完成：" + $zipPath)
Write-Host ("包含 " + $files.Count + " 个文件")
