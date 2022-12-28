import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import TideButton from '../tide_button/tide_button';
import Link from 'next/link';
import {useState} from 'react';
import CryptoCard from '../card/crypto_card';

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
  const [ethStarred, setEthStarred] = useState(false);

  const getEthStarred = (bool: boolean) => {
    setEthStarred(bool);
    // console.log('eth starred: ', bool);
  };

  const allTabClickHandler = () => {
    setActiveTab('All');
  };

  const positionTabClickHandler = () => {
    setActiveTab('Position');
  };

  // const currentTab = activeTab === 'Trade' ? <TradeTab /> : <PositionTab />;

  const activeAllTabStyle =
    activeTab == 'All' ? 'bg-darkGray7 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  const activePositionTabStyle =
    activeTab == 'Position' ? 'bg-darkGray7 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  const tabPart = (
    <>
      <div className="z-10 flex w-1200px flex-wrap border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <div className="pr-1">
          <button
            type="button"
            className={`${activeAllTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
            onClick={allTabClickHandler}
          >
            All
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Favorite
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Top
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Storage
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            DeFi
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Grayscale
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            GameFi
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Blockchain
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
          >
            Layer 2
          </button>
        </div>
        <div className="">
          <button
            type="button"
            className={`${activePositionTabStyle} inline-block rounded-t-lg px-38px py-2 hover:cursor-pointer`}
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
          <div className="flex h-640px w-1200px flex-col rounded rounded-t-none border-0 bg-darkGray shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                {/* <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={tickerSelectorModalClickHandler} />
                </span> */}
              </button>
            </div>
            {/*body*/}
            <div className="flex flex-auto flex-col items-center pt-32">
              <div className="text-lg leading-relaxed text-lightWhite">
                <div className="mx-auto flex flex-col items-center">
                  <div className="flex w-full items-center justify-center">
                    <div className="mb-5 grid grid-cols-2 space-y-4 space-x-4 lg:grid-cols-5">
                      <CryptoCard
                        star={true}
                        starColor="text-bluePurple"
                        starred={true}
                        getStarredState={getEthStarred}
                        className="mt-4 ml-4"
                        chain="Ethereum"
                        currency="ETH"
                        price={1288.4}
                        fluctuating={1.14}
                        gradientColor="border-bluePurple/50 bg-black from-bluePurple/50 to-black"
                        tokenComponent={
                          <img src="/elements/group_2371.svg" alt="eth" width={40} height={40} />
                        }
                      />
                      <CryptoCard
                        star={true}
                        starColor="text-lightOrange"
                        starred={true}
                        chain="Bitcoin"
                        currency="BTC"
                        price={19848.8}
                        gradientColor="border-lightOrange/50 bg-black from-lightOrange/50 to-black"
                        fluctuating={3.46}
                        tokenComponent={
                          <img src="/elements/group_2372.svg" width={40} height={40} />
                        }
                      />
                      <CryptoCard
                        star={true}
                        starColor="text-lightGray2"
                        starred={true}
                        chain="Litecoin"
                        currency="LTC"
                        price={54.57}
                        fluctuating={-3.46}
                        gradientColor="border-lightGray2/50 bg-black from-lightGray2/50 to-black"
                        tokenComponent={
                          <img
                            src="/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg"
                            alt="litecoin"
                          />
                        }
                      />
                      <CryptoCard
                        star={true}
                        starColor="text-lightPurple"
                        starred={true}
                        chain="Polygon"
                        currency="MATIC"
                        price={0.82}
                        fluctuating={-6.23}
                        gradientColor="border-lightPurple/60 bg-black from-lightPurple/60 to-black"
                        tokenComponent={
                          <img src="/elements/9cc18b0cbe765b0a28791d253207f0c0.svg" alt="polygon" />
                        }
                      />
                      <CryptoCard
                        star={true}
                        starColor="text-lightYellow"
                        starred={true}
                        chain="BNB"
                        currency="BNB"
                        price={274.54}
                        fluctuating={-6.23}
                        gradientColor="border-lightYellow/60 bg-black from-lightYellow/50 to-black"
                        tokenComponent={<img src="/elements/group_2374.svg" alt="bnb" />}
                      />
                      <CryptoCard
                        star={true}
                        starColor="text-lightPurple2"
                        starred={true}
                        chain="Solana"
                        currency="SOL"
                        price={28.41}
                        fluctuating={1.14}
                        gradientColor="border-lightPurple2/60 from-lightPurple2/60 to-black"
                        tokenComponent={<img src="/elements/group_2378.svg" alt="solana" />}
                      />
                      <CryptoCard
                        star={true}
                        starColor="text-lightRed1"
                        starred={true}
                        chain="Shiba Inu"
                        currency="SHIB"
                        price={0.0000099}
                        fluctuating={-3.46}
                        gradientColor="border-lightRed1/50 from-lightRed1/50 to-black"
                        tokenComponent={<img src="/elements/group_2381.svg" alt="shiba inu" />}
                      />
                      <CryptoCard
                        star={true}
                        starColor="text-lightPink"
                        starred={true}
                        chain="Polkadot"
                        currency="DOT"
                        price={5.92}
                        fluctuating={3.46}
                        gradientColor="border-lightPink/60 from-lightPink/60 to-black"
                        tokenComponent={<img src="/elements/group_2385.svg" alt="polkadot" />}
                      />
                      <CryptoCard
                        star={true}
                        starColor="text-lightGreen1"
                        starred={true}
                        chain="Cardano"
                        currency="ADA"
                        price={0.3611}
                        fluctuating={1.14}
                        gradientColor="border-lightGreen1/60 from-lightGreen1/60 to-black"
                        tokenComponent={<img src="/elements/group_2388.svg" alt="cardano" />}
                      />
                      <CryptoCard
                        star={true}
                        starColor="text-lightRed2"
                        starred={true}
                        chain="Avalanche"
                        price={15.77}
                        currency="AVAX"
                        fluctuating={-6.23}
                        gradientColor="border-lightRed2/50 from-lightRed2/50 to-black"
                        tokenComponent={<img src="/elements/group_2391.svg" alt="avax" />}
                      />

                      {/* <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
         
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
         
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div> */}
                    </div>
                  </div>
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
