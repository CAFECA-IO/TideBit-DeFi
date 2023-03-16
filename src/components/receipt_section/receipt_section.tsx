import React from 'react';
import ReceiptList from '../receipt_list/receipt_list';
import ReceiptSearch from '../receipt_search/receipt_search';

const ReceiptSection = () => {
  return (
    <div className="p-4 sm:p-16">
      <ReceiptSearch />
      <ReceiptList />
    </div>
  );
};

export default ReceiptSection;
