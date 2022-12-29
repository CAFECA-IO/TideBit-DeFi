import React from 'react';

interface IUserOverviewProps {
  depositAvailable: number;
  marginLocked: number;
  profitOrLoss: string;
  profitOrLossAmount: number;
}

const UserOverview = ({
  depositAvailable,
  marginLocked,
  profitOrLoss,
  profitOrLossAmount,
}: IUserOverviewProps) => {
  if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;

  const displayedSymbol = profitOrLoss === 'profit' ? '+' : '-';

  return (
    <div className="flex space-x-10">
      <div className="">
        <div className="text-sm text-lightGray4">Available</div>
        <div className="text-base">{depositAvailable} USDT</div>
      </div>

      <div className="">
        <div className="text-sm text-lightGray4">M. Margin</div>
        <div className="text-base">{marginLocked} USDT</div>
      </div>

      <div className="">
        <div className="text-sm text-lightGray4">PNL</div>
        <div className="text-base">
          {displayedSymbol} {profitOrLossAmount} USDT
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
