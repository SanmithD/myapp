// src/components/StepCounter/StepPermission.jsx

import { useState } from "react";

function StepPermission({ onPermissionGranted }) {
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const requestPermission = async () => {
        try {
            setStatus("requesting");
            setError("");

            /*
             * iOS Safari requires permission to be requested
             * from a user interaction such as a button click.
             */
            if (
                typeof DeviceMotionEvent !== "undefined" &&
                typeof DeviceMotionEvent.requestPermission === "function"
            ) {
                const permission = await DeviceMotionEvent.requestPermission();

                if (permission !== "granted") {
                    setStatus("denied");
                    setError(
                        "Motion permission was denied. Please allow motion access in your browser settings."
                    );
                    return;
                }
            }

            if (!("DeviceMotionEvent" in window)) {
                setStatus("unsupported");
                setError(
                    "Your device or browser does not support motion sensors."
                );
                return;
            }

            setStatus("granted");

            if (onPermissionGranted) {
                onPermissionGranted();
            }
        } catch (err) {
            console.error("Motion permission error:", err);

            setStatus("error");
            setError(
                "Unable to access motion sensors. Please try again."
            );
        }
    };

    if (status === "granted") {
        return null;
    }

    return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
            <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                    👟
                </div>

                <h2 className="mb-3 text-2xl font-bold text-gray-900">
                    Enable Step Counter
                </h2>

                <p className="mb-6 text-gray-600">
                    Your device's motion sensor is needed to detect your walking
                    activity.
                </p>

                {error && (
                    <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {status === "unsupported" ? (
                    <div className="rounded-xl bg-gray-100 p-4 text-sm text-gray-600">
                        Motion sensors are not supported by this browser/device.
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={requestPermission}
                        disabled={status === "requesting"}
                        className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {status === "requesting"
                            ? "Requesting Permission..."
                            : "Enable Step Counter"}
                    </button>
                )}

                <p className="mt-5 text-xs text-gray-400">
                    Keep your phone with you while walking for better accuracy.
                </p>
            </div>
        </div>
    );
}

export default StepPermission;