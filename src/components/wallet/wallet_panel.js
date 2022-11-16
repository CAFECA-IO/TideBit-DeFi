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
    {name: 'Metamask', img: '/metamask.png'},
    {name: 'iSunOne', img: '/iSunOne.png'},
    {name: 'imToken', img: '/im_token.svg'},
    {name: 'Coinbase', img: '/coinbase.png'},
    {name: 'Trust', img: '/trust_wallet.svg'},
    {name: 'Rainbow', img: '/rainbow4.png'},
    {name: 'Houbi', img: '/huobi.png'},
    {name: 'Coin98', img: '/coin98.png'},
    {name: 'TokenPocket', img: '/token_pocket.png'},
    {name: 'WalletConnect', img: '/wallet_connect.png'},
    {name: 'BitKeep', img: '/bitkeep.png'},
    {name: 'Others', img: '/others_wallet.png'},
  ];

  const walletOptionsList = walletOptions.map(({name, img}) => (
    <div key={name} className="col-span-1 flex items-center justify-center rounded bg-gray-800">
      <WalletOption name={name} img={img} iconSize={ICON_SIZE} />
    </div>
  ));

  return (
    <>
      <button
        onClick={clickHandler}
        className={`${props?.className} mt-4 rounded border-0 bg-cyan-400 py-2 px-5 text-base text-white hover:bg-cyan-600 focus:outline-none md:mt-0`}
      >
        {`Wallet Connect`}
      </button>
      {componentVisible ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-auto max-w-xl">
              {/*content & panel*/}
              <div
                id="connectModal"
                ref={ref}
                className="relative flex w-full flex-col rounded-lg border-0 bg-gray-900 shadow-lg outline-none focus:outline-none"
              >
                {/*header*/}
                <div className="flex items-start justify-between rounded-t pt-8">
                  <h3 className="ml-auto text-3xl font-semibold text-white">Wallet Connect</h3>
                  <button
                    className="text-md float-right ml-auto border-0 bg-transparent p-1 font-semibold leading-none text-gray-300 outline-none focus:outline-none"
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
                    <div className="grid grid-cols-3 gap-3">{walletOptionsList}</div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end rounded-b p-2"></div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
}
