"use client";
import {
  faLayerGroup,
  faObjectGroup,
  faBellConcierge,
  faListUl,
  faTableCellsLarge,
  faList,
  faShoppingCart,
  faTableList,
  faCubes,
  faMoneyBill,
  faClock,
  faChair,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

const Report = () => {
  return (
    <>
      <Navbar />
      <div>
        <section className="text-gray-600 body-font m-5 p-5 justify-center  font-sans mt-12">
          <div className="container px-5 py-1 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4">
                <Link href="/reports">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faClock}
                        size="3x" color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">Daily Report</h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4">
                <Link href="/paymentReports">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full  bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faMoneyBill}
                        size="3x" color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Payment Reports
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4">
                <Link href="/menuReports">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full  bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon icon={faList} size="3x" color="orange" />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Menu-wise Reports
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4">
                <Link href="/stockList">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full  bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon icon={faCubes} size="3x" color="orange" />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Stock Reports
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4">
                <Link href="/purchaseReport">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full  bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faShoppingCart}
                        size="3x" color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Purchase Reports
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4">
                <Link href="/reports">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full  bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon icon={faChair} size="3x" color="orange" />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Edit Bill Reports                      
                        </h3>
                    </div>
                  </div>
                </Link>
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Report;