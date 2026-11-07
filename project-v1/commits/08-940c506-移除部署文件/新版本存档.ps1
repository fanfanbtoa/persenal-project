param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Description
)
$ErrorActionPreference = 'Stop'
$c = 'C:\Users\FBT2005\Desktop\我的项目'
Set-Location $c

git add project-v1
if (-not (git diff --cached --quiet)) { git commit -m $Description }
$hash = git rev-parse --short HEAD
$dirs = Get-ChildItem -Directory 'project-v1\commits' | Where-Object { $_.Name -match '^\d{2}-' } | Sort-Object Name
$last = if ($dirs) { [int]($dirs[-1].Name.Substring(0, 2)) } else { 0 }
$next = '{0:D2}' -f ($last + 1)
$slug = ($Description -replace '[\\/:*?"<>|\s]', '')
if ($slug.Length -gt 24) { $slug = $slug.Substring(0, 24) }
$folder = "project-v1\commits\$next-$hash-$slug"
Remove-Item -Recurse -Force $folder -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $folder | Out-Null
$zip = Join-Path $env:TEMP "$hash.zip"
Remove-Item $zip -Force -ErrorAction SilentlyContinue
$ref = $hash + ':project-v1'
git archive --format=zip --output=$zip $ref
Expand-Archive -Path $zip -DestinationPath $folder -Force
Remove-Item $zip -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force (Join-Path $folder 'commits') -ErrorAction SilentlyContinue
$nl = [Environment]::NewLine
$stat = git show --stat --format='%h|%ad|%s' --date=format:'%Y-%m-%d %H:%M' $hash
$note = @('# 本次提交说明', '', "- 提交：$hash", "- 时间：$(Get-Date -Format 'yyyy-MM-dd HH:mm')", "- 原始提交信息：$Description", '', '## 本次提交涉及的文件', '', $stat, '', '> 这个文件夹是该提交时 project-v1 的完整代码快照，可直接打开 index.html 查看。') -join $nl
Set-Content -Path (Join-Path $folder '说明.md') -Value $note -Encoding UTF8
$tick = [char]96
$readmePath = 'project-v1\commits\README.md'
$readme = Get-Content $readmePath -Raw -Encoding UTF8
$row = "| $([int]$next) | $tick$hash$tick | $(Get-Date -Format 'yyyy-MM-dd HH:mm') | $Description | [$next-$hash-$slug](./$next-$hash-$slug/) |"
$readme = $readme -replace '(?m)(\| \d+ \| ' + $tick + '[^' + $tick + ']+' + $tick + '.*\n)(?!\|)', ('$1' + $row + $nl)
$readme = $readme -replace '(?m)- 当前最新提交：' + $tick + '[^' + $tick + ']+' + $tick + '（快照在 ' + $tick + '[^' + $tick + ']+/' + $tick + '）', ("- 当前最新提交：" + $tick + $hash + $tick + '（快照在 ' + $tick + "$next-$hash-$slug/" + $tick + '）')
Set-Content -Path $readmePath -Value $readme -Encoding UTF8
git add project-v1/commits
git commit -m "添加 $hash $Description 快照"
git push e main
git push origin main
Write-Host "完成：$folder"