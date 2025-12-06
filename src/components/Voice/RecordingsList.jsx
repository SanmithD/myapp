import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import RecordingItem from './RecordingItem'

function RecordingsList({ recordings, onDelete, onRename }) {
  const [visibleCount, setVisibleCount] = useState(10)

  const visibleRecordings = recordings.slice(0, visibleCount)
  const hasMore = recordings.length > visibleCount

  const loadMore = () => {
    setVisibleCount(prev => prev + 10)
  }

  if (recordings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎙️</div>
        <p className="text-dark-400">No recordings yet</p>
        <p className="text-dark-500 text-sm mt-1">Tap "New Recording" to start</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {visibleRecordings.map(recording => (
        <RecordingItem
          key={recording.id}
          recording={recording}
          onDelete={() => onDelete(recording.id)}
          onRename={(newName) => onRename(recording.id, newName)}
        />
      ))}

      {/* Load More Button */}
      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-3 flex items-center justify-center gap-2 bg-dark-800 text-dark-300 rounded-xl hover:bg-dark-700 hover:text-white transition-colors"
        >
          <ChevronDown size={18} />
          Load More ({recordings.length - visibleCount} remaining)
        </button>
      )}
    </div>
  )
}

export default RecordingsList