import {
    RotateCcw,
    Footprints,
    Flame,
    MapPin,
    Target,
} from "lucide-react";

function StepDashboard({
    steps = 0,
    goal = 10000,
    distance = 0,
    calories = 0,
    history = [],
    isTracking = false,
    onStart,
    onStop,
    onReset,
}) {
    const progress = Math.min((steps / goal) * 100, 100);

    return (
        <div className="mx-auto w-full max-w-4xl p-4 md:p-6">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Today's Activity
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Step Counter
                    </h1>
                </div>

                <div
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        isTracking
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                    }`}
                >
                    {isTracking ? "● Tracking" : "● Paused"}
                </div>
            </div>

            {/* Main Step Card */}
            <div className="mb-6 overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-blue-100">
                            Steps
                        </p>

                        <p className="mt-1 text-6xl font-bold tracking-tight">
                            {steps.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                        <Footprints size={34} />
                    </div>
                </div>

                {/* Goal */}
                <div className="mb-2 flex items-center justify-between text-sm">
                    <span>Daily Goal</span>

                    <span>
                        {steps.toLocaleString()} /{" "}
                        {goal.toLocaleString()}
                    </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/20">
                    <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>

                <p className="mt-3 text-sm text-blue-100">
                    {progress >= 100
                        ? "🎉 Goal completed!"
                        : `${Math.round(progress)}% of your daily goal`}
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* Distance */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <MapPin size={22} />
                    </div>

                    <p className="text-sm text-gray-500">
                        Distance
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {distance.toFixed(2)}

                        <span className="ml-1 text-sm font-medium text-gray-500">
                            km
                        </span>
                    </p>
                </div>

                {/* Calories */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                        <Flame size={22} />
                    </div>

                    <p className="text-sm text-gray-500">
                        Calories
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {Math.round(calories)}

                        <span className="ml-1 text-sm font-medium text-gray-500">
                            kcal
                        </span>
                    </p>
                </div>

                {/* Remaining */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                        <Target size={22} />
                    </div>

                    <p className="text-sm text-gray-500">
                        Remaining
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {Math.max(goal - steps, 0).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Last 7 Days */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                    <h2 className="text-lg font-bold text-gray-900">
                        Last 7 Days
                    </h2>

                    <p className="text-sm text-gray-500">
                        Your daily walking activity
                    </p>
                </div>

                <div className="space-y-4">
                    {history.map((day) => {
                        const date = new Date(
                            `${day.date}T00:00:00`,
                        );

                        const today =
                            new Date()
                                .toISOString()
                                .split("T")[0];

                        const isToday =
                            day.date === today;

                        const percentage = Math.min(
                            (day.steps / goal) * 100,
                            100,
                        );

                        return (
                            <div key={day.date}>
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-gray-800">
                                        {isToday
                                            ? "Today"
                                            : date.toLocaleDateString(
                                                  undefined,
                                                  {
                                                      weekday: "short",
                                                      month: "short",
                                                      day: "numeric",
                                                  },
                                              )}
                                    </p>

                                    <p className="text-sm font-bold text-gray-900">
                                        {day.steps.toLocaleString()}

                                        <span className="ml-1 font-normal text-gray-400">
                                            steps
                                        </span>
                                    </p>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                        style={{
                                            width: `${percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {!isTracking ? (
                    <button
                        type="button"
                        onClick={onStart}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Footprints size={20} />
                        Start Walking
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onStop}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
                    >
                        Stop Tracking
                    </button>
                )}

                <button
                    type="button"
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                    <RotateCcw size={18} />
                    Reset
                </button>
            </div>
        </div>
    );
}

export default StepDashboard;