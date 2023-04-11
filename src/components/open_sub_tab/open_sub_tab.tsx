import React, {useContext} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {MarketContext} from '../../contexts/market_context';
import {toDisplayAcceptedCFDOrder} from '../../lib/common';
import {IDisplayAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';

const OpenSubTab = () => {
  const {openCFDs} = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  /* Deprecated: replaced by `toDisplayAcceptedCFDOrder` (20230407 - tzuhan)
  const toOpenPositionItems = (cfds: IAcceptedCFDOrder[]): IDisplayAcceptedCFDOrder[] => {
    const displayedOpenPositionList = cfds.map(cfd => {
      // TODO: replace `twoDecimal` with `toLocaleString` (20230325 - Shirley)
      const rTp =
        cfd.orderSnapshot.typeOfPosition === TypeOfPosition.BUY
          ? twoDecimal(cfd.orderSnapshot.openPrice * (1 + SUGGEST_TP / cfd.orderSnapshot.leverage))
          : twoDecimal(cfd.orderSnapshot.openPrice * (1 - SUGGEST_TP / cfd.orderSnapshot.leverage));
      const rSl =
        cfd.orderSnapshot.typeOfPosition === TypeOfPosition.BUY
          ? twoDecimal(cfd.orderSnapshot.openPrice * (1 - SUGGEST_SL / cfd.orderSnapshot.leverage))
          : twoDecimal(cfd.orderSnapshot.openPrice * (1 + SUGGEST_SL / cfd.orderSnapshot.leverage));

      // TODO: (20230314 - Shirley) get price point from `marketCtx`
      const positionLineGraph = [
        10050, 9972, 1060, 2065, 3042, 825, 20000, 7100, 4532, 720, 815, 632, 90, 10,
      ];

      // TODO: (20230314 - Shirley) get the very last price point from `marketCtx`
      const marketPrice =
        cfd.orderSnapshot.typeOfPosition === TypeOfPosition.BUY
          ? marketCtx.tickerLiveStatistics?.sellEstimatedFilledPrice ?? 0
          : marketCtx.tickerLiveStatistics?.buyEstimatedFilledPrice ?? 999999999;

      const marketValue = marketPrice * cfd.orderSnapshot.amount;

      const openValue = cfd.orderSnapshot.openPrice * cfd.orderSnapshot.amount;

      // TODO: (20230314 - Shirley) Calculate with `positionLineGraph[n-1]` buy/sell price
      const pnlSoFar =
        cfd.orderSnapshot.typeOfPosition === TypeOfPosition.BUY
          ? twoDecimal(marketValue - openValue)
          : twoDecimal(openValue - marketValue);

      const suggestion: ICFDSuggestion = {
        takeProfit: rTp,
        stopLoss: rSl,
      };

      const pnl: IPnL = {
        type: pnlSoFar < 0 ? ProfitState.LOSS : ProfitState.PROFIT,
        value: Math.abs(pnlSoFar),
      };

      return {
        ...cfd,
        openValue,
        positionLineGraph,
        suggestion,
        pnl,
      };
    });

    return displayedOpenPositionList;
  };
  */

  const cfds = openCFDs
    .filter(cfd => cfd.display)
    .map(cfd => {
      const positionLineGraph = marketCtx.listTickerPositions(cfd.targetAsset, {
        begin: cfd.createTimestamp,
      });
      const displayCFD: IDisplayAcceptedCFDOrder = toDisplayAcceptedCFDOrder(
        cfd,
        positionLineGraph
      );
      return displayCFD;
    });

  /* Till: (20230420 - Julian) dummy data for open position item */
  const dummyCFDs: IDisplayAcceptedCFDOrder[] = [
    {
      display: true,
      id: 'open00001',
      orderType: 'CFD',
      balanceSnapshot: {
        createTimestamp: 1681253000,
        currency: 'USDT',
        available: 1000,
        locked: 30,
      },
      balanceDifferenceCauseByOrder: {
        currency: 'USDT',
        available: 1000,
        locked: 30,
      },
      orderStatus: 'SUCCESS',
      createTimestamp: 1681253000,
      applyData: {
        orderType: 'CFD',
        operation: 'CREATE',
      },
      orderSnapshot: {
        id: 'open00001',
        txid: '0x000000001',
        ticker: 'ETH',
        openPrice: 2321,
        orderType: 'CFD',
        state: 'OPENING',
        referenceId: '',
        createTimestamp: 1681253000,
        unitAsset: 'USDT',
        targetAsset: 'ETH',
        leverage: 5,
        amount: 1.52,
        margin: {
          asset: 'USDT',
          amount: 1000,
        },
        liquidationTime: 1681758602,
        liquidationPrice: 300,
        typeOfPosition: 'BUY',
        fee: 0,
        guaranteedStop: false,
      },
      pnl: {
        type: 'PROFIT',
        value: 0.589,
      },
      openValue: 3526.4,
      closeValue: 4371.32,
      positionLineGraph: [10050, 9972, 13060, 4065, 3042, 8235, 20000, 7100, 4532, 7894],
      suggestion: {
        takeProfit: 0,
        stopLoss: 0,
      },
      targetAmount: 2331,
      targetAsset: 'ETH',
      userSignature: '',
      nodeSignature: '',
    },
    {
      display: true,
      id: 'open00002',
      orderType: 'CFD',
      balanceSnapshot: {
        createTimestamp: 1681203000,
        currency: 'USDT',
        available: 1000,
        locked: 50,
      },
      balanceDifferenceCauseByOrder: {
        currency: 'USDT',
        available: 1000,
        locked: 50,
      },
      orderStatus: 'SUCCESS',
      createTimestamp: 1681203000,
      applyData: {
        orderType: 'CFD',
        operation: 'CREATE',
      },
      orderSnapshot: {
        id: 'open00002',
        txid: '0x000000002',
        ticker: 'ETH',
        openPrice: 8731,
        orderType: 'CFD',
        state: 'OPENING',
        referenceId: '',
        createTimestamp: 1681203000,
        unitAsset: 'USDT',
        targetAsset: 'ETH',
        leverage: 5,
        amount: 21.2,
        margin: {
          asset: 'USDT',
          amount: 1000,
        },
        liquidationTime: 1681783602,
        liquidationPrice: 230,
        typeOfPosition: 'SELL',
        fee: 0,
        guaranteedStop: true,
        stopLoss: 600,
      },
      pnl: {
        type: 'LOSS',
        value: 21.302,
      },
      openValue: 5312.4,
      closeValue: 4371.32,
      positionLineGraph: [4020, 972, 5720, 2000, 7100, 815, 632, 2065, 3422, 4532, 6720, 815],
      suggestion: {
        takeProfit: 0,
        stopLoss: 600,
      },
      targetAmount: 2331,
      targetAsset: 'ETH',
      userSignature: '',
      nodeSignature: '',
    },
    {
      display: true,
      id: 'open00003',
      orderType: 'CFD',
      balanceSnapshot: {
        createTimestamp: 1687510000,
        currency: 'USDT',
        available: 1000,
        locked: 50,
      },
      balanceDifferenceCauseByOrder: {
        currency: 'USDT',
        available: 1000,
        locked: 50,
      },
      orderStatus: 'SUCCESS',
      createTimestamp: 1687510000,
      applyData: {
        orderType: 'CFD',
        operation: 'CREATE',
      },
      orderSnapshot: {
        id: 'open00003',
        txid: '0x000000003',
        ticker: 'ETH',
        openPrice: 2931,
        orderType: 'CFD',
        state: 'OPENING',
        referenceId: '',
        createTimestamp: 1687510000,
        unitAsset: 'USDT',
        targetAsset: 'ETH',
        leverage: 5,
        amount: 2.26,
        margin: {
          asset: 'USDT',
          amount: 1000,
        },
        liquidationTime: 1681208500,
        liquidationPrice: 400,
        typeOfPosition: 'BUY',
        fee: 0,
        guaranteedStop: true,
        takeProfit: 50000,
      },
      pnl: {
        type: 'LOSS',
        value: 621.3,
      },
      openValue: 6392.4,
      closeValue: 4371.32,
      positionLineGraph: [30422, 4532, 560, 720, 8145, 8925, 5245, 20700, 7100, 47278],
      suggestion: {
        takeProfit: 50000,
        stopLoss: 0,
      },
      targetAmount: 2331,
      targetAsset: 'ETH',
      userSignature: '',
      nodeSignature: '',
    },
    {
      display: true,
      id: 'open00004',
      orderType: 'CFD',
      balanceSnapshot: {
        createTimestamp: 1683600000,
        currency: 'USDT',
        available: 1000,
        locked: 50,
      },
      balanceDifferenceCauseByOrder: {
        currency: 'USDT',
        available: 1000,
        locked: 50,
      },
      orderStatus: 'SUCCESS',
      createTimestamp: 1683600000,
      applyData: {
        orderType: 'CFD',
        operation: 'CREATE',
      },
      orderSnapshot: {
        id: 'open00004',
        txid: '0x000000004',
        ticker: 'SOL',
        openPrice: 2931,
        orderType: 'CFD',
        state: 'OPENING',
        referenceId: '',
        createTimestamp: 1683600000,
        unitAsset: 'USDT',
        targetAsset: 'SOL',
        leverage: 5,
        amount: 72.9,
        margin: {
          asset: 'USDT',
          amount: 1000,
        },
        liquidationTime: 1682806007,
        liquidationPrice: 50,
        typeOfPosition: 'SELL',
        fee: 0,
        guaranteedStop: true,
        stopLoss: 200,
      },
      pnl: {
        type: 'PROFIT',
        value: 81.43,
      },
      openValue: 2372.9,
      closeValue: 4371.32,
      positionLineGraph: [50, 89, 4532, 560, 720, 8145, 8925, 5245, 10700, 710, 650, 343],
      suggestion: {
        takeProfit: 0,
        stopLoss: 20,
      },
      targetAmount: 2331,
      targetAsset: 'SOL',
      userSignature: '',
      nodeSignature: '',
    },
    {
      display: true,
      id: 'open00005',
      orderType: 'CFD',
      balanceSnapshot: {
        createTimestamp: 1682351000,
        currency: 'USDT',
        available: 1000,
        locked: 50,
      },
      balanceDifferenceCauseByOrder: {
        currency: 'USDT',
        available: 1000,
        locked: 50,
      },
      orderStatus: 'SUCCESS',
      createTimestamp: 1682351000,
      applyData: {
        orderType: 'CFD',
        operation: 'CREATE',
      },
      orderSnapshot: {
        id: 'open00005',
        txid: '0x000000005',
        ticker: 'BTC',
        openPrice: 2931,
        orderType: 'CFD',
        state: 'OPENING',
        referenceId: '',
        createTimestamp: 1682351000,
        unitAsset: 'USDT',
        targetAsset: 'SOL',
        leverage: 5,
        amount: 72.9,
        margin: {
          asset: 'USDT',
          amount: 1000,
        },
        liquidationTime: 1683206007,
        liquidationPrice: 50,
        typeOfPosition: 'SELL',
        fee: 0,
        guaranteedStop: true,
        takeProfit: 300,
        stopLoss: 100,
      },
      pnl: {
        type: 'PROFIT',
        value: 111.1,
      },
      openValue: 5823.24,
      closeValue: 4371.32,
      positionLineGraph: [150, 4323, 42, 289, 132, 1485, 650, 143, 290],
      suggestion: {
        takeProfit: 0,
        stopLoss: 20,
      },
      targetAmount: 2331,
      targetAsset: 'BTC',
      userSignature: '',
      nodeSignature: '',
    },
    {
      display: true,
      id: 'open00006',
      orderType: 'CFD',
      balanceSnapshot: {
        createTimestamp: 1682325400,
        currency: 'USDT',
        available: 1000,
        locked: 50,
      },
      balanceDifferenceCauseByOrder: {
        currency: 'USDT',
        available: 1000,
        locked: 50,
      },
      orderStatus: 'SUCCESS',
      createTimestamp: 1682325400,
      applyData: {
        orderType: 'CFD',
        operation: 'CREATE',
      },
      orderSnapshot: {
        id: 'open00006',
        txid: '0x000000006',
        ticker: 'ETH',
        openPrice: 8731,
        orderType: 'CFD',
        state: 'OPENING',
        referenceId: '',
        createTimestamp: 1682325400,
        unitAsset: 'USDT',
        targetAsset: 'ETH',
        leverage: 5,
        amount: 21.2,
        margin: {
          asset: 'USDT',
          amount: 1000,
        },
        liquidationTime: 1681253602,
        liquidationPrice: 1500,
        typeOfPosition: 'BUY',
        fee: 0,
        guaranteedStop: false,
      },
      pnl: {
        type: 'LOSS',
        value: 1.413,
      },
      openValue: 3392.4,
      closeValue: 4371.32,
      positionLineGraph: [972, 5720, 20050, 7100, 815, 632, 2065, 3422, 4532, 6720, 8415, 2451],
      suggestion: {
        takeProfit: 0,
        stopLoss: 0,
      },
      targetAmount: 2331,
      targetAsset: 'ETH',
      userSignature: '',
      nodeSignature: '',
    },
  ];

  const openPositionList = dummyCFDs.map(cfd => {
    return (
      <div key={cfd.orderSnapshot.id}>
        <OpenPositionItem openCfdDetails={cfd} />
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    );
  });

  return (
    <>
      <div className="h-full overflow-y-auto overflow-x-hidden pb-40">
        <div className="">
          {/* 6 */}
          {openPositionList}
        </div>
        {/* Divider */}
        {/* <div className="my-auto h-px w-full rounded bg-white/50"></div> */}
      </div>
    </>
  );
};

export default OpenSubTab;
