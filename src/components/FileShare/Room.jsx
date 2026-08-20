import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPeer } from "../../utils/peer";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Room() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef();
  const peerRef = useRef();
  const isInitiatorRef = useRef(false);

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("waiting"); // "waiting" | "connected"
  const [progress, setProgress] = useState(null); // 0–100 or null
  const [received, setReceived] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const attachDataHandler = (peer) => {
    peer.on("data", (data) => {
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "received_file";
      a.click();
      setReceived((prev) => [
        { name: "received_file", size: data.byteLength, ts: Date.now() },
        ...prev,
      ]);
    });
  };

  useEffect(() => {
    const socket = new WebSocket("wss://myapp-backend-coiz.onrender.com");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join", room: id })); // ✅ join the room
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "role") {
        isInitiatorRef.current = data.initiator;
      }
      if (data.type === "start") {
        peerRef.current = createPeer(isInitiatorRef.current, socket);
        attachDataHandler(peerRef.current);
        setStatus("connected");
      }
      if (data.type === "signal") {
        if (!peerRef.current) {
          peerRef.current = createPeer(false, socket);
          attachDataHandler(peerRef.current);
          setStatus("connected");
        }
        peerRef.current.signal(data.signal);
      }
    };

    return () => socket.close();
  }, [id]);

  const handleFile = (f) => f && setFile(f);

  const sendFile = () => {
    if (!file || !peerRef.current) return;
    const reader = new FileReader();
    reader.onload = () => {
      peerRef.current.send(reader.result);
      setProgress(0);
      // simulate progress (replace with real chunk tracking if needed)
      let p = 0;
      const iv = setInterval(() => {
        p += Math.floor(Math.random() * 12) + 4;
        if (p >= 100) {
          p = 100;
          clearInterval(iv);
          setProgress(null);
          setFile(null);
        }
        setProgress(p);
      }, 120);
    };
    reader.readAsArrayBuffer(file);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 mt-10">
      <div className="max-w-lg mx-auto flex flex-col gap-4">
        {/* Back */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-300 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-600 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <polyline
                points="15 18 9 12 15 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
        </div>

        {/* Room info */}
        <div className="bg-zinc-900 rounded-2xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">
                Room
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium font-mono text-gray-300">
                  {id}
                </span>
                <button
                  onClick={copyRoomId}
                  className="inline-flex items-center gap-1 text-xs text-gray-400 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <polyline
                          points="20 6 9 17 4 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path
                          d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                          strokeLinecap="round"
                        />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status === "connected" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${status === "connected" ? "bg-green-500" : "bg-amber-400"}`}
              />
              {status === "connected" ? "Peer connected" : "Waiting for peer"}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6">
            <div>
              <p className="text-[11px] text-gray-400 mb-0.5">Peers</p>
              <p className="text-sm font-medium text-gray-300">
                {status === "connected" ? "2 / 2" : "1 / 2"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 mb-0.5">Mode</p>
              <p className="text-sm font-medium text-gray-300">Peer-to-peer</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 mb-0.5">Encryption</p>
              <p className="text-sm font-medium text-green-600">E2E</p>
            </div>
          </div>
        </div>

        {/* Send */}
        <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-300">Send a file</p>

          {!file ? (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              className={`flex flex-col items-center justify-center gap-2 border-[1.5px] border-dashed rounded-xl p-10 cursor-pointer transition-colors ${dragging ? "bg-gray-50 border-gray-400" : "border-gray-200 hover:bg-zinc-600"}`}
            >
              <svg
                className="w-7 h-7 text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-sm text-gray-400">
                Drop file here or <span className="text-blue-500">browse</span>
              </p>
              <p className="text-xs text-gray-300">
                Any file type · No size limit
              </p>
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </label>
          ) : (
            <div className="flex items-center gap-3 bg-gray-900 rounded-xl px-3 py-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-300 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-gray-300 hover:text-gray-500 p-1"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {progress !== null && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">
                  {progress === 100 ? "Sent" : "Sending…"}
                </span>
                <span className="text-xs font-medium text-gray-900">
                  {progress}%
                </span>
              </div>
              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime-500 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={sendFile}
            disabled={!file || status !== "connected" || progress !== null}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send file
          </button>
        </div>

        {/* Received */}
        <div className="bg-zinc-900 rounded-2xl p-5">
          <p className="text-sm font-medium text-gray-300 mb-3">
            Received files
          </p>
          {received.length === 0 ? (
            <p className="text-sm text-gray-300">No files received yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {received.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-zinc-900 rounded-xl px-3 py-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {f.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatSize(f.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
