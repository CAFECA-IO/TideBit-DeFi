'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Address, encodeFunctionData } from 'viem';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { useAuth } from '@/contexts/auth_context';
import { usePasskeySign, IPartialUserOp } from '@/lib/hooks/use_passkey_sign';
import { publicClient } from '@/lib/viem-public';
import { Button } from '@/components/common/button';

export default function RegistrySettings() {
  const { user: adminUser } = useAuth();
  const { signAndSendUserOp, isSigning, status } = usePasskeySign();
  const [activeTab, setActiveTab] = useState<'ISSUERS' | 'TOPICS'>('ISSUERS');

  const [inputAddress, setInputAddress] = useState('');
  const [inputTopic, setInputTopic] = useState('');

  const [trustedIssuers, setTrustedIssuers] = useState<Address[]>([]);
  const [claimTopics, setClaimTopics] = useState<bigint[]>([]);

  const TIR_ABI = ABIS.TRUSTED_ISSUERS_REGISTRY;
  const CTR_ABI = ABIS.CLAIM_TOPICS_REGISTRY;
  const SCW_ABI = ABIS.SCW;

  const fetchRegistryData = useCallback(async () => {
    try {
      const issuers = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.TRUSTED_ISSUERS_REGISTRY,
        abi: TIR_ABI,
        functionName: 'getTrustedIssuers',
      });
      setTrustedIssuers([...issuers]);

      const topics = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.CLAIM_TOPICS_REGISTRY,
        abi: CTR_ABI,
        functionName: 'getClaimTopics',
      });
      setClaimTopics([...topics]);
    } catch (e) {
      console.error('Fetch Registry Data Error:', e);
    }
  }, [CTR_ABI, TIR_ABI]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchRegistryData();
    };
    fetchData();
  }, [fetchRegistryData]);

  const handleAction = async (
    action: 'ADD_ISSUER' | 'REMOVE_ISSUER' | 'ADD_TOPIC' | 'REMOVE_TOPIC'
  ) => {
    if (!adminUser) return alert('請先登入 Admin 錢包');
    let callData: `0x${string}` = '0x';
    let targetContract: Address = '0x';

    try {
      if (action === 'ADD_ISSUER') {
        if (!inputAddress) return;
        // Default topic 101 for identity verification
        const topics = [BigInt(101)];
        callData = encodeFunctionData({
          abi: TIR_ABI,
          functionName: 'addTrustedIssuer',
          args: [inputAddress as Address, topics],
        });
        targetContract = CONTRACT_ADDRESSES.TRUSTED_ISSUERS_REGISTRY;
      } else if (action === 'REMOVE_ISSUER') {
        if (!inputAddress) return;
        callData = encodeFunctionData({
          abi: TIR_ABI,
          functionName: 'removeTrustedIssuer',
          args: [inputAddress as Address],
        });
        targetContract = CONTRACT_ADDRESSES.TRUSTED_ISSUERS_REGISTRY;
      } else if (action === 'ADD_TOPIC') {
        if (!inputTopic) return;
        callData = encodeFunctionData({
          abi: CTR_ABI,
          functionName: 'addClaimTopic',
          args: [BigInt(inputTopic)],
        });
        targetContract = CONTRACT_ADDRESSES.CLAIM_TOPICS_REGISTRY;
      } else if (action === 'REMOVE_TOPIC') {
        if (!inputTopic) return;
        callData = encodeFunctionData({
          abi: CTR_ABI,
          functionName: 'removeClaimTopic',
          args: [BigInt(inputTopic)],
        });
        targetContract = CONTRACT_ADDRESSES.CLAIM_TOPICS_REGISTRY;
      }

      const executeData = encodeFunctionData({
        abi: SCW_ABI,
        functionName: 'execute',
        args: [targetContract, BigInt(0), callData],
      });

      const nonce = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.ENTRY_POINT,
        abi: ABIS.ENTRY_POINT,
        functionName: 'getNonce',
        args: [adminUser.address as Address, BigInt(0)],
      });

      const op: IPartialUserOp = {
        sender: adminUser.address as `0x${string}`,
        nonce,
        initCode: '0x',
        callData: executeData,
        callGasLimit: BigInt(200_000),
        verificationGasLimit: BigInt(500_000),
        preVerificationGas: BigInt(100_000),
        maxFeePerGas: BigInt(0),
        maxPriorityFeePerGas: BigInt(0),
        paymasterAndData: '0x',
        signature: '0x',
      };

      await signAndSendUserOp(op, {
        x: BigInt(adminUser.pubKeyX),
        y: BigInt(adminUser.pubKeyY),
      });

      alert('交易請求已送出！');
      setInputAddress('');
      setInputTopic('');
      // Optimistic update or refresh
      setTimeout(fetchRegistryData, 5000);
    } catch (e) {
      console.error(e);
      alert(`操作失敗: ${(e as Error).message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ISSUERS')}
          className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'ISSUERS'
              ? 'border-b-2 border-indigo-500 bg-slate-800 text-indigo-400'
              : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          Trusted Issuers
        </button>
        <button
          onClick={() => setActiveTab('TOPICS')}
          className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'TOPICS'
              ? 'border-b-2 border-indigo-500 bg-slate-800 text-indigo-400'
              : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          Claim Topics
        </button>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        {activeTab === 'ISSUERS' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <label htmlFor="registry-issuer-address" className="sr-only">Issuer Address</label>
              <input
                id="registry-issuer-address"
                aria-label="Issuer Address"
                placeholder="Issuer Address (0x...)"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
              <Button
                onClick={() => handleAction('ADD_ISSUER')}
                disabled={isSigning}
                className="bg-green-600 hover:bg-green-500"
              >
                Add
              </Button>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 font-bold text-slate-300">Current Trusted Issuers:</h4>
              <ul className="space-y-2">
                {trustedIssuers.map((issuer) => (
                  <li
                    key={issuer}
                    className="flex items-center justify-between rounded bg-slate-800 p-2 font-mono text-sm text-slate-200"
                  >
                    <span>{issuer}</span>
                    <button
                      onClick={() => {
                        setInputAddress(issuer);
                        handleAction('REMOVE_ISSUER');
                      }}
                      className="rounded border border-red-900 bg-red-900/20 px-2 py-1 text-xs text-red-400 hover:bg-red-900/40 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {trustedIssuers.length === 0 && (
                  <li className="italic text-slate-500">No issuers found.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'TOPICS' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <label htmlFor="registry-topic-id" className="sr-only">Claim Topic ID</label>
              <input
                id="registry-topic-id"
                aria-label="Claim Topic ID"
                type="number"
                placeholder="Claim Topic ID (e.g. 101)"
                value={inputTopic}
                onChange={(e) => setInputTopic(e.target.value)}
                className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
              <Button
                onClick={() => handleAction('ADD_TOPIC')}
                disabled={isSigning}
                className="bg-green-600 hover:bg-green-500"
              >
                Add
              </Button>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 font-bold text-slate-300">Required Claim Topics:</h4>
              <ul className="space-y-2">
                {claimTopics.map((topic) => (
                  <li
                    key={topic.toString()}
                    className="flex items-center justify-between rounded bg-slate-800 p-2 font-mono text-sm text-slate-200"
                  >
                    <span>Topic ID: {topic.toString()}</span>
                    <button
                      onClick={() => {
                        setInputTopic(topic.toString());
                        handleAction('REMOVE_TOPIC');
                      }}
                      className="rounded border border-red-900 bg-red-900/20 px-2 py-1 text-xs text-red-400 hover:bg-red-900/40 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {claimTopics.length === 0 && (
                  <li className="italic text-slate-500">No topics found.</li>
                )}
              </ul>
            </div>
          </div>
        )}
        {status && <p className="mt-2 animate-pulse text-center text-xs text-blue-400">{status}</p>}
      </div>
    </div>
  );
}
