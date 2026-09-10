Add-Type -AssemblyName System.Drawing

$iconsDir = "c:\Users\Ayush yadav\OneDrive\Desktop\CAREERis\public\icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
}

$srcPath = "C:\Users\Ayush yadav\.gemini\antigravity-ide\brain\fe02fc56-8f28-4c1a-abce-86f1bf039365\careeris_app_icon_1788997645189.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)

foreach ($size in @(72, 96, 128, 144, 152, 192, 384, 512)) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $size, $size)
    $outPath = Join-Path $iconsDir "icon-$size.png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created $outPath"
}

# Also create apple-touch-icon.png in public root
$appleBmp = New-Object System.Drawing.Bitmap 180, 180
$appleG = [System.Drawing.Graphics]::FromImage($appleBmp)
$appleG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$appleG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$appleG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$appleG.DrawImage($img, 0, 0, 180, 180)
$applePath = "c:\Users\Ayush yadav\OneDrive\Desktop\CAREERis\public\apple-touch-icon.png"
$appleBmp.Save($applePath, [System.Drawing.Imaging.ImageFormat]::Png)
$appleG.Dispose()
$appleBmp.Dispose()
Write-Host "Created $applePath"

# Also create favicon-32x32.png
$favBmp = New-Object System.Drawing.Bitmap 32, 32
$favG = [System.Drawing.Graphics]::FromImage($favBmp)
$favG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$favG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$favG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$favG.DrawImage($img, 0, 0, 32, 32)
$favPath = "c:\Users\Ayush yadav\OneDrive\Desktop\CAREERis\public\favicon.png"
$favBmp.Save($favPath, [System.Drawing.Imaging.ImageFormat]::Png)
$favG.Dispose()
$favBmp.Dispose()
Write-Host "Created $favPath"

$img.Dispose()
Write-Host "All icons generated successfully!"
