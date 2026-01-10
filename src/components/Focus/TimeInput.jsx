// TimeInput.tsx
export const TimeInput = ({
  minutes,
  seconds,
  setMinutes,
  setSeconds,
  disabled,
}) => {
  const handleMinutesChange = (e) => {
    const value = Math.min(99, Math.max(0, Number(e.target.value) || 0));
    setMinutes(value);
  };

  const handleSecondsChange = (e) => {
    const value = Math.min(59, Math.max(0, Number(e.target.value) || 0));
    setSeconds(value);
  };

  const adjustTime = (type, delta) => {
    if (disabled) return;
    if (type === 'minutes') {
      setMinutes(Math.min(99, Math.max(0, minutes + delta)));
    } else {
      setSeconds(Math.min(59, Math.max(0, seconds + delta)));
    }
  };

  return (
    <div className="flex items-center gap-6 mb-6 p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
      <span className="text-sm text-gray-400 font-medium">Set Time:</span>

      {/* Minutes Input */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => adjustTime('minutes', 1)}
          disabled={disabled}
          className="p-1 text-gray-400 hover:text-purple-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase minutes"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <div className="relative">
          <input
            type="number"
            min={0}
            max={99}
            value={minutes}
            onChange={handleMinutesChange}
            disabled={disabled}
            className="w-16 h-12 px-2 text-center text-white text-xl font-mono bg-gray-900/80 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 uppercase tracking-wider">
            min
          </span>
        </div>
        <button
          onClick={() => adjustTime('minutes', -1)}
          disabled={disabled}
          className="p-1 mt-4 text-gray-400 hover:text-purple-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease minutes"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <span className="text-2xl text-gray-500 font-bold mb-2">:</span>

      {/* Seconds Input */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => adjustTime('seconds', 5)}
          disabled={disabled}
          className="p-1 text-gray-400 hover:text-purple-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase seconds"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <div className="relative">
          <input
            type="number"
            min={0}
            max={59}
            value={seconds}
            onChange={handleSecondsChange}
            disabled={disabled}
            className="w-16 h-12 px-2 text-center text-white text-xl font-mono bg-gray-900/80 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 uppercase tracking-wider">
            sec
          </span>
        </div>
        <button
          onClick={() => adjustTime('seconds', -5)}
          disabled={disabled}
          className="p-1 mt-4 text-gray-400 hover:text-purple-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease seconds"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};