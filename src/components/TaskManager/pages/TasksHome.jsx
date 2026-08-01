import { useCallback, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import {
    addTask,
    deleteTask,
    getAllTasks,
    updateTask,
    updateTaskStatus,
} from "../../../utils/taskDB";
import TaskFilters from "../components/TaskFilters";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";

const PAGE_SIZE = 30;

function TasksHome() {
  const [allTasks, setAllTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  // Number of tasks currently displayed
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const listRef = useRef(null);
  const bottomRef = useRef(null);

  /*
   * Load all tasks from IndexedDB.
   *
   * Oldest → Latest
   */
  const loadTasks = async () => {
    try {
      const tasks = await getAllTasks();

      const sortedTasks = [...tasks].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      setAllTasks(sortedTasks);

      // Start with latest 30
      setVisibleCount(Math.min(PAGE_SIZE, sortedTasks.length));

      /*
       * Wait for DOM rendering,
       * then scroll to latest task.
       */
      requestAnimationFrame(() => {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({
            behavior: "instant",
            block: "end",
          });
        }, 50);
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
  }, []);

  /*
   * Filter tasks.
   */
  const filteredTasks =
    filter === "all"
      ? allTasks
      : allTasks.filter((task) => task.status === filter);

  /*
   * Display only the latest N tasks.
   *
   * Because allTasks are sorted:
   *
   * Oldest → Latest
   *
   * We take the LAST 30.
   */
  const visibleTasks = filteredTasks.slice(
    Math.max(filteredTasks.length - visibleCount, 0),
  );

  /*
   * Are there older tasks available?
   */
  const hasMore = visibleCount < filteredTasks.length;

  /*
   * Load 30 older tasks.
   */
  const loadMore = useCallback(() => {
    if (!hasMore) return;

    const container = listRef.current;

    /*
     * Save current scroll position.
     *
     * When older tasks are inserted,
     * content height increases.
     */
    const previousScrollHeight = container?.scrollHeight || 0;

    const previousScrollTop = container?.scrollTop || 0;

    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredTasks.length));

    /*
     * Restore scroll position after
     * React renders the older tasks.
     */
    requestAnimationFrame(() => {
      if (!container) return;

      const newScrollHeight = container.scrollHeight;

      const heightDifference = newScrollHeight - previousScrollHeight;

      container.scrollTop = previousScrollTop + heightDifference;
    });
  }, [hasMore, filteredTasks.length]);

  /*
   * Reset when filter changes.
   *
   * Start with latest 30 filtered tasks.
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(PAGE_SIZE);

    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    });
  }, [filter]);

  /*
   * Add new task.
   */
  const handleAdd = async (taskText) => {
    try {
      const newTask = await addTask(taskText);

      /*
       * Add new task at the END.
       *
       * Oldest → Latest
       */
      setAllTasks((prev) => [...prev, newTask]);

      /*
       * If current filter isn't "all",
       * switch to all so user can see
       * the newly created task.
       */
      setFilter("all");

      /*
       * Increase visible count if needed.
       */
      setVisibleCount((prev) => Math.min(prev + 1, allTasks.length + 1));

      /*
       * Scroll to latest task.
       */
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);

      toast.success("Task added");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add task");
    }
  };

  /*
   * Update task status.
   */
  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateTaskStatus(id, status);

      setAllTasks((prev) =>
        prev.map((task) => (task.id === id ? updated : task)),
      );

      toast.success(
        status === "completed"
          ? "Task completed"
          : status === "rejected"
            ? "Task rejected"
            : "Task moved to pending",
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to update task");
    }
  };

  /*
   * Delete task.
   */
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);

      setAllTasks((prev) => prev.filter((task) => task.id !== id));

      toast.success("Task deleted");
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete task");
    }
  };

  /*
   * Edit task.
   */
  const handleEdit = async (task) => {
    try {
      const updated = await updateTask(task);

      setAllTasks((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );

      toast.success("Task updated");
    } catch (error) {
      console.error(error);

      toast.error("Failed to update task");
    }
  };

  return (
    <div className="h-dvh w-full bg-[#292929] flex flex-col overflow-hidden">
      {/* <TaskHeader /> */}

      <TaskFilters filter={filter} setFilter={setFilter} />

      <TaskList
        tasks={visibleTasks}
        hasMore={hasMore}
        loadMore={loadMore}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onEdit={handleEdit}
        listRef={listRef}
        bottomRef={bottomRef}
      />

      <TaskInput onAdd={handleAdd} />
    </div>
  );
}

export default TasksHome;
