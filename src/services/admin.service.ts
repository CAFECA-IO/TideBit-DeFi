'use server';

import { prisma } from '@/lib/prisma';
import {
  deployCompanyToken as deploySystem,
  mintToAddress,
} from '@/services/company_token.service';
import { revalidatePath } from 'next/cache';
import { publicClient } from '@/lib/viem-public';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { walletClient, account } from '@/lib/viem';
import { getAddress, parseAbi, type Address } from 'viem';
import IDENTITY_ARTIFACT from '@erc3643org/erc-3643/artifacts/@onchain-id/solidity/contracts/Identity.sol/Identity.json';

export interface IAdminUser {
  id: string;
  name: string | null;
  email: string | null; // Note: Email is on Company in current schema, but User usually has one too. Checking Schema: User doesn't have email. Using Name/Address.
  address: string;
  role: string;
  identityAddress: string | null;
  isVerified: boolean;
  companies: {
    id: string;
    name: string;
    legalName: string | null;
    tokenName: string | null;
    tokenSymbol: string | null;
    tokenAddress: string | null;
    status: string;
  }[];
}

export interface IGetUsersResponse {
  users: IAdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getUsersWithCompanies(
  page: number = 1,
  limit: number = 5
): Promise<IGetUsersResponse> {
  try {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          companies: true,
          createdCompanies: true,
        },
      }),
      prisma.user.count(),
    ]);

    const mappedUsers: IAdminUser[] = await Promise.all(
      users.map(async (user) => {
        // Merge companies and createdCompanies
        const allCompanies = [...user.companies, ...user.createdCompanies];
        const uniqueCompanies = Array.from(new Map(allCompanies.map((c) => [c.id, c])).values());

        // Fetch Identity Status
        let identityAddress: string | null = null;
        let isVerified = false;

        try {
          if (user.address && user.address.startsWith('0x')) {
            // Debug Log
            if (user.address.toLowerCase() === '0x0b64f7089d070a2a262e5a49da5f97c5d32ed61d') {
              console.log('--- Debugging User 0x0b64... ---');
            }

            const formattedAddress = getAddress(user.address);

            const [idResult, verifiedResult] = await Promise.allSettled([
              publicClient.readContract({
                address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
                abi: ABIS.IDENTITY_REGISTRY,
                functionName: 'identity',
                args: [formattedAddress],
              }),
              publicClient.readContract({
                address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
                abi: ABIS.IDENTITY_REGISTRY,
                functionName: 'isVerified',
                args: [formattedAddress],
              }),
            ]);

            if (user.address.toLowerCase() === '0x0b64f7089d070a2a262e5a49da5f97c5d32ed61d') {
              console.log('Identity Result:', idResult);
              console.log('Verified Result:', verifiedResult);
            }

            if (
              idResult.status === 'fulfilled' &&
              idResult.value &&
              idResult.value !== '0x0000000000000000000000000000000000000000'
            ) {
              identityAddress = idResult.value;
            }

            if (verifiedResult.status === 'fulfilled') {
              isVerified = verifiedResult.value as boolean;
            }
          }
        } catch (e) {
          console.error(`Failed to fetch identity for ${user.address}`, e);
        }

        return {
          id: user.id,
          name: user.name,
          email: null, // Schema doesn't have email on User
          address: user.address,
          role: user.role,
          identityAddress,
          isVerified,
          companies: uniqueCompanies.map((c) => ({
            id: c.id,
            name: c.name,
            legalName: c.legalName,
            tokenName: c.tokenName,
            tokenSymbol: c.tokenSymbol,
            tokenAddress: c.tokenAddress,
            status: c.status,
          })),
        };
      })
    );

    return {
      users: mappedUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function deployCompanyToken(companyId: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) throw new Error('Company not found');
    if (company.tokenAddress) throw new Error('Token already deployed');
    if (!company.tokenName || !company.tokenSymbol) throw new Error('Missing token info');

    // Deploy Token System
    // Note: deploySystem currently uses hardcoded decimals (18).
    const res = await deploySystem(company.tokenName, company.tokenSymbol, 18);

    if (!res.success || !res.data) {
      throw new Error(res.message);
    }

    const deploymentData = res.data as { token: string };
    const tokenAddress = deploymentData.token;

    if (!tokenAddress) throw new Error('Deployment success but missing token address');

    // Update Company
    await prisma.company.update({
      where: { id: companyId },
      data: {
        tokenAddress: tokenAddress,
      },
    });

    revalidatePath('/admin');
    return { success: true, message: 'Token deployed successfully', tokenAddress };
  } catch (error) {
    console.error('Deployment error:', error);
    return { success: false, message: (error as Error).message };
  }
}

export async function mintCompanyToken(
  companyId: string,
  recipientAddress: string,
  amount: number
) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) throw new Error('Company not found');
    if (!company.tokenAddress) throw new Error('Token not deployed');

    const res = await mintToAddress(company.tokenAddress, recipientAddress, amount);

    if (res.success) {
      revalidatePath('/admin');
      return { success: true, message: 'Minted successfully', tx: res.data };
    } else {
      return { success: false, message: res.message };
    }
  } catch (error) {
    console.error('Minting error:', error);
    return { success: false, message: (error as Error).message };
  }
}

