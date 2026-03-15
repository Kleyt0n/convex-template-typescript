# Research Project Page - Windows Setup Script
# Run this in PowerShell as Administrator

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoUrl = "https://github.com/Kleyt0n/convex-template-typescript.git"
$RepoDir = "research-project-page"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Windows Setup Script" -ForegroundColor Cyan
Write-Host "  Research Project Page" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Test-CommandExists {
    param([string]$Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

function Write-Status {
    param([string]$Status, [string]$Message)
    switch ($Status) {
        "OK"      { Write-Host "[OK] " -ForegroundColor Green -NoNewline; Write-Host $Message }
        "MISSING" { Write-Host "[MISSING] " -ForegroundColor Yellow -NoNewline; Write-Host $Message }
        "ERROR"   { Write-Host "[ERROR] " -ForegroundColor Red -NoNewline; Write-Host $Message }
        "INFO"    { Write-Host "[INFO] " -ForegroundColor Cyan -NoNewline; Write-Host $Message }
    }
}

function Refresh-Path {
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
}

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Status "ERROR" "This script must be run as Administrator."
    Write-Host "Right-click PowerShell and select 'Run as Administrator', then try again."
    exit 1
}

# Detect package manager
$pkgManager = $null
if (Test-CommandExists "winget") {
    $pkgManager = "winget"
} elseif (Test-CommandExists "choco") {
    $pkgManager = "choco"
}

if (-not $pkgManager) {
    Write-Status "ERROR" "Neither winget nor chocolatey found."
    Write-Host "Please install one of the following:"
    Write-Host "  - winget: comes with App Installer from Microsoft Store"
    Write-Host "  - choco:  https://chocolatey.org/install"
    exit 1
}
Write-Status "OK" "Package manager: $pkgManager"
Write-Host ""

function Install-WithPkgManager {
    param([string]$WingetId, [string]$ChocoId)
    if ($pkgManager -eq "winget") {
        winget install --id $WingetId --accept-source-agreements --accept-package-agreements
    } else {
        choco install $ChocoId -y
    }
    Refresh-Path
}

# 1. Git
Write-Host "--- Checking Git ---"
if (Test-CommandExists "git") {
    Write-Status "OK" "Git is installed"
    Write-Host "  Version: $(git --version)"
} else {
    Write-Status "MISSING" "Git is not installed. Installing..."
    Install-WithPkgManager "Git.Git" "git"
    Write-Status "OK" "Git installed."
}
Write-Host ""

# 2. Node.js
Write-Host "--- Checking Node.js ---"
$needNode = $false
if (Test-CommandExists "node") {
    $nodeVersion = (node -v) -replace 'v', '' -split '\.' | Select-Object -First 1
    if ([int]$nodeVersion -lt 18) {
        Write-Status "MISSING" "Node.js version is below 18. Will install a newer version."
        $needNode = $true
    } else {
        Write-Status "OK" "Node.js is installed"
        Write-Host "  Version: $(node -v)"
    }
} else {
    $needNode = $true
}

if ($needNode) {
    Write-Host "Installing Node.js..."
    Install-WithPkgManager "OpenJS.NodeJS" "nodejs"
    Write-Status "OK" "Node.js installed: $(node -v)"
}
Write-Host ""

# 3. pnpm
Write-Host "--- Checking pnpm ---"
if (Test-CommandExists "pnpm") {
    Write-Status "OK" "pnpm is installed"
    Write-Host "  Version: $(pnpm -v)"
} else {
    Write-Host "Installing pnpm..."
    try {
        corepack enable
        corepack prepare pnpm@latest --activate
    } catch {
        npm install -g pnpm
    }
    Refresh-Path
    Write-Status "OK" "pnpm installed: $(pnpm -v)"
}
Write-Host ""

# 4. Clone the repository
Write-Host "--- Cloning repository ---"
if (Test-Path $RepoDir) {
    Write-Status "INFO" "Directory '$RepoDir' already exists. Skipping clone."
} else {
    git clone $RepoUrl
    Write-Status "OK" "Repository cloned."
}
Push-Location $RepoDir
Write-Host ""

# 5. Install project dependencies
Write-Host "--- Installing project dependencies ---"
pnpm install
Write-Status "OK" "Project dependencies installed."
Write-Host ""

# 6. Environment setup
Write-Host "--- Environment Setup ---"
if ((Test-Path ".env.example") -and (-not (Test-Path ".env"))) {
    Copy-Item ".env.example" ".env"
    Write-Status "OK" "Created .env from .env.example."
} elseif (Test-Path ".env") {
    Write-Status "OK" ".env file already exists."
} else {
    Write-Status "MISSING" "No .env.example found. You will need to create .env manually."
}

Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "  Next steps:"
Write-Host "    1. cd $RepoDir"
Write-Host "    2. Fill in your .env file with:"
Write-Host "       CLERK_PUBLISHABLE_KEY=pk_test_..."
Write-Host "       CLERK_SECRET_KEY=sk_test_..."
Write-Host "       CONVEX_DEPLOYMENT=dev:..."
Write-Host "       VITE_CONVEX_URL=https://...convex.cloud"
Write-Host "    3. pnpm dev"
Write-Host "========================================" -ForegroundColor Cyan
