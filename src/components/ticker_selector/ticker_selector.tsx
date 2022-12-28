import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import TideButton from '../tide_button/tide_button';
import Link from 'next/link';
import {useState} from 'react';

interface ITickerSelectorModal {
  tickerSelectorModalRef: React.RefObject<HTMLDivElement>;
  tickerSelectorModalVisible: boolean;
  tickerSelectorModalClickHandler: () => void;
}

const TickerSelectorModal = ({
  tickerSelectorModalRef,
  tickerSelectorModalVisible,
  tickerSelectorModalClickHandler,
}: ITickerSelectorModal) => {
  const [activeTab, setActiveTab] = useState('All');

  const tradeTabClickHandler = () => {
    setActiveTab('Trade');
  };

  const positionTabClickHandler = () => {
    setActiveTab('Position');
  };

  // const currentTab = activeTab === 'Trade' ? <TradeTab /> : <PositionTab />;

  const activeTradeTabStyle =
    activeTab == 'Trade' ? 'bg-darkGray7 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  const activePositionTabStyle =
    activeTab == 'Position' ? 'bg-darkGray7 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  const tabPart = (
    <>
      <div className="z-10 flex flex-wrap border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <div className="pr-1">
          <button
            type="button"
            className={`${activeTradeTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={tradeTabClickHandler}
          >
            All
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            Favorite
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            Top
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            Storage
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            DeFi
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            Grayscale
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            GameFi
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            Blockchain
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            Layer 2
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-2xl px-53px py-2 hover:cursor-pointer`}
            onClick={positionTabClickHandler}
          >
            Polkadot
          </button>
        </div>
      </div>
    </>
  );

  const isDisplayedTickerSelectorModal = tickerSelectorModalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div
          className="relative my-6 mx-auto w-auto max-w-xl"
          id="tickerSelectorModal"
          ref={tickerSelectorModalRef}
        >
          {/* tab section */}
          <div className="">{tabPart}</div>
          {/* ticker cards section */}
          {/*content & panel*/}
          <div className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={tickerSelectorModalClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="flex flex-auto flex-col items-center pt-32">
              <div className="text-lg leading-relaxed text-lightWhite">
                <div className="mx-auto flex flex-col items-center">
                  <Image
                    className="mt-10 w-100px"
                    src="/elements/path_25939.svg"
                    width={200}
                    height={200}
                    alt="Hello"
                  />
                  <div className="mt-8 mb-40 text-xl text-lightGray">
                    You can start using TideBit now.
                  </div>

                  <TideButton className="px-12" onClick={tickerSelectorModalClickHandler}>
                    Done
                  </TideButton>
                  <Link
                    className="mt-3 text-base text-tidebitTheme underline underline-offset-4"
                    href="#"
                  >
                    Connect my TideBit
                  </Link>
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <div>{isDisplayedTickerSelectorModal}</div>;
};

export default TickerSelectorModal;
