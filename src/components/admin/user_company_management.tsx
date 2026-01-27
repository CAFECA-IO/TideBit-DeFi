'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getUsersWithCompanies, deployCompanyToken, mintCompanyToken, type IAdminUser } from '@/services/admin.service';
import { Button } from '@/components/common/button';

export default function UserCompanyManagement() {
    const [users, setUsers] = useState<IAdminUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deploying, setDeploying] = useState<string | null>(null);

    // Info: (20260127) Minting State
    const [mintModal, setMintModal] = useState({
        visible: false,
        companyId: '',
        recipient: '',
        amount: 0,
    });
    const [minting, setMinting] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUsersWithCompanies(page, 5);
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeploy = async (companyId: string) => {
        if (!confirm('Are you sure you want to deploy a token for this company?')) return;
        setDeploying(companyId);
        try {
            const res = await deployCompanyToken(companyId);
            if (res.success) {
                alert('Token Deployed Successfully!');
                fetchUsers(); // Refresh list
            } else {
                alert(`Deployment Failed: ${res.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
        } finally {
            setDeploying(null);
        }
    };

    const openMintModal = (companyId: string, userAddress: string) => {
        setMintModal({
            visible: true,
            companyId,
            recipient: userAddress, // Default to owner address
            amount: 0,
        });
    };

    const handleMintSubmit = async () => {
        setMinting(true);
        try {
            const res = await mintCompanyToken(mintModal.companyId, mintModal.recipient, mintModal.amount);
            if (res.success) {
                alert('Tokens Minted Successfully!');
                setMintModal(prev => ({ ...prev, visible: false }));
                fetchUsers();
            } else {
                alert(`Minting Failed: ${res.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
        } finally {
            setMinting(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">User & Company Management</h2>

            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900 text-xs font-medium uppercase text-slate-400">
                        <tr>
                            <th className="px-6 py-3">User Info</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Companies</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="p-6 text-center text-slate-500">Loading...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-6 text-center text-slate-500">No users found.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="bg-slate-950/50 hover:bg-slate-900">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white">{user.name || 'Unnamed User'}</span>
                                            <span className="font-mono text-xs text-slate-500" title={user.address}>
                                                {user.address.slice(0, 6)}...{user.address.slice(-4)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold">
                                        <span className={`rounded px-2 py-1 ${user.role === 'ADMIN' ? 'bg-purple-900 text-purple-200' : 'bg-slate-800 text-slate-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.companies.length > 0 ? (
                                            <div className="space-y-3">
                                                {user.companies.map((comp) => (
                                                    <div key={comp.id} className="rounded border border-slate-700 bg-slate-900 p-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-indigo-300">{comp.name}</span>
                                                                <span className="text-xs text-slate-500">{comp.legalName} ({comp.status})</span>
                                                                {comp.tokenName && (
                                                                    <div className="mt-1 flex items-center gap-1 text-xs">
                                                                        <span className="font-mono text-yellow-500">{comp.tokenSymbol}</span>
                                                                        <span className="text-slate-600">- {comp.tokenName}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center">
                                                                {comp.tokenAddress ? (
                                                                    <div className="flex gap-2">
                                                                        <span className="font-mono text-xs text-green-500" title={comp.tokenAddress}>
                                                                            Deployed ✅
                                                                        </span>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => openMintModal(comp.id, user.address)}
                                                                            className="h-6 border-green-600 px-2 text-xs text-green-500 hover:bg-green-900/30"
                                                                        >
                                                                            Mint
                                                                        </Button>
                                                                    </div>
                                                                ) : comp.tokenName && comp.tokenSymbol ? (
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleDeploy(comp.id)}
                                                                        disabled={!!deploying}
                                                                        className="h-7 text-xs"
                                                                    >
                                                                        {deploying === comp.id ? 'Deploying...' : 'Deploy Token'}
                                                                    </Button>
                                                                ) : (
                                                                    <span className="text-xs italic text-slate-600">No Token Info</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-600">No companies</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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

            {/* Info: (20260127) Mint Modal */}
            {mintModal.visible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-white">Mint Company Token</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="recipient-address" className="mb-1 block text-sm text-slate-400">Recipient Address</label>
                                <input
                                    id="recipient-address"
                                    name="recipient-address"
                                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                                    placeholder="0x..."
                                    value={mintModal.recipient}
                                    onChange={(e) => setMintModal(prev => ({ ...prev, recipient: e.target.value }))}
                                    aria-label="Recipient Address"
                                />
                            </div>
                            <div>
                                <label htmlFor="mint-amount" className="mb-1 block text-sm text-slate-400">Amount</label>
                                <input
                                    id="mint-amount"
                                    name="mint-amount"
                                    type="number"
                                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                                    placeholder="Amount"
                                    value={mintModal.amount}
                                    onChange={(e) => setMintModal(prev => ({ ...prev, amount: Number(e.target.value) }))}
                                    aria-label="Amount"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setMintModal({ visible: false, companyId: '', recipient: '', amount: 0 })}
                                    disabled={minting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleMintSubmit}
                                    disabled={minting || !mintModal.recipient || !mintModal.amount}
                                >
                                    {minting ? 'Minting...' : 'Mint'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
