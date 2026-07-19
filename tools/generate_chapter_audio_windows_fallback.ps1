[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Book,
    [Parameter(Mandatory = $true)]
    [string]$OutputDir,
    [string]$Voice = "Microsoft David Desktop",
    [ValidateRange(-10, 10)]
    [int]$Rate = -1,
    [ValidateRange(0.75, 1.0)]
    [double]$Pitch = 0.93,
    [string]$Ffmpeg = "C:\ffmpeg\bin\ffmpeg.exe"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Get-SpokenText {
    param([string]$Text)
    $value = $Text -replace "`r?`n", " "
    $replacements = [ordered]@{
        "Nihon Shoki" = "Nee-hone Show-key"
        "Kojiki" = "Ko-jee-kee"
        "Kyushu" = "Cue-shoo"
        "Honshu" = "Hone-shoo"
        "Shikoku" = "Shee-koh-koo"
        "Hokkaido" = "Hoke-eye-doh"
        "Himiko" = "Hee-mee-koh"
        "Yamatai" = "Yah-mah-tie"
        "Yamato" = "Yah-mah-toh"
        "Jomon" = "Joe-moan"
        "Yayoi" = "Yah-yoh-ee"
        "dotaku" = "doh-tah-koo"
        "dogu" = "doh-goo"
        "ca." = "circa"
        "BC" = "B C"
        "AD" = "A D"
    }
    foreach ($pair in $replacements.GetEnumerator()) {
        $value = $value.Replace($pair.Key, $pair.Value)
    }
    return ($value -replace "\s+", " ").Trim()
}

if (-not (Test-Path -LiteralPath $Book -PathType Leaf)) {
    throw "Book data was not found: $Book"
}
if (-not (Test-Path -LiteralPath $Ffmpeg -PathType Leaf)) {
    throw "FFmpeg was not found: $Ffmpeg"
}

Add-Type -AssemblyName System.Speech
$payload = Get-Content -LiteralPath $Book -Raw -Encoding UTF8 | ConvertFrom-Json
$paragraphs = @($payload.sections | ForEach-Object { $_.paragraphs })
if ($paragraphs.Count -eq 0) {
    throw "No paragraphs found in $Book"
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("ancient-japan-audio-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer

try {
    $speaker.SelectVoice($Voice)
    $speaker.Rate = $Rate
    $speaker.Volume = 100
    for ($index = 0; $index -lt $paragraphs.Count; $index++) {
        $paragraph = $paragraphs[$index]
        $name = "$($paragraph.id).mp3"
        $destination = Join-Path $OutputDir $name
        if (Test-Path -LiteralPath $destination -PathType Leaf) {
            Write-Output "[$($index + 1)/$($paragraphs.Count)] existing $name"
            continue
        }
        $wave = Join-Path $tempDir "$($paragraph.id).wav"
        $speaker.SetOutputToWaveFile($wave)
        $speaker.Speak((Get-SpokenText -Text ([string]$paragraph.text)))
        $speaker.SetOutputToNull()
        $pitchValue = $Pitch.ToString([System.Globalization.CultureInfo]::InvariantCulture)
        & $Ffmpeg -hide_banner -loglevel error -y -i $wave -af "rubberband=pitch=${pitchValue}:formant=preserved,loudnorm=I=-19:TP=-1.5:LRA=7" -ar 24000 -ac 1 -c:a libmp3lame -b:a 64k $destination
        if ($LASTEXITCODE -ne 0) {
            throw "Audio encoding failed: $name"
        }
        Remove-Item -LiteralPath $wave -Force
        Write-Output "[$($index + 1)/$($paragraphs.Count)] wrote $name"
    }
}
finally {
    $speaker.Dispose()
    if (Test-Path -LiteralPath $tempDir) {
        Remove-Item -LiteralPath $tempDir -Recurse -Force
    }
}
