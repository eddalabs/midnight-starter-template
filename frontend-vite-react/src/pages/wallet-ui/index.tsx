import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Server, Wifi, WifiOff, Wallet, RefreshCw, ExternalLink } from "lucide-react";
import { MidnightWallet } from "@/modules/midnight/wallet-widget/ui/midnightWallet";
import { useWallet } from "@/modules/midnight/wallet-widget/hooks/useWallet";

function AddressField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="bg-muted/50 border border-border/60 px-3 py-2 rounded-md">
        <p className="text-xs font-mono break-all text-foreground/80">
          {value || "Not connected"}
        </p>
      </div>
    </div>
  );
}

function StatusIndicator({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function WalletUI() {
  const {
    disconnect,
    setOpen,
    refresh,
    status,
    proofServerOnline,
    initialAPI,
    unshieldedAddress,
    shieldedAddresses,
    serviceUriConfig,
    dustAddress,
    dustBalance,
    unshieldedBalances,
  } = useWallet();

  const endpoints = [
    { label: 'Substrate Node', value: serviceUriConfig?.substrateNodeUri },
    { label: 'Indexer (REST)', value: serviceUriConfig?.indexerUri },
    { label: 'Indexer (WebSocket)', value: serviceUriConfig?.indexerWsUri },
    { label: 'Proof Server', value: serviceUriConfig?.proverServerUri },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
            Wallet Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your wallet and view connection details
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Wallet */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Card */}
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Wallet className="h-4 w-4" />
                      Wallet Connection
                    </CardTitle>
                    <CardDescription>Connect and manage your Midnight wallet</CardDescription>
                  </div>
                  <StatusIndicator
                    active={status?.status === "connected"}
                    label={status?.status === "connected" ? "Connected" : "Disconnected"}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-3">
                  <MidnightWallet />
                  <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open
                  </Button>
                  <Button variant="outline" size="sm" onClick={refresh} className="gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={disconnect} className="gap-1.5 text-destructive hover:text-destructive">
                    <Link2 className="h-3.5 w-3.5" />
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Addresses Card */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Addresses</CardTitle>
                <CardDescription>Your wallet addresses and keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <AddressField
                  label="Unshielded Address"
                  value={unshieldedAddress?.unshieldedAddress || ""}
                />
                <AddressField
                  label="Shielded Address"
                  value={shieldedAddresses?.shieldedAddress || ""}
                />
                <AddressField
                  label="Coin Public Key"
                  value={shieldedAddresses?.shieldedCoinPublicKey || ""}
                />
                <AddressField
                  label="Encryption Public Key"
                  value={shieldedAddresses?.shieldedEncryptionPublicKey || ""}
                />
                <AddressField
                  label="Dust Address"
                  value={dustAddress?.dustAddress || ""}
                />
              </CardContent>
            </Card>

            {/* Balances Card */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Balances</CardTitle>
                <CardDescription>Current token balances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted/50 border border-border/60 rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Dust Balance</p>
                    <p className="text-xl font-semibold tabular-nums">
                      {dustBalance?.balance
                        ? Math.floor(Number(dustBalance.balance) / 1000000000000000).toLocaleString()
                        : "--"}
                    </p>
                  </div>
                  <div className="bg-muted/50 border border-border/60 rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Dust Cap</p>
                    <p className="text-xl font-semibold tabular-nums">
                      {dustBalance?.cap
                        ? Math.floor(Number(dustBalance.cap) / 1000000000000000).toLocaleString()
                        : "--"}
                    </p>
                  </div>
                  <div className="bg-muted/50 border border-border/60 rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Night Balance</p>
                    <div className="text-xl font-semibold tabular-nums">
                      {unshieldedBalances
                        ? Object.entries(unshieldedBalances).map(([token, balance]) => (
                            <div key={token}>
                              {Math.floor(Number(balance) / 1000000).toLocaleString()}
                            </div>
                          ))
                        : "--"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Status */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="h-4 w-4" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Wallet</span>
                    <StatusIndicator
                      active={status?.status === "connected"}
                      label={status?.status === "connected" ? "Connected" : "Offline"}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Proof Server</span>
                    <div className="flex items-center gap-1.5">
                      {proofServerOnline ? (
                        <Wifi className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <WifiOff className="h-3.5 w-3.5 text-muted-foreground/50" />
                      )}
                      <span className="text-sm">{proofServerOnline ? "Online" : "Offline"}</span>
                    </div>
                  </div>
                  {status?.status === "connected" && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <span className="text-sm font-mono">{status?.networkId}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Wallet Name</span>
                    <span className="text-sm">{initialAPI?.name || "--"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endpoints Card */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Endpoints</CardTitle>
                <CardDescription>Network configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {endpoints.map((ep) => (
                  <div key={ep.label} className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">{ep.label}</p>
                    <p className="text-xs font-mono text-foreground/70 break-all">
                      {ep.value || "Not available"}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
