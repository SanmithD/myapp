import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CheckCircle2,
  Clock3,
  ListTodo,
  XCircle
} from "lucide-react";
import { getAllTasks } from "../../../utils/taskDB";


function TasksDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getAllTasks();
      setTasks(data);
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) =>
        task.status === "completed"
    ).length;

    const pending = tasks.filter(
      (task) =>
        task.status === "pending"
    ).length;

    const rejected = tasks.filter(
      (task) =>
        task.status === "rejected"
    ).length;

    return {
      total,
      completed,
      pending,
      rejected,
    };
  }, [tasks]);

  const chartData = [
    {
      name: "Completed",
      value: stats.completed,
    },
    {
      name: "Pending",
      value: stats.pending,
    },
    {
      name: "Rejected",
      value: stats.rejected,
    },
  ];

  const completionRate =
    stats.total > 0
      ? Math.round(
          (stats.completed /
            stats.total) *
            100
        )
      : 0;

  return (
    <div className="min-h-dvh mt-12 bg-[#292929] text-white">

      <main className="p-4 max-w-3xl mx-auto">
        {/* Stats */}

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<ListTodo />}
            label="Total"
            value={stats.total}
          />

          <StatCard
            icon={<CheckCircle2 />}
            label="Completed"
            value={stats.completed}
          />

          <StatCard
            icon={<Clock3 />}
            label="Pending"
            value={stats.pending}
          />

          <StatCard
            icon={<XCircle />}
            label="Rejected"
            value={stats.rejected}
          />
        </div>

        {/* Completion */}

        <div className="mt-4 bg-[#3b3b3b] rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm">
              Completion Rate
            </span>

            <span className="font-bold">
              {completionRate}%
            </span>
          </div>

          <div className="h-2 bg-[#242424] rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all"
              style={{
                width: `${completionRate}%`,
              }}
            />
          </div>
        </div>

        {/* Pie */}

        <div className="mt-4 bg-[#3b3b3b] rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-3">
            Task Status
          </h2>

          <div className="h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#a855f7" />
                  <Cell fill="#ef4444" />
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar */}

        <div className="mt-4 bg-[#3b3b3b] rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-3">
            Overview
          </h2>

          <div className="h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={chartData}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#555"
                />

                <XAxis
                  dataKey="name"
                  stroke="#aaa"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#aaa"
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#9333ea"
                  radius={[
                    4,
                    4,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="bg-[#3b3b3b] rounded-lg p-4">
      <div className="text-gray-400">
        {icon}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        {label}
      </p>

      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

export default TasksDashboard;