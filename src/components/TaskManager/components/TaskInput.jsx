import { Plus } from "lucide-react";
import { useState } from "react";

function TaskInput({ onAdd }) {
  const [value, setValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const task = value.trim();

    if (!task) return;

    await onAdd(task);

    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 right-0 z-30 flex h-12 bg-[#292929] border-t border-black/50"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Please Help Me"
        className="flex-1 min-w-0 bg-[#3b3b3b] text-white text-sm px-3 outline-none placeholder:text-gray-400"
      />

      <button
        type="submit"
        className="w-20 flex items-center justify-center gap-1 bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium"
      >
        <Plus size={16} />
        ADD
      </button>
    </form>
  );
}

export default TaskInput;