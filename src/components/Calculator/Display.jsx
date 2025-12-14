function Display({ expression, result, preview, angleMode, memory }) {
  return (
    <div className="bg-dark-800 rounded border border-dark-700">
      {/* Status indicators */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-dark-700">
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-0.5 rounded ${
            angleMode === 'deg' ? 'bg-primary-600/20 text-primary-400' : 'bg-dark-700 text-dark-500'
          }`}>
            DEG
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            angleMode === 'rad' ? 'bg-primary-600/20 text-primary-400' : 'bg-dark-700 text-dark-500'
          }`}>
            RAD
          </span>
        </div>
        {memory !== 0 && (
          <span className="text-xs text-yellow-400">M</span>
        )}
      </div>

      {/* Expression */}
      <div className="text-right text-dark-400 text-sm sm:text-base min-h-[1.5rem] overflow-hidden font-mono px-2 pt-2">
        {expression || '\u00A0'}
      </div>
      
      {/* Preview (real-time calculation) */}
      {preview && (
        <div className="text-right text-dark-500 text-sm overflow-hidden font-mono px-2">
          = {preview}
        </div>
      )}
      
      {/* Result */}
      <div className="text-right text-white text-4xl sm:text-5xl md:text-6xl font-light overflow-hidden font-mono px-3 pb-2">
        {result}
      </div>
    </div>
  )
}

export default Display