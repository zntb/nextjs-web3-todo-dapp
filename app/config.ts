import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

const walletConnectInstance = walletConnect({ projectId });

// Only create the config once:
const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected(), walletConnectInstance, metaMask(), safe()],
  transports: {
    [sepolia.id]: http(),
  },
});

export function getWagmiConfig() {
  return wagmiConfig;
}
