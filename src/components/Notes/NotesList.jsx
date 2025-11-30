import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import NoteItem from './NoteItem'

function NotesList({ notes, onEdit, onDelete }) {
  const [visibleCount, setVisibleCount] = useState(10)

  const visibleNotes = notes.slice(0, visibleCount)
  const hasMore = notes.length > visibleCount

  const loadMore = () => {
    setVisibleCount(prev => prev + 10)
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-dark-400">No notes yet</p>
        <p className="text-dark-500 text-sm mt-1">Tap "New Note" to create one</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 flex flex-col gap-2 ">
      {visibleNotes.map(note => (
        <NoteItem
          key={note.id}
          note={note}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note.id)}
        />
      ))}

      {/* Load More Button */}
      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-3 flex items-center justify-center gap-2 bg-dark-800 text-dark-300 rounded-xl hover:bg-dark-700 hover:text-white transition-colors"
        >
          <ChevronDown size={18} />
          Load More ({notes.length - visibleCount} remaining)
        </button>
      )}
    </div>
  )
}

export default NotesList