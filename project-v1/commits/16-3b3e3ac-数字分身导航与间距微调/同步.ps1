param([string]$Description = "")
$ErrorActionPreference = 'Stop'
$c = 'C:\Users\FBT2005\Desktop\我的项目'
if (-not $Description) { $Description = Read-Host '这次改了什么' }
& (Join-Path $c 'project-v1\新版本存档.ps1') -Description $Description
Write-Output '同步到 E 盘...'
git -C $c push e main
Write-Output '同步到 GitHub...'
git -C $c -c http.proxy= -c https.proxy= -c http.postBuffer=524288000 -c http.version=HTTP/1.1 push origin main
Write-Output '同步完成。'
