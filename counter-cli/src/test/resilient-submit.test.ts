import { describe, it, expect, vi } from 'vitest';
import { withDustRetry } from '../resilient-submit';

describe('withDustRetry', () => {
  it('rebuilds and succeeds after a single error 170 (InvalidDustSpendProof)', async () => {
    let calls = 0;
    const build = vi.fn(async () => {
      calls += 1;
      if (calls === 1) throw new Error('1010: Invalid Transaction: Custom error: 170');
      return 'ok';
    });
    const result = await withDustRetry('deploy', build, undefined, { backoffMs: 0 });
    expect(result).toBe('ok');
    expect(build).toHaveBeenCalledTimes(2);
  });

  it('retries on "could not balance dust"', async () => {
    let calls = 0;
    const build = vi.fn(async () => {
      calls += 1;
      if (calls < 2) throw new Error('Wallet.InsufficientFunds: could not balance dust');
      return 42;
    });
    await expect(withDustRetry('t', build, undefined, { backoffMs: 0 })).resolves.toBe(42);
  });

  it('detects 170 nested in an error cause chain', async () => {
    let calls = 0;
    const build = vi.fn(async () => {
      calls += 1;
      if (calls === 1) {
        const inner = new Error('RpcError: 1010: Invalid Transaction: Custom error: 170');
        throw new Error('Transaction submission error', { cause: inner });
      }
      return 'done';
    });
    await expect(withDustRetry('t', build, undefined, { backoffMs: 0 })).resolves.toBe('done');
    expect(build).toHaveBeenCalledTimes(2);
  });

  it('does NOT retry a non-transient error and rethrows immediately', async () => {
    const build = vi.fn(async () => {
      throw new Error('some real bug in the contract');
    });
    await expect(
      withDustRetry('t', build, undefined, { backoffMs: 0, attempts: 4 }),
    ).rejects.toThrow('some real bug');
    expect(build).toHaveBeenCalledTimes(1);
  });

  it('gives up after max attempts on a persistent 170', async () => {
    const build = vi.fn(async () => {
      throw new Error('Custom error: 170');
    });
    await expect(
      withDustRetry('t', build, undefined, { backoffMs: 0, attempts: 3 }),
    ).rejects.toThrow('170');
    expect(build).toHaveBeenCalledTimes(3);
  });
});
