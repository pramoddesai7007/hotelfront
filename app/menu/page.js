"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faSearch, faHouse, faPenToSquare, faPlus, faTrash, faAnglesLeft, faAnglesRight, faUpload, faTimes, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import Square from "../components/square";

const EditModal = ({ isOpen, onCancel, onEdit, menuToEdit }) => {
    const [editedMenuData, setEditedMenuData] = useState({
        name: menuToEdit?.name || "",
        price: menuToEdit?.price || "",
        uniqueId: menuToEdit?.uniqueId || "",
        image: null,
        // mainCategoryId: menuToEdit?.mainCategory._id || "",
    });

    const [errorMessage, setErrorMessage] = useState("");



    useEffect(() => {
        let timeoutId;

        if (errorMessage) {
            timeoutId = setTimeout(() => {
                setErrorMessage("");
            }, 2000);
        }

        return () => {
            // Cleanup the timeout when the component is unmounted or the error message changes
            clearTimeout(timeoutId);
        };
    }, [errorMessage]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        // Capitalize the first letter if the input is not a file
        const capitalizedValue = type !== "file" ? value.charAt(0).toUpperCase() + value.slice(1) : value;

        if (type === "file") {
            setEditedMenuData((prevData) => ({
                ...prevData,
                [name]: files[0],
            }));
        } else {
            setEditedMenuData((prevData) => ({
                ...prevData,
                [name]: capitalizedValue,
            }));
        }
    };
    const handleEdit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", editedMenuData.name);
            formData.append("price", editedMenuData.price);
            formData.append("image", editedMenuData.image);
            formData.append("uniqueId", editedMenuData.uniqueId);
            // formData.append("mainCategoryId", editedMenuData.mainCategoryId);

            const response = await axios.patch(
                `https://hotelback-6pw8.onrender.com/api/menu/menus/${menuToEdit._id}`,
                formData
            );

            console.log("Menu updated successfully:", response.data);
            onEdit(response.data); // Update the state with the edited menu

            onCancel(); // Close the edit modal
        } catch (error) {
            console.error("Error updating menu:", error);

            if (error.response && error.response.status === 400) {
                const specificErrorMessage = error.response.data.message;

                // Ensure specificErrorMessage is defined before using includes
                if (specificErrorMessage && specificErrorMessage.includes("uniqueId")) {
                    setErrorMessage("Error adding menu. Please try again later."); // Update the error message state
                } else {
                    setErrorMessage("Menu ID is already taken"); // Update the error message state
                }
            }
        }

    };



    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? "" : "hidden"
                }`}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >

            <div
                className="modal-container bg-white p-6 rounded shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => onCancel(false)}
                    className="absolute top-4 right-2 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">
                    Edit Menu
                </h3>
                {errorMessage && <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white border border-red-500 rounded p-7 
  shadow-md z-50 absolute">
                        <p className="text-red-500 font-semibold text-center text-xl">Menu Id Is Already Taken!
                        </p>
                    </div>
                    {errorMessage}
                </div>}
                <form>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={editedMenuData.name}
                        onChange={handleInputChange}
                        autoComplete="off"
                        className="w-full p-2 mb-4 border rounded-md"
                    />
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                        MenuId
                    </label>
                    <input
                        type="number"
                        name="uniqueId"
                        value={editedMenuData.uniqueId}
                        onChange={handleInputChange}
                        autoComplete="off"

                        className="w-full p-2 mb-4 border rounded-md"
                    />
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                        Price
                    </label>
                    <input
                        type="text"
                        name="price"
                        value={editedMenuData.price}
                        onChange={handleInputChange}
                        autoComplete="off"

                        className="w-full p-2 mb-4 border rounded-md"
                    />

                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                        Image
                    </label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleInputChange}
                        autoComplete="off"

                        className="w-full p-2 mb-4 border rounded-md"
                    />
                    <div className="flex justify-between">
                        {/* <button
                            type="button"
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md mt-4"
                            onClick={onCancel}
                        >
                            Close
                        </button> */}
                        <button
                            type="button"
                            className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-72 mx-auto mt-4"
                            onClick={handleEdit}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
            );
        </div>
    );
};


const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 "
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div
                className="modal-container border border-red-600 bg-white w-96 p-6 rounded shadow-lg "
                onClick={(e) => e.stopPropagation()}
            >

                <p className="text-lg text-red-600 ">
                    Do you want to delete this Menu ?
                </p>
                <div className="flex justify-end mt-4">
                    <button
                        className=" bg-red-200  hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-full mr-2"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className=" bg-slate-300  hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full "
                        onClick={onCancel}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState(null);
    const [mainCategories, setMainCategories] = useState([]); // Added state for main categories
    const [pageNumber, setPageNumber] = useState(0);
    const [completeImageUrl, setPreviewImageUrl] = useState("");
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [menuToEdit, setMenuToEdit] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [menuToView, setMenuToView] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);




    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const filterMenus = () => {
        const regex = new RegExp(searchQuery, 'i');

        return menus.filter((menu) => {
            const lowerCaseName = menu.name.toLowerCase();
            const lowerCaseUniqueId = menu.uniqueId ? menu.uniqueId.toString().toLowerCase() : "";

            return (
                regex.test(lowerCaseName) ||
                regex.test(lowerCaseUniqueId)
            );
        });
    };



    const exportToExcel = (isExportMenu) => {
        // Create an empty worksheet
        const ws = XLSX.utils.aoa_to_sheet([['name', 'price', 'uniqueId']]);

        // Check if exporting menu data
        if (isExportMenu) {
            // Add menu data to the worksheet (assuming menus is an array of menu objects)
            menus.forEach((menu, index) => {
                const menuData = [menu.name, menu.price, menu.uniqueId];
                XLSX.utils.sheet_add_aoa(ws, [menuData], { origin: index + 1 });
            });
        }

        // Set the column width for the 'name' column (1-based index)
        ws['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 10 }]; // Adjust the width (20 is just an example)

        // Create an empty workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, isExportMenu ? 'Menus' : 'BlankSheet');

        // Generate a binary string from the workbook
        const wbBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert the binary string to a Blob
        const blob = new Blob([s2ab(wbBinary)], { type: 'application/octet-stream' });

        // Create a download link and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = isExportMenu ? 'menus.xlsx' : 'blanksheet.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    // Helper function to convert a sring to an ArrayBuffer
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };

    const handleEdit = (menu) => {
        setMenuToEdit(menu);
        setIsEditModalOpen(true);
    };

    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [newMenuData, setNewMenuData] = useState({
        name: "",
        price: "",
        image: null, // Add the image field
        // mainCategoryId: "",
    });

    const handleDelete = (menu) => {
        // Set the menu to be deleted in the state
        setMenuToDelete(menu);
        // Open the delete confirmation modal
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            // Proceed with the delete operation
            const response = await axios.delete(
                `https://hotelback-6pw8.onrender.com/api/menu/menus/${menuToDelete._id}`
            );
            console.log("Menu deleted successfully:", response.data);

            // Update the menus state by filtering out the deleted menu
            setMenus((prevMenus) =>
                prevMenus.filter((m) => m._id !== menuToDelete._id)
            );

            // Close the delete confirmation modal
            setIsDeleteModalOpen(false);
            // Clear the menu to be deleted from the state
            setMenuToDelete(null);
        } catch (error) {
            console.error("Error deleting menu:", error);
        }
    };

    const cancelDelete = () => {
        // Close the delete confirmation modal without deleting
        setIsDeleteModalOpen(false);
        // Clear the menu to be deleted from the state
        setMenuToDelete(null);
    };


    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        // If the input is a file (image input), set the image field in a different way
        if (type === "file") {
            setNewMenuData((prevData) => ({
                ...prevData,
                [name]: files[0], // Assuming you only want to handle one file
            }));
        } else {
            setNewMenuData((prevData) => ({
                ...prevData,
                [name]: capitalizeFirstLetter(value),
            }));
        }
    };
    const capitalizeFirstLetter = (input) => {
        return input.charAt(0).toUpperCase() + input.slice(1);
    };

    const openExcelUpload = () => {
        setIsExcelUploadOpen(true);
    };

    const closeExcelUpload = () => {
        setIsExcelUploadOpen(false);
    };

    const [errorMessage, setErrorMessage] = useState(null);
    const addNewMenu = async () => {
        try {
            const formData = new FormData();
            formData.append("name", newMenuData.name);
            formData.append("price", newMenuData.price);
            formData.append("image", newMenuData.image);
            formData.append("uniqueId", newMenuData.uniqueId);

            const response = await axios.post(
                `https://hotelback-6pw8.onrender.com/api/menu/menu`,
                formData
            );

            console.log("Menu added successfully:", response.data);
            console.log("Modal is opening")
            // Set the success modal state to true
            // Automatically clear the error modal after 2 seconds


            setMenus((prevMenus) => [...prevMenus, response.data]);

            setNewMenuData({
                name: "",
                price: "",
                image: null,
                uniqueId: "",
                // mainCategoryId: "",
            });

            // setIsNewModalOpen(false);
            setIsSuccessModalOpen(true);
            setTimeout(() => {
                setIsSuccessModalOpen(null);
                setIsNewModalOpen(false);
            }, 2000);

            setErrorMessage(null);
        } catch (error) {
            console.error("Error adding menu:", error);

            let errorMessage = "Error adding menu. Please try again later.";

            if (error.response && error.response.status === 400) {
                const specificErrorMessage = error.response.data.message;

                if (specificErrorMessage) {
                    if (specificErrorMessage.includes("uniqueId")) {
                        if (/[a-zA-Z]/.test(newMenuData.uniqueId)) {
                            errorMessage = "Menu ID should be a numeric value.";
                        } else {
                            errorMessage = "Menu ID is already taken.";
                        }
                    }
                }
            }

            // Set the error message state
            setErrorMessage(errorMessage);

            // Automatically clear the error message after 2 seconds
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);

            setIsErrorModalOpen(true);

            // Automatically clear the error modal after 2 seconds
            setTimeout(() => {
                setIsErrorModalOpen(false);
            }, 2000);
        }
    };



    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await axios.get(
                    "https://hotelback-6pw8.onrender.com/api/menu/menus/list"
                );
                setMenus(response.data);
            } catch (error) {
                console.error("Error fetching menus:", error);
            }
        };

        fetchMenus();
    }, []);

    const handleFileUpload = async () => {
        try {
            if (!file) {
                console.error("No file selected");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);

            // Make a POST request to the backend endpoint
            const response = await axios.post(
                "https://hotelback-6pw8.onrender.com/api/menu/upload-excel",
                formData
            );

            console.log(response.data); // Handle the response data as needed
        } catch (error) {
            console.error("Error uploading file:", error.message);
        }
    };
    const menusPerPage = 10; // Change this to set the number of menus per page

    const pageCount = Math.ceil(menus.length / menusPerPage);

    const displayMenus = filterMenus()
        .slice(pageNumber * menusPerPage, (pageNumber + 1) * menusPerPage)
        .map((menu, index) => (
            <tr
                key={menu._id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100 '}
            >
                <td className="p-2  text-center text-gray ">
                    {pageNumber * menusPerPage + index + 1}
                </td>
                <td className="pl-4  text-center text-gray">{menu.name}</td>
                <td className="pl-4  text-center text-gray text-orange-400">{menu.uniqueId}</td>
                <td className="p-1  text-center text-gray">{menu.price}</td>

                <td className="py-1 text-center">
                    <button
                        className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                        onClick={() => handleEdit(menu)}
                    >
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            color="orange"

                            className="cursor-pointer"
                        />{" "}

                    </button>
                    <button
                        className="text-gray-600 mr-3 font-sans focus:outline-none font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                        onClick={() => handleDelete(menu)}
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            color="red"
                            className="cursor-pointer"
                        />{" "}

                    </button>
                </td>
            </tr>
        ));

    const home = () => {
        router.push("/dashboard");
    };

    const modalContent = (
        <div
            className="modal-container bg-white p-6 rounded-md shadow-md relative"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={() => setIsNewModalOpen(false)}
                className="absolute top-4 right-4 bg-orange-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
            >
                <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <div className="p-1 text-left">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-left">
                    Add New Menu
                </h3>
                {isErrorModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white border border-red-500 rounded p-7 
shadow-md z-50 absolute">
                            <p className="text-red-500 font-semibold text-center text-xl">MenuID is already taken!
                            </p>
                        </div>
                    </div>
                )}
                {isSuccessModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white border border-green-500 rounded p-7 shadow-md z-50 absolute">
                            <p className="text-green-500 font-semibold text-center text-xl">
                                Menu added successfully!
                            </p>
                        </div>
                    </div>
                )}
                <form>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={newMenuData.name}
                        autoComplete="off"
                        onChange={handleInputChange}
                        className="w-full p-2 mb-4 border rounded-md"
                        required
                    />
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                        MenuId
                    </label>
                    <input
                        type="Number"
                        name="uniqueId"
                        value={newMenuData.uniqueId}
                        onChange={handleInputChange}
                        autoComplete="off"
                        className="w-full p-2 mb-4 border rounded-md"
                        min={0}
                        required
                    />
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                        Price
                    </label>
                    <input
                        type="text"
                        name="price"
                        value={newMenuData.price}
                        onChange={handleInputChange}
                        autoComplete="off"
                        className="w-full p-2 mb-4 border rounded-md"
                        required
                    />

                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                        Image
                    </label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleInputChange}
                        autoComplete="off"
                        className="w-full p-2 mb-4 border rounded-md"
                    />
                    <div className="flex justify-between">
                        <button
                            type="button"
                            className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
                            onClick={addNewMenu}
                        >
                            Add Menu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );



    return (
        <>
            <Navbar />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />

            {/* <Square /> */}

            <div className="container mx-auto p-2 w-full mt-12 overflow-x-auto  border-gray-300 shadow-md font-sans max-w-5xl">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                    <h1 className="text-xl font-bold font-sans mb-2 md:mb-0 text-orange-600">Menus</h1>
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="relative mb-2 md:mb-0 md:mr-3">
                            <input
                                className="border-2 border-gray-300 pl-2 rounded-full bg-white h-9 text-sm focus:outline-non"
                                id="searchInput"
                                type="text"
                                name="searchInput"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-0 md:mr-2 top-1">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-700" />
                            </button>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
                                onClick={() => exportToExcel(true)}
                            >
                                <FontAwesomeIcon icon={faDownload}className="mr-1" />
                                Menus
                            </button>
                            <button
                                className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
                                onClick={openExcelUpload}
                            >
                                <FontAwesomeIcon icon={faUpload} className="mr-1" />
                                Import
                            </button>
                            <button
                                className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
                                onClick={() => exportToExcel(false)}
                            >
                                <FontAwesomeIcon icon={faDownload} className="mr-1" />
                                Export
                            </button>
                            <button
                                className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
                                onClick={() => setIsNewModalOpen(true)}
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                <table className="min-w-full mt-4">
                    <thead className="text-base bg-zinc-100 text-yellow-700 border">
                        <tr>
                            <th className="p-3">Sr No.</th>
                            <th className="p-3 ">Name</th>
                            <th className="p-3 ">MenuID</th>
                            <th className="p-3 ">Price</th>
                            {/* <th className="p-2 border">Category</th> */}
                            {/* <th className="p-2 border text-center">Image</th> */}
                            <th className="p-3  text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-md font-sans font-bold">{displayMenus}</tbody>
                </table>

                <div className="flex flex-col items-center mt-1">
                    <span className="text-xs text-gray-700 dark:text-gray-400">
                        Showing{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {pageNumber * menusPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {Math.min((pageNumber + 1) * menusPerPage, menus.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {menus.length}
                        </span>{" "}
                        Menus
                    </span>
                    <div className="inline-flex mt-1 xs:mt-0">
                        <button
                            className={`${pageNumber === 0
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                                } flex items-center justify-center px-3 h-8 text-xs font-medium text-white bg-gray-800 border-gray-700 rounded-s`}
                            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
                            disabled={pageNumber === 0}
                        >
                            <FontAwesomeIcon icon={faAnglesLeft} />
                        </button>
                        <button
                            className={`${pageNumber === pageCount - 1
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                                } flex items-center justify-center px-3 h-8 text-xs font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e`}
                            onClick={() =>
                                setPageNumber((prev) => Math.min(prev + 1, pageCount - 1))
                            }
                            disabled={pageNumber === pageCount - 1}
                        >
                            <FontAwesomeIcon icon={faAnglesRight} />
                        </button>
                    </div>
                </div>
            </div>

            {isPreviewModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 m-1"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div
                        className="modal-container bg-white w-72 p-6 rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => setIsPreviewModalOpen(false)}
                        ></button>
                        <div className="p-1 text-center">
                            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">
                                Image Preview
                            </h3>
                            <Image
                                src={completeImageUrl}
                                alt="Preview"
                                width={500}
                                height={500}
                            />
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded-full mt-4 mr-2"
                                onClick={() => setIsPreviewModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isNewModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 m-1"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    {modalContent}
                </div>
            )}

            {isEditModalOpen && (
                <EditModal
                    isOpen={isEditModalOpen}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setMenuToEdit(null);
                    }}
                    onEdit={(editedMenu) => {
                        // Update the menus state with the edited menu
                        setMenus((prevMenus) =>
                            prevMenus.map((menu) =>
                                menu._id === editedMenu._id ? editedMenu : menu
                            )
                        );
                    }}
                    menuToEdit={menuToEdit}
                    mainCategories={mainCategories}
                />
            )}

            {isExcelUploadOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-md max-w-md relative">
                        <button
                            onClick={closeExcelUpload}
                            className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
                        >
                            <FontAwesomeIcon icon={faTimes} size="lg" />
                        </button>
                        <h1 className="text-2xl font-semibold mb-6">Upload Excel File</h1>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="mb-4 p-3 border border-gray-300 rounded w-full"
                        />
                        <button
                            onClick={() => {
                                handleFileUpload();
                                closeExcelUpload();
                            }}
                            className="bg-orange-100 text-orange-600 p-3 rounded-full w-full hover:bg-orange-200 font-semibold"
                        >
                            Upload To Excel
                        </button>
                    </div>
                </div>
            )}

            {isViewModalOpen && (
                <div
                    className={`fixed inset-0 flex items-center justify-center z-50 ${isViewModalOpen ? "" : "hidden"
                        }`}
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-container bg-white w-96 p-8 rounded-md shadow-lg m-1">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-400">
                            View Menu
                        </h3>
                        <div className="text-center">
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Name:</span> {menuToView?.name}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Price:</span>{" "}
                                {menuToView?.price}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Category:</span>{" "}
                                {menuToView?.mainCategory?.name}
                            </p>
                            <p className="text-gray-600 mb-4">
                                <span className="font-semibold">Image:</span>{" "}
                                {menuToView?.imageUrl ? (
                                    <img
                                        src={`https://hotelback-6pw8.onrender.com/${menuToView.imageUrl}`}
                                        alt="Menu"
                                        className="max-w-full max-h-32 mt-2 rounded-md shadow-md"
                                    />
                                ) : (
                                    "Not Available"
                                )}
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="border border-gray-400 hover:bg-gray-300 text-gray font-bold py-2 px-4 rounded-full mr-2"
                                onClick={() => setIsViewModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MenuList;