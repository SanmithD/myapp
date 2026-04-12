import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FileHome() {
  const [room, setRoom] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${id}`);
  };

  const joinRoom = () => {
    if (!room.trim()) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }
    navigate(`/room/${room.trim()}`);
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-8">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-gray-300">LAN File Drop</h1>
          <p className="text-sm text-gray-500 mt-1">Share files instantly on your local network</p>
        </div>

        {/* Card */}
        <div className="bg-gray-700 rounded-2xl p-6 flex flex-col gap-3">

          <button
            onClick={createRoom}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create a room
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or join existing</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              className="flex-1 px-3 py-2 text-sm font-mono text-black bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
            />
            <button
              onClick={joinRoom}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Join
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              Please enter a room ID to join.
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Files are transferred peer-to-peer on your local network
        </p>
      </div>
    </div>
  );
}