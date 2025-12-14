import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { encryptData } from "../../../crypto/crypto";
import { saveVault } from "../../../utils/db";
import PasswordEditor from "./PasswordEditor";

export default function VaultHome({ vault, password, onLock }) {
  const [items, setItems] = useState(vault);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [revealedId, setRevealedId] = useState(null);

  // Persist vault to IndexedDB
  const persistVault = async (updatedItems) => {
    const encrypted = await encryptData(updatedItems, password);
    await saveVault(encrypted);
  };

  // Handle save (add or update)
  const handleSave = async (item) => {
    let updated;
    
    if (editingItem) {
      // Update existing item
      updated = items.map((i) => (i.id === item.id ? item : i));
    } else {
      // Add new item
      updated = [...items, item];
    }
    
    setItems(updated);
    await persistVault(updated);
    closeEditor();
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    await persistVault(updated);
    closeEditor();
  };

  // Open editor for new or existing item
  const openEditor = (item = null) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  // Close editor and reset state
  const closeEditor = () => {
    setEditingItem(null);
    setIsEditorOpen(false);
  };

  // Toggle password visibility for an item
  const toggleReveal = (e, id) => {
    e.stopPropagation(); // Prevent opening editor
    setRevealedId(revealedId === id ? null : id);
  };

  return (
    <div className="mt-10 p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Vault</h1>
        <span className="text-dark-400 text-sm">{items.length} entries</span>
      </div>

      {/* Add New Button */}
      <button
        onClick={() => openEditor()}
        className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-3 rounded-md transition-colors font-medium"
      >
        <Plus size={18} />
        Add New Entry
      </button>

      {/* Lock Vault Button */}
      <button
        onClick={onLock}
        className="my-4 w-full text-red-500 border border-red-500 hover:bg-red-500 hover:text-white py-2 rounded-md transition-colors font-medium"
      >
        Lock Vault
      </button>

      {/* Vault Items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-10 text-dark-400">
            <p>No passwords saved yet.</p>
            <p className="text-sm mt-1">Click "Add New Entry" to get started!</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => openEditor(item)}
              className="bg-dark-700 p-4 rounded-md shadow-sm cursor-pointer hover:bg-dark-600 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Site Name */}
                  <span className="font-semibold text-white block truncate">
                    {item.site}
                  </span>
                  
                  {/* Email */}
                  {item.email && (
                    <span className="text-gray-300 text-sm block truncate">
                      {item.email}
                    </span>
                  )}
                  
                  {/* Username */}
                  {item.username && (
                    <span className="text-gray-400 text-sm block truncate">
                      @{item.username}
                    </span>
                  )}
                  
                  {/* Password (masked or revealed) */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-amber-400 font-mono text-sm">
                      {revealedId === item.id ? item.password : "••••••••"}
                    </span>
                    <button
                      onClick={(e) => toggleReveal(e, item.id)}
                      className="text-dark-400 hover:text-white text-xs transition-colors"
                    >
                      {revealedId === item.id ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                
                {/* Edit indicator */}
                <span className="text-dark-500 flex gap-1 items-center group-hover:text-amber-500 transition-colors text-sm">
                  Edit <Edit size={16} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Password Editor Modal */}
      {isEditorOpen && (
        <PasswordEditor
          initialData={editingItem}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeEditor}
        />
      )}
    </div>
  );
}