'use client'

// Assuming you have a component named GSTForm.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const GSTForm = ({ onSubmit }) => {
    const [hotel, setHotel] = useState({});
    const [gstPercentage, setGSTPercentage] = useState('');

    useEffect(() => {
        const fetchHotelAndGSTPercentage = async () => {
            try {
                // Fetch a single hotel (assuming you only need one hotel)
                const hotelsResponse = await axios.get('https://hotelback-6pw8.onrender.com/api/hotel/get-all');

                // Set the default hotel
                if (hotelsResponse.data.length > 0) {
                    setHotel(hotelsResponse.data[0]);
                }
            } catch (error) {
                console.error('Error fetching hotels:', error.message);
            }
        };

        fetchHotelAndGSTPercentage();
    }, []);

    useEffect(() => {
        const fetchGSTPercentage = async () => {
            try {
                // Fetch GST Percentage for the selected hotel
                if (hotel._id) {
                    const gstResponse = await axios.get(`https://hotelback-6pw8.onrender.com/api/hotel/get/${hotel._id}`);
                    setGSTPercentage(gstResponse.data.gstPercentage.toString()); // Assuming gstPercentage is a number
                }
            } catch (error) {
                console.error('Error fetching GST Percentage:', error.message);
            }
        };

        fetchGSTPercentage();
    }, [hotel]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (hotel._id && gstPercentage !== '') {
            try {
                await axios.patch(`https://hotelback-6pw8.onrender.com/api/hotel/gst/${hotel._id}`, {
                    gstPercentage: parseFloat(gstPercentage),
                });
                console.log('GST Percentage added successfully');
            } catch (error) {
                console.error('Error adding GST Percentage:', error.message);
            }
        }
    };

    return (
        <>
        <Navbar/>
       
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-36 ">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hotelNameInput">
                    Hotel Name:
                </label>
                <input
                    id="hotelNameInput"
                    type="text"
                    value={hotel.hotelName || ''}
                    readOnly
                    className="block appearance-none w-full border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gstPercentageInput">
                    GST Percentage:
                </label>
                <input
                    id="gstPercentageInput"
                    type="number"
                    value={gstPercentage}
                    onChange={(e) => setGSTPercentage(e.target.value)}
                    min="0"
                    className="block appearance-none w-full border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="text-center">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Submit
                </button>
            </div>
        </form>
        </>
    );
};

export default GSTForm;
