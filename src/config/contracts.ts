import { Address, parseAbi } from 'viem';

export const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
// Info: (20260114 - Tzuhan) ERC-4337
export const CONTRACT_ADDRESSES = {
  ENTRY_POINT: (process.env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS ||
    '0x1e51E13D511016aB69C0F58c4282784eA5401Cf6') as Address,
  FACTORY: (process.env.NEXT_PUBLIC_SCW_FACTORY_ADDRESS ||
    '0x37cb2EcF29cbA3aF114Ed69246f55f74F7768fE4') as Address,
  // Info: (20260114 - Tzuhan) ERC-3643 (RWA)
  CLAIM_TOPICS_REGISTRY:
    process.env.NEXT_PUBLIC_CLAIM_TOPICS_REGISTRY ||
    ('0x97eD79749cc32e06db032e25FEC868e2A53Dc0db' as Address),
  IDENTITY_REGISTRY_STORAGE:
    process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_STORAGE ||
    ('0xE524595Eac2Fc48651178e0a2512eB8d12519B93' as Address),
  TOKEN_IMPLEMENTATION:
    process.env.NEXT_PUBLIC_TOKEN_IMPLEMENTATION ||
    ('0x0188Ee1098Ba973D3dE0F47178946942ef7Fa7E8' as Address),
  TRUSTED_ISSUERS_REGISTRY:
    process.env.NEXT_PUBLIC_TRUSTED_ISSUERS_REGISTRY ||
    ('0x0Af28263d542c4464e97Cff6cf09935d0D4860Ac' as Address),
  COMPANY_ASSETS_FACTORY:
    process.env.NEXT_PUBLIC_COMPANY_ASSETS_FACTORY ||
    ('0x46d353d959766A73C4e035cFC27e50e32c15B6Cf' as Address),
} as const;

export const ABIS = {
  ENTRY_POINT: parseAbi([
    'struct UserOperation { address sender; uint256 nonce; bytes initCode; bytes callData; uint256 callGasLimit; uint256 verificationGasLimit; uint256 preVerificationGas; uint256 maxFeePerGas; uint256 maxPriorityFeePerGas; bytes paymasterAndData; bytes signature; }',
    'function handleOps(UserOperation[] calldata ops, address payable beneficiary)',
    'function getNonce(address sender, uint192 key) external view returns (uint256 nonce)',
    'function getUserOpHash((address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature) userOp) external view returns (bytes32)',
    'function getSenderAddress(bytes calldata initCode) external view returns (address)',
    'error FailedOp(uint256 opIndex, string reason)',
  ]),
  FACTORY: parseAbi([
    // Info: (20251230 - Tzuhan) ----- Personal SCW -----
    'event AccountCreated(address indexed scw, uint256 pubKeyX, uint256 pubKeyY, uint256 salt, string credentialId, string username, string imageUrl)',
    'function getAddress(uint256 pubKeyX, uint256 pubKeyY, uint256 salt) public view returns (address)',
    'function createAccount(uint256 pubKeyX, uint256 pubKeyY, uint256 salt, string credentialId, string username, string imageUrl) external returns (address)',
    // Info: (20251230 - Tzuhan) ----- Company SCW -----
    'event CompanyCreated(address indexed scw, uint256[][] owners, uint256 threshold, uint256 salt, string name, string imageUrl)',
    'function createCompanyAccount(uint256[][] owners, uint256 threshold, uint256 salt, string name, string imageUrl) external returns (address)',
    'function getCompanyAddress(uint256[][] owners, uint256 threshold, uint256 salt) public view returns (address)',
  ]),
  IDENTITY_REGISTRY: parseAbi([
    'function registerIdentity(address _userAddress, address _identity, uint16 _country) external',
    'function isVerified(address _userAddress) external view returns (bool)',
  ]),
};
