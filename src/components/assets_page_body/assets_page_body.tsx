import React from 'react';
import BalanceSection from '../balance_section/balance_section';
import PnlSection from '../pnl_section/pnl_section';
import InterestSection from '../interest_section/interest_section';
import ReceiptSection from '../receipt_section/receipt_section';
import Footer from '../footer/footer';

const AssetsPageBody = () => {
  return (
    <div>
      <div className="pt-10">
        {' '}
        <div className="">
          <BalanceSection />{' '}
        </div>
        <div className="">
          <PnlSection />{' '}
        </div>
        <div className="mt-5 mb-5">
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
