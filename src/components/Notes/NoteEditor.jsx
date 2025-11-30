import { Save, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const textareaRef = useRef(null)

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Calculate line count
  const lineCount = content.split('\n').length

  const handleSave = () => {
    onSave(title, content)
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-dark-800 border-b border-dark-700 shadow-lg">
        {/* Title Input */}
        <div className="px-4 sm:px-6 sm:py-4 border-b border-dark-700">
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent h-10 text-xl sm:text-2xl font-semibold text-white placeholder-dark-500 focus:outline-none"
          />
        </div>

        {/* Formatting Toolbar */}
        <div className="px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto">
          {/* Spacer */}
          <div className="flex-1" />

          {/* Action Buttons - Desktop */}
          <div className="hidden sm:flex items-center text-3xl gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <X size={20} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-4">
        {/* Line Count Display */}
        <div className="flex items-center justify-between mb-3 text-sm text-dark-500">
          <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
          <span>{content.length} characters</span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="flex-1 w-full bg-dark-800 text-white p-4 sm:p-6 rounded-xl border border-dark-700 resize-none focus:outline-none focus:border-dark-500 text-base leading-relaxed placeholder-dark-500 min-h-[300px]"
          spellCheck={false}
        />
      </div>

      {/* Bottom Action Bar (Mobile) */}
      <div className="sticky bottom-0 text-2xl bg-dark-800 border-t border-dark-700 p-4 flex gap-3 sm:hidden">
        <button
          onClick={onCancel}
          className="flex-1 py-4 bg-dark-700 text-white rounded font-semibold hover:bg-dark-600 transition-colors flex items-center justify-center gap-2"
        >
          <X size={20} />
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-4 bg-amber-600 text-white rounded font-semibold hover:bg-amber-500 transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save
        </button>
      </div>
    </div>
  )
}

export default NoteEditor