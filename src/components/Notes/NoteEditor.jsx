// components/Notes/NoteEditor.jsx
import { Pin, PinOff, Save, Tag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function NoteEditor({ note, onSave, onCancel, availableTags }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [selectedTags, setSelectedTags] = useState(note?.tags || []);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isPinned, setIsPinned] = useState(note?.pinned || false);
  const textareaRef = useRef(null);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Calculate stats
  const lineCount = content.split("\n").length;
  const wordCount = content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = content.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute

  const handleSave = () => {
    onSave(title, content, selectedTags, isPinned);
  };

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="min-h-screen mt-12 flex flex-col bg-dark-900 dark:bg-dark-900 light:bg-gray-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-dark-800 dark:bg-dark-800 light:bg-white border-b border-dark-700 dark:border-dark-700 light:border-gray-200 shadow-lg">
        {/* Title Input */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-dark-700 dark:border-dark-700 light:border-gray-200">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-transparent h-10 text-xl sm:text-2xl font-semibold text-white dark:text-white light:text-gray-900 placeholder-dark-500 focus:outline-none"
            />
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-lg transition-colors ${
                isPinned
                  ? "bg-amber-600 text-white"
                  : "bg-dark-700 text-dark-400 hover:text-white"
              }`}
              title={isPinned ? "Unpin note" : "Pin note"}
            >
              {isPinned ? <Pin size={20} /> : <PinOff size={20} />}
            </button>
          </div>
        </div>

        {/* Tags and Formatting Toolbar */}
        <div className="px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto">
          {/* Tag Button */}
          <div className="relative z-50">
            <button
              onClick={() => setShowTagPicker(!showTagPicker)}
              className="flex items-center gap-2 px-3 py-2 rounded bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white transition-colors"
            >
              <Tag size={16} />
              <span className="text-sm">Tags</span>
              {selectedTags.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-amber-600 rounded-full">
                  {selectedTags.length}
                </span>
              )}
            </button>

            {/* Tag Picker Dropdown */}
            {showTagPicker && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                {/* Modal */}
                <div className="bg-dark-800 w-[90%] max-w-md rounded-xl border border-dark-700 shadow-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700">
                    <h3 className="text-white font-semibold text-lg">
                      Select Tags
                    </h3>
                    <button
                      onClick={() => setShowTagPicker(false)}
                      className="p-2 rounded hover:bg-dark-700 text-dark-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Tag List */}
                  <div className="p-4 grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {availableTags.map((tag) => {
                      const active = selectedTags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
                            active
                              ? "bg-dark-600 border-amber-500 text-white"
                              : "bg-dark-700 border-dark-600 text-dark-300 hover:bg-dark-600"
                          }`}
                        >
                          <span
                            className={`w-3 h-3 rounded-full ${tag.color}`}
                          />
                          <span className="flex-1 text-left">{tag.name}</span>
                          {active && <span className="text-amber-400">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-dark-700 flex gap-3">
                    <button
                      onClick={() => setSelectedTags([])}
                      className="flex-1 py-2 rounded bg-dark-700 text-dark-300 hover:text-white"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowTagPicker(false)}
                      className="flex-1 py-2 rounded bg-amber-600 text-white hover:bg-amber-500"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="z-50 gap-1 flex-wrap">
              {selectedTags.map((tagId) => {
                const tag = availableTags.find((t) => t.id === tagId);
                return tag ? (
                  <span
                    key={tagId}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-white ${tag.color}`}
                  >
                    {tag.name}
                    <button
                      onClick={() => toggleTag(tagId)}
                      className="hover:opacity-70"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}

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
        {/* Stats Display */}
        <div className="flex items-center justify-between mb-3 text-sm text-dark-500 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span>
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
            <span>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
            <span>{charCount} chars</span>
          </div>
          <span>~{readingTime} min read</span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="flex-1 w-full bg-dark-800 dark:bg-dark-800 light:bg-white text-white dark:text-white light:text-gray-900 p-4 sm:p-6 rounded-xl border border-dark-700 dark:border-dark-700 light:border-gray-200 resize-none focus:outline-none focus:border-dark-500 text-base leading-relaxed placeholder-dark-500 min-h-[300px]"
          spellCheck={false}
        />
      </div>

      {/* Bottom Action Bar (Mobile) */}
      <div className="sticky bottom-0 text-2xl bg-dark-800 dark:bg-dark-800 light:bg-white border-t border-dark-700 dark:border-dark-700 light:border-gray-200 p-4 flex gap-3 sm:hidden">
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
  );
}

export default NoteEditor;
