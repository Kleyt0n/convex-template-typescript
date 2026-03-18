# Setup Scripts

One-command setup for the Web Project Page. **No need to clone the repo first** — the scripts handle everything: installing prerequisites, cloning the repo, installing dependencies, and creating your `.env` file.

## macOS

```bash
curl -fsSL https://raw.githubusercontent.com/Kleyt0n/convex-template-typescript/main/scripts/install-mac.sh | bash
```

## Linux

```bash
curl -fsSL https://raw.githubusercontent.com/Kleyt0n/convex-template-typescript/main/scripts/install-linux.sh | bash
```

Supports apt (Debian/Ubuntu), dnf (Fedora), pacman (Arch), and zypper (openSUSE).

## Windows

Run in PowerShell **as Administrator**:

```powershell
irm https://raw.githubusercontent.com/Kleyt0n/convex-template-typescript/main/scripts/install-windows.ps1 | iex
```

Requires [winget](https://aka.ms/getwinget) (default on Windows 11) or [Chocolatey](https://chocolatey.org/install).

## Alternative: copy-paste the script

If you prefer not to pipe to shell, you can download and run the script manually:

**macOS / Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/Kleyt0n/convex-template-typescript/main/scripts/install-mac.sh -o install.sh
bash install.sh
```

**Windows (PowerShell as Administrator):**
```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/Kleyt0n/convex-template-typescript/main/scripts/install-windows.ps1 -OutFile install.ps1
powershell -ExecutionPolicy Bypass -File install.ps1
```

## What gets installed

- **Git** (if missing)
- **Node.js** v18+ (if missing or outdated)
- **pnpm** (package manager)
- Project dependencies via `pnpm install`

## After setup

The scripts create a `.env` file from `.env.example`. Fill in your keys:

```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CONVEX_DEPLOYMENT=dev:...
VITE_CONVEX_URL=https://...convex.cloud
```

Then start developing:

```bash
cd convex-template-typescript
pnpm dev
```
