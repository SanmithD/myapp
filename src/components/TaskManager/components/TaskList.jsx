import { useEffect, useRef } from "react";
import { getRelativeDate } from "../../../utils/taskUtils";
import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  hasMore,
  loadMore,
  onStatusChange,
  onDelete,
  onEdit,
  listRef,
  bottomRef,
}) {
  const loaderRef = useRef(null);

  // Load older tasks when user scrolls near top
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      {
        root: listRef?.current || null,
        rootMargin: "200px 0px 0px 0px",
      }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadMore, listRef]);

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        No tasks found
      </div>
    );
  }

  let previousDate = null;

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto pb-14"
    >
      {/* Loader at TOP */}
      <div
        ref={loaderRef}
        className="h-fit flex items-center justify-center text-xs text-gray-500"
      >
        {hasMore
          && "Loading older tasks..."}
      </div>

      {tasks.map((task, index) => {
        const currentDate = getRelativeDate(
          task.createdAt
        );

        const showDate =
          currentDate !== previousDate;

        previousDate = currentDate;

        return (
          <div key={task.id}>
            {showDate && (
              <div className="px-3 py-1 bg-[#303030] text-[10px] text-blue-400">
                {currentDate}
              </div>
            )}

            <TaskItem
              task={task}
              index={index}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        );
      })}

      {/* Invisible bottom anchor */}
      <div ref={bottomRef} />
    </div>
  );
}

export default TaskList;