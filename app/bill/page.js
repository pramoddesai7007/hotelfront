'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Image from "next/image";
import PaymentModal from "../payment/page";
import Tables from "../tables/page";

const Bill = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [tables, setTables] = useState([]);
  const [sections, setSections] = useState([]);
  const [bills, setBills] = useState({});
  const [displayedTables, setDisplayedTables] = useState([]);
  const [defaultSectionId, setDefaultSectionId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [selectedTable, setSelectedTable] = useState(null);
  const [tableInfo, setTableInfo] = useState({ tableName: "", totalAmount: 0 });
  const [orderID, setOrderID] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);

  const openPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleSectionRadioChange = (sectionId) => {
    setSelectedSection((prevSection) =>
      prevSection === sectionId ? null : sectionId
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsResponse = await axios.get(
          "https://hotelback-6pw8.onrender.com/api/section"
        );
        setSections(sectionsResponse.data);

        const tablesResponse = await axios.get(
          "https://hotelback-6pw8.onrender.com/api/table/tables"
        );
        setTables(tablesResponse.data);

        const defaultSection = sectionsResponse.data.find(
          (section) => section.isDefault
        );
        if (defaultSection) {
          setDefaultSectionId(defaultSection._id);
          setSelectedSection(defaultSection._id);
        }

        const billsData = await Promise.all(
          tablesResponse.data.map(async (table) => {
            const billsResponse = await axios.get(
              `https://hotelback-6pw8.onrender.com/api/order/order/${table._id}`
            );

            const temporaryBills = billsResponse.data.filter(
              (bill) => bill.isTemporary
            );
            const latestBill =
              temporaryBills.length > 0 ? temporaryBills[0] : null;

            return { [table._id]: latestBill };
          })
        );

        const mergedBills = Object.assign({}, ...billsData);
        setBills(mergedBills);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };


    fetchData();
  }, []); // Remove dependencies to fetch data once on component mount

  useEffect(() => {
    const updateDisplayedTables = () => {
      if (selectedSection) {
        const filteredTables = tables.filter(
          (table) => table.section._id === selectedSection
        );
        setDisplayedTables(filteredTables);
      } else if (defaultSectionId) {
        const defaultTables = tables.filter(
          (table) => table.section._id === defaultSectionId
        );
        setDisplayedTables(defaultTables);
      } else {
        setDisplayedTables([]);
      }
    };

    updateDisplayedTables();
  }, [selectedSection, defaultSectionId, tables]);

  const handlePaymentModalOpen = (table) => {
    setSelectedTable(table);
    const totalAmount = bills[table._id]?.total || 0;
    setTableInfo({
      tableName: table.tableName,
      totalAmount: totalAmount,
    });

    setOrderID(bills[table._id]?._id);
    setOrderNumber(bills[table._id]?.orderNumber);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedTable(null);
    setTableInfo({ tableName: "", totalAmount: 0 });
    setOrderID(null);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-10 md:px-1 lg:px-1 xl:px-1 justify-around font-sans mt-20">
        <div>
          <ul className="flex flex-col md:flex-row md:justify-between rounded-2xl ">
            {sections.map((section) => (
              <li
                key={section._id}
                className="mb-2 md:mb-0 bg-indigo-700 p-1 rounded-2xl px-4 hover:bg-indigo-500"
              >
                <input
                  className="cursor-pointer"
                  type="radio"
                  id={section._id}
                  name="section"
                  checked={selectedSection === section._id}
                  onChange={() => handleSectionRadioChange(section._id)}
                />
                <label
                  className="cursor-pointer block md:inline-block bg-indigo-700 p-2 text-white hover:bg-indigo-500"
                  htmlFor={section._id}
                >
                  {section.name}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8 gap-7 mt-4 p-9">
          {displayedTables.map((table) => (
            <div key={table._id}>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold -mt-3">
                {table.tableName}
              </h3>
              <div
                className={`bg-white cursor-pointer overflow-y-auto p-2 rounded-md border-2 
                ${bills[table._id]?.isTemporary
                    ? bills[table._id]?.isPrint === 1
                      ? "border-blue-600"
                        : "border-orange-400"
                        : "border-gray-500"
                  } w-full h-44 transform transition-transform hover:scale-150`}
                onClick={() => {
                  if (
                    bills[table._id]?.isTemporary &&
                    bills[table._id]?.isPrint === 1
                  ) {
                    handlePaymentModalOpen(table);
                  } else {
                    window.location.href = `/order/${table._id}`;
                  }
                }}
              >
                {bills[table._id] && bills[table._id].isTemporary ? (
                  <>
                    {bills[table._id]?.orderNumber}
                    {bills[table._id].items.map((item, index) => (
                      <div
                        key={index}
                        className="text-xs text-blue-900 font-semibold"
                      >
                        {item.name} = {item.quantity}
                      </div>
                    ))}
                    <div className="font-semibold mt-3 text-xs text-blue-800">
                      Amount: {bills[table._id].total}
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center items-center text-center h-36">
                    <Image
                      src="/plate.png"
                      alt="logo"
                      height={60}
                      width={60}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isPaymentModalOpen && (
            <PaymentModal
              onClose={handlePaymentModalClose}
              tableName={tableInfo.tableName}
              totalAmount={tableInfo.totalAmount}
              orderID={orderID}
              orderNumber={orderNumber}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Bill;