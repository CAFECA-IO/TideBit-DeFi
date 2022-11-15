import {useEffect, useRef, useState} from 'react';
// import { createPortal } from 'react-dom';
import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import WalletOption from './wallet_option';
import useOuterClick from '/hooks/lib/useOuterClick';
import TideButton from '../shared/button/tide_button';

const ICON_SIZE = 50;

export default function WalletPanel() {
  const {ref, componentVisible, setComponentVisible} = useOuterClick(false);

  const clickHandler = () => {
    setComponentVisible(!componentVisible);
    console.log('componentVisible clicked: ', componentVisible);
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

  return (
    <>
      <TideButton content="Wallet Connect" isFocus={false} onClick={clickHandler} type="button" />
      {componentVisible ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-xl">
              {/*content & panel*/}
              <div
                id="connectModal"
                ref={ref}
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-900 outline-none focus:outline-none"
              >
                {/*header*/}
                <div className="flex items-start justify-between pt-8 rounded-t">
                  <h3 className="text-3xl ml-auto font-semibold text-white">Wallet Connect</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-gray-300 float-right text-md leading-none font-semibold outline-none focus:outline-none"
                    onClick={clickHandler}
                  >
                    <span className="h-6 w-6 -mx-8 -my-5 block outline-none focus:outline-none">
                      <ImCross />
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto mx-10">
                  <div className="my-4 text-white text-lg leading-relaxed">
                    <div className="grid grid-cols-3 gap-3">
                      {walletOptions.map(({name, img}) => (
                        <div
                          key={name}
                          className="col-span-1 flex justify-center items-center bg-gray-800 rounded"
                        >
                          <WalletOption name={name} img={img} iconSize={ICON_SIZE} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-2 rounded-b"></div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
