'use client'

// ACForm.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ACForm = ({ onSubmit }) => {
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [acPercentage, setACPercentage] = useState('');

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get('https://hotelback-6pw8.onrender.com/api/section');
                setSections(response.data);
                if (response.data.length > 0) {
                    setSelectedSection(response.data[0]._id);
                }
            } catch (error) {
                console.error('Error fetching sections:', error.message);
            }
        };

        fetchSections();
    }, []);

    useEffect(() => {
        const fetchACPercentage = async () => {
            try {
                const response = await axios.get(`https://hotelback-6pw8.onrender.com/api/section/${selectedSection}`);
                setACPercentage(response.data.acPercentage.toString()); // Assuming acPercentage is a number
            } catch (error) {
                console.error('Error fetching AC Percentage:', error.message);
            }
        };

        if (selectedSection) {
            fetchACPercentage();
        }
    }, [selectedSection]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedSection && acPercentage !== '') {
            try {
                await axios.patch(`https://hotelback-6pw8.onrender.com/api/section/ac/${selectedSection}`, {
                    acPercentage: parseFloat(acPercentage),
                });
                console.log('AC Percentage added successfully');
            } catch (error) {
                console.error('Error adding AC Percentage:', error.message);
            }
        }
    };

    return (
        <>
        <Navbar/>
       
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-28">
            <div className="mb-4 relative">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sectionSelect">
                    Select Section:
                </label>
                <div className="relative">
                    <select
                        id="sectionSelect"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="block appearance-none w-full border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        {sections.map((section) => (
                            <option key={section._id} value={section._id}>
                                {section.name}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M10 12L5 7h10l-5 5z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="acPercentageInput">
                    AC Percentage:
                </label>
                <input
                    id="acPercentageInput"
                    type="number"
                    value={acPercentage}
                    onChange={(e) => setACPercentage(e.target.value)}
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

export default ACForm;
