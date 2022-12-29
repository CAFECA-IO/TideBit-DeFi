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
    <>
      {/* ----------Desktop version---------- */}
      <div className="hidden space-x-5 lg:flex xl:space-x-20">
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

      {/* ----------Mobile version---------- */}
      <div className="flex space-x-10 text-center lg:hidden">
        <div className="">
          <div className="text-xs text-lightGray4">Available</div>
          <div className="text-xs">{depositAvailable} USDT</div>
        </div>

        <div className="">
          <div className="text-xs text-lightGray4">M. Margin</div>
          <div className="text-xs">{marginLocked} USDT</div>
        </div>

        <div className="">
          <div className="text-xs text-lightGray4">PNL</div>
          <div className="text-xs">
            {displayedSymbol} {profitOrLossAmount} USDT
          </div>
        </div>
      </div>
    </>
  );
};

export default UserOverview;
