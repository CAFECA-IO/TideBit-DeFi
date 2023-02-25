import React from 'react';
import BalanceSection from '../balance_section/balance_section';
import PnlSection from '../pnl_section/pnl_section';
import InterestSection from '../interest_section/interest_section';
import ReceiptSection from '../receipt_section/receipt_section';

const AssetsPageBody = () => {
  return (
    <div className="w-full">
      <div className="">
        <BalanceSection />{' '}
      </div>
      <div className="">
        <PnlSection />{' '}
      </div>
      <div className="">
        <InterestSection />{' '}
      </div>
      <div className="">
        <ReceiptSection />
      </div>
    </div>
  );
};

export default AssetsPageBody;
