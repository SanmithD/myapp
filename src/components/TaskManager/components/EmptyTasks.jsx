function EmptyTasks() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
      <p className="text-sm">
        No tasks yet
      </p>

      <p className="text-xs mt-1">
        Add your first task below
      </p>
    </div>
  );
}

export default EmptyTasks;