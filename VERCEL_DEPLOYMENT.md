# Vercel Deployment Guide

## Overview

This project requires a specific build process to ensure the Midnight contract verifier keys are properly generated and copied before deploying the frontend.

## Configuration

The `vercel.json` file in the root directory configures Vercel to:

1. Use the `build-production` command which:
   - First builds the counter-contract (generates/copies keys)
   - Then builds the frontend-vite-react (copies keys from contract to public directory)
2. Set the output directory to `frontend-vite-react/dist`

## Build Process Flow

```bash
# Step 1: Build the contract
cd counter-contract && npm run build

# This copies the managed files (including verifier keys) from:
# counter-contract/src/managed/counter/keys/*
# to:
# counter-contract/dist/managed/counter/keys/*

# Step 2: Build the frontend
cd frontend-vite-react && npm run build

# This first runs copy-contract-keys which copies:
# ../counter-contract/src/managed/counter/keys/* -> ./public/midnight/counter/keys/
# ../counter-contract/src/managed/counter/zkir/* -> ./public/midnight/counter/zkir/

# Then runs vite build
```

## Environment Variables

Make sure these environment variables are set in your Vercel project:

- `VITE_CONTRACT_ADDRESS` - Your deployed contract address

## Troubleshooting

### Error: "operations are undefined or have mismatched verifier keys"

This error occurs when the verifier keys are not properly loaded. Common causes:

1. **Build command incorrect**: Ensure Vercel is using the `build-production` command (check `vercel.json`)
2. **Keys not copied**: The `copy-contract-keys` script must run before `vite build`
3. **Keys not committed**: The keys in `counter-contract/src/managed/counter/keys/` must be committed to git
4. **Contract address mismatch**: Ensure `VITE_CONTRACT_ADDRESS` matches your deployed contract

### Verify Keys Are Present

The following files must exist in the build output:

```
frontend-vite-react/dist/midnight/counter/keys/increment.prover
frontend-vite-react/dist/midnight/counter/keys/increment.verifier
frontend-vite-react/dist/midnight/counter/zkir/increment.bzkir
frontend-vite-react/dist/midnight/counter/zkir/increment.zkir
```

## Manual Build Test

To test the build locally before deploying:

```bash
# Clean previous builds
rm -rf frontend-vite-react/dist
rm -rf counter-contract/dist

# Run production build
npm run build-production

# Check that keys were copied
ls -la frontend-vite-react/dist/midnight/counter/keys/
```

## Vercel Project Settings

In your Vercel project settings:

- **Build Command**: Should be automatically picked up from `vercel.json`
- **Output Directory**: Should be `frontend-vite-react/dist` (from `vercel.json`)
- **Install Command**: Should be `npm install` (from `vercel.json`)
- **Framework Preset**: None (we're using custom configuration)
