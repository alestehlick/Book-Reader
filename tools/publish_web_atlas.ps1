[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[a-z0-9][a-z0-9-]*$')]
    [string]$Bucket,

    [string]$Prefix = 'ancient-japan',

    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$readerRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$atlasRoot = Join-Path $readerRoot 'docs\Ancient Japan History\maps\atlas'

if (-not (Test-Path -LiteralPath $atlasRoot -PathType Container)) {
    throw "Atlas output not found: $atlasRoot"
}

$resolvedAtlasRoot = (Resolve-Path -LiteralPath $atlasRoot).Path
if (-not $resolvedAtlasRoot.StartsWith($readerRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Unexpected atlas path: $resolvedAtlasRoot"
}

$files = @(
    Get-Item -LiteralPath (Join-Path $resolvedAtlasRoot 'ancient-japan-vector.pmtiles')
    Get-ChildItem -LiteralPath (Join-Path $resolvedAtlasRoot 'terrain') -Recurse -File -Filter '*.webp'
)

foreach ($file in $files) {
    $relative = $file.FullName.Substring($resolvedAtlasRoot.Length).TrimStart('\').Replace('\', '/')
    $objectKey = @($Prefix.Trim('/'), $relative) -join '/'
    $target = "$Bucket/$objectKey"
    if ($DryRun) {
        Write-Host "Would upload $relative -> $target"
        continue
    }
    if ($PSCmdlet.ShouldProcess($target, 'Upload atlas object')) {
        & npx --yes wrangler r2 object put $target --file $file.FullName --remote
        if ($LASTEXITCODE -ne 0) {
            throw "Wrangler failed while uploading $relative"
        }
    }
}

Write-Host "Atlas upload set: $($files.Count) files"
