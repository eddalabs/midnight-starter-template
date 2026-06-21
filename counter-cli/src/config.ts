import { networkId } from '@midnight-ntwrk/midnight-js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const currentDir = path.resolve(fileURLToPath(import.meta.url), '..');

export const contractConfig = {
  privateStateStoreName: 'counter-private-state',
  zkConfigPath: path.resolve(currentDir, '..', '..', 'counter-contract', 'src', 'managed', 'counter'),
};

export interface Config {
  readonly logDir: string;
  readonly indexer: string;
  readonly indexerWS: string;
  readonly node: string;
  readonly proofServer: string;
}

export class UndeployedConfig implements Config {
  logDir = path.resolve(currentDir, '..', 'logs', 'tui-standalone', `${new Date().toISOString()}.log`);
  indexer = 'http://127.0.0.1:8088/api/v4/graphql';
  indexerWS = 'ws://127.0.0.1:8088/api/v4/graphql/ws';
  node = 'http://127.0.0.1:9944';
  proofServer = 'http://127.0.0.1:6300';
  constructor() {
    networkId.setNetworkId('undeployed');
  }
}

export class PreviewConfig implements Config {
  logDir = path.resolve(currentDir, '..', 'logs', 'tui-preview', `${new Date().toISOString()}.log`);
  indexer = 'https://indexer.preview.midnight.network/api/v4/graphql';
  indexerWS = 'wss://indexer.preview.midnight.network/api/v4/graphql/ws';
  node = 'https://rpc.preview.midnight.network';
  proofServer = 'http://127.0.0.1:6300';
  constructor() {
    networkId.setNetworkId('preview');
  }
}

export class PreprodConfig implements Config {
  logDir = path.resolve(currentDir, '..', 'logs', 'tui-preprod', `${new Date().toISOString()}.log`);
  indexer = 'https://indexer.preprod.midnight.network/api/v4/graphql';
  indexerWS = 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws';
  node = 'https://rpc.preprod.midnight.network';
  proofServer = 'http://127.0.0.1:6300';
  constructor() {
    networkId.setNetworkId('preprod');
  }
}

export class MainnetConfig implements Config {
  logDir = path.resolve(currentDir, '..', 'logs', 'tui-mainnet', `${new Date().toISOString()}.log`);
  indexer = 'https://indexer.midnight.network/api/v4/graphql';
  indexerWS = 'wss://indexer.midnight.network/api/v4/graphql/ws';
  node = 'https://rpc.midnight.network';
  proofServer = 'http://127.0.0.1:6300';
  constructor() {
    networkId.setNetworkId('mainnet');
  }
}