import React, { useState, useCallback } from 'react';
import './ScenarioPlanningApp.css';

const initialData = [
  { step: 'Start creating', value: 69825, percentage: 100, vsPrevious: 100, originalVsPrevious: 100 },
  { step: 'Generate print', value: 33393, percentage: 47.82, vsPrevious: 47.82, originalVsPrevious: 47.82 },
  { step: 'Generate print success', value: 29312, percentage: 41.98, vsPrevious: 87.78, originalVsPrevious: 87.78 },
  { step: 'Customize band', value: 12864, percentage: 18.42, vsPrevious: 43.89, originalVsPrevious: 43.89 },
  { step: 'Choose sizes', value: 10099, percentage: 14.46, vsPrevious: 78.51, originalVsPrevious: 78.51 },
  { step: 'Order your set', value: 3896, percentage: 5.58, vsPrevious: 38.58, originalVsPrevious: 38.58 },
  { step: 'Secure your set', value: 1757, percentage: 2.52, vsPrevious: 45.10, originalVsPrevious: 45.10 },
  { step: 'Orders', value: 412, percentage: 0.59, vsPrevious: 23.45, originalVsPrevious: 23.45 },
];

const PRICE = 55;

const ScenarioPlanningApp = () => {
  const [data, setData] = useState(initialData);
  const [revenueTarget, setRevenueTarget] = useState(22660);
  const [selectedStep, setSelectedStep] = useState('');
  const [newVsPrevious, setNewVsPrevious] = useState('');

  const calculatePercentage = useCallback((value, total) => {
    return (value / total) * 100;
  }, []);

  const updateFunnel = useCallback((startValue) => {
    let updatedData = [...data];
    updatedData[0].value = startValue;
    updatedData[0].percentage = 100;

    for (let i = 1; i < updatedData.length; i++) {
      updatedData[i].value = Math.round(updatedData[i - 1].value * (updatedData[i].vsPrevious / 100));
      updatedData[i].percentage = calculatePercentage(updatedData[i].value, startValue);
    }

    return updatedData;
  }, [data, calculatePercentage]);

  const updateScenario = useCallback(() => {
    const orders = Math.ceil(revenueTarget / PRICE);
    const startCreating = Math.ceil(orders / (data[data.length - 1].percentage / 100));
    const updatedData = updateFunnel(startCreating);
    setData(updatedData);
  }, [revenueTarget, data, updateFunnel]);

  const updateStep = useCallback(() => {
    if (!selectedStep || !newVsPrevious) return;

    const stepIndex = data.findIndex(item => item.step === selectedStep);
    if (stepIndex <= 0) return;

    const newVsPreviousValue = parseFloat(newVsPrevious);
    
    if (Math.abs(data[stepIndex].vsPrevious - newVsPreviousValue) < 0.01) return;

    let updatedData = [...data];
    updatedData[stepIndex].vsPrevious = newVsPreviousValue;

    for (let i = stepIndex; i < updatedData.length; i++) {
      if (i === stepIndex) {
        updatedData[i].value = Math.round(updatedData[i - 1].value * (newVsPreviousValue / 100));
      } else {
        updatedData[i].value = Math.round(updatedData[i - 1].value * (updatedData[i].vsPrevious / 100));
      }
      updatedData[i].percentage = calculatePercentage(updatedData[i].value, updatedData[0].value);
    }

    const currentRevenue = updatedData[updatedData.length - 1].value * PRICE;
    const adjustmentFactor = revenueTarget / currentRevenue;
    const newStartValue = Math.round(updatedData[0].value * adjustmentFactor);

    updatedData = updateFunnel(newStartValue);
    setData(updatedData);

    setNewVsPrevious('');
    setSelectedStep('');
  }, [selectedStep, newVsPrevious, data, calculatePercentage, revenueTarget, updateFunnel]);

  return (
        <div className="scenario-planning-app">
      <header className="app-header">
        <img src={process.env.PUBLIC_URL + '/amby.jpg'} alt="AM By You Logo" className="app-logo" />
        <h1 className="app-title">AM By You Revenue Scenario Planning</h1>
      </header>
      <div className="control-panel">
        <div className="input-group">
          <label htmlFor="revenue-target">Revenue Target ($)</label>
          <input
            id="revenue-target"
            type="number"
            value={revenueTarget}
            onChange={(e) => setRevenueTarget(Number(e.target.value))}
            placeholder="Revenue Target"
          />
        </div>
        <button onClick={updateScenario} className="btn btn-primary">Update Scenario</button>
      </div>
      <div className="control-panel">
        <div className="input-group">
          <label htmlFor="step-select">Select Funnel Step</label>
          <select
            id="step-select"
            value={selectedStep}
            onChange={(e) => setSelectedStep(e.target.value)}
          >
            <option value="">Select funnel step</option>
            {data.map((item) => (
              <option key={item.step} value={item.step}>{item.step}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="vs-previous">New Step Conversion %</label>
          <input
            id="vs-previous"
            type="number"
            value={newVsPrevious}
            onChange={(e) => setNewVsPrevious(e.target.value)}
            placeholder="New Step Conversion %"
          />
        </div>
        <button onClick={updateStep} className="btn btn-secondary">Update Step</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Value</th>
              <th>% of Start</th>
              <th>vs. Previous</th>
              <th className="original-vs-previous">Original vs. Previous</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.step} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{item.step}</td>
                <td>{item.value.toLocaleString()}</td>
                <td>{item.percentage.toFixed(2)}%</td>
                <td>{item.vsPrevious.toFixed(2)}%</td>
                <td className="original-vs-previous">{item.originalVsPrevious.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="revenue-display">
        <h2>Revenue: ${(data[data.length - 1].value * PRICE).toLocaleString()}</h2>
      </div>
    </div>
  );
};

export default ScenarioPlanningApp;