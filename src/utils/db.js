const DB_NAME = 'password-manager'
const STORE = 'vault'
const VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/* ✅ SAVE VAULT */
export async function saveVault(encryptedVault) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)

    const req = store.put(encryptedVault, 'vault')

    req.onsuccess = () => resolve(true)
    req.onerror = () => reject(req.error)
  })
}

/* ✅ LOAD VAULT */
export async function loadVault() {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)

    const req = store.get('vault')

    req.onsuccess = () => resolve(req.result || null)
    req.onerror = () => reject(req.error)
  })
}

/* 🔒 OPTIONAL: CLEAR VAULT (logout / reset) */
export async function clearVault() {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)

    const req = store.delete('vault')

    req.onsuccess = () => resolve(true)
    req.onerror = () => reject(req.error)
  })
}
