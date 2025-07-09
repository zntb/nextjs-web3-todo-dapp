'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { getWagmiConfig } from './config';

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ⚠️ Initialize the QueryClient only once and on the client
  const [queryClient] = useState(() => new QueryClient());

  // Memoize config so it doesn't recreate on each render
  const wagmiConfig = useMemo(() => getWagmiConfig(), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
