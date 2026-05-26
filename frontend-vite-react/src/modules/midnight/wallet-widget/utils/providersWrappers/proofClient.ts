import type { types } from "@midnight-ntwrk/midnight-js";
import type { UnprovenTransaction } from "@midnight-ntwrk/ledger-v8";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";

export const proofClient = <K extends string>(
  url: string,
  zkConfigProvider: types.ZKConfigProvider<K>,
  callback: (status: "proveTxStarted" | "proveTxDone") => void
): types.ProofProvider => {
  const httpClientProvider = httpClientProofProvider(url.trim(), zkConfigProvider);
  return {
    proveTx(
      tx: UnprovenTransaction,
      proveTxConfig?: types.ProveTxConfig
    ): Promise<types.UnboundTransaction> {
      callback("proveTxStarted");
      return httpClientProvider.proveTx(tx, proveTxConfig).finally(() => {
        callback("proveTxDone");
      });
    },
  };
};

export const noopProofClient = (): types.ProofProvider => {
  return {
    proveTx(): Promise<types.UnboundTransaction> {
      return Promise.reject(new Error("Proof server not available"));
    },
  };
};
