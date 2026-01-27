'use server';

import { prisma } from '@/lib/prisma';

export interface IUserData {
    address: string;
    name: string | null;
    role: string;
    identityAddress: string | null;
    companies: {
        id: string;
        name: string;
        taxId: string | null;
        status: string;
        legalName: string | null;
        country: string | null;
        address: string | null; // SCW Address
        tokenSymbol: string | null;
    }[];
}

export async function getUserData(address: string): Promise<IUserData | null> {
    if (!address) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { address },
            include: {
                companies: true, // Fetch companies where user is an owner
                createdCompanies: true // Fetch companies created by user
            }
        });

        if (!user) return null;

        // Merge companies and createdCompanies, remove duplicates by ID
        const allCompanies = [...user.companies, ...user.createdCompanies];
        const uniqueCompanies = Array.from(new Map(allCompanies.map(c => [c.id, c])).values());

        return {
            address: user.address,
            name: user.name,
            role: user.role,
            identityAddress: user.identityAddress,
            companies: uniqueCompanies.map(c => ({
                id: c.id,
                name: c.name,
                taxId: c.taxId,
                status: c.status,
                legalName: c.legalName,
                country: c.country,
                address: c.address,
                tokenSymbol: c.tokenSymbol
            }))
        };
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
    }
}
