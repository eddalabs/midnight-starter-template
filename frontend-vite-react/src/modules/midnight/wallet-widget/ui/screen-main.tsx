import { useWallet } from "../hooks/useWallet";
import { useWalletList } from "../hooks/useWalletList";
import { walletsListFormat } from "./common/common-values";
import { TooltipProvider } from "./common/tooltip";
import WalletIcon from "./wallet-icon";

export default function ScreenMain({ selectedNetwork, setOpen }: { selectedNetwork: string; setOpen: Function }) {
  const { connectWallet } = useWallet();
  const listed = Object.values(walletsListFormat);
  // Any other DApp Connector wallet on window.midnight gets a tile with the
  // name and icon it injects. connectToWallet resolves a wallet by key, name
  // or rdns, so the same check decides whether a wallet is already listed.
  const unlisted = useWalletList().filter(
    (wallet) =>
      !listed.some(
        (config) => config.key === wallet.key || config.key === wallet.name || config.key === wallet.rdns
      )
  );
  const walletEntries = [
    ...listed,
    // rdns is stable across page loads (keys may be random), so auto-reconnect keeps working.
    ...unlisted.map((wallet) => ({ key: wallet.rdns || wallet.key, displayName: wallet.name, iconUrl: wallet.icon })),
  ];

  return (
    <TooltipProvider>
      <div
        className="grid gap-4 py-7 place-items-center gap-y-8"
        style={{
          gridTemplateColumns: `repeat(${walletEntries.length}, minmax(0, 1fr))`,
        }}
      >
        {walletEntries.map((config) => (
          <WalletIcon
            key={config.key}
            icon={"iconUrl" in config ? config.iconUrl : undefined}
            iconReactNode={"icon" in config ? config.icon : undefined}
            name={config.displayName}
            action={() => {
              connectWallet(config.key, selectedNetwork);
              setOpen(false);
            }}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}

