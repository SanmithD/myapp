import { useEffect, useState } from "react";

const KEY = "stock-monitor-data";

export const getStocks = () => JSON.parse(localStorage.getItem(KEY)) || [];

export const useStockStorage = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStocks(getStocks());
  }, []);

  const saveAndRefresh = (newStocks) => {
    localStorage.setItem(KEY, JSON.stringify(newStocks));
    setStocks(newStocks);
  };

  const addStock = (name, link, initialDay, dayData) => {
    const newStock = {
      id: crypto.randomUUID(),
      name,
      link,
      week: {
        [initialDay]: dayData
      }
    };
    saveAndRefresh([...stocks, newStock]);
  };

  const updateStockDay = (stockId, day, dayData) => {
    const updatedStocks = stocks.map((s) => {
      if (s.id === stockId) {
        return {
          ...s,
          week: { ...s.week, [day]: dayData } // Merge new day data
        };
      }
      return s;
    });
    saveAndRefresh(updatedStocks);
  };

  const deleteStock = (id) => {
    saveAndRefresh(stocks.filter((s) => s.id !== id));
  };

  return { stocks, addStock, updateStockDay, deleteStock };
};