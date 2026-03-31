import { Loading } from "@/components/loading";
import { useEffect, useState } from "react";
import { RefreshCw, PlusCircle, Hash, Activity, Lock, MapPin, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContractSubscription } from "@/modules/midnight/counter-sdk/hooks/use-contract-subscription";

export const Counter = () => {
  const { deployedContractAPI, derivedState, onDeploy, providers } =
    useContractSubscription();
  const [deployedAddress, setDeployedAddress] = useState<string | undefined>(
    undefined
  );
  const [appLoading, setAppLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (derivedState?.round !== undefined) {
      setAppLoading(false);
    }
  }, [derivedState?.round]);

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
    if (deployedContractAPI) {
      await deployedContractAPI.increment();
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
                disabled={!deployedContractAPI}
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

            {providers?.flowMessage && (
              <div className="mt-4 flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                <Activity className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-blue-600 dark:text-blue-400">{providers.flowMessage}</p>
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
