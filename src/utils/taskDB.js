const DB_NAME = "TaskManagerDB";
const DB_VERSION = 1;
const STORE_NAME = "tasks";

let dbPromise = null;

const openDB = () => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        store.createIndex("status", "status", {
          unique: false,
        });

        store.createIndex("createdAt", "createdAt", {
          unique: false,
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
};

// Get all tasks
export const getAllTasks = async () => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Add new task
export const addTask = async (task) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const now = new Date().toISOString();

    const newTask = {
      task: task.trim(),
      createdAt: now,
      updatedAt: now,
      status: "pending",
    };

    const request = store.add(newTask);

    request.onsuccess = () => {
      resolve({
        ...newTask,
        id: request.result,
      });
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Update task
export const updateTask = async (task) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const updatedTask = {
      ...task,
      updatedAt: new Date().toISOString(),
    };

    const request = store.put(updatedTask);

    request.onsuccess = () => {
      resolve(updatedTask);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Update task status
export const updateTaskStatus = async (id, status) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const task = getRequest.result;

      if (!task) {
        reject(new Error("Task not found"));
        return;
      }

      task.status = status;
      task.updatedAt = new Date().toISOString();

      const updateRequest = store.put(task);

      updateRequest.onsuccess = () => {
        resolve(task);
      };

      updateRequest.onerror = () => {
        reject(updateRequest.error);
      };
    };

    getRequest.onerror = () => {
      reject(getRequest.error);
    };
  });
};

// Delete task
export const deleteTask = async (id) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(id);

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};