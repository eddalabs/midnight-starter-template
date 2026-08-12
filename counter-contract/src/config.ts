import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const currentDir = path.resolve(fileURLToPath(import.meta.url), '..');

export interface Config {
  readonly logDir: string;  
}

export class LogicTestingConfig implements Config {
  logDir = path.resolve(currentDir, '..', 'logs', 'logic-testing', `${new Date().toISOString()}.log`);  
  constructor() {}
}


