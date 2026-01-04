import { LayoutDashboard, Plus } from "lucide-react";
import { useState } from "react";
import StockForm from "../components/StockForm";
import StockTable from "../components/StockTable";
import { useStockStorage } from "../hooks/useStockStorage";

const StockList = () => {
  const { stocks, addStock, updateStockDay, deleteStock } = useStockStorage();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);

  // Trigger "Add New"
  const handleAddNew = () => {
    setEditingStock(null);
    setIsModalOpen(true);
  };

  // Trigger "Edit" (passed to table)
  const handleEdit = (stock) => {
    setEditingStock(stock);
    setIsModalOpen(true);
  };

  // Handle Form Submit (handles both add and update logic)
  const handleFormSubmit = (formData) => {
    if (formData.id) {
      // Logic for updating specific day of existing stock
      updateStockDay(formData.id, formData.day, formData.dayData);
    } else {
      // Logic for creating new stock with initial day
      addStock(formData.name, formData.link, formData.day, formData.dayData);
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-slate-800 text-slate-900 font-sans">
      {/* Top Navbar */}
      <div className="bg-slate-800 border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2 text-slate-300">
            <LayoutDashboard className="text-blue-600" />
            Trade Monitor
          </h1>
          <button 
            onClick={handleAddNew} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            Add Trade
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats or summary could go here */}
        
        <div className="mt-4">
          <StockTable 
            stocks={stocks} 
            onEdit={handleEdit} 
            onDelete={deleteStock} 
          />
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <StockForm 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleFormSubmit}
          editStock={editingStock}
        />
      )}
    </div>
  );
};

export default StockList;