'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const UnitList = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newUnit, setNewUnit] = useState('');
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get('https://hotelback-6pw8.onrender.com/api/unit/units');
        setUnits(response.data);
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const handleEditClick = (unit) => {
    setSelectedUnit(unit);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (unit) => {
    setSelectedUnit(unit);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (e, updatedUnit) => {
    e.preventDefault();
  
    try {
      // Make an API request using Axios to update the unit
      await axios.patch(`https://hotelback-6pw8.onrender.com/api/unit/units/${selectedUnit._id}`, {
        unit: updatedUnit.unit, // Use 'unit' instead of 'updatedUnit.units'
      });
  
      // Update the local state after a successful edit
      setUnits((prevUnits) =>
        prevUnits.map((unit) => (unit._id === selectedUnit._id ? updatedUnit : unit))
      );
    } catch (error) {
      console.error('Error updating unit:', error);
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`https://hotelback-6pw8.onrender.com/api/unit/units/${selectedUnit._id}`);
      // Remove the deleted unit from the local state
      setUnits((prevUnits) => prevUnits.filter((unit) => unit._id !== selectedUnit._id));
    } catch (error) {
      console.error('Error deleting unit:', error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API request using Axios to post the new unit
      await axios.post('https://hotelback-6pw8.onrender.com/api/unit/units', { unit: newUnit });

      // Fetch the updated list of units
      const response = await axios.get('https://hotelback-6pw8.onrender.com/api/unit/units');
      setUnits(response.data);

      // Reset the new unit input field
      setNewUnit('');

      // Open the success popup
      setIsSuccessPopupOpen(true);

      // Close the success popup after a few seconds (e.g., 3 seconds)
      setTimeout(() => {
        setIsSuccessPopupOpen(false);
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error.message);
      // Handle the error as needed
    }
  };

  return (
    <>
    <Navbar/>
   
    <div className="max-w-lg mx-auto bg-white p-4 rounded-lg shadow-md mt-20">
    <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-400 text-left">Waiter</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label htmlFor="newUnit" className="block text-sm font-medium text-gray-600">
            Add Unit:
          </label>
          <input
            type="text"
            id="newUnit"
            name="newUnit"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="col-span-2 flex justify-center mt-1">
          <button
            type="submit"
            className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
            >
            Add Unit
          </button>
        </div>
      </form>

      {isSuccessPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal Overlay */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Modal Content */}
          <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Unit Added Successfully!</h2>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto max-h-full">
          <table className="min-w-full ">
            <thead className="text-sm bg-gray-300 text-gray-700">
              <tr>
                <th className="p-3 text-left bg-gray-200">Unit</th>
                <th className="p-3 text-left bg-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="text-md font-sans font-semibold">
              {units.map((unit,index) => (
                <tr key={unit._id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100 '}
                >
                  <td className=" p-3 text-left text-gray pr-4">{unit.unit}</td>
                  <td className=" p-3  text-center text-gray flex items-center space-x-3">
                    <button
                  className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                  onClick={() => handleEditClick(unit)}
                    >
                      <FontAwesomeIcon
                          icon={faPenToSquare}
                          color="orange"
                          className="cursor-pointer"
                        />{" "}
                    </button>
                    <button
                  className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                  onClick={() => handleDeleteClick(unit)}
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
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal Overlay */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Modal Content */}
          <div className="relative z-50 bg-white p-6 rounded-md shadow-lg w-96">
            <span
              className="absolute top-0 right-0 p-4 cursor-pointer text-3xl"
              onClick={() => setIsEditModalOpen(false)}
            >
              &times;
            </span>

            <h2 className="text-2xl font-bold mb-4">Edit Unit</h2>

            {/* Edit Form */}
            <form onSubmit={(e) => handleEditSubmit(e, selectedUnit)} className="mb-4">
              {/* units */}
              <div className="mb-1">
                <label htmlFor="editUnit" className="block text-sm font-medium text-gray-600">
                  units:
                </label>
                <input
                  type="text"
                  id="editUnit"
                  name="editUnit"
                  value={selectedUnit.unit}
                  onChange={(e) => setSelectedUnit({ ...selectedUnit, unit: e.target.value })}
                  className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-center mt-1">
    <button
      type="submit"
      className="bg-green-100 hover:bg-green-200 text-green-700 font-bold py-2 px-12 rounded-full"
    >
      Save
    </button>
  </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal Overlay */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Modal Content */}
          <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
            <span
              className="absolute top-0 right-0 p-4 cursor-pointer text-3xl"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              &times;
            </span>

            <h2 className="text-2xl font-bold mb-4">Delete Unit</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to delete this unit?</p>

            {/* Delete Button */}
            <button
              onClick={handleDeleteSubmit}
              className="border border-gray-400 hover:bg-red-500 text-gray font-bold py-2 px-4 rounded-full mr-2"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};



export default UnitList;

