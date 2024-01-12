"use client";
import { useRouter } from "next/navigation";
import {faLayerGroup,faObjectGroup,faBellConcierge,faListUl,faTableCellsLarge,faTableList,
faSignOutAlt}from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

const Dashboard = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Perform any logout logic here
    // ...

    // Redirect to the login page or any other desired page
    router.push("/login");
  };

  return (
    <>
      <Navbar />
      <div>
        <section className="text-gray-600 body-font m-5 p-5 justify-center  font-sans mt-40">
          <div className="container px-5 py-20 mx-auto">
            <div className="flex flex-wrap -m-4">
              <div className="lg:w-1/6 md:w-1/2 p-4 w-full">
                <Link href="/section">
                  <div className="relative h-32 rounded overflow-hidden shadow-md bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className=" rounded-full bg-orange-100 p-4 shadow-md">
                      {" "}
                      <FontAwesomeIcon
                        icon={faLayerGroup}
                        size="2xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-gray font-semibold mb-1">Sections</h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="lg:w-1/6 md:w-1/2 p-4 w-full">
                <Link href="/tables">
                  <div className="relative h-32 rounded overflow-hidden shadow-md bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className=" rounded-full bg-orange-100 p-4 shadow-md ">
                      {" "}
                      <FontAwesomeIcon
                        icon={faTableCellsLarge}
                        size="2xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-gray font-semibold mb-1">Tables</h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="lg:w-1/6 md:w-1/2 p-4 w-full">
                <Link href="/main">
                  <div className="relative h-32 rounded overflow-hidden shadow-md bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className=" rounded-full bg-orange-100 p-4 shadow-md">
                      {" "}
                      <FontAwesomeIcon
                        icon={faTableList}
                        size="2xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-gray font-semibold mb-1">
                        {" "}
                        Main Menu{" "}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="lg:w-1/6 md:w-1/2 p-4 w-full">
                <Link href="/menu">
                  <div className="relative h-32 rounded overflow-hidden shadow-md bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className=" rounded-full bg-orange-100 p-4 shadow-md">
                      {" "}
                      <FontAwesomeIcon
                        icon={faListUl}
                        size="2xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-gray font-semibold mb-1">
                        Menu List
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="lg:w-1/6 md:w-1/2 p-4 w-full">
                <Link href="/group">
                  <div className="relative h-32 rounded overflow-hidden shadow-md bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className=" rounded-full bg-orange-100 p-4 shadow-md">
                      {" "}
                      <FontAwesomeIcon
                        icon={faObjectGroup}
                        size="2xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-gray font-semibold mb-1">
                        Group Menu
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="lg:w-1/6 md:w-1/2 p-4 w-full">
                <Link href="/bill">
                  <div className="relative h-32 rounded overflow-hidden shadow-md bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className=" rounded-full bg-orange-100 p-4 shadow-md">
                      {" "}
                      <FontAwesomeIcon
                        icon={faBellConcierge}
                        size="2xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-gray font-semibold mb-1">Order</h3>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Add the logout button at the bottom right */}
              <div className="fixed bottom-4 right-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-100 hover:bg-red-200 text-red-600 py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-red font-bold"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
    </>
  );
};

export default Dashboard;