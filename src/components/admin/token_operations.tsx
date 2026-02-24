'use client';

import { useState, useEffect } from 'react';
import { formatUnits, parseAbiItem } from 'viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { useAuth } from '@/contexts/auth_context';
import { publicClient } from '@/lib/viem_public';
import { Button } from '@/components/common/button';
import ConfirmModal from '@/components/common/confirm_modal';
import { mintToAddress, burn, freeze, unfreeze, registerUser, forcedTransfer } from '@/services/token.service';
import { adminSettlementTransfer, adminSettlementMint } from '@/services/clearing.service';
import { buildTransferUserOp } from '@/lib/utils/user_op_builder';
import { fido2ClientService, sendUserOpToBundler } from '@/lib/auth/fido2_client';
import { encodeWebAuthnSignature, hexToBase64Url } from '@/lib/auth/crypto_utils';

type TabType = 'BALANCE' | 'MINT' | 'BURN' | 'FREEZE' | 'UNFREEZE' | 'TRANSFER' | 'USER_TRANSFER' | 'SETTLEMENT' | 'HISTORY';
// Info: (20260223 - Tzuhan) 1. 定義嚴謹的事件參數型別
type TransferArgs = { from?: string; to?: string; amount?: bigint };
type DebtArgs = { account?: string; amount?: bigint };
type MintArgs = { to?: string; amount?: bigint };

// Info: (20260223 - Tzuhan) 2. 定義可辨識聯合型別 (Discriminated Union)，徹底消滅 any
type HistoryLog =
    | { type: 'TRANSFER'; name: string; data: TransferArgs; block: number; txHash: string }
    | { type: 'DEBT_GEN'; name: string; data: DebtArgs; block: number; txHash: string }
    | { type: 'DEBT_OFFSET'; name: string; data: DebtArgs; block: number; txHash: string }
    | { type: 'MINT'; name: string; data: MintArgs; block: number; txHash: string };

interface ITokenOperationsProps {
    initialTargetAddress?: string;
    initialFromAddress?: string;
    initialTokenAddress?: string;
    initialTab?: TabType;
}

