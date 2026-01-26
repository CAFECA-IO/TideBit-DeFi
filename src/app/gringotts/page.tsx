'use client';

import { useState, useEffect } from 'react';
import { createPublicClient, http, parseAbi, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import BalanceChecker from '@/components/token/balance_checker';
import { deploySystem, mintToAddress, registerUser } from '@/services/token.service';
import ConfirmModal from '@/components/common/confirm_modal';

const RPC_URL = 'https://mainnet.isuncoin.com';

const abi = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function identityRegistry() view returns (address)',
  'function compliance() view returns (address)',
  'function onchainID() view returns (address)',
  'function paused() view returns (bool)',
  'function topicsRegistry() view returns (address)',
  'function issuersRegistry() view returns (address)',
  'function identityStorage() view returns (address)',
]);

const SELECTORS = {
  isPaused: '0xb1393717',
  identityRegistry: '0x32333068',
  compliance: '0xc53956f4',
  onchainID: '0x011e036e',
} as const;

interface ITwdData {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  identityRegistry: string;
  compliance: string;
  onchainID: string;
  isPaused: boolean;
  isPausedError: boolean;
  error?: string;
  claimTopicsRegistry: string;
  trustedIssuersRegistry: string;
  identityRegistryStorage: string;
}

// Info: (20260126 - Luphia) Client-side data fetching
async function getTwdData(address: string): Promise<ITwdData | { error: string }> {
  if (!address || !address.startsWith('0x')) return { error: 'Invalid Address' };

  const client = createPublicClient({
    chain: mainnet,
    transport: http(RPC_URL),
  });

  try {
    const [
      nameRes,
      symbolRes,
      decimalsRes,
      totalSupplyRes,
      irRes,
      compRes,
      onchainRes,
      pausedRes,
    ] = await Promise.allSettled([
      client.readContract({ address: address as `0x${string}`, abi, functionName: 'name' }),
      client.readContract({ address: address as `0x${string}`, abi, functionName: 'symbol' }),
      client.readContract({ address: address as `0x${string}`, abi, functionName: 'decimals' }),
      client.readContract({ address: address as `0x${string}`, abi, functionName: 'totalSupply' }),
      client.readContract({ address: address as `0x${string}`, abi, functionName: 'identityRegistry' }),
      client.readContract({ address: address as `0x${string}`, abi, functionName: 'compliance' }),
      client.readContract({ address: address as `0x${string}`, abi, functionName: 'onchainID' }),
      client.readContract({ address: address as `0x${string}`, abi, functionName: 'paused' }),
    ]);

    const name = nameRes.status === 'fulfilled' ? nameRes.value : 'Error';
    const symbol = symbolRes.status === 'fulfilled' ? symbolRes.value : 'Error';
    const decimals = decimalsRes.status === 'fulfilled' ? decimalsRes.value : 18;
    const totalSupply = totalSupplyRes.status === 'fulfilled' ? totalSupplyRes.value : BigInt(0);
    const identityRegistry = irRes.status === 'fulfilled' ? irRes.value : 'Not Available';
    const compliance = compRes.status === 'fulfilled' ? compRes.value : 'Not Available';
    const onchainID = onchainRes.status === 'fulfilled' ? onchainRes.value : 'Not Available';

    let claimTopicsRegistry = 'Not Available';
    let trustedIssuersRegistry = 'Not Available';
    let identityRegistryStorage = 'Not Available';

    if (identityRegistry !== 'Not Available') {
      const [ctrRes, tirRes, irsRes] = await Promise.allSettled([
        client.readContract({ address: identityRegistry as `0x${string}`, abi, functionName: 'topicsRegistry' }),
        client.readContract({ address: identityRegistry as `0x${string}`, abi, functionName: 'issuersRegistry' }),
        client.readContract({ address: identityRegistry as `0x${string}`, abi, functionName: 'identityStorage' }),
      ]);
      if (ctrRes.status === 'fulfilled') claimTopicsRegistry = ctrRes.value;
      if (tirRes.status === 'fulfilled') trustedIssuersRegistry = tirRes.value;
      if (irsRes.status === 'fulfilled') identityRegistryStorage = irsRes.value;
    }

    let isPaused = false;
    let isPausedError = false;

    if (pausedRes.status === 'fulfilled') {
      isPaused = pausedRes.value;
    } else {
      try {
        const rawPaused = await client.call({ to: address as `0x${string}`, data: SELECTORS.isPaused as `0x${string}` });
        if (rawPaused && rawPaused.data) {
          isPaused = BigInt(rawPaused.data) !== BigInt(0);
        } else {
          isPausedError = true;
        }
      } catch {
        isPausedError = true;
      }
    }

    return {
      name,
      symbol,
      decimals,
      totalSupply,
      identityRegistry,
      compliance,
      onchainID,
      isPaused,
      isPausedError,
      claimTopicsRegistry,
      trustedIssuersRegistry,
      identityRegistryStorage
    };
  } catch (error) {
    console.error('Error fetching TWD data:', error);
    return { error: (error as Error).message || String(error) };
  }
}

