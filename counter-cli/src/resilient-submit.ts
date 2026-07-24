/**
 * Resilient submit helper for Midnight transactions on public networks.
 *
 * On a public network (Preprod/testnet) a transaction's DUST *fee* proof can be
 * rejected by the node with `1010: Invalid Transaction: Custom error: 170`
 * (`InvalidDustSpendProof`) when it was balanced against a DUST state the chain has
 * already advanced past — a stale wallet checkpoint, or the indexer running a step
 * behind the node. The same underlying situation can also surface as
 * "could not balance dust".
 *
 * The key insight: resubmitting the SAME finalized transaction can never clear a
 * 170, because the stale DUST proof is baked into it. The only thing that works is
 * to REBUILD the transaction so it re-balances the DUST against the current state
 * and carries a fresh proof. So this helper retries the transaction *builder*
 * (e.g. `deployContract`, or a `callTx`), not a bare submit — every attempt is a
 * clean, freshly-balanced transaction.
 *
 * Usage — wrap any deploy or contract call that talks to a public network:
 *
 *   const contract = await withDustRetry('deploy', () => deployContract(providers, opts), logger);
 *   const tx       = await withDustRetry('increment', () => contract.callTx.increment(), logger);
 */
import { type Logger } from 'pino';

export interface DustRetryOptions {
  /** Max attempts. Each attempt fully rebuilds and re-proves the transaction. Default 6. */
  attempts?: number;
  /** Backoff between attempts, in ms. Default 2000. */
  backoffMs?: number;
}

/** Flatten an error and its `cause` chain into one searchable string. */
function errorText(err: unknown): string {
  let text = '';
  let cur: any = err;
  while (cur) {
    text += ' ' + String(cur.message ?? cur);
    cur = cur.cause;
  }
  return text;
}

/**
 * Retry a transaction *builder* on the transient, dust-related failures that hit
 * public Midnight networks: error 170 (`InvalidDustSpendProof`), "could not balance
 * dust", and clean node websocket drops ("Normal Closure"). Any other error is
 * re-thrown immediately — this never masks a real failure.
 *
 * @param label   short label for log lines (e.g. "deploy", "increment")
 * @param build   the builder to (re)run each attempt; MUST rebuild the tx, e.g.
 *                `() => deployContract(providers, opts)`
 * @param logger  optional pino logger for progress lines
 * @param options attempts / backoff overrides
 */
export async function withDustRetry<T>(
  label: string,
  build: () => Promise<T>,
  logger?: Logger,
  options: DustRetryOptions = {},
): Promise<T> {
  const attempts = options.attempts ?? 6;
  const backoffMs = options.backoffMs ?? 2000;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await build();
    } catch (err) {
      lastErr = err;
      const text = errorText(err);
      const staleDust = /\b170\b/.test(text) || /balance dust|InsufficientFunds/i.test(text);
      const socketDrop = /Normal Closure|disconnected/i.test(text);
      const retryable = staleDust || socketDrop;

      const reason = staleDust ? 'stale DUST fee proof — rebuilding' : text.trim().slice(0, 140);
      logger?.warn(`[${label}] attempt ${attempt}/${attempts} failed: ${reason}`);

      if (attempt < attempts && retryable) {
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }
      throw lastErr;
    }
  }
  // Unreachable (loop either returns or throws), but keeps the type checker happy.
  throw lastErr;
}
