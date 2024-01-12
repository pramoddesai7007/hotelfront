'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';


// const ResetPassword = () => {
//     // const [resetToken, setResetToken] = useState('');
//     const resetToken = useParams().resetToken
//     console.log(resetToken)
//     const [newPassword, setNewPassword] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const router = useRouter()
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             // Send a POST request to the /resetPassword endpoint
//             const response = await axios.post(`https://hotelback-6pw8.onrender.com/api/auth/resetPassword/${resetToken}`, {
//              newPassword: newPassword,
//          });

//             // Check if the request was successful
//             if (response.status === 200) {
//                 // Display a success message to the user
//                 setSuccessMessage('Password reset successful.');
//                 setErrorMessage('');
//                 router.push('/login')
//             } else {
//                 // Handle other response statuses if needed
//                 console.error('Response status:', response.status);
//                 setErrorMessage('Something went wrong. Please try again later.');
//                 setSuccessMessage('');
//             }
//         } catch (error) {
//             // Handle any errors that occur during the request
//             console.error('Error resetting password:', error);
//             setErrorMessage('An error occurred. Please try again later.');
//             setSuccessMessage('');
//         }
//     };



// ResetPassword component
const ResetPassword = () => {
    // Get the resetToken from the URL params
    const resetToken = useParams().resetToken;
    console.log(resetToken);

    // State for new password and success/error messages
    const [newPassword, setNewPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Get the router object
    const router = useRouter();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send a POST request to the /resetPassword endpoint with the correct resetToken
            const response = await axios.post(`https://hotelback-6pw8.onrender.com/api/auth/resetPassword/${resetToken}`, {
                newPassword: newPassword,
            });

            // Check if the request was successful
            if (response.status === 200) {
                // Display a success message to the user
                setSuccessMessage('Password reset successful.');
                setErrorMessage('');
                router.push('/login');
            } else {
                // Handle other response statuses if needed
                console.error('Response status:', response.status);
                setErrorMessage('Something went wrong. Please try again later.');
                setSuccessMessage('');
            }
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error resetting password:', error);
            setErrorMessage('An error occurred. Please try again later.');
            setSuccessMessage('');
        }
    };


    return (
        <div>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                        <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Reset Password
                        </h2>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
                            <div>
                                <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="New Password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full text-gray-500 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Reset Password
                            </button>
                        </form>
                        {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
                        {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ResetPassword;