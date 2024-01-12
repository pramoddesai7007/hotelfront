"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faFileLines, faPaste, faCubes, faBellConcierge, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const handleToggle = () => {
    setIsMobile(!isMobile);
  };

  const home = () => {
    router.push("/dashboard");
  };

  const handleButtonClick = () => {
    // Redirect to the 'reportLogin' page
    router.push('/reportLogin');
  };

  return (
    <div className=" fixed top-0 w-full  z-20">
      <div className="flex items-center h-11 text-white pr-4 md:pr-14 justify-end font-sans bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
        {/* Your content goes here */}



        <div className="md:hidden cursor-pointer mr-4" onClick={handleToggle}>
          <svg viewBox="0 0 10 8" width="30">
            <path
              d="M1 1h8M1 4h 8M1 7h8"
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {isMobile && (
          <div className="absolute top-16 left-0 right-0 bg-gray-200 text-black  flex flex-col z-50">
            {/* Menu Dropdown */}
            <div className="relative group inline-block mt-3">
              <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center  text-black">
                <span className="pr-1 font-semibold flex-0">Order Setting</span>
                <span>
                  <svg
                    className="fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </span>
              </button>

              <ul className="bg-slate-50 border rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top-left min-w-32 z-30">
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  Organisation Details
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  Ac Percentage
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  GST Percentage
                </li>
              </ul>
            </div>

            {/* Bill Setting Dropdown */}
            <div className="relative group inline-block mt-3">
              <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black">
                <span className="pr-1 font-semibold flex-0">Menu</span>
                <span>
                  <svg
                    className="fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </span>
              </button>

              <ul className="bg-slate-50 border rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top-left min-w-32 z-30">
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  Menu List
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  Sub-Menu List
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  Group List
                </li>
              </ul>
            </div>

            <div className="relative group inline-block mt-3">
              <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black">
                <span className="pr-1 font-semibold flex-0">Material Entry</span>
                <span>
                  <svg
                    className="fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </span>
              </button>

              <ul className="bg-slate-50 border rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top-left min-w-32 z-30">
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  GST Master
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  Item Master
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  Purchase Master
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  Stock Outward                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                 Vendor Master
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                 Waiter Master
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                 Unit Master
                </li>
              </ul>
            </div>

            <div className="relative group inline-block mt-3">
              <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black">
                <span className="pr-1 font-semibold flex-0">Table Master</span>
                <span>
                  <svg
                    className="fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </span>
              </button>

              <ul className="bg-slate-50 border rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top-left  z-30">
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  Tables
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-500 whitespace-nowrap">
                  Sections
                </li>
              </ul>
            </div>


          </div>
        )}{" "}

        <div className="hidden md:block  ">
          <div className="flex items-center h-16  text-white pr-14 md:pr-14 justify-end font-sans">
            <div className="relative group inline-block">
              <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-white">
                <FontAwesomeIcon icon={faBellConcierge} size="lg" style={{ color: "#ffff", }} />

                <span className="pr-1 font-semibold flex-1 ml-1">Order Settings</span>
                <span>
                  <svg
                    className="fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </span>
              </button>

              <ul className="bg-gray-100 border border-orange-300 rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 ">
                <li className="rounded-md px-4 py-1 whitespace-nowrap hover:bg-gray-200 ">
                  <Link href="/hotel">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Organisation Details</span>
                    </button>
                  </Link>
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-200 whitespace-nowrap">
                  <Link href="/acForm">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1  text-black font-semibold">Ac Percentage </span>
                    </button>
                  </Link>
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-200 whitespace-nowrap">
                  <Link href="/gst">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Gst </span>
                    </button>
                  </Link>
                </li>

              </ul>
            </div>
            <div className="relative group inline-block">
              <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-white">
                <FontAwesomeIcon icon={faCubes} size="lg" style={{ color: "#ffff", }} />
                <span className="pr-1 font-semibold flex-1 ml-1">Material Entry</span>
                <span>
                  <svg
                    className="fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </span>
              </button>

              <ul className="bg-gray-100 border border-orange-300 rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 ">
                <li className="rounded-md px-4 py-1 hover:bg-gray-200 whitespace-nowrap">
                  <Link href="/gstForm">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">GST Master</span>
                    </button>
                  </Link>
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-200 whitespace-nowrap">
                  <Link href="/itemForm">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Item Master</span>
                    </button>
                  </Link>
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-200 whitespace-nowrap">
                  <Link href="/purchase">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Purchase Master</span>
                    </button>
                  </Link>
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-200 whitespace-nowrap">
                  <Link href="/stockOut">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Stock Outward</span>
                    </button>
                  </Link>
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-200 whitespace-nowrap">
                  <Link href="/supplier">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Vendor Master</span>
                    </button>
                  </Link>
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-200 whitespace-nowrap">
                  <Link href="/waiter">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Waiter Master</span>
                    </button>
                  </Link>
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-200 whitespace-nowrap">
                  <Link href="/unit">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Unit Master</span>
                    </button>
                  </Link>
                </li>
              </ul>
            </div>



            <div className="relative group inline-block   ">
              <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center  text-white">
                <FontAwesomeIcon icon={faPaste} size="lg" style={{ color: "#ffff" }} />

                <span className="pr-1 font-semibold flex-1 ml-1 ">Menu</span>
                <span>
                  <svg
                    className="fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </span>
              </button>

              <ul className="bg-gray-100 border border-orange-300 w-40 rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32">
                <li className="rounded-md px-3 py-1 hover:bg-gray-200">
                  <Link href="/main">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Menu List</span>
                    </button>
                  </Link>
                </li>
                <li className="rounded-md relative px-3 py-1 hover:bg-gray-200">
                  <Link href="/menu">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Sub-Menu List</span>
                    </button>
                  </Link>
                </li>
                <li className="rounded-md relative px-3 py-1 hover:bg-gray-200">
                  <Link href="/group">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Group Menu</span>
                    </button>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="relative group inline-block">
              <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-white">
                <FontAwesomeIcon icon={faTableCellsLarge} size="lg" style={{ color: "#ffff", }} />
                <span className="pr-1 font-semibold flex-1 ml-1">Table Master</span>
                <span>
                  <svg
                    className="fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </span>
              </button>

              <ul className="bg-gray-100 border border-orange-300 rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 ">
                <li className="rounded-md px-4 py-1 hover:bg-gray-200 whitespace-nowrap">
                  <Link href="/tables">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Tables </span>
                    </button>
                  </Link>
                </li>
                <li className="rounded-md px-4 py-1 hover:bg-gray-200 whitespace-nowrap">
                  <Link href="/section">
                    <button className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-black border-t">
                      <span className="pr-1 flex-1 text-black font-semibold">Sections</span>
                    </button>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="relative group inline-block">
              <button
                className="outline-none focus:outline-none px-3 py-1 rounded-md flex items-center text-white"
                onClick={handleButtonClick}
              >
                <FontAwesomeIcon icon={faFileLines} size="lg" style={{ color: "#ffff", }} />
                <span className="pr-1 font-semibold flex-1 ml-1">Reports</span>
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <FontAwesomeIcon
            icon={faHouse}
            onClick={home}
            className="cursor-pointer text-xl text-white"
          />
        </div>
      </div>
    </div>

  );
};

export default Navbar;
