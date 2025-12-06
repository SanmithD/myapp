import { Check, Download, Edit2, MoreVertical, Pause, Play, Trash2, X } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

function RecordingItem({ recording, onDelete, onRename }) {
  const [showActions, setShowActions] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(recording.name)
  const [currentTime, setCurrentTime] = useState(0)
  
  const audioRef = useRef(null)

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Format file size
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  // Play/Pause audio
  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(recording.audioData)
      audioRef.current.onended = () => {
        setIsPlaying(false)
        setCurrentTime(0)
      }
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(Math.floor(audioRef.current.currentTime))
      }
    }

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Download recording
  const handleDownload = () => {
    try {
      // Convert base64 to blob
      const byteString = atob(recording.audioData.split(',')[1])
      const mimeType = recording.audioData.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      
      const blob = new Blob([ab], { type: mimeType })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      
      const sanitizedName = recording.name
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .substring(0, 50)
      
      // Use .webm extension as that's the actual format
      link.download = `${sanitizedName || 'recording'}.webm`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Downloaded')
      setShowActions(false)
    } catch (err) {
      console.error('Download failed:', err)
      toast.error('Download failed')
    }
  }

  // Save renamed recording
  const handleSaveRename = () => {
    if (editName.trim()) {
      onRename(editName)
      setIsEditing(false)
    }
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditName(recording.name)
    setIsEditing(false)
  }

  return (
    <div className="relative bg-dark-800 rounded-xl border border-dark-700 hover:border-dark-600 transition-colors p-4">
      {/* Main Content */}
      <div className="flex items-center gap-4">
        {/* Play Button */}
        <button
          onClick={togglePlay}
          className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
            isPlaying 
              ? 'bg-rose-600 hover:bg-rose-500' 
              : 'bg-dark-700 hover:bg-dark-600'
          } text-white`}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 bg-dark-700 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename()
                  if (e.key === 'Escape') handleCancelEdit()
                }}
              />
              <button
                onClick={handleSaveRename}
                className="p-1 text-green-400 hover:text-green-300"
              >
                <Check size={18} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1 text-dark-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-white truncate">{recording.name}</h3>
              <div className="flex items-center gap-3 text-xs text-dark-400 mt-1">
                <span>{formatDuration(isPlaying ? currentTime : recording.duration)}</span>
                <span>•</span>
                <span>{formatSize(recording.size)}</span>
                <span>•</span>
                <span>{formatDate(recording.createdAt)}</span>
              </div>
            </>
          )}
        </div>

        {/* Menu Button */}
        {!isEditing && (
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
          >
            <MoreVertical size={20} />
          </button>
        )}
      </div>

      {/* Progress Bar (when playing) */}
      {isPlaying && (
        <div className="mt-3 h-1 bg-dark-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-rose-500 transition-all duration-200"
            style={{ width: `${(currentTime / recording.duration) * 100}%` }}
          />
        </div>
      )}

      {/* Action Menu */}
      {showActions && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowActions(false)}
          />
          <div className="absolute top-12 right-3 z-20 bg-dark-700 rounded-xl border border-dark-600 shadow-xl overflow-hidden min-w-[160px]">
            <button
              onClick={() => {
                handleDownload()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-dark-600 text-dark-200 transition"
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={() => {
                setIsEditing(true)
                setShowActions(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-dark-600 text-dark-200 transition"
            >
              <Edit2 size={16} />
              Rename
            </button>
            <button
              onClick={() => {
                // Stop playing if currently playing
                if (audioRef.current) {
                  audioRef.current.pause()
                  audioRef.current = null
                }
                onDelete()
                setShowActions(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-dark-600 text-red-400 transition"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default RecordingItem