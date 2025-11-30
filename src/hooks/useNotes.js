import { useMemo, useState } from 'react'
import useLocalStorage from './useLocalStorage'

function useNotes() {
  const [notes, setNotes] = useLocalStorage('myapp-notes', [])
  const [searchQuery, setSearchQuery] = useState('')

  // Filter notes based on search
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes
    const query = searchQuery.toLowerCase()
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    )
  }, [notes, searchQuery])

  // Add new note
  const addNote = (title, content) => {
    const newNote = {
      id: Date.now(),
      title: title.trim() || 'Untitled',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setNotes(prev => [newNote, ...prev])
    return newNote
  }

  // Update existing note
  const updateNote = (id, title, content) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, title: title.trim() || 'Untitled', content, updatedAt: new Date().toISOString() }
        : note
    ))
  }

  // Delete single note
  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  // Delete all notes
  const deleteAllNotes = () => {
    setNotes([])
  }

  return {
    notes: filteredNotes,
    allNotesCount: notes.length,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    deleteAllNotes
  }
}

export default useNotes