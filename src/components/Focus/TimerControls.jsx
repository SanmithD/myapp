// TimerControls.tsx
import { useState, useRef, useEffect } from "react";

export const TimerControls = ({
  start,
  stop,
  reset,
  speed,
  changeSpeed,
  isRunning,
}) => {
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);
  const dropdownRef = useRef(null);

  const speeds = [
    { value: 0.25, label: "0.25x" },
    { value: 0.5, label: "0.5x" },
    { value: 0.75, label: "0.75x" },
    { value: 1, label: "1x" },
    { value: 1.5, label: "1.5x" },
    { value: 2, label: "2x" },
    { value: 5, label: "5x" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSpeedOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSpeedSelect = (value) => {
    changeSpeed(value);
    setIsSpeedOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-6">
      {/* Main Controls */}
      <div className="flex gap-3">
        {!isRunning ? (
          <button
            onClick={start}
            className="group flex items-center gap-2 px-8 py-3 bg-white text-black font-medium tracking-wider uppercase text-sm hover:bg-neutral-200 active:bg-neutral-300 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Start
          </button>
        ) : (
          <button
            onClick={stop}
            className="group flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-medium tracking-wider uppercase text-sm hover:bg-red-500 active:bg-red-700 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            </svg>
            Pause
          </button>
        )}

        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-transparent text-neutral-400 font-medium tracking-wider uppercase text-sm border border-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-500 transition-all duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset
        </button>

        {/* Speed Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSpeedOpen(!isSpeedOpen)}
            className="flex items-center gap-3 px-4 py-2 bg-neutral-900 border border-neutral-700 text-neutral-300 text-sm hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-200"
          >
            <span className="text-neutral-500">Speed:</span>
            <span className="font-medium text-white">{speed}x</span>
            <svg
              className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                isSpeedOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isSpeedOpen && (
            <div className="absolute h-[130px] overflow-y-scroll top-full left-0 right-0 mt-1 bg-neutral-900 border border-neutral-700 shadow-2xl z-50">
              {speeds.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleSpeedSelect(s.value)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-150 flex items-center justify-between
                  ${
                    speed === s.value
                      ? "bg-white text-black"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <span>{s.label}</span>
                  {speed === s.value && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
