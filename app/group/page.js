"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faTrash,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";

const GroupMenu = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAddMenus, setSelectedAddMenus] = useState([]);
  const [menuSearchQuery, setMenuSearchQuery] = useState("");

  const [selectAll, setSelectAll] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  let closeTimeout;

  const handleAddMenusToCategory = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `https://hotelback-6pw8.onrender.com/api/menu/${selectedMainCategory}/assignmenus`,
        {
          menuIds: selectedAddMenus,
        }
      );

      console.log(response.data);

      // Fetch the updated menus for the selected category
      await fetchMenusForCategory();

      setSelectedAddMenus([]);
      setLoading(false);
    } catch (error) {
      console.error("Error adding menus:", error);
      setError(); // Update the error message
      setLoading(false);
      setIsErrorModalOpen(true);

      // Automatically close the modal after 3000 milliseconds (3 seconds)
      closeTimeout = setTimeout(() => {
        setIsErrorModalOpen(false);
      }, 2000);
    }
  };

  const closeModal = () => {
    setIsErrorModalOpen(false);
  };

  // Clear timeout on component unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      clearTimeout(closeTimeout);
    };
  }, []);

  const handleMenuCheckboxChange = (menuId) => {
    // Toggle individual menu checkbox
    const updatedSelectedMenus = selectedMenus.includes(menuId)
      ? selectedMenus.filter((id) => id !== menuId)
      : [...selectedMenus, menuId];

    setSelectedMenus(updatedSelectedMenus);

    // Check if all individual menu checkboxes are selected
    const isAllSelected = filteredMenus.every((menu) =>
      updatedSelectedMenus.includes(menu._id)
    );

    setSelectAll(isAllSelected);
  };

  const handleSelectAllChange = () => {
    // Toggle "Select All" checkbox
    const updatedSelectAll = !selectAll;
    setSelectAll(updatedSelectAll);

    // Update individual menu checkboxes accordingly
    const updatedSelectedMenus = updatedSelectAll
      ? filteredMenus.map((menu) => menu._id)
      : [];

    setSelectedMenus(updatedSelectedMenus);
  };

  // Fetch all menus
  const fetchAllMenus = async () => {
    try {
      const response = await axios.get(
        "https://hotelback-6pw8.onrender.com/api/menu/menus/list"
      );
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  useEffect(() => {
    fetchAllMenus();
  }, []);

  const handleAddMenuCheckboxChange = (menuId) => {
    const isSelected = selectedAddMenus.includes(menuId);

    if (isSelected) {
      setSelectedAddMenus((prevMenus) =>
        prevMenus.filter((menu) => menu !== menuId)
      );
    } else {
      setSelectedAddMenus((prevMenus) => [...prevMenus, menuId]);
    }
  };

  const setErrorWithDuration = (errorMessage, duration) => {
    setError(errorMessage);

    // Clear the error message after the specified duration (in milliseconds)
    setTimeout(() => {
      clearError();
    }, duration);
  };

  const clearError = () => {
    setError(null);
  };

  // const handleAddMenusToCategory = async () => {
  //   try {
  //     setLoading(true);

  //     const response = await axios.post(
  //       `https://hotelback-6pw8.onrender.com/api/menu/${selectedMainCategory}/assignmenus`,
  //       {
  //         menuIds: selectedAddMenus,
  //       }
  //     );

  //     console.log("Menus added successfully:", response.data);

  //     // Fetch the updated menus for the selected category
  //     await fetchMenusForCategory();

  //     setSelectedAddMenus([]);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error adding menus:", error);
  //     setError("Error adding menus");
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const mainCategoriesResponse = await axios.get(
          "https://hotelback-6pw8.onrender.com/api/main"
        );
        setMainCategories(mainCategoriesResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data from the server");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchMenusForCategory = async () => {
    try {
      const response = await axios.get(
        `https://hotelback-6pw8.onrender.com/api/main/${selectedMainCategory}`
      );
      const mainCategory = response.data;

      if (!mainCategory) {
        console.error("Main category not found");
        return;
      }

      setFilteredMenus(mainCategory.menus || []);
    } catch (error) {
      console.error("Error fetching menus for the selected category:", error);
    }
  };

  useEffect(() => {
    if (selectedMainCategory) {
      fetchMenusForCategory();
    }
  }, [selectedMainCategory]);

  const handleDeleteMenus = async () => {
    try {
      setLoading(true);

      const response = await axios.delete(
        `https://hotelback-6pw8.onrender.com/api/menu/${selectedMainCategory}/removemenus`,
        {
          data: { menuIds: selectedMenus },
        }
      );

      console.log("Menus deletion successful:", response.data);

      // Fetch the updated menus for the selected category
      await fetchMenusForCategory();

      setSelectedMenus([]);
      setLoading(false);
    } catch (error) {
      console.error("Error deleting menus:", error);
      setError("Error deleting menus");
      setLoading(false);
    }
  };

  const router = useRouter();
  const home = () => {
    router.push("/dashboard");
  };

  const filteredMenusForAdd = menus.filter((menu) =>
    menu.name.toLowerCase().includes(menuSearchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container text-lg mt-10 font-sans font-semibold mx-auto p-5 overflow-x-auto border-gray-300 border-1 max-full"></div>
      <div>
        {/* Your existing code here */}

        {/* Modal for error */}
        <div className=" bg-black">
          <Modal
            isOpen={isErrorModalOpen}
            onRequestClose={closeModal}
            contentLabel="Error Modal"
            style={{
              content: {
                width: "350px", // Adjust the width as needed
                height: "100px", // Adjust the height as needed
                margin: "auto",
                backgroundColor: "rgb(239, 68 ,68)",
              },
            }}
          >
            <div className=" flex justify-center h-full ">
              {/* No close button or trash icon in this example */}
              <p className=" text-white text-xl font-semibold mt-3 ">
                Menus Are Already Added !
              </p>
            </div>
          </Modal>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-2 p-4 rounded-md flex  font-sans shadow-md">
        <div className="flex-1 pr-4">
          <div className="mb-4">
            <label
              htmlFor="mainCategory"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Select Main Category:
            </label>
            <select
              id="mainCategory"
              name="mainCategory"
              value={selectedMainCategory}
              onChange={(e) => setSelectedMainCategory(e.target.value)}
              className="mt-1 p-2 w-1/2 border text-sm bg-white rounded-xl focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="" disabled>
                Select Main Category
              </option>
              {mainCategories.map((mainCategory) => (
                <option key={mainCategory._id} value={mainCategory._id}>
                  {mainCategory.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 overflow-y-auto max-h-96">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Selected Category:
            </label>
            {loading ? (
              <p>Loading menus...</p>
            ) : (
              <>
                {/* "Select All" checkbox */}
                <div className="flex items-center mb-2 w-full">
                  <input
                    type="checkbox"
                    id="select-all"
                    onChange={handleSelectAllChange}
                    checked={selectAll}
                    className="mr-2 checkbox text-sm mt-1"
                  />
                  <label
                    htmlFor="select-all"
                    className="text-gray-800 text-sm font-bold"
                  >
                    Select All Menus
                  </label>
                </div>

                {/* Individual menu checkboxes */}
                {filteredMenus.map((menu) => (
                  <div key={menu._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`category-menu-${menu._id}`}
                      onChange={() => handleMenuCheckboxChange(menu._id)}
                      checked={selectedMenus.includes(menu._id)}
                      className="mr-2 checkbox text-sm mt-1"
                    />
                    <label className="text-gray-800 text-sm">{menu.name}</label>
                  </div>
                ))}
              </>
            )}
            {filteredMenus.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteMenus}
                className="bg-red-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-red-600 focus:outline-none focus:shadow-outline-red"
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="cursor-pointer mr-2 text-sm"
                />
                Delete Selected Menus
              </button>
            )}
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="w-96 ml-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Menus to Add:
          </label>
          <div className="flex flex-wrap">
            <input
              type="text"
              placeholder="Search menus..."
              value={menuSearchQuery}
              onChange={(e) => setMenuSearchQuery(e.target.value)}
              className="w-full p-2 border mb-4 text-sm rounded-xl focus:outline-none focus:ring focus:border-blue-300"
            />
            <div
              className="overflow-y-auto force-overflow h-96 w-full scrollbar"
              id="style-4"
            >
              {loading ? (
                <p>Loading menus...</p>
              ) : (
                <>
                  <div className="flex flex-wrap">
                    {/* First line of menus */}
                    {filteredMenusForAdd
                      .slice(0, Math.ceil(filteredMenusForAdd.length / 2))
                      .map((menu) => (
                        <div
                          key={menu._id}
                          className="flex items-center w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 mt-2"

                          >
                         
                          <input
                            type="checkbox"
                            id={`add-menu-${menu._id}`}
                            onChange={() =>
                              handleAddMenuCheckboxChange(menu._id)
                            }
                            checked={selectedAddMenus.includes(menu._id)}
                            className="mr-2 checkbox text-sm mt-1"
                          />
                          <label
                            htmlFor={`add-menu-${menu._id}`}
                            className="text-sm text-gray-800"
                          >
                            {menu.name}
                          </label>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {menus.length > 0 && (
            <button
              type="button"
              onClick={handleAddMenusToCategory}
              className="bg-green-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green mr-10"
            >
              <FontAwesomeIcon
                icon={faCheck}
                className="cursor-pointer mr-2 text-sm"
              />
              Add Selected Menus
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default GroupMenu;