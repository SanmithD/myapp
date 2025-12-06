const DB_NAME = 'VoiceDB'
const DB_VERSION = 1
const STORE_NAME = 'recordings'

// Open database
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

// Save recording
export const saveRecording = async (recording) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(recording)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(recording)
  })
}

// Get all recordings
export const getAllRecordings = async () => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      // Sort by createdAt descending
      const recordings = request.result.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
      resolve(recordings)
    }
  })
}

// Delete recording
export const deleteRecording = async (id) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

// Delete all recordings
export const deleteAllRecordings = async () => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

// Update recording
export const updateRecording = async (recording) => {
  return saveRecording(recording)
}