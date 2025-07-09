'use client';

import { useState, useEffect } from 'react';

export default function ConnectButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkIfConnected = async () => {
    if (!window.ethereum) return;
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  };

  const connectWallet = async () => {
    setError(null);
    if (!window.ethereum) {
      setError('MetaMask not installed.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Connection failed');
    }
  };

  useEffect(() => {
    checkIfConnected();

    // Optional: listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <div>
      {account ? (
        <p className='text-green-600'>
          ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className='bg-blue-600 text-white px-4 py-2 rounded'
        >
          Connect Wallet
        </button>
      )}
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
