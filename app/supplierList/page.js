'use client'


// components/SupplierList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [editedSupplier, setEditedSupplier] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('https://hotelback-6pw8.onrender.com/api/supplier/suppliers');
                setSuppliers(response.data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchSuppliers();
    }, []);

    const handleEdit = (supplier) => {
        setEditedSupplier(supplier);
        setIsEditModalOpen(true);
    };

    const handleDelete = (supplier) => {
        setEditedSupplier(supplier);
        setIsDeleteConfirmationModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(
                `https://hotelback-6pw8.onrender.com/api/supplier/suppliers/${editedSupplier._id}`,
                editedSupplier
            );

            // Assuming the API returns the updated supplier
            const updatedSupplier = response.data;

            // Update the state with the updated supplier
            setSuppliers((prevSuppliers) =>
                prevSuppliers.map((supplier) =>
                    supplier._id === updatedSupplier._id ? updatedSupplier : supplier
                )
            );

            // Close the edit modal
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating supplier:', error);
        }
    };

    const handleDeleteConfirmed = async () => {
        try {
            // Assuming the API returns the deleted supplier
            await axios.delete(`https://hotelback-6pw8.onrender.com/api/supplier/suppliers/${editedSupplier._id}`);

            // Update the state by removing the deleted supplier
            setSuppliers((prevSuppliers) =>
                prevSuppliers.filter((supplier) => supplier._id !== editedSupplier._id)
            );

            // Close the delete modal
            setIsDeleteConfirmationModalOpen(false);
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-lg font-semibold mb-4">List of Suppliers</h1>

            <div className="mb-4">
                <Link legacyBehavior href="/supplier">
                    <a className="text-blue-500 hover:underline">Go to Supplier Form</a>
                </Link>
            </div>

            <table className="min-w-full border border-gray-300 mt-3">
                <thead className="text-sm bg-gray-300 text-gray-700">
                    <tr>
                        <th className="p-1 border">Vendor Name</th>
                        <th className="p-1 border">Address</th>
                        <th className="p-1 border">Contact Number</th>
                        <th className="p-1 border">Email ID</th>
                        <th className="p-1 border">GST Number</th>
                        <th className="p-1 border">Opening Balance</th>
                        <th className="p-1 border">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-md font-sans font-bold">
                    {suppliers.map((supplier) => (
                        <tr key={supplier._id} className="hover:bg-gray-100">
                            <td className="pl-4 border text-left text-gray">{supplier.vendorName}</td>
                            <td className="pl-4 border text-left text-gray">{supplier.address}</td>
                            <td className="pl-4 border text-left text-gray">{supplier.contactNumber}</td>
                            <td className="pl-4 border text-left text-gray">{supplier.emailId}</td>
                            <td className="pl-4 border text-left text-gray">{supplier.gstNumber}</td>
                            <td className="pl-4 border text-left text-gray">{supplier.openingBalance}</td>
                            <td className="pl-4 border text-left text-gray">
                                <button
                                    className="text-gray mr-3 hover:bg-gray-300 font-sans focus:outline-none font-medium border border-gray-400 p-1 rounded-full px-4 text-sm"
                                    onClick={() => handleEdit(supplier)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-gray  mr-3 hover:bg-gray-300 font-sans focus:outline-none font-medium border border-gray-400 p-1  rounded-full px-4 text-sm"
                                    onClick={() => handleDelete(supplier)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            {isEditModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Modal Overlay */}
    <div className="fixed inset-0 bg-black opacity-50"></div>

    {/* Modal Content */}
    <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
      <span
        className="absolute top-0 right-0 p-4 cursor-pointer"
        onClick={() => setIsEditModalOpen(false)}
      >
        &times;
      </span>

      <h2 className="text-2xl font-bold mb-4">Edit Supplier</h2>

      {/* Edit Form */}
      <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">
        {/* Vendor Name */}
        <div className="mb-4">
          <label htmlFor="editVendorName" className="block text-sm font-medium text-gray-600">
            Vendor Name:
          </label>
          <input
            type="text"
            id="editVendorName"
            name="editVendorName"
            value={editedSupplier.vendorName}
            onChange={(e) => setEditedSupplier({ ...editedSupplier, vendorName: e.target.value })}
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="editAddress" className="block text-sm font-medium text-gray-600">
            Address:
          </label>
          <input
            type="text"
            id="editAddress"
            name="editAddress"
            value={editedSupplier.address}
            onChange={(e) => setEditedSupplier({ ...editedSupplier, address: e.target.value })}
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label htmlFor="editContactNumber" className="block text-sm font-medium text-gray-600">
            Contact Number:
          </label>
          <input
            type="text"
            id="editContactNumber"
            name="editContactNumber"
            value={editedSupplier.contactNumber}
            onChange={(e) => setEditedSupplier({ ...editedSupplier, contactNumber: e.target.value })}
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Email ID */}
        <div className="mb-4">
          <label htmlFor="editEmailId" className="block text-sm font-medium text-gray-600">
            Email ID:
          </label>
          <input
            type="text"
            id="editEmailId"
            name="editEmailId"
            value={editedSupplier.emailId}
            onChange={(e) => setEditedSupplier({ ...editedSupplier, emailId: e.target.value })}
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* GST Number */}
        <div className="mb-4">
          <label htmlFor="editGstNumber" className="block text-sm font-medium text-gray-600">
            GST Number:
          </label>
          <input
            type="text"
            id="editGstNumber"
            name="editGstNumber"
            value={editedSupplier.gstNumber}
            onChange={(e) => setEditedSupplier({ ...editedSupplier, gstNumber: e.target.value })}
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Opening Balance */}
        <div className="mb-4">
          <label htmlFor="editOpeningBalance" className="block text-sm font-medium text-gray-600">
            Opening Balance:
          </label>
          <input
            type="text"
            id="editOpeningBalance"
            name="editOpeningBalance"
            value={editedSupplier.openingBalance}
            onChange={(e) => setEditedSupplier({ ...editedSupplier, openingBalance: e.target.value })}
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Save Button */}
        <div className="col-span-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}


            {/* Delete Confirmation Modal */}
            {isDeleteConfirmationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Modal Overlay */}
                    <div className="fixed inset-0 bg-black opacity-50"></div>

                    {/* Modal Content */}
                    <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
                        <span
                            className="absolute top-0 right-0 p-4 cursor-pointer"
                            onClick={() => setIsDeleteConfirmationModalOpen(false)}
                        >
                            &times;
                        </span>

                        <h2 className="text-2xl font-bold mb-4">Delete Supplier</h2>
                        <p className="text-gray-700 mb-4">Are you sure you want to delete this supplier?</p>

                        {/* Delete Button */}
                        <button
                            onClick={handleDeleteConfirmed}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default SupplierList;
