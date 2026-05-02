# Contributing

Thanks for your interest in contributing to the Edda Labs Midnight starter template!

This document covers the basics — how to set up your environment, run checks, and open a pull request. For project setup details (Compact toolchain, Git LFS, Lace wallet), see the [root README](./README.md).

## Quick start

```bash
# 1. Fork & clone
git clone https://github.com/<your-username>/midnight-starter-template.git
cd midnight-starter-template

# 2. Install dependencies
pnpm install

# 3. Build everything (compiles the contract + bundles the frontend)
pnpm build
```

The repo is a [pnpm](https://pnpm.io/) + [Turbo](https://turbo.build/) monorepo with three workspaces:

| Package | Purpose |
|---|---|
| `counter-contract` | Compact smart contract source and compiled artifacts |
| `counter-cli` | Node.js CLI / TUI for interacting with deployed contracts |
| `frontend-vite-react` | React + Vite dApp frontend |

## Branching & commits

- Branch off `main`. Use a short, scoped name: `chore/...`, `docs/...`, `fix/...`, `feat/...`.
- Keep PRs focused — one topic per PR. Smaller PRs get reviewed faster.
- Commit messages: lowercase, imperative, scoped. Examples:
  - `chore: remove accidentally committed files`
  - `docs: standardize README on pnpm`
  - `fix: handle missing wallet rdns`

## Before opening a PR

Run these from the project root:

```bash
# Lint every workspace
pnpm lint

# Type-check the CLI
pnpm --filter @eddalabs/counter-cli typecheck

# Run the CLI test suite (standalone — no live network needed)
pnpm --filter @eddalabs/counter-cli test-undeployed
```

If you touched the frontend, smoke-test the UI:

```bash
pnpm dev:frontend
```

## Pull request expectations

- Fill in the PR template (summary + test plan).
- If you changed user-visible behavior, include a screenshot or short clip.
- If your change touches the deployment path, mention any impact on [`DEPLOYMENT_PROCEDURE.md`](./DEPLOYMENT_PROCEDURE.md).
- Don't commit `.env` files, `dist/`, `node_modules/`, or build artifacts. The `.gitignore` covers most of these — double-check `git status` before pushing.

## Reporting issues

Found a bug or have a suggestion? Open an issue describing:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Your environment (OS, Node version, network — Preview / Preprod / Mainnet / standalone)

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0 — see [`LICENSE`](./LICENSE).
