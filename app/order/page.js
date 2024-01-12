"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PaymentModal from "../payment/page";

const Billing = ({ tableId, acPercentage }) => {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [tableInfo, setTableInfo] = useState(null); // New state for table information
  const [hotelInfo, setHotelInfo] = useState(null); // New state for hotel information
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef(null); // Create a ref for the search input element
  const menuItemRefs = useRef([]);
  const router = useRouter();
  const [isACEnabled, setIsACEnabled] = useState(true);
  const [isGSTEnabled, setIsGSTEnabled] = useState(true); // State for enabling/disabling GST
  const [last10Orders, setLast10Orders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Add selectedOrder state
  const [tableNames, setTableNames] = useState({});
  const [orderNumber, setOrderNumber] = useState(null);

  useEffect(() => {
    // Function to fetch the next order number from your backend
    const fetchNextOrderNumber = async () => {
      try {
        const response = await axios.get(
          'https://hotelback-6pw8.onrender.com/api/order/get-next-order-number'
        );
        console.log(response.data.nextOrderNumber)
        const nextOrderNumber = response.data.nextOrderNumber;
        setOrderNumber(nextOrderNumber);
      } catch (error) {
        console.error('Error fetching next order number:', error);
      }
    };

    // Call the function when the component mounts
    fetchNextOrderNumber();
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    fetchLast10Orders();
  }, []);
  const fetchLast10Orders = async () => {
    try {
      const ordersResponse = await axios.get(
        "https://hotelback-6pw8.onrender.com/api/order/latest-orders"
      );
      const orders = ordersResponse.data;

      // Fetch table names for each order
      const tableNamesPromises = orders.map(async (order) => {
        const tableResponse = await axios.get(
          `https://hotelback-6pw8.onrender.com/api/table/tables/${order.tableId}`
        );
        const tableName = tableResponse.data?.tableName || "";
        return { ...order, tableName };
      });

      const ordersWithTableNames = await Promise.all(tableNamesPromises);

      // Sort the orders by order date in descending order
      const sortedOrders = ordersWithTableNames.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );

      setLast10Orders(sortedOrders);
    } catch (error) {
      console.error("Error fetching latest orders:", error);
    }
  };

  const handleOrderClick = (order) => {
    if (order.orderNumber) {
      setSelectedOrder(order);
      setCurrentOrder(order.items || []);

      // Redirect to the edit page with the selected order ID
      const orderNumber = order.orderNumber
      console.log(orderNumber);
      router.push(`/edit/${orderNumber}`);
    } else {
      console.error("Order Number is undefined");
      // Handle the error or provide feedback to the user
    }
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        // Redirect to the dashboard or any desired location
        router.push("/bill");
      }
    },
    [router]
  );

  const handleSearchInputKeyDown = (event) => {
    if (event.key === "+") {
      event.preventDefault();
      // Set focus on the first menu item
      if (menuItemRefs.current.length > 0) {
        menuItemRefs.current[0].focus();
      }
    }
  };

  // Search filter
  const filterMenus = (menu) => {
    const searchTerm = searchInput.toLowerCase().trim();

    // If the search term is empty, show all menus
    if (searchTerm === "") {
      return true;
    }

    // Check if the search term is a number
    const searchTermIsNumber = !isNaN(searchTerm);

    // If the search term is a number, filter based on menu's uniqueId
    if (searchTermIsNumber) {
      return menu.uniqueId === searchTerm;
    }

    // If the search term is not a number, filter based on menu's name
    return menu.name.toLowerCase().includes(searchTerm);
    // return menu.name.toLowerCase().startsWith(searchTerm);
  };

  const openPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const saveBill = async () => {
    try {
      const acPercentageAmount = isACEnabled
        ? calculateTotal().acPercentageAmount
        : 0;

      const orderData = {
        tableId,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price,
        })),
        subtotal: calculateTotal().subtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
      };

      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `https://hotelback-6pw8.onrender.com/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      let existingItems = [];

      if (existingBill && existingBill.length > 0) {
        // If an existing bill is found, get the orderId
        const orderIdToUpdate = existingBill[0]._id;

        // Get existing menu items
        existingItems = existingBill[0].items;

        // Update the existing order by orderId
        const updateResponse = await axios.patch(
          `https://hotelback-6pw8.onrender.com/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );
        console.log("Update Response:", updateResponse.data);
      } else {
        // If no existing bill is found, create a new one
        const createResponse = await axios.post(
          `https://hotelback-6pw8.onrender.com/api/order/order/${tableId}`,
          orderData
        );
        console.log("Create Response:", createResponse.data);
      }

      // Identify newly added items
      const newItems = orderData.items.filter(
        (newItem) =>
          !existingItems.some(
            (existingItem) => existingItem.name === newItem.name
          )
      );

      // Identify items with updating quantities for existing items
      const updatingItems = orderData.items
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0); // Filter out items with quantity 0

      // Combine newItems and updatingItems into a set of unique items
      const uniqueItems = [...newItems, ...updatingItems];
      const uniqueItemsSet = new Set(uniqueItems.map((item) => item.name));

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("Please allow pop-ups to print the KOT.");
        return;
      }

      // Print KOT for unique items
      const kotContent = `
      <!DOCTYPE html>
      <html>
        <head>
        <div>
          <title>Kitchen Order Ticket (KOT)</title>
          <style>
            @page {
              margin: 2mm; /* Adjust the margin as needed */
            }
            /* Add your custom styles for KOT print here */
            body {
              font-family: Arial, sans-serif;
              margin:0;
              padding:0;
              margin-top:-2px;
              width:100%
            }
            .kot-header {
              text-align: center;
          
           
          
            }
          
            .kot-table {
              width: 100%;
              border-collapse: collapse;
            }
            .kot-table th, .kot-table td {
              border: 1px solid black;
              text-align: left;
              padding: 2px;
            }
            .kot-item-name {
        
            }
            .kot-date-time {
              text-align: center;
              display:flex
              justify-content:space-between
              width:100px
              margin-top: -16px;
            }

            .table-name{
              display:flex
           
              
            }
          
            .ordernumberkot h3{
             font-weight:bold
             
             margin-top: -16px;
             }
            .ordernumberkot{
             margin-left:3rem
             
            }
            #date-time , .kot-date-time{
              text-align: center;
              display:flex
              margin-top:-2rem
              justify-content:space-between
            }
          </style>
        </head>
        <body>
          <div class="kot-header">
            KOT </div>
    
            <div class="table-name">
            <h3>TABLE NO- ${tableInfo ? tableInfo.tableName : "Table Not Found"
                         }
            </h3>
            <div class="ordernumberkot"> <h3> ${orderNumber} </h3></div>
            </div>
           <div class="kot-date-time" id="date-time"></div>
          <div class="kot-items">
            <table class="kot-table">
              <thead>
                <tr>
                  <th> No</th>
                  <th>Items</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                ${[...uniqueItemsSet]
          .map((itemName, index) => {
            const orderItem = uniqueItems.find(
              (item) => item.name === itemName
            );
            return `
                      <tr>
                        <td>${index + 1}</td>
                        <td class="kot-item-name">${orderItem.name}</td>
                        <td>${orderItem.quantity}</td>
                      </tr>
                    `;
          })
          .join("")}
              </tbody>
            </table>
          </div>
          <script>
          // JavaScript to dynamically update date and time
          function updateDateTime() {
            const dateTimeElement = document.getElementById('date-time');
            const now = new Date();
            const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
            const formattedDateTime = now.toLocaleDateString('en-US', options);
            dateTimeElement.textContent = formattedDateTime;
          }
        
          // Call the function to update date and time
          updateDateTime();
        
          // Optionally, you can update the date and time every second
          setInterval(updateDateTime, 1000);
        </script>
        
        </body>
      </html>
    `;


      // Write the content to the new window or iframe
      printWindow.document.write(kotContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      // Print or further process the KOT content as needed
      console.log(kotContent);

      // Save order to the local storage
      const savedBills =
        JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
      savedBills.push(orderData);
      localStorage.setItem(`savedBills_${tableId}`, JSON.stringify(savedBills));

      // Optionally, you can reset the current order or perform other actions
      setCurrentOrder([]);
      router.push("/bill");
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };



  const WaitingBill = async () => {
    try {
      const acPercentageAmount = isACEnabled
        ? calculateTotal().acPercentageAmount
        : 0;

      const orderData = {
        tableId,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price,
        })),
        subtotal: calculateTotal().subtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
      };

      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `https://hotelback-6pw8.onrender.com/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      let existingItems = [];

      if (existingBill && existingBill.length > 0) {
        // If an existing bill is found, get the orderId
        const orderIdToUpdate = existingBill[0]._id;

        // Get existing menu items
        existingItems = existingBill[0].items;

        // Update the existing order by orderId
        const updateResponse = await axios.patch(
          `https://hotelback-6pw8.onrender.com/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );
        console.log("Update Response:", updateResponse.data);
      } else {
        // If no existing bill is found, create a new one
        const createResponse = await axios.post(
          `https://hotelback-6pw8.onrender.com/api/order/order/${tableId}`,
          orderData
        );
        console.log("Create Response:", createResponse.data);
      }

      // Identify newly added items
      const newItems = orderData.items.filter(
        (newItem) =>
          !existingItems.some(
            (existingItem) => existingItem.name === newItem.name
          )
      );

      // Identify items with updating quantities for existing items
      const updatingItems = orderData.items
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0); // Filter out items with quantity 0

      // Combine newItems and updatingItems into a set of unique items
      const uniqueItems = [...newItems, ...updatingItems];
      const uniqueItemsSet = new Set(uniqueItems.map((item) => item.name));


      const savedBills =
        JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
      savedBills.push(orderData);
      localStorage.setItem(`savedBills_${tableId}`, JSON.stringify(savedBills));

      // Optionally, you can reset the current order or perform other actions
      setCurrentOrder([]);
      router.push("/bill");
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };


  const handlePrintBill = async () => {
    try {
      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `https://hotelback-6pw8.onrender.com/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      // Find the index of the first temporary order (if any)
      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );

      // Use the tableId from the order data
      const orderData = {
        tableId: existingBill.tableId,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price,
        })),
        subtotal: calculateTotal().subtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
        isTemporary: true, // Set isTemporary to false explicitly
        isPrint: 1
      };

      if (temporaryOrderIndex !== -1) {
        // If an existing temporary order is found, update it
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        await axios.patch(
          `https://hotelback-6pw8.onrender.com/api/order/update-order-by-id/${orderIdToUpdate}`,
          {
            ...orderData,
            isTemporary: true, // Ensure isTemporary is set to false in the update request
            isPrint: 1
          }
        );
      } else {
        // If no existing temporary order is found, create a new one
        await axios.post(
          `https://hotelback-6pw8.onrender.com/api/order/order/${tableId}`,
          orderData
        );
      }

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);

      // await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("document ready for printing");

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
      }





      const printContent = `
      <html>
  <head>
    <title>Bill</title>
    <style>
      @page {
        margin: 2mm; /* Adjust the margin as needed */
      }
      body {
        font-family: 'sans' ; /* Specify a more common Courier font */
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
       
      
      }
      
      .container {
       max-width:600px
        padding:10px 10px
        justify-content:center
        aligh-items:center
        text-align:center
        background-color: #fff;
        box-shadow: 0 0 10px black;
      }
      
  
      .hotel-details p {
       text-align: center;
       margin-top:-10px
      }
    
      .order-details {
        margin-top: 2px;
      }

  
   .order_details_border{
    margin-left:10px
      position:relative
      top:2rem
    }

   .container .total-section{
      justify-content:space-between
      display:flex
    }
    .margin_left_container{
      margin-left:-2rem
    }
    .container{
     margin:1rem
     align-items: center;
     height:fit
   

    }
    .contact-details p {
      display: inline-block;
    
      
    }
  
    .hotel-details {
      text-align: center;
    }
    
    .hotel-details h4 {
      font-size: 20px; 
      margin-bottom: 10px; 
    }
    
    .hotel-details .address  p
    {
      font-size: 12px;
      margin-bottom: 10px; 
     
    }
    .hotel-details p{
      font-size:11px
    }
    .contact-details {
      align-item:center
      text-align:center
      width:100%
      display: flex;
      font-size: 12px; 
      justify-content: space-between;
      margin-top:-1px
    }
   
    .bill-no {
      font-size: 12px; 
      border-top: 1px dotted black;
    }
  
   
    .tableno p{
      font-size:15px
    }
    .tableno{
      
    }
    .waiterno p{
      font-size:12px
    }
    .tableAndWaiter {
      display: flex;
      border-top: 1px dotted black;
      justify-content: space-between; 
    }
    .waiterno{
    
    }
    .order-details{
      border-top: 1px dotted black;
      padding-top: 2px; 
    }
    .order-details table {
      border-collapse: collapse;
      width: 100%;
      margin-top:-5px
    }
    
    .order-details th {
      padding: 8px; 
      text-align: left;
    }
    
    .order-details td,
    .order-details th {
      border-bottom: none; 
      text-align: left;
      padding: 4px; 
    }
    
 
    .menu-name {
    
      white-space: nowrap; /* Prevent line breaks in menu names */
    }
    
    .margin_left_container {
      margin-left: 20px; /* Adjust the margin as needed for spacing */
    }
    .thdots{
      border-top: 1px dotted black;
      padding-top: 2px; 
    }
    .itemsQty{
      border-top: 1px dotted black;
     margin-top:5px
     margin-bottom:5px

    }
    .itemsQty p{
      margin-top:2px
        }
 .subtotal , .datas{
  margin-top:12px
 }
 .datas{
   text-align: right;

 }
  .subtotal p{
    margin-top:-9px
  }
  .datas p{
    margin-top:-9px
  
  }
  .subtotalDatas{
    display: flex;
   
   justify-content: space-between; 
   border-top: 1px dotted black;
   margin-top:-9px

  }
  .grandTotal{
    font-size:22px
  }
  .totalprice{
    text-align: right;
  }
  
  
  .table-class th {
    font-weight: 600;
  }
  .table-class th{
    align-items:center
    text-align:center

  }
  .table-class td{
    margin-top:-3rem
  }
  .reduced-margin {
    margin-top: -10px; 
  }
  .tableAndWaiter p{
    margin-top: -10px; 
  }

.billNo p{

  margin-top:1px
}

  .footer {
    margin-top:-9px
    border-top: 1px dotted black;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  
}
.footer p{
  margin-top:-15px
  
}

  </style>
        </head>
        <body>
          <!-- Your specific JSX code for printing -->
          
          <div class="hotel-details">
               
              <h4>${hotelInfo ? hotelInfo.hotelName : "Hotel Not Found"}</h4>
              <p class="address">${hotelInfo ? hotelInfo.address : "address Not Found"
        }</p>
              <p> PHONE NO: ${hotelInfo ? hotelInfo.contactNo : "Mobile not found"
        }</p>
              <p>  GSTIN: ${hotelInfo ? hotelInfo.gstNo : "Mobile not found"
        }</p>
          
              <p>  SAC NO: ${hotelInfo ? hotelInfo.sacNo : "Fssai not found"
        } </p>
              <p> FSSAI NO: ${hotelInfo ? hotelInfo.fssaiNo : "Fssai not found"
        } </p>
 
            </div>

          <div class="content">
          </div>
          
          <div class="tableAndWaiter">
          <div class="tableno">
          <div class="billNo">  <p>Bill No: ${orderNumber.slice(5,)}</p>      </div>
          <p class="numbertable">Table No: ${tableInfo ? tableInfo.tableName : "Table Not Found"
        }</p>
          <div class="contact-details">
            </div>
           
          </div>
          </div>


          <div class="order-details reduced-margin">
          <table class="table-class">
            <thead>
              <tr>
                <th>SN</th>
                <th>Items</th>
                <th>Qty</th>
                <th>Price</th>
               
              </tr>
            </thead>
            <tbody>
            
              ${currentOrder.map(
          (orderItem, index) =>
            `<tr key=${orderItem._id}>
                    <td>${index + 1}</td>
                    <td class="menu-name">${orderItem.name}</td>
                    <td>${orderItem.quantity}</td>
                    <td class="totalprice">${`${(
              orderItem.price * orderItem.quantity
            ).toFixed(2)}`}</td>
                   </tr>`
        )}
            </tbody>
          </table>
        </div>

        <div class="itemsQty">
        <p>Total Items: ${calculateTotal().totalQuantity}</p>
      </div>


     <div class="subtotalDatas"> 
      <div class="subtotal">
        <p>Subtotal: </p> 
  
      
        <p class="grandTotal"> Grand Total: </p> 
      </div>

      <div class="datas">
      <p>${`${calculateTotal().subtotal}`}</p>
    
    
      <p class="grandTotal">${`${calculateTotal().total}`}</p>
      
      </div>
     </div> 
     
     
     <div class="footer">
     <p>
     Thank you!visit again!!!
     <p>AB software solution</p>
     <p>Mob No:8888732973</p>
     </p>
     </div>
     
     
     
     
    </div>
    </div>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        var currentDate = new Date();
        var dateOptions = {
          year: "numeric",
          month: "2-digit", 
          day: "2-digit",   
        };
        var timeOptions = {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        };

        var formattedDate = currentDate.toLocaleDateString("en-US", dateOptions);
        var formattedTime = currentDate.toLocaleTimeString("en-US", timeOptions);

        // Display date and time on a single line
        var dateTimeElement = document.createElement("p");
        dateTimeElement.innerHTML = "Date:"+ formattedDate+ "  Time:"+formattedTime;
        document.querySelector(".contact-details").appendChild(dateTimeElement);
      });
    </script>
  </body>
</html>

    `;

      // Write the content to the new window or iframe
      printWindow.document.write(printContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      router.push('/bill')
      // Open the payment modal after printing
      // openPaymentModal();
    } catch (error) {
      console.error("Error preparing order:", error);
    }
  };


  const handleSave = async () => {
    try {
      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `https://hotelback-6pw8.onrender.com/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      // Find the index of the first temporary order (if any)
      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );

      // Use the tableId from the order data
      const orderData = {
        tableId: existingBill.tableId,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price,
        })),
        subtotal: calculateTotal().subtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
        isTemporary: true, // Set isTemporary to false explicitly
        isPrint: 1
      };

      if (temporaryOrderIndex !== -1) {
        // If an existing temporary order is found, update it
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        await axios.patch(
          `https://hotelback-6pw8.onrender.com/api/order/update-order-by-id/${orderIdToUpdate}`,
          {
            ...orderData,
            isTemporary: true, // Ensure isTemporary is set to false in the update request
            isPrint: 1
          }
        );
      } else {
        // If no existing temporary order is found, create a new one
        await axios.post(
          `https://hotelback-6pw8.onrender.com/api/order/order/${tableId}`,
          orderData
        );
      }

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);

      router.push('/bill')
      // Open the payment modal after printing
      // openPaymentModal();
    } catch (error) {
      console.error("Error preparing order:", error);
    }
  };



  const handleAfterPrint = () => {
    window.removeEventListener("afterprint", handleAfterPrint);
    window.close();
  };

  const addToOrder = useCallback(
    (product) => {
      console.log("Adding to order:", product);
      // Update the current order
      setCurrentOrder((prevOrder) => {
        const existingItem = prevOrder.find(
          (item) => item.name === product.name
        );

        if (existingItem) {
          console.log("Adding to existing item:", existingItem);
          const updatedOrder = prevOrder.map((item) =>
            item.name === existingItem.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          console.log("Updated Order:", updatedOrder);
          return updatedOrder;
        } else {
          console.log("Adding new item:", product);
          return [...prevOrder, { ...product, quantity: 1 }];
        }
      });

      // Optionally, you can trigger the KOT print here or use the `kotData` as needed.
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

        // Filter out items with quantity greater than 0
        const filteredOrder = updatedOrder.filter((item) => item.quantity > 0);

        return filteredOrder;
      } else {
        console.log("Item not found in order:", product);
        return prevOrder;
      }
    });
  };

  useEffect(() => {
    // Recalculate total when isACEnabled changes
    setCurrentOrder((prevOrder) => [...prevOrder]); // Trigger a re-render
  }, [isACEnabled]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Fetch categories
    axios
      .get("https://hotelback-6pw8.onrender.com/api/main")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // Fetch products
    axios
      .get("https://hotelback-6pw8.onrender.com/api/menu/menus/list")
      .then((response) => {
        console.log(response.data);
        const menusArray = response.data; // Ensure menus is an array
        setMenus(menusArray);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    if (tableId) {
      axios
        .get(`https://hotelback-6pw8.onrender.com/api/table/tables/${tableId}`)
        .then((response) => {
          setTableInfo(response.data);
        })
        .catch((error) => {
          console.error("Error fetching table information:", error);
        });
    }

    const savedBills =
      JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
    if (savedBills.length > 0) {
      // Assuming you want to load the latest saved bill
      const latestOrder = savedBills[savedBills.length - 1];
      setCurrentOrder(latestOrder.items || []); // Initialize currentOrder with the saved items
    }

    document.addEventListener("keydown", handleKeyDown);
    // document.addEventListener('keydown', handleSlashKey);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // document.removeEventListener('keydown', handleSlashKey);
    };
  }, [tableId, handleKeyDown]);

  useEffect(() => {
    const handleStarKey = (event) => {
      if (event.key === "*") {
        event.preventDefault();
        handlePrintBill();
      }
    };
    document.addEventListener("keydown", handleStarKey);
    return () => {
      document.removeEventListener("keydown", handleStarKey);
    };
  }, [handlePrintBill]);

  useEffect(() => {
    const handleSlashKey = (event) => {
      if (event.key === "/") {
        event.preventDefault();
        saveBill();
      }
    };
    document.addEventListener("keydown", handleSlashKey);
    return () => {
      document.removeEventListener("keydown", handleSlashKey);
    };
  }, [saveBill]);

  useEffect(() => {
    // Fetch menus based on the selected category
    if (selectedCategory) {
      axios
        .get(`https://hotelback-6pw8.onrender.com/api/menu/${selectedCategory._id}`)
        .then((response) => {
          console.log(response.data);
          const menusArray = response.data || []; // Ensure menus is an array
          setMenus(menusArray);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    // If the category is null (All items), fetch all menus
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
      // Fetch menus based on the selected category
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

  const calculateTotal = () => {
    const subtotal = currentOrder.reduce(
      (acc, orderItem) => acc + orderItem.price * orderItem.quantity,
      0
    );
    // const GSTRate = gstPercentage / 100; // GST rate of 2.5%
    const GSTRate = isGSTEnabled ? gstPercentage / 100 : 0; // Use GST percentage if enabled

    const CGST = (GSTRate / 2) * subtotal; // Half of the GST for CGST
    const SGST = (GSTRate / 2) * subtotal; // Half of the GST for SGST

    // Include acPercentage in the total calculation
    const acPercentageAmount = isACEnabled
      ? subtotal * (acPercentage / 100)
      : 0;

    const total = subtotal + CGST + SGST + acPercentageAmount;
    const totalQuantity = currentOrder.reduce(
      (acc, orderItem) => acc + orderItem.quantity,
      0
    );

    return {
      subtotal: subtotal.toFixed(2),
      SGST: SGST.toFixed(2),
      CGST: CGST.toFixed(2),
      acPercentageAmount: acPercentageAmount.toFixed(2), // AC percentage amount based on subtotal
      total: total.toFixed(2),
      totalQuantity: totalQuantity,
    };
  };

  const handleMenuItemKeyDown = (event, product) => {
    if (event.key === "Enter") {
      addToOrder(product);
    } else if (event.key === "+") {
      event.preventDefault();
      setSearchInput("");

      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else if (event.key === "-") {
      event.preventDefault();
      removeFromOrder(product);
    }
  };

  const [gstPercentage, setGSTPercentage] = useState(0); // Add this line for the GST percentage

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        // Fetch all hotels
        const allHotelsResponse = await axios.get(
          "https://hotelback-6pw8.onrender.com/api/hotel/get-all"
        );
        const allHotels = allHotelsResponse.data;

        // Assuming you want to use the first hotel's ID (you can modify this logic)
        const defaultHotelId = allHotels.length > 0 ? allHotels[0]._id : null;

        if (defaultHotelId) {
          // Fetch information for the first hotel
          const response = await axios.get(
            `https://hotelback-6pw8.onrender.com/api/hotel/get/${defaultHotelId}`
          );
          const hotelInfo = response.data;

          setHotelInfo(hotelInfo);
          setGSTPercentage(hotelInfo.gstPercentage || 0);
        } else {
          console.error("No hotels found.");
        }
      } catch (error) {
        console.error("Error fetching hotel information:", error);
      }
    };

    fetchHotelInfo();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div className=" font-sans  ">
      {/* <!-- component --> */}
      <div className="container mx-auto  bg-white">
        <div className="flex lg:flex-row  shadow-lg ">
          {/* <!-- left section --> */}
          <div className="w-1/2 lg:w-3/5 min-h-screen shadow-lg ">
            {/* <!-- header --> */}
            <div className="flex flex-row justify-between items-center px-5 mt-5">
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
                  className={`whitespace-nowrap cursor-pointer px-5 py-1 rounded-2xl text-sm font-semibold ${selectedCategory === category
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
                onKeyDown={handleSearchInputKeyDown}
                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500 w-48"
              />
            </div>

            <div className="cursor-pointer grid grid-cols-2 bg-white  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-5 mt-5 overflow-scroll max-h-[calc(75vh-2rem)]  shadow-md-">
              {(menus.menus || menus)
                .filter(filterMenus) // Apply the filterMenus function
                .map((product, index) => (
                  <div
                    key={product._id}
                    className="px-3 py-3 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md h-32 justify-between text-sm"
                    onClick={() => addToOrder(product)}
                    tabIndex={0}
                    ref={(el) => (menuItemRefs.current[index] = el)} // Save the ref to the array
                    onKeyDown={(e) => handleMenuItemKeyDown(e, product)} // Handle keydown event
                  >
                    <div>
                      <div>
                        <div className="font-bold text-gray-800 text-sm  lg:text-xl">
                          {product.name}
                        </div>
                        <div className="font-light text-sm text-gray-400">
                          {`MenuId: ${product.uniqueId || "Yes"}`}
                        </div>
                      </div>
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
          {/* <!-- end left section --> */}

          {/* <!-- right section --> */}
          <div className="w-1/2 lg:w-2/5 mt-2  bg-gray-100">
            {/* <!-- header --> */}
            <div className="font-bold text-sm px-3 ">Last Bills</div>
            <div className="flex flex-row items-center justify-between px-2 ">
              <div className="font-semibold text-sm overflow-x-auto max-w-screen-md">
                <div className="flex flex-row mb-4 cursor-pointer">
                  {last10Orders
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    ) // Sort orders by creation time in descending order
                    .map((order) => (
                      <div
                        key={order._id}
                        className="flex-shrink-0 mr-3 p-3 bg-white rounded-lg shadow-md hover:shadow-lg"
                        onClick={() => handleOrderClick(order)}
                      >
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-blue-500 px-3 py-1">
                            <span className="font-semibold text-xs text-white">
                              {order.orderNumber}
                            </span>
                          </div>
                          <span className="font-semibold text-xs pl-2">
                            ₹{order.total?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="font-bold text-xl px-5">
              {tableInfo ? tableInfo.tableName : "Not Assigned"}
            </div>
            <div className="text-sm text-gray-500 font-semibold px-5 mt-1">
              {orderNumber && <p>{orderNumber}</p>}
            </div>
            {/* <!-- end header --> */}
            {/* <!-- order list --> */}
            <div className="p-2  overflow-y-auto lg:h-64  md:h-40">
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
                  <div className="flex justify-between font-bold ">
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
                      className=" rounded-sm  cursor-pointer bg-indigo-300 lg:py-1 lg:px-3 py-1 px-1 font-bold"
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
            <div className="px-5 mt-9 lg:mt-1   ">
              <div className="py-4 rounded-md shadow-md bg-white">
                <div className="px-4 flex justify-between ">
                  <span className="font-semibold text-sm">Subtotal</span>
                  <span className="font-bold">
                    ₹{calculateTotal().subtotal}
                  </span>
                </div>

                {/* <div className="px-4 flex justify-between ">
                  <span className="font-semibold text-sm">
                    AC
                    <input
                      type="checkbox"
                      className=" ml-4"
                      checked={isACEnabled}
                      onChange={() => setIsACEnabled(!isACEnabled)}
                    />
                  </span>
                  <span className="font-bold"></span>
                  <span className="font-bold">
                    ( {acPercentage}% ) ₹{calculateTotal().acPercentageAmount}
                  </span>
                </div> */}

                <div className="px-4 flex justify-between ">
                  <span className="font-semibold text-sm">
                    GST
                    <input
                      type="checkbox"
                      className=" ml-3"
                      checked={isGSTEnabled}
                      onChange={() => setIsGSTEnabled(!isGSTEnabled)}
                    />
                  </span>
                </div>
                {isGSTEnabled && (
                  <div>
                    <div className="px-4 flex justify-between ">
                      <span className="font-semibold text-sm">CGST</span>
                      <span className="font-bold">
                        ({gstPercentage / 2}%) ₹{calculateTotal().CGST}
                      </span>
                    </div>
                    <div className="px-4 flex justify-between ">
                      <span className="font-semibold text-sm">SGST</span>

                      <span className="font-bold">
                        ({gstPercentage / 2}%) ₹{calculateTotal().SGST}
                      </span>
                    </div>
                  </div>
                )}
                <div className="border-t-2 mt-3 lg:py-2 lg:px-4 py-1 px-1 flex items-center justify-between">
                  <span className="font-bold text-xl lg:text-2xl">Total</span>
                  <span className="font-bold text-xl lg:text-2xl">
                    ₹{calculateTotal().total}
                  </span>
                  {/* <span className="font-bold text-2xl">₹{Math.ceil(Number(calculateTotal().total)).toFixed(2)}</span> */}
                </div>
              </div>
            </div>
            {/* <!-- end total --> */}
            <div className="  border-t-2">
              <div className="px-5  text-left text-sm  text-gray-500 font-sans font-semibold">
                Total Items: {calculateTotal().totalQuantity}
              </div>

              {/* <!-- button pay--> */}
              <div className="flex px-5 mt-2 justify-between ">
                <div
                  className="px-8 py-2 rounded-md shadow-lg text-center bg-yellow-100 text-yellow-500 font-bold cursor-pointer text-base"
                  onClick={saveBill}
                >
                  KOT
                </div>
                <div
                  className="px-8 py-2 rounded-md shadow-lg text-center bg-orange-100 text-orange-500 font-bold cursor-pointer text-base"
                  onClick={WaitingBill}
                >
                  Waiting
                </div>
                <div
                  className="px-8 py-2 rounded-md shadow-lg text-center bg-blue-100 text-blue-500 font-bold cursor-pointer text-base"
                  onClick={handleSave}
                >
                  Save
                </div>
                <div
                  className="px-8 py-2 rounded-md shadow-lg text-center bg-green-200 text-green-600 font-bold cursor-pointer text-base"
                  onClick={handlePrintBill}
                >
                  Print Bill
                </div>
              </div>
            </div>
            {isPaymentModalOpen && (
              <PaymentModal
                onClose={() => setIsPaymentModalOpen(false)}
                tableName={tableInfo ? tableInfo.tableName : "Table Not Found"}
                totalAmount={calculateTotal().total}
                tableId={tableId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
