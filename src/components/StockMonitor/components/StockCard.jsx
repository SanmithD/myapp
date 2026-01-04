import { ArrowRight, Edit3, ExternalLink, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StockCard = ({ stock, onEdit }) => {
  const navigate = useNavigate();

  // Calculate stats for the card
  // eslint-disable-next-line no-unused-vars
  const daysTracked = Object.keys(stock.week || {}).length;
  const latestDay = Object.keys(stock.week || {}).pop() || "None";
  const latestPrice = latestDay !== "None" ? stock.week[latestDay].end : "-";

  return (
    <div className="group bg-slate-800 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col">
      
      {/* Card Header */}
      <div className="p-5 flex justify-between items-start">
        <div>
           <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             {stock.name} 
           </h2>
           <a 
             href={stock.link} 
             target="_blank" 
             rel="noreferrer"
             className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
             onClick={(e) => e.stopPropagation()}
            >
             View Chart <ExternalLink size={10} />
           </a>
        </div>
        <div className="bg-green-50 text-green-600 p-2 rounded-lg">
            <TrendingUp size={20} />
        </div>
      </div>

      {/* Card Body / Mini Stats */}
      <div className="px-5 pb-5 space-y-2">
         <div className="flex justify-between items-end">
            <div>
                <span className="text-xs text-slate-400 font-medium uppercase">Last Close</span>
                <p className="text-2xl font-bold text-slate-700">{latestPrice}</p>
            </div>
            <div className="text-right">
                 <span className="text-xs text-slate-400 font-medium uppercase">Days Logged</span>
                 <div className="flex gap-1 mt-1">
                    {["monday", "tuesday", "wednesday", "thursday", "friday"].map((d, i) => (
                        <div 
                            key={i} 
                            title={d}
                            className={`w-2 h-6 rounded-sm ${stock.week?.[d] ? 'bg-indigo-500' : 'bg-slate-200'}`}
                        />
                    ))}
                 </div>
            </div>
         </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-auto border-t border-slate-800 p-3 flex gap-2 bg-slate-50 rounded-b-xl">
        <button 
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 py-2 rounded-lg transition"
        >
            <Edit3 size={14} /> Log Data
        </button>
        <button 
            onClick={() => navigate(`/stock/${stock.id}`)}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 py-2 rounded-lg transition shadow-md"
        >
            Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default StockCard;