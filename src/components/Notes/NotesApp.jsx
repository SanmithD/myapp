import { Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import useNotes from '../../hooks/useNotes'
import NoteEditor from './NoteEditor'
import NotesList from './NotesList'

function NotesApp() {
  const {
    notes,
    allNotesCount,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    deleteAllNotes
  } = useNotes()

  const [isEditing, setIsEditing] = useState(false)
  const [currentNote, setCurrentNote] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Create new note
  const handleNewNote = () => {
    setCurrentNote(null)
    setIsEditing(true)
  }

  // Edit existing note
  const handleEditNote = (note) => {
    setCurrentNote(note)
    setIsEditing(true)
  }

  // Save note (new or existing)
  const handleSaveNote = (title, content) => {
    if (!content.trim()) {
      toast.error('Note cannot be empty')
      return
    }

    if (currentNote) {
      updateNote(currentNote.id, title, content)
      toast.success('Note updated')
    } else {
      addNote(title, content)
      toast.success('Note saved')
    }
    setIsEditing(false)
    setCurrentNote(null)
  }

  // Delete single note
  const handleDeleteNote = (id) => {
    deleteNote(id)
    toast.success('Note deleted')
  }

  // Delete all notes
  const handleDeleteAll = () => {
    deleteAllNotes()
    setShowDeleteConfirm(false)
    toast.success('All notes deleted')
  }

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false)
    setCurrentNote(null)
  }

  if (isEditing) {
    return (
      <NoteEditor
        note={currentNote}
        onSave={handleSaveNote}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="min-h-screen p-4">
      {/* Search Bar */}
      <div className="mb-4 pt-6 my-3">
        <div className="relative">
          {/* <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" /> */}
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-20 pr-10 py-3 h-10 text-xl bg-dark-800 border border-dark-700 rounded text-white placeholder-dark-400 focus:outline-none focus:border-dark-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleNewNote}
          className="flex-1 flex items-center h-10 justify-center gap-2 py-3 bg-gray-500 text-white font-semibold rounded hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          New Note
        </button>
        {allNotesCount > 0 && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Notes Count */}
      <div className="mb-4 text-sm text-dark-400">
        {searchQuery ? (
          <span>{notes.length} of {allNotesCount} notes</span>
        ) : (
          <span>{allNotesCount} note{allNotesCount !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Notes List */}
      <NotesList
        notes={notes}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
      />

      {/* Delete All Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-dark-800 rounded p-6 w-full max-w-sm border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-2">Delete All Notes?</h3>
            <p className="text-dark-400 mb-6">
              This will permanently delete all {allNotesCount} notes. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-dark-700 text-white rounded hover:bg-dark-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="flex-1 py-3 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotesApp