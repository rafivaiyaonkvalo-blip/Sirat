Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\Abdul Hakim\.gemini\antigravity\scratch\uls-arabic\public\arbigo_selected_logo.jpg"
$destDir = "c:\Users\Abdul Hakim\.gemini\antigravity\scratch\uls-arabic\public"

$img = [System.Drawing.Image]::FromFile($srcPath)

function Resize-Image($source, $width, $height, $targetPath) {
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($source, 0, 0, $width, $height)
    $g.Dispose()
    $bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated $targetPath ($($width)x$($height))"
}

Resize-Image $img 512 512 "$destDir\logo-512.png"
Resize-Image $img 192 192 "$destDir\logo-192.png"
Resize-Image $img 512 512 "$destDir\playstore-icon.png"
Resize-Image $img 64 64 "$destDir\favicon.png"
Resize-Image $img 512 512 "$destDir\logo.png"

$img.Dispose()
Copy-Item $srcPath -Destination "$destDir\logo.jpg" -Force
Write-Host "All icons generated successfully!"
