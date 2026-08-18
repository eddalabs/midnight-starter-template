# 🚀 EDDA - Midnight Starter Template
This project is built on the Midnight Network.
- A starter template for building on Midnight Network with React frontend and smart contract integration.
- **Superseded by [modular-starter](https://github.com/eddalabs/modular-starter)**, the starter we now point people at: one modular Compact contract, a Node SDK, and tests that run real transactions against a dockerized network. Live at [template.preview.eddalabs.io](https://template.preview.eddalabs.io). This repository stays up for anyone arriving from an older link.

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v22+) & [pnpm](https://pnpm.io/) (v10+)
- [Docker](https://docs.docker.com/get-docker/)
- [Git LFS](https://git-lfs.com/) (for large files)
- [Compact](https://docs.midnight.network/relnotes/compact-tools) (Midnight developer tools)
- [Lace](https://chromewebstore.google.com/detail/hgeekaiplokcnmakghbdfbgnlfheichg?utm_source=item-share-cb) (Browser wallet extension)
- [Faucet](https://faucet.preview.midnight.network/) (Preview Network Faucet)

## 🛠️ Setup

### 1️⃣ Install Git LFS

```bash
# macOS
brew install git-lfs

# Debian/Ubuntu
sudo apt install git-lfs

# Fedora/RHEL
sudo dnf install git-lfs

# Initialize Git LFS (run once per machine)
git lfs install
```

### 2️⃣ Install Compact Tools

```bash
# Install the latest Compact tools
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
```
```bash
# Install the latest compiler 
compact update +0.30.0
```

### 3️⃣ Install Node.js, pnpm and Docker
- [Node.js](https://nodejs.org/) (v22+)
- [pnpm](https://pnpm.io/installation) (v10+)
- [Docker](https://docs.docker.com/get-docker/)

### 4️⃣ Verify Installation
```bash
# Check versions
node -v
pnpm -v
docker -v
git lfs version
compact check  # Should show latest version
```

## 📁 Project Structure

```
├── counter-cli/         # CLI tools
├── counter-contract/    # Smart contracts
└── frontend-vite-react/ # React application
```

## 🔗 Setup Instructions

### Install Project Dependencies and compile contracts
  ```bash
   # From project root
   pnpm install
   pnpm build
   ```

### Setup Env variables

1. **Create .env file from template under counter-cli folder**
   - [`counter-cli/.env_template`](./counter-cli/.env_template)

2. **Create .env file from template under frontend-vite-react folder**
   - [`frontend-vite-react/.env_template`](./frontend-vite-react/.env_template)


### Start Development on Preview / Preprod / Mainnet
   ```bash
   # From project root
   pnpm dev:frontend
   ```

### Start Development on Undeployed (standalone) Network
   ```bash
   # In one terminal (from project root)
   pnpm setup-standalone

   # In another terminal (from project root)
   pnpm dev:frontend
   ```

## 🧪 Run Tests

Tests live in `counter-cli`. Run from the project root:

```bash
# Standalone (no live network required)
pnpm --filter @eddalabs/counter-cli test-undeployed

# Against the Preview testnet
pnpm --filter @eddalabs/counter-cli test-preview

# Against the Preprod network
pnpm --filter @eddalabs/counter-cli test-preprod
```

## 🤖 Claude Code Plugin (optional)

This repo ships with a project-level [`.claude/settings.json`](./.claude/settings.json) that registers the [`edda-labs-marketplace`](https://github.com/eddalabs/edda-marketplace) and enables the `midnight` plugin (Midnight-specific skills and helpers for Claude Code).

If you use [Claude Code](https://claude.com/claude-code), it will prompt you to trust these project settings the first time you open the repo. Accept the prompt and the plugin installs automatically — no manual marketplace setup needed. If you don't use Claude Code, this is a no-op.

## 📚 More Documentation

- [`DEPLOYMENT_PROCEDURE.md`](./DEPLOYMENT_PROCEDURE.md) — Vercel deployment guide (Git LFS, env vars, build settings).
- [`educational-material/`](./educational-material/) — Midnight Sessions video walkthroughs and content plans by Edda Labs.

---

<div align="center"><p>Built with ❤️ by <a href="https://eddalabs.io">Edda Labs</a></p></div>

