import { Check, Copy, Download, Edit2, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function NoteItem({ note, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      toast.success("Copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log(err);
      toast.error("Copy failed");
    }
  };

  const handleDownload = () => {
    try {
      const fileContent = `${note.title}\n${"=".repeat(note.title.length)}\n\n${note.content}`;
      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      
      const sanitizedTitle = note.title
        .replace(/[^a-z0-9]/gi, "_")
        .replace(/_+/g, "_")
        .substring(0, 50);
      link.download = `${sanitizedTitle || "note"}.txt`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Downloaded");
    } catch (err) {
      console.log(err);
      toast.error("Download failed");
    }
  };

  const preview =
    note.content.length > 120
      ? note.content.substring(0, 120) + "..."
      : note.content;

  return (
    <div className="relative bg-dark-800 rounded border border-dark-700 hover:border-dark-600 transition-colors p-4 flex flex-col gap-2 w-full">
      {/* Header */}
      <div className="flex items-start justify-between w-full gap-2">
        <button onClick={onEdit} className="flex-1 text-left">
          <h3 className="font-semibold text-white text-base truncate">
            {note.title}
          </h3>
          <p className="text-xs text-dark-500 mt-1">
            {formatDate(note.updatedAt)}
          </p>
        </button>

        {/* Menu button */}
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-all"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Content Preview */}
      <button onClick={onEdit} className="text-left">
        <p className="text-sm text-dark-300 leading-relaxed line-clamp-3 whitespace-pre-wrap">
          {preview}
        </p>
      </button>

      {/* Action Menu */}
      {showActions && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowActions(false)}
          />

          <div className="absolute flex flex-col gap-1 top-12 right-3 z-20 bg-dark-700 border border-dark-600 shadow-lg overflow-hidden min-w-[160px]">
            <button
              onClick={() => {
                handleCopy();
                setShowActions(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-dark-600 text-dark-200 transition"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              Copy
            </button>

            <button
              onClick={() => {
                handleDownload();
                setShowActions(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-dark-600 text-dark-200 transition"
            >
              <Download size={16} />
              Download
            </button>

            <button
              onClick={() => {
                onEdit();
                setShowActions(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-dark-600 text-dark-200 transition"
            >
              <Edit2 size={16} />
              Edit
            </button>

            <button
              onClick={() => {
                onDelete();
                setShowActions(false);
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
  );
}

export default NoteItem;