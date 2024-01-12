"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch,faAnglesLeft,faAnglesRight,faPenToSquare,faPlus,faTrash,faTimes,} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import Square from "../components/square";

const Section = () => {
  const [sections, setSections] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const router = useRouter();
  const [newSection, setNewSection] = useState({ name: "" });

  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [sectionToEdit, setSectionToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSections, setFilteredSections] = useState([]);

  const [isAddSuccess, setIsAddSuccess] = useState(false);


  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get("https://hotelback-6pw8.onrender.com/api/section");
        setSections(response.data);
        filterSections(response.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, [searchQuery]);

  const filterSections = (sections) => {
    const filtered = sections.filter((section) =>
      section.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setFilteredSections(filtered);
  };

  const handleEdit = (section) => {
    setSectionToEdit(section);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!sectionToEdit) return;

    try {
      // Send the updated sections to the server
      await axios.patch(
        `https://hotelback-6pw8.onrender.com/api/section/${sectionToEdit._id}`,
        {
          name: sectionToEdit.name,
          isDefault: sectionToEdit.isDefault,
        }
      );

      // Update the state immediately
      setSections((prevSections) =>
        prevSections.map((s) =>
          s._id === sectionToEdit._id
            ? {
              ...s,
              name: sectionToEdit.name,
              isDefault: sectionToEdit.isDefault,
            }
            : s
        )
      );

      // Close the edit modal
      setSectionToEdit(null);
      setIsEditModalOpen(false);

      // Refetch the sections to update the display
      const response = await axios.get("https://hotelback-6pw8.onrender.com/api/section");
      setSections(response.data);
      filterSections(response.data);
    } catch (error) {
      console.error("Error updating section:", error);
      // Handle error if needed
    }
  };

  const handleDelete = (section) => {
    setSectionToDelete(section);
    setIsDeleteConfirmationModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!sectionToDelete) return;

    try {
      await axios.delete(
        `https://hotelback-6pw8.onrender.com/api/section/${sectionToDelete._id}`
      );

      // Remove the deleted section from the state
      setSections((prevSections) =>
        prevSections.filter((s) => s._id !== sectionToDelete._id)
      );
      setSectionToDelete(null);

      // Refetch the sections to update the display
      const sectionsResponse = await axios.get(
        "https://hotelback-6pw8.onrender.com/api/section"
      );
      setSections(sectionsResponse.data);
      filterSections(sectionsResponse.data);
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const handleAddSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newSection.name);

      const response = await axios.post(
        "https://hotelback-6pw8.onrender.com/api/section/create",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const addedSection = response.data;

      // Update the state immediately
      setSections((prevSections) => [...prevSections, addedSection]);
      setNewSection({
        name: "",
      });
      setIsNewModalOpen(false);
      setIsAddSuccess(true); 
      // Set the success state to true
      setTimeout(() => {
        setIsAddSuccess(null);
    }, 2000);


      // Refetch the sections to update the display
      const sectionsResponse = await axios.get(
        "https://hotelback-6pw8.onrender.com/api/section"
      );
      setSections(sectionsResponse.data);
      filterSections(sectionsResponse.data);
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const sectionsPerPage = 10; // Change this to set the number of sections per page

  useEffect(() => {
    const fetchsections = async () => {
      try {
        const response = await axios.get("https://hotelback-6pw8.onrender.com/api/section");
        setSections(response.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchsections();
  }, []);

  const pageCount = Math.ceil(sections.length / sectionsPerPage);

  const displaysections = (
    filteredSections.length > 0 ? filteredSections : sections
  )
    .slice(pageNumber * sectionsPerPage, (pageNumber + 1) * sectionsPerPage)
    .map((section, index) => (
      <tr key={section._id}
        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100 '}>

        <td className="p-1  text-center text-gray">
          {pageNumber * sectionsPerPage + index + 1}
        </td>
        <td className="pl-4  text-center text-gray">
          {section.name}
          {section.isDefault && (
            <span className="ml-2 text-green-500 font-semibold">(Default)</span>
          )}
        </td>
        <td className=" py-1 text-center">
          {/* <button
            className="text-white mr-3 hover:bg-green-600 focus:outline-none font-sans font-medium border p-1 bg-blue-600 rounded-md px-4 text-sm"
            onClick={() => handleEdit()}
          >
            <FontAwesomeIcon icon={faEye} className="cursor-pointer" /> View
          </button> */}
          <button
            className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md"
            onClick={() => handleEdit(section)}
          >
            <FontAwesomeIcon icon={faPenToSquare}
              color="orange"
              className="cursor-pointer" />{" "}

          </button>
          <button
            className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md"
            onClick={() => handleDelete(section)}
          >
            <FontAwesomeIcon icon={faTrash}
              color="red"
              className="cursor-pointer" />
          </button>
        </td>
      </tr>
    ));

  const home = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <div className="">

        <Navbar />

        {/* <Square/> */}


        <div className="container mx-auto p-2 w-full mt-14 overflow-x-auto  border-gray-300 shadow-md font-sans max-w-5xl">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold font-sans mb-2 md:mb-0 text-orange-600">Hotel Sections</h1>
            <div className="flex justify-center">
              <div className="relative mx-auto text-gray-600 justify-center flex float-right">
                <input
                  className="border-2  mt-1 border-gray-300 mr-2 bg-white h-9 rounded-full pl-3 text-sm focus:outline-none mb-2 "
                  id="searchInput"
                  type="text"
                  name="searchInput"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />

                <button type="submit" className="absolute right-0 top-2 mr-2">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="text-gray-700 mr-2"
                  />
                </button>
              </div>
              <button
                className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md mb-2"
                onClick={() => setIsNewModalOpen(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Add
              </button>
            </div>
          </div>

          <table className="min-w-full   ">
            <thead className="text-base bg-zinc-100 text-yellow-700 border">
              <tr>
                <th className="p-3 ">Sr No.</th>
                <th className="p-3 ">Name</th>

                <th className="p-2  text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-md font-poppins font-bold">
              {displaysections}
            </tbody>
          </table>

          <div className="flex flex-col items-center mt-1">
            <span className="text-xs text-gray-700 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {pageNumber * sectionsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.min((pageNumber + 1) * sectionsPerPage, sections.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {sections.length}
              </span>{" "}
              sections
            </span>
            <div className="inline-flex xs:mt-0">
              <button
                className=" flex items-center justify-center px-3 h-8 text-xs font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
              >
                <FontAwesomeIcon icon={faAnglesLeft} />
              </button>
              <button
                className="flex items-center justify-center px-3 h-8 text-xs font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, pageCount - 1))
                }
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isAddSuccess && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg"
            onClick={() => setIsAddSuccess(false)}
          >
            <div className="text-center">
              <h3 className="mb-5 text-lg font-semibold text-green-600 dark:text-green-400">
                Category Added Successfully
              </h3>
            </div>
          </div>
        </div>
      )}
      {isNewModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setIsNewModalOpen(false)}
            ></button>
            <div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className=" bg-red-100 text-red-600 p-1 px-2 hover:bg-red-200  rounded-full text-center float-right"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="p-1 ">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-center">
                Add New Section
              </h3>


              <div className="mb-4">
                <label
                  htmlFor="newSectionName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400 text-left"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="newSectionName"
                  name="newSectionName"
                  value={newSection.name}
                  onChange={(e) =>
                    setNewSection({ ...newSection, name: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid place-items-center">
                <button
                  type="button"
                  className="bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72"
                  onClick={handleAddSubmit}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmationModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-1 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-4 h-4 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setIsDeleteConfirmationModalOpen(false)}
            ></button>
            <div className="p-1 text-center">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">
                Delete Section
              </h3>
              <p className="mb-2 text-sm text-gray-700 dark:text-gray-400">
                Do you really want to delete this{" "}
                <strong>{sectionToDelete?.name}</strong> section?
              </p>
              <button
                type="button"
                className="hover:bg-red-300 text-red-600 bg-red-100 font-bold py-2 px-4 rounded-full mr-2"
                onClick={() => {
                  handleDeleteConfirmed();
                  setIsDeleteConfirmationModalOpen(false);
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="hover:bg-gray-400 text-gray-700 bg-gray-200 font-bold py-2 px-4 rounded-full"
                onClick={() => setIsDeleteConfirmationModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="modal-container bg-white  w-full md:w-96 p-6 m-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setIsEditModalOpen(false)}
            ></button>
             <div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className=" bg-red-100 text-red-600 p-1 px-2 hover:bg-red-200  rounded-full text-center float-right"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="p-1 text-center">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">
                Edit Section
              </h3>
              <div className="mb-4">
                <label
                  htmlFor="editSectionName"
                  className="block text-left text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Section Name
                </label>
                <input
                  type="text"
                  id="editSectionName"
                  name="editSectionName"
                  value={sectionToEdit?.name || ""}
                  onChange={(e) =>
                    setSectionToEdit({ ...sectionToEdit, name: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4 flex justify-center ">
                <input
                  type="checkbox"
                  id="editIsDefault"
                  name="editIsDefault"
                  checked={sectionToEdit?.isDefault || false}
                  onChange={(e) =>
                    setSectionToEdit({
                      ...sectionToEdit,
                      isDefault: e.target.checked,
                    })
                  }
                  className="mr-4 p-4 border border-gray-300 rounded-md"
                />
                <label
                  htmlFor="editIsDefault"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Default
                </label>
              </div>
              <button
                type="button"
                className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-72 mx-auto mt-1"
                onClick={() => handleEditSubmit()}
              >
                Save
              </button>
              {/* <button
                type="button"
                className="border border-gray-400 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-full"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Section;
