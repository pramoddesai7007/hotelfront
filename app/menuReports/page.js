'use client'
import React, { useState, useEffect } from 'react';

const MenuReport = () => {
  const [date, setDate] = useState('');
  const [menuName, setMenuName] = useState('');
  const [menuNames, setMenuNames] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Fetch menu names when the component mounts
    const fetchMenuNames = async () => {
      try {
        const response = await fetch('https://hotelback-6pw8.onrender.com/api/menu/menus/list');
        const menuNames = await response.json();
        setMenuNames(menuNames);
      } catch (error) {
        console.error('Error fetching menu names', error);
      }
    };

    fetchMenuNames();
  }, []);

  const getOrderReport = async () => {
    try {
      const response = await fetch(`https://hotelback-6pw8.onrender.com/api/order/orders/list/menuwise?date=${date}&menuName=${menuName}`);
      const result = await response.json();
      console.log('API Response:', result);
      setResult(result);
    } catch (error) {
      console.error('Error fetching order report', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Menu Report</h1>

      <div className="flex mb-4">
        <div className="mr-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date:</label>
          <input type="date" id="date" className="mt-1 p-2 border rounded w-40" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label htmlFor="menuName" className="block text-sm font-medium text-gray-700 ml-10">Select Menu Name:</label>
          <select id="menuName" className="mt-1 p-2 border rounded w-40 h-11 ml-10" value={menuName} onChange={(e) => setMenuName(e.target.value)}>
            {menuNames.map((menu, index) => (
              <option key={index} value={menu.name}>
                {menu.name}
              </option>
            ))}
          </select>
          <button className="bg-blue-100 text-blue-600 font-bold px-4 py-2 rounded-full ml-2 justify-end" onClick={getOrderReport}>Search</button>
   
        </div>
      </div>

     
      <div className="table-container" style={{ overflowX: 'auto' }}>
        {/* Display the table header outside the conditional rendering of data */}
        <table className="min-w-full border border-gray-300">
          <thead className="text-sm bg-gray-300 text-gray-700 sticky top-0">
            <tr>
              <th className="p-1 border">Date</th>
              <th className="p-1 border">Menu Name</th>
              <th className="p-1 border">Quantity</th>
              <th className="p-1 border">Menu Count</th>
              <th className="p-1 border">Total Amount</th>
            </tr>
          </thead>
          {/* Conditional rendering of data */}
          {result && (
            <tbody className="text-md font-sans">
              <tr>
                <td className="p-1 border">{date}</td>
                <td className="p-1 border">{menuName}</td>
                <td className="p-1 border">{result.menuCounts}</td>
                <td className="p-1 border">{result.totalQuantity}</td>
                <td className="p-1 border">{result.totalPrice}</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default MenuReport;

