// src/components/StockMonitor/StockMonitor.jsx
import { LayoutDashboard, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useStockStorage } from '../hooks/useStockStorage';
import StockDetails from '../pages/StockDetails';
import StockForm from './StockForm';
import StockTable from './StockTable';

const StockMonitor = () => {
  const { stocks, addEntry } = useStockStorage();
  const [selectedStock, setSelectedStock] = useState(null); // If null, show list. If set, show details.
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
          Stock Monitor
        </h1>
        
        {!selectedStock && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} />
            {showForm ? 'Close Form' : 'Add Daily Entry'}
          </button>
        )}
      </div>

      {/* View Switcher */}
      {selectedStock ? (
        <StockDetails
          stock={selectedStock} 
          onBack={() => setSelectedStock(null)} 
        />
      ) : (
        <div className="space-y-6">
          {showForm && <StockForm onSubmit={addEntry} onClose={() => setShowForm(false)} />}
          <StockTable stocks={stocks} onSelect={setSelectedStock} />
        </div>
      )}
    </div>
  );
};

export default StockMonitor;