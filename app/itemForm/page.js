'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Unit from "../unit/page";
import Modal from "react-modal";
import Navbar from '../components/Navbar';

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [selectedUnitDetails, setSelectedUnitDetails] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    companyName: "",
    unit: "KG", // Initialize with 'KG' instead of an empty string
  });
  const openUnitModal = () => {
    setIsUnitModalOpen(true);
  };

  // Function to close the GST form modal
  const closeUnitModal = () => {
    setIsUnitModalOpen(false);
  };
  useEffect(() => {
    // Fetch the list of items when the component mounts
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      // Fetch the list of items
      const itemsResponse = await axios.get(
        "https://hotelback-6pw8.onrender.com/api/item/items"
      );
      setItems(itemsResponse.data);

      // Fetch the list of units
      const unitsResponse = await axios.get(
        "https://hotelback-6pw8.onrender.com/api/unit/units"
      );
      setUnits(unitsResponse.data);
    } catch (error) {
      console.error("Error fetching items and units:", error.message);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "unit") {
      // Fetch the details of the selected unit
      try {
        const unitDetailsResponse = await axios.get(
          `https://hotelback-6pw8.onrender.com/api/unit/units/${value}`
        );
        setSelectedUnitDetails(unitDetailsResponse.data); // Assuming the API returns the details of the unit
      } catch (error) {
        console.error("Error fetching unit details:", error.message);
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "unit" ? value : value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (itemToEdit) {
        // If editing, make a PUT request
        await axios.put(
          `https://hotelback-6pw8.onrender.com/api/item/items/${itemToEdit._id}`,
          formData
        );
      } else {
        // If creating, make a POST request
        await axios.post("https://hotelback-6pw8.onrender.com/api/item/items", {
          ...formData,
          unit: formData.unit || "KG", // Set a default value if it's empty
        });
      }

      // Optionally, reset the form after submission
      setFormData({
        itemName: "",
        companyName: "",
        unit: "",
      });

      // Refresh the item list after submission
      fetchItems();
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };
  const handleEditClick = (item) => {
    // Open the edit modal and set the item to edit
    setIsEditModalOpen(true);
    setItemToEdit(item);
    setFormData({
      itemName: item.itemName || "",
      companyName: item.companyName || "",
      unit: item.unit || "",
    });
  };
  const handleDelete = (itemId) => {
    // Set the item ID to be deleted and open the delete confirmation modal
    setItemIdToDelete(itemId);
    setIsDeleteConfirmationModalOpen(true);
  };

  //   const handleDelete = (supplier) => {
  //     setEditedSupplier(supplier);
  //     setIsDeleteConfirmationModalOpen(true);
  // };

  const handleDeleteConfirmed = async () => {
    try {
      // Assuming the API returns the deleted item
      await axios.delete(
        `https://hotelback-6pw8.onrender.com/api/item/items/${itemIdToDelete}`
      );

      // Update the state by removing the deleted item
      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemIdToDelete)
      );

      // Close the delete modal
      setIsDeleteConfirmationModalOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // const handleDeleteClick = async (itemId) => {
  //   try {
  //     // Make a DELETE request to delete the item
  //     await axios.delete(`https://hotelback-6pw8.onrender.com/api/item/items/${itemId}`);

  //     // Refresh the item list
  //     fetchItems();
  //   } catch (error) {
  //     console.error('Error deleting item:', error.message);
  //   }
  // };

  const handleEditSubmit = async () => {
    try {
      // Make an API request using Axios to update the item data
      await axios.put(
        `https://hotelback-6pw8.onrender.com/api/item/items/${itemToEdit._id}`,
        formData
      );

      // Update the local state with edited item data after the API call is successful
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemToEdit._id ? { ...item, ...formData } : item
        )
      );

      // Close the edit modal immediately after a successful API call
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  // const handleAddItemClick = () => {
  //   // Open the edit modal with null item (indicating a new item to create)
  //   setIsEditModalOpen(true);
  //   setItemToEdit(null);
  // };
  console.log("Units:", units);
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-16 p-4 shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-6">Items</h2>

        <form onSubmit={handleSubmit} className="mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Item Name */}
            <div className="mb-4">
              <label
                htmlFor="itemName"
                className="block text-sm font-medium text-gray-600"
              >
                Item Name:
              </label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            {/* Company Name */}
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-600"
              >
                Company Name:
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            {/* Unit */}
            <div className="mb-4">
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-600"
              >
                Unit:
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              >
                {units.map((unit) => (
                  <option key={unit._id} value={unit.unit}>
                    {unit.unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              {itemToEdit ? 'Save Changes' : 'Submit'}
            </button>
          </div>
        </form>

        {/* Item List */}
        <div className="mt-4">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Item Name</th>
                <th className="border border-gray-300 p-2">Company Name</th>
                <th className="border border-gray-300 p-2">Unit</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td className="border border-gray-300 p-2">
                    {item.itemName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.companyName}
                  </td>
                  <td className="border border-gray-300 p-2">{item.unit}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="text-gray-600 mr-3 font-sans focus:outline-none font-medium p-1 rounded-full px-2 text-sm shadow-md"
                    >
                      <FontAwesomeIcon
                            icon={faPenToSquare}
                            color="orange"

                            className="cursor-pointer"
                        />{" "}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-gray-600 mr-3 font-sans focus:outline-none font-medium p-1 rounded-full px-2 text-sm shadow-md"
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
        {/* Delete Confirmation Modal */}

        {isDeleteConfirmationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-black opacity-50"></div>

            {/* Modal Content */}
            <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
              <span
                className="absolute top-0 right-0 p-4 cursor-pointer text-3xl"
                onClick={() => setIsDeleteConfirmationModalOpen(false)}
              >
                &times;
              </span>

              <h2 className="text-2xl font-bold mb-4">Delete Item</h2>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this item?
              </p>

              {/* Delete Button */}
              <button
                onClick={handleDeleteConfirmed}
                className="border border-gray-400 hover:bg-red-500 text-gray font-bold py-2 px-4 rounded-full mr-2"
              >
                Delete
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => setIsDeleteConfirmationModalOpen(false)}
                className="border border-gray-400 text-gray font-bold py-2 px-4 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
      </div>

    </>
  );
};

export default ItemPage;