import { Address, parseAbi } from 'viem';

export const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.isuncoin.com';
// Info: (20260114 - Tzuhan) ERC-4337
export const CONTRACT_ADDRESSES = {
  ENTRY_POINT: (process.env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS ||
    '0x1e51E13D511016aB69C0F58c4282784eA5401Cf6') as Address,
  FACTORY: (process.env.NEXT_PUBLIC_SCW_FACTORY_ADDRESS ||
    '0x59e486F5D1599dd9eEe587fB8663Ad45f579a469') as Address, //
  NTD_TOKEN: (process.env.NEXT_PUBLIC_NTD_TOKEN_ADDRESS ||
    '0xb3ce18F4fB5f64A32b5417B5590B36667A4d8dE7') as Address, //
  DEBIT_TOKEN: (process.env.NEXT_PUBLIC_DEBIT_TOKEN_ADDRESS ||
    '0x1E7d4784138B50E83D002136386eFfFFD604d6C2') as Address, //
  COMPLIANCE_NTD: (process.env.NEXT_PUBLIC_COMPLIANCE_NTD_ADDRESS ||
    '0xC3e8B5a09d33dBbCFa8cDB41EE1B1b80be0858C7') as Address, //
  COMPLIANCE_DEBIT: (process.env.NEXT_PUBLIC_COMPLIANCE_DEBIT_ADDRESS ||
    '0x48332a0dBFffdcb004e893deCbe1C02bAff3874D') as Address, //  
  IDENTITY_REGISTRY: (process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS ||
    '0x50C2F95FA33f1Cfc8A8f2b102E70F8051d3DAd00') as Address, //
  TRUSTED_ISSUERS_REGISTRY: (process.env.NEXT_PUBLIC_TRUSTED_ISSUERS_REGISTRY_ADDRESS ||
    '0x610E94F7CDcBbb03a8D0872496D29B9c459b889c') as Address, //
  CLAIM_TOPICS_REGISTRY: (process.env.NEXT_PUBLIC_CLAIM_TOPICS_REGISTRY_ADDRESS ||
    '0x8088D1664983E2F7BF0c714F15F85b23293D559B') as Address, //
  IDENTITY_IMPLEMENTATION: (process.env.NEXT_PUBLIC_IDENTITY_IMPLEMENTATION_ADDRESS ||
    '0xBEF4aA1bBd233aA22D397381D3308ED9be157C8E') as Address, //
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
  // Info: (20260210 - Tzuhan) --- Debt Token (Liability) ---
  DEBIT_TOKEN: parseAbi([
    // Info: (20260210 - Tzuhan) Agent 需要用 mint 來產生負債 (借記)
    'function mint(address to, uint256 amount) external',
    // Info: (20260210 - Tzuhan) Agent 需要用 burn 來清償負債 (貸記/沖銷)
    'function burn(address userAddress, uint256 amount) external',
    // Info: (20260210 - Tzuhan) 強制轉帳用於特殊清算 (雖然 Debt 通常不可轉讓，但 Agent 可能需要移動它)
    'function forcedTransfer(address from, address to, uint256 amount) external returns (bool)',
    'function balanceOf(address account) view returns (uint256)',
    // Info: (20260210 - Tzuhan) 即使被凍結，Agent 仍需能操作
    'function isFrozen(address userAddress) external view returns (bool)',
    'function setAddressFrozen(address userAddress, bool freeze) external',
    // Info: (20260210 - Tzuhan) 連結的合規與身分 (與 NTD 共用)
    'function identityRegistry() external view returns (address)',
    'function compliance() external view returns (address)',
  ]),
};
