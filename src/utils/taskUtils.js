export const formatTaskTime = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
};

export const formatTaskDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

export const getRelativeDate = (date) => {
  const taskDate = new Date(date);
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const taskDay = new Date(
    taskDate.getFullYear(),
    taskDate.getMonth(),
    taskDate.getDate()
  );

  if (taskDay.getTime() === today.getTime()) {
    return "Today";
  }

  if (taskDay.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  return formatTaskDate(date);
};

export const sortLatestFirst = (tasks) => {
  return [...tasks].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );
};