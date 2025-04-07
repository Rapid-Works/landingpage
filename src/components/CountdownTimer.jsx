import { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear timeout if the component is unmounted or targetDate changes
    return () => clearTimeout(timer);
  }, [timeLeft, targetDate]); // Rerun effect if timeLeft or targetDate changes

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && timeLeft[interval] !== 0 && Object.keys(timeLeft).length > 1) { // Don't push 0 unless it's the only value left
       // Skip rendering if value is undefined/null, but allow 0
       return;
    }

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center mx-1 sm:mx-2">
        <span className="text-2xl sm:text-3xl font-semibold text-teal-600">
          {String(timeLeft[interval]).padStart(2, '0')}
        </span>
        <span className="text-xs text-gray-500 uppercase">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex justify-center">
      {timerComponents.length ? timerComponents : <span className="text-xl font-semibold text-gray-700">Webinar time!</span>}
    </div>
  );
};

export default CountdownTimer; 