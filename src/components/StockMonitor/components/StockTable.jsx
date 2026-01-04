import { Edit3, ExternalLink, Trash2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const StockTable = ({ stocks, onEdit, onDelete }) => {
  const navigate = useNavigate();

  // Navigate to details page
  const handleRowClick = (id) => {
    navigate(`/stock/${id}`);
  };

  // Prevent navigation when clicking buttons
  const handleActionClick = (e, callback) => {
    e.stopPropagation(); 
    callback();
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="p-4 font-bold border-r border-slate-200">Instrument</th>
              {days.map((day) => (
                <th key={day} className="p-4 text-center border-r border-slate-200 w-32">
                  {day}
                </th>
              ))}
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stocks.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No trades recorded yet. Click "Add Trade" to begin.
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr
                  key={stock.id}
                  onClick={() => handleRowClick(stock.id)}
                  className="hover:bg-blue-50/50 cursor-pointer group transition-colors"
                >
                  {/* Name Column */}
                  <td className="p-4 border-r border-slate-200 bg-slate-800 sticky left-0 z-10 group-hover:bg-blue-50/50">
                    <div className="font-bold text-slate-300 flex items-center gap-2">
                      {stock.name}
                      <TrendingUp size={14} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                    {stock.link && (
                      <a
                        href={stock.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-blue-500 flex items-center gap-1 hover:underline mt-1 w-fit"
                      >
                        View Chart <ExternalLink size={10} />
                      </a>
                    )}
                  </td>

                  {/* Days Columns */}
                  {days.map((day) => {
                    const data = stock.week?.[day];
                    return (
                      <td key={day} className="p-2 border-r border-slate-200 text-center align-middle">
                        {data?.peak ? (
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-slate-300">{data.peak}</span>
                            <span className="text-[10px] text-slate-400">{data.peakTime || "-"}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Actions Column */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => handleActionClick(e, () => onEdit(stock))}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition"
                        title="Edit / Add Days"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={(e) => handleActionClick(e, () => onDelete(stock.id))}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition"
                        title="Delete Trade"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;