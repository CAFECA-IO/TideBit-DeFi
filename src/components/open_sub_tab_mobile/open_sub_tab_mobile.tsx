import React, {Dispatch, SetStateAction, useState} from 'react';
import {ImCross} from 'react-icons/im';
import {DUMMY_OPEN_POSITION_DATA} from '../../constants/config';
import OpenPositionItem from '../open_position_item/open_position_item';

const openPositionList = DUMMY_OPEN_POSITION_DATA.map(items => {
  return (
    <>
      <OpenPositionItem
        key={items.id}
        profitOrLoss={items.profitOrLoss}
        longOrShort={items.longOrShort}
        value={items.value}
        ticker={items.ticker}
        passedHour={items.passedHour}
        profitOrLossAmount={items.profitOrLossAmount}
        tickerTrendArray={items.tickerTrendArray}
        horizontalValueLine={items.horizontalValueLine}
      />

      <span className="my-auto block h-px w-full rounded bg-white/50"></span>
    </>
  );
});

interface IopenSubTabParams {
  openSubMenu?: boolean;
  setOpenSubMenu?: Dispatch<SetStateAction<boolean>>;
}

const OpenSubTabMobile = ({openSubMenu, setOpenSubMenu}: IopenSubTabParams) => {
  const [openMenu, setOpenMenu] =
    typeof setOpenSubMenu !== 'function' ? useState(false) : [openSubMenu, setOpenSubMenu];

  const clickHandler = () => {
    setOpenMenu(false);
  };

  return (
    <>
      <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-700px">
        <div className="mb-3">
          <ImCross onClick={clickHandler} className="float-right cursor-pointer" />
        </div>
        <div className="h-80vh overflow-y-auto px-4">{openPositionList}</div>
      </div>
    </>
  );
};

export default OpenSubTabMobile;
