import React, {useEffect} from 'react';
import useMarketStore from '../../stores/market_store';
import {useShallow} from 'zustand/react/shallow';

const TestResult = () => {
  const testResult = useMarketStore(useShallow(s => s.testResult));
  const setTestResult = useMarketStore(s => s.setTestResult);

  // eslint-disable-next-line no-console
  console.log('in TestResult, testResult: ', testResult);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomNum = Math.random();
      setTestResult(randomNum);

      // Info: 會拿到舊資料
      // eslint-disable-next-line no-console
      console.log('after setTestResult, testResult: ', testResult);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      TestResult
      <p>testResult in TestResult component from marketStore: {testResult?.count}</p>
    </div>
  );
};

export default TestResult;
