import React from 'react';
import BalanceSection from '../balance_section/balance_section';
import PnlSection from '../pnl_section/pnl_section';
import InterestSection from '../interest_section/interest_section';
import ReceiptSection from '../receipt_section/receipt_section';
import Footer from '../footer/footer';

const AssetsPageBody = () => {
  return (
    <div>
      <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden pt-0">
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

      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default AssetsPageBody;
