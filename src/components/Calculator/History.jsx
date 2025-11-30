import { ChevronDown, Clock, Trash2, X } from 'lucide-react'
import { useState } from 'react'

function History({ history, onSelect, onClear, onClose }) {
  const [visibleCount, setVisibleCount] = useState(10)

  const visibleHistory = history.slice(0, visibleCount)
  const hasMore = history.length > visibleCount

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  // Group history by date
  const groupedHistory = visibleHistory.reduce((groups, item) => {
    const date = formatDate(item.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
    return groups
  }, {})

  return (
    <div className="fixed inset-0 z-50 bg-dark-900/95 backdrop-blur">
      <div className="h-full flex flex-col max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center h-10 justify-between p-4 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-dark-400" />
            <h2 className="text-lg font-semibold text-white">History</h2>
            <span className="text-sm text-dark-500">({history.length})</span>
          </div>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
              >
                <Trash2 size={22} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-dark-700 text-dark-300 hover:text-white transition-colors"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🧮</div>
              <p className="text-dark-400">No calculations yet</p>
              <p className="text-dark-500 text-sm mt-1">Your history will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date}>
                  <h3 className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-3">
                    {date}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="w-full text-left p-4 bg-dark-800 rounded border border-dark-700 hover:border-dark-600 transition-colors group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-dark-400 text-sm truncate font-mono">
                              {item.expression}
                            </p>
                            <p className="text-white text-xl font-medium truncate font-mono">
                              = {item.result}
                            </p>
                          </div>
                          <span className="text-xs text-dark-500 flex-shrink-0">
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Load More */}
              {hasMore && (
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="w-full py-3 flex items-center justify-center gap-2 bg-dark-800 text-dark-300 rounded-xl hover:bg-dark-700 hover:text-white transition-colors"
                >
                  <ChevronDown size={18} />
                  Load More ({history.length - visibleCount} remaining)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History