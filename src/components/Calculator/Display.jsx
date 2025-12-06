function Display({ expression, result }) {
  return (
    <div className="bg-dark-800 rounded border border-dark-700">
      {/* Expression */}
      <div className="text-right text-dark-400 text-sm sm:text-base min-h-[1.5rem] overflow-hidden font-mono px-2">
        {expression || '\u00A0'}
      </div>
      
      {/* Result */}
      <div className="text-right text-white text-4xl sm:text-5xl md:text-6xl font-light overflow-hidden font-mono px-3">
        {result}
      </div>
    </div>
  )
}

export default Display