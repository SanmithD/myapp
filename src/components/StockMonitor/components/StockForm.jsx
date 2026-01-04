import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const StockForm = ({ onClose, onSubmit, editStock = null }) => {
  // If editStock exists, we are in "Edit Mode", otherwise "Add Mode"
  const [name, setName] = useState(editStock ? editStock.name : "");
  const [link, setLink] = useState(editStock ? editStock.link : "");
  
  // Default to Monday, or if editing, try to pick today's day if possible
  const [selectedDay, setSelectedDay] = useState("monday");

  // Form State for the specific day
  const [formData, setFormData] = useState({
    start: "",
    end: "",
    peak: "",
    peakTime: ""
  });

  // If editing, when day changes, pre-fill data if it exists
  useEffect(() => {
    if (editStock && editStock.week[selectedDay]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(editStock.week[selectedDay]);
    } else {
      setFormData({ start: "", end: "", peak: "", peakTime: "" });
    }
  }, [selectedDay, editStock]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return toast.error("Trade Name is required");

    // Pass data back to parent
    onSubmit({
      id: editStock?.id, // Undefined if new
      name,
      link,
      day: selectedDay,
      dayData: formData
    });

    toast.success(editStock ? "Trade Updated" : "Trade Added");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {editStock ? `Edit: ${editStock.name}` : "New Trade Entry"}
          </h2>
          <button onClick={onClose} className="hover:text-red-400 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Top Section: Name & Link */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trade Name</label>
              <input
                disabled={!!editStock} // Disable name editing if simply adding a day
                className={`w-full p-2 border rounded text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none ${editStock ? 'bg-slate-100 text-slate-500' : ''}`}
                placeholder="e.g. NIFTY 50"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            {!editStock && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chart Link</label>
                <input
                  className="w-full p-2 border rounded text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="TradingView URL"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                />
              </div>
            )}
          </div>

          <hr className="border-slate-200" />

          {/* Day Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Select Day</label>
            <select 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full p-2 border text-gray-300 rounded bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none capitalize"
            >
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Day Specific Data */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300">Start Price</label>
              <input 
                type="number" 
                className="w-full p-2 border text-gray-300 rounded" 
                value={formData.start} 
                onChange={e => handleChange("start", e.target.value)} 
              />
            </div>
            <div>
              <label className="text-xs text-slate-300">End Price</label>
              <input 
                type="number" 
                className="w-full p-2 border text-gray-300 rounded" 
                value={formData.end} 
                onChange={e => handleChange("end", e.target.value)} 
              />
            </div>
            <div>
              <label className="text-xs text-slate-300">Peak Price</label>
              <input 
                type="number" 
                className="w-full p-2 border text-gray-300 rounded" 
                value={formData.peak} 
                onChange={e => handleChange("peak", e.target.value)} 
              />
            </div>
            <div>
              <label className="text-xs text-slate-300">Peak Time</label>
              <input 
                type="time" 
                placeholder="10:30 AM"
                className="w-full p-2 border text-gray-300 rounded" 
                value={formData.peakTime} 
                onChange={e => handleChange("peakTime", e.target.value)} 
              />
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Save size={18} />
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockForm;