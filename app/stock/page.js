"use client";

// components/PurchaseForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {

  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
const Stock = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    selectedWaiter: "", // Change the name to selectedWaiter
    pricePerQty: "",
    gst: "",
  });

  const [waiters, setWaiters] = useState([]);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [gsts, setGsts] = useState([]);

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchWaiterList = async () => {
      try {
        const response = await axios.get(
          "https://hotelback-6pw8.onrender.com/api/waiter/waiters"
        );
        setWaiters(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };

    fetchWaiterList();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://hotelback-6pw8.onrender.com/api/item/items"
        );
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchGSTList = async () => {
      try {
        const response = await axios.get("https://hotelback-6pw8.onrender.com/api/gst/list");
        setGsts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };

    fetchGSTList();
  }, []);

  useEffect(() => {
    const fetchUnitList = async () => {
      try {
        const response = await axios.get(
          "https://hotelback-6pw8.onrender.com/api/unit/units"
        );
        setUnits(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };

    fetchUnitList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddItem = () => {
    const newItem = { ...formData };
    setItems([...items, newItem]);
    setFormData({
      itemName: "",
      waiter: "",
      quantity: "",
      unit: "",
      pricePerQty: "",
      gst: "",
    });
  };

  const handleSaveAndPrint = () => {
    // Implement logic to save and print the bill
    console.log("Items:", items);
    // Reset the form and item list after saving
    setFormData({
      billNo: "",
      waiter: "",
      itemName: "",
      quantity: "",
      unit: "",
      pricePerQty: "",
      gst: "",
    });
    setItems([]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md mt-20">
      <h2 className="text-2xl font-semibold mb-6">Stock Outward</h2>

      {/* Add Item Form */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Date
            </label>
            <input
              type="text"
              name="billNo"
              value={formData.billNo}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Waiter Name
              <Link href={"/waiter"}>
                {" "}
                
                <button className="text-white align-middle px-2 float-right font-bold  bg-red-500  text-l">
                  <FontAwesomeIcon icon={faPlus} className="" />
                </button>
              </Link>
            </label>

            <select
              name="selectedWaiter" // Change the name to selectedWaiter
              value={formData.selectedWaiter}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            > 
            <option value="" disabled>
            Select Waiter Name
          </option>
             
              {waiters.map((waiter) => (
                <option key={waiter._id} value={waiter.waiter}>
                  {waiter.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Product Name
              <Link href={"/waiter"}>
                {" "}
                
                <button className="text-white align-middle px-2 float-right font-bold  bg-red-500  text-l">
                  <FontAwesomeIcon icon={faPlus} className="" />
                </button>
              </Link>
            </label>
            <select
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="" disabled>
                Select Product
              </option>
              {products.map((product) => (
                <option key={product._id} value={product.itemName}>
                  {product.itemName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Stock Quantity
            </label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Unit
              <Link href={"/unitList"}>
                {" "}
                <button className="text-white align-middle px-2 float-right font-bold  bg-red-500  text-l">
                  <FontAwesomeIcon icon={faPlus} className="" />
                </button>
              </Link>
            </label>
          

            <select
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="" disabled></option>
              {units.map((unit) => (
                <option key={unit._id} value={unit.unit}>
                  {unit.unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Main Qty
            </label>
            <input
              type="text"
              name="pricePerQty"
              value={formData.pricePerQty}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Add Item
        </button>
      </div>

      {/* Display Added Items */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Added Items</h3>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.itemName} - Quantity: {item.quantity} - Unit: {item.unit} -
              Price Per Qty: {item.pricePerQty} - GST: {item.gst}
            </li>
          ))}
        </ul>
      </div>

      {/* Save and Print Button */}
      <div>
        <button
          type="button"
          onClick={handleSaveAndPrint}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
        >
          Save and Print
        </button>
      </div>
    </div>
  );
};

export default Stock;