export default function TokenOperations({
    initialTargetAddress = '',
    initialFromAddress = '',
    initialTokenAddress = CONTRACT_ADDRESSES.NTD_TOKEN,
    initialTab = 'BALANCE'
}: ITokenOperationsProps) {
    const { user: adminUser } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    const [targetAddress, setTargetAddress] = useState(initialTargetAddress);
    const [sourceAddress, setSourceAddress] = useState(initialFromAddress);
    const [tokenAddress, setTokenAddress] = useState(initialTokenAddress);
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState<string | null>(null);
    const [frozenBalance, setFrozenBalance] = useState<string | null>(null);
    const [debtBalance, setDebtBalance] = useState<string | null>(null);

    // Info: (20260223 - Tzuhan) 用於儲存歷史紀錄的 State
    const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [txResult, setTxResult] = useState<{ success: boolean; hash?: string; error?: string; details?: string; } | null>(null);

    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));
    const showAlert = (title: string, message: string, onConfirm: () => void) => {
        setModalConfig({ isOpen: true, title, message, onConfirm: () => { onConfirm(); closeModal(); } });
    };

    const TOKEN_ABI = ABIS.NTD_TOKEN;

    const handleExecute = async (action: TabType) => {
        if (!adminUser) return showAlert('Error', '請先登入 Admin 錢包', () => { });
        if (action !== 'SETTLEMENT' && !tokenAddress) return showAlert('Error', 'Token Address is required', () => { });

        setIsLoading(true);
        setStatusMessage('Processing...');

        try {
            let res;
            if (action === 'MINT') {
                if (!targetAddress || !amount) return;

                // Info: (20260224 - Tzuhan) 分流: 若為平台幣 NTD_TOKEN，則走 ClearingService 自動抵銷機制
                const isNTDToken = tokenAddress.toLowerCase() === CONTRACT_ADDRESSES.NTD_TOKEN.toLowerCase();
                const mintFunc = () => isNTDToken
                    ? adminSettlementMint(targetAddress, Number(amount))
                    : mintToAddress(tokenAddress, targetAddress, Number(amount));

                res = await mintFunc();

                if (!res?.success && res?.message?.includes('Identity')) {
                    setIsLoading(false);
                    showAlert('Identity Required', '鑄造失敗，該用戶可能尚未註冊 Identity。是否嘗試立即註冊該用戶？', async () => {
                        setIsLoading(true);
                        setStatusMessage('Registering User Identity...');
                        const regResult = await registerUser(tokenAddress, targetAddress);

                        if (regResult.success) {
                            setStatusMessage('Identity Registered. Retrying Mint...');
                            const retryResult = await mintFunc();
                            if (retryResult?.success) {
                                setStatusMessage(`Success: ${retryResult.message}`);
                                showAlert('Success', '操作成功！\n' + retryResult.message, () => { });
                                setAmount('');
                                checkBalance();
                            } else {
                                setStatusMessage(`Retry Failed: ${retryResult?.message}`);
                                showAlert('Error', '重試失敗: ' + retryResult?.message, () => { });
                            }
                        } else {
                            setStatusMessage(`Registration Failed: ${regResult.message}`);
                            showAlert('Error', '註冊失敗: ' + regResult.message, () => { });
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
            } else if (action === 'SETTLEMENT') {
                if (!targetAddress || !amount) return;
                res = await adminSettlementTransfer(targetAddress, Number(amount));
            } else if (action === 'USER_TRANSFER') {
                if (!adminUser.address || !adminUser.pubKeyX || !adminUser.pubKeyY) return showAlert('Error', 'Missing Passkey details', () => { });
                if (!targetAddress || !amount) return;

                setStatusMessage('Building UserOperation...');
                const amountWei = (Number(amount) * 10 ** 18).toString();
                const userOp = await buildTransferUserOp(adminUser.address as `0x${string}`, targetAddress as `0x${string}`, amountWei, tokenAddress as `0x${string}`);

                setStatusMessage('Calculating UserOp Hash...');
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
                    abi: ABIS.ENTRY_POINT,
                    functionName: 'getUserOpHash',
                    args: [userOpStruct]
                }) as `0x${string}`;

                setStatusMessage('Please sign with Passkey...');
                const challengeBase64 = hexToBase64Url(userOpHash);

                const authentication = await fido2ClientService.startLogin({
                    challenge: challengeBase64,
                    allowCredentials: [],
                    timeout: 60000,
                });

                const signature = encodeWebAuthnSignature(authentication, BigInt(adminUser.pubKeyX), BigInt(adminUser.pubKeyY));
                userOp.signature = signature;

                setStatusMessage('Sending to Bundler...');
                const bundleRes = await sendUserOpToBundler(userOp, CONTRACT_ADDRESSES.ENTRY_POINT);

                if (bundleRes.success && bundleRes.payload?.transactionHash) {
                    res = { success: true, message: `Tx Hash: ${bundleRes.payload.transactionHash}` };
                    setTxResult({ success: true, hash: bundleRes.payload.transactionHash });
                } else {
                    const errorMsg = bundleRes.payload?.error || bundleRes.message || 'Unknown error';
                    setTxResult({ success: false, error: errorMsg });
                    throw new Error(errorMsg);
                }
            }

            if (res?.success) {
                setStatusMessage(`Success: ${res.message}`);
                if (action !== 'USER_TRANSFER') showAlert('Success', '操作成功！\n' + res.message, () => { });
                setAmount('');
                checkBalance();
                if (action === 'SETTLEMENT') fetchClearingHistory();
            } else if (res) {
                setStatusMessage(`Failed: ${res.message}`);
                showAlert('Error', '操作失敗: ' + res.message, () => { });
            }
        } catch (e) {
            console.error(e);
            setStatusMessage(`Error: ${(e as Error).message}`);
            if (action !== 'USER_TRANSFER') showAlert('Error', `操作失敗: ${(e as Error).message}`, () => { });
        } finally {
            setIsLoading(false);
        }
    };

    const checkBalance = async () => {
        if (!targetAddress || !tokenAddress) return;
        try {
            const [bal, frozen, debtBal] = await Promise.all([
                publicClient.readContract({ address: tokenAddress as `0x${string}`, abi: TOKEN_ABI, functionName: 'balanceOf', args: [targetAddress as `0x${string}`] }),
                publicClient.readContract({ address: tokenAddress as `0x${string}`, abi: TOKEN_ABI, functionName: 'getFrozenTokens', args: [targetAddress as `0x${string}`] }),
                publicClient.readContract({ address: CONTRACT_ADDRESSES.DEBIT_TOKEN as `0x${string}`, abi: TOKEN_ABI, functionName: 'balanceOf', args: [targetAddress as `0x${string}`] })
            ]);
            setBalance(formatUnits(bal, 18));
            setFrozenBalance(formatUnits(frozen, 18));
            setDebtBalance(formatUnits(debtBal, 18));
        } catch (e) {
            console.error(e);
            setBalance('Error'); setFrozenBalance('Error'); setDebtBalance('Error');
        }
    }

    const fetchClearingHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const transferLogs = await publicClient.getLogs({
                address: CONTRACT_ADDRESSES.CLEARING_SERVICE,
                event: parseAbiItem('event SettlementTransferExecuted(address indexed from, address indexed to, uint256 amount)'),
                fromBlock: 'earliest'
            });
            const debtGenLogs = await publicClient.getLogs({
                address: CONTRACT_ADDRESSES.CLEARING_SERVICE,
                event: parseAbiItem('event DebtGenerated(address indexed account, uint256 amount)'),
                fromBlock: 'earliest'
            });
            const debtOffsetLogs = await publicClient.getLogs({
                address: CONTRACT_ADDRESSES.CLEARING_SERVICE,
                event: parseAbiItem('event DebtOffset(address indexed account, uint256 amount)'),
                fromBlock: 'earliest'
            });
            const mintLogs = await publicClient.getLogs({
                address: CONTRACT_ADDRESSES.CLEARING_SERVICE,
                event: parseAbiItem('event ClearingMinted(address indexed to, uint256 amount)'),
                fromBlock: 'earliest'
            });

            const combinedLogs: HistoryLog[] = [
                ...transferLogs.map(l => ({
                    type: 'TRANSFER' as const,
                    name: '清算轉帳',
                    data: l.args as TransferArgs,
                    block: Number(l.blockNumber),
                    txHash: l.transactionHash
                })),
                ...debtGenLogs.map(l => ({
                    type: 'DEBT_GEN' as const,
                    name: '產生負債',
                    data: l.args as DebtArgs,
                    block: Number(l.blockNumber),
                    txHash: l.transactionHash
                })),
                ...debtOffsetLogs.map(l => ({
                    type: 'DEBT_OFFSET' as const,
                    name: '自動沖銷',
                    data: l.args as DebtArgs,
                    block: Number(l.blockNumber),
                    txHash: l.transactionHash
                })),
                ...mintLogs.map(l => ({
                    type: 'MINT' as const,
                    name: '平台發行',
                    data: l.args as MintArgs,
                    block: Number(l.blockNumber),
                    txHash: l.transactionHash
                })),
            ].sort((a, b) => b.block - a.block);

            setHistoryLogs(combinedLogs);
        } catch (error) {
            console.error("無法獲取歷史紀錄:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'HISTORY') {
            fetchClearingHistory();
        }

    }, [activeTab]);

    const inputClass = "w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none";

    return (
        <div className="space-y-6">
            <ConfirmModal isOpen={modalConfig.isOpen} title={modalConfig.title} message={modalConfig.message} onConfirm={modalConfig.onConfirm} onCancel={closeModal} />

            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
                {(['BALANCE', 'MINT', 'BURN', 'FREEZE', 'TRANSFER', 'USER_TRANSFER', 'SETTLEMENT', 'HISTORY'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setTxResult(null); }}
                        className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab
                            ? (tab === 'SETTLEMENT' ? 'border-b-2 border-pink-500 bg-slate-800 text-pink-400'
                                : tab === 'HISTORY' ? 'border-b-2 border-yellow-500 bg-slate-800 text-yellow-400'
                                    : 'border-b-2 border-blue-500 bg-slate-800 text-blue-400')
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                {activeTab !== 'SETTLEMENT' && activeTab !== 'HISTORY' && (
                    <div className="mb-6">
                        <label htmlFor="globalTokenAddress" className="mb-1 block text-xs font-medium text-slate-400">Token Address</label>
                        <input id="globalTokenAddress" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} className={`${inputClass} font-mono text-xs`} />
                    </div>
                )}

                {activeTab === 'BALANCE' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-200">Data Query</h3>
                        <div className="flex gap-2">
                            <input placeholder="Query Address (0x...)" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} className={inputClass} />
                            <Button onClick={checkBalance} className="bg-blue-600 hover:bg-blue-500">Check</Button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {balance !== null && (
                                <div className="mt-4 min-w-150px flex-1 rounded border border-slate-700 bg-slate-800 p-4">
                                    <p className="text-sm text-slate-400">Total Asset (NTD)</p>
                                    <p className="font-mono text-xl text-white">{balance}</p>
                                </div>
                            )}
                            {debtBalance !== null && (
                                <div className="mt-4 min-w-150px flex-1 rounded border border-red-900/50 bg-red-900/20 p-4">
                                    <p className="text-sm text-red-400">Debt (Liability)</p>
                                    <p className="font-mono text-xl text-red-100">{debtBalance}</p>
                                </div>
                            )}
                            {frozenBalance !== null && (
                                <div className="mt-4 min-w-150px flex-1 rounded border border-slate-700 bg-slate-800 p-4">
                                    <p className="text-sm text-orange-400">Frozen Amount</p>
                                    <p className="font-mono text-xl text-white">{frozenBalance}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'MINT' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-200">Mint Tokens</h3>
                        <p className="text-sm text-slate-500">Issue new tokens to a user. Requires user to be Verified.</p>
                        <input placeholder="Recipient Address (0x...)" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} className={inputClass} />
                        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
                        <Button onClick={() => handleExecute('MINT')} disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500">
                            {isLoading ? 'Processing...' : 'Mint Tokens'}
                        </Button>
                    </div>
                )}

                {activeTab === 'BURN' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-red-400">Burn Tokens</h3>
                        <p className="text-sm text-slate-500">Destroy tokens from a user. Agent only.</p>
                        <input placeholder="Target Address (0x...)" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} className={inputClass} />
                        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
                        <Button onClick={() => handleExecute('BURN')} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700">
                            {isLoading ? 'Processing...' : 'Burn Tokens'}
                        </Button>
                    </div>
                )}

                {activeTab === 'FREEZE' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-orange-400">Freeze / Unfreeze Assets</h3>
                        <p className="text-sm text-slate-500">Lock specific amount of tokens for a user.</p>
                        <input placeholder="Target Address (0x...)" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} className={inputClass} />
                        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
                        <div className="flex gap-4">
                            <Button onClick={() => handleExecute('FREEZE')} disabled={isLoading} className="flex-1 bg-orange-600 hover:bg-orange-700">Freeze</Button>
                            <Button onClick={() => handleExecute('UNFREEZE')} disabled={isLoading} className="flex-1 bg-slate-700 hover:bg-slate-600">Unfreeze</Button>
                        </div>
                    </div>
                )}

                {activeTab === 'TRANSFER' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-indigo-400">Forced Transfer</h3>
                        <p className="text-sm text-slate-500">Force move tokens between addresses. Requires Agent Role.</p>
                        <input placeholder="From Address (0x...)" value={sourceAddress} onChange={(e) => setSourceAddress(e.target.value)} className={inputClass} />
                        <input placeholder="To Address (0x...)" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} className={inputClass} />
                        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
                        <Button onClick={() => handleExecute('TRANSFER')} disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500">
                            {isLoading ? 'Processing...' : 'Transfer Tokens'}
                        </Button>
                    </div>
                )}

                {activeTab === 'USER_TRANSFER' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-teal-400">User Transfer (FIDO2)</h3>
                        <p className="text-sm text-slate-500">Transfer your own tokens using Passkey signature.</p>
                        <div className="rounded border border-teal-900/30 bg-teal-900/10 p-3">
                            <p className="text-xs text-teal-500">Sender (You): {adminUser?.address || 'Not Logged In'}</p>
                        </div>
                        <input placeholder="To Address (0x...)" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} className={inputClass} />
                        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
                        <Button onClick={() => handleExecute('USER_TRANSFER')} disabled={isLoading} className="w-full bg-teal-600 hover:bg-teal-500">
                            {isLoading ? 'Processing...' : 'Sign & Transfer'}
                        </Button>
                        {txResult && (
                            <div className={`mt-4 rounded border p-4 ${txResult.success ? 'border-green-800 bg-green-900/20' : 'border-red-800 bg-red-900/20'}`}>
                                <h4 className={`font-bold ${txResult.success ? 'text-green-400' : 'text-red-400'}`}>{txResult.success ? 'Transfer Successful' : 'Transfer Failed'}</h4>
                                {txResult.hash && <div className="mt-2 text-sm text-slate-300"><span className="block font-medium text-slate-500">Tx Hash:</span><span className="break-all font-mono">{txResult.hash}</span></div>}
                                {txResult.error && <div className="mt-2 text-sm text-red-300"><span className="block font-medium text-red-500">Error:</span>{txResult.error}</div>}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'SETTLEMENT' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-pink-400">Settlement Transfer (透支清算測試)</h3>
                        <div className="rounded border border-pink-900/30 bg-pink-900/10 p-3">
                            <p className="text-xs leading-relaxed text-pink-500">
                                測試情境說明：此轉帳將從 <b>後端 Admin 錢包</b> 發送 NTD 平台幣至目標地址。<br />
                                1. 若 Admin 餘額不足，差額將自動轉化為 Admin 的 <b>DEBT (負債)</b>，收款方仍會收到全額。<br />
                                2. 若收款方身上背有負債，系統將自動優先扣款 <b>(淨額結算)</b>。
                            </p>
                        </div>
                        <input placeholder="Recipient Target Address (0x...)" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} className={inputClass} />
                        <input type="number" placeholder="Transfer Amount (NTD)" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
                        <Button onClick={() => handleExecute('SETTLEMENT')} disabled={isLoading} className="w-full bg-pink-600 hover:bg-pink-500">
                            {isLoading ? 'Processing...' : 'Execute Settlement'}
                        </Button>
                    </div>
                )}

                {activeTab === 'HISTORY' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-yellow-400">System Clearing History (清算事件日誌)</h3>
                            <Button onClick={fetchClearingHistory} disabled={isLoadingHistory} className="bg-slate-700 px-3 py-1 text-xs hover:bg-slate-600">
                                {isLoadingHistory ? 'Refreshing...' : 'Refresh'}
                            </Button>
                        </div>
                        <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50">
                            {historyLogs.length === 0 ? (
                                <p className="py-8 text-center text-sm text-slate-500">目前無任何清算歷史紀錄</p>
                            ) : (
                                <ul className="divide-y divide-slate-700/50">
                                    {historyLogs.map((log, index) => (
                                        <li key={`${log.txHash}-${index}`} className="p-4 transition-colors hover:bg-slate-800">
                                            <div className="mb-2 flex items-start justify-between">
                                                <span className={`rounded border px-2 py-0.5 text-xs font-bold ${log.type === 'TRANSFER' ? 'border-blue-800 bg-blue-900/30 text-blue-400' :
                                                        log.type === 'MINT' ? 'border-indigo-800 bg-indigo-900/30 text-indigo-400' :
                                                            log.type === 'DEBT_GEN' ? 'border-red-800 bg-red-900/30 text-red-400' :
                                                                'border-green-800 bg-green-900/30 text-green-400'
                                                    }`}>
                                                    {log.name}
                                                </span>
                                                <span className="font-mono text-xs text-slate-500">Block: {log.block}</span>
                                            </div>
                                            <div className="space-y-1 text-sm text-slate-300">
                                                {log.type === 'TRANSFER' && (
                                                    <>
                                                        <p><span className="text-slate-500">From:</span> {log.data.from}</p>
                                                        <p><span className="text-slate-500">To:</span> {log.data.to}</p>
                                                        <p><span className="text-slate-500">Amount:</span> <span className="font-bold text-white">{formatUnits(log.data.amount || BigInt(0), 18)} NTD</span></p>
                                                    </>
                                                )}
                                                {(log.type === 'DEBT_GEN' || log.type === 'DEBT_OFFSET') && (
                                                    <>
                                                        <p><span className="text-slate-500">Account:</span> {log.data.account}</p>
                                                        <p><span className="text-slate-500">Amount:</span><span className="font-bold text-white">{formatUnits(log.data.amount || BigInt(0), 18)} DEBT</span></p>
                                                    </>
                                                )}
                                                {log.type === 'MINT' && (
                                                    <>
                                                        <p><span className="text-slate-500">To:</span> {log.data.to}</p>
                                                        <p><span className="text-slate-500">Amount:</span> <span className="font-bold text-white">{formatUnits(log.data.amount || BigInt(0), 18)} NTD</span></p>
                                                    </>
                                                )}
                                            </div>
                                            <div className="mt-2 truncate font-mono text-xs text-slate-600">
                                                Tx: {log.txHash}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {statusMessage && <p className="mt-2 animate-pulse text-center text-xs text-blue-400">{statusMessage}</p>}
            </div>
        </div>
    );
}