import React from 'react';
import { Palette } from 'lucide-react';

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', 
  '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#6b7280', '#78716c', '#0ea5e9', '#10b981', '#f59e0b',
  '#dc2626', '#7c3aed', '#db2777', '#059669', '#2563eb',
];

const ColorPicker = ({ color, onChange }) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Custom color picker */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-10 h-10"
          />
          <div 
            className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-inner cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: color }}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Preset colors */}
      <div className="grid grid-cols-10 gap-1.5">
        {PRESET_COLORS.map((presetColor) => (
          <button
            key={presetColor}
            onClick={() => onChange(presetColor)}
            className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${
              color === presetColor 
                ? 'border-indigo-500 ring-2 ring-indigo-200' 
                : 'border-gray-200'
            }`}
            style={{ backgroundColor: presetColor }}
            title={presetColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;