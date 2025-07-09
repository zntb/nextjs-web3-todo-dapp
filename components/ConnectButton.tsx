'use client';

import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useConnect,
  useSwitchChain,
} from 'wagmi';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent } from './ui/card';
import { injected } from 'wagmi/connectors';
import { useEffect, useState } from 'react';

const supportedChains = [{ id: 11155111, name: 'Sepolia' }];

export default function ConnectButton() {
  const [isMounted, setIsMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const { connect } = useConnect();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder or nothing during SSR
    return <Button disabled>Loading...</Button>;
  }

  if (!address) {
    return (
      <Button onClick={() => connect({ connector: injected() })}>
        Connect Wallet
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className='py-4 space-y-2'>
        <div className='text-sm'>
          <span className='font-medium'>Connected as:</span>{' '}
          {ensName ?? address}
        </div>

        <div className='text-sm'>
          <span className='font-medium'>Network:</span> {chain?.name} (
          {chain?.id})
        </div>

        {isConnected && (
          <Select
            onValueChange={val => switchChain({ chainId: Number(val) })}
            value={chain?.id?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder='Switch Network' />
            </SelectTrigger>
            <SelectContent>
              {supportedChains.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button onClick={() => disconnect()} variant='destructive'>
          Disconnect
        </Button>
      </CardContent>
    </Card>
  );
}
