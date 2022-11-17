import {useEffect, useRef, useState} from 'react';
// import { createPortal } from 'react-dom';
import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import WalletOption from './wallet_option';
import useOuterClick from '/src/hooks/lib/useOuterClick';
import TideButton from '../shared/button/tide_button';

const ICON_SIZE = 50;

export default function WalletPanel(props) {
  const {ref, componentVisible, setComponentVisible} = useOuterClick(false);

  const clickHandler = () => {
    setComponentVisible(!componentVisible);
    // console.log('componentVisible clicked: ', componentVisible);
  };

  const walletOptions = [
    {name: 'Metamask', img: '/elements/74263ff26820cd0d895968e3b55e8902.svg'},
    {name: 'iSunOne', img: '/elements/iSunOne.svg'},
    {name: 'imToken', img: '/elements/Path 25918.svg'},
    {name: 'Coinbase', img: '/elements/18060234@2x.png'},
    {name: 'Trust', img: '/elements/TWT@2x.png'},
    {name: 'Rainbow', img: '/elements/unnamed@2x.png'},
    {name: 'Houbi', img: '/elements/logo@2x.png'},
    {name: 'Coin98', img: '/elements/coin98-c98-logo@2x.png'},
    {name: 'TokenPocket', img: '/elements/TokenPocket-wallet-logo@2x.png'},
    {name: 'WalletConnect', img: '/elements/walletconnect-logo-EE83B50C97-seeklogo.com@2x.png'},
    {name: 'BitKeep', img: '/elements/Path 25917.svg', size: '40'},
    {name: 'Others', img: '/elements/wallet@2x.png'},
  ];

  const walletOptionsList = walletOptions.map(wallet => (
    <div
      key={wallet.name}
      className="col-span-1 flex items-center justify-center rounded bg-darkGray2"
    >
      <WalletOption name={wallet.name} img={wallet.img} iconSize={ICON_SIZE} />
    </div>
  ));

  const isDisplayedWalletPanel = componentVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div
            id="connectModal"
            ref={ref}
            className="relative flex w-full flex-col rounded-lg border-0 bg-darkGray1 shadow-lg outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-8">
              <h3 className="ml-auto text-3xl font-semibold text-lightWhite">Wallet Connect</h3>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
                onClick={clickHandler}
              >
                <span className="-mx-8 -my-5 block h-6 w-6 outline-none focus:outline-none">
                  <ImCross />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative mx-10 flex-auto p-6">
              <div className="my-4 text-lg leading-relaxed text-white">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption
                      name={`Metamask`}
                      img={`/elements/74263ff26820cd0d895968e3b55e8902.svg`}
                      iconSize={50}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`iSunOne`} img={`/elements/iSunOne.svg`} iconSize={50} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`imToken`} img={`/elements/Path 25918.svg`} iconSize={50} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption
                      name={`Coinbase`}
                      img={`/elements/18060234@2x.png`}
                      iconSize={50}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`Trust`} img={`/elements/TWT@2x.png`} iconSize={50} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`Rainbow`} img={`/elements/unnamed@2x.png`} iconSize={50} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`Houbi`} img={`/elements/logo@2x.png`} iconSize={50} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption
                      name={`Coin98`}
                      img={`/elements/coin98-c98-logo@2x.png`}
                      iconSize={50}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption
                      name={`TokenPocket`}
                      img={`/elements/TokenPocket-wallet-logo@2x.png`}
                      iconSize={50}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption
                      name={`WalletConnect`}
                      img={`/elements/walletconnect-logo-EE83B50C97-seeklogo.com@2x.png`}
                      iconSize={50}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`BitKeep`} img={`/elements/Path 25917.svg`} iconSize={45} />
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    <WalletOption name={`Others`} img={`/elements/wallet@2x.png`} iconSize={50} />
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

  return (
    <>
      <button
        onClick={clickHandler}
        className={`${props?.className} mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white hover:bg-cyan-600 focus:outline-none md:mt-0`}
      >
        {`Wallet Connect`}
      </button>
      {isDisplayedWalletPanel}
    </>
  );
}
