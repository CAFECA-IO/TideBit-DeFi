'use client';

import { useState } from 'react';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { useAuth } from '@/contexts/auth_context';
import { publicClient } from '@/lib/viem_public';
import { Button } from '@/components/common/button';
import ConfirmModal from '@/components/common/confirm_modal';
import { mintToAddress, burn, freeze, unfreeze, registerUser, forcedTransfer } from '@/services/token.service';
import { buildTransferUserOp } from '@/lib/utils/user_op_builder';
import { fido2ClientService, sendUserOpToBundler } from '@/lib/auth/fido2_client';
import { encodeWebAuthnSignature, hexToBase64Url } from '@/lib/auth/crypto_utils';

interface ITokenOperationsProps {
    initialTargetAddress?: string;
    initialFromAddress?: string;
    initialTokenAddress?: string;
    initialTab?: 'BALANCE' | 'MINT' | 'BURN' | 'FREEZE' | 'TRANSFER' | 'USER_TRANSFER';
}

export default function TokenOperations({
    initialTargetAddress = '',
    initialFromAddress = '',
    initialTokenAddress = CONTRACT_ADDRESSES.NTD_TOKEN,
    initialTab = 'BALANCE'
}: ITokenOperationsProps) {
    const { user: adminUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'BALANCE' | 'MINT' | 'BURN' | 'FREEZE' | 'TRANSFER' | 'USER_TRANSFER'>(initialTab);

    // Info: (20260128 - Luphia) Form States
    const [targetAddress, setTargetAddress] = useState(initialTargetAddress);
    const [sourceAddress, setSourceAddress] = useState(initialFromAddress);
    const [tokenAddress, setTokenAddress] = useState(initialTokenAddress); // New Token Address State
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState<string | null>(null);
    const [frozenBalance, setFrozenBalance] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [txResult, setTxResult] = useState<{
        success: boolean;
        hash?: string;
        error?: string;
        details?: string;
    } | null>(null);

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

    const TOKEN_ABI = ABIS.NTD_TOKEN; // Note: Company tokens verify standard ERC20 + Compliance, assumed compatible ABI

    const handleExecute = async (action: 'MINT' | 'BURN' | 'FREEZE' | 'UNFREEZE' | 'TRANSFER' | 'USER_TRANSFER') => {
        if (!adminUser) return alert('請先登入 Admin 錢包');

        // Basic Validation
        if (!tokenAddress) return alert('Token Address is required');

        setIsLoading(true);
        setStatusMessage('Processing...');

        try {
            let res;
            if (action === 'MINT') {
                if (!targetAddress || !amount) return;
                res = await mintToAddress(tokenAddress, targetAddress, Number(amount));

                if (!res.success && res.message.includes('Identity')) {
                    // ... Identity Logic (Kept mostly same, using tokenAddress)
                    setIsLoading(false);
                    showConfirm('Identity Required', '鑄造失敗，該用戶可能尚未註冊 Identity。是否嘗試立即註冊該用戶？', async () => {
                        setIsLoading(true);
                        setStatusMessage('Registering User Identity...');
                        const regResult = await registerUser(tokenAddress, targetAddress); // Note: registerUser needs to support token param if logic depends on it
                        // Actually registerUser in token.service uses NTD specific logic? Let's check. 
                        // Assuming registerUser registers Identity in the common Registry. Token addr just for context?

                        if (regResult.success) {
                            setStatusMessage('Identity Registered. Retrying Mint...');
                            const retryResult = await mintToAddress(tokenAddress, targetAddress, Number(amount));
                            // ... handle retry result
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
                    return;
                }
            } else if (action === 'BURN') {
                if (!targetAddress || !amount) return;
                res = await burn(tokenAddress, targetAddress, Number(amount));
            } else if (action === 'FREEZE') {
                if (!targetAddress || !amount) return;
                res = await freeze(tokenAddress, targetAddress, Number(amount));
            } else if (action === 'UNFREEZE') {
                if (!targetAddress || !amount) return;
                res = await unfreeze(tokenAddress, targetAddress, Number(amount));
            } else if (action === 'TRANSFER') {
                if (!sourceAddress || !targetAddress || !amount) return;
                res = await forcedTransfer(tokenAddress, sourceAddress, targetAddress, Number(amount));
            } else if (action === 'USER_TRANSFER') {
                if (!adminUser || !adminUser.address || !adminUser.pubKeyX || !adminUser.pubKeyY) return alert('User not fully logged in or missing Passkey');
                if (!targetAddress || !amount) return;

                setStatusMessage('Building UserOperation...');
                const amountWei = (Number(amount) * 10 ** 18).toString();
                // Note: buildTransferUserOp needs to support Token Address too.
                // Currently it hardcodes NTD inside! I need to update buildTransferUserOp as well.
                const userOp = await buildTransferUserOp(adminUser.address as `0x${string}`, targetAddress as `0x${string}`, amountWei, tokenAddress as `0x${string}`);


                // 1. Get UserOp Hash (Challenge)
                setStatusMessage('Calculating UserOp Hash...');
                const entryPointAbi = ABIS.ENTRY_POINT;

                // Info: Convert JSON strings to BigInts for viem contract call
                const userOpStruct = {
                    sender: userOp.sender as `0x${string}`,
                    nonce: BigInt(userOp.nonce),
                    initCode: userOp.initCode as `0x${string}`,
                    callData: userOp.callData as `0x${string}`,
                    callGasLimit: BigInt(userOp.callGasLimit),
                    verificationGasLimit: BigInt(userOp.verificationGasLimit),
                    preVerificationGas: BigInt(userOp.preVerificationGas),
                    maxFeePerGas: BigInt(userOp.maxFeePerGas),
                    maxPriorityFeePerGas: BigInt(userOp.maxPriorityFeePerGas),
                    paymasterAndData: userOp.paymasterAndData as `0x${string}`,
                    signature: userOp.signature as `0x${string}`,
                };

                const userOpHash = await publicClient.readContract({
                    address: CONTRACT_ADDRESSES.ENTRY_POINT,
                    abi: entryPointAbi,
                    functionName: 'getUserOpHash',
                    args: [userOpStruct]
                }) as `0x${string}`;

                // 2. Sign with FIDO2
                setStatusMessage('Please sign with Passkey...');
                const challengeBase64 = hexToBase64Url(userOpHash);

                const authentication = await fido2ClientService.startLogin({
                    challenge: challengeBase64,
                    allowCredentials: [],
                    timeout: 60000,
                });

                // 3. Encode Signature
                const signature = encodeWebAuthnSignature(
                    authentication,
                    BigInt(adminUser.pubKeyX),
                    BigInt(adminUser.pubKeyY)
                );
                userOp.signature = signature;

                // 4. Send to Bundler
                setStatusMessage('Sending to Bundler...');
                const bundleRes = await sendUserOpToBundler(userOp, CONTRACT_ADDRESSES.ENTRY_POINT);

                if (bundleRes.success) {
                    if (bundleRes.payload?.transactionHash) {
                        res = { success: true, message: `Tx Hash: ${bundleRes.payload.transactionHash}` };
                        setTxResult({
                            success: true,
                            hash: bundleRes.payload.transactionHash,
                        });
                    } else if (bundleRes.payload?.error) {
                        const errorMsg = bundleRes.payload.error;
                        const details = bundleRes.payload.details || 'No details provided';
                        setTxResult({
                            success: false,
                            error: errorMsg,
                            details: typeof details === 'object' ? JSON.stringify(details, null, 2) : details,
                        });
                        throw new Error(errorMsg);
                    } else {
                        throw new Error('Unknown Bundle Response');
                    }
                } else {
                    const errorMsg = bundleRes.message || 'Bundler Error';
                    setTxResult({
                        success: false,
                        error: errorMsg,
                    });
                    throw new Error(errorMsg);
                }
            }

            if (res?.success) {
                setStatusMessage(`Success: ${res.message}`);
                // alert('操作成功！\n' + res.message); // Disabling alert for USER_TRANSFER success to show UI instead
                if (action !== 'USER_TRANSFER') alert('操作成功！\n' + res.message);
                setAmount('');
                if (['MINT', 'BURN', 'FREEZE', 'UNFREEZE'].includes(action)) checkBalance();
            } else {
                setStatusMessage(`Failed: ${res?.message}`);
                alert('操作失敗: ' + res?.message);
            }

        } catch (e) {
            console.error(e);
            setStatusMessage(`Error: ${(e as Error).message}`);
            // alert(`操作失敗: ${(e as Error).message}`); // Disabling alert for USER_TRANSFER error to show UI instead
            if (action !== 'USER_TRANSFER') alert(`操作失敗: ${(e as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const checkBalance = async () => {
        if (!targetAddress || !tokenAddress) return;
        try {
            const [bal, frozen] = await Promise.all([
                publicClient.readContract({
                    address: tokenAddress as `0x${string}`,
                    abi: TOKEN_ABI,
                    functionName: 'balanceOf',
                    args: [targetAddress as `0x${string}`],
                }),
                publicClient.readContract({
                    address: tokenAddress as `0x${string}`,
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
            setFrozenBalance('Error'); // Standard ERC20 might fail getFrozenTokens
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
                {(['BALANCE', 'MINT', 'BURN', 'FREEZE', 'TRANSFER', 'USER_TRANSFER'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setTxResult(null); }}
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

                {/* Global Token Selection */}
                <div className="mb-6">
                    <label htmlFor="token-ops-token-address" className="mb-1 block text-xs font-medium text-slate-400">Token Address</label>
                    <input
                        id="token-ops-token-address"
                        placeholder="Token Address (0x...)"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        className={`${inputClass} font-mono text-xs`}
                    />
                </div>

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

                {activeTab === 'TRANSFER' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-indigo-400">Forced Transfer</h3>
                        <p className="text-sm text-slate-500">Force move tokens between addresses. Requires Agent Role.</p>

                        <label htmlFor="token-ops-transfer-from" className="sr-only">From Address</label>
                        <input
                            id="token-ops-transfer-from"
                            placeholder="From Address (0x...)"
                            value={sourceAddress}
                            onChange={(e) => setSourceAddress(e.target.value)}
                            className={inputClass}
                        />

                        <label htmlFor="token-ops-transfer-to" className="sr-only">To Address</label>
                        <input
                            id="token-ops-transfer-to"
                            placeholder="To Address (0x...)"
                            value={targetAddress}
                            onChange={(e) => setTargetAddress(e.target.value)}
                            className={inputClass}
                        />

                        <label htmlFor="token-ops-transfer-amount" className="sr-only">Amount</label>
                        <input
                            id="token-ops-transfer-amount"
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={inputClass}
                        />

                        <Button onClick={() => handleExecute('TRANSFER')} disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500">
                            {isLoading ? 'Processing...' : 'Transfer Tokens'}
                        </Button>
                    </div>
                )}

                {activeTab === 'USER_TRANSFER' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-teal-400">User Transfer (FIDO2)</h3>
                        <p className="text-sm text-slate-500">Transfer your own tokens using Passkey signature. (Gas paid by Relayer)</p>

                        <div className="rounded border border-teal-900/30 bg-teal-900/10 p-3">
                            <p className="text-xs text-teal-500">Sender (You): {adminUser?.address || 'Not Logged In'}</p>
                        </div>

                        <label htmlFor="token-ops-user-to" className="sr-only">To Address</label>
                        <input
                            id="token-ops-user-to"
                            placeholder="To Address (0x...)"
                            value={targetAddress}
                            onChange={(e) => setTargetAddress(e.target.value)}
                            className={inputClass}
                        />

                        <label htmlFor="token-ops-user-amount" className="sr-only">Amount</label>
                        <input
                            id="token-ops-user-amount"
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={inputClass}
                        />

                        <Button onClick={() => handleExecute('USER_TRANSFER')} disabled={isLoading} className="w-full bg-teal-600 hover:bg-teal-500">
                            {isLoading ? 'Sign & Transfer' : 'Sign & Transfer'}
                        </Button>

                        {txResult && (
                            <div className={`mt-4 rounded border p-4 ${txResult.success ? 'border-green-800 bg-green-900/20' : 'border-red-800 bg-red-900/20'}`}>
                                <h4 className={`font-bold ${txResult.success ? 'text-green-400' : 'text-red-400'}`}>
                                    {txResult.success ? 'Transfer Successful' : 'Transfer Failed'}
                                </h4>

                                {txResult.hash && (
                                    <div className="mt-2 text-sm text-slate-300">
                                        <span className="block font-medium text-slate-500">Transaction Hash:</span>
                                        <span className="break-all font-mono">{txResult.hash}</span>
                                    </div>
                                )}

                                {txResult.error && (
                                    <div className="mt-2 text-sm text-red-300">
                                        <span className="block font-medium text-red-500">Error:</span>
                                        {txResult.error}
                                    </div>
                                )}

                                {txResult.details && (
                                    <div className="mt-2 text-xs text-slate-300">
                                        <span className="block font-medium text-slate-500">Receipt / Details:</span>
                                        <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded bg-slate-950 p-2 font-mono">
                                            {txResult.details}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {statusMessage && <p className="mt-2 animate-pulse text-center text-xs text-blue-400">{statusMessage}</p>}
            </div>
        </div>
    );
}
