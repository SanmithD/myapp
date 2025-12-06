import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    deleteAllRecordings as deleteAllFromDB,
    deleteRecording as deleteFromDB,
    getAllRecordings,
    saveRecording,
    updateRecording
} from '../utils/audioStorage'

function useRecordings() {
  const [recordings, setRecordings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Load recordings on mount
  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const data = await getAllRecordings()
        setRecordings(data)
      } catch (error) {
        console.error('Failed to load recordings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadRecordings()
  }, [])

  const filteredRecordings = useMemo(() => {
    if (!searchQuery.trim()) return recordings
    const query = searchQuery.toLowerCase()
    return recordings.filter(recording => 
      recording.name.toLowerCase().includes(query)
    )
  }, [recordings, searchQuery])

  const addRecording = useCallback(async (name, audioBlob, duration) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const newRecording = {
          id: Date.now(),
          name: name.trim() || `Recording ${recordings.length + 1}`,
          audioData: reader.result,
          duration,
          createdAt: new Date().toISOString(),
          size: audioBlob.size
        }
        
        try {
          await saveRecording(newRecording)
          setRecordings(prev => [newRecording, ...prev])
          resolve(newRecording)
        } catch (error) {
          console.error('Failed to save recording:', error)
          resolve(null)
        }
      }
      reader.readAsDataURL(audioBlob)
    })
  }, [recordings.length])

  const deleteRecording = useCallback(async (id) => {
    try {
      await deleteFromDB(id)
      setRecordings(prev => prev.filter(recording => recording.id !== id))
    } catch (error) {
      console.error('Failed to delete recording:', error)
    }
  }, [])

  const deleteAllRecordings = useCallback(async () => {
    try {
      await deleteAllFromDB()
      setRecordings([])
    } catch (error) {
      console.error('Failed to delete all recordings:', error)
    }
  }, [])

  const renameRecording = useCallback(async (id, newName) => {
    const recording = recordings.find(r => r.id === id)
    if (recording) {
      const updated = { ...recording, name: newName.trim() || recording.name }
      try {
        await updateRecording(updated)
        setRecordings(prev => prev.map(r => r.id === id ? updated : r))
      } catch (error) {
        console.error('Failed to rename recording:', error)
      }
    }
  }, [recordings])

  return {
    recordings: filteredRecordings,
    allRecordingsCount: recordings.length,
    searchQuery,
    setSearchQuery,
    addRecording,
    deleteRecording,
    deleteAllRecordings,
    renameRecording,
    isLoading
  }
}

export default useRecordings