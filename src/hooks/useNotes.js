// hooks/useNotes.js
import { useCallback, useMemo, useState } from 'react'
import useLocalStorage from './useLocalStorage'

function useNotes() {
  const [notes, setNotes] = useLocalStorage('myapp-notes', [])
  const [recentlyDeleted, setRecentlyDeleted] = useLocalStorage('myapp-deleted', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useLocalStorage('myapp-sort', 'updatedAt')
  const [filterTag, setFilterTag] = useState(null)

  // Available tags
  const availableTags = [
    { id: 'personal', name: 'Personal', color: 'bg-blue-500' },
    { id: 'work', name: 'Work', color: 'bg-green-500' },
    { id: 'ideas', name: 'Ideas', color: 'bg-purple-500' },
    { id: 'todo', name: 'To-Do', color: 'bg-amber-500' },
    { id: 'important', name: 'Important', color: 'bg-red-500' },
  ]

  // Sort notes
  const sortNotes = useCallback((notesToSort) => {
    return [...notesToSort].sort((a, b) => {
      // Pinned notes always first
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'size':
          return b.content.length - a.content.length
        case 'updatedAt':
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt)
      }
    })
  }, [sortBy])

  // Filter notes based on search and tag
  const filteredNotes = useMemo(() => {
    let result = notes

    // Filter by tag
    if (filterTag) {
      result = result.filter(note => note.tags?.includes(filterTag))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return sortNotes(result)
  }, [notes, searchQuery, filterTag, sortNotes])

  // Add new note
  const addNote = (title, content, tags = []) => {
    const newNote = {
      id: Date.now(),
      title: title.trim() || 'Untitled',
      content,
      tags,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setNotes(prev => [newNote, ...prev])
    return newNote
  }

  // Update existing note
  const updateNote = (id, title, content, tags = []) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? {
            ...note,
            title: title.trim() || 'Untitled',
            content,
            tags,
            updatedAt: new Date().toISOString()
          }
        : note
    ))
  }

  // Toggle pin note
  const togglePin = (id) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() }
        : note
    ))
  }

  // Delete single note (with undo support)
  const deleteNote = (id) => {
    const noteToDelete = notes.find(note => note.id === id)
    if (noteToDelete) {
      setRecentlyDeleted(prev => [
        { ...noteToDelete, deletedAt: new Date().toISOString() },
        ...prev.slice(0, 9) // Keep only last 10 deleted
      ])
      setNotes(prev => prev.filter(note => note.id !== id))
    }
  }

  // Restore deleted note
  const restoreNote = (id) => {
    const noteToRestore = recentlyDeleted.find(note => note.id === id)
    if (noteToRestore) {
      const { ...note } = noteToRestore
      setNotes(prev => [note, ...prev])
      setRecentlyDeleted(prev => prev.filter(note => note.id !== id))
    }
  }

  // Clear recently deleted
  const clearRecentlyDeleted = () => {
    setRecentlyDeleted([])
  }

  // Permanently delete from trash
  const permanentlyDelete = (id) => {
    setRecentlyDeleted(prev => prev.filter(note => note.id !== id))
  }

  // Duplicate note
  const duplicateNote = (id) => {
    const noteToDuplicate = notes.find(note => note.id === id)
    if (noteToDuplicate) {
      const newNote = {
        ...noteToDuplicate,
        id: Date.now(),
        title: `${noteToDuplicate.title} (Copy)`,
        pinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setNotes(prev => [newNote, ...prev])
      return newNote
    }
  }

  // Delete all notes
  const deleteAllNotes = () => {
    // Move all to recently deleted
    const deletedNotes = notes.map(note => ({
      ...note,
      deletedAt: new Date().toISOString()
    }))
    setRecentlyDeleted(prev => [...deletedNotes, ...prev].slice(0, 50))
    setNotes([])
  }

  // Export all notes as JSON
  const exportNotes = () => {
    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      notes: notes
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Import notes from JSON
  const importNotes = (jsonData) => {
    try {
      const data = JSON.parse(jsonData)
      if (data.notes && Array.isArray(data.notes)) {
        const importedNotes = data.notes.map(note => ({
          ...note,
          id: Date.now() + Math.random(), // New unique ID
          importedAt: new Date().toISOString()
        }))
        setNotes(prev => [...importedNotes, ...prev])
        return { success: true, count: importedNotes.length }
      }
      return { success: false, error: 'Invalid format' }
    } catch (err) {
      console.log(err);
      return { success: false, error: 'Failed to parse JSON' }
    }
  }

  // Get stats
  const getStats = useMemo(() => {
    const totalWords = notes.reduce((acc, note) => {
      return acc + note.content.split(/\s+/).filter(word => word.length > 0).length
    }, 0)
    const totalCharacters = notes.reduce((acc, note) => acc + note.content.length, 0)
    const pinnedCount = notes.filter(note => note.pinned).length

    return {
      totalNotes: notes.length,
      totalWords,
      totalCharacters,
      pinnedCount,
      deletedCount: recentlyDeleted.length
    }
  }, [notes, recentlyDeleted])

  return {
    notes: filteredNotes,
    allNotesCount: notes.length,
    recentlyDeleted,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterTag,
    setFilterTag,
    availableTags,
    stats: getStats,
    addNote,
    updateNote,
    deleteNote,
    deleteAllNotes,
    togglePin,
    duplicateNote,
    restoreNote,
    permanentlyDelete,
    clearRecentlyDeleted,
    exportNotes,
    importNotes
  }
}

export default useNotes