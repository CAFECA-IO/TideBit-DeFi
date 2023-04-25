import React, {useContext, Suspense, useEffect, useRef} from 'react';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {MarketContext} from '../../contexts/market_context';
import {getTimestamp, getTimestampInMilliseconds, toDisplayCFDOrder} from '../../lib/common';
import {
  IDisplayCFDOrder,
  listDummyDisplayCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {TypeOfPosition} from '../../constants/type_of_position';
import {
  DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS,
  QUOTATION_RENEWAL_INTERVAL_SECONDS,
  WAITING_TIME_FOR_USER_SIGNING,
  unitAsset,
} from '../../constants/config';
import {IQuotation, getDummyQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {defaultResultSuccess} from '../../interfaces/tidebit_defi_background/result';
import useStateRef from 'react-usestateref';

const DEFAULT_TICKER = 'ETH';
const SELL_PRICE_ERROR = 0;
const BUY_PRICE_ERROR = 0;

type Callback = () => void;

const OpenSubTab = () => {
  const {openCFDs} = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const ticker = marketCtx?.selectedTickerRef?.current?.currency ?? DEFAULT_TICKER;

  const defaultBuyQuotation: IQuotation = getDummyQuotation(ticker, TypeOfPosition.BUY);
  const defaultSellQuotation: IQuotation = getDummyQuotation(ticker, TypeOfPosition.SELL);

  const [longQuotation, setLongQuotation, longQuotationRef] =
    useStateRef<IQuotation>(defaultBuyQuotation);
  const [shortQuotation, setShortQuotation, shortQuotationRef] =
    useStateRef<IQuotation>(defaultSellQuotation);

  const [secondsLeft, setSecondsLeft, secondsLeftRef] = useStateRef(
    DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS
  );

  const getQuotation = async (tickerId: string) => {
    let longQuotation = defaultResultSuccess;
    let shortQuotation = defaultResultSuccess;

    try {
      longQuotation = await marketCtx.getCFDQuotation(tickerId, TypeOfPosition.BUY);
      shortQuotation = await marketCtx.getCFDQuotation(tickerId, TypeOfPosition.SELL);

      const long = longQuotation.data as IQuotation;
      const short = shortQuotation.data as IQuotation;

      // Info: if there's error fetching quotation, use the previous quotation or calculate the quotation (20230327 - Shirley)
      if (
        longQuotation.success &&
        long.typeOfPosition === TypeOfPosition.BUY &&
        longQuotation.data !== null
      ) {
        setLongQuotation(long);
      } else {
        const buyPrice =
          (marketCtx.selectedTickerRef.current?.price ?? BUY_PRICE_ERROR) *
          (1 + (marketCtx.tickerLiveStatistics?.spread ?? 0));

        const buyQuotation: IQuotation = {
          ticker: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
          targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
          typeOfPosition: TypeOfPosition.BUY,
          unitAsset: unitAsset,
          price: buyPrice,
          deadline: getTimestamp() + QUOTATION_RENEWAL_INTERVAL_SECONDS,
          signature: '0x',
        };

        setLongQuotation(buyQuotation);
      }

      // Info: if there's error fetching quotation, use the previous quotation or calculate the quotation (20230327 - Shirley)
      if (
        shortQuotation.success &&
        short &&
        short.typeOfPosition === TypeOfPosition.SELL &&
        shortQuotation.data !== null
      ) {
        setShortQuotation(short);
      } else {
        const sellPrice =
          (marketCtx.selectedTickerRef.current?.price ?? BUY_PRICE_ERROR) *
          (1 + (marketCtx.tickerLiveStatistics?.spread ?? 0));

        const sellQuotation: IQuotation = {
          ticker: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
          targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
          typeOfPosition: TypeOfPosition.SELL,
          unitAsset: unitAsset,
          price: sellPrice,
          deadline: getTimestamp() + QUOTATION_RENEWAL_INTERVAL_SECONDS,
          signature: '0x',
        };

        setShortQuotation(sellQuotation);
      }
    } catch (err) {
      const buyPrice =
        (marketCtx.selectedTickerRef.current?.price ?? BUY_PRICE_ERROR) *
        (1 + (marketCtx.tickerLiveStatistics?.spread ?? 0));

      const buyQuotation: IQuotation = {
        ticker: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
        targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
        typeOfPosition: TypeOfPosition.BUY,
        unitAsset: unitAsset,
        price: buyPrice,
        deadline: getTimestamp() + QUOTATION_RENEWAL_INTERVAL_SECONDS,
        signature: '0x',
      };

      setLongQuotation(buyQuotation);

      const sellPrice =
        (marketCtx.selectedTickerRef.current?.price ?? SELL_PRICE_ERROR) *
        (1 - (marketCtx.tickerLiveStatistics?.spread ?? 0));

      const sellQuotation: IQuotation = {
        ticker: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
        targetAsset: marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER,
        typeOfPosition: TypeOfPosition.SELL,
        unitAsset: unitAsset,
        price: sellPrice,
        deadline: getTimestamp() + QUOTATION_RENEWAL_INTERVAL_SECONDS,
        signature: '0x',
      };

      setShortQuotation(sellQuotation);
    }

    return {
      longQuotation: longQuotation.data as IQuotation,
      shortQuotation: shortQuotation.data as IQuotation,
    };
  };

  const setQuotation = async () => {
    await getQuotation(marketCtx.selectedTicker?.currency ?? DEFAULT_TICKER);
  };

  useEffect(() => {
    return () => {
      setQuotation();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!longQuotationRef.current || !shortQuotationRef.current) return;

      const base = longQuotationRef.current.deadline - WAITING_TIME_FOR_USER_SIGNING;
      const tickingSec = (base * 1000 - getTimestampInMilliseconds()) / 1000;
      setSecondsLeft(tickingSec > 0 ? Math.round(tickingSec) : 0);

      if (secondsLeftRef.current === 0) {
        setQuotation();
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const cfds = openCFDs
    .map(cfd => {
      const positionLineGraph = marketCtx.listTickerPositions(cfd.targetAsset, {
        begin: cfd.createTimestamp,
      });
      const quotation =
        cfd.typeOfPosition === TypeOfPosition.BUY
          ? longQuotationRef.current
          : shortQuotationRef.current;

      const displayCFD: IDisplayCFDOrder = toDisplayCFDOrder(cfd, positionLineGraph, quotation);

      return displayCFD;
    })
    .sort((a, b) => {
      return a.createTimestamp - b.createTimestamp;
    })
    .sort((a, b) => {
      return b.stateCode - a.stateCode;
    });

  // Deprecated: to be removed (20230413 - Shirley)
  // /* ToDo: (20230411 - Julian) dummy data */
  // const dummyCFDs: IDisplayCFDOrder[] = listDummyDisplayCFDOrder('ETH')
  //   .slice(-2)
  //   .sort((a, b) => {
  //     return a.createTimestamp - b.createTimestamp;
  //   })
  //   .sort((a, b) => {
  //     return b.stateCode - a.stateCode;
  //   });

  const openPositionList = cfds.map(cfd => {
    return (
      <div key={cfd.id}>
        <OpenPositionItem openCfdDetails={cfd} />
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    );
  });

  return (
    <>
      <div className="h-full overflow-y-auto overflow-x-hidden pb-40">
        <div className="">
          <Suspense
            fallback={
              <div className="inline-flex items-end">
                {/* ToDo: (20230419 - Julian) Loading animation */}
                <Lottie className="w-40px" animationData={smallConnectingAnimation} />
                Loading...
              </div>
            }
          >
            {openPositionList}
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default OpenSubTab;
