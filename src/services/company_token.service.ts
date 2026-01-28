'use server';

// Info: (20260127) Handle company token deployment sharing a common Identity Registry
import { createPublicClient, createWalletClient, http, parseAbi, defineChain, getAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import COMPLIANCE_ARTIFACT from '@erc3643org/erc-3643/artifacts/contracts/compliance/modular/ModularCompliance.sol/ModularCompliance.json';
import IDENTITY_ARTIFACT from '@erc3643org/erc-3643/artifacts/@onchain-id/solidity/contracts/Identity.sol/Identity.json';
import TOKEN_ARTIFACT from '@erc3643org/erc-3643/artifacts/contracts/token/Token.sol/Token.json';

// Info: Blockchain Setup
const chainId = parseInt(process.env.NEXT_PUBLIC_ISUNCOIN_CHAIN_ID || '8017');
const targetChain = defineChain({
    id: chainId,
    name: 'TargetChain',
    nativeCurrency: { name: 'Token', symbol: 'TOK', decimals: 18 },
    rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com'] } },
});

// Info: Initialize Clients
const account = privateKeyToAccount(process.env.ISUNCOIN_PRIVATE_KEY as `0x${string}`);
const client = createPublicClient({ chain: targetChain, transport: http() });
const wallet = createWalletClient({ account, chain: targetChain, transport: http() });

// Info: Response Type
type ActionResponse = {
    success: boolean;
    message: string;
    data?: unknown;
};

// Info: Deploy Company Token
// This function deploys a new Token and Compliance, but links to an EXISTING Identity Registry system.
export async function deployCompanyToken(
    name: string,
    symbol: string,
    decimals: number = 18
): Promise<ActionResponse> {
    try {
        const identityRegistry = CONTRACT_ADDRESSES.IDENTITY_REGISTRY;
        console.log(`--- Starting Company Token Deployment: ${name} (${symbol}) ---`);
        console.log(`Using Shared Identity Registry: ${identityRegistry}`);

        // Validate addresses
        const IR_ADDRESS = getAddress(identityRegistry);

        // 1. Deploy ModularCompliance (One per token usually, or could be shared if logic is identical, but safer to have one per token for modular rules)
        // We will deploy a new one for flexibility.
        const compHash = await wallet.deployContract({
            abi: COMPLIANCE_ARTIFACT.abi,
            bytecode: COMPLIANCE_ARTIFACT.bytecode as `0x${string}`,
        });
        const compReceipt = await client.waitForTransactionReceipt({ hash: compHash });
        const COMP_ADDRESS = compReceipt.contractAddress!;
        await wallet.writeContract({ address: COMP_ADDRESS, abi: COMPLIANCE_ARTIFACT.abi, functionName: 'init', args: [] });
        console.log(`ModularCompliance deployed at: ${COMP_ADDRESS}`);

        // 2. Deploy Issuer Identity
        // The issuer is the entity controlling this token. We'll make the platform admin the owner for now.
        const ioiHash = await wallet.deployContract({
            abi: IDENTITY_ARTIFACT.abi,
            bytecode: IDENTITY_ARTIFACT.bytecode as `0x${string}`,
            args: [account.address, false]
        });
        const ioiReceipt = await client.waitForTransactionReceipt({ hash: ioiHash });
        const IOI_ADDRESS = ioiReceipt.contractAddress!;
        console.log(`Issuer Identity deployed at: ${IOI_ADDRESS}`);

        // 3. Deploy Token
        const tokenHash = await wallet.deployContract({
            abi: TOKEN_ARTIFACT.abi,
            bytecode: TOKEN_ARTIFACT.bytecode as `0x${string}`,
            args: []
        });
        const tokenReceipt = await client.waitForTransactionReceipt({ hash: tokenHash });
        const TOKEN_ADDRESS = tokenReceipt.contractAddress!;
        console.log(`Token deployed at: ${TOKEN_ADDRESS}`);

        const TOKEN_ABI = parseAbi([
            'function init(address, address, string, string, uint8, address) external',
            'function addAgent(address) external',
            'function batchMint(address[] _toList, uint256[] _amounts) external'
        ]);

        // 4. Initialize Token using the SHARED Identity Registry
        await wallet.writeContract({
            address: TOKEN_ADDRESS,
            abi: TOKEN_ABI,
            functionName: 'init',
            args: [IR_ADDRESS, COMP_ADDRESS, name, symbol, decimals, IOI_ADDRESS]
        });

        // 5. Bind Compliance to Token
        const COMPLIANCE_ABI = parseAbi(['function bindToken(address) external']);
        await wallet.writeContract({ address: COMP_ADDRESS, abi: COMPLIANCE_ABI, functionName: 'bindToken', args: [TOKEN_ADDRESS] });

        // 6. Add Platform Admin as Agent to Token (to allow minting/burning if logic requires agent)
        await wallet.writeContract({ address: TOKEN_ADDRESS, abi: TOKEN_ABI, functionName: 'addAgent', args: [account.address] });

        return {
            success: true,
            message: 'Company Token Deployed Successfully',
            data: {
                token: TOKEN_ADDRESS,
                compliance: COMP_ADDRESS,
                issuerIdentity: IOI_ADDRESS,
                identityRegistry: IR_ADDRESS // Return the shared one
            }
        };
    } catch (error) {
        console.error('Company Token Deployment Failed:', error);
        return { success: false, message: `Deployment Failed: ${(error as Error).message}` };
    }
}

// Info: Mint Token
export async function mintToAddress(tokenAddress: string, to: string, amount: number): Promise<ActionResponse> {
    try {
        const validTo = getAddress(to);
        const amountBigInt = BigInt(amount) * BigInt(10) ** BigInt(18); // Assuming 18 always for now, can improve later
        // NOTE: This assumes the user 'to' already has a valid identity in the Shared Identity Registry.

        const tokenAbi = parseAbi([
            'function batchMint(address[], uint256[]) external',
        ]);

        const tx = await wallet.writeContract({
            address: getAddress(tokenAddress),
            abi: tokenAbi,
            functionName: 'batchMint',
            args: [[validTo], [amountBigInt]]
        });

        await client.waitForTransactionReceipt({ hash: tx });
        return { success: true, message: `Minted ${amount} to ${to}`, data: { tx } };
    } catch (error) {
        console.error('Mint Failed:', error);
        return { success: false, message: `Mint Failed: ${(error as Error).message}` };
    }
}

// Info: Burn Token
export async function burn(tokenAddress: string, from: string, amount: number): Promise<ActionResponse> {
    try {
        const validFrom = getAddress(from);
        const amountBigInt = BigInt(amount) * BigInt(10) ** BigInt(18);

        const tokenAbi = parseAbi(['function burn(address, uint256) external']);

        const tx = await wallet.writeContract({
            address: getAddress(tokenAddress),
            abi: tokenAbi,
            functionName: 'burn',
            args: [validFrom, amountBigInt]
        });

        await client.waitForTransactionReceipt({ hash: tx });
        return { success: true, message: `Burned ${amount} from ${from}`, data: { tx } };
    } catch (error) {
        return { success: false, message: `Burn Failed: ${(error as Error).message}` };
    }
}

// Info: Freeze/Unfreeze
export async function freeze(tokenAddress: string, target: string, amount: number): Promise<ActionResponse> {
    return toggleFreeze(tokenAddress, target, amount, true);
}

export async function unfreeze(tokenAddress: string, target: string, amount: number): Promise<ActionResponse> {
    return toggleFreeze(tokenAddress, target, amount, false);
}

async function toggleFreeze(tokenAddress: string, target: string, amount: number, isFreeze: boolean): Promise<ActionResponse> {
    try {
        const validTarget = getAddress(target);
        const amountBigInt = BigInt(amount) * BigInt(10) ** BigInt(18);
        const functionName = isFreeze ? 'freezePartialTokens' : 'unfreezePartialTokens';
        const tokenAbi = parseAbi([`function ${functionName}(address, uint256) external`]);

        const tx = await wallet.writeContract({
            address: getAddress(tokenAddress),
            abi: tokenAbi,
            functionName: functionName,
            args: [validTarget, amountBigInt]
        });

        await client.waitForTransactionReceipt({ hash: tx });
        return { success: true, message: `${isFreeze ? 'Frozen' : 'Unfrozen'} ${amount} for ${target}`, data: { tx } };
    } catch (error) {
        return { success: false, message: `Action Failed: ${(error as Error).message}` };
    }
}

// Info: Pause/Unpause
export async function pause(tokenAddress: string): Promise<ActionResponse> {
    return togglePause(tokenAddress, true);
}

export async function unpause(tokenAddress: string): Promise<ActionResponse> {
    return togglePause(tokenAddress, false);
}

async function togglePause(tokenAddress: string, isPause: boolean): Promise<ActionResponse> {
    try {
        const functionName = isPause ? 'pause' : 'unpause';
        const tokenAbi = parseAbi([`function ${functionName}() external`]);

        const tx = await wallet.writeContract({
            address: getAddress(tokenAddress),
            abi: tokenAbi,
            functionName: functionName,
            args: []
        });

        await client.waitForTransactionReceipt({ hash: tx });
        return { success: true, message: `Token ${isPause ? 'Paused' : 'Unpaused'}`, data: { tx } };
    } catch (error) {
        return { success: false, message: `Action Failed: ${(error as Error).message}` };
    }
}

// Info: Register User to Shared Registry (Wrapper)
// This actually registers the user to the Identity Registry associated with the token.
// Since we are using a shared registry, this updates the global registry state.
export async function registerUser(tokenAddress: string, userAddress: string): Promise<ActionResponse> {
    try {
        const tokenAbi = parseAbi(['function identityRegistry() view returns (address)']);
        const registryAddress = await client.readContract({
            address: getAddress(tokenAddress),
            abi: tokenAbi,
            functionName: 'identityRegistry'
        });

        // Deploy User Identity
        const uoiHash = await wallet.deployContract({
            abi: IDENTITY_ARTIFACT.abi,
            bytecode: IDENTITY_ARTIFACT.bytecode as `0x${string}`,
            args: [userAddress, false]
        });
        const uoiReceipt = await client.waitForTransactionReceipt({ hash: uoiHash });
        const userIdentityAddress = uoiReceipt.contractAddress!;

        // Register
        // Note: The caller (ISUNCOIN_PRIVATE_KEY account) must be an Agent of the Registry to do this.
        // If the Shared Registry was deployed by the same account, it should be fine.
        const regAbi = parseAbi(['function registerIdentity(address, address, uint16) external']);
        const tx = await wallet.writeContract({
            address: registryAddress as `0x${string}`,
            abi: regAbi,
            functionName: 'registerIdentity',
            args: [userAddress as `0x${string}`, userIdentityAddress, 158] // 158 = TW
        });

        await client.waitForTransactionReceipt({ hash: tx });
        return { success: true, message: `User registered to Identity Registry (${userIdentityAddress})`, data: { tx } };
    } catch (error) {
        console.error('Registration Failed:', error);
        return { success: false, message: `Registration Failed: ${(error as Error).message}` };
    }
}
