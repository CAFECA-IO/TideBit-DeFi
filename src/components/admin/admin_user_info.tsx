'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth_context';
import { getUserData, IUserData } from '@/services/user.service';

export default function AdminUserInfo() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.address) {
      queueMicrotask(() => setLoading(true));
      getUserData(user.address)
        .then((data) => setUserData(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user?.address]);

  if (!user) return null;

  return (
    <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* User Profile Section */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-indigo-500/20 text-2xl font-bold text-indigo-400">
              {userData?.name?.charAt(0).toUpperCase() || user.address.slice(2, 4)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{userData?.name || 'Admin User'}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="font-mono">{user.address}</span>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">
                  {userData?.role || 'USER'}
                </span>
              </div>
              {userData?.identityAddress && (
                <div className="mt-1 text-xs text-slate-500">
                  Identity: <span className="font-mono">{userData.identityAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Companies Section */}
        <div className="flex-1 border-t border-slate-800 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <h3 className="mb-3 text-sm font-semibold text-slate-400">Associated Companies</h3>
          {loading ? (
            <div className="text-sm text-slate-500">Loading companies...</div>
          ) : userData?.companies?.length ? (
            <div className="max-h-52 space-y-3 overflow-y-auto pr-2">
              {userData.companies.map((company) => (
                <div
                  key={company.id}
                  className="rounded border border-slate-800 bg-slate-900 p-3 transition hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-200">{company.name}</div>
                    <Badge status={company.status} />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>
                      <span className="block text-slate-600">Tax ID</span>
                      <span className="font-mono">{company.taxId || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-600">Country</span>
                      <span>{company.country || '-'}</span>
                    </div>
                    {company.address && (
                      <div className="col-span-2">
                        <span className="block text-slate-600">SCW Address</span>
                        <span className="font-mono text-[10px]">{company.address}</span>
                      </div>
                    )}
                    {company.tokenSymbol && (
                      <div>
                        <span className="block text-slate-600">Token</span>
                        <span className="text-indigo-400">{company.tokenSymbol}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded border border-dashed border-slate-800 p-4 text-center text-sm text-slate-500">
              No companies found for this user.
            </div>
          )}
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