export default function GringottsPage() {
  // Info: (20260126 - Luphia) State for Deployment Parameters
  const [deployParams, setDeployParams] = useState({
    name: 'New Taiwan Dollar',
    symbol: 'TWD',
    decimals: 18,
  });

  // Info: (20260126 - Luphia) State for System
  const [currentAddress, setCurrentAddress] = useState('');
  const [data, setData] = useState<ITwdData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [deployStatus, setDeployStatus] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  // Info: (20260126 - Luphia) Minting State
  const [mintTarget, setMintTarget] = useState('');
  const [mintAmount, setMintAmount] = useState('1000');
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState('');

  // Info: (20260126 - Luphia) Modal State
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });
  const openModal = (title: string, message: string, onConfirm: () => void) => setModalConfig({ isOpen: true, title, message, onConfirm });
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  useEffect(() => {
    // Info: (20260126 - Luphia) Attempt to load from URL on mount
    const params = new URLSearchParams(window.location.search);
    const addr = params.get('address');
    if (addr) {
      setCurrentAddress(addr);
      fetchData(addr);
    }
  }, []);

  const fetchData = async (addr: string) => {
    setIsLoadingData(true);
    const result = await getTwdData(addr);
    if ('error' in result) {
      setData(null);
    } else {
      setData(result as ITwdData);
    }
    setIsLoadingData(false);
  };

  const handleDeploy = async () => {
    openModal('Confirm Deployment', `Deploy '${deployParams.name}' (${deployParams.symbol})?`, async () => {
      closeModal();
      setIsDeploying(true);
      setDeployStatus('Deploying system...');
      try {
        const res = await deploySystem(deployParams.name, deployParams.symbol, deployParams.decimals);
        if (res.success && res.data) {
          const newToken = (res.data as { token: string }).token;
          setDeployStatus(`Success! Token: ${newToken}`);
          setCurrentAddress(newToken);
          // Info: (20260126 - Luphia) Update URL without reload
          window.history.pushState({}, '', `?address=${newToken}`);
          fetchData(newToken);
        } else {
          setDeployStatus(`Failed: ${res.message}`);
        }
      } catch (e) {
        setDeployStatus(`Error: ${e}`);
      } finally {
        setIsDeploying(false);
      }
    });
  };

  const handleMint = async () => {
    if (!currentAddress) return;
    setIsMinting(true);
    setMintStatus('Minting...');
    try {
      const res = await mintToAddress(currentAddress, mintTarget, Number(mintAmount));
      if (res.success) {
        setMintStatus(`Success: ${res.message}`);
        fetchData(currentAddress); // Info: (20260126 - Luphia) Refresh data
      } else {
        if (res.message.includes('Identity')) {
          setMintStatus('Identity required. Prompting registration...');
          openModal('Identity Required', 'User needs an Identity. Register now?', async () => {
            closeModal();
            setMintStatus('Registering Identity...');
            const regRes = await registerUser(currentAddress, mintTarget);
            if (regRes.success) {
              setMintStatus('Identity registered. Retrying mint...');
              const retryRes = await mintToAddress(currentAddress, mintTarget, Number(mintAmount));
              setMintStatus(retryRes.success ? `Success: ${retryRes.message}` : `Retry Failed: ${retryRes.message}`);
              fetchData(currentAddress);
            } else {
              setMintStatus(`Registration Failed: ${regRes.message}`);
            }
          })
        } else {
          setMintStatus(`Failed: ${res.message}`);
        }
      }
    } catch (e) {
      setMintStatus(`Error: ${e}`);
    } finally {
      // Info: (20260126 - Luphia) If modal wasn't opened (which handles its own state), stop loading
      if (!mintStatus.includes('registering')) { // Info: (20260126 - Luphia) simplistic check
        setIsMinting(false);
      }
      // Info: (20260126 - Luphia) Note: state updates are async, simpler to just set false unless we know we are in a chain
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <ConfirmModal isOpen={modalConfig.isOpen} title={modalConfig.title} message={modalConfig.message} onConfirm={modalConfig.onConfirm} onCancel={closeModal} />

      <div className="mx-auto max-w-4xl space-y-8">
        {/* Info: (20260126 - Luphia) Header */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-4xl font-bold text-transparent">
            Gringotts Vault
          </h1>
          <p className="mt-2 text-slate-400">ERC-3643 System Deployment & Management</p>
          {currentAddress && <div className="mt-1 font-mono text-xs text-slate-600">Active Contract: {currentAddress}</div>}
        </div>

        {/* Info: (20260126 - Luphia) Deployment Section - Always Visible */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-semibold text-pink-400">System Deployment</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label htmlFor="token-name" className="text-xs text-slate-400">Token Name</label>
              <input id="token-name" type="text" value={deployParams.name} onChange={e => setDeployParams({ ...deployParams, name: e.target.value })} className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-pink-500" aria-label="Token Name" />
            </div>
            <div className="space-y-1">
              <label htmlFor="token-symbol" className="text-xs text-slate-400">Symbol</label>
              <input id="token-symbol" type="text" value={deployParams.symbol} onChange={e => setDeployParams({ ...deployParams, symbol: e.target.value })} className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-pink-500" aria-label="Token Symbol" />
            </div>
            <div className="space-y-1">
              <label htmlFor="token-decimals" className="text-xs text-slate-400">Decimals</label>
              <input id="token-decimals" type="number" value={deployParams.decimals} onChange={e => setDeployParams({ ...deployParams, decimals: Number(e.target.value) })} className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-pink-500" aria-label="Token Decimals" />
            </div>
          </div>
          <button onClick={handleDeploy} disabled={isDeploying} className="mt-4 w-full rounded bg-pink-600 px-4 py-2 font-bold text-white transition hover:bg-pink-500 disabled:opacity-50">
            {isDeploying ? 'Deploying...' : 'Deploy New System'}
          </button>
          {deployStatus && <div className="mt-2 font-mono text-xs text-yellow-300">{deployStatus}</div>}
        </section>

        {/* Info: (20260126 - Luphia) Loading State */}
        {isLoadingData && (
          <div className="flex items-center justify-center py-12">
            <div className="size-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <span className="ml-3 font-mono text-sm text-indigo-400">Fetching chain data...</span>
          </div>
        )}

        {/* Info: (20260126 - Luphia) Conditional Sections */}
        {!isLoadingData && data && (
          <>
            {/* Info: (20260126 - Luphia) Minting Section (Replaces AdminPanel for compactness/integration) */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-xl font-semibold text-indigo-400">Mint Facet</h2>
              <div className="flex flex-col gap-3 md:flex-row">
                <label htmlFor="mint-recipient" className="sr-only">Recipient Address</label>
                <input id="mint-recipient" type="text" placeholder="Recipient (0x...)" value={mintTarget} onChange={e => setMintTarget(e.target.value)} className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" aria-label="Mint Recipient Address" />

                <label htmlFor="mint-amount" className="sr-only">Amount</label>
                <input id="mint-amount" type="number" placeholder="Amount" value={mintAmount} onChange={e => setMintAmount(e.target.value)} className="w-32 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" aria-label="Mint Amount" />

                <button onClick={handleMint} disabled={isMinting || !mintTarget} className="rounded bg-indigo-600 px-6 py-2 font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50">
                  {isMinting ? 'Minting' : 'Mint'}
                </button>
              </div>
              {mintStatus && <div className="mt-2 font-mono text-xs text-indigo-300">{mintStatus}</div>}
            </section>

            <BalanceChecker tokenAddress={currentAddress} />

            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-xl font-semibold text-blue-400">Metadata</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <InfoCard label="Name" value={data.name} selector="name()" />
                <InfoCard label="Symbol" value={data.symbol} selector="symbol()" />
                <InfoCard label="Decimals" value={data.decimals.toString()} selector="decimals()" />
                <InfoCard label="Total Supply" value={formatUnits(data.totalSupply, data.decimals)} subValue={`Raw: ${data.totalSupply}`} selector="totalSupply()" />
              </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-xl font-semibold text-purple-400">ERC-3643 Integrietires</h2>
              <div className="space-y-4">
                <AddressRow label="Identity Registry" address={data.identityRegistry} selector="identityRegistry()" />
                <AddressRow label="Compliance" address={data.compliance} selector="compliance()" />
                <AddressRow label="ONCHAINID" address={data.onchainID} selector="onchainID()" />
                <div className="my-2 border-t border-slate-800 pt-2"></div>
                <AddressRow label="Topics Registry" address={data.claimTopicsRegistry} selector="IR.topicsRegistry()" />
                <AddressRow label="Trusted Issuers" address={data.trustedIssuersRegistry} selector="IR.trustedIssuersRegistry()" />
                <AddressRow label="Storage" address={data.identityRegistryStorage} selector="IR.identityStorage()" />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value, subValue, selector }: { label: string, value: string, subValue?: string, selector: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
      <div className="mb-2 flex items-start justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="font-mono text-[10px] text-slate-600">{selector}</span>
      </div>
      <div className="break-all font-mono text-lg font-medium text-white">{value}</div>
      {subValue && <div className="mt-1 font-mono text-xs text-slate-500">{subValue}</div>}
    </div>
  )
}

function AddressRow({ label, address, selector }: { label: string, address: string, selector: string }) {
  const isError = address === 'Not Available' || address === 'Error';
  return (
    <div className="flex flex-col justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/50 p-4 md:flex-row md:items-center">
      <div className="flex items-center gap-2">
        <span className="text-slate-300">{label}</span>
        <span className="rounded bg-slate-900 px-1 font-mono text-[10px] text-slate-600">{selector}</span>
      </div>
      <div className={`break-all font-mono text-sm md:text-base ${isError ? 'text-red-400' : 'text-blue-300'}`}>
        {address}
      </div>
    </div>
  )
}
