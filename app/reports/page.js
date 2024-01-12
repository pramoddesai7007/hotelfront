'use client'

// pages/Orders.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Reports = () => {
  const [originalOrders, setOriginalOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/order/orders');
      const ordersWithTableNames = await Promise.all(
        response.data.map(async (order) => {
          const tableResponse = await axios.get(`http://localhost:5000/api/table/tables/${order.tableId}`);
          return {
            ...order,
            tableName: tableResponse.data.tableName || 'Unknown Table',
          };
        })
      );
      setOrders(ordersWithTableNames);
      setOriginalOrders(ordersWithTableNames);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Error fetching orders');
      setLoading(false);
    }
  };

  const calculateTotal = (fieldName) => {
    return orders.reduce((total, order) => {
      // Convert the field value to a number before adding to the total
      const fieldValue = parseFloat(order[fieldName]) || 0;
      return total + fieldValue;
    }, 0);
  };

  const handleSearch = () => {
    const filteredOrders = originalOrders.filter((order) => {
      const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
      const start = startDate || '0000-01-01';
      const end = endDate || '9999-12-31';
      return orderDate >= start && orderDate <= end;
    });

    setOrders(filteredOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePrint = () => {
    const printContent = orders.map((order) => ({
      tableName: order.tableName,
      items: order.items.map((item) => `${item.name} x ${item.quantity} - Rs.${item.price * item.quantity}`),
      total: order.total,
    }));

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);
    const dateRange = startDate && endDate ? `(${startDateFormatted} to ${endDateFormatted})` : '(All Dates)';

    const printableContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Table Reports</title>
          <style>
            @page {
              margin: 5mm; /* Adjust the margin as needed */
            }
            body {
              font-family: Arial, sans-serif;
              margin: 2px;
              padding: 0;
              margin-bottom: 5px;
              font-size: 10px; /* Adjust the font size as needed */
            }
            .report-header {
              text-align: center;
              font-size: 14px; /* Adjust the font size as needed */
              font-weight: bold;
              margin-bottom: 10px;
            }
            .date-range {
              text-align: center;
              font-size: 10px; /* Adjust the font size as needed */
              margin-bottom: 10px;
            }
            .report-content {
              margin-top: 10px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
            }
            .table th, .table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .table th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            Table Reports
          </div>
          <div class="date-range">
            Date Range: ${dateRange}
          </div>
          <div class="report-content">
            <table class="table">
              <thead>
                <tr>
                  <th>Table Name</th>
                  <th>Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${printContent.map((content, index) => `
                  <tr>
                    <td>${content.tableName}</td>
                    <td>${content.items.join('<br>')}</td>
                    <td>Total: Rs. ${content.total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert("Please allow pop-ups to print the report.");
      return;
    }

    printWindow.document.write(printableContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };







  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 p-2 bg-white rounded-md shadow-md font-sans">
        <h1 className="text-xl font-bold mb-2">Daily Order Reports</h1>
        <div className="mb-4 flex items-center">
          <label className="mr-2 text-gray-600">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md p-1 text-gray-700 text-sm"
          />
          <label className="mx-2 text-gray-600">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md  text-gray-700 p-1 text-sm"
          />
          <button
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md ml-4 hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="bg-green-500 text-white text-sm px-4 py-2 rounded-md ml-4 hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>



        {loading ? (
          <p className="text-gray-700">Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto h-[500px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className='bg-blue-500 text-white'>
                <tr>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    SR No
                  </th>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    Bill No.
                  </th>
                  {/* <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    Table
                  </th> */}
                  {/* <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    Items
                  </th> */}
                  <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    CGST
                  </th>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    SGST
                  </th>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    Cash
                  </th>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    Online
                  </th>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    Complimentary
                  </th>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    Credit Amount
                  </th>
                  <th className="px-6 py-3  text-left text-xs leading-4 font-medium  uppercase tracking-wider">
                    Grand Total(Rs.)
                  </th>

                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-1  text-sm whitespace-no-wrap border-b border-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-6 py-1 text-sm whitespace-no-wrap border-b border-gray-200">
                      {new Date(order.orderDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-1  text-sm whitespace-no-wrap border-b border-gray-200">
                      {order.orderNumber.replace(/\D/g, '')}
                         </td>

                    {/* <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {order.orderNumber}
                    </td> */}
                    {/* <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {order.tableName}
                    </td> */}
                    {/* <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <ul>
                        {order.items.map((item) => (
                          <li key={item._id}>
                            {item.quantity} x {item.name} - Rs.{item.price * item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td> */}
                    <td className="px-4 py-1 text-sm whitespace-no-wrap border-b border-gray-200">
                      {order.subtotal} Rs.
                    </td>

                    <td className="px-4 py-1 text-sm whitespace-no-wrap border-b border-gray-200">
                      {order.CGST}
                    </td>
                    <td className="px-4 py-1 text-sm whitespace-no-wrap border-b border-gray-200">
                      {order.SGST}
                    </td>


                    <td className="px-4 py-1 text-sm whitespace-no-wrap border-b border-gray-200">
                      {order.cashAmount}
                    </td>
                    <td className="px-4 py-1 text-sm whitespace-no-wrap border-b border-gray-200">
                      {order.onlinePaymentAmount}
                    </td>
                    <td className="px-4 py-1  text-sm whitespace-no-wrap border-b border-gray-200">
                      {order.complimentaryAmount}
                    </td>
                    <td className="px-6 py-1 text-sm whitespace-no-wrap border-b border-gray-200">
                      {order.dueAmount}
                    </td>
                    <td className="px-6 py-1 text-sm whitespace-no-wrap border-b border-gray-200">
                      {order.total}
                    </td>

                  </tr>
                ))}

                <tr className="bg-gray-100">
                  <td className="px-6  whitespace-no-wrap border-b border-gray-200" colSpan="3"></td>
                  <td className="px-6  whitespace-no-wrap border-b border-gray-200 font-bold">
                    Subtotal:
                  </td>
                  <td className="px-4  whitespace-no-wrap border-b border-gray-200 font-bold">
                    CGST:
                  </td>
                  <td className="px-4  whitespace-no-wrap border-b border-gray-200 font-bold">
                    SGST:
                  </td>
                  <td className="px-6  whitespace-no-wrap border-b border-gray-200 font-bold">
                    Cash:
                  </td>
                  <td className="px-4  whitespace-no-wrap border-b border-gray-200 font-bold">
                    Online:
                  </td>
                  <td className="px-4  whitespace-no-wrap border-b border-gray-200 font-bold">
                    Complimentary:
                  </td>
                  <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
                    Credit:
                  </td>
                  <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
                    Grand Total:
                  </td>
                  {/* Add more cells here if needed */}
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200" colSpan="3"></td>
                  <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
                    {calculateTotal('subtotal')} Rs.
                  </td>
                  <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
                    {calculateTotal('CGST')} Rs.
                  </td>
                  <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
                    {calculateTotal('SGST')} Rs.
                  </td>
                  <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
                    {calculateTotal('cashAmount')} Rs.
                  </td>
                  <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
                    {calculateTotal('onlinePaymentAmount')} Rs.
                  </td>
                  <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
                    {calculateTotal('complimentaryAmount')} Rs.
                  </td>
                  <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
                    {calculateTotal('dueAmount')} Rs.
                  </td>
                  <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
                    {calculateTotal('total')} Rs.
                  </td>

                  {/* <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
    Cash:
  </td>
  <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 font-bold">
    {calculateTotal('cashAmount')} Rs.
  </td> */}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Reports