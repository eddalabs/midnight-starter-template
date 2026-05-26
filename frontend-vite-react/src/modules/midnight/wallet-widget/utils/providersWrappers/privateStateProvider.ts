import type { types } from "@midnight-ntwrk/midnight-js";
import type { ContractAddress } from "@midnight-ntwrk/ledger-v8";
import type { SigningKey } from "@midnight-ntwrk/compact-runtime";
import type { Logger } from "pino";

export class WrappedPrivateStateProvider<
  PSI extends types.PrivateStateId = types.PrivateStateId,
  PS = any,
> implements types.PrivateStateProvider<PSI, PS> {
  constructor(
    private readonly privateDataProvider: types.PrivateStateProvider<PSI, PS>,
    private readonly logger?: Logger,
  ) {}

  setContractAddress(address: ContractAddress): void {
    this.logger?.trace(`Setting contract address: ${address}`);
    this.privateDataProvider.setContractAddress(address);
  }

  set(privateStateId: PSI, state: PS): Promise<void> {
    this.logger?.trace(`Setting private state for key: ${privateStateId}`);
    return this.privateDataProvider.set(privateStateId, state);
  }

  get(privateStateId: PSI): Promise<null | PS> {
    this.logger?.trace(`Getting private state for key: ${privateStateId}`);
    return this.privateDataProvider.get(privateStateId);
  }

  remove(privateStateId: PSI): Promise<void> {
    this.logger?.trace(`Removing private state for key: ${privateStateId}`);
    return this.privateDataProvider.remove(privateStateId);
  }

  clear(): Promise<void> {
    this.logger?.trace("Clearing private state");
    return this.privateDataProvider.clear();
  }

  setSigningKey(
    address: ContractAddress,
    signingKey: SigningKey,
  ): Promise<void> {
    this.logger?.trace(`Setting signing key for key: ${address}`);
    return this.privateDataProvider.setSigningKey(address, signingKey);
  }

  getSigningKey(address: ContractAddress): Promise<SigningKey | null> {
    this.logger?.trace(`Getting signing key for key: ${address}`);
    return this.privateDataProvider.getSigningKey(address);
  }

  removeSigningKey(address: ContractAddress): Promise<void> {
    this.logger?.trace(`Removing signing key for key: ${address}`);
    return this.privateDataProvider.removeSigningKey(address);
  }

  clearSigningKeys(): Promise<void> {
    this.logger?.trace("Clearing signing keys");
    return this.privateDataProvider.clearSigningKeys();
  }

  exportPrivateStates(
    options?: types.ExportPrivateStatesOptions,
  ): Promise<types.PrivateStateExport> {
    this.logger?.trace("Exporting private states");
    return this.privateDataProvider.exportPrivateStates(options);
  }

  importPrivateStates(
    exportData: types.PrivateStateExport,
    options?: types.ImportPrivateStatesOptions,
  ): Promise<types.ImportPrivateStatesResult> {
    this.logger?.trace("Importing private states");
    return this.privateDataProvider.importPrivateStates(exportData, options);
  }

  exportSigningKeys(
    options?: types.ExportSigningKeysOptions,
  ): Promise<types.SigningKeyExport> {
    this.logger?.trace("Exporting signing keys");
    return this.privateDataProvider.exportSigningKeys(options);
  }

  importSigningKeys(
    exportData: types.SigningKeyExport,
    options?: types.ImportSigningKeysOptions,
  ): Promise<types.ImportSigningKeysResult> {
    this.logger?.trace("Importing signing keys");
    return this.privateDataProvider.importSigningKeys(exportData, options);
  }
}
