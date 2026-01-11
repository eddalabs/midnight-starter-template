# Deployment Procedure for Vercel

## Prerequisites

- GitHub repository connected to Vercel
- Midnight contract deployed and contract address available
- Vercel account with project created

## One-Time Setup in Vercel

### 1. Enable Git LFS (CRITICAL)
This project uses Git LFS for contract keys. You MUST enable this:

1. Go to **[Vercel Dashboard](https://vercel.com/dashboard)**
2. Select your project
3. Go to **Settings → Git**
4. Find **"Git LFS"** option
5. **Toggle it ON**
6. Click **Save**

### 2. Configure Environment Variables

Go to **Settings → Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_CONTRACT_ADDRESS` | Your deployed contract address | Production, Preview, Development |

### 3. Verify Build Settings

Go to **Settings → General → Build & Development Settings**

Should show (from `vercel.json`):
- **Framework Preset**: Vite
- **Build Command**: `npm run build-production`
- **Output Directory**: `frontend-vite-react/dist`
- **Install Command**: `npm install`

If these are incorrect, either:
- Delete and re-import the project (to pick up `vercel.json`)
- Or manually set these values

## Deployment Steps

### Every Deployment

1. **Ensure contract keys are up to date**
   ```bash
   # Regenerate contract keys if needed
   cd counter-contract
   npm run compact
   npm run build
   ```

2. **Commit and push changes**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

3. **Vercel automatically deploys** from main branch

### Manual Deployment (if needed)

1. Go to **Vercel Dashboard → Deployments**
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Uncheck "Use existing Build Cache"
5. Click **Redeploy**

## Post-Deployment Verification

### 1. Check Build Logs

1. Go to latest deployment
2. Click **"Building"** tab
3. Verify you see:
   ```bash
   > npm run build-production
   > cd counter-contract && npm run build
   > cd ../frontend-vite-react && npm run build
   > copy-contract-keys
   ```

### 2. Verify Contract Keys are Accessible

Visit these URLs (replace with your domain):

```
https://your-app.vercel.app/midnight/counter/keys/increment.verifier
```

Should:
- Return **200 OK**
- Download a file of **1,291 bytes**
- NOT show 404 or Git LFS pointer text

### 3. Test the Application

1. Open your deployed app
2. Connect wallet
3. Navigate to Counter page
4. Try incrementing the counter
5. Should work without "mismatched verifier keys" error

## Common Issues & Quick Fixes

### Issue: "mismatched verifier keys" error

**Cause**: Git LFS not enabled or LFS files not pulled

**Fix**:
1. Enable Git LFS in Vercel (Settings → Git)
2. Redeploy without cache

### Issue: 404 on contract key files

**Cause**: Build command not using `build-production`

**Fix**:
1. Check Build Settings (step 3 above)
2. Ensure `npm run build-production` is the build command
3. Redeploy

### Issue: Files show Git LFS pointer text instead of binary

**Cause**: Git LFS not enabled in Vercel

**Fix**:
1. Enable Git LFS toggle in Settings → Git
2. Must redeploy after enabling

## Build Process Flow

For reference, here's what happens during build:

```
1. Vercel clones repo with Git LFS enabled
   → Downloads actual binary files (not pointers)

2. npm install
   → Installs all dependencies

3. npm run build-production

   3a. cd counter-contract && npm run build
       → Compiles contract
       → Generates/copies keys to counter-contract/dist/managed/

   3b. cd ../frontend-vite-react && npm run build

       3b.1. npm run copy-contract-keys
             → Copies keys from counter-contract/src/managed/
             → To frontend-vite-react/public/midnight/counter/

       3b.2. vite build
             → Bundles frontend
             → Copies public/ to dist/
             → Output: frontend-vite-react/dist/

4. Vercel deploys frontend-vite-react/dist/
```

## File Structure After Build

```
frontend-vite-react/dist/
├── index.html
├── assets/
│   ├── index-*.js
│   ├── App-*.js
│   └── ...
└── midnight/
    └── counter/
        ├── keys/
        │   ├── increment.prover      (278,053 bytes)
        │   └── increment.verifier    (1,291 bytes)
        └── zkir/
            ├── increment.zkir        (784 bytes)
            └── increment.bzkir       (64 bytes)
```

## Emergency Rollback

If a deployment fails:

1. Go to **Deployments**
2. Find last working deployment
3. Click **"..."** → **"Promote to Production"**

## Checklist Before First Deployment

- [ ] Git LFS enabled in Vercel Settings → Git
- [ ] Environment variable `VITE_CONTRACT_ADDRESS` set
- [ ] Build command is `npm run build-production`
- [ ] Output directory is `frontend-vite-react/dist`
- [ ] Contract keys committed to repository
- [ ] All changes pushed to main branch

## Checklist For Every Deployment

- [ ] Contract keys are up to date (if contract changed)
- [ ] Environment variables are correct
- [ ] Changes committed and pushed
- [ ] Build logs show successful compilation
- [ ] Contract key files are accessible (not 404)
- [ ] Application works without errors
