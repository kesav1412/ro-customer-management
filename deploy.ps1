# PowerShell Deployment Script for Windows
# Production Deployment Script for RO Customer Management

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Production Deployment..." -ForegroundColor Cyan

# Configuration
$PROJECT_NAME = "ro-customer-management"
$BUILD_DIR = "dist"
$BACKUP_DIR = "backups"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"

# Functions
function Write-Success {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "ℹ $Message" -ForegroundColor Yellow
}

# Check if running in project directory
if (-not (Test-Path "package.json")) {
    Write-Error-Custom "package.json not found. Please run this script from the project root."
    exit 1
}

# Step 1: Check Node.js version
Write-Info "Checking Node.js version..."
$NODE_VERSION = node -v
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Node.js is not installed or not in PATH."
    exit 1
}
Write-Success "Node.js version: $NODE_VERSION"

# Step 2: Check environment file
if (-not (Test-Path ".env.production")) {
    Write-Error-Custom ".env.production file not found. Please create it from .env.example"
    exit 1
}
Write-Success "Environment file found"

# Step 3: Install dependencies
Write-Info "Installing dependencies..."
npm ci --prefer-offline
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Failed to install dependencies"
    exit 1
}
Write-Success "Dependencies installed"

# Step 4: Run type checking
Write-Info "Running TypeScript type check..."
npm run typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Type check failed. Please fix errors before deploying."
    exit 1
}
Write-Success "Type check passed"

# Step 5: Run linting
Write-Info "Running ESLint..."
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Linting failed. Running auto-fix..."
    npm run lint:fix
}
Write-Success "Linting passed"

# Step 6: Create backup of existing build
if (Test-Path $BUILD_DIR) {
    Write-Info "Creating backup of existing build..."
    if (-not (Test-Path $BACKUP_DIR)) {
        New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
    }
    $backupFile = "$BACKUP_DIR\dist_backup_$TIMESTAMP.zip"
    Compress-Archive -Path $BUILD_DIR -DestinationPath $backupFile -Force
    Write-Success "Backup created: $backupFile"
}

# Step 7: Clean previous build
Write-Info "Cleaning previous build..."
npm run clean
Write-Success "Clean complete"

# Step 8: Build for production
Write-Info "Building for production..."
npm run build:prod
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Production build failed."
    exit 1
}
Write-Success "Production build complete"

# Step 9: Verify build output
if (-not (Test-Path $BUILD_DIR)) {
    Write-Error-Custom "Build directory not found. Build may have failed."
    exit 1
}

if (-not (Test-Path "$BUILD_DIR\index.html")) {
    Write-Error-Custom "index.html not found in build directory."
    exit 1
}

Write-Success "Build verification passed"

# Step 10: Display build size
$buildSize = (Get-ChildItem $BUILD_DIR -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Info "Build size: $([math]::Round($buildSize, 2)) MB"

# Step 11: List build files
Write-Info "Build contents:"
Get-ChildItem $BUILD_DIR -Recurse | Where-Object { -not $_.PSIsContainer } | 
    Select-Object Name, @{Name="Size (KB)";Expression={[math]::Round($_.Length/1KB, 2)}}, LastWriteTime |
    Format-Table -AutoSize

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✓ Build completed successfully!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test the build locally: npm run preview" -ForegroundColor White
Write-Host "  2. Deploy using Docker: docker-compose up -d --build" -ForegroundColor White
Write-Host "  3. Or copy the '$BUILD_DIR' folder to your web server" -ForegroundColor White
Write-Host ""
