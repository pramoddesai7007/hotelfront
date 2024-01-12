"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";

const PurchaseReport = () => {
  const [purchases, setPurchases] = useState([]);
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]); // State for vendors
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [mainGrandTotal, setMainGrandTotal] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalGrandTotal, setTotalGrandTotal] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchBillNumber, setSearchBillNumber] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(""); //

  useEffect(() => {
    // Call the handleSearch function whenever startDate or endDate changes
    handleSearch();
  }, [startDate, endDate]);


  const handleSearch = () => {
    const filteredByOtherCriteria = purchases.filter((purchase) =>
      purchase.billNo.includes(searchBillNumber)
    );

    // Filter by selected vendor
    const filteredByVendor = selectedVendor
      ? filteredByOtherCriteria.filter(
          (purchase) =>
            purchase.vendorName.toLowerCase() === selectedVendor.toLowerCase()
        )
      : filteredByOtherCriteria;

    const filteredByDate = filteredByVendor.filter((purchase) => {
      const paymentDate = new Date(purchase.date).toISOString().split("T")[0];
      const start = startDate || "01-01-0000";
      const end = endDate || "31-12-9999";
      return paymentDate >= start && paymentDate <= end;
      
    });

    setFilteredPurchases(filteredByDate);
  };
  const handleReset = () => {
    // Function to get the formatted date
    const getFormattedDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    // Set the default values for startDate and endDate
    const defaultStartDate = getFormattedDate(new Date());
    const defaultEndDate = getFormattedDate(new Date());
  
    // Reset to default values
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  
    setSearchBillNumber("");
    setFilteredPurchases(purchases);
  };
  
  
  useEffect(() => {
    const totalBalances = filteredPurchases.map((purchase) =>
      parseFloat(purchase.balance || 0)
    );
    const totalBalance = totalBalances.reduce(
      (acc, balance) => acc + balance,
      0
    );
    setTotalBalance(totalBalance);
  }, [filteredPurchases]);

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const initializeData = () => {
    // Set initial values for startDate and endDate as the current date
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
    setStartDate(formattedDate);
    setEndDate(formattedDate);
  
    // Trigger a search with the current date
    handleSearch();
  };

  useEffect(() => {
    // Call the initializeData function before fetching data
    initializeData();

    const fetchData = async () => {
      try {
        const purchasesResponse = await axios.get("https://hotelback-6pw8.onrender.com/api/purchase/purchases");
        setPurchases(purchasesResponse.data);
        setFilteredPurchases(purchasesResponse.data);

        const itemsResponse = await axios.get("https://hotelback-6pw8.onrender.com/api/item/items");
        setItems(itemsResponse.data);

        const vendorsResponse = await axios.get("https://hotelback-6pw8.onrender.com/api/supplier/suppliers");
        setVendors(vendorsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  

  useEffect(() => {
    setMainGrandTotal(calculateMainGrandTotal());
  }, [filteredPurchases]);

  useEffect(() => {
    const grandTotals = purchases.map((purchase) =>
      parseFloat(calculateGrandTotal(purchase))
    );
    const totalGrandTotal = grandTotals.reduce(
      (acc, grandTotal) => acc + grandTotal,
      0
    );
    setTotalGrandTotal(totalGrandTotal);
  }, [purchases]);

  useEffect(() => {
    const totalBalances = purchases.map((purchase) =>
      parseFloat(purchase.balance || 0)
    );
    const totalBalance = totalBalances.reduce(
      (acc, balance) => acc + balance,
      0
    );
    setTotalBalance(totalBalance);
  }, [purchases]);

  const calculateGrandTotal = (purchase) => {
    const grandTotal =
      purchase.subtotal - purchase.discount + purchase.gstAmount;
    const formattedGrandTotal = grandTotal.toFixed(2);
    return formattedGrandTotal;
  };

  const calculateMainGrandTotal = () => {
    const grandTotals = filteredPurchases.map((purchase) =>
      parseFloat(calculateGrandTotal(purchase))
    );
    return grandTotals.reduce((acc, grandTotal) => acc + grandTotal, 0);
  };
  useEffect(() => {
    const grandTotals = purchases.map((purchase) =>
      parseFloat(calculateGrandTotal(purchase))
    );
    const totalGrandTotal = grandTotals.reduce(
      (acc, grandTotal) => acc + grandTotal,
      0
    );
    setTotalGrandTotal(totalGrandTotal);
  }, [purchases]);

  useEffect(() => {
    const totalBalances = purchases.map((purchase) =>
      parseFloat(purchase.balance || 0)
    );
    const totalBalance = totalBalances.reduce(
      (acc, balance) => acc + balance,
      0
    );
    setTotalBalance(totalBalance);
  }, [purchases]);

  const handleExportToExcel = () => {
    // Format the data for Excel export
    const formattedPurchases = filteredPurchases.map((purchase, index) => ({
      "SR No": index + 1,
      "Bill No": purchase.billNo,
      Date: purchase.date,
      "Item Name": purchase.items.map((item) => item.productName).join(", "),
      QTY: purchase.items.reduce((qty, item) => qty + item.quantity, 0),
      Unit: purchase.items.map((item) => item.unit).join(", "),
      Subtotal: purchase.subtotal.toFixed(2),
      Discount: purchase.discount.toFixed(2),
      GST: purchase.gst.toFixed(2),
      "GST Amount": purchase.gstAmount.toFixed(2),
      "Paid Amount": purchase.paidAmount.toFixed(2),
      "Grand Total": calculateGrandTotal(purchase),
      Balance: purchase.balance.toFixed(2),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedPurchases);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchase Report");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "purchase_report.xlsx";
    a.click();
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 mt-20">
        <div className="flex flex-wrap items-center mb-4 justify-center text-left">
          <label className="mr-2 text-gray-600">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md p-2 text-gray-700 mb-2 sm:mb-0"
          />
          <label className="mx-2 text-gray-600">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md p-2 text-gray-700 mb-2 sm:mb-0"
          />
          <input
            type="text"
            placeholder="Search Date/Bill Wise Report"
            value={searchBillNumber}
            onChange={(e) => setSearchBillNumber(e.target.value)}
            className="border rounded-md p-2 text-gray-700 text-sm mb-2 sm:mb-0 ml-3"
          />
          <button
            className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
            onClick={handleExportToExcel}
          >
            Export to Excel
          </button>
        </div>
        <div className=" flex justify-center flex-col">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Vendor Wise Purchase Reports
          </h1>
          {selectedVendor && (
            <p className="text-lg mb-2">
              Showing reports for Vendor: <strong>{selectedVendor}</strong>
            </p>
          )}

          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="border rounded-md p-2 text-gray-700 mb-2 sm:mb-0 w-fit justify-center flex"
          >
            <option value="">All Vendors</option>
            {vendors.map((vendor) => (
              <option key={vendor._id} value={vendor.vendorName}>
                {vendor.vendorName}
              </option>
            ))}
          </select>
        </div>
        <div className="table-container max-h-[400px] overflow-y-auto">
        <table
          className="min-w-full bg-white border border-gray-300 text-left align-middle overflow-x-auto overflow-scroll"
        >
          <thead>
            <tr className=" text-left align-middle bg-orange-100 text-orange-600 ">
              <th className="py-2 px-4 border-b">SR No</th>
              <th className="py-2 px-4 border-b">Bill No</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Item Name</th>
              <th className="py-2 px-4 border-b">QTY</th>
              <th className="py-2 px-4 border-b">Unit</th>
              <th className="py-2 px-4 border-b">Subtotal</th>
              <th className="py-2 px-4 border-b">Discount</th>
  
              <th className="py-2 px-4 border-b">GST Amt</th>
              <th className="py-2 px-4 border-b">paid Amt</th>
              <th className="py-2 px-4 border-b">Grand Total</th>
              <th className="py-2 px-4 border-b">Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map((purchase, index) => (
              <React.Fragment key={purchase._id}>
                {purchase.items.map((item, itemIndex) => (
                  <tr key={`${purchase._id}-${itemIndex}`} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{itemIndex === 0 ? purchase.billNo : ""}</td>
                    <td className="py-2 px-4 border-b">
                      {getFormattedDate(purchase.date)}
                    </td>
                    <td className="py-2 px-4 border-b">{item.productName}</td>
                    <td className="py-2 px-4 border-b">
                      {item.quantity ? item.quantity.toFixed(2).padStart(5, "0") : "00.00"}
                    </td>
                    <td className="py-2 px-4 border-b">{item.unit}</td>
                    {/* Add more columns for other item fields */}
                    <td className="py-2 px-4 border-b">
                      {purchase.subtotal
                        ? purchase.subtotal.toFixed(2).padStart(5, "0")
                        : "00.00"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {purchase.discount
                        ? purchase.discount.toFixed(2).padStart(5, "0")
                        : "00.00"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {purchase.gstAmount
                        ? purchase.gstAmount.toFixed(2).padStart(5, "0")
                        : "00.00"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {purchase.paidAmount
                        ? purchase.paidAmount.toFixed(2).padStart(5, "0")
                        : "00.00"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {calculateGrandTotal(purchase)}
                    </td>
                    <td className="py-2 px-4 border-b text-red-500">
                      {purchase.balance
                        ? purchase.balance.toFixed(2).padStart(5, "0")
                        : "00.00"}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
        <div className="mt-2 sm:float-right border p-4 flex s text-red-500">
          <h2 className="text-black">
            {selectedVendor ? `${selectedVendor} ` : "All Vendors "}Balance
          </h2>
          <p className="font-bold ml-2">{totalBalance.toFixed(2)}</p>
        </div>
        <div className="mt-2 sm:float-right border p-4 flex s">
          <h2 className="">Main Grand Total :</h2>
          <p className=" font-bold text-green-600">{mainGrandTotal.toFixed(2)}</p>
        </div>
      </div>
    </>
  );
};

export default PurchaseReport;