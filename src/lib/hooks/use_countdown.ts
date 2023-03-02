import {useEffect, useState} from 'react';

const useCountdown = (targetTimestamp: number) => {
  // const targetDate = new Date(targetTimestamp);
  // console.log('targetDate: ', targetDate)

  // const targetTimestamp = new Date('2023-02-24T17:00:00').getTime(); // will get the locale timestamp of 2023/02/24 17:00:00
  const targetTimestampMs = targetTimestamp * 1000;

  const [countdown, setCountdown] = useState<number>(targetTimestampMs - Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown(targetTimestampMs - Date.now());
      // console.log('useCountdown: ', targetTimestampMs, Date.now())
    }, 1000);

    return () => clearInterval(intervalId);

    // targetTimestamp
  }, [countdown]);

  return getReturnValues(countdown);
};

const getReturnValues = (countdown: number) => {
  // calculate time left
  const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000);
  const timestamp = countdown;

  return {days, hours, minutes, seconds, timestamp};
};

export {useCountdown};
