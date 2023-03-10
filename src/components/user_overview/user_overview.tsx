import React from 'react';

interface IUserOverviewProps {
  depositAvailable: number;
  marginLocked: number;
  // profitOrLoss: string;
  profitOrLossAmount: number;
}

const UserOverview = ({
  depositAvailable,
  marginLocked,
  // profitOrLoss,
  profitOrLossAmount,
}: IUserOverviewProps) => {
  // if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;

  // const displayedSymbol = profitOrLoss === 'profit' ? '+' : '-';

  return (
    <>
      {/* ----------Desktop version---------- */}
      <div className="">
        <div className="hidden space-x-5 lg:flex xl:space-x-20">
          <div className="">
            <div className="text-sm text-lightGray4">Available</div>
            <div className="text-sm xl:text-base">{depositAvailable} USDT</div>
          </div>

          <div className="">
            <div className="text-sm text-lightGray4">M. Margin</div>
            <div className="text-sm xl:text-base">{marginLocked} USDT</div>
          </div>

          <div className="">
            <div className="text-sm text-lightGray4">PNL</div>
            <div className="text-sm xl:text-base">{profitOrLossAmount} USDT</div>
          </div>
        </div>
      </div>

      {/* ----------Mobile version---------- */}

      <div className="mt-5">
        {/* <div className="my-auto h-px w-full rounded bg-white/50"></div> */}

        <div className="flex justify-center space-x-10 text-center lg:hidden">
          <div className="">
            <div className="whitespace-nowrap p-1 text-sm text-lightGray4">Available</div>
            <div className="whitespace-nowrap p-1 text-xs">{depositAvailable} USDT</div>
          </div>

          <div className="">
            <div className="whitespace-nowrap p-1 text-sm text-lightGray4">M. Margin</div>
            <div className="whitespace-nowrap p-1 text-xs">{marginLocked} USDT</div>
          </div>

          <div className="">
            <div className="whitespace-nowrap p-1 text-sm text-lightGray4">PNL</div>
            <div className="whitespace-nowrap p-1 text-xs">{profitOrLossAmount} USDT</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserOverview;
