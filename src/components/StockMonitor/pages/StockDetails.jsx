import {
    Activity,
    ArrowLeft,
    BarChart2,
    ExternalLink,
    PieChart,
    TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { getStocks } from "../hooks/useStockStorage";

const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const StockDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Get Stock Data
  const stock = getStocks().find((s) => s.id === id);

  const [chartType, setChartType] = useState("line");

  // 2. Transform Data for Recharts
  const chartData = useMemo(() => {
    if (!stock || !stock.week) return [];

    return daysOrder.map((day) => {
      const dayData = stock.week[day];
      return {
        name: day.substring(0, 3).toUpperCase(), // MON, TUE
        Peak: dayData?.peak ? Number(dayData.peak) : null,
        Start: dayData?.start ? Number(dayData.start) : null,
        End: dayData?.end ? Number(dayData.end) : null,
      };
    });
  }, [stock]);

  // 3. Calculate Stats
  const stats = useMemo(() => {
    const peaks = chartData
      .map((d) => d.Peak)
      .filter((val) => val !== null && val > 0);
    if (!peaks.length) return { max: 0, avg: 0, count: 0 };

    const total = peaks.reduce((a, b) => a + b, 0);
    return {
      max: Math.max(...peaks),
      min: Math.min(...peaks),
      avg: (total / peaks.length).toFixed(1),
      count: peaks.length,
    };
  }, [chartData]);

  if (!stock) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-xl font-bold text-slate-500">Trade not found</p>
        <button
          onClick={() => navigate("/")}
          className="btn bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  // 4. Render the selected Chart Type
  const renderChart = () => {
    // Shared Axis Configuration
    const CommonAxis = () => (
      <>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e2e8f0"
        />

        <XAxis
          dataKey="name"
          stroke="#64748b"
          tick={{ fontSize: 10 }} // Smaller font for mobile
          tickMargin={10}
          axisLine={false}
        />

        <YAxis
          stroke="#64748b"
          tick={{ fontSize: 10 }} // Smaller font for mobile
          domain={["auto", "auto"]}
          width={40} // Fixed width to prevent chart jumping
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "12px", // Smaller tooltip text
          }}
        />

        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
      </>
    );

    // Common margin settings to maximize mobile space
    const chartMargin = { top: 10, right: 10, left: 0, bottom: 0 };

    switch (chartType) {
      case "bar":
        return (
          <BarChart data={chartData} margin={chartMargin}>
            <CommonAxis />
            <Bar dataKey="Start" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Peak" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="End" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={chartData} margin={chartMargin}>
            <defs>
              <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CommonAxis />
            <Area
              type="monotone"
              dataKey="Peak"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorPeak)"
            />
          </AreaChart>
        );
      case "composed":
        return (
          <ComposedChart data={chartData} margin={chartMargin}>
            <CommonAxis />
            <Area
              type="monotone"
              dataKey="Peak"
              fill="#f1f5f9"
              stroke="#94a3b8"
            />
            <Bar dataKey="Peak" barSize={20} fill="#3b82f6" />
            <Line
              type="monotone"
              dataKey="Start"
              stroke="#ff7300"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="End"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        );
      case "line":
      default:
        return (
          <LineChart data={chartData} margin={chartMargin}>
            <CommonAxis />
            <Line
              type="monotone"
              dataKey="Start"
              stroke="#cbd5e1"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Peak"
              stroke="#2563eb"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="End"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-slate-800 text-slate-500 font-sans pb-20">
      {/* Navbar */}
      <div className="bg-slate-900 border-b border-slate-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              {stock.name}
              {/* <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                Weekly Analysis
              </span> */}
            </h1>
          </div>
          {stock.link && (
            <a
              href={stock.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-lg transition"
            >
              View on Broker <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 p-5 rounded-xl border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-300 uppercase">
                Max Peak
              </p>
              <p className="text-2xl font-bold text-slate-500">{stats.max}</p>
            </div>
            <div className="p-3 bg-green-200 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-300 uppercase">
                Average Peak
              </p>
              <p className="text-2xl font-bold text-slate-500">{stats.avg}</p>
            </div>
            <div className="p-3 bg-blue-200 text-blue-600 rounded-lg">
              <Activity size={24} />
            </div>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-300 uppercase">
                Entries
              </p>
              <p className="text-2xl font-bold text-slate-500">
                {stats.count} / 5
              </p>
            </div>
            <div className="p-3 bg-indigo-200 text-indigo-600 rounded-lg">
              <BarChart2 size={24} />
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-lg font-bold text-slate-700">Price Movement</h2>

            {/* Chart Controls */}
            <div className="flex bg-slate-800 p-1 rounded-lg">
              {[
                { id: "line", label: "Line", icon: Activity },
                { id: "bar", label: "Bar", icon: BarChart2 },
                { id: "area", label: "Area", icon: TrendingUp },
                { id: "composed", label: "Composed", icon: PieChart },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    chartType === type.id
                      ? "bg-slate-900 text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-500"
                  }`}
                >
                  <type.icon size={14} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile: 300px height, Desktop: 400px height */}
          <div className="h-[300px] sm:h-[400px] w-full -ml-4 sm:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Grid View */}
        <div className="bg-slate-900 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-700">Detailed Data Logs</h3>
          </div>
          <div className="grid grid-cols-6 bg-slate-800 text-xs font-bold text-slate-500 uppercase p-4 border-b">
            <div>Day</div>
            <div>Start Price</div>
            <div>End Price</div>
            <div>Peak Price</div>
            <div>Peak Time</div>
            <div>Status</div>
          </div>
          {daysOrder.map((day) => {
            const dayData = stock.week[day];
            const hasData = !!dayData?.peak;
            return (
              <div
                key={day}
                className="grid grid-cols-6 p-4 border-b border-slate-100 hover:bg-slate-500 text-sm text-slate-700"
              >
                <div className="font-medium capitalize">{day}</div>
                <div>{dayData?.start || "-"}</div>
                <div>{dayData?.end || "-"}</div>
                <div className="font-bold text-blue-600">
                  {dayData?.peak || "-"}
                </div>
                <div>{dayData?.peakTime || "-"}</div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      hasData
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {hasData ? "Active" : "No Data"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
