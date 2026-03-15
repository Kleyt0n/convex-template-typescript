#!/bin/bash
set -e

REPO_URL="https://github.com/Kleyt0n/convex-template-typescript.git"
REPO_DIR="research-project-page"

echo "========================================"
echo "  macOS Setup Script"
echo "  Research Project Page"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_command() {
  if command -v "$1" &>/dev/null; then
    echo -e "${GREEN}[OK]${NC} $1 is already installed ($(command -v "$1"))"
    return 0
  else
    echo -e "${YELLOW}[MISSING]${NC} $1 is not installed"
    return 1
  fi
}

# 1. Homebrew
echo "--- Checking Homebrew ---"
if ! check_command brew; then
  echo "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Add Homebrew to PATH for Apple Silicon Macs
  if [ -f /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
  echo -e "${GREEN}Homebrew installed.${NC}"
fi
echo ""

# 2. Git
echo "--- Checking Git ---"
if ! check_command git; then
  echo "Installing Git via Homebrew..."
  brew install git
  echo -e "${GREEN}Git installed.${NC}"
else
  echo "  Version: $(git --version)"
fi
echo ""

# 3. Node.js
echo "--- Checking Node.js ---"
if check_command node; then
  NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}Node.js version is below 18. Upgrading...${NC}"
    brew install node
  else
    echo "  Version: $(node -v)"
  fi
else
  echo "Installing Node.js via Homebrew..."
  brew install node
  echo -e "${GREEN}Node.js installed: $(node -v)${NC}"
fi
echo ""

# 4. pnpm
echo "--- Checking pnpm ---"
if ! check_command pnpm; then
  echo "Installing pnpm..."
  corepack enable 2>/dev/null || true
  corepack prepare pnpm@latest --activate 2>/dev/null || npm install -g pnpm
  echo -e "${GREEN}pnpm installed: $(pnpm -v)${NC}"
else
  echo "  Version: $(pnpm -v)"
fi
echo ""

# 5. Clone the repository
echo "--- Cloning repository ---"
if [ -d "$REPO_DIR" ]; then
  echo -e "${YELLOW}Directory '$REPO_DIR' already exists. Skipping clone.${NC}"
else
  git clone "$REPO_URL"
  echo -e "${GREEN}Repository cloned.${NC}"
fi
cd "$REPO_DIR"
echo ""

# 6. Install project dependencies
echo "--- Installing project dependencies ---"
pnpm install
echo -e "${GREEN}Project dependencies installed.${NC}"
echo ""

# 7. Environment setup
echo "--- Environment Setup ---"
if [ -f ".env.example" ] && [ ! -f ".env" ]; then
  cp .env.example .env
  echo -e "${GREEN}Created .env from .env.example.${NC}"
elif [ -f ".env" ]; then
  echo -e "${GREEN}.env file already exists.${NC}"
else
  echo -e "${YELLOW}No .env.example found. You will need to create .env manually.${NC}"
fi

echo ""
echo "========================================"
echo -e "${GREEN}  Setup complete!${NC}"
echo ""
echo "  Next steps:"
echo "    1. cd $REPO_DIR"
echo "    2. Fill in your .env file with:"
echo "       CLERK_PUBLISHABLE_KEY=pk_test_..."
echo "       CLERK_SECRET_KEY=sk_test_..."
echo "       CONVEX_DEPLOYMENT=dev:..."
echo "       VITE_CONVEX_URL=https://...convex.cloud"
echo "    3. pnpm dev"
echo "========================================"
