'use client'

// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const Waiter = () => {
  const [waiters, setWaiters] = useState([]);
  const [waiterData, setWaiterData] = useState({
    waiterName: '',
    address: '',
    contactNumber: '',
  });

  const [editingWaiter, setEditingWaiter] = useState(null);

  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const response = await axios.get('https://hotelback-6pw8.onrender.com/api/waiter');
        setWaiters(response.data);
      } catch (error) {
        console.error('Error fetching waiters:', error);
      }
    };

    fetchWaiters();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWaiterData({
      ...waiterData,
      [name]: value,
    });
  };

  const handleAddWaiter = async () => {
    try {
      const response = await axios.post('https://hotelback-6pw8.onrender.com/api/waiter', waiterData);
      console.log(response);
      setWaiters([...waiters, response.data]);
      setWaiterData({
        waiterName: '',
        address: '',
        contactNumber: '',
      });
    } catch (error) {
      console.error('Error adding waiter:', error);
    }
  };

  const handleEditWaiter = async (waiterId) => {
    try {
      const response = await axios.put(`https://hotelback-6pw8.onrender.com/api/waiter/${waiterId}`, waiterData);
      const updatedWaiters = waiters.map((waiter) =>
        waiter._id === waiterId ? response.data : waiter
      );
      setWaiters(updatedWaiters);
      setWaiterData({
        waiterName: '',
        address: '',
        contactNumber: '',
      });
      setEditingWaiter(null);
    } catch (error) {
      console.error('Error editing waiter:', error);
    }
  };

  const handleDeleteWaiter = async (waiterId) => {
    try {
      await axios.delete(`https://hotelback-6pw8.onrender.com/api/waiter/${waiterId}`);
      const updatedWaiters = waiters.filter((waiter) => waiter._id !== waiterId);
      setWaiters(updatedWaiters);
    } catch (error) {
      console.error('Error deleting waiter:', error);
    }
  };

  const handleSetEditWaiter = (waiter) => {
    setWaiterData(waiter);
    setEditingWaiter(waiter._id);
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md my-8 font-sans mt-10">
      <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-left">Waiter</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Waiter Name:</label>
        <input
          type="text"
          name="waiterName"
          value={waiterData.waiterName}
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Address:</label>
        <input
          type="text"
          name="address"
          value={waiterData.address}
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Contact Number:</label>
        <input
          type="text"
          name="contactNumber"
          value={waiterData.contactNumber}
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="flex justify-between">

      {editingWaiter ? (
        <button
          onClick={() => handleEditWaiter(editingWaiter)}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring focus:border-orange-300 mr-2"
        >
          Update Waiter
        </button>
      ) : (
        <button
          onClick={handleAddWaiter}
          className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
          >
          Add Waiter
        </button>
      )}
       </div>

      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th className="p-3 text-left bg-gray-200">Waiter Name</th>
            <th className="p-3 text-left bg-gray-200">Address</th>
            <th className="p-3 text-left bg-gray-200">Contact Number</th>
            <th className="p-3 text-left bg-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {waiters.map((waiter,index) => (
            <tr key={waiter._id}
            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100 '}
            >
              <td className='p-3'>{waiter.waiterName}</td>
              <td className='p-3'>{waiter.address}</td>
              <td className='p-3'>{waiter.contactNumber}</td>
              <td>
                <button
                  onClick={() => handleSetEditWaiter(waiter)}
                  className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                  >
                  <FontAwesomeIcon
                          icon={faPenToSquare}
                          color="orange"
                          className="cursor-pointer"
                        />{" "}
                </button>
                <button
                  onClick={() => handleDeleteWaiter(waiter._id)}
                  className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                  >
                   <FontAwesomeIcon
                          icon={faTrash}
                          color="red"
                          className="cursor-pointer"
                        />{" "}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};


export default Waiter;
