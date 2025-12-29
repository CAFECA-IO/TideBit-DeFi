// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@account-abstraction/contracts/core/EntryPoint.sol";
import "./lib/fcl_ecdsa.sol";
import "./lib/utils/base64url.sol";

/**
 * Info: (20251229 - Tzuhan)
 * @title CompanySCW
 * @dev 支援 M-of-N 多簽的企業智能合約錢包 (Passkey / P-256 版本)
 */
contract CompanySCW is IAccount {
    EntryPoint public immutable entryPoint;

    // Info: (20251229 - Tzuhan) 多簽門檻
    uint256 public threshold;
    
    // Info: (20251229 - Tzuhan) 記錄擁有者數量
    uint256 public ownerCount;

    /**
     * Info: (20251229 - Tzuhan) 儲存授權的 Passkey 公鑰
     * Key: keccak256(abi.encode(pubKeyX, pubKeyY))
     */
    mapping(bytes32 => bool) public owners;

    event OwnerAdded(bytes32 indexed pubKeyHash, uint256 x, uint256 y);
    event OwnerRemoved(bytes32 indexed pubKeyHash, uint256 x, uint256 y);
    event ThresholdChanged(uint256 newThreshold);

    // Info: (20251229 - Tzuhan) 限制只能由合約自己呼叫 (透過 execute / UserOp)
    modifier onlySelf() {
        require(msg.sender == address(this), "CompanySCW: must call via UserOp");
        _;
    }

    /**
     * Info: (20251229 - Tzuhan)
     * @param _entryPoint EntryPoint 地址
     * @param _owners 初始擁有者列表 [[x1, y1], [x2, y2], ...]
     * @param _threshold 初始門檻值
     */
    constructor(
        address payable _entryPoint, 
        uint256[][] memory _owners, 
        uint256 _threshold
    ) {
        require(_threshold > 0 && _threshold <= _owners.length, "Invalid threshold");
        entryPoint = EntryPoint(_entryPoint);
        threshold = _threshold;

        for (uint256 i = 0; i < _owners.length; i++) {
            require(_owners[i].length == 2, "Invalid pubkey format");
            _addOwner(_owners[i][0], _owners[i][1]);
        }
    }

    // Info: (20251229 - Tzuhan) --- 管理介面 (必須經由多簽通過後執行) ---

    function addOwner(uint256 x, uint256 y) public onlySelf {
        _addOwner(x, y);
    }

    function removeOwner(uint256 x, uint256 y) public onlySelf {
        bytes32 hash = keccak256(abi.encode(x, y));
        require(owners[hash], "Not an owner");
        // Info: (20251229 - Tzuhan) 移除後，剩餘人數不能少於門檻
        require(ownerCount - 1 >= threshold, "Owner count cannot be less than threshold");

        owners[hash] = false;
        ownerCount--;
        emit OwnerRemoved(hash, x, y);
    }

    function changeThreshold(uint256 newThreshold) public onlySelf {
        require(newThreshold > 0 && newThreshold <= ownerCount, "Invalid threshold");
        threshold = newThreshold;
        emit ThresholdChanged(newThreshold);
    }

    function _addOwner(uint256 x, uint256 y) internal {
        bytes32 hash = keccak256(abi.encode(x, y));
        if (!owners[hash]) {
            owners[hash] = true;
            ownerCount++;
            emit OwnerAdded(hash, x, y);
        }
    }

    // Info: (20251229 - Tzuhan) --- 驗證結構 ---

    // Info: (20251229 - Tzuhan) 單一 Passkey 簽名結構
    struct WebAuthnSignature {
        bytes authenticatorData;
        bytes clientDataJSON;
        uint256 challengeLocation;
        uint256 responseTypeLocation;
        uint256 r;
        uint256 s;
        uint256 pubKeyX;
        uint256 pubKeyY;
    }

    /**
     * Info: (20251229 - Tzuhan)
     * 核心驗證邏輯：覆寫 validateUserOp
     * UserOp.signature 必須是 `abi.encode(WebAuthnSignature[])`
     */
    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external override returns (uint256) {
        require(msg.sender == address(entryPoint), "CompanySCW: unauthorized");

        // Info: (20251229 - Tzuhan) 1. 支付 Gas 預付款 (若是 Relayer 買單則 missingAccountFunds 為 0)
        if (missingAccountFunds != 0) {
            (bool success, ) = payable(msg.sender).call{value: missingAccountFunds}("");
            (success);
        }

        // Info: (20251229 - Tzuhan) 2. 驗證多簽
        // Info: (20251229 - Tzuhan) 解碼簽名陣列
        WebAuthnSignature[] memory signatures = abi.decode(userOp.signature, (WebAuthnSignature[]));
        
        // Info: (20251229 - Tzuhan) 簽名數量檢查 (節省 Gas)
        if (signatures.length < threshold) {
            return 1; // SIG_VALIDATION_FAILED
        }

        // Info: (20251229 - Tzuhan) 驗證每個簽名
        // 重要：為了防止重複簽名湊數，我們要求簽名必須按照 Public Key Hash 由小到大排序
        uint256 validCount = 0;
        bytes32 lastOwnerHash = bytes32(0);

        for (uint256 i = 0; i < signatures.length; i++) {
            WebAuthnSignature memory sig = signatures[i];
            
            // Info: (20251229 - Tzuhan) A. 計算公鑰 Hash
            bytes32 currentOwnerHash = keccak256(abi.encode(sig.pubKeyX, sig.pubKeyY));

            // Info: (20251229 - Tzuhan) B. 檢查是否為授權 Owner
            if (!owners[currentOwnerHash]) {
                return 1;
            }

            // Info: (20251229 - Tzuhan) C. 檢查排序與去重 (Current Hash 必須大於 Last Hash)
            // 這確保了同一個 Owner 不能簽兩次，且簽名順序固定
            if (uint256(currentOwnerHash) <= uint256(lastOwnerHash)) {
                return 1; 
            }
            lastOwnerHash = currentOwnerHash;

            // Info: (20251229 - Tzuhan)D. 驗證單一 WebAuthn 簽名
            if (!_verifyOneSignature(sig, userOpHash)) {
                return 1;
            }

            validCount++;
        }

        // Info: (20251229 - Tzuhan)3. 最終門檻檢查
        if (validCount < threshold) {
            return 1;
        }

        return 0;
    }

    function _verifyOneSignature(WebAuthnSignature memory sig, bytes32 userOpHash) internal view returns (bool) {
        // Info: (20251229 - Tzuhan)1. 驗證 Challenge
        string memory challengeBase64 = Base64Url.encode(abi.encodePacked(userOpHash));
        bytes memory challengeBytes = bytes(challengeBase64);

        if (sig.challengeLocation + challengeBytes.length > sig.clientDataJSON.length) return false;
        for (uint i = 0; i < challengeBytes.length; i++) {
            if (sig.clientDataJSON[sig.challengeLocation + i] != challengeBytes[i]) {
                return false;
            }
        }

        // Info: (20251229 - Tzuhan) 2. 驗證 Type ("webauthn.get")
        bytes memory expectedType = bytes("webauthn.get");
        if (sig.responseTypeLocation + expectedType.length > sig.clientDataJSON.length) return false;
        for (uint i = 0; i < expectedType.length; i++) {
            if (sig.clientDataJSON[sig.responseTypeLocation + i] != expectedType[i]) {
                return false;
            }
        }

        // Info: (20251229 - Tzuhan) 3. 驗證 P-256 簽名
        bytes32 clientDataHash = sha256(sig.clientDataJSON);
        bytes32 messageHash = sha256(abi.encodePacked(sig.authenticatorData, clientDataHash));
        
        return FCL_ecdsa.ecdsa_verify(messageHash, sig.r, sig.s, sig.pubKeyX, sig.pubKeyY);
    }

    function execute(address dest, uint256 value, bytes calldata func) external {
        require(msg.sender == address(this) || msg.sender == address(entryPoint), "CompanySCW: unauthorized");
        (bool success, ) = dest.call{value: value}(func);
        require(success, "CompanySCW: execution failed");
    }

    receive() external payable {}
}