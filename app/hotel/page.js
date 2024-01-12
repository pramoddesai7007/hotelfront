'use client'


import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare,faTrash} from "@fortawesome/free-solid-svg-icons";

const CreateHotelForm = () => {
  const [formData, setFormData] = useState({
    hotelName: '',
    address: '',
    email: '',
    contactNo: '',
    gstNo: '',
    sacNo: '',
    fssaiNo: '',
    hotelLogo: null,
    qrCode: null,
  });

  const [hotels, setHotels] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // New state for success modal

  // Fetch hotels on component mount
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('https://hotelback-6pw8.onrender.com/api/hotel/get-all');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const [editFormData, setEditFormData] = useState({
    hotelName: '',
    address: '',
    email: '',
    contactNo: '',
    gstNo: '',
    sacNo: '',
    fssaiNo: '',
    hotelLogo: null,
    qrCode: null,
  });

  // State to manage whether the edit modal is open or not
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Function to open the edit modal and fetch hotel details
  const handleEdit = async (hotelId) => {
    try {
      const response = await axios.get(`https://hotelback-6pw8.onrender.com/api/hotel/get/${hotelId}`);
      const hotelDetails = response.data;

      setEditFormData(hotelDetails);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching hotel details for edit:', error);
    }
  };

  // Function to handle changes in the edit form
  const handleEditInputChange = (e) => {
    const { name, value, type, files } = e.target;

    setEditFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  // Function to handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataForUpload = new FormData();
      Object.entries(editFormData).forEach(([key, value]) => {
        formDataForUpload.append(key, value);
      });

      const response = await axios.patch(`https://hotelback-6pw8.onrender.com/api/hotel/edit/${editFormData._id}`, formDataForUpload);
      console.log('Hotel edited successfully:', response.data);

      setIsEditModalOpen(false); // Close the edit modal
      fetchHotels(); // Refresh the list after editing
    } catch (error) {
      console.error('Error editing hotel:', error);
    }
  };



  const handleDelete = async (hotelId) => {
    try {
      await axios.delete(`https://hotelback-6pw8.onrender.com/api/hotel/delete/${hotelId}`);
      console.log('Hotel deleted successfully.');
      fetchHotels(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      hotelName: '',
      address: '',
      email: '',
      contactNo: '',
      gstNo: '',
      sacNo: '',
      fssaiNo: '',
      hotelLogo: null,
      qrCode: null,
    });
  };

  // Function to handle successful hotel creation
  const handleSuccessModal = () => {
    setIsSuccessModalOpen(true);
    setTimeout(() => {
      setIsSuccessModalOpen(false);
    }, 2000); // Auto-close success modal after 3 seconds (adjust as needed)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataForUpload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataForUpload.append(key, value);
      });

      const response = await axios.post('https://hotelback-6pw8.onrender.com/api/hotel/create', formDataForUpload);
      console.log('Hotel created successfully:', response.data);

      resetForm(); // Clear form data
      fetchHotels(); // Refresh the list after successful submission
      handleSuccessModal(); // Display success modal
    } catch (error) {
      console.error('Error creating hotel:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className=" max-w-xl mx-auto bg-white p-8 rounded shadow-md font-sans mt-20">
        <h2 className="text-2xl font-semibold mb-2">Create Hotel</h2>

        {/* Hotel Name */}

        <div className="flex ">
          <div className="mb-2 mr-4">
            <label className="block text-sm font-medium text-gray-600">Resturant Name
              <span className='text-red-500'>*</span>
            </label>
            <input
              id="hotelNameInput" // Add an ID for easy reference
              type="text"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Address
              <span className='text-red-500'>*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
        </div>

        
        {/* Email */}
        <div className="flex">
          <div className="mb-2 mr-4">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>

          {/* Contact No. */}
          <div className="mb-4 ">
            <label className="block text-sm font-medium text-gray-600">Contact No.
              <span className='text-red-500'>*</span>
            </label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
        </div>
        {/* GST No. */}
        <div className="flex">
          <div className="mb-2 mr-4">
            <label className="block text-sm font-medium text-gray-600">GST No.</label>
            <input
              type="text"
              name="gstNo"
              value={formData.gstNo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* SAC No. */}
          <div className="mb-2 mr-4">
            <label className="block text-sm font-medium text-gray-600">SAC No.</label>
            <input
              type="text"
              name="sacNo"
              value={formData.sacNo}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>

          {/* FSSAI No. */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">FSSAI No.</label>
            <input
              type="text"
              name="fssaiNo"
              value={formData.fssaiNo}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
        </div>
        {/* Hotel Logo */}
        <div className="flex">
          <div className="mb-2 mr-4">
            <label className="block text-sm font-medium text-gray-600">Hotel Logo</label>
            <input
              type="file"
              name="hotelLogo"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* QR Code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">QR Code</label>
            <input
              type="file"
              name="qrCode"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-72 bg-yellow-400 text-white font-bold py-2 px-4 rounded-md mb-4"
            onClick={handleSubmit}
          >
            Create Hotel
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">

          <table className="min-w-full mt-4">
            <thead className="text-sm bg-zinc-100 text-yellow-600 border">
              <tr>
                <th className=" p-2 whitespace-nowrap text-center">Hotel Name</th>
                <th className=" p-2">Address</th>
                <th className=" p-2">Email</th>
                <th className=" p-2">Contact No.</th>
                <th className=" p-2">GST No.</th>
                <th className=" p-2">SAC No.</th>
                <th className=" p-2">FSSAI No.</th>
                <th className=" p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel._id}>
                  <td className="text-center p-2 whitespace-nowrap">{hotel.hotelName}</td>
                  <td className="text-center p-2 whitespace-nowrap">{hotel.address}</td>
                  <td className="text-center p-2">{hotel.email}</td>
                  <td className="text-center p-2">{hotel.contactNo}</td>
                  <td className="text-center p-2">{hotel.gstNo}</td>
                  <td className="text-center p-2">{hotel.sacNo}</td>
                  <td className="text-center p-2">{hotel.fssaiNo}</td>
                  <td className="text-center p-2">
                    <td className="py-1 text-center flex">
                      <button
                        className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                        onClick={() => handleEdit(hotel._id)}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          color="orange"

                          className="cursor-pointer"
                        />{" "}

                      </button>
                      <button
                        className="text-gray-600 mr-3 font-sans focus:outline-none font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                        onClick={() => handleDelete(hotel._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          color="red"
                          className="cursor-pointer"
                        />{" "}

                      </button>
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-base font-semibold mb-4">Edit Hotel</h2>
            <form onSubmit={handleEditSubmit}>
              {/* Hotel Name */}

              <div className="mb-2 ">
                <label className="block text-sm font-medium text-gray-600 whitespace-nowrap">Hotel Name</label>
                <input
                  type="text"
                  name="hotelName"
                  value={editFormData.hotelName}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Address */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Email */}
              <div className="flex">
                <div className="mb-2 mr-4">
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                {/* Contact No. */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Contact No.</label>
                  <input
                    type="text"
                    name="contactNo"
                    value={editFormData.contactNo}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              {/* GST No. */}
              <div className="flex">
                <div className="mb-2 mr-4">
                  <label className="block text-sm font-medium text-gray-600">GST No.</label>
                  <input
                    type="text"
                    name="gstNo"
                    value={editFormData.gstNo}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                {/* SAC No. */}

                <div className="mb-2 mr-4">
                  <label className="block text-sm font-medium text-gray-600">SAC No.</label>
                  <input
                    type="text"
                    name="sacNo"
                    value={editFormData.sacNo}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                {/* FSSAI No. */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600">FSSAI No.</label>
                  <input
                    type="text"
                    name="fssaiNo"
                    value={editFormData.fssaiNo}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="flex">
                {/* Hotel Logo */}
                <div className="mb-2 mr-4">
                  <label className="block text-sm font-medium text-gray-600">Hotel Logo</label>
                  <input
                    type="file"
                    name="hotelLogo"
                    accept="image/*"
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                {/* QR Code */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600">QR Code</label>
                  <input
                    type="file"
                    name="qrCode"
                    accept="image/*"
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <button type="submit" className="ml-36 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
                Save Changes
              </button>
              <button onClick={() => setIsEditModalOpen(false)} className="ml-28 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
                Cancel
              </button>
            </form>

          </div>
        </div>
      )}
      {isSuccessModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-base font-semibold mb-4 text-green-600">Hotel Created Successfully!</h2>
            {/* You can customize the success message here */}
          </div>
        </div>
      )}
    </>
  );
};

export default CreateHotelForm;