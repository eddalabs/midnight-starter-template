import { createRootRoute, Outlet } from '@tanstack/react-router';
import * as pino from "pino";
import { ThemeProvider } from "@/components/theme-provider";
import { MidnightMeshProvider } from "@/modules/midnight/wallet-widget/contexts/wallet";
import { CounterAppProvider } from "@/modules/midnight/counter-sdk/contexts";
import { MainLayout } from "@/layouts/layout";

export const logger = pino.pino({
  level: "trace",
});

// Update this with your deployed contract address
// const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS!;
const contractAddress = "8654596456a92010c20c1e239ba79e3ec2cfdaef1b1aaaeb7660a66fbced8003";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <MidnightMeshProvider logger={logger}>
        <CounterAppProvider logger={logger} contractAddress={contractAddress}>
          <MainLayout>
            <Outlet />
          </MainLayout>          
        </CounterAppProvider>
      </MidnightMeshProvider>
    </ThemeProvider>
  );
}
