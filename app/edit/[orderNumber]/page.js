"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const calculateUpdatedACPercentageAmount = (
  isACEnabled,
  acPercentageAmount,
  acPercentage,
  currentOrder,
  sectionACPercentage
) => {
  if (
    isACEnabled &&
    (!acPercentageAmount || acPercentageAmount === 0) &&
    currentOrder
  ) {
    const acPercentageDecimal = sectionACPercentage / 100;
    return calculateTotal(currentOrder).subtotal * acPercentageDecimal;
  } else {
    return acPercentageAmount;
  }
};

const EditOrderPage = ({ params }) => {
  const { orderNumber } = params;
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef(null);
  const [isACEnabled, setIsACEnabled] = useState(true);
  const [isGSTEnabled, setIsGSTEnabled] = useState(true); // State for enabling/disabling GST
  const [order, setOrder] = useState(null);
  const [acPercentage, setACPercentage] = useState(0);
  const [acPercentageAmount, setACPercentageAmount] = useState(0);
  const router=useRouter()
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        if (orderNumber) {
          console.log(orderNumber)
          const orderResponse = await axios.get(
            `https://hotelback-6pw8.onrender.com/api/order/get/order/${orderNumber}`
          );
          const orderData = orderResponse.data;
          console.log(orderData)
          // Fetch the tableId from the order data
          const tableId = orderData.tableId;

          // Fetch the section information based on the tableId
          const sectionResponse = await axios.get(
            `https://hotelback-6pw8.onrender.com/api/section/sectionlist/${tableId}`
          );
          const sectionInfo = sectionResponse.data;

          // Set the AC percentage based on the section information
          const fetchedACPercentage = sectionInfo.acPercentage;
          setACPercentage(fetchedACPercentage);

          // Set the AC percentage amount based on order data
          // Inside the fetchOrderData function
          const fetchedACPercentageFromOrder =
            orderData.acPercentageAmount || sectionInfo.acPercentage || 0;
          setACPercentageAmount(fetchedACPercentageFromOrder);
          setIsACEnabled(fetchedACPercentageFromOrder > 0);

          // Set the initial state of currentOrder with items from the fetched order
          if (orderData.items) {
            setCurrentOrder(orderData.items);
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrderData();
  }, [orderNumber]);

  const filterMenus = (menu) => {
    const searchTerm = searchInput.toLowerCase().trim();

    if (searchTerm === "") {
      return true;
    }

    const searchTermIsNumber = !isNaN(searchTerm);

    if (searchTermIsNumber) {
      return menu.uniqueId === searchTerm;
    }

    return menu.name.toLowerCase().includes(searchTerm);
  };

  const addToOrder = useCallback(
    (product) => {
      setCurrentOrder((prevOrder) => {
        const existingItem = prevOrder.find(
          (item) => item.name === product.name
        );

        if (existingItem) {
          const updatedOrder = prevOrder.map((item) =>
            item.name === existingItem.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          return updatedOrder;
        } else {
          return [...prevOrder, { ...product, quantity: 1 }];
        }
      });
    },
    [setCurrentOrder]
  );

  const removeFromOrder = (product) => {
    setCurrentOrder((prevOrder) => {
      const existingItem = prevOrder.find((item) => item.name === product.name);

      if (existingItem) {
        const updatedOrder = prevOrder.map((item) =>
          item.name === existingItem.name
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 }
            : item
        );

        const filteredOrder = updatedOrder.filter((item) => item.quantity > 0);

        return filteredOrder;
      } else {
        return prevOrder;
      }
    });
  };

  // const handlePrintBill = async () => {
  //   try {
  //     const orderResponse = await axios.get(
  //       `https://hotelback-6pw8.onrender.com/api/order/get/order/${orderNumber}`
  //     );
  //     const orderData = orderResponse.data;

  //     // Fetch the tableId from the order data
  //     const tableId = orderData.tableId;

  //     // Construct the API endpoint for updating the order based on order number
  //     const updateOrderEndpoint = `https://hotelback-6pw8.onrender.com/api/order/update-order-by-number/${orderNumber}`;

  //     // Use the tableId from the order data
  //     const orderDataToUpdate = {
  //       tableId: orderData.tableId,
  //       items: currentOrder.map((orderItem) => ({
  //         name: orderItem.name,
  //         quantity: orderItem.quantity,
  //         price: orderItem.price,
  //       })),
  //       subtotal: calculateTotal(currentOrder).subtotal,
  //       CGST: calculateTotal(currentOrder).CGST,
  //       SGST: calculateTotal(currentOrder).SGST,
  //       acPercentageAmount: calculateUpdatedACPercentageAmount(
  //         isACEnabled,
  //         acPercentageAmount,
  //         acPercentage,
  //         currentOrder
  //       ),
  //       total: calculateTotal(currentOrder).total,
  //       isTemporary: true, // Set isTemporary to false explicitly
  //       isPrint: 1
  //     };

  //     // Update the order based on the order number
  //     await axios.patch(updateOrderEndpoint, orderDataToUpdate);

  //     // Remove the local storage item for the specific table
  //     localStorage.removeItem(`savedBills_${tableId}`);
      
  //     router.push('/bill')
  //     // ... (rest of the code remains unchanged)
  //   } catch (error) {
  //     console.error("Error preparing order:", error);
  //   }
  // };

  const handlePrintBill = async () => {
    try {
      // Fetch the initial order data
      const initialOrderResponse = await axios.get(
        `https://hotelback-6pw8.onrender.com/api/order/get/order/${orderNumber}`
      );
      const initialOrderData = initialOrderResponse.data;
  
      // Log the initial state of the order before any updates
      await axios.post(`https://hotelback-6pw8.onrender.com/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: initialOrderData,
      });
  
      // Continue with the rest of the code
  
      // Fetch the order again if needed
      const orderResponse = await axios.get(
        `https://hotelback-6pw8.onrender.com/api/order/get/order/${orderNumber}`
      );
      const orderData = orderResponse.data;
  
      // Fetch the tableId from the order data
      const tableId = orderData.tableId;
  
      // Construct the API endpoint for updating the order based on order number
      const updateOrderEndpoint = `https://hotelback-6pw8.onrender.com/api/order/update-order-by-number/${orderNumber}`;
  
      // Use the tableId from the order data
      const orderDataToUpdate = {
        tableId: orderData.tableId,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price,
        })),
        subtotal: calculateTotal(currentOrder).subtotal,
        CGST: calculateTotal(currentOrder).CGST,
        SGST: calculateTotal(currentOrder).SGST,
        acPercentageAmount: calculateUpdatedACPercentageAmount(
          isACEnabled,
          acPercentageAmount,
          acPercentage,
          currentOrder
        ),
        total: calculateTotal(currentOrder).total,
        isTemporary: true, // Set isTemporary to false explicitly
        isPrint: 1,
      };
  
      // Update the order based on the order number
      await axios.patch(updateOrderEndpoint, orderDataToUpdate);
  
      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
  
      // Redirect to the bill page
      router.push('/bill');
  
      // ... (rest of the code remains unchanged)
    } catch (error) {
      console.error("Error preparing order:", error);
    }
  };
  
  useEffect(() => {
    axios
      .get("https://hotelback-6pw8.onrender.com/api/main")
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    axios
      .get("https://hotelback-6pw8.onrender.com/api/menu/menus/list")
      .then((response) => {
        const menusArray = response.data;
        setMenus(menusArray);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    if (category === null) {
      axios
        .get("https://hotelback-6pw8.onrender.com/api/menu/menus/list")
        .then((response) => {
          setMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    } else {
      axios
        .get(`https://hotelback-6pw8.onrender.com/api/menu/menulist/${category._id}`)
        .then((response) => {
          setMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  };

  const calculateTotal = (currentOrder) => {
    if (!currentOrder) {
      return {
        subtotal: 0,
        SGST: 0,
        CGST: 0,
        acAmount: 0,
        total: 0,
        totalQuantity: 0,
      };
    }
    const subtotal = currentOrder.reduce(
      (acc, orderItem) => acc + orderItem.price * orderItem.quantity,
      0
    );

    // No need to calculate GST if it's not enabled
    const GSTRate = isGSTEnabled ? gstPercentage / 100 : 0;

    const CGST = (GSTRate / 2) * subtotal;
    const SGST = (GSTRate / 2) * subtotal;

    // Use acPercentageAmount directly, no need to recalculate
    const acAmount = isACEnabled ? acPercentageAmount || 0 : 0;

    const total = subtotal + CGST + SGST + acAmount;
    const totalQuantity = currentOrder.reduce(
      (acc, orderItem) => acc + orderItem.quantity,
      0
    );

    return {
      subtotal: subtotal.toFixed(2),
      SGST: SGST.toFixed(2),
      CGST: CGST.toFixed(2),
      acAmount: acAmount.toFixed(2),
      total: total.toFixed(2),
      totalQuantity: totalQuantity,
    };
  };

  const [gstPercentage, setGSTPercentage] = useState(0); // Add this line for the GST percentage

  useEffect(() => {
    const hotelId = "65798094e013bdaca198016c";

    const fetchHotelInfo = async () => {
      try {
        const response = await axios.get(
          `https://hotelback-6pw8.onrender.com/api/hotel/get/${hotelId}`
        );
        setHotelInfo(response.data);
        setGSTPercentage(response.data.gstPercentage || 0);
      } catch (error) {
        console.error("Error fetching hotel information:", error);

        // Log additional information about the error
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received. Request:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      }
    };

    fetchHotelInfo();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const updateOrderItem = (updatedItem) => {
    setCurrentOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.name === updatedItem.name
          ? { ...item, quantity: updatedItem.quantity }
          : item
      )
    );
    closeEditOrderModal();
  };

  useEffect(() => {
    const hotelId = "65798094e013bdaca198016c";

    const fetchHotelInfo = async () => {
      try {
        const response = await axios.get(
          `https://hotelback-6pw8.onrender.com/api/hotel/get/${hotelId}`
        );
        setHotelInfo(response.data);
      } catch (error) {
        console.error("Error fetching hotel information:", error);

        // Log additional information about the error
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received. Request:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      }
    };

    fetchHotelInfo();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div className=" font-sans ">
      {/* <!-- component --> */}
      <div className="container mx-auto  bg-white">
        <div className="flex lg:flex-row  shadow-lg">
          <div className="w-1/2 lg:w-3/5 min-h-screen shadow-lg ">
            {/* <!-- header --> */}
            <div className="flex flex-row justify-between items-center px-5 mt-8">
              <div className="text-gray-800">
                <div className="font-bold text-xl">{hotelInfo?.hotelName}</div>
                <span className="text-xs">{hotelInfo?.address}</span>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-center mr-4">
                  <div className="font-light text-gray-500">last synced</div>
                  <span className="font-semibold">2 mins ago</span>
                </div>
                <div>
                  <Link
                    href={"/bill"}
                    className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded"
                  >
                    Tables
                  </Link>
                </div>
              </div>
            </div>
            {/* <!-- end header --> */}

            {/* <!-- categories --> */}
            <div className="mt-5 flex flex-row px-5 overflow-x-auto whitespace-nowrap">
              <span
                key="all-items"
                className={`cursor-pointer px-5 py-1 rounded-2xl text-sm font-semibold mr-4 ${selectedCategory === null ? "bg-yellow-500 text-white" : ""
                  }`}
                onClick={() => handleCategoryClick(null)}
              >
                All Menu
              </span>
              {categories.map((category) => (
                <span
                  key={category._id}
                  className={`whitespace-nowrap cursor-pointer px-5 py-1 rounded-2xl text-sm font-semibold${selectedCategory === category
                    ? "bg-yellow-500 text-white"
                    : ""
                    }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </span>
              ))}
            </div>

            <div className="mt-5 flex justify-start px-5">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Menu / Id..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                // onKeyDown={handleSearchInputKeyDown}
                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500 w-48"
              />
            </div>

            <div className="cursor-pointer grid grid-cols-2 bg-white  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-5 mt-5 overflow-scroll max-h-[calc(75vh-2rem)]  shadow-md-">
              {(menus.menus || menus)
                .filter(filterMenus) // Apply the filterMenus function
                .map((product, index) => (
                  <div
                    key={product._id}
                    className="px-3 py-3 flex flex-col border shadow-md hover:bg-indigo-100 border-gray-200 rounded-md h-32 justify-between text-sm"
                    onClick={() => addToOrder(product)}
                    tabIndex={0}
                  // ref={(el) => (menuItemRefs.current[index] = el)} // Save the ref to the array
                  // onKeyDown={(e) => handleMenuItemKeyDown(e, product)} // Handle keydown event
                  >
                    <div>
                      <div className="font-bold text-gray-800 text-sm  lg:text-xl">
                        {product.name}
                      </div>
                      <div className="font-light text-sm text-gray-400">{`MenuId: ${product.uniqueId || "Yes"
                        }`}</div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <span className="self-end font-bold text-lg text-yellow-500">{`₹${product.price}`}</span>
                      <img
                        src={`/tray.png`}
                        className="h-8 w-8 object-cover rounded-md"
                        alt=""
                      />
                    </div>
                  </div>
                ))}
            </div>
            {/* <!-- end products --> */}
          </div>
          <div className="w-1/2 lg:w-2/5 mt-2  bg-indigo-100">
            {/* <!-- header --> */}
            <div className="flex flex-row items-center justify-between px-2 ">
              <div className="font-bold text-xl">Edit Order</div>
            </div>
            {/* <!-- end header --> */}
            {/* <!-- order list --> */}
            <div className="p-2  overflow-y-auto lg:h-1/2 md:h-72 bg-indigo-100 mt-1">
              {currentOrder.map((orderItem) => (
                <div
                  key={orderItem._id}
                  className="flex flex-row justify-between items-center mb-4"
                >
                  <div className="flex flex-row items-center w-3/5">
                    <div className="flex items-center h-full ">
                      <img
                        // src={`https://hotelback-6pw8.onrender.com/${orderItem.imageUrl}`}
                        src={`/tray.png`}
                        className="w-7 h-7 object-cover rounded-md"
                        alt=""
                      />
                      <span className="ml-4 font-semibold text-sm  lg:text-base">
                        {orderItem.name}
                      </span>
                    </div>
                  </div>
                  <div className=" flex justify-between font-bold ">
                    <span
                      className=" rounded-sm  cursor-pointer bg-indigo-300 lg:py-1 lg:px-3 py-1 px-1 font-bold"
                      onClick={() => removeFromOrder(orderItem)}
                    >
                      -
                    </span>
                    <span className="font-semibold mx-4">
                      {orderItem.quantity}
                    </span>
                    <span
                      className=" rounded-sm  cursor-pointer  bg-indigo-300 lg:py-1 lg:px-2 py-1 px-1 font-bold"
                      onClick={() => addToOrder(orderItem)}
                    >
                      +
                    </span>
                  </div>
                  <div className="font-semibold  text-sm lg:text-base text-center">
                    {`₹${(orderItem.price * orderItem.quantity).toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>

            {/* <!-- end order list --> */}
            {/* <!-- totalItems --> */}
            <div className="px-5  lg:mt-0  ">
              <div className="py-4 rounded-md shadow-md bg-white">
                <div className="px-4 flex justify-between ">
                  <span className="font-semibold text-sm">Subtotal</span>
                  <span className="font-bold">
                    ₹{calculateTotal(currentOrder).subtotal}
                  </span>
                </div>

                <div className="px-4 flex justify-between ">
                  <span className="font-semibold text-sm">AC</span>
                  <span className="font-bold">
                    <input
                      className="cursor-pointer"
                      type="checkbox"
                      checked={
                        acPercentageAmount > 0 ? isACEnabled : !isACEnabled
                      } // Check only if acPercentageAmount is greater than 0
                      onChange={() => setIsACEnabled(!isACEnabled)}
                    />
                  </span>
                </div>
                {acPercentageAmount > 0 && ( // Render AC Amount section only if acPercentageAmount is greater than 0
                  <div className="px-4 flex justify-between ">
                    <span className="font-semibold text-sm">AC Charges</span>
                    <span className="font-bold">
                      ({acPercentage}%) ₹{acPercentageAmount}
                    </span>
                  </div>
                )}

                {/* <!-- GST checkbox --> */}
                <div className="px-4 flex justify-between">
                  <span className="font-semibold text-sm">GST</span>
                  <span className="font-bold">
                    <input
                      className="cursor-pointer"
                      type="checkbox"
                      checked={isGSTEnabled}
                      onChange={() => setIsGSTEnabled(!isGSTEnabled)}
                    />
                  </span>
                </div>

                <div className="px-4 flex justify-between ">
                  <span className="font-semibold text-sm">CGST</span>
                  <span className="font-bold">
                    ({gstPercentage / 2}%) ₹{calculateTotal(currentOrder).CGST}
                  </span>
                </div>
                <div className="px-4 flex justify-between ">
                  <span className="font-semibold text-sm">SGST</span>
                  <span className="font-bold">
                    ({gstPercentage / 2}%) ₹{calculateTotal(currentOrder).SGST}
                  </span>
                </div>
                <div className="border-t-2 mt-3 lg:py-2 lg:px-4 py-1 px-1 flex items-center justify-between">
                  <span className="font-bold text-xl lg:text-2xl">Total</span>
                  <span className="font-bold text-xl lg:text-2xl">
                    ₹{calculateTotal(currentOrder).total}
                  </span>
                  {/* <span className="font-bold text-2xl">₹{Math.ceil(Number(calculateTotal().total)).toFixed(2)}</span> */}
                </div>
              </div>
            </div>
            {/* <!-- end total --> */}
            <div className=" border-t-2">
              <div className="px-5  text-left text-sm  text-gray-500 font-sans font-semibold mt-2">
                Total Items: {calculateTotal(currentOrder).totalQuantity}
              </div>

              {/* <!-- button pay--> */}
              <div className="flex px-5 mt-2 justify-between">
                {/* <div
                                className="px-8 py-2 rounded-md shadow-lg text-center bg-green-500 text-white font-semibold cursor-pointer text-sm"
                            // onClick={saveBill}
                            >
                                Save / KOT
                            </div> */}
                <div
                  className="w-full px-8 py-2 rounded-md shadow-lg text-center bg-yellow-500 text-white font-semibold cursor-pointer text-sm"
                  onClick={handlePrintBill}
                >
                  SAVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderPage; 