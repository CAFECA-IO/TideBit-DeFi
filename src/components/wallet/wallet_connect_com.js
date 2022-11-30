import QRCodeModal from '@walletconnect/qrcode-modal';
import WalletConnect from '@walletconnect/client';
import {useState, useEffect} from 'react';
import TideButton from '../tide_button/tide_button';
import {SUPPORTED_NETWORKS} from '../../constants/network';
import {ethers} from 'ethers';

const WalletConnectCom = () => {
  const [connector, setConnector] = useState(null);
  const [fetching, setFetching] = useState(false);

  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [supported, setSupported] = useState(false);
  const [network, setNetwork] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [balance, setBalance] = useState(null);

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

  const killSession = () => {
    // add logic to ensure the mobile wallet connection has been killed
    // Make sure the connector exists before trying to kill the session
    if (connector) {
      connector.killSession();
    }
    resetApp();
  };

  const sendTransaction = async () => {
    // add send transaction logic
  };

  const resetApp = () => {
    // reset state variables here
    setConnector(null);
    setFetching(false);
  };

  return (
    <div className="flex flex-col space-y-5">
      <p>Lumii</p>
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
          <TideButton onClick={killSession}>Disconnect</TideButton>
        </div>
      ) : (
        <TideButton onClick={connect}>Connect Wallet</TideButton>
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
        </>
      ) : (
        <div>Network not supported. Please disconnect, switch networks, and connect again.</div>
      )}
    </div>
  );
};

export default WalletConnectCom;
