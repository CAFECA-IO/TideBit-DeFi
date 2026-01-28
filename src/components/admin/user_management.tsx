'use client';

import { useState } from 'react';
import { isAddress, Address } from 'viem';
import { publicClient } from '@/lib/viem_public';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { Button } from '@/components/common/button';
import { FiCopy } from 'react-icons/fi';
import { deployUserIdentity } from '@/services/admin.service';

export type UserStatus =
  | 'IDLE'
  | 'ANALYZING'
  | 'ZERO_ADDRESS' // Info: (20260127 - Tzuhan) Not a wallet
  | 'NO_IDENTITY' // Info: (20260127 - Tzuhan) Valid wallet but no identity
  | 'UNVERIFIED' // Info: (20260127 - Tzuhan) Identity exists but missing claims
  | 'VERIFIED'; // Info: (20260127 - Tzuhan) Fully compliant

export default function UserManagement() {
  const [inputAddress, setInputAddress] = useState('');
  const [status, setStatus] = useState<UserStatus>('IDLE');
  const [identityAddress, setIdentityAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const IR_ABI = ABIS.IDENTITY_REGISTRY;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDiagnose = async () => {
    if (!isAddress(inputAddress)) {
      setError('Invalid Address');
      return;
    }
    setError('');
    setIsLoading(true);
    setStatus('ANALYZING');
    setIdentityAddress('');

    try {
      // Info: (20260127 - Tzuhan) 1. Check if Identity exists
      const idAddr = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
        abi: IR_ABI,
        functionName: 'identity',
        args: [inputAddress as Address],
      });

      if (!idAddr || idAddr === '0x0000000000000000000000000000000000000000') {
        setStatus('NO_IDENTITY');
        setIsLoading(false);
        return;
      }

      setIdentityAddress(idAddr);

      // Info: (20260127 - Tzuhan) 2. Check Verification Status
      const isVerified = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
        abi: IR_ABI,
        functionName: 'isVerified',
        args: [inputAddress as Address],
      });

      if (isVerified) {
        setStatus('VERIFIED');
        setIsLoading(false);
        return;
      }

      // Info: (20260127 - Tzuhan) 3. If unverified, find why (check topics)
      setStatus('UNVERIFIED');
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterIdentity = async () => {
    if (!confirm(`Deploy Identity for ${inputAddress}?`)) return;
    setIsDeploying(true);
    try {
      const res = await deployUserIdentity(inputAddress);
      if (res && res.success) {
        alert('Identity Deployed Successfully!');
        handleDiagnose(); // Refresh status
      } else {
        alert(`Deployment Failed: ${res?.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred.');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleAddClaim = async () => {
    alert(
      'Claim issuance requires off-chain signature generation. Please use the issuance script.'
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-sm">
        <h3 className="mb-4 font-bold text-slate-200">User Diagnosis & Management</h3>

        <div className="mb-6 flex gap-2">
          <label htmlFor="user-mgmt-address" className="sr-only">User Address</label>
          <input
            id="user-mgmt-address"
            aria-label="User Address"
            placeholder="User Address (0x...)"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-sm text-white outline-none focus:border-indigo-500"
          />
          <Button
            onClick={handleDiagnose}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500"
          >
            {isLoading ? 'Analyzing...' : 'Diagnose'}
          </Button>
        </div>

        {/* Info: (20260127 - Tzuhan) Status Display */}
        {status !== 'IDLE' && status !== 'ANALYZING' && (
          <div
            className={`rounded border p-4 ${status === 'VERIFIED'
              ? 'border-green-800 bg-green-900/20'
              : status === 'NO_IDENTITY'
                ? 'border-red-800 bg-red-900/20'
                : 'border-yellow-800 bg-yellow-900/20'
              }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="font-bold text-slate-300">Status:</span>
              <span
                className={`rounded px-2 py-1 text-xs font-bold ${status === 'VERIFIED'
                  ? 'bg-green-900 text-green-300'
                  : status === 'NO_IDENTITY'
                    ? 'bg-red-900 text-red-300'
                    : 'bg-yellow-900 text-yellow-300'
                  }`}
              >
                {status}
              </span>
            </div>

            {identityAddress && (
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <span className="font-semibold">Identity Contract: </span>
                <span className="font-mono text-slate-300">{identityAddress}</span>
                <button
                  onClick={() => handleCopy(identityAddress)}
                  className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                  title="Copy Address"
                >
                  <FiCopy size={14} />
                </button>
              </div>
            )}

            {/* Info: (20260127 - Tzuhan) Actions based on Status */}
            <div className="mt-4 flex gap-2">
              {status === 'NO_IDENTITY' && (
                <Button
                  onClick={handleRegisterIdentity}
                  disabled={isDeploying}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
                >
                  {isDeploying ? 'Deploying...' : 'Deploy & Register Identity'}
                </Button>
              )}
              {status === 'UNVERIFIED' && (
                <Button
                  onClick={handleAddClaim}
                  disabled={true}
                  className="cursor-not-allowed bg-orange-600 opacity-50"
                >
                  Issue Missing Claims (Script Only)
                </Button>
              )}
              {status === 'VERIFIED' && (
                <div className="text-sm font-medium text-green-400">
                  User is fully compliant and ready for token operations.
                </div>
              )}
            </div>
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
