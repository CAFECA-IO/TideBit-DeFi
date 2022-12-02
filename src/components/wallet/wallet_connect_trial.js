import QRCodeModal from '@walletconnect/qrcode-modal';
import WalletConnect from '@walletconnect/client';
import {useState, useEffect} from 'react';
import TideButton from '../tide_button/tide_button';
import {SUPPORTED_NETWORKS} from '../../constants/config';
import {ethers} from 'ethers';
import Toast from '../toast/toast';

const WalletConnectCom = () => {
  const [connector, setConnector] = useState(null);
  const [fetching, setFetching] = useState(false);

  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [supported, setSupported] = useState(false);
  const [network, setNetwork] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [balance, setBalance] = useState(null);
  const [signature, setSignature] = useState('');

  useEffect(() => {
    // add logic with side effects
    if (connector) {
      connector.on('connect', async (error, payload) => {
        if (error) {
          // console.error(error);
          return;
        }

        const {chainId, accounts} = payload.params[0];
        await onConnect(chainId, accounts[0]);
        setFetching(false);
      });

      connector.on('disconnect', async (error, payload) => {
        if (error) {
          // console.error(error);
        }

        // handle disconnect event
        resetApp();
      });

      // check state variables here & if needed refresh the app
      // If any of these variables do not exist and the connector is connected, refresh the data
      if ((!chainId || !account || !balance) && connector.connected) {
        refreshData();
      }
    }

    async function refreshData() {
      const {chainId, accounts} = connector;
      await onConnect(chainId, accounts[0]);
      setFetching(false);
    }
  }, [connector, chainId, account, balance]);

  const connect = async () => {
    setFetching(true);

    // 1. Create connector
    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      qrcodeModal: QRCodeModal,
    });

    // 2. Update the connector state
    setConnector(connector);

    // 3. If not connected, create a new session
    if (!connector.connected) {
      await connector.createSession();
    }

    // 4. Sign typed data
    // signEIP712();
  };

  async function onConnect(chainId, connectedAccount) {
    // handle connect event
    setAccount(connectedAccount);
    setChainId(chainId);

    // get chain data
    const networkData = SUPPORTED_NETWORKS.filter(chain => chain.chain_id === chainId)[0];

    if (!networkData) {
      setSupported(false);
    } else {
      setSupported(true);
      setNetwork(networkData.name);
      setSymbol(networkData.native_currency.symbol);
      setChainId(chainId);

      // 1. Create an Ethers provider
      const provider = new ethers.providers.StaticJsonRpcProvider(networkData.rpc_url, {
        chainId,
        name: networkData.name,
      });

      // 2. Get the account balance
      const balance = await provider.getBalance(connectedAccount);
      // 3. Format the balance
      const formattedBalance = ethers.utils.formatEther(balance);
      // 4. Save the balance to state
      setBalance(formattedBalance);
    }
  }

  async function signEIP712() {
    const typedData = {
      types: {
        EIP712Domain: [
          {name: 'name', type: 'string'},
          {name: 'version', type: 'string'},
          {name: 'chainId', type: 'uint256'},
          {name: 'verifyingContract', type: 'address'},
        ],
        Person: [
          {name: 'name', type: 'string'},
          {name: 'account', type: 'address'},
        ],
        Mail: [
          {name: 'from', type: 'Person'},
          {name: 'to', type: 'Person'},
          {name: 'contents', type: 'string'},
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'TideBit DeFi',
        version: '1.0',
        chainId: 1,
        verifyingContract: '0x0000000000000000000000000000000000000000',
      },
      message: {
        from: {
          name: 'User',
          account: `${account}`,
        },
        to: {
          name: 'TideBit DeFi',
          account: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Agree to the terms and conditions',
      },
    };

    const msgParams = [
      account, // Required
      JSON.stringify(typedData), // Required
    ];

    try {
      const signature = await connector.signTypedData(msgParams);
      setSignature(signature);
      // console.log('sigature: ', signature);
    } catch (error) {
      // console.error('sign 712 ERROR', error);
    }

    // DOC: Sign Typed Data
    // connector
    //   .signTypedData(msgParams)
    //   .then(result => {
    //     // Returns signature.
    //     console.log(result);
    //   })
    //   .catch(error => {
    //     // Error returned when rejected
    //     console.error(error);
    //   });
  }

  const killSession = () => {
    // add logic to ensure the mobile wallet connection has been killed
    // Make sure the connector exists before trying to kill the session
    if (connector) {
      connector.killSession();
    }
    resetApp();
  };

  const sendTransaction = async () => {
    try {
      await connector.sendTransaction({from: account, to: account, value: '0x1BC16D674EC80000'});
    } catch (e) {
      // Handle the error as you see fit
      // console.error(e);
    }
  };

  const resetApp = () => {
    // reset state variables here
    setConnector(null);
    setFetching(false);
  };

  return (
    <>
      <div className="flex flex-col space-y-5">
        <p>Wallet connect v1 test page</p>
        {/* buttons and network details will go here */}
        {connector && !fetching ? (
          <div>
            <div>
              <strong>Connected Account: </strong>
              {account}
            </div>
            <div>
              <strong>Chain ID: </strong>
              {chainId}
            </div>
            {supported ? (
              <div>
                <div>
                  <strong>Network: </strong>
                  {network}
                </div>
              </div>
            ) : (
              <strong>
                Network not supported. Please disconnect, switch networks, and connect again.
              </strong>
            )}
            <TideButton
              onClick={killSession}
              className="bg-cuteBlue2 text-3xl hover:bg-cuteBlue2/80"
            >
              Disconnect
            </TideButton>
          </div>
        ) : (
          <TideButton onClick={connect} className="bg-cuteBlue2 text-3xl hover:bg-cuteBlue2/80">
            Connect Wallet
          </TideButton>
        )}
        {supported ? (
          <>
            <div>
              <div>Network: </div>
              {network}
            </div>
            <div>
              <div>Balance: </div>
              {balance} {symbol}
            </div>
            <div>
              <TideButton onClick={signEIP712} className="text-xl">
                Sign EIP712
              </TideButton>
            </div>
            <div>
              <TideButton onClick={sendTransaction}>send transaction</TideButton>
            </div>
            {signature && (
              <div className="flex">
                {' '}
                <div className="text-ellipsis break-all text-cuteBlue">{signature}</div>
              </div>
            )}
          </>
        ) : (
          <div>Network not supported. Please disconnect, switch networks, and connect again.</div>
        )}
      </div>
      <Toast content={signature} />
    </>
  );
};

export default WalletConnectCom;
