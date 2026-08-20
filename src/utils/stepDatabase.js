// src/components/StepCounter/stepDatabase.js

const DB_NAME = "StepCounterDB";
const DB_VERSION = 1;
const STORE_NAME = "dailySteps";
const MAX_DAYS = 7;

/**
 * Open IndexedDB database
 */
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "date",
                });

                store.createIndex("date", "date", {
                    unique: true,
                });
            }
        };
    });
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * Save/update one day's step count
 */
export async function saveDailySteps(steps, date = new Date()) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(STORE_NAME);

        const record = {
            date: getDateKey(date),
            steps: Number(steps),
            updatedAt: Date.now(),
        };

        const request = store.put(record);

        request.onsuccess = () => {
            resolve(record);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
}

/**
 * Get one day's steps
 */
export async function getDailySteps(date = new Date()) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readonly"
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.get(getDateKey(date));

        request.onsuccess = () => {
            resolve(request.result || null);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
}

/**
 * Get all saved step records
 */
export async function getAllSteps() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readonly"
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.getAll();

        request.onsuccess = () => {
            const records = request.result || [];

            records.sort((a, b) => {
                return b.date.localeCompare(a.date);
            });

            resolve(records);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
}

/**
 * Delete data older than the last 7 days
 */
export async function cleanupOldSteps() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.getAll();

        request.onsuccess = () => {
            const records = request.result || [];

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const oldestAllowedDate = new Date(today);

            oldestAllowedDate.setDate(
                oldestAllowedDate.getDate() - (MAX_DAYS - 1)
            );

            records.forEach((record) => {
                const recordDate = new Date(`${record.date}T00:00:00`);

                if (recordDate < oldestAllowedDate) {
                    store.delete(record.date);
                }
            });
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
            resolve();
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}

/**
 * Get the last 7 days.
 *
 * This also returns days where there was no activity,
 * with steps = 0.
 */
export async function getLast7Days() {
    const savedRecords = await getAllSteps();

    const recordMap = new Map(
        savedRecords.map((record) => [
            record.date,
            record.steps,
        ])
    );

    const result = [];

    for (let i = 0; i < MAX_DAYS; i++) {
        const date = new Date();

        date.setDate(date.getDate() - i);

        const dateKey = getDateKey(date);

        result.push({
            date: dateKey,
            steps: recordMap.get(dateKey) || 0,
        });
    }

    return result;
}