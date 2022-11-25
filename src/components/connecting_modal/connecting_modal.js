import {useState, useEffect} from 'react';
import {ImCross} from 'react-icons/im';
import TideButton from '../tide_button/tide_button';
import {ethers, providers} from 'ethers';
import useOuterClick from '../../hooks/lib/use_outer_click';

import Lottie from 'lottie-react';
import connectingAnimation from '../../../public/animation/lf30_editor_qlduo5gq.json';

// TODO: Loading component
// TODO: Procedure component
// TODO: Signature success or not

/**
  connecting = false,
  connected = false,
  error = false,
  signing = false,
  signature = false,
  ...otherProps
 */

export default function ConnectingModal(props) {
  // console.log('connecting modal component triggered');

  // let showConnectingModalProps = false;

  const {ref, componentVisible, setComponentVisible} = useOuterClick(true);

  const [connecting, setConnecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [errorMessages, setErrorMessages] = useState('');
  const [signature, setSignature] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  async function connectFunc() {
    // console.log('asyn func called');
    try {
      setLoading(true);
      let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      // pop up the metamask window
      await provider.send('eth_requestAccounts', []);
      let signer = provider.getSigner();
      let address = await signer.getAddress();
      setDefaultAccount(address);

      // let balance = await provider.getBalance(address);
      // setUserBalance(ethers.utils.formatEther(balance));
      // console.log('connect to Metamask clicked, Account: ', address);
      // let signature = await signer.signMessage('Have a nice day!');
      // console.log('Sign the message, get the signature is: ', signature);

      // const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});

      // setDefaultAccount(accounts[0]);
      setLoading(false);
      // console.log('connectFun try');
    } catch (error) {
      // console.log(error);
      // setErrorMessages(error.message);
      setLoading(false);
    }
  }

  async function connect() {
    try {
      setLoading(true);
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      setDefaultAccount(accounts[0]);
      setLoading(false);
    } catch (error) {
      setErrorMessages(error.message);
      setLoading(false);
    }
  }

  function disconnect() {
    setDefaultAccount(null);
  }

  function loadingHandler() {}

  function clickModalHandler() {
    setComponentVisible(!componentVisible);
  }

  function DisplayedConnecting() {
    // console.log('in displayed connecting modal, componentVisible: ', componentVisible);
    return componentVisible ? (
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
              <div className="flex items-start justify-between rounded-t pt-6">
                <h3 className="mx-auto mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
                  Wallet Connect
                </h3>
                <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                  <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                    <ImCross onClick={clickModalHandler} />
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative mx-10 flex-auto px-4 pb-4 pt-1">
                <div className="my-4 text-lg leading-relaxed text-white">
                  <div className="flex-col justify-center text-center">
                    <Lottie animationData={connectingAnimation} />
                    <div className="text-lg">connecting...</div>

                    {/* <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2"></div> */}
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
  }

  return (
    <>
      {/* <div className="text-blue-500">I'm connecting modal</div> */}
      <DisplayedConnecting />
    </>
  );
}
