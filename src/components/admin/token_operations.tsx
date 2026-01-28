'use client';

import React, { useState } from 'react';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { useAuth } from '@/contexts/auth_context';
import { publicClient } from '@/lib/viem-public';
import { Button } from '@/components/common/button';
import ConfirmModal from '@/components/common/confirm_modal';
import { mintToAddress, burn, freeze, unfreeze, registerUser } from '@/services/token.service';

export default function TokenOperations() {
    const { user: adminUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'BALANCE' | 'MINT' | 'BURN' | 'FREEZE'>('BALANCE');

    // Form States
    const [targetAddress, setTargetAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState<string | null>(null);
    const [frozenBalance, setFrozenBalance] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // Info: (20260127) Confirmation Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                closeModal();
            }
        });
    };

    const TOKEN_ABI = ABIS.NTD_TOKEN;

    const handleExecute = async (action: 'MINT' | 'BURN' | 'FREEZE' | 'UNFREEZE') => {
        // Info: (20260127 - Admin) 雖然伺服器端有私鑰，但前端仍應檢查是否有登入，避免誤觸
        if (!adminUser) return alert('請先登入 Admin 錢包');

        setIsLoading(true);
        setStatusMessage('Processing...');

        try {
            let res;
            if (action === 'MINT') {
                if (!targetAddress || !amount) return;
                res = await mintToAddress(CONTRACT_ADDRESSES.NTD_TOKEN, targetAddress, Number(amount));

                // Info: (20260127) Handle Identity miss
                if (!res.success && res.message.includes('Identity')) {
                    setIsLoading(false); // Stop loading to show modal
                    showConfirm('Identity Required', '鑄造失敗，該用戶可能尚未註冊 Identity。是否嘗試立即註冊該用戶？', async () => {
                        setIsLoading(true); // Restart loading
                        setStatusMessage('Registering User Identity...');

                        const regResult = await registerUser(CONTRACT_ADDRESSES.NTD_TOKEN, targetAddress);
                        if (regResult.success) {
                            setStatusMessage('Identity Registered. Retrying Mint...');
                            const retryResult = await mintToAddress(CONTRACT_ADDRESSES.NTD_TOKEN, targetAddress, Number(amount));
                            if (retryResult.success) {
                                setStatusMessage(`Success: ${retryResult.message}`);
                                alert('操作成功！\n' + retryResult.message);
                                setAmount('');
                                checkBalance();
                            } else {
                                setStatusMessage(`Retry Failed: ${retryResult.message}`);
                                alert('重試失敗: ' + retryResult.message);
                            }
                        } else {
                            setStatusMessage(`Registration Failed: ${regResult.message}`);
                            alert('註冊失敗: ' + regResult.message);
                        }
                        setIsLoading(false);
                    });
                    return; // Early return to avoid standard error handling
                }
            } else if (action === 'BURN') {
                if (!targetAddress || !amount) return;
                res = await burn(CONTRACT_ADDRESSES.NTD_TOKEN, targetAddress, Number(amount));
            } else if (action === 'FREEZE') {
                if (!targetAddress || !amount) return;
                res = await freeze(CONTRACT_ADDRESSES.NTD_TOKEN, targetAddress, Number(amount));
            } else if (action === 'UNFREEZE') {
                if (!targetAddress || !amount) return;
                res = await unfreeze(CONTRACT_ADDRESSES.NTD_TOKEN, targetAddress, Number(amount));
            }

            if (res?.success) {
                setStatusMessage(`Success: ${res.message}`);
                alert('操作成功！\n' + res.message);
                setAmount('');
                if (['MINT', 'BURN', 'FREEZE', 'UNFREEZE'].includes(action)) checkBalance();
            } else {
                setStatusMessage(`Failed: ${res?.message}`);
                alert('操作失敗: ' + res?.message);
            }

        } catch (e) {
            console.error(e);
            setStatusMessage(`Error: ${(e as Error).message}`);
            alert(`操作失敗: ${(e as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const checkBalance = async () => {
        if (!targetAddress) return;
        try {
            const [bal, frozen] = await Promise.all([
                publicClient.readContract({
                    address: CONTRACT_ADDRESSES.NTD_TOKEN,
                    abi: TOKEN_ABI,
                    functionName: 'balanceOf',
                    args: [targetAddress as `0x${string}`],
                }),
                publicClient.readContract({
                    address: CONTRACT_ADDRESSES.NTD_TOKEN,
                    abi: TOKEN_ABI,
                    functionName: 'getFrozenTokens',
                    args: [targetAddress as `0x${string}`],
                })
            ]);
            setBalance(formatUnits(bal, 18));
            setFrozenBalance(formatUnits(frozen, 18));
        } catch (e) {
            console.error(e);
            setBalance('Error');
            setFrozenBalance('Error');
        }
    }

    const inputClass = "w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none";

    return (
        <div className="space-y-6">
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                onCancel={closeModal}
            />
            <div className="flex space-x-2 border-b border-slate-800 pb-2">
                {(['BALANCE', 'MINT', 'BURN', 'FREEZE'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab
                            ? 'border-b-2 border-blue-500 bg-slate-800 text-blue-400'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                {activeTab === 'BALANCE' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-200">Data Query</h3>
                        <div className="flex gap-2">
                            <label htmlFor="token-ops-balance-address" className="sr-only">Query Address</label>
                            <input
                                id="token-ops-balance-address"
                                aria-label="Query Address"
                                placeholder="Query Address (0x...)"
                                value={targetAddress}
                                onChange={(e) => setTargetAddress(e.target.value)}
                                className={inputClass}
                            />
                            <Button onClick={checkBalance} className="bg-blue-600 hover:bg-blue-500">Check</Button>
                        </div>
                        <div className="flex gap-4">
                            {balance !== null && (
                                <div className="mt-4 flex-1 rounded border border-slate-700 bg-slate-800 p-4">
                                    <p className="text-sm text-slate-400">Total Balance</p>
                                    <p className="font-mono text-xl text-white">{balance} NTD</p>
                                </div>
                            )}
                            {frozenBalance !== null && (
                                <div className="mt-4 flex-1 rounded border border-slate-700 bg-slate-800 p-4">
                                    <p className="text-sm text-orange-400">Frozen Amount</p>
                                    <p className="font-mono text-xl text-white">{frozenBalance} NTD</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'MINT' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-200">Mint Tokens</h3>
                        <p className="text-sm text-slate-500">Issue new tokens to a user. Requires user to be Verified.</p>
                        <label htmlFor="token-ops-mint-address" className="sr-only">Recipient Address</label>
                        <input
                            id="token-ops-mint-address"
                            aria-label="Recipient Address"
                            placeholder="Recipient Address (0x...)"
                            value={targetAddress}
                            onChange={(e) => setTargetAddress(e.target.value)}
                            className={inputClass}
                        />
                        <label htmlFor="token-ops-mint-amount" className="sr-only">Amount</label>
                        <input
                            id="token-ops-mint-amount"
                            aria-label="Amount"
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={inputClass}
                        />
                        <Button onClick={() => handleExecute('MINT')} disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500">
                            {isLoading ? 'Processing...' : 'Mint Tokens'}
                        </Button>
                    </div>
                )}

                {activeTab === 'BURN' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-red-400">Burn Tokens</h3>
                        <p className="text-sm text-slate-500">Destroy tokens from a user (e.g., redemption). Agent only.</p>
                        <label htmlFor="token-ops-burn-address" className="sr-only">Target Address</label>
                        <input
                            id="token-ops-burn-address"
                            aria-label="Target Address"
                            placeholder="Target Address (0x...)"
                            value={targetAddress}
                            onChange={(e) => setTargetAddress(e.target.value)}
                            className={inputClass}
                        />
                        <label htmlFor="token-ops-burn-amount" className="sr-only">Amount</label>
                        <input
                            id="token-ops-burn-amount"
                            aria-label="Amount"
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={inputClass}
                        />
                        <Button onClick={() => handleExecute('BURN')} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700">
                            {isLoading ? 'Processing...' : 'Burn Tokens'}
                        </Button>
                    </div>
                )}

                {activeTab === 'FREEZE' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-orange-400">Freeze / Unfreeze Assets</h3>
                        <p className="text-sm text-slate-500">Lock specific amount of tokens for a user (Partial Freeze).</p>
                        <label htmlFor="token-ops-freeze-address" className="sr-only">Target Address</label>
                        <input
                            id="token-ops-freeze-address"
                            aria-label="Target Address"
                            placeholder="Target Address (0x...)"
                            value={targetAddress}
                            onChange={(e) => setTargetAddress(e.target.value)}
                            className={inputClass}
                        />
                        <label htmlFor="token-ops-freeze-amount" className="sr-only">Amount</label>
                        <input
                            id="token-ops-freeze-amount"
                            aria-label="Amount"
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={inputClass}
                        />
                        <div className="flex gap-4">
                            <Button onClick={() => handleExecute('FREEZE')} disabled={isLoading} className="flex-1 bg-orange-600 hover:bg-orange-700">
                                Freeze
                            </Button>
                            <Button onClick={() => handleExecute('UNFREEZE')} disabled={isLoading} className="flex-1 bg-slate-700 hover:bg-slate-600">
                                Unfreeze
                            </Button>
                        </div>
                    </div>
                )}

                {statusMessage && <p className="mt-2 animate-pulse text-center text-xs text-blue-400">{statusMessage}</p>}
            </div>
        </div>
    );
}
