// db.js
// Lightweight IndexedDB wrapper. This is our offline "file system" —
// it plays the role that Electron + Node fs would play in a desktop build,
// but works in any modern mobile or desktop browser, online or offline.

const DB_NAME = 'ancient-book-writer';
const DB_VERSION = 1;

const STORES = {
  BOOKS_INDEX: 'books_index', // lightweight metadata only (mirrors index.json)
  BOOKS_FULL: 'books_full',   // full book.json equivalent, keyed by book id
  SETTINGS: 'settings',
};

let dbPromise = null;

export function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORES.BOOKS_INDEX)) {
        const idx = db.createObjectStore(STORES.BOOKS_INDEX, { keyPath: 'id' });
        idx.createIndex('updated_at', 'updated_at', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.BOOKS_FULL)) {
        db.createObjectStore(STORES.BOOKS_FULL, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(db, storeName, mode = 'readonly') {
  const t = db.transaction(storeName, mode);
  return t.objectStore(storeName);
}

function promisify(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const idb = {
  async getAll(storeName) {
    const db = await openDB();
    return promisify(tx(db, storeName).getAll());
  },
  async get(storeName, key) {
    const db = await openDB();
    return promisify(tx(db, storeName).get(key));
  },
  async put(storeName, value) {
    const db = await openDB();
    return promisify(tx(db, storeName, 'readwrite').put(value));
  },
  async delete(storeName, key) {
    const db = await openDB();
    return promisify(tx(db, storeName, 'readwrite').delete(key));
  },
  async clear(storeName) {
    const db = await openDB();
    return promisify(tx(db, storeName, 'readwrite').clear());
  },
};

export { STORES };
