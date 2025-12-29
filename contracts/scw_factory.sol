// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "./personal_scw.sol";
import "./company_scw.sol"; // Info: (20251229 - Tzuhan) [New] 引入企業合約

/**
 * Info: (20251125 - Tzuhan) 
 * @title SCWFactory
 * @dev 負責部署 PersonalSCW 與 CompanySCW
 */
contract SCWFactory {
    address payable public immutable entryPoint;

    // Info: (20251229 - Tzuhan) --- Personal Account Events ---
    event AccountCreated(
        address indexed scw, 
        uint256 pubKeyX, 
        uint256 pubKeyY, 
        uint256 salt, 
        string credentialId,
        string name, 
        string imageUrl
    );

    // Info: (20251229 - Tzuhan) --- [New] Company Account Events ---
    event CompanyCreated(
        address indexed scw,
        uint256[][] owners,
        uint256 threshold,
        uint256 salt,
        string name,
        string imageUrl
    );

    constructor(address payable _entryPoint) {
        entryPoint = _entryPoint;
    }

    // Info: (20251229 - Tzuhan) ==========================================
    //            Personal SCW Logic
    // ==========================================

    function getAddress(uint256 pubKeyX, uint256 pubKeyY, uint256 salt) public view returns (address) {
        // Info: (20251125 - Tzuhan) 1. 取得 PersonalSCW 的 Creation Code (包含合約編譯後的 Bytecode)
        bytes memory bytecode = type(PersonalSCW).creationCode;

        // Info: (20251125 - Tzuhan) 2. 將 constructor 參數打包 (EntryPoint, PubKeyX, PubKeyY)
        // 重要：這些參數會影響合約的初始化代碼 Hash，必須與 createAccount 傳入的一致
        bytes memory constructorArgs = abi.encode(address(entryPoint), pubKeyX, pubKeyY);

        // Info: (20251125 - Tzuhan) 3. 拼接: Creation Code + Constructor Args
        bytes memory fullBytecode = abi.encodePacked(bytecode, constructorArgs);

        // Info: (20251125 - Tzuhan) 4. 計算 Bytecode Hash
        bytes32 bytecodeHash = keccak256(fullBytecode);

        // Info: (20251125 - Tzuhan) 5. 使用 CREATE2 公式計算: keccak256(0xff + sender + salt + bytecodeHash)
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                bytecodeHash
            )
        );

        // Info: (20251125 - Tzuhan) 6. 取後 20 bytes 轉為 address
        return address(uint160(uint256(hash)));
    }

    /**
     * Info: (20251125 - Tzuhan) 
     * @dev 部署 PersonalSCW 合約
     * 這是 Lazy Deployment 中，Bundler 會透過 UserOp 的 initCode 呼叫的函式
     * Update: 新增 name 和 imageUrl 參數
     */    
    function createAccount(
        uint256 pubKeyX, 
        uint256 pubKeyY, 
        uint256 salt, 
        string calldata credentialId,
        string calldata name, 
        string calldata imageUrl
    ) external returns (PersonalSCW ret) {
        address addr = getAddress(pubKeyX, pubKeyY, salt);

        // Info: (20251125 - Tzuhan) 2. 檢查是否已經部署 (使用 Solidity 0.8+ 內建語法，更乾淨)
        if (addr.code.length > 0) {
            return PersonalSCW(payable(addr));
        }

        // Info: (20251125 - Tzuhan) 3. 使用 CREATE2 進行部署
        ret = new PersonalSCW{salt: bytes32(salt)}(entryPoint, pubKeyX, pubKeyY);

        // Info: (20251125 - Tzuhan) 4. 安全檢查：確保計算的地址與實際部署地址一致
        require(address(ret) == addr, "Factory: address mismatch");

        // Info: (20251125 - Tzuhan) 5. 發送事件。Update: 發送包含 Metadata 的事件
        emit AccountCreated(address(ret), pubKeyX, pubKeyY, salt, credentialId, name, imageUrl);
    }

    // Info: (20251229 - Tzuhan) ==========================================
    //            [New] Company SCW Logic
    // ==========================================

    /**
     * Info: (20251229 - Tzuhan) 計算 CompanySCW 地址
     * @param owners 初始擁有者公鑰列表 [[x1, y1], [x2, y2]]
     * @param threshold 門檻值
     * @param salt 隨機鹽
     */
    function getCompanyAddress(
        uint256[][] memory owners, 
        uint256 threshold, 
        uint256 salt
    ) public view returns (address) {
        bytes memory bytecode = type(CompanySCW).creationCode;
        // Info: (20251229 - Tzuhan) 建構子參數：EntryPoint, Owners Array, Threshold
        bytes memory constructorArgs = abi.encode(address(entryPoint), owners, threshold);
        bytes memory fullBytecode = abi.encodePacked(bytecode, constructorArgs);
        bytes32 bytecodeHash = keccak256(fullBytecode);
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                bytecodeHash
            )
        );
        return address(uint160(uint256(hash)));
    }

    /**
     * Info: (20251229 - Tzuhan) 部署 CompanySCW
     */
    function createCompanyAccount(
        uint256[][] memory owners, 
        uint256 threshold, 
        uint256 salt,
        string calldata name,
        string calldata imageUrl
    ) external returns (CompanySCW ret) {
        address addr = getCompanyAddress(owners, threshold, salt);
        
        if (addr.code.length > 0) {
            return CompanySCW(payable(addr));
        }

        ret = new CompanySCW{salt: bytes32(salt)}(entryPoint, owners, threshold);
        
        require(address(ret) == addr, "Factory: address mismatch");

        // Info: (20251229 - Tzuhan) 這裡 owners 雖然是 memory 陣列，但在 Event 中會被正確紀錄
        emit CompanyCreated(address(ret), owners, threshold, salt, name, imageUrl);
    }
}
