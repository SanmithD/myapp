import { useMemo, useState } from 'react'
import useLocalStorage from './useLocalStorage'

function useRecordings() {
  const [recordings, setRecordings] = useLocalStorage('myapp-recordings', [])
  const [searchQuery, setSearchQuery] = useState('')

  // Filter recordings based on search
  const filteredRecordings = useMemo(() => {
    if (!searchQuery.trim()) return recordings
    const query = searchQuery.toLowerCase()
    return recordings.filter(recording => 
      recording.name.toLowerCase().includes(query)
    )
  }, [recordings, searchQuery])

  // Add new recording
  const addRecording = (name, audioBlob, duration) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newRecording = {
          id: Date.now(),
          name: name.trim() || `Recording ${recordings.length + 1}`,
          audioData: reader.result, // Base64 encoded audio
          duration,
          createdAt: new Date().toISOString(),
          size: audioBlob.size
        }
        setRecordings(prev => [newRecording, ...prev])
        resolve(newRecording)
      }
      reader.readAsDataURL(audioBlob)
    })
  }

  // Delete single recording
  const deleteRecording = (id) => {
    setRecordings(prev => prev.filter(recording => recording.id !== id))
  }

  // Delete all recordings
  const deleteAllRecordings = () => {
    setRecordings([])
  }

  // Rename recording
  const renameRecording = (id, newName) => {
    setRecordings(prev => prev.map(recording =>
      recording.id === id
        ? { ...recording, name: newName.trim() || recording.name }
        : recording
    ))
  }

  return {
    recordings: filteredRecordings,
    allRecordingsCount: recordings.length,
    searchQuery,
    setSearchQuery,
    addRecording,
    deleteRecording,
    deleteAllRecordings,
    renameRecording
  }
}

export default useRecordings