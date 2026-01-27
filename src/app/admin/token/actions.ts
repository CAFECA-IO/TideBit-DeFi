'use server';

import { parseAbi, parseUnits } from 'viem';
import { walletClient, account } from '@/lib/viem';
import { NTD_TOKEN_ADDRESS } from '@/lib/viem-public';

const TOKEN_ABI = parseAbi([
  'function mint(address to, uint256 amount) external',
  'function forcedTransfer(address from, address to, uint256 amount) external returns (bool)',
  'function pause() external',
  'function unpause() external',
  'function setFrozen(address user, uint256 amount) external',
  'function burn(uint256 amount) external',
]);

function getClient() {
  if (!walletClient || !account) {
    throw new Error('Server Wallet not configured. Check ISUNCOIN_PRIVATE_KEY.');
  }
  return { client: walletClient, account };
}

export async function adminMint(to: string, amount: string, decimals: number) {
  const { client, account } = getClient();
  const hash = await client.writeContract({
    address: NTD_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'mint',
    args: [to as `0x${string}`, parseUnits(amount, decimals)],
    account,
  });
  return hash;
}

export async function adminPause() {
  const { client, account } = getClient();
  return await client.writeContract({
    address: NTD_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'pause',
    args: [],
    account,
  });
}

export async function adminUnpause() {
  const { client, account } = getClient();
  return await client.writeContract({
    address: NTD_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'unpause',
    args: [],
    account,
  });
}

export async function adminForcedTransfer(
  from: string,
  to: string,
  amount: string,
  decimals: number
) {
  const { client, account } = getClient();
  return await client.writeContract({
    address: NTD_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'forcedTransfer',
    args: [from as `0x${string}`, to as `0x${string}`, parseUnits(amount, decimals)],
    account,
  });
}

export async function adminSetFrozen(target: string, amount: string, decimals: number) {
  const { client, account } = getClient();
  return await client.writeContract({
    address: NTD_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'setFrozen',
    args: [target as `0x${string}`, parseUnits(amount, decimals)],
    account,
  });
}
