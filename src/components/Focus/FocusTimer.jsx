// FocusTimer.tsx
import { useFocusTimer } from "../../utils/useFocusTimer";
import { TimerCard } from "./TimerCard";
import { TimerControls } from "./TimerControls";
import { TimeInput } from "./TimeInput";

export const FocusTimer = () => {
  const {
    minutes,
    seconds,
    isRunning,
    start,
    stop,
    reset,
    speed,
    changeSpeed,
    setMinutes,
    setSeconds,
  } = useFocusTimer(25, 0);

  const presets = [
    { label: "5 min", minutes: 5, seconds: 0 },
    { label: "15 min", minutes: 15, seconds: 0 },
    { label: "25 min", minutes: 25, seconds: 0 },
    { label: "45 min", minutes: 45, seconds: 0 },
    { label: "60 min", minutes: 60, seconds: 0 },
  ];

  const handlePreset = (mins, secs) => {
    if (!isRunning) {
      setMinutes(mins);
      setSeconds(secs);
    }
  };

  return (
    <div className="w-full mt-10 min-h-screen bg-black flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          Focus Timer
        </h1>
        <p className="text-purple-300 text-sm">Stay focused, stay productive</p>
      </div>

      {/* Timer Display */}
      <div className="flex items-center mb-3 px-4">
        <TimerCard value={minutes} label="MINUTES" />

        {/* Separator Dots */}
        <div className="flex gap-4">
          <div
            className={`w-4 h-4 rounded-full bg-neutral-600 ${
              isRunning ? "animate-pulse bg-white" : ""
            }`}
          />
          <div
            className={`w-4 h-4 rounded-full bg-neutral-600 ${
              isRunning ? "animate-pulse bg-white" : ""
            }`}
          />
        </div>

        <TimerCard value={seconds} label="SECONDS" />
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePreset(preset.minutes, preset.seconds)}
            disabled={isRunning}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${
                isRunning
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600/30 text-purple-200 hover:bg-purple-600/50 hover:scale-105 border border-purple-500/30"
              }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Time Input */}
      <TimeInput
        minutes={minutes}
        seconds={seconds}
        setMinutes={setMinutes}
        setSeconds={setSeconds}
        disabled={isRunning}
      />

      {/* Controls */}
      <TimerControls
        start={start}
        stop={stop}
        reset={reset}
        speed={speed}
        changeSpeed={changeSpeed}
        isRunning={isRunning}
      />

      {/* Status Indicator */}
      <div className="mt-8 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isRunning ? "bg-green-400 animate-pulse" : "bg-gray-500"
          }`}
        />
        <span className="text-sm text-gray-400">
          {isRunning ? "Timer Running" : "Timer Paused"}
        </span>
      </div>
    </div>
  );
};
