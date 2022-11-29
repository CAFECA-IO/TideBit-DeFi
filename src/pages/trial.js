import LineGraph from '../components/line_graph/line_graph';
import dynamic from 'next/dynamic';

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
    <div className="flex justify-center">
      <div>
        <LineGraph
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
        />
      </div>
    </div>
  );
}
