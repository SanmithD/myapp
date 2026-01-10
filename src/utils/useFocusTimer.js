// useFocusTimer.ts
import { useState, useRef, useEffect, useCallback } from 'react';

export const useFocusTimer = (initialMinutes = 0, initialSeconds = 0) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef(null);
  const initialRef = useRef({ minutes: initialMinutes, seconds: initialSeconds });

  // Use refs to track current values for the tick function
  const minutesRef = useRef(minutes);
  const secondsRef = useRef(seconds);

  // Keep refs in sync with state
  useEffect(() => {
    minutesRef.current = minutes;
  }, [minutes]);

  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const playBeep = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.error('Could not play audio:', e);
    }
  }, []);

  const tick = useCallback(() => {
    const currentSeconds = secondsRef.current;
    const currentMinutes = minutesRef.current;

    if (currentSeconds === 0) {
      if (currentMinutes === 0) {
        // Timer finished
        clearTimer();
        setIsRunning(false);
        playBeep();
        return;
      } else {
        // Decrement minutes, set seconds to 59
        setMinutes(currentMinutes - 1);
        setSeconds(59);
      }
    } else {
      // Just decrement seconds
      setSeconds(currentSeconds - 1);
    }
  }, [clearTimer, playBeep]);

  const start = useCallback(() => {
    const currentMinutes = minutesRef.current;
    const currentSeconds = secondsRef.current;

    if (!isRunning && (currentMinutes > 0 || currentSeconds > 0)) {
      setIsRunning(true);
      intervalRef.current = setInterval(tick, 1000 / speed);
    }
  }, [isRunning, tick, speed]);

  const stop = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    stop();
    setMinutes(initialRef.current.minutes);
    setSeconds(initialRef.current.seconds);
  }, [stop]);

  const changeSpeed = useCallback(
    (newSpeed) => {
      setSpeed(newSpeed);
      if (isRunning) {
        clearTimer();
        intervalRef.current = setInterval(tick, 1000 / newSpeed);
      }
    },
    [isRunning, clearTimer, tick]
  );

  const handleSetMinutes = useCallback(
    (value) => {
      if (!isRunning) {
        const newValue = Math.min(99, Math.max(0, value));
        setMinutes(newValue);
        initialRef.current.minutes = newValue;
      }
    },
    [isRunning]
  );

  const handleSetSeconds = useCallback(
    (value) => {
      if (!isRunning) {
        const newValue = Math.min(59, Math.max(0, value));
        setSeconds(newValue);
        initialRef.current.seconds = newValue;
      }
    },
    [isRunning]
  );

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    minutes,
    seconds,
    isRunning,
    start,
    stop,
    reset,
    speed,
    changeSpeed,
    setMinutes: handleSetMinutes,
    setSeconds: handleSetSeconds,
  };
};