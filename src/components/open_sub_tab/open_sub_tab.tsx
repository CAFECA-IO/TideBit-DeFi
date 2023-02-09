import React, {useContext, useState} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import PositionDetailsModal from '../position_details_modal/position_details_modal';
import {UserContext} from '../../lib/contexts/user_context';

const OpenSubTab = () => {
  const {getOpenedCFD} = useContext(UserContext);
  const allOpenedCFDs = getOpenedCFD();
  const displayedCFDs = allOpenedCFDs.map((cfd, index) => {
    return (
      <div key={cfd.id}>
        <OpenPositionItem
          openCfdDetails={cfd}
          profitOrLoss="loss"
          longOrShort="long"
          value={656.9}
          ticker="BTC"
          passedHour={11}
          profitOrLossAmount={34.9}
          tickerTrendArray={[1230, 1272, 1120, 1265, 1342, 1299]}
          horizontalValueLine={1230}
        />
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    );
  });
  // console.log('cfds: ', allOpenedCFDs);

  //   const staleCFDs = (<OpenPositionItem
  //     openCfdDetails={allOpenedCFDs[0]}
  //     profitOrLoss="loss"
  //     longOrShort="long"
  //     value={656.9}
  //     ticker="BTC"
  //     passedHour={11}
  //     profitOrLossAmount={34.9}
  //     tickerTrendArray={[1230, 1272, 1120, 1265, 1342, 1299]}
  //     horizontalValueLine={1230}
  //   />
  //   {/* <PositionDetailsModal
  //     // openCfdDetails={dataFormat}
  //     modalVisible={modalVisible}
  //     modalClickHandler={modalClickHandler}
  //   /> */}
  // </div>
  // {/* Divider */}
  // <div className="my-auto h-px w-full rounded bg-white/50"></div>

  // <div className="">
  //   {/* 6 */}
  //   <OpenPositionItem
  //     openCfdDetails={allOpenedCFDs[1]}
  //     profitOrLoss="profit"
  //     longOrShort="short"
  //     value={631.1}
  //     ticker="ETH"
  //     passedHour={15}
  //     profitOrLossAmount={29.9}
  //     tickerTrendArray={[153000, 137200, 122000, 126500, 134200, 129900]}
  //     horizontalValueLine={153000}
  //   />
  // </div>
  // {/* Divider */}
  // <div className="my-auto h-px w-full rounded bg-white/50"></div>

  // <div className="">
  //   {/* 12 */}
  //   <OpenPositionItem
  //     openCfdDetails={allOpenedCFDs[2]}
  //     profitOrLoss="profit"
  //     longOrShort="short"
  //     value={1234567.8}
  //     ticker="BTC"
  //     passedHour={20}
  //     profitOrLossAmount={1234.5}
  //     tickerTrendArray={[90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10]}
  //     horizontalValueLine={90}
  //   />
  // </div>
  // {/* Divider */}
  // <div className="my-auto h-px w-full rounded bg-white/50"></div>

  // <div className="">
  //   {/* 31 */}
  //   <OpenPositionItem
  //     openCfdDetails={allOpenedCFDs[3]}
  //     profitOrLoss="loss"
  //     longOrShort="long"
  //     value={1234567.8}
  //     ticker="BTC"
  //     passedHour={23}
  //     profitOrLossAmount={1234.5}
  //     tickerTrendArray={[
  //       80, 55, 100, 90, 150, 140, 130, 160, 45, 20, 76, 45, 65, 44, 39, 65, 85, 47, 61, 23,
  //       72, 60, 65, 42, 25, 32, 20, 15, 32, 90, 10,
  //     ]}
  //     horizontalValueLine={80}
  //   />)

  // console.log('in open sub tab, opened CFDs:', getOpenedCFD());
  return (
    <>
      <div className="">
        <div className="">
          {/* 6 */}
          {displayedCFDs}
        </div>
        {/* Divider */}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    </>
  );
};

export default OpenSubTab;
