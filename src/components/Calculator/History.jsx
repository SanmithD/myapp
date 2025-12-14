import { ChevronDown, Clock, Download, Star, Trash2, X } from 'lucide-react'
import { useState } from 'react'

function History({ history, favorites, onSelect, onClear, onClose, onToggleFavorite, onExport }) {
  const [visibleCount, setVisibleCount] = useState(10)
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'favorites'

  const displayedItems = activeTab === 'favorites' ? favorites : history
  const visibleHistory = displayedItems.slice(0, visibleCount)
  const hasMore = displayedItems.length > visibleCount

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
        <div className="flex items-center h-14 justify-between p-4 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-dark-400" />
            <h2 className="text-lg font-semibold text-white">History</h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <>
                <button
                  onClick={onExport}
                  className="p-2 rounded-lg bg-dark-700 text-dark-300 hover:text-white transition-colors"
                  title="Export history"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={onClear}
                  className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                  title="Clear history"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-dark-700 text-dark-300 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'favorites'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <Star size={14} />
            Favorites ({favorites.length})
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4">
          {displayedItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">
                {activeTab === 'favorites' ? '⭐' : '🧮'}
              </div>
              <p className="text-dark-400">
                {activeTab === 'favorites' ? 'No favorites yet' : 'No calculations yet'}
              </p>
              <p className="text-dark-500 text-sm mt-1">
                {activeTab === 'favorites' 
                  ? 'Star calculations to save them here' 
                  : 'Your history will appear here'}
              </p>
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
                      <div
                        key={item.id}
                        className="w-full p-4 bg-dark-800 rounded border border-dark-700 hover:border-dark-600 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => onSelect(item)}
                            className="flex-1 min-w-0 text-left"
                          >
                            <p className="text-dark-400 text-sm truncate font-mono">
                              {item.expression}
                            </p>
                            <p className="text-white text-xl font-medium truncate font-mono">
                              = {item.result}
                            </p>
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onToggleFavorite(item)}
                              className={`p-1 rounded transition-colors ${
                                item.isFavorite || favorites.find(f => f.id === item.id)
                                  ? 'text-yellow-400'
                                  : 'text-dark-500 hover:text-yellow-400'
                              }`}
                            >
                              <Star size={16} fill={item.isFavorite || favorites.find(f => f.id === item.id) ? 'currentColor' : 'none'} />
                            </button>
                            <span className="text-xs text-dark-500">
                              {formatTime(item.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="w-full py-3 flex items-center justify-center gap-2 bg-dark-800 text-dark-300 rounded-xl hover:bg-dark-700 hover:text-white transition-colors"
                >
                  <ChevronDown size={18} />
                  Load More ({displayedItems.length - visibleCount} remaining)
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