export async function deployUserIdentity(userAddress: string) {
  try {
    if (!walletClient || !account) {
      throw new Error('Server wallet not configured');
    }

    const registryAddress = CONTRACT_ADDRESSES.IDENTITY_REGISTRY;
    // 1. Check if already has identity (Double check)
    const currentId = await publicClient.readContract({
      address: registryAddress,
      abi: ABIS.IDENTITY_REGISTRY,
      functionName: 'identity',
      args: [userAddress as Address],
    });

    if (currentId && currentId !== '0x0000000000000000000000000000000000000000') {
      return { success: false, message: 'User already has an identity deployed.' };
    }

    console.log(`Deploying Identity for ${userAddress}...`);

    const uoiHash = await walletClient.deployContract({
      abi: IDENTITY_ARTIFACT.abi,
      bytecode: IDENTITY_ARTIFACT.bytecode as `0x${string}`,
      args: [userAddress, false],
    });
    const uoiReceipt = await publicClient.waitForTransactionReceipt({ hash: uoiHash });
    const userIdentityAddress = uoiReceipt.contractAddress!;

    // Info: (20260126 - Luphia) 3. 註冊
    const regAbi = parseAbi(['function registerIdentity(address, address, uint16) external']);
    const tx = await walletClient.writeContract({
      address: registryAddress,
      abi: regAbi,
      functionName: 'registerIdentity',
      args: [userAddress as `0x${string}`, userIdentityAddress, 158], // Info: (20260126 - Luphia) 158 TW
    });

    await publicClient.waitForTransactionReceipt({ hash: tx });

    revalidatePath('/admin');
    return {
      success: true,
      message: 'Identity Deployed & Registered Successfully',
      identityAddress: userIdentityAddress,
    };
  } catch (error) {
    console.error('Identity Deployment Failed:', error);
  }
}

export interface IPortfolioItem {
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  balance: string;
  decimals: number;
  isSystemToken: boolean;
}

export interface IPortfolioHistory {
  tokenSymbol: string;
  from: string;
  to: string;
  amount: string;
  hash: string;
  blockNumber: bigint;
}

export async function getUserPortfolio(userAddress: string) {
  try {
    const formattedAddress = getAddress(userAddress);

    // 1. Get All Tokens (System + Companies)
    // System Token (NTD)
    const tokens = [
      {
        name: 'New Taiwan Dollar',
        symbol: 'NTD',
        address: CONTRACT_ADDRESSES.NTD_TOKEN,
        isSystem: true,
      },
    ];

    // Company Tokens
    const companies = await prisma.company.findMany({
      where: {
        tokenAddress: { not: null },
      },
      select: {
        tokenName: true,
        tokenSymbol: true,
        tokenAddress: true,
      },
    });

    companies.forEach((c) => {
      if (c.tokenAddress) {
        tokens.push({
          name: c.tokenName || 'Unknown',
          symbol: c.tokenSymbol || 'UNK',
          address: c.tokenAddress as Address,
          isSystem: false,
        });
      }
    });

    // 2. Fetch Balances
    // Use Promise.all
    const balances: IPortfolioItem[] = await Promise.all(
      tokens.map(async (t) => {
        try {
          const bal = await publicClient.readContract({
            address: t.address,
            abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
            functionName: 'balanceOf',
            args: [formattedAddress],
          });
          return {
            tokenName: t.name,
            tokenSymbol: t.symbol,
            tokenAddress: t.address,
            balance: bal.toString(), // Wei
            decimals: 18,
            isSystemToken: t.isSystem,
          };
        } catch (e) {
          console.error(`Failed to fetch balance for ${t.symbol}`, e);
          return {
            tokenName: t.name,
            tokenSymbol: t.symbol,
            tokenAddress: t.address,
            balance: '0',
            decimals: 18,
            isSystemToken: t.isSystem,
          };
        }
      })
    );

    // 3. Fetch History (Recent)
    const history: IPortfolioHistory[] = [];

    // Parallel fetch events
    await Promise.all(
      tokens.map(async (t) => {
        try {
          const logsTo = await publicClient.getContractEvents({
            address: t.address,
            abi: parseAbi([
              'event Transfer(address indexed from, address indexed to, uint256 value)',
            ]),
            eventName: 'Transfer',
            args: { to: formattedAddress },
            fromBlock: 'earliest',
          });

          const logsFrom = await publicClient.getContractEvents({
            address: t.address,
            abi: parseAbi([
              'event Transfer(address indexed from, address indexed to, uint256 value)',
            ]),
            eventName: 'Transfer',
            args: { from: formattedAddress },
            fromBlock: 'earliest',
          });

          const allLogs = [...logsTo, ...logsFrom];
          allLogs.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

          allLogs.slice(0, 5).forEach((log) => {
            const { from, to, value } = log.args;
            history.push({
              tokenSymbol: t.symbol,
              from: from || '0x0',
              to: to || '0x0',
              amount: value?.toString() || '0',
              hash: log.transactionHash,
              blockNumber: log.blockNumber,
            });
          });
        } catch (e) {
          console.warn(`Failed to fetch logs for ${t.symbol}`, e);
        }
      })
    );

    // Sort combined history
    history.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

    return {
      balances,
      history: history.slice(0, 20),
    };
  } catch (e) {
    console.error('getUserPortfolio Error', e);
    throw new Error((e as Error).message);
  }
}
