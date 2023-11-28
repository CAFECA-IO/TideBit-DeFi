import React from 'react';
import useMarketStore from '../../stores/market_store';

const TestResult = () => {
  const testResult = useMarketStore(s => s.testResult);

  // eslint-disable-next-line no-console
  console.log('in TestResult, testResult: ', testResult);

  return (
    <div>
      TestResult
      <p>testResult in TestResult component from marketStore: {testResult?.count}</p>
    </div>
  );
};

export default TestResult;
