function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileReceiver({ received }) {
    return (
        <div className="bg-zinc-900 rounded-2xl p-5">
            <p className="text-sm font-medium text-gray-300 mb-3">Received files</p>
            {received.length === 0 ? (
                <p className="text-sm text-gray-500">No files received yet.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {received.map((f, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 bg-zinc-800 rounded-xl px-3 py-2.5"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-200 truncate">
                                    {f.name}
                                </p>
                                <p className="text-xs text-gray-400">{formatSize(f.size)}</p>
                            </div>
                            <a
                                href={f.url}
                                download={f.name}
                                className="text-xs text-blue-400 hover:underline shrink-0"
                            >
                                Download
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
