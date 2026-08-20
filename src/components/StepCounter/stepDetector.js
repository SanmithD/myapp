// src/components/StepCounter/stepDetector.js

const DEFAULT_OPTIONS = {
    threshold: 11.5,
    minStepInterval: 300,
    smoothingSamples: 5,
};

export class StepDetector {
    constructor(options = {}) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };

        this.lastStepTime = 0;
        this.previousMagnitude = 0;
        this.isRising = false;

        this.samples = [];

        this.handleMotion = this.handleMotion.bind(this);
    }

    start(onStep) {
        this.onStep = onStep;

        if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) {
            throw new Error("Device motion is not supported on this device.");
        }

        window.addEventListener("devicemotion", this.handleMotion);

        return () => {
            this.stop();
        };
    }

    stop() {
        if (typeof window !== "undefined") {
            window.removeEventListener("devicemotion", this.handleMotion);
        }

        this.onStep = null;
    }

    handleMotion(event) {
        const acceleration = event.accelerationIncludingGravity;

        if (!acceleration) {
            return;
        }

        const x = acceleration.x || 0;
        const y = acceleration.y || 0;
        const z = acceleration.z || 0;

        // Calculate total acceleration magnitude.
        const magnitude = Math.sqrt(
            x * x +
            y * y +
            z * z
        );

        // Smooth the sensor values.
        this.samples.push(magnitude);

        if (this.samples.length > this.options.smoothingSamples) {
            this.samples.shift();
        }

        const average =
            this.samples.reduce((sum, value) => sum + value, 0) /
            this.samples.length;

        const now = Date.now();

        /*
         * Detect a step by looking for:
         *
         * 1. Acceleration rising above threshold
         * 2. Acceleration falling back down
         * 3. Enough time has passed since the previous step
         */

        if (
            average > this.options.threshold &&
            this.previousMagnitude <= this.options.threshold
        ) {
            this.isRising = true;
        }

        if (
            this.isRising &&
            average < this.options.threshold &&
            now - this.lastStepTime >= this.options.minStepInterval
        ) {
            this.lastStepTime = now;
            this.isRising = false;

            if (this.onStep) {
                this.onStep();
            }
        }

        this.previousMagnitude = average;
    }

    reset() {
        this.lastStepTime = 0;
        this.previousMagnitude = 0;
        this.isRising = false;
        this.samples = [];
    }
}

export default StepDetector;