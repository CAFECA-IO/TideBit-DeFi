// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import '@erc3643org/erc-3643/contracts/token/IToken.sol';

interface IAgentRole {
  function isAgent(address _agent) external view returns (bool);
}

/**
 * Info: (20260223 - Tzuhan)
 * @title ClearingService
 * @notice 雙向借貸記帳系統的核心控制器
 */
contract ClearingService {
  IToken public immutable creditToken;
  IToken public immutable debtToken;

  event SettlementTransferExecuted(address indexed from, address indexed to, uint256 amount);
  event DebtGenerated(address indexed account, uint256 amount);
  event DebtOffset(address indexed account, uint256 amount);
  event ClearingMinted(address indexed to, uint256 amount);

  constructor(address _creditToken, address _debtToken) {
    require(_creditToken != address(0) && _debtToken != address(0), 'Invalid token address');
    creditToken = IToken(_creditToken);
    debtToken = IToken(_debtToken);
  }

  /**
   * Info: (20260224 - Tzuhan)
   * @notice 管理員/Agent 專用鑄幣口：鑄造資產的同時檢查並抵銷債務 (包含平台本身)
   */
  function mintAndOffset(address to, uint256 amount) external {
    // Info: (20260224 - Tzuhan) 1. 權限檢查：只有原本的 token agent (例如 backend relayer) 可以呼叫
    require(
      IAgentRole(address(creditToken)).isAgent(msg.sender),
      'Caller is not a credit token agent'
    );

    // Info: (20260224 - Tzuhan) 2. 鑄造 Credit Token
    creditToken.mint(to, amount);

    // Info: (20260224 - Tzuhan) 3. 收款方抵銷債務
    _autoOffsetDebt(to);

    // Info: (20260224 - Tzuhan) 4. 平台方(呼叫者/發放方)抵銷債務
    _autoOffsetDebt(msg.sender);

    // Info: (20260224 - Tzuhan) 5. 發送鑄造事件以供後台歷史紀錄使用
    emit ClearingMinted(to, amount);
  }

  /**
   * Info: (20260223 - Tzuhan)
   * @notice 統一轉帳與清算入口 (上帝視角代理)
   */
  function settlementTransfer(address from, address to, uint256 amount) external {
    require(msg.sender == from, 'Only sender can initiate transfer');
    require(amount > 0, 'Amount must be greater than zero');

    uint256 fromCredit = creditToken.balanceOf(from);

    // ==========================================
    // Info: (20260223 - Tzuhan) 📍 路徑 A：流動性提供與負債生成 (透支支付)
    // ==========================================
    if (fromCredit < amount) {
      uint256 shortfall = amount - fromCredit;

      // Info: (20260223 - Tzuhan) 1. 轉出僅有的 Credit (若有)
      if (fromCredit > 0) {
        creditToken.forcedTransfer(from, to, fromCredit);
      }

      // Info: (20260223 - Tzuhan) 2. 自動 Mint Debt Token (產生負債)
      debtToken.mint(from, shortfall);
      emit DebtGenerated(from, shortfall);

      // Info: (20260223 - Tzuhan) 3. 自動向接收方 Mint 補足剩餘的 Credit
      creditToken.mint(to, shortfall);
    } else {
      // Info: (20260223 - Tzuhan) 餘額充足，直接強制轉帳
      creditToken.forcedTransfer(from, to, amount);
    }

    emit SettlementTransferExecuted(from, to, amount);

    // ==========================================
    // Info: (20260223 - Tzuhan) 📍 路徑 B：債務沖銷與淨額結算 (自動還款)
    // ==========================================
    _autoOffsetDebt(to);
  }

  /**
   * Info: (20260223 - Tzuhan)
   * @dev 優先抵債邏輯 (強制淨額結算)
   */
  function _autoOffsetDebt(address account) internal {
    uint256 toDebt = debtToken.balanceOf(account);
    if (toDebt > 0) {
      uint256 toCredit = creditToken.balanceOf(account);
      if (toCredit > 0) {
        // Info: (20260223 - Tzuhan) 取債務與資產的最小值進行雙向銷毀
        uint256 offsetAmount = toDebt < toCredit ? toDebt : toCredit;

        debtToken.burn(account, offsetAmount);
        creditToken.burn(account, offsetAmount);

        emit DebtOffset(account, offsetAmount);
      }
    }
  }
}
