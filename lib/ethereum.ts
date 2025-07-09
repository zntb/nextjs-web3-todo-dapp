import { ethers } from 'ethers';
import ToDoABI from '@/contracts/ToDo.json';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = '0xf89fda1F6D7b849BA079599bF6bc442d56a5A560';

export const getEthereumContract = async () => {
  if (!window.ethereum) throw new Error('MetaMask not found');

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ToDoABI, signer);
};
