'use server';

import { prisma } from '@/lib/prisma';
import { deployCompanyToken as deploySystem, mintToAddress } from '@/services/company_token.service';
import { revalidatePath } from 'next/cache';

export interface IAdminUser {
    id: string;
    name: string | null;
    email: string | null; // Note: Email is on Company in current schema, but User usually has one too. Checking Schema: User doesn't have email. Using Name/Address.
    address: string;
    role: string;
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

export async function getUsersWithCompanies(page: number = 1, limit: number = 5): Promise<IGetUsersResponse> {
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

        const mappedUsers: IAdminUser[] = users.map(user => {
            // Merge companies and createdCompanies
            const allCompanies = [...user.companies, ...user.createdCompanies];
            const uniqueCompanies = Array.from(new Map(allCompanies.map(c => [c.id, c])).values());

            return {
                id: user.id,
                name: user.name,
                email: null, // Schema doesn't have email on User
                address: user.address,
                role: user.role,
                companies: uniqueCompanies.map(c => ({
                    id: c.id,
                    name: c.name,
                    legalName: c.legalName,
                    tokenName: c.tokenName,
                    tokenSymbol: c.tokenSymbol,
                    tokenAddress: c.tokenAddress,
                    status: c.status,
                })),
            };
        });

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

export async function mintCompanyToken(companyId: string, recipientAddress: string, amount: number) {
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
