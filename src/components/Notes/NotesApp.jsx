// components/Notes/NotesApp.jsx
import {
  ArrowDownAZ,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Moon,
  Plus,
  Sun,
  Trash2,
  Upload,
  X
} from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import useNotes from '../../hooks/useNotes'
import useTheme from '../../hooks/useTheme'
import NoteEditor from './NoteEditor'
import NotesList from './NotesList'
import StatsModal from './StatsModal'
import TrashModal from './TrashModal'

function NotesApp() {
  const {
    notes,
    allNotesCount,
    recentlyDeleted,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterTag,
    setFilterTag,
    availableTags,
    stats,
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
  } = useNotes()

  const { theme, toggleTheme } = useTheme()

  const [isEditing, setIsEditing] = useState(false)
  const [currentNote, setCurrentNote] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const [showStats, setShowStats] = useState(false)

  const fileInputRef = useRef(null)

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
  const handleSaveNote = (title, content, tags, pinned) => {
    if (!content.trim()) {
      toast.error('Note cannot be empty')
      return
    }

    if (currentNote) {
      updateNote(currentNote.id, title, content, tags)
      if (pinned !== currentNote.pinned) {
        togglePin(currentNote.id)
      }
      toast.success('Note updated')
    } else {
      const newNote = addNote(title, content, tags)
      if (pinned) {
        togglePin(newNote.id)
      }
      toast.success('Note saved')
    }
    setIsEditing(false)
    setCurrentNote(null)
  }

  // Delete single note
  const handleDeleteNote = (id) => {
    deleteNote(id)
    toast.success('Note moved to trash')
  }

  // Delete all notes
  const handleDeleteAll = () => {
    deleteAllNotes()
    setShowDeleteConfirm(false)
    toast.success('All notes moved to trash')
  }

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false)
    setCurrentNote(null)
  }

  // Handle restore
  const handleRestore = (id) => {
    restoreNote(id)
    toast.success('Note restored')
  }

  // Handle import
  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = importNotes(event.target.result)
      if (result.success) {
        toast.success(`Imported ${result.count} notes`)
      } else {
        toast.error(result.error)
      }
    }
    reader.readAsText(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle export
  const handleExport = () => {
    exportNotes()
    toast.success('Notes exported')
  }

  const sortOptions = [
    { value: 'updatedAt', label: 'Last Modified', icon: Calendar },
    { value: 'createdAt', label: 'Created Date', icon: Calendar },
    { value: 'title', label: 'Title', icon: ArrowDownAZ },
    { value: 'size', label: 'Size', icon: BarChart3 },
  ]

  if (isEditing) {
    return (
      <NoteEditor
        note={currentNote}
        onSave={handleSaveNote}
        onCancel={handleCancel}
        availableTags={availableTags}
      />
    )
  }

  return (
    <div className="min-h-screen p-4 mt-6 bg-dark-900 dark:bg-dark-900">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-4 pt-4">
        <h1 className="text-xl font-bold text-white">Notes</h1>
        <div className="flex items-center gap-2">
          {/* Stats Button */}
          <button
            onClick={() => setShowStats(true)}
            className="p-2 rounded-lg bg-dark-800 text-dark-400 hover:text-white transition-colors"
            title="Statistics"
          >
            <BarChart3 size={20} />
          </button>

          {/* Trash Button */}
          <button
            onClick={() => setShowTrash(true)}
            className="p-2 rounded-lg bg-dark-800 text-dark-400 hover:text-white transition-colors relative"
            title="Trash"
          >
            <Trash2 size={20} />
            {recentlyDeleted.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {recentlyDeleted.length}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-dark-800 text-dark-400 hover:text-white transition-colors"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 pr-10 py-3 h-10 text-base bg-dark-800 border border-dark-700 rounded text-white placeholder-dark-400 focus:outline-none focus:border-dark-500 transition-colors"
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

      {/* Filter and Sort Row */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {/* Sort Button */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded bg-dark-800 text-dark-300 hover:text-white transition-colors text-sm whitespace-nowrap"
          >
            <ArrowDownAZ size={16} />
            Sort
          </button>

          {showSortMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSortMenu(false)}
              />
              <div className="absolute top-full left-0 mt-2 z-20 bg-dark-700 border border-dark-600 rounded-lg shadow-lg min-w-[160px]">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value)
                      setShowSortMenu(false)
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                      sortBy === option.value
                        ? 'bg-dark-600 text-white'
                        : 'text-dark-300 hover:bg-dark-600'
                    }`}
                  >
                    <option.icon size={14} />
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors text-sm whitespace-nowrap ${
              filterTag
                ? 'bg-amber-600 text-white'
                : 'bg-dark-800 text-dark-300 hover:text-white'
            }`}
          >
            <Filter size={16} />
            {filterTag ? availableTags.find(t => t.id === filterTag)?.name : 'Filter'}
          </button>

          {showFilterMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowFilterMenu(false)}
              />
              <div className="absolute top-full left-0 mt-2 z-20 bg-dark-700 border border-dark-600 rounded-lg shadow-lg min-w-[160px]">
                <button
                  onClick={() => {
                    setFilterTag(null)
                    setShowFilterMenu(false)
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    !filterTag ? 'bg-dark-600 text-white' : 'text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  All Notes
                </button>
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      setFilterTag(tag.id)
                      setShowFilterMenu(false)
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                      filterTag === tag.id ? 'bg-dark-600 text-white' : 'text-dark-300 hover:bg-dark-600'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${tag.color}`} />
                    {tag.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Import Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 rounded bg-dark-800 text-dark-300 hover:text-white transition-colors text-sm whitespace-nowrap"
        >
          <Upload size={16} />
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        {/* Export Button */}
        {allNotesCount > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 rounded bg-dark-800 text-dark-300 hover:text-white transition-colors text-sm whitespace-nowrap"
          >
            <Download size={16} />
            Export
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleNewNote}
          className="flex-1 flex items-center h-12 justify-center gap-2 py-3 bg-amber-600 text-white font-semibold rounded hover:bg-amber-500 transition-colors"
        >
          <Plus size={20} />
          New Note
        </button>
        {allNotesCount > 0 && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Notes Count */}
      <div className="mb-4 text-sm text-dark-400">
        {searchQuery || filterTag ? (
          <span>{notes.length} of {allNotesCount} notes</span>
        ) : (
          <span>{allNotesCount} note{allNotesCount !== 1 ? 's' : ''}</span>
        )}
        {stats.pinnedCount > 0 && (
          <span className="ml-2">• {stats.pinnedCount} pinned</span>
        )}
      </div>

      {/* Notes List */}
      <NotesList
        notes={notes}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        onTogglePin={togglePin}
        onDuplicate={duplicateNote}
        availableTags={availableTags}
      />

      {/* Delete All Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-dark-800 rounded-lg p-6 w-full max-w-sm border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-2">Delete All Notes?</h3>
            <p className="text-dark-400 mb-6">
              This will move all {allNotesCount} notes to trash. You can restore them later.
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

      {/* Trash Modal */}
      <TrashModal
        isOpen={showTrash}
        onClose={() => setShowTrash(false)}
        deletedNotes={recentlyDeleted}
        onRestore={handleRestore}
        onPermanentDelete={permanentlyDelete}
        onClearAll={clearRecentlyDeleted}
      />

      {/* Stats Modal */}
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
      />
    </div>
  )
}

export default NotesApp