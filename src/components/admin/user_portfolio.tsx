'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/button';
import { getUserPortfolio, IPortfolioItem, IPortfolioHistory } from '@/services/admin.service';
import { formatUnits } from 'viem';
import {
  // FiCopy,
  FiExternalLink,
  FiArrowRight,
} from 'react-icons/fi';

interface IUserPortfolioProps {
  onRequestTransfer: (targetAddress: string, tokenAddress?: string) => void;
}

export default function UserPortfolio({ onRequestTransfer }: IUserPortfolioProps) {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<{
    balances: IPortfolioItem[];
    history: IPortfolioHistory[];
  } | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!address || !address.startsWith('0x')) {
      setError('Invalid address format');
      return;
    }
    setError('');
    setIsLoading(true);
    setPortfolio(null);

    try {
      const data = await getUserPortfolio(address);
      setPortfolio(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // const copyToClipboard = (text: string) => {
  //     navigator.clipboard.writeText(text);
  //     // Could add toast here
  // };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">User Portfolio</h2>

        {/* Search Bar */}
        <div className="flex gap-4">
          <input
            placeholder="Enter User Address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 rounded border border-slate-700 bg-slate-800 px-4 py-2 text-white outline-none focus:border-blue-500"
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500"
          >
            {isLoading ? 'Loading...' : 'Search'}
          </Button>
        </div>
        {error && <p className="mt-2 text-red-400">{error}</p>}
      </div>

      {portfolio && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Balances */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200">Token Balances</h3>
            <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                      Token
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900">
                  {portfolio.balances.map((token) => (
                    <tr key={token.tokenAddress} className="hover:bg-slate-800/30">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-white">{token.tokenSymbol}</div>
                            <div className="text-xs text-slate-500">{token.tokenName}</div>
                          </div>
                          {token.isSystemToken && (
                            <span className="ml-2 rounded-full bg-blue-900/50 px-2 py-0.5 text-xs text-blue-400">
                              System
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-white">
                        {formatUnits(BigInt(token.balance), 18)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => onRequestTransfer(address, token.tokenAddress)}
                          className="inline-flex items-center text-indigo-400 hover:text-indigo-300"
                        >
                          Transfer <FiArrowRight className="ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {portfolio.balances.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">
                        No tokens found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* History */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200">Recent Activity</h3>
            <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
              <div className="flex flex-col">
                {portfolio.history.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No recent transactions found
                  </div>
                ) : (
                  portfolio.history.map((tx, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-slate-800 p-4 last:border-0 hover:bg-slate-800/30"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            tx.to.toLowerCase() === address.toLowerCase()
                              ? 'bg-green-900/30 text-green-500'
                              : 'bg-red-900/30 text-red-500'
                          }`}
                        >
                          {tx.to.toLowerCase() === address.toLowerCase() ? 'IN' : 'OUT'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                              {formatUnits(BigInt(tx.amount), 18)} {tx.tokenSymbol}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>
                              {tx.to.toLowerCase() === address.toLowerCase()
                                ? `From: ${tx.from.slice(0, 6)}...`
                                : `To: ${tx.to.slice(0, 6)}...`}
                            </span>
                            <span>• Block {tx.blockNumber.toString()}</span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={`https://amoy.polygonscan.com/tx/${tx.hash}`} // Assume Amoy or customize
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-white"
                      >
                        <FiExternalLink />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
