# 🚀 EDDA - Midnight Starter Template
This project is built on the Midnight Network.
- A starter template for building on Midnight Network with React frontend and smart contract integration.
- **[Live Demo → counter.nebula.builders](https://counter.nebula.builders)**

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v22+) & [npm](https://www.npmjs.com/) (v11+)
- [Docker](https://docs.docker.com/get-docker/)
- [Git LFS](https://git-lfs.com/) (for large files)
- [Compact](https://docs.midnight.network/relnotes/compact-tools) (Midnight developer tools)
- [Lace](https://chromewebstore.google.com/detail/hgeekaiplokcnmakghbdfbgnlfheichg?utm_source=item-share-cb) (Browser wallet extension)
- [Faucet](https://faucet.preview.midnight.network/) (Preview Network Faucet)

## Known Issues

- N/A

## 🛠️ Setup

### 1️⃣ Install Git LFS

```bash
# Install and initialize Git LFS
sudo dnf install git-lfs  # For Fedora/RHEL
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

### 3️⃣ Install Node.js and docker
- [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/)
- [Docker](https://docs.docker.com/get-docker/)

### 4️⃣ Verify Installation
```bash
# Check versions
node -v  
npm -v   
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
   # In one terminal (from project root)
   npm install
   npm run build
   ```

### Setup Env variables

1. **Create .env file from template under counter-cli folder**
   - [`counter-cli/.env_template`](./counter-cli/.env_template)

2. **Create .env file from template under frontend-vite-react folder**
   - [`frontend-vite-react/.env_template`](./frontend-vite-react/.env_template)
   

### Start Development In Preview-Preprod-Mainnet Network or
   ```bash   
   # In one terminal (from project root)
   npm run dev:frontend
   ```

### Start Development In Undeployed Network
   ```bash   
   # In one terminal (from project root)
   npm run setup-standalone
   
   # In another terminal (from project root)
   npm run dev:frontend
   ```
---

<div align="center"><p>Built with ❤️ by <a href="https://eddalabs.io">Edda Labs</a></p></div>

