'use client'

// components/StockOutwardForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Unit from "../unit/page";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faTimes,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import Modal from "react-modal";
import ItemPage from "../itemForm/page";
import Navbar from '../components/Navbar';

const StockOutwardForm = () => {
    const [waiterName, setWaiterName] = useState('');
    const [productName, setProductName] = useState('');
    const [stockQty, setStockQty] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [waitersList, setWaitersList] = useState([]);
    const [stockOutwardList, setStockOutwardList] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [unit, setUnit] = useState(''); // Add unit state
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    
  
    const openProductModal = () => {
        setIsProductModalOpen(true);
      };
    
      // Function to close the GST form modal
      const closeProductModal = () => {
        setIsProductModalOpen(false);
      };
    const handleAddItems = async () => {
        try {
            // Make an API call to add items to stock outward entries
            await axios.post('https://hotelback-6pw8.onrender.com/api/stockOut/stockOut/addItems', {
                waiterName,
                productName,
                stockQty,
            });

            // Make an API call to update available quantity
            await axios.post('https://hotelback-6pw8.onrender.com/api/item/items/updateQuantity', {
                productName,
                stockQty,
            });

            // After adding items and updating available quantity, fetch the updated lists
            await fetchStockOutwardList();
            await fetchProductNames();

            // Clear the input fields
            setWaiterName('');
            setProductName('');
            setStockQty('');
            setMobileNumber('');
            setUnit('');
        } catch (error) {
            console.error('Error adding items:', error.response ? error.response.data : error.message);
        }
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        try {
            if (name === 'waiterName') {
                setWaiterName(value);
                const response = await axios.get(`https://hotelback-6pw8.onrender.com/api/waiter/waiter/mobile?name=${value}`);
                setMobileNumber(response.data.mobileNumber);
            } else if (name === 'productName') {
                setProductName(value);
                const response = await axios.get(`https://hotelback-6pw8.onrender.com/api/item/items/quantity?productName=${value}`);
                setAvailableQuantity(response.data.availableQuantity);
                setUnit(response.data.unit); // Set unit
            } else if (name === 'stockQty') {
                setStockQty(value);
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    const fetchProductNames = async () => {
        try {
            const response = await axios.get('https://hotelback-6pw8.onrender.com/api/item/items');
            setProductNames(response.data);
        } catch (error) {
            console.error('Error fetching product names:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchStockOutwardList();
        fetchWaitersList();
        fetchProductNames();
    }, []);


    const fetchStockOutwardList = async () => {
        try {
            const response = await axios.get('https://hotelback-6pw8.onrender.com/api/stockOut/stockOut');
            setStockOutwardList(response.data);
        } catch (error) {
            console.error('Error fetching stock outward list:', error.response ? error.response.data : error.message);
        }
    };

    const fetchWaitersList = async () => {
        try {
            const response = await axios.get('https://hotelback-6pw8.onrender.com/api/waiter');
            setWaitersList(response.data);
        } catch (error) {
            console.error('Error fetching waiters list:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchStockOutwardList();
        fetchWaitersList();
    }, []);

    return (
        <>
        <Navbar/>
            <div className="max-w-2xl mx-auto bg-white p-2 rounded shadow-md font-sans mt-12">
                <h2 className="text-xl font-semibold mb-3">Stock Outward Form</h2>

                <div className="grid grid-cols-2 gap-3">
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-600">Waiter Name</label>
                        <select
                            name="waiterName"
                            value={waiterName}
                            onChange={handleInputChange}
                            className="mt-1 p-1 w-full border rounded-md text-sm"
                            required
                        >
                            <option value="" disabled>Select Waiter</option>
                            {waitersList.map((waiter) => (
                                <option key={waiter._id} value={waiter.waiterName}>
                                    {waiter.waiterName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
                        <input
                            type="text"
                            name="mobileNumber"
                            value={mobileNumber}
                            className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                            readOnly
                        />
                    </div>
                         
                    <div className="mb-2">
                    <Modal
              isOpen={isProductModalOpen}
              onRequestClose={closeProductModal}
              contentLabel="Product Modal"
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the overlay background color and transparency
                },
                content: {
                  width: "600px", // Set the width of the content
                  height: "600px", // Set the height of the content
                  margin: "auto", // Center the modal
                },
              }}
              >
              <div className="p-1">
                <button
                  onClick={closeProductModal}
                  className="float-right text-black"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                </button>
                <ItemPage />
              </div>
            </Modal>
                        <label className="block text-sm font-medium text-gray-600">Product Name
                        <button
                onClick={openProductModal}
                className="text-white align-middle px-1 float-right font-bold bg-red-500 text-l rounded-full"
              >
                <FontAwesomeIcon icon={faPlus} className="" />
              </button></label>
                        <select
                            name="productName"
                            value={productName}
                            onChange={handleInputChange}
                            className="mt-1 p-1 w-full border rounded-md text-sm"
                            required
                        >
                            <option value="" disabled>Select Product</option>
                            {productNames.map((productName) => (
                                <option key={productName._id} value={productName.itemName}>
                                    {productName.itemName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-600">Available Quantity</label>
                        <input
                            type="text"
                            name="availableQuantity"
                            value={`${availableQuantity} ${unit}`}
                            className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                            readOnly
                        />
                        {/* <span className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100">{unit}</span> */}
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-600">Required Quantity</label>
                        <input
                            type="text"
                            name="stockQty"
                            value={stockQty}
                            onChange={handleInputChange}
                            className="mt-1 p-1 w-full border rounded-md text-sm"
                            required
                        />
                    </div>
                </div>

                <button
                    type="button"
                    className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
                    onClick={handleAddItems}
                >
                    Add Item
                </button>

                <div className='mt-5'>
                   
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 whitespace-nowrap">SR No.</th>
                                <th className="p-3 whitespace-nowrap">Waiter Name</th>
                                <th className="p-3 whitespace-nowrap">Product Name</th>
                                <th className="p-3 whitespace-nowrap">Stock Quantity</th>
                                <th className="p-3 whitespace-nowrap">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockOutwardList.map((entry, index) => (
                                <tr key={index}
                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100 '}
                                >
                                    <td className="p-3 text-center">{index + 1}</td>
                                    <td className="p-3 text-center">{entry.waiterName}</td>
                                    <td className="p-3 text-center">{entry.productName}</td>
                                    <td className="p-3 text-center">{entry.stockQty}</td>
                                    {/* <td className="p-1 border">{new Date(entry.date).toLocaleString()}</td> */}
                                    <td className="p-3">
                                        {new Date(entry.date).toLocaleString('en-GB', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            second: 'numeric',
                                            hour12: true, // Set to true for 12-hour format

                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default StockOutwardForm;