// src/components/StepCounter/StepCounter.jsx

import { useCallback, useEffect, useRef, useState } from "react";

import StepPermission from "./StepPermission";
import StepDashboard from "./StepDashboard";
import StepDetector from "./stepDetector";
import { cleanupOldSteps, getDailySteps, getDateKey, getLast7Days, saveDailySteps } from "../../utils/stepDatabase";

const DEFAULT_GOAL = 10000;

const STEP_LENGTH_KM = 0.00075;
const CALORIES_PER_STEP = 0.04;

function StepCounter() {
    const [steps, setSteps] = useState(0);

    const [history, setHistory] = useState([]);

    const [isTracking, setIsTracking] = useState(false);

    const [permissionGranted, setPermissionGranted] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const detectorRef = useRef(null);

    /**
     * Load today's steps and last 7 days.
     */
    useEffect(() => {
        async function loadStepData() {
            try {
                setIsLoading(true);

                // Remove old records first.
                await cleanupOldSteps();

                // Get today's steps.
                const today = await getDailySteps();

                if (today) {
                    setSteps(today.steps);
                } else {
                    setSteps(0);
                }

                // Get 7-day history.
                const last7Days = await getLast7Days();

                setHistory(last7Days);
            } catch (error) {
                console.error("Failed to load step data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadStepData();
    }, []);

    /**
     * Create step detector.
     */
    useEffect(() => {
        detectorRef.current = new StepDetector({
            threshold: 11.5,
            minStepInterval: 300,
            smoothingSamples: 5,
        });

        return () => {
            detectorRef.current?.stop();
        };
    }, []);

    /**
     * Save current steps to IndexedDB.
     */
    useEffect(() => {
        if (isLoading) {
            return;
        }

        async function saveSteps() {
            try {
                await saveDailySteps(steps);

                // Update the 7-day history.
                const updatedHistory = await getLast7Days();

                setHistory(updatedHistory);
            } catch (error) {
                console.error("Failed to save steps:", error);
            }
        }

        saveSteps();
    }, [steps, isLoading]);

    /**
     * Handle detected step.
     */
    const handleStep = useCallback(() => {
        setSteps((currentSteps) => currentSteps + 1);
    }, []);

    /**
     * Start tracking.
     */
    const startTracking = useCallback(() => {
        if (!detectorRef.current) {
            return;
        }

        try {
            detectorRef.current.start(handleStep);

            setIsTracking(true);
        } catch (error) {
            console.error("Unable to start step detector:", error);
        }
    }, [handleStep]);

    /**
     * Stop tracking.
     */
    const stopTracking = useCallback(() => {
        detectorRef.current?.stop();

        setIsTracking(false);
    }, []);

    /**
     * Reset today's steps.
     */
    const resetSteps = useCallback(async () => {
        const confirmed = window.confirm(
            "Are you sure you want to reset today's steps?",
        );

        if (!confirmed) {
            return;
        }

        setSteps(0);

        detectorRef.current?.reset();

        try {
            await saveDailySteps(0);

            const updatedHistory = await getLast7Days();

            setHistory(updatedHistory);
        } catch (error) {
            console.error("Failed to reset steps:", error);
        }
    }, []);

    /**
     * Handle date change.
     *
     * If the app stays open overnight, this checks
     * whether the current stored date is still today.
     */
    useEffect(() => {
        const checkDate = async () => {
            try {
                const today = getDateKey();

                const savedToday = await getDailySteps();

                if (!savedToday || savedToday.date !== today) {
                    setSteps(0);
                }

                await cleanupOldSteps();

                const updatedHistory = await getLast7Days();

                setHistory(updatedHistory);
            } catch (error) {
                console.error("Date check failed:", error);
            }
        };

        const interval = setInterval(checkDate, 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    /**
     * Stop sensor when component unmounts.
     */
    useEffect(() => {
        return () => {
            detectorRef.current?.stop();
        };
    }, []);

    /**
     * Permission screen.
     */
    if (!permissionGranted) {
        return (
            <StepPermission
                onPermissionGranted={() => {
                    setPermissionGranted(true);
                }}
            />
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                    <p className="text-sm text-gray-500">Loading step data...</p>
                </div>
            </div>
        );
    }

    /**
     * Calculate statistics.
     */
    const distance = steps * STEP_LENGTH_KM;

    const calories = steps * CALORIES_PER_STEP;

    return (
        <StepDashboard
            steps={steps}
            goal={DEFAULT_GOAL}
            distance={distance}
            calories={calories}
            history={history}
            isTracking={isTracking}
            onStart={startTracking}
            onStop={stopTracking}
            onReset={resetSteps}
        />
    );
}

export default StepCounter;
