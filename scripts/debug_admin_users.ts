import { publicClient } from '@/lib/viem_public';
import { CONTRACT_ADDRESSES, ABIS } from '@/config/contracts';
import { getAddress } from 'viem';

async function main() {
    console.log('--- Starting Debug Script ---');
    const targetUser = '0x0b64F7089d070A2A262e5A49DA5F97c5D32eD61d';
    console.log('Target User:', targetUser);

    try {
        // 1. Check Identity
        const id = await publicClient.readContract({
            address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
            abi: ABIS.IDENTITY_REGISTRY,
            functionName: 'identity',
            args: [getAddress(targetUser)],
        });
        console.log('Identity Contract Address:', id);

        // 2. Check Verification
        const isVerified = await publicClient.readContract({
            address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
            abi: ABIS.IDENTITY_REGISTRY,
            functionName: 'isVerified',
            args: [getAddress(targetUser)],
        });
        console.log('Is Verified:', isVerified);


        // 3. Check for User in DB
        const { prisma } = await import('../src/lib/prisma');
        const user = await prisma.user.findFirst({
            where: { address: { equals: getAddress(targetUser), mode: 'insensitive' } }
        });
        console.log('User in DB:', user);

    } catch (error) {
        console.error('Error running script:', error);
    }
}

main();
