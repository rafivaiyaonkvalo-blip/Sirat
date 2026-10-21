Add-Type -AssemblyName System.Drawing

$width = 1024
$height = 500
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# 1. Emerald Dark Gradient Background
$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$c1 = [System.Drawing.Color]::FromArgb(255, 6, 78, 59)    # #064e3b
$c2 = [System.Drawing.Color]::FromArgb(255, 2, 44, 34)    # #022c22
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45)
$g.FillRectangle($brush, $rect)

# 2. Draw subtle glowing circle accents in background
$accentColor = [System.Drawing.Color]::FromArgb(35, 16, 185, 129)
$accentBrush = New-Object System.Drawing.SolidBrush($accentColor)
$g.FillEllipse($accentBrush, 750, -50, 400, 400)
$g.FillEllipse($accentBrush, -100, 200, 450, 450)

# 3. Load & Draw Logo
$logoPath = "c:\Users\Abdul Hakim\.gemini\antigravity\scratch\uls-arabic\public\arbigo_selected_logo.jpg"
if (Test-Path $logoPath) {
    $logo = [System.Drawing.Image]::FromFile($logoPath)
    $logoSize = 360
    $logoX = 60
    $logoY = [int](($height - $logoSize) / 2)
    
    # Draw rounded clip / frame for logo
    $logoRect = New-Object System.Drawing.Rectangle($logoX, $logoY, $logoSize, $logoSize)
    $g.DrawImage($logo, $logoRect)
    $logo.Dispose()
    
    # Gold border around logo
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 52, 211, 153), 4)
    $g.DrawRectangle($borderPen, $logoRect)
    $borderPen.Dispose()
}

# 4. Text Content
$fontTitle = New-Object System.Drawing.Font("Arial", 42, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
$fontTag = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Regular)
$fontBadge = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)

$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushEmerald = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 52, 211, 153))
$brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 209, 250, 229))

$textX = 470
# Badge
$g.DrawString("MARKAZUL IMAN PRESENTS", $fontBadge, $brushGold, $textX, 85)

# App Title
$g.DrawString("ArbiGo", $fontTitle, $brushWhite, $textX, 120)
$g.DrawString("Eso Arbi Shikhi & At-Tamrin", $fontSub, $brushEmerald, $textX, 195)

# Feature Highlights
$g.DrawString("* 70 Complete Lessons & Exercises", $fontTag, $brushMuted, $textX, 260)
$g.DrawString("* 1,343 Vocabulary with Harakat Audio", $fontTag, $brushMuted, $textX, 295)
$g.DrawString("* Interactive Quizzes & Exams", $fontTag, $brushMuted, $textX, 330)
$g.DrawString("* 100% Free & Works Offline", $fontTag, $brushGold, $textX, 365)

# Clean up
$g.Dispose()
$outputPath = "c:\Users\Abdul Hakim\.gemini\antigravity\scratch\uls-arabic\public\feature-graphic.png"
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Feature Graphic (1024x500) successfully created at: $outputPath"
