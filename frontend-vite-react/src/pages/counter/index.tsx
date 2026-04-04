import { Loading } from "@/components/loading";
import { useEffect, useState } from "react";
import { RefreshCw, PlusCircle, Hash, Activity, Lock, MapPin, Copy, Check, Shield, Pencil, Send, Clock, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContractSubscription } from "@/modules/midnight/counter-sdk/hooks/use-contract-subscription";
import { useTransactionProgress, type TransactionStage } from "@/modules/midnight/counter-sdk/hooks/use-transaction-progress";

const stageConfig: { stage: TransactionStage; icon: typeof Shield; label: string }[] = [
  { stage: "proving", icon: Shield, label: "Prove" },
  { stage: "signing", icon: Pencil, label: "Sign" },
  { stage: "submitting", icon: Send, label: "Submit" },
  { stage: "finalizing", icon: Clock, label: "Confirm" },
];

const stageOrder: Record<string, number> = {
  proving: 0, signing: 1, submitting: 2, finalizing: 3,
};

function getStageIndex(stage: TransactionStage): number {
  return stageOrder[stage] ?? -1;
}

export const Counter = () => {
  const { deployedContractAPI, derivedState, onDeploy, providers } =
    useContractSubscription();
  const { progress, setStage, setStageFromFlowMessage, startTracking, reset: resetProgress } =
    useTransactionProgress();
  const [deployedAddress, setDeployedAddress] = useState<string | undefined>(
    undefined
  );
  const [appLoading, setAppLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  useEffect(() => {
    if (derivedState?.round !== undefined) {
      setAppLoading(false);
    }
  }, [derivedState?.round]);

  useEffect(() => {
    setStageFromFlowMessage(providers?.flowMessage);
  }, [providers?.flowMessage, setStageFromFlowMessage]);

  const deployNew = async () => {
    const { address } = await onDeploy();
    if (address) {
      console.log('=== CONTRACT DEPLOYED ===');
      console.log('Contract Address:', address);
      console.log('========================');
    }
    setDeployedAddress(address);
  };

  const copyAddress = async () => {
    if (deployedAddress) {
      await navigator.clipboard.writeText(deployedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const increment = async () => {
    if (!deployedContractAPI || derivedState?.round === undefined) return;
    setTxError(null);
    startTracking(derivedState.round);
    try {
      await deployedContractAPI.increment();
      setStage("confirmed");
    } catch (e: unknown) {
      console.error("Increment failed:", e);
      setTxError("Transaction failed. Please try again.");
      resetProgress();
    }
  };

  const stats = [
    {
      label: 'Counter Value',
      value: derivedState?.round || '0',
      icon: Hash,
    },
    {
      label: 'Private Data',
      value: derivedState?.privateState.privateCounter || '0',
      icon: Lock,
    },
    {
      label: 'Turn Status',
      value: derivedState?.turns.increment || 'idle',
      icon: Activity,
      mono: true,
    },
    {
      label: 'Contract Address',
      value: deployedContractAPI?.deployedContractAddress || 'Not deployed',
      icon: MapPin,
      mono: true,
      truncate: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {appLoading && <Loading />}
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
            Counter Contract
          </h1>
          <p className="text-muted-foreground">
            Deploy and interact with a privacy-preserving smart contract
          </p>
        </div>

        {/* Actions */}
        <Card className="mb-6 border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
            <CardDescription>
              Deploy a new counter contract or increment the existing one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={deployNew} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Deploy New Contract
              </Button>
              <Button
                onClick={increment}
                disabled={!deployedContractAPI || progress.isActive}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Increment Counter
              </Button>
            </div>

            {deployedAddress && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/60">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-muted-foreground">Deployed to</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs gap-1"
                    onClick={copyAddress}
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-xs font-mono break-all text-foreground select-all">{deployedAddress}</p>
              </div>
            )}

            {txError && (
              <div className="mt-4 flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{txError}</p>
              </div>
            )}

            {progress.isActive && (
              <div className="mt-4 space-y-4">
                {/* Stage indicators */}
                <div className="grid grid-cols-4 gap-2">
                  {stageConfig.map((cfg) => {
                    const currentIdx = getStageIndex(progress.stage);
                    const cfgIdx = getStageIndex(cfg.stage);
                    const isCompleted = progress.stage === 'confirmed' || currentIdx > cfgIdx;
                    const isCurrent = currentIdx === cfgIdx && progress.stage !== 'confirmed';
                    const Icon = cfg.icon;

                    return (
                      <div
                        key={cfg.stage}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-colors ${
                          isCompleted
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : isCurrent
                              ? 'border-blue-500/30 bg-blue-500/5'
                              : 'border-border/40 bg-muted/30'
                        }`}
                      >
                        <div className="relative">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : isCurrent ? (
                            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                          ) : (
                            <Icon className="h-5 w-5 text-muted-foreground/40" />
                          )}
                        </div>
                        <span className={`text-xs font-medium ${
                          isCompleted
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : isCurrent
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-muted-foreground/50'
                        }`}>
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out bg-blue-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>

                {/* Status message */}
                <p className="text-sm text-muted-foreground text-center">{progress.message}</p>

                {/* Warning */}
                {progress.stage !== 'confirmed' && (
                  <div className="flex items-center justify-center gap-2 p-2 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs text-amber-600 dark:text-amber-400">Do not close this window while the transaction is in progress</span>
                  </div>
                )}

                {/* Confirmed banner */}
                {progress.stage === 'confirmed' && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Transaction confirmed!</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-border/60">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-muted shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1">{stat.label}</p>
                      <p className={`text-lg font-semibold ${stat.mono ? 'font-mono text-sm' : ''} ${stat.truncate ? 'truncate' : ''}`}>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
