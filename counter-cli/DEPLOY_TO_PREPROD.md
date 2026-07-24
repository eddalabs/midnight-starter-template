# Deploying the counter contract on-chain (Preprod)

`DEPLOYMENT_PROCEDURE.md` at the repo root covers shipping the **frontend** to
Vercel — and it lists *"Midnight contract deployed and contract address available"*
as a prerequisite. This guide is that missing prerequisite: how to actually deploy
the counter contract **on-chain to Preprod** with the CLI, and how to get past the
one wall that stops most first-timers — **error 170**.

## Prerequisites

- **Docker** running (the CLI starts a local proof server for you via `proof-server.yml`)
- **Node 20+** and `pnpm install` done at the repo root
- The contract built: `pnpm --filter counter-contract build`

## 1. Launch the Preprod TUI

From the repo root:

```bash
pnpm --filter counter-cli tui-preprod
```

This spins up the proof server on `localhost:6300` and opens an interactive menu
wired to Preprod (`rpc.preprod.midnight.network` / `indexer.preprod.midnight.network`).

## 2. Create a wallet and note your address

Follow the prompts to create (or restore) a wallet. Copy the **unshielded
address** it prints — that's what you fund.

## 3. Fund it from the Preprod faucet

Paste your unshielded address into the Midnight **Preprod faucet** to receive test
NIGHT. (Check the [Midnight docs](https://docs.midnight.network) for the current
faucet URL — public testnet faucets occasionally go down, and the Midnight Discord
usually has the working link if the main one is offline.)

## 4. Wait for DUST — this is the part people miss

On Midnight you **don't pay fees in NIGHT**. You hold NIGHT, it's registered to
**generate DUST** over time, and DUST is what pays transaction fees. So right after
funding, your DUST is still `0` and a deploy will fail — you have to let DUST
accrue first.

Use the CLI's **"Monitor DUST balance"** option (menu option `[3]`) and wait until
it shows a non-zero balance before deploying.

## 5. Deploy, then interact

Choose the **deploy** option, then **increment** the counter for a real on-chain
interaction. On success the CLI prints the **contract address** — save it.

### About error 170 (and why deploy is now resilient)

You may see this on submit:

```
1010: Invalid Transaction: Custom error: 170
```

That's `InvalidDustSpendProof` — the node rejecting the **DUST fee** proof because
it was balanced against a DUST state the chain has already moved past (a stale
wallet checkpoint, or the indexer running a step behind the node). It is **not** a
problem with your contract.

The important part: **resubmitting the same transaction can never clear a 170** —
the stale proof is baked into it. The only fix is to *rebuild* the transaction so
it re-balances the DUST and carries a fresh proof. The CLI now does this
automatically: deploy and increment are wrapped in a rebuild-on-170 retry
(`counter-cli/src/resilient-submit.ts` → `withDustRetry`), so a transient 170 is
retried with a freshly-balanced transaction instead of failing.

If 170 persists across every retry, your wallet's DUST is genuinely behind the
chain tip — give it a moment to finish syncing (watch the DUST monitor) and try the
deploy again. A quick tell: a failure that's **instant** (no ~30–60s proving pause)
usually means "could not balance dust" — the DUST is too stale to balance at all,
so wait for it to catch up; a 170 that comes **after** proving is the block-advance
race, which the retry rides through.

## 6. Wire the address into the frontend

Put the contract address into `VITE_CONTRACT_ADDRESS` and continue with
[`../DEPLOYMENT_PROCEDURE.md`](../DEPLOYMENT_PROCEDURE.md) to deploy the frontend.

---

## Quick troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Custom error: 170` on deploy/increment | Stale DUST fee proof | Handled automatically by the retry; if it persists, let DUST sync and retry |
| Instant "could not balance dust" | DUST state too far behind the tip | Wait for the DUST monitor to catch up, then retry |
| Deploy hangs / no proof server | Docker not running | Start Docker; the CLI needs the proof server on `:6300` |
| Balance funded but DUST stays 0 | DUST hasn't accrued yet | Normal — wait; NIGHT generates DUST over time |
