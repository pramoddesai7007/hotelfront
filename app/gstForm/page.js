'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const GSTForm = () => {
  const [gstPercentage, setGSTPercentage] = useState('');
  const [gstList, setGSTList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);

  const handleConfirmDelete = async () => {
    try {
      // Send a delete request to the server
      await axios.delete(`https://hotelback-6pw8.onrender.com/api/gst/gst/${deletingItemId}`);
      // Fetch the updated GST list after deletion
      fetchGSTList();
    } catch (error) {
      console.error('Error deleting GST item:', error.message);
    }

    // Close the popup after deletion
    setShowDeletePopup(false);
    setDeletingItemId(null);
  };

  useEffect(() => {
    fetchGSTList();
  }, []);

  const fetchGSTList = async () => {
    try {
      const response = await axios.get('https://hotelback-6pw8.onrender.com/api/gst/list');
      setGSTList(response.data || []);
    } catch (error) {
      console.error('Error fetching GST list:', error.message);
    }
  };

  const handleInputChange = (e) => {
    setGSTPercentage(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://hotelback-6pw8.onrender.com/api/gst/create', { gstPercentage });
      fetchGSTList();
      setGSTPercentage('');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error;
        setErrorMessage(errorMessage);
        setShowModal(true);
      } else {
        console.error('Error submitting GST form:', error.message);
      }
    }
  };

  const handleDeleteClick = (itemId) => {
    setDeletingItemId(itemId);
    setShowDeletePopup(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  const handleCancelDelete = () => {
    // Cancel the delete action
    setShowDeletePopup(false);
    setDeletingItemId(null);
  };

  return (
    <>
      <Navbar />

      <div className="max-w-lg mx-auto mt-20 container shadow-md">
        <form onSubmit={handleFormSubmit} className="mb-4 flex items-center ml-3">
          <div className="mr-2">
            <label htmlFor="gstPercentage" className="block text-sm font-medium text-gray-600">
              GST Percentage:
            </label>
            <input
              type="text"
              id="gstPercentage"
              name="gstPercentage"
              value={gstPercentage}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-72 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 focus:outline-none focus:ring focus:border-blue-300 mt-5 ml-4 font-bold"
            >
              Save
            </button>
          </div>
        </form>

        <div>
          <table className="min-w-full  border border-gray-300 mb-4 mx-auto ">
            <thead className='text-base bg-zinc-100 text-yellow-700 border'>
              <tr>
                <th className="p-2">GST Percentage</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gstList.map((gst) => (
                <tr key={gst._id}>
                  <td className="p-2 text-center">{gst.gstPercentage}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDeleteClick(gst._id)}
                      className="text-gray-600  focus:outline-none font-sans font-medium p-2 py-1 rounded-full  text-sm shadow-md" style={{ background: "#ffff"}}
                    >
                      <FontAwesomeIcon icon={faTrash} color="red" className=" text-center" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md border border-red-600">
              <p className="text-red-500 mb-4">Are you sure you want to delete?</p>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 mr-2 focus:outline-none focus:ring focus:border-red-300"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
              >
                no
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Error</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  X
                </button>
              </div>
              <p className="text-red-500">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GSTForm;

