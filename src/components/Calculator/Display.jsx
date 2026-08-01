function Display({ expression, result, preview, angleMode, memory }) {
  return (
    <div className="bg-dark-800 rounded border border-dark-700">
      {/* Status indicators */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-dark-700">
        <div className="flex gap-2">
          <span
            className={`text-[10px] sm:text-xs px-2 py-0.5 rounded ${
              angleMode === "deg"
                ? "bg-primary-600/20 text-primary-400"
                : "bg-dark-700 text-dark-500"
            }`}
          >
            DEG
          </span>
          <span
            className={`text-[10px] sm:text-xs px-2 py-0.5 rounded ${
              angleMode === "rad"
                ? "bg-primary-600/20 text-primary-400"
                : "bg-dark-700 text-dark-500"
            }`}
          >
            RAD
          </span>
        </div>
        {memory !== 0 && <span className="text-[10px] sm:text-xs text-yellow-400">M</span>}
      </div>

      {/* Expression — horizontally scrollable instead of clipped if very long */}
      <div className="text-right text-dark-400 text-xs sm:text-sm md:text-base min-h-[1.25rem] sm:min-h-[1.5rem] overflow-x-auto whitespace-nowrap font-mono px-2 pt-2 [&::-webkit-scrollbar]:hidden">
        {expression || "\u00A0"}
      </div>

      {/* Preview (real-time calculation) */}
      {preview && (
        <div className="text-right text-dark-500 text-xs sm:text-sm overflow-x-auto whitespace-nowrap font-mono px-2 [&::-webkit-scrollbar]:hidden">
          = {preview}
        </div>
      )}

      {/*
        Result — uses clamp() instead of fixed sm/md breakpoints so the font
        scales continuously with viewport width (small phone -> tablet ->
        desktop) rather than jumping between a few fixed sizes. Falls back
        to horizontal scroll (never clipped) if a result is still too wide.
      */}
      <div
        className="text-right text-white font-light overflow-x-auto whitespace-nowrap font-mono px-3 pb-2 leading-tight [&::-webkit-scrollbar]:hidden"
        style={{ fontSize: "clamp(1.75rem, 9vw, 3.75rem)", scrollbarWidth: "none" }}
      >
        {result}
      </div>
    </div>
  );
}

export default Display;