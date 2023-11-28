import React from 'react';
import useMarketStore from '../../stores/market_store';

const TestResult1 = () => {
  const test1 = useMarketStore(s => s.testResult);
  const test2 = useMarketStore(s => s.testResult);

  // eslint-disable-next-line no-console
  console.log('test1: ', test1);
  // eslint-disable-next-line no-console
  console.log('test2: ', test2);

  return (
    <div>
      {' '}
      <div className="">
        test1 is the same testResult from marketStore in TestResult1 component: {test1.count}
      </div>
      <div className="">
        test2 is the same testResult from marketStore in TestResult1 component: {test2.count}
      </div>
    </div>
  );
};

export default TestResult1;
