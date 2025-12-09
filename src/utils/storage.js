const STORAGE_KEY = 'draw_app_saved_drawings';

export const saveDrawing = (name, dataUrl) => {
  const drawings = getDrawings();
  const newDrawing = {
    id: Date.now().toString(),
    name: name || `Drawing ${drawings.length + 1}`,
    dataUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  drawings.unshift(newDrawing);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drawings));
  
  return newDrawing;
};

export const updateDrawing = (id, dataUrl) => {
  const drawings = getDrawings();
  const index = drawings.findIndex(d => d.id === id);
  
  if (index !== -1) {
    drawings[index] = {
      ...drawings[index],
      dataUrl,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drawings));
    return drawings[index];
  }
  
  return null;
};

export const getDrawings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const getDrawingById = (id) => {
  const drawings = getDrawings();
  return drawings.find(d => d.id === id);
};

export const deleteDrawing = (id) => {
  const drawings = getDrawings();
  const filtered = drawings.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

export const renameDrawing = (id, newName) => {
  const drawings = getDrawings();
  const index = drawings.findIndex(d => d.id === id);
  
  if (index !== -1) {
    drawings[index] = {
      ...drawings[index],
      name: newName,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drawings));
    return drawings[index];
  }
  
  return null;
};

export const clearAllDrawings = () => {
  localStorage.removeItem(STORAGE_KEY);
};