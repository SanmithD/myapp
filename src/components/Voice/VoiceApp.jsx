import { Mic, Search, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import useRecordings from '../../hooks/useRecordings'
import Recorder from './Recorder'
import RecordingsList from './RecordingsList'

function VoiceApp() {
  const {
    recordings,
    allRecordingsCount,
    searchQuery,
    setSearchQuery,
    addRecording,
    deleteRecording,
    deleteAllRecordings,
    renameRecording
  } = useRecordings()

  const [isRecording, setIsRecording] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleRecordingSaved = async (audioBlob, duration) => {
    const name = `Recording ${allRecordingsCount + 1}`
    await addRecording(name, audioBlob, duration)
    toast.success('Recording saved')
    setIsRecording(false)
  }

  const handleDeleteRecording = (id) => {
    deleteRecording(id)
    toast.success('Deleted')
  }

  const handleDeleteAll = () => {
    deleteAllRecordings()
    setShowDeleteConfirm(false)
    toast.success('All recordings deleted')
  }

  const handleRename = (id, newName) => {
    renameRecording(id, newName)
    toast.success('Renamed')
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Voice Recorder</h2>
        <p className="text-dark-400 text-sm">Record and save audio</p>
      </div>

      {/* Search */}
      {!isRecording && allRecordingsCount > 0 && (
        <div className="mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-dark-500"
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
      )}

      {/* Recorder or New Recording Button */}
      {isRecording ? (
        <Recorder
          onSave={handleRecordingSaved}
          onCancel={() => setIsRecording(false)}
        />
      ) : (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setIsRecording(true)}
            className="flex-1 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            <Mic size={22} />
            New Recording
          </button>
          {allRecordingsCount > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-4 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      )}

      {/* Count */}
      {!isRecording && (
        <div className="mb-4 text-sm text-dark-400">
          {searchQuery ? (
            <span>{recordings.length} of {allRecordingsCount} recordings</span>
          ) : (
            <span>{allRecordingsCount} recording{allRecordingsCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      {/* Recordings List */}
      {!isRecording && (
        <RecordingsList
          recordings={recordings}
          onDelete={handleDeleteRecording}
          onRename={handleRename}
        />
      )}

      {/* Delete All Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-sm border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-2">Delete All?</h3>
            <p className="text-dark-400 mb-6">
              Delete all {allRecordingsCount} recordings? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-dark-700 text-white rounded-xl hover:bg-dark-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500"
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

export default VoiceApp