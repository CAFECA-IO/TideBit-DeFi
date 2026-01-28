'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getAdminCompanies, deployCompanyToken, deployUserIdentity, type IAdminCompany } from '@/services/admin.service';
import { Button } from '@/components/common/button';
import { FiCopy, FiActivity, FiUserCheck, FiAlertCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function UserCompanyManagement() {
    const router = useRouter();
    const [companies, setCompanies] = useState<IAdminCompany[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deploying, setDeploying] = useState<string | null>(null);

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAdminCompanies(page, 10);
            setCompanies(data.companies);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
            // alert('Failed to fetch companies'); 
        } finally {
            setLoading(false);
        }
    }, [page]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const handleDeployIdentity = async (userAddress: string) => {
        if (!confirm(`Deploy Identity for ${userAddress}?`)) return;
        setDeploying(userAddress);
        try {
            const res = await deployUserIdentity(userAddress);
            if (res && res.success) {
                alert('Identity Deployed Successfully!');
                fetchCompanies();
            } else {
                alert(`Deployment Failed: ${res?.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
        } finally {
            setDeploying(null);
        }
    };

    const handleDeployToken = async (companyId: string) => {
        if (!confirm('Are you sure you want to deploy a token for this company?')) return;
        setDeploying(companyId);
        try {
            const res = await deployCompanyToken(companyId);
            if (res.success) {
                alert('Token Deployed Successfully!');
                fetchCompanies();
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

    const navigateToOperations = (tokenAddress: string) => {
        /**
         * Info: (20260128 - Tzuhan)
         * Navigate to Token Operations with token address pre-filled (via URL params if supported or state)
         * Since we moved to a separate page, we can pass query param ?token=...
         * But the TokenOperations component needs to read it. 
         * For now, note that TokenOperations page might not read params yet, but I'll add it later or just link.
         */
        router.push(`/admin/token_operations?token=${tokenAddress}`);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Registered Companies</h2>

            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900 text-xs font-medium uppercase text-slate-400">
                        <tr>
                            <th className="px-6 py-3">Company Details</th>
                            <th className="px-6 py-3">Token</th>
                            <th className="px-6 py-3">Owners / Identity</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-6 text-center text-slate-500">Loading...</td>
                            </tr>
                        ) : companies.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-6 text-center text-slate-500">No companies found.</td>
                            </tr>
                        ) : (
                            companies.map((comp) => (
                                <tr key={comp.id} className="bg-slate-950/50 hover:bg-slate-900">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-white">{comp.name}</span>
                                            <span className="text-xs text-slate-500">{comp.legalName}</span>
                                            <span className="mt-1 flex items-center gap-2">
                                                <Badge status={comp.status} />
                                                <span className="font-mono text-[10px] text-slate-600">ID: {comp.id.slice(0, 8)}...</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {comp.tokenAddress ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 font-bold text-indigo-400">
                                                    {comp.tokenName} ({comp.tokenSymbol})
                                                </div>
                                                <div className="flex w-fit items-center gap-1 rounded bg-slate-800 px-2 py-1 font-mono text-xs text-slate-400">
                                                    <span title={comp.tokenAddress}>
                                                        {comp.tokenAddress.slice(0, 6)}...{comp.tokenAddress.slice(-4)}
                                                    </span>
                                                    <button onClick={() => handleCopy(comp.tokenAddress!)} className="hover:text-white"><FiCopy size={10} /></button>
                                                </div>
                                            </div>
                                        ) : comp.tokenName ? (
                                            <div className="text-sm italic text-slate-500">
                                                {comp.tokenName} ({comp.tokenSymbol}) <br />
                                                <span className="text-xs text-red-500">Not Deployed</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs italic text-slate-600">No Token Info</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            {comp.owners.map((owner) => (
                                                <div key={owner.id} className="flex flex-col gap-1 rounded border border-slate-800 bg-slate-900/50 p-2 text-xs">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-slate-300">{owner.name || 'Unnamed'}</span>
                                                        {owner.isVerified ? (
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                                                                <FiUserCheck /> Verified
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                                                                <FiAlertCircle /> Unverified
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-mono text-slate-500" title={owner.address}>
                                                            {owner.address.slice(0, 4)}...{owner.address.slice(-4)}
                                                        </span>
                                                        {!owner.isVerified && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={!!deploying}
                                                                onClick={() => handleDeployIdentity(owner.address)}
                                                                className="h-5 px-2 text-[10px] text-blue-400 hover:bg-blue-900/20 hover:text-blue-300"
                                                            >
                                                                Deploy Identity
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {comp.owners.length === 0 && <span className="text-xs text-slate-600">No Owners</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end gap-2">
                                            {/* Action: Deploy Token */}
                                            {!comp.tokenAddress && comp.tokenName && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleDeployToken(comp.id)}
                                                    disabled={!!deploying}
                                                    className="w-32 bg-green-600 hover:bg-green-500"
                                                >
                                                    Deploy Token
                                                </Button>
                                            )}

                                            {/* Action: Token Operations */}
                                            {comp.tokenAddress && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigateToOperations(comp.tokenAddress!)}
                                                    className="w-32 border-indigo-500 text-indigo-400 hover:bg-indigo-900/20"
                                                >
                                                    <FiActivity className="mr-1" /> Operations
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Info: (20260128 - Tzuhan) Pagination settings identical to before... */}
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

function Badge({ status }: { status: string }) {
    const styles = {
        PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        APPROVED: 'bg-green-500/10 text-green-500 border-green-500/20',
        REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
    } as const;

    const style =
        styles[status as keyof typeof styles] || 'bg-slate-500/10 text-slate-500 border-slate-500/20';

    return (
        <span className={`rounded border px-2 py-0.5 text-[10px] uppercase tracking-wider ${style}`}>
            {status}
        </span>
    );
}

