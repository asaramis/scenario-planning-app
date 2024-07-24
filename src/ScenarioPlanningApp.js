import React, { useState, useCallback } from 'react';

const initialData = [
  { step: 'Start creating', value: 69825, percentage: 100 },
  { step: 'Generate print', value: 33393, percentage: 47.82 },
  { step: 'Generate print success', value: 29312, percentage: 41.98 },
  { step: 'Customize band', value: 12864, percentage: 18.42 },
  { step: 'Choose sizes', value: 10099, percentage: 14.46 },
  { step: 'Order your set', value: 3896, percentage: 5.58 },
  { step: 'Secure your set', value: 1757, percentage: 2.52 },
  { step: 'Orders', value: 412, percentage: 0.59 },
];

const PRICE = 55;

const ScenarioPlanningApp = () => {
  const [data, setData] = useState(initialData);
  const [revenueTarget, setRevenueTarget] = useState(22660);
  const [selectedStep, setSelectedStep] = useState('');
  const [newPercentage, setNewPercentage] = useState('');

  const calculateVsPrevious = useCallback((currentValue, previousValue) => {
    return previousValue ? (currentValue / previousValue) * 100 : 100;
  }, []);

  const updateScenario = useCallback(() => {
    const orders = Math.ceil(revenueTarget / PRICE);
    const startCreating = Math.ceil(orders / (initialData[initialData.length - 1].percentage / 100));
    
    const updatedData = initialData.map((item, index, array) => {
      const value = Math.round(startCreating * (item.percentage / 100));
      const previousValue = index > 0 ? array[index - 1].value : null;
      const vsPrevious = calculateVsPrevious(value, previousValue);
      return { ...item, value, vsPrevious };
    });

    setData(updatedData);
  }, [revenueTarget, calculateVsPrevious]);

  const updateStep = useCallback(() => {
    if (!selectedStep || !newPercentage) return;

    const updatedData = data.map((item) => 
      item.step === selectedStep ? { ...item, percentage: parseFloat(newPercentage) } : item
    );

    const startCreating = updatedData[0].value;
    const finalData = updatedData.map((item, index, array) => {
      const value = Math.round(startCreating * (item.percentage / 100));
      const previousValue = index > 0 ? array[index - 1].value : null;
      const vsPrevious = calculateVsPrevious(value, previousValue);
      return { ...item, value, vsPrevious };
    });

    setData(finalData);
    setRevenueTarget(finalData[finalData.length - 1].value * PRICE);
  }, [selectedStep, newPercentage, data, calculateVsPrevious]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Scenario Planning Mini-App</h2>
      <div className="mb-4">
        <input
          type="number"
          value={revenueTarget}
          onChange={(e) => setRevenueTarget(Number(e.target.value))}
          placeholder="Revenue Target"
          className="mr-2 p-2 border rounded"
        />
        <button onClick={updateScenario} className="p-2 bg-blue-500 text-white rounded">Update Scenario</button>
      </div>
      <div className="mb-4">
        <select
          value={selectedStep}
          onChange={(e) => setSelectedStep(e.target.value)}
          className="mr-2 p-2 border rounded"
        >
          <option value="">Select step</option>
          {data.map((item) => (
            <option key={item.step} value={item.step}>{item.step}</option>
          ))}
        </select>
        <input
          type="number"
          value={newPercentage}
          onChange={(e) => setNewPercentage(e.target.value)}
          placeholder="New percentage"
          className="mr-2 p-2 border rounded"
        />
        <button onClick={updateStep} className="p-2 bg-green-500 text-white rounded">Update Step</button>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Step</th>
            <th className="border p-2">Value</th>
            <th className="border p-2">% of Start</th>
            <th className="border p-2">vs. Previous</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.step}>
              <td className="border p-2">{item.step}</td>
              <td className="border p-2">{item.value.toLocaleString()}</td>
              <td className="border p-2">{item.percentage.toFixed(2)}%</td>
              <td className="border p-2">
                {index === 0 ? '100.00%' : `${item.vsPrevious.toFixed(2)}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Revenue: ${(data[data.length - 1].value * PRICE).toLocaleString()}</h3>
      </div>
    </div>
  );
};

export default ScenarioPlanningApp;