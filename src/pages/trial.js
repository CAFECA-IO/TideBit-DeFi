import LineGraph from '../components/line_graph/line_graph';
import dynamic from 'next/dynamic';
import WalletConnectCom from '../components/wallet/wallet_connect_com';
import Head from 'next/head';

// const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});
// const Chart = dynamic(() => import('apexcharts'), {ssr: false});

export default function Trial() {
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
        <title>Lumii title</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-center text-center text-3xl">
        <div>
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
          <WalletConnectCom />
        </div>
      </div>
    </>
  );
}
