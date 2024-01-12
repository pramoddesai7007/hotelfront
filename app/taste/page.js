'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const TasteList = () => {
  const [taste, setTastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaste, setNewTaste] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [selectedTaste, setSelectedTaste] = useState(null);


  useEffect(() => {
    const fetchTastes = async () => {
      try {
        const response = await axios.get('https://hotelback-6pw8.onrender.com/api/taste/tastes');
        setTastes(response.data);
      } catch (error) {
        console.error('Error fetching tastes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTastes();
  }, []);
  
//   ********

  const handleEditClick = (taste) => {
    setSelectedTaste(taste);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (taste) => {
    setSelectedTaste(taste);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Make an API request using Axios to update the taste
      await axios.patch(`https://hotelback-6pw8.onrender.com/api/taste/tastes/${selectedTaste._id}`, {
  taste: selectedTaste.taste,
});

      // Fetch the updated list of tastes
      const response = await axios.get('https://hotelback-6pw8.onrender.com/api/taste/tastes');
      setTastes(response.data);
  
      // Close the edit modal
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating taste:', error);
    }
  };
  

  const handleDeleteSubmit = async () => {
    try {
      // Make an API request using Axios to delete the taste
      await axios.delete(`https://hotelback-6pw8.onrender.com/api/taste/tastes/${selectedTaste._id}`);

      // Remove the deleted taste from the local state
      setTastes((prevTastes) => prevTastes.filter((taste) => taste._id !== selectedTaste._id));

      // Close the delete modal
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting taste:', error);
    }
  };

// ***********
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API request using Axios to post the new taste
      await axios.post('https://hotelback-6pw8.onrender.com/api/taste/tastes', { taste: newTaste });

      // Fetch the updated list of tastes
      const response = await axios.get('https://hotelback-6pw8.onrender.com/api/taste/tastes');
      setTastes(response.data);

      // Reset the new taste input field
      setNewTaste('');

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
        <h2 className='text-center font-bold'>Taste Master</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label htmlFor="newTaste" className="block text-sm font-medium text-gray-600">
              Add Taste:
            </label>
            <input
              type="text"
              id="newTaste"
              name="newTaste"
              value={newTaste}
              onChange={(e) => setNewTaste(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="col-span-2 flex justify-center mt-1">
            <button
              type="submit"
              className="bg-green-100 hover:bg-green-200 text-green-700 font-bold py-2 px-12 rounded-full"
            >
              Add Taste
            </button>
          </div>
        </form>

        {isSuccessPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Taste Added Successfully!</h2>
            </div>
          </div>
        )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto max-h-full">
          <table className="min-w-full border border-gray-300">
            <thead className="text-sm bg-gray-300 text-gray-700">
              <tr>
                <th className="p-1 border whitespace-nowrap">Taste</th>
                <th className="p-1 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-md font-sans font-semibold">
              {taste.map((taste) => (
                <tr key={taste._id} className="hover:bg-gray-100">
                  <td className="pl-4 border text-left text-gray pr-4">{taste.taste}</td>
                  <td className="pl-2 border text-left text-gray flex items-center space-x-3">
                    <button
                      className="text-gray mr-3 hover:bg-gray-300 font-sans focus:outline-none font-medium border border-gray-400 p-1 rounded-full px-4 text-sm flex mb-1 mt-1"
                      onClick={() => handleEditClick(taste)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-gray mr-3 hover:bg-gray-300 font-sans focus:outline-none font-medium border border-gray-400 p-1 rounded-full px-2 text-sm flex mb-1 mt-1"
                      onClick={() => handleDeleteClick(taste)}
                    >
                      Delete
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

              <h2 className="text-2xl font-bold mb-4">Edit Taste</h2>

              {/* Edit Form */}
              <form onSubmit={handleEditSubmit} className="mb-4">
                <div className="mb-1">
                  <label htmlFor="editTaste" className="block text-sm font-medium text-gray-600">
                    Taste:
                  </label>
                  <input
                       type="text"
                       id="editTaste"
                       name="editTaste"
                       value={selectedTaste.taste}
                       onChange={(e) => setSelectedTaste({ ...selectedTaste, taste: e.target.value })}
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

              <h2 className="text-2xl font-bold mb-4">Delete Taste</h2>
              <p className="text-gray-700 mb-4">Are you sure you want to delete this taste?</p>

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



export default TasteList;