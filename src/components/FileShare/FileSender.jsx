import { useState } from "react";
import { sendFile } from "../../utils/fileTransfer";

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileSender({ peer, connected }) {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [progress, setProgress] = useState(null); // null | 0-100
    const [error, setError] = useState(null);

    const handleFile = (f) => f && setFile(f);

    const send = async () => {
        if (!file || !peer) return;
        setError(null);
        setProgress(0);
        try {
            await sendFile(peer, file, setProgress);
            setProgress(100);
            setTimeout(() => {
                setProgress(null);
                setFile(null);
            }, 600);
        } catch (err) {
            console.error("Send failed:", err);
            setError(err.message || "Transfer failed");
            setProgress(null);
        }
    };

    return (
        <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-sm font-medium text-gray-300">Send a file</p>

            {!file ? (
                <label
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                    className={`flex flex-col items-center justify-center gap-2 border-[1.5px] border-dashed rounded-xl p-10 cursor-pointer transition-colors ${dragging ? "bg-gray-50 border-gray-400" : "border-gray-200 hover:bg-zinc-600"}`}
                >
                    <p className="text-sm text-gray-400">Drop file here or <span className="text-blue-500">browse</span></p>
                    <p className="text-xs text-gray-300">Any file type · Chunked transfer</p>
                    <input type="file" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </label>
            ) : (
                <div className="flex items-center gap-3 bg-gray-900 rounded-xl px-3 py-2.5">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-300 truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                    </div>
                    {progress === null && (
                        <button onClick={() => setFile(null)} className="text-gray-300 hover:text-gray-500 p-1">✕</button>
                    )}
                </div>
            )}

            {progress !== null && (
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                        <span className="text-xs text-gray-400">{progress === 100 ? "Sent" : "Sending…"}</span>
                        <span className="text-xs font-medium text-gray-300">{progress}%</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-lime-500 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}

            {error && <p className="text-xs text-red-400 bg-red-950/40 rounded-lg px-3 py-2">{error}</p>}

            <button
                onClick={send}
                disabled={!file || !connected || progress !== null}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                Send file
            </button>
        </div>
    );
}