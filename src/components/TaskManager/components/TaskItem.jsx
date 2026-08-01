import { Check, Pencil, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { formatTaskTime } from "../../../utils/taskUtils";

function TaskItem({ task, index, onStatusChange, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.task);

  const handleSave = async () => {
    if (!value.trim()) return;

    await onEdit({
      ...task,
      task: value.trim(),
    });

    setEditing(false);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-[#252525] bg-[#3b3b3b]">
      <span className="w-8 text-[11px] text-gray-400">#{task.id}</span>

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }

              if (e.key === "Escape") {
                setValue(task.task);
                setEditing(false);
              }
            }}
            className="w-full bg-[#2e2e2e] border border-purple-500 rounded px-2 py-1 text-xs text-white outline-none"
          />
        ) : (
          <button
            onDoubleClick={() => setEditing(true)}
            className={`block w-full text-left text-xs truncate ${
              task.status === "completed"
                ? "text-gray-500"
                : task.status === "rejected"
                  ? "text-red-400"
                  : "text-gray-200"
            }`}
          >
            {task.task}
          </button>
        )}

        <span className="text-[10px] text-gray-500">
          {formatTaskTime(task.createdAt)}
        </span>
      </div>

      {editing ? (
        <button onClick={handleSave} className="p-1 text-green-400">
          <Save size={16} />
        </button>
      ) : (
        <button onClick={() => setEditing(true)} className="p-1 text-gray-500">
          <Pencil size={15} />
        </button>
      )}

      <button
        onClick={() =>
          onStatusChange(
            task.id,
            task.status === "completed" ? "pending" : "completed",
          )
        }
        className={`p-1 ${
          task.status === "completed" ? "text-green-400" : "text-gray-500"
        }`}
      >
        <Check size={17} />
      </button>

      <button
        onClick={() =>
          onStatusChange(
            task.id,
            task.status === "rejected" ? "pending" : "rejected",
          )
        }
        className={`p-1 ${
          task.status === "rejected" ? "text-red-400" : "text-gray-500"
        }`}
      >
        <X size={17} />
      </button>

      <button
        onClick={() => onDelete(task.id)}
        className="p-1 text-gray-500 hover:text-red-400"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export default TaskItem;
