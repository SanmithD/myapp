import { BarChart3, Check, ListFilter } from "lucide-react";
import { useNavigate } from "react-router-dom";

function TaskFilters({ filter, setFilter }) {
  const navigate = useNavigate();

  return (
    <div className="flex mt-12 items-center gap-2 px-3 py-2 bg-[#3d3d3d] border-b border-black/30">
      <div className="relative">
        <ListFilter
          size={14}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="appearance-none bg-[#505050] text-white text-xs rounded pl-7 pr-7 py-1.5 outline-none"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <button
        onClick={() => setFilter("completed")}
        className="flex items-center gap-1 bg-[#505050] text-xs text-gray-200 px-3 py-1.5 rounded"
      >
        <Check size={13} />
        Completed
      </button>

      <button
        onClick={() => navigate("/tasks/dashboard")}
        className="ml-auto flex items-center gap-1 bg-[#505050] text-xs text-gray-200 px-3 py-1.5 rounded"
      >
        Dashboard
        <BarChart3 size={13} />
      </button>
    </div>
  );
}

export default TaskFilters;