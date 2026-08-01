import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

function TaskHeader() {
  const navigate = useNavigate();

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-[#30396f] text-white">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-xs text-gray-200"
      >
        <ArrowLeft size={15} />
        <span>Task</span>
      </button>

      <h1 className="font-semibold text-sm">
        My Tasks
      </h1>

      <button
        onClick={() => navigate("/")}
        className="p-1.5 rounded hover:bg-white/10"
      >
        <Home size={19} />
      </button>
    </header>
  );
}

export default TaskHeader;