import {useState, useEffect} from 'react';

export const useCountdown = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;

  return {seconds, formattedTime};
};