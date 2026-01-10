// TimerCard.tsx
import { useEffect, useState, useRef } from 'react';
import './TimerCard.css';

export const TimerCard = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFlipping(true);

      const timeout = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
        prevValueRef.current = value;
      }, 150);

      return () => clearTimeout(timeout);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const formattedValue = displayValue.toString().padStart(2, '0');
  const digits = formattedValue.split('');

  return (
    <div className="flex flex-col items-center gap-3 -mx-4">
      <div className="flex gap-1 sm:gap-2">
        {digits.map((digit, index) => (
          <div
            key={index}
            className={`timer-digit ${isFlipping ? 'flipping' : ''}`}
          >
            <div className="digit-container">
              <div className="card-top">
                <span className="digit-text text-8xl">{digit}</span>
              </div>
              <div className="card-bottom">
                <span className="digit-text text-8xl">{digit}</span>
              </div>
              <div className="center-line" />
            </div>
          </div>
        ))}
      </div>
      <span className="text-[10px] text-neutral-500 tracking-[0.3em] font-medium">
        {label}
      </span>
    </div>
  );
};