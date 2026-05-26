import type {
types
} from "@midnight-ntwrk/midnight-js";
import type { Logger } from "pino";
import type {
  ContractAddress,
  ContractState,
} from "@midnight-ntwrk/compact-runtime";
import { retryWithBackoff } from "./retryWithBackoff";
import type { LedgerParameters, TransactionId, ZswapChainState } from "@midnight-ntwrk/ledger-v8";
import type { Observable } from "rxjs";

export type ProviderAction =
  | "balanceTxStarted"
  | "balanceTxDone"
  | "proveTxStarted"
  | "proveTxDone"
  | "downloadProverStarted"
  | "downloadProverDone"
  | "submitTxStarted"
  | "submitTxDone"
  | "watchForTxDataStarted"
  | "watchForTxDataDone";

export type ActionMessages = {
  [K in ProviderAction]: string | undefined;
};

export class WrappedPublicDataProvider implements types.PublicDataProvider {
  constructor(
    private readonly wrapped: types.PublicDataProvider,
    private readonly callback: (
      action: "watchForTxDataStarted" | "watchForTxDataDone"
    ) => void,
    private readonly logger?: Logger
  ) {}

  contractStateObservable(
    address: ContractAddress,
    config: types.ContractStateObservableConfig
  ): Observable<ContractState> {
    return this.wrapped.contractStateObservable(address, config);
  }

  queryContractState(
    contractAddress: ContractAddress,
    config?: types.BlockHeightConfig | types.BlockHashConfig
  ): Promise<ContractState | null> {
    return retryWithBackoff(
      () => this.wrapped.queryContractState(contractAddress, config),
      "queryContractState",
      this.logger
    );
  }

  queryDeployContractState(
    contractAddress: ContractAddress
  ): Promise<ContractState | null> {
    return retryWithBackoff(
      () => this.wrapped.queryDeployContractState(contractAddress),
      "queryDeployContractState",
      this.logger
    );
  }

  queryZSwapAndContractState(
    contractAddress: ContractAddress,
    config?: types.BlockHeightConfig | types.BlockHashConfig
  ): Promise<[ZswapChainState, ContractState, LedgerParameters] | null> {
    return retryWithBackoff(
      () => this.wrapped.queryZSwapAndContractState(contractAddress, config),
      "queryZSwapAndContractState",
      this.logger
    );
  }

  queryUnshieldedBalances(
    contractAddress: ContractAddress,
    config?: types.BlockHeightConfig | types.BlockHashConfig
  ): Promise<types.UnshieldedBalances | null> {
    return retryWithBackoff(
      () => this.wrapped.queryUnshieldedBalances(contractAddress, config),
      "queryZSwapAndContractState",
      this.logger
    );
  }

  watchForContractState(
    contractAddress: ContractAddress
  ): Promise<ContractState> {
    return retryWithBackoff(
      () => this.wrapped.watchForContractState(contractAddress),
      "watchForContractState",
      this.logger
    );
  }

  watchForUnshieldedBalances(
    contractAddress: ContractAddress
  ): Promise<types.UnshieldedBalances> {
    return retryWithBackoff(
      () => this.wrapped.watchForUnshieldedBalances(contractAddress),
      "watchForContractState",
      this.logger
    );
  }

  watchForDeployTxData(
    contractAddress: ContractAddress
  ): Promise<types.FinalizedTxData> {
    return retryWithBackoff(
      () => this.wrapped.watchForDeployTxData(contractAddress),
      "watchForDeployTxData",
      this.logger
    );
  }

  watchForTxData(txId: TransactionId): Promise<types.FinalizedTxData> {
    // calling a callback is a workaround to show in the UI when the watchForTxData is called
    this.callback("watchForTxDataStarted");
    return retryWithBackoff(
      () => this.wrapped.watchForTxData(txId),
      "watchForTxDataStarted",
      this.logger,
      1000 // we keep retrying long enough
    ).finally(() => {
      this.callback("watchForTxDataDone");
    });
  }

  unshieldedBalancesObservable(
    address: ContractAddress,
    config: types.ContractStateObservableConfig
  ): Observable<types.UnshieldedBalances> {
    return this.wrapped.unshieldedBalancesObservable(address, config);
  }
}
