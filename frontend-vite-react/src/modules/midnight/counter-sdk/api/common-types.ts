import { type CounterPrivateState, Counter, createPrivateState } from '@eddalabs/counter-contract';
import type { ProvableCircuitId } from '@midnight-ntwrk/compact-js';
import { contracts, types } from '@midnight-ntwrk/midnight-js';

export type CounterCircuits = ProvableCircuitId<Counter.Contract<CounterPrivateState>>;

export const CounterPrivateStateId = 'counterPrivateState';

export type CounterProviders = types.MidnightProviders<CounterCircuits, typeof CounterPrivateStateId, CounterPrivateState>;

export type CounterContract = Counter.Contract<CounterPrivateState>;

export type DeployedCounterContract = contracts.DeployedContract<CounterContract> | contracts.FoundContract<CounterContract>;

export type UserAction = {
  increment: string | undefined;  
};

export type DerivedState = {
  readonly round: Counter.Ledger["round"];
  readonly privateState: CounterPrivateState;
  readonly turns: UserAction;
};

export const emptyState: DerivedState = {
  round: 0n,
  privateState: createPrivateState(0),
  turns: { increment: undefined },
};
