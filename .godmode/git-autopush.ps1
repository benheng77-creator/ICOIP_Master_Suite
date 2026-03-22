Set-Location "C:\Users\jvben\Desktop\PROJECTS\icoip-master-suite"

git config pull.rebase true | Out-Null
git config rebase.autoStash true | Out-Null

while ($true) {
    try {
        git rev-parse --is-inside-work-tree *> $null
        if ($LASTEXITCODE -eq 0) {
            $dirty = git status --porcelain
            if ($dirty) {
                git add -A
                git diff --cached --quiet
                if ($LASTEXITCODE -ne 0) {
                    $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                    git commit -m "auto: sync $stamp" *> $null
                    git pull --rebase --autostash *> $null
                    git push origin HEAD *> $null
                }
            }
        }
    } catch {}
    Start-Sleep -Seconds 120
}
