import LineGraph from '../components/line_graph/line_graph';
import dynamic from 'next/dynamic';
import WalletConnectCom from '../components/wallet/wallet_connect_trial';
import Head from 'next/head';
import SignatureProcessModal from '../components/wallet/signature_process_modal';
import {useEffect, useState} from 'react';

// const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});
// const Chart = dynamic(() => import('apexcharts'), {ssr: false});

export default function Trial() {
  const [processModalVisible, setProcessModalVisible] = useState(false);

  function randomeNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function randomArray(min, max, length) {
    let arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(randomeNumber(min, max));
    }
    return arr;
  }

  // console.log(randomArray(22, 60, 10));

  return (
    <>
      <Head>
        <title>Test for TideBit DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="">
        <div>
          <p>Hello</p>
          {/* <LineGraph
          sampleArray={randomArray(22, 222, 10)}
          strokeColor="#627eea"
          lineGraphWidth="120"
        />
        <LineGraph
          sampleArray={randomArray(22, 222, 10)}
          strokeColor="#627eea"
          lineGraphWidth="120"
        />
        <LineGraph
          sampleArray={randomArray(22, 222, 10)}
          strokeColor="#627eea"
          lineGraphWidth="120"
        /> */}
          {/* <WalletConnectCom /> */}
          <SignatureProcessModal
            firstStepSuccess={true}
            secondStepSuccess={true}
            processModalRef={null}
            processModalVisible={true}
          />
        </div>
      </div>
    </>
  );
}
