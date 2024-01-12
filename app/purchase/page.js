"use client";

// components/PurchaseForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";

import UnitList from "../unit/page";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faTimes,
  faXmark,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import Modal from "react-modal";
import ItemPage from "../itemForm/page";
import SupplierForm from "../supplier/page";
import GSTForm from "../gstForm/page";
import Navbar from "../components/Navbar";

const PurchaseForm = () => {
  const [itemTotals, setItemTotals] = useState({});
  const [lastItemIndex, setLastItemIndex] = useState(-1);
  const [stockQty, setStockQty] = useState("");
  const [discount, setDiscount] = useState(""); // Step 1
  const [grandTotal, setGrandTotal] = useState(""); // New state for grand total
  const [gst, setGst] = useState(0);
  const [isGSTModalOpen, setIsGSTModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);

  const [currentItemGst, setCurrentItemGst] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [itemIndexToDelete, setItemIndexToDelete] = useState(null);

  const handleDeleteClick = (index) => {
    setItemIndexToDelete(index);
    setShowPopup(true);
  };

  const handleConfirmDelete = () => {
    // Implement your delete logic here using the itemIndexToDelete
    // ...

    // After deleting, close the popup
    setShowPopup(false);
  };

  const handleCancelDelete = () => {
    // Cancel the delete operation and close the popup
    setShowPopup(false);
  };

  const handleEditItem = (index) => {
    // Set the form data with the values of the selected item for editing
    const selectedItem = items[index];
    setFormData({
      ...selectedItem,
      gst: selectedItem.gst.toString(), // Convert gst to string for the select input
    });

    // Remove the selected item from the items array
    const updatedItems = [...items.slice(0, index), ...items.slice(index + 1)];
    setItems(updatedItems);

    // Recalculate item totals
    const updatedItemTotals = { ...itemTotals };
    delete updatedItemTotals[selectedItem.itemName];
    setItemTotals(updatedItemTotals);
  };

  const handleDeleteItem = (index) => {
    // Remove the selected item from the items array
    const updatedItems = [...items.slice(0, index), ...items.slice(index + 1)];
    setItems(updatedItems);

    // Recalculate item totals
    const updatedItemTotals = { ...itemTotals };
    delete updatedItemTotals[items[index].itemName];
    setItemTotals(updatedItemTotals);
  };

  // Function to open the GST form modal
  const openGSTModal = () => {
    setIsGSTModalOpen(true);
  };

  // Function to close the GST form modal
  const closeGSTModal = () => {
    setIsGSTModalOpen(false);
  };

  const openUnitModal = () => {
    setIsUnitModalOpen(true);
  };

  // Function to close the GST form modal
  const closeUnitModal = () => {
    setIsUnitModalOpen(false);
  };

  const openProductModal = () => {
    setIsProductModalOpen(true);
  };

  // Function to close the GST form modal
  const closeProductModal = () => {
    setIsProductModalOpen(false);
  };

  const openVendorModal = () => {
    setIsVendorModalOpen(true);
  };

  // Function to close the GST form modal
  const closeVendorModal = () => {
    setIsVendorModalOpen(false);
  };
  const [formData, setFormData] = useState({
    billNo: "",
    date: getCurrentDate(),
    vendor: "",
    itemName: "",
    quantity: "",
    unit: "",
    pricePerQty: "",
    gst: 0,
    gstAmount: "",
    paidAmount: "",
  });

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [gsts, setGsts] = useState([]);
  const [items, setItems] = useState([]);

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    // Fetch stock quantity for the selected product
    const fetchStockQty = async () => {
      try {
        const response = await axios.get(
          `https://hotelback-6pw8.onrender.com/api/purchase/purchase/stockQty?itemName=${formData.itemName}`
        );
        console.log("stock Quantity", response.data.stockQty);
        setStockQty(response.data.stockQty);
      } catch (error) {
        console.error("Error fetching stock quantity:", error);
      }
    };

    if (formData.itemName) {
      fetchStockQty();
    }
  }, [formData.itemName]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          "https://hotelback-6pw8.onrender.com/api/supplier/suppliers"
        );
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };
    fetchVendors();
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

  useEffect(() => {
    const subtotal = Object.values(itemTotals).reduce(
      (total, itemTotal) => total + (itemTotal || 0),
      0
    );
    const discountAmount = parseFloat(discount) || 0;
    const calculatedGrandTotal = subtotal - discountAmount;

    setGrandTotal(calculatedGrandTotal.toFixed(2));
  }, [itemTotals, discount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "discount") {
      setDiscount(value);
    } else if (name === "paidAmount") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value !== undefined ? value : "",
      }));
    } else if (name === "gst") {
      // Update GST amount for the current item
      const selectedProduct = products.find(
        (product) => product.itemName === formData.itemName
      );
      const gstPercentage = parseFloat(value); // Convert GST percentage to a float

      if (selectedProduct && !isNaN(gstPercentage)) {
        const gstAmount =
          (parseFloat(formData.quantity) *
            parseFloat(formData.pricePerQty) *
            gstPercentage) /
          100;
        setCurrentItemGst(gstAmount);
      } else {
        setCurrentItemGst(0); // Set GST amount to 0 if there is an issue with GST percentage
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        gst: value !== undefined ? value : 0, // Set default GST to 0 if not selected
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    console.log("Updated itemName:", formData.itemName);
  };

  useEffect(() => {
    const newItemTotal = calculateItemTotal(formData);
    setItemTotals((prevItemTotals) => ({
      ...prevItemTotals,
      [formData.itemName]: newItemTotal,
    }));
  }, [formData, discount]);

  const handleAddItem = () => {
    // Check if the GST percentage is 0
    if (parseFloat(formData.gst) === 0) {
      // GST is 0, proceed to add the item without checking other required fields
      const newItem = createNewItem({
        ...formData,
        gst: 0, // Set GST to 0
        gstAmount: 0, // Set GST amount to 0
      });

      // Update state
      setItems((prevItems) => [...prevItems, newItem]);
      setFormData({
        date: formData.date,
        billNo: formData.billNo,
        vendor: formData.vendor,
        itemName: "",
        quantity: "",
        unit: "",
        pricePerQty: "",
        gst: "", // Reset GST in the form
        gstAmount: "", // Reset GST amount in the form
        paidAmount: "",
      });
      setLastItemIndex((prevLastItemIndex) => prevLastItemIndex + 1);

      // Do not update overall GST amount here
      // It will be handled outside this function
    } else {
      // GST is not 0, perform the validation for required fields
      // Validate that all required fields are filled
      if (
        !formData.billNo ||
        !formData.date ||
        !formData.vendor ||
        !formData.itemName ||
        !formData.quantity ||
        !formData.unit ||
        !formData.pricePerQty ||
        !formData.gst
      ) {
        console.error("Please fill in all required fields.");
        return;
      }

      // Calculate GST amount for the current item
      const gstPercentage = parseFloat(formData.gst);
      const gstAmount =
        (parseFloat(formData.quantity) *
          parseFloat(formData.pricePerQty) *
          gstPercentage) /
        100;

      // Create a new item object
      const newItem = createNewItem({
        ...formData,
        gst: gstPercentage, // Use GST as GST percentage
        gstAmount: gstAmount.toFixed(2), // Store GST amount in the item
      });

      // Update state
      setItems((prevItems) => [...prevItems, newItem]);
      setFormData({
        date: formData.date,
        billNo: formData.billNo,
        vendor: formData.vendor,
        itemName: "",
        quantity: "",
        unit: "",
        pricePerQty: "",
        gst: "", // Reset GST in the form
        gstAmount: "", // Reset GST amount in the form
        paidAmount: "",
      });
      setLastItemIndex((prevLastItemIndex) => prevLastItemIndex + 1);

      // Do not update overall GST amount here
      // It will be handled outside this function
    }
  };

  // Helper function to create a new item object
  const createNewItem = (formData) => ({
    billNo: formData.billNo,
    date: formData.date,
    vendor: formData.vendor,
    itemName: formData.itemName,
    quantity: formData.quantity,
    unit: formData.unit,
    pricePerQty: formData.pricePerQty,
    gst: formData.gst,
    gstAmount: formData.gstAmount,
  });

  const calculateItemTotal = (item) => {
    const subtotal = parseFloat(item.quantity) * parseFloat(item.pricePerQty);
    const itemGst = parseFloat(item.gst);
    const gstAmount = (subtotal * itemGst) / 100;

    return subtotal + gstAmount;
  };

  const handleSaveAndPrint = async () => {
    try {
      // Calculate the GST amount based on the individual items
      const calculatedGst = parseFloat(gst).toFixed(2); // Use calculated GST
      const calculatedSubtotal = parseFloat(
        Object.values(itemTotals)
          .reduce((total, itemTotal) => total + (itemTotal || 0), 0)
          .toFixed(2)
      );
      const calculatedBalance = (
        parseFloat(grandTotal) - parseFloat(formData.paidAmount || 0)
      ).toFixed(2);

      const formattedItems = items.map((item) => ({
        productName: item.itemName,
        quantity: parseFloat(item.quantity),
        unit: item.unit,
        pricePerQty: parseFloat(item.pricePerQty),
      }));

      const data = {
        date: formData.date || "",
        billNo: formData.billNo || "",
        vendor: formData.vendor || "",
        subtotal: isNaN(calculatedSubtotal) ? 0 : calculatedSubtotal,
        gst: isNaN(calculatedGst) ? 0 : calculatedGst,
        gstAmount: parseFloat(currentItemGst).toFixed(2), // Use currentItemGst
        paidAmount: parseFloat(formData.paidAmount || 0).toFixed(2),
        discount: parseFloat(discount || 0).toFixed(2),
        items: formattedItems,
        balance: calculatedBalance, // Include balance in the data
      };

      // Log the data to be saved
      console.log("Data to be saved:", data);

      // Make a POST request to save the bill
      const response = await axios.post(
        "https://hotelback-6pw8.onrender.com/api/purchase/purchase/savebill",
        data
      );

      // Log the response after saving
      console.log("Bill saved successfully:", response.data);

      // Reset the form and item list after saving
      setFormData({
        billNo: "",
        date: "",
        vendor: "",
        itemName: "",
        quantity: "",
        unit: "",
        pricePerQty: "",
        gst: "",
        gstAmount: "",
        paidAmount: "",
      });
      setItems([]);
      setItemTotals({});
      setGst(0); // Reset the GST amount
      setCurrentItemGst(0); // Reset currentItemGst

      // Show success popup
      setShowSuccessPopup(true);
      // Hide duplicate popup if it was shown before
      setShowDuplicatePopup(false);

      // Automatically close success popup after 3 seconds (adjust duration as needed)
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Error saving the bill:",
        error.response ? error.response.data : error.message
      );

      // Show duplicate popup if duplicate bill number error occurs
      if (error.response && error.response.status === 400) {
        setShowDuplicatePopup(true);

        // Automatically close duplicate popup after 3 seconds (adjust duration as needed)
        setTimeout(() => {
          setShowDuplicatePopup(false);
        }, 3000);
      }
      // Hide success popup if it was shown before
      setShowSuccessPopup(false);
    }
  };

  useEffect(() => {
    if (lastItemIndex !== -1) {
      // Initialize itemTotals with empty objects for each item in items array
      const initialItemTotals = items.reduce((totals, item) => {
        totals[item.itemName] = calculateItemTotal(item);
        return totals;
      }, {});
      setItemTotals(initialItemTotals);
      setLastItemIndex(-1); // Reset lastItemIndex
    }
  }, [items, lastItemIndex]);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow-md font-sans mt-10">
        <h2 className="text-2xl font-semibold mb-6">Purchase Bill Form</h2>

        {/* Add Item Form */}
        <div className="mb-5 ">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={getCurrentDate()}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Bill Number
              </label>
              <input
                type="text"
                name="billNo"
                value={formData.billNo}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              />
            </div>
            <div>
              <Modal
                isOpen={isVendorModalOpen}
                onRequestClose={closeVendorModal}
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
                <button
                  className="float-right text-black"
                  // onClick={closeVendorModal}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1 top-3 right-3 absolute" />

                  <SupplierForm />
                </button>
              </Modal>
              <label className="block text-sm font-medium text-gray-600">
                Vendor Name
                <button
                  onClick={openVendorModal}
                  className="text-white align-middle px-1 float-right font-bold bg-red-500 text-l rounded-full"
                >
                  <FontAwesomeIcon icon={faPlus} className="" />
                </button>
              </label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              >
                <option value="" disabled>
                  Select Vendor
                </option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor.vendorName}>
                    {vendor.vendorName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {showSuccessPopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-green-100 border border-green-400 rounded shadow-md z-10">
                  <p className="text-green-700">Bill saved successfully!</p>
                </div>
              )}

              {showDuplicatePopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-red-100 border border-red-400 rounded shadow-md z-10">
                  <p className="text-red-700">
                    Duplicate bill number! Please choose a different bill
                    number.
                  </p>
                </div>
              )}
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
              <label className="block text-sm font-medium text-gray-600">
                Product Name
                <button
                  onClick={openProductModal}
                  className="text-white align-middle px-1 float-right font-bold bg-red-500 text-l rounded-full"
                >
                  <FontAwesomeIcon icon={faPlus} className="" />
                </button>
              </label>
              <select
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
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
                value={stockQty}
                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              />
            </div>

            <Modal
              isOpen={isUnitModalOpen}
              onRequestClose={closeUnitModal}
              contentLabel="Unit Modal"
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the overlay background color and transparency
                },
                content: {
                  width: "600px", // Set the width of the content
                  height: "500px", // Set the height of the content
                  margin: "auto", // Center the modal
                },
              }}
            >
              <div className="p-1">
                <button
                  onClick={closeUnitModal}
                  className="float-right text-black"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                </button>
                <UnitList />
              </div>
            </Modal>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Unit
                <button
                  onClick={openUnitModal}
                  className="text-white align-middle px-1 float-right font-bold bg-red-500 text-l rounded-full"
                >
                  <FontAwesomeIcon icon={faPlus} className="" />
                </button>
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              >
                <option value="" disabled>
                  Select Unit
                </option>
                {units.map((unit) => (
                  <option key={unit._id} value={unit.unit}>
                    {unit.unit}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Price Per Unit
              </label>
              <input
                type="text"
                name="pricePerQty"
                value={formData.pricePerQty}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              />
            </div>
            <div>
              <Modal
                isOpen={isGSTModalOpen}
                onRequestClose={closeGSTModal}
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
                    onClick={closeGSTModal}
                    className="float-right text-black"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-1" />
                  </button>
                  <GSTForm />
                </div>
              </Modal>
              GST
              <button
                onClick={openGSTModal}
                className="text-white align-middle px-1 float-right font-bold bg-red-500 text-l rounded-full"
                >
                <FontAwesomeIcon icon={faPlus} className="" />
              </button>
              <select
                name="gst"
                value={formData.gst}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              >
                <option value="" disabled>
                  Select GST
                </option>
                {gsts.map((gst) => (
                  <option key={gst._id} value={gst.gstPercentage}>
                    {gst.gstPercentage}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                GST Amount
              </label>
              <input
                type="text"
                value={currentItemGst.toFixed(2)}
                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Total for {formData.itemName}
              </label>
              <input
                type="text"
                value={
                  itemTotals[formData.itemName]
                    ? itemTotals[formData.itemName].toFixed(2)
                    : "0.00"
                }
                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                readOnly
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
        <div className="flex">
          <div className="flex-1 mr-4">
            <h3 className="text-xl font-semibold mb-4">Added Items</h3>
            <table className="w-full -collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3  whitespace-nowrap">Sr No.</th>
                  <th className="p-3  whitespace-nowrap">Item Name</th>
                  <th className="p-3  whitespace-nowrap">Quantity</th>
                  <th className="p-3  whitespace-nowrap">Unit</th>
                  <th className="p-3  whitespace-nowrap">Price Per Qty</th>
                  <th className="p-3  whitespace-nowrap">GST</th>
                  <th className="p-3  whitespace-nowrap">Total</th>{" "}
                  <th className="p-3  whitespace-nowrap">Actions</th>
                  {/* New column for total */}
                  {/* Add more columns for other item details */}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-1  text-center">{index + 1}</td>
                    <td className="p-1  text-center">{item.itemName}</td>
                    <td className="p-1  text-center">{item.quantity}</td>
                    <td className="p-1  text-center">{item.unit}</td>
                    <td className="p-1  text-center">{item.pricePerQty}</td>
                    <td className="p-1  text-center">{item.gst}</td>
                    <td className="p-1  text-center">{calculateItemTotal(item).toFixed(2)}
                    </td>
                    <td className="p-1  text-center">
                      <button
                        onClick={() => handleEditItem(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          color="orange"
                          className="cursor-pointer"
                        />{" "}


                      </button>
                    </td>
                    <td className="p-1  text-center">
                      <button
                        onClick={() => handleDeleteClick(index)}
                        className="text-red-500 hover:text-red-700"
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
                {showPopup && (
                  <div className="popup">
                    <div className="popup-content">
                      <p>Are you sure you want to delete?</p>
                      <button onClick={handleConfirmDelete}>Yes</button>
                      <button onClick={handleCancelDelete}>No</button>
                    </div>
                  </div>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex-1">
            <div className="mt-4 container">
              <label className="block text-sm font-medium text-gray-600">
                SubTotal
              </label>
              <input
                type="text"
                value={Object.values(itemTotals)
                  .reduce((total, itemTotal) => total + (itemTotal || 0), 0)
                  .toFixed(2)}
                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                readOnly
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">
                Discount
              </label>
              <input
                type="text"
                name="discount"
                value={discount}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">
                Grand Total
              </label>
              <input
                type="text"
                value={grandTotal}
                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                readOnly
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">
                Paid Amount
              </label>
              <input
                type="text"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
              />
            </div>

            {/* Balance */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">
                Balance
              </label>
              <input
                type="text"
                // value={(parseFloat(Object.values(itemTotals).reduce((total, itemTotal) => total + (itemTotal || 0), 0).toFixed(2)) - parseFloat(formData.discount || 0) - parseFloat(formData.paidAmount || 0)).toFixed(2)}
                value={(
                  parseFloat(grandTotal) - parseFloat(formData.paidAmount || 0)
                ).toFixed(2)}
                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                readOnly
              />
            </div>
            {/* Save and Print Button */}
            <div>
              <button
                type="button"
                onClick={handleSaveAndPrint}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
              >
                Save Bill
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseForm;