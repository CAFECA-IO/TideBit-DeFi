'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDebtTokenUsers } from '@/services/admin.service';
import { Button } from '@/components/common/button';
import ConfirmModal from '@/components/common/confirm_modal';
import { FiCopy, FiLock, FiUnlock } from 'react-icons/fi';
import { formatUnits } from 'viem';

interface IDebtUser {
    id: string;
    name: string | null;
    address: string;
    isVerified: boolean;
    identityAddress: string | null;
    balance: string;
    frozen: string;
    isWalletFrozen: boolean;
}

export default function DebtTokenUserList() {
    const [users, setUsers] = useState<IDebtUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    const showAlert = useCallback((title: string, message: string, onConfirm: () => void) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                closeModal();
            }
        });
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            // Info: (20260224 - Tzuhan) Using the new debt service function
            const data = await getDebtTokenUsers(page, 10);
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
            showAlert('Error', 'Failed to fetch debt token users', () => { });
        } finally {
            setLoading(false);
        }
    }, [page, showAlert]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="space-y-6">
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                onCancel={closeModal}
            />
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Platform Debt Management</h2>
                    <p className="mt-1 text-sm text-slate-400">Manage users holding DEBT token (borrowers).</p>
                </div>
                <Button onClick={fetchUsers} disabled={loading} variant="outline" size="sm" className="border-red-900 text-red-400 hover:bg-red-900/30 hover:text-red-300">
                    Refresh
                </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-red-900/40 bg-slate-900/60">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-red-950/20 text-xs font-medium uppercase text-red-500/80">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Debt Balance</th>
                            <th className="px-6 py-3 text-right">Frozen</th>
                            <th className="px-6 py-3 text-center">Wallet Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-red-900/30 border-t border-red-900/40">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-red-500/70">Loading Debtors...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-slate-500">No users with DEBT found.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="bg-slate-950/30 hover:bg-red-950/20">
                                    <td className="px-6 py-4" aria-label="User Details">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-white">{user.name || 'Unnamed User'}</span>
                                            <div className="flex items-center gap-1 font-mono text-xs text-slate-500">
                                                <span title={user.address}>
                                                    {user.address.slice(0, 6)}...{user.address.slice(-4)}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(user.address)}
                                                    className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                                                    title="Copy Address"
                                                    aria-label="Copy Address"
                                                >
                                                    <span className="sr-only">Copy Address</span>
                                                    <FiCopy size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isVerified ? (
                                            <span className="rounded border border-green-800 bg-green-900/50 px-1.5 py-0.5 text-[10px] font-bold text-green-400">
                                                VERIFIED
                                            </span>
                                        ) : user.identityAddress ? (
                                            <span className="rounded border border-yellow-800 bg-yellow-900/50 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400">
                                                UNVERIFIED
                                            </span>
                                        ) : (
                                            <span className="rounded border border-red-800 bg-red-900/50 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                                                NO ID
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-mono font-bold text-red-400">
                                            {formatUnits(BigInt(user.balance), 18)}
                                        </span>
                                        <span className="ml-1 text-xs font-bold text-red-500/80">DEBT</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {BigInt(user.frozen) > BigInt(0) ? (
                                            <span className="font-mono font-bold text-orange-400">
                                                {formatUnits(BigInt(user.frozen), 18)}
                                            </span>
                                        ) : (
                                            <span className="text-slate-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {user.isWalletFrozen ? (
                                            <div className="flex items-center justify-center gap-1 text-red-500" title="Wallet Frozen">
                                                <FiLock /> <span className="text-xs font-bold">FROZEN</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-1 text-slate-600" title="Active">
                                                <FiUnlock />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Info: (20260224 - Tzuhan) Pagination */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
