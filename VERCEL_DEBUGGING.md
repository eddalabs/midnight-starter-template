# Vercel Deployment Debugging Guide

## Quick Diagnostic Steps

### 1. Check if Keys Are Accessible on Your Deployed Site

After deploying, visit:
```
https://your-app.vercel.app/diagnostic.html
```

This diagnostic page will:
- ✅ Check if all 4 required files are accessible
- ✅ Verify file sizes match expected values
- ✅ Validate file headers
- ✅ Show detailed error information if something is wrong

### 2. Check Vercel Build Logs

1. Go to your Vercel project dashboard
2. Click on the latest deployment
3. Go to the "Building" tab
4. Look for these specific lines:

```bash
> @eddalabs/starter-template@0.1.0 build-production
> cd counter-contract && npm run build && cd ../frontend-vite-react && npm run build

> @eddalabs/counter-contract@0.1.0 build
> rm -rf dist && tsc --project tsconfig.build.json && cp -Rf ./src/managed ./dist/managed

> @eddalabs/frontend-vite-react@0.0.0 build
> npm run copy-contract-keys && vite build

> @eddalabs/frontend-vite-react@0.0.0 copy-contract-keys
> mkdir -p ./public/midnight/counter/keys && mkdir -p ./public/midnight/counter/zkir && cp -r ../counter-contract/src/managed/counter/keys/* ./public/midnight/counter/keys
```

**If you don't see these lines**, the `vercel.json` configuration isn't being picked up correctly.

### 3. Verify Vercel Project Settings

Go to: **Project Settings → General → Build & Development Settings**

Should show:
- **Framework Preset**: Other
- **Build Command**: `npm run build-production` (from vercel.json)
- **Output Directory**: `frontend-vite-react/dist` (from vercel.json)
- **Install Command**: `npm install` (from vercel.json)

If these are different, the `vercel.json` file isn't being used. Try:
1. Delete the project from Vercel and re-import it
2. Or manually set these values in the project settings

### 4. Common Issues and Solutions

#### Issue: "operations are undefined or have mismatched verifier keys"

**Possible Causes:**

1. **Files not accessible** (most common)
   - Run the diagnostic page (step 1 above)
   - If files return 404, the build isn't copying them correctly

2. **Wrong build command**
   - Check Vercel build logs (step 2 above)
   - Ensure `build-production` is running, not just `build`

3. **Contract address mismatch**
   - Verify your `VITE_CONTRACT_ADDRESS` env variable in Vercel matches your deployed contract
   - Go to: Project Settings → Environment Variables

4. **Cached old deployment**
   - Try a hard refresh in your browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Clear browser cache completely

5. **Files corrupted during deployment**
   - Run diagnostic page and check the hex dump of first bytes
   - Should start with `6d 69 64 6e 69 67 68 74 3a 76 65 72 69 66 69 65 72` ("midnight:verifier")

#### Issue: Diagnostic page shows all files are accessible but still getting errors

This usually means:
1. **Runtime version mismatch** - The compact runtime version in your deployed app doesn't match the version used to generate the keys
2. **Contract address mismatch** - Double-check `VITE_CONTRACT_ADDRESS`
3. **Stale browser cache** - Try in an incognito/private window

### 5. Manual Verification via DevTools

1. Open your deployed app
2. Open browser DevTools (F12)
3. Go to Network tab
4. Try to use the counter feature
5. Look for requests to `/midnight/counter/keys/increment.verifier`
6. Check if:
   - The request succeeds (status 200)
   - The file size is correct (1,291 bytes)
   - Content-Type header is set

### 6. Testing Locally Before Deploying

Run this command to simulate the production build:

```bash
# Clean everything
rm -rf frontend-vite-react/dist counter-contract/dist

# Run production build
npm run build-production

# Check if files exist
ls -la frontend-vite-react/dist/midnight/counter/keys/
ls -la frontend-vite-react/dist/midnight/counter/zkir/

# Expected output:
# increment.prover (278,053 bytes)
# increment.verifier (1,291 bytes)
# increment.zkir (784 bytes)
# increment.bzkir (64 bytes)

# Test locally
cd frontend-vite-react
npx vite preview

# Then visit http://localhost:4173/diagnostic.html
```

### 7. Force Redeploy

If all else fails, try forcing a complete redeploy:

```bash
# Make a trivial change to force new deployment
echo "# $(date)" >> README.md
git add README.md
git commit -m "Force redeploy"
git push
```

Or in Vercel dashboard:
1. Go to Deployments
2. Find the last successful deployment
3. Click "..." → "Redeploy"
4. Check "Use existing Build Cache" = OFF

## Expected File Structure After Build

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

## Still Having Issues?

Check these files for the exact configuration:
- `/vercel.json` - Build configuration
- `/package.json` - Root build scripts
- `/counter-contract/package.json` - Contract build script
- `/frontend-vite-react/package.json` - Frontend build script

The build order MUST be:
1. Build contract (generates/has keys in `src/managed/`)
2. Copy keys from contract to frontend `public/`
3. Build frontend (copies `public/` to `dist/`)
