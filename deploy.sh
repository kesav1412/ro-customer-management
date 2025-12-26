#!/bin/bash
# Bash Deployment Script for Linux/Mac
# Production Deployment Script for RO Customer Management

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ro-customer-management"
BUILD_DIR="dist"
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_header() {
    echo -e "${CYAN}$1${NC}"
}

# Check if running in project directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_header "🚀 Starting Production Deployment..."

# Step 1: Check Node.js version
print_info "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed."
    exit 1
fi
NODE_VERSION=$(node -v)
print_success "Node.js version: $NODE_VERSION"

# Step 2: Check environment file
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found. Please create it from .env.example"
    exit 1
fi
print_success "Environment file found"

# Step 3: Install dependencies
print_info "Installing dependencies..."
npm ci --prefer-offline
print_success "Dependencies installed"

# Step 4: Run type checking
print_info "Running TypeScript type check..."
npm run typecheck
print_success "Type check passed"

# Step 5: Run linting
print_info "Running ESLint..."
if ! npm run lint; then
    print_error "Linting failed. Running auto-fix..."
    npm run lint:fix
fi
print_success "Linting passed"

# Step 6: Create backup of existing build
if [ -d "$BUILD_DIR" ]; then
    print_info "Creating backup of existing build..."
    mkdir -p "$BACKUP_DIR"
    BACKUP_FILE="$BACKUP_DIR/dist_backup_$TIMESTAMP.tar.gz"
    tar -czf "$BACKUP_FILE" "$BUILD_DIR"
    print_success "Backup created: $BACKUP_FILE"
fi

# Step 7: Clean previous build
print_info "Cleaning previous build..."
npm run clean
print_success "Clean complete"

# Step 8: Build for production
print_info "Building for production..."
npm run build:prod
print_success "Production build complete"

# Step 9: Verify build output
if [ ! -d "$BUILD_DIR" ]; then
    print_error "Build directory not found. Build may have failed."
    exit 1
fi

if [ ! -f "$BUILD_DIR/index.html" ]; then
    print_error "index.html not found in build directory."
    exit 1
fi

print_success "Build verification passed"

# Step 10: Display build size
BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
print_info "Build size: $BUILD_SIZE"

# Step 11: List build files
print_info "Build contents:"
ls -lh "$BUILD_DIR"

echo ""
print_header "════════════════════════════════════════════════════════════════"
print_success "Build completed successfully!"
print_header "════════════════════════════════════════════════════════════════"
echo ""
print_info "Next steps:"
echo "  1. Test the build locally: npm run preview"
echo "  2. Deploy using Docker: docker-compose up -d --build"
echo "  3. Or copy the '$BUILD_DIR' folder to your web server"
echo ""
