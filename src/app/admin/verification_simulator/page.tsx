'use client';

import React, { useState } from 'react';
import { parseAbi, isAddress, parseEther } from 'viem';
import { publicClient } from '@/lib/viem-public';

// ABIs needed for diagnostic
const TOKEN_ABI = parseAbi([
  'function compliance() view returns (address)',
  'function identityRegistry() view returns (address)',
]);

const COMPLIANCE_ABI = parseAbi([
  'function getModules() view returns (address[])',
  'function canTransfer(address from, address to, uint256 amount) view returns (bool)',
]);

const MODULE_ABI = parseAbi([
  'function moduleCheck(address from, address to, uint256 value, address compliance) view returns (bool)',
]);

const IDENTITY_REGISTRY_ABI = parseAbi([
  'function isVerified(address userAddress) view returns (bool)',
]);

interface ICheckResult {
  name: string;
  status: 'pending' | 'success' | 'failure' | 'skipped';
  message?: string;
  address?: string;
}

export default function VerificationSimulatorPage() {
  // Inputs
  const [tokenAddress, setTokenAddress] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('100');

  // State
  const [loading, setLoading] = useState(false);
  const [complianceAddress, setComplianceAddress] = useState<string>('');
  const [identityRegistryAddress, setIdentityRegistryAddress] = useState<string>('');

  // Results
  const [checks, setChecks] = useState<ICheckResult[]>([]);
  const [overallResult, setOverallResult] = useState<boolean | null>(null);

  const runDiagnostic = async () => {
    if (!isAddress(tokenAddress) || !isAddress(fromAddress) || !isAddress(toAddress)) {
      alert('Please enter valid addresses');
      return;
    }

    setLoading(true);
    setChecks([]);
    setOverallResult(null);
    setComplianceAddress('');
    setIdentityRegistryAddress('');

    const newChecks: ICheckResult[] = [];
    const amountBN = parseEther(amount);

    try {
      // 1. Check Token Logic & Connections
      newChecks.push({ name: 'Token Contract Connection', status: 'pending' });

      let compAddr: string;
      let idRegAddr: string;

      try {
        const [comp, idReg] = await Promise.all([
          publicClient.readContract({
            address: tokenAddress,
            abi: TOKEN_ABI,
            functionName: 'compliance',
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: TOKEN_ABI,
            functionName: 'identityRegistry',
          }),
        ]);
        compAddr = comp;
        idRegAddr = idReg;

        setComplianceAddress(comp);
        setIdentityRegistryAddress(idReg);

        newChecks[0] = {
          name: 'Token Configuration',
          status: 'success',
          message: `Linked to Compliance: ${comp.slice(0, 6)}...${comp.slice(-4)}`,
        };
      } catch {
        newChecks[0] = {
          name: 'Token Configuration',
          status: 'failure',
          message: 'Could not read compliance/identity from token',
        };
        setChecks([...newChecks]);
        setLoading(false);
        return;
      }

      // 2. Identity Checks
      newChecks.push({ name: 'Sender Identity Verification', status: 'pending' });
      try {
        const isSenderVerified = await publicClient.readContract({
          address: idRegAddr as `0x${string}`,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'isVerified',
          args: [fromAddress],
        });

        newChecks[1] = {
          name: 'Sender Identity Verification',
          status: isSenderVerified ? 'success' : 'failure',
          message: isSenderVerified ? 'Verified' : 'NOT Verified in Registry',
        };
      } catch {
        newChecks[1] = {
          name: 'Sender Identity Verification',
          status: 'failure',
          message: 'Read failed',
        };
      }

      newChecks.push({ name: 'Receiver Identity Verification', status: 'pending' });
      try {
        const isReceiverVerified = await publicClient.readContract({
          address: idRegAddr as `0x${string}`,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'isVerified',
          args: [toAddress],
        });

        newChecks[2] = {
          name: 'Receiver Identity Verification',
          status: isReceiverVerified ? 'success' : 'failure',
          message: isReceiverVerified ? 'Verified' : 'NOT Verified in Registry',
        };
      } catch {
        newChecks[2] = {
          name: 'Receiver Identity Verification',
          status: 'failure',
          message: 'Read failed',
        };
      }

      // 3. Compliance Modules
      const modules = (await publicClient.readContract({
        address: compAddr as `0x${string}`,
        abi: COMPLIANCE_ABI,
        functionName: 'getModules',
      })) as string[];

      if (modules.length === 0) {
        newChecks.push({
          name: 'Compliance Modules',
          status: 'success',
          message: 'No modules bound (Simple Compliance)',
        });
      } else {
        for (const mod of modules) {
          newChecks.push({ name: `Module: ${mod}`, status: 'pending', address: mod });
          const checkIndex = newChecks.length - 1;

          try {
            const allowed = await publicClient.readContract({
              address: mod as `0x${string}`,
              abi: MODULE_ABI,
              functionName: 'moduleCheck',
              args: [fromAddress, toAddress, amountBN, compAddr as `0x${string}`],
            });

            newChecks[checkIndex] = {
              name: `Module Check: ${mod.slice(0, 6)}...${mod.slice(-4)}`,
              status: allowed ? 'success' : 'failure',
              message: allowed ? 'Passed' : 'BLOCKED TRANSFER',
              address: mod,
            };
          } catch {
            newChecks[checkIndex] = {
              name: `Module Check: ${mod.slice(0, 6)}...${mod.slice(-4)}`,
              status: 'failure',
              message: 'Execution Error',
              address: mod,
            };
          }
        }
      }

      // 4. Overall Check
      try {
        const canTransfer = await publicClient.readContract({
          address: compAddr as `0x${string}`,
          abi: COMPLIANCE_ABI,
          functionName: 'canTransfer',
          args: [fromAddress, toAddress, amountBN],
        });
        setOverallResult(canTransfer);
      } catch (e) {
        console.error(e);
        setOverallResult(false);
      }

      setChecks([...newChecks]);
    } catch (e) {
      console.error(e);
      alert('Diagnostic process failed unexpectedly');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-800">Verification Simulator</h2>
        <p className="mt-2 text-gray-500">
          Diagnose why a transfer might fail by checking Identity Registry status and individual
          Compliance Modules.
        </p>
        {complianceAddress && (
          <div className="mt-4 text-sm text-gray-600">
            <div>
              Compliance Address: <span className="font-mono">{complianceAddress}</span>
            </div>
            <div>
              Identity Registry Address:{' '}
              <span className="font-mono">{identityRegistryAddress}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b pb-2 text-lg font-bold text-gray-900">
              Simulation Parameters
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="token-address"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Token Address (RWA)
                </label>
                <input
                  id="token-address"
                  aria-labelledby="token-address"
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="from-address"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Investor Address (From)
                </label>
                <input
                  id="from-address"
                  aria-labelledby="from-address"
                  type="text"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="to-address"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Recipient Address (To)
                </label>
                <input
                  id="to-address"
                  aria-labelledby="to-address"
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="amount" className="mb-1 block text-xs font-medium text-gray-700">
                  Amount
                </label>
                <input
                  id="amount"
                  aria-labelledby="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                onClick={runDiagnostic}
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Running Diagnostic...' : 'Start Simulation'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <div className="h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold text-gray-900">Diagnostic Results</h3>
              {overallResult !== null && (
                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${overallResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {overallResult ? 'TRANSFER ALLOWED' : 'TRANSFER FAILED'}
                </span>
              )}
            </div>

            {checks.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p>Enter parameters and run simulation to see details.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {checks.map((check, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${
                      check.status === 'success'
                        ? 'border-green-100 bg-green-50'
                        : check.status === 'failure'
                          ? 'border-red-100 bg-red-50'
                          : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs text-white ${
                        check.status === 'success'
                          ? 'bg-green-500'
                          : check.status === 'failure'
                            ? 'bg-red-500'
                            : 'bg-gray-400'
                      }`}
                    >
                      {check.status === 'success' ? '✓' : check.status === 'failure' ? '✕' : '?'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{check.name}</div>
                      {check.message && (
                        <div
                          className={`text-xs ${
                            check.status === 'success'
                              ? 'text-green-700'
                              : check.status === 'failure'
                                ? 'text-red-700'
                                : 'text-gray-500'
                          }`}
                        >
                          {check.message}
                        </div>
                      )}
                      {check.address && (
                        <div className="mt-1 font-mono text-[10px] text-gray-400">
                          Address: {check.address}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
