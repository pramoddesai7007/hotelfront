'use client'

// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const PaymentModal = ({ onClose, tableName, totalAmount, orderID, orderNumber }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    totalAmount: 0,
    cashAmount: 0,
    onlinePaymentAmount: 0,
    complimentaryAmount: 0,
    discount: 0,
    dueAmount: 0,
  });

  // const [orderNumber, setOrderNumber] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        closeModal();
      }, 2000);

      // Cleanup the timer to avoid memory leaks
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess]);

  useEffect(() => {
    if (paymentFailed) {
      const timer = setTimeout(() => {
        setPaymentFailed(false);
      }, 2000);

      // Cleanup the timer to avoid memory leaks
      return () => clearTimeout(timer);
    }
  }, [paymentFailed]);


  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmount,
      dueAmount: totalAmount - prevFormData.cashAmount,
    }));
  }, [totalAmount]);

  const handlePayment = async (e) => {
    // e.preventDefault();

    try {
      const response = await axios.patch(`https://hotelback-6pw8.onrender.com/api/order/update-order-by-id/${orderID}`, {
        ...formData,
        orderID,
        orderNumber,
        cashAmount: formData.cashAmount,
        onlinePaymentAmount: formData.onlinePaymentAmount,
        complimentaryAmount: formData.complimentaryAmount,
        dueAmount: formData.dueAmount,
        discount: formData.discount,
        totalAmount,
        isPrint: 0,         // Set isPrint to 0
        isTemporary: false
      });

      console.log('Payment successful:', response.data);
      // Set paymentSuccess to true when payment is successful
      setPaymentSuccess(true);
    } catch (error) {
      console.error('Error making payment:', error);
      // Set paymentFailed to true when payment fails
      setPaymentFailed(true);
    }
  };

  const closeModal = () => {
    setPaymentSuccess(false);
    setPaymentFailed(false);
    onClose();
    router.push('/bill');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  const handleCashAmountChange = (e) => {
    const cashAmount = parseFloat(e.target.value) || 0;
    const onlinePaymentAmount = parseFloat(formData.onlinePaymentAmount) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const dueAmount = formData.totalAmount - (cashAmount + onlinePaymentAmount + discount);

    setFormData((prevFormData) => ({
      ...prevFormData,
      discount: discount.toFixed(2),
      cashAmount: cashAmount.toFixed(2),
      onlinePaymentAmount: onlinePaymentAmount.toFixed(2),
      dueAmount: dueAmount.toFixed(2),
    }));
  };
  const handleDiscountChange = (e) => {
    const discount = parseFloat(e.target.value) || 0;
    const cashAmount = parseFloat(formData.cashAmount) || 0;
    const onlinePaymentAmount = parseFloat(formData.onlinePaymentAmount) || 0;
    const dueAmount = formData.totalAmount - (cashAmount + onlinePaymentAmount + discount);

    setFormData((prevFormData) => ({
      ...prevFormData,
      discount: discount.toFixed(2),
      onlinePaymentAmount: onlinePaymentAmount.toFixed(2),
      cashAmount: cashAmount.toFixed(2),
      dueAmount: dueAmount.toFixed(2),
    }));
  };

  const handleCashOnlineChange = (e) => {
    const onlinePaymentAmount = parseFloat(e.target.value) || 0;
    const cashAmount = parseFloat(formData.cashAmount) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const dueAmount = formData.totalAmount - (cashAmount + onlinePaymentAmount + discount);

    setFormData((prevFormData) => ({
      ...prevFormData,
      discount: discount.toFixed(2),
      onlinePaymentAmount: onlinePaymentAmount.toFixed(2),
      cashAmount: cashAmount.toFixed(2),
      dueAmount: dueAmount.toFixed(2),
    }));
  };
  const handleComplimentaryChange = (e) => {
    const complimentaryAmount = parseFloat(e.target.value) || 0;
    const cashAmount = parseFloat(formData.cashAmount) || 0;
    const onlinePaymentAmount = parseFloat(formData.onlinePaymentAmount) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const dueAmount = formData.totalAmount - (cashAmount + onlinePaymentAmount + complimentaryAmount + discount);

    setFormData((prevFormData) => ({
      ...prevFormData,
      discount: discount.toFixed(2),
      complimentaryAmount: complimentaryAmount.toFixed(2),
      cashAmount: cashAmount.toFixed(2),
      onlinePaymentAmount: onlinePaymentAmount.toFixed(2),
      dueAmount: dueAmount.toFixed(2),
    }));
  };
  return (
    <div className="fixed inset-0 overflow-y-auto p-4">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Payment for Table {tableName}</h1>
            <form onSubmit={handlePayment} className="max-w-md mx-auto">
              <div className="mb-4">
                <input
                  type="hidden"
                  name="tableId"
                  value={formData.tableId}
                  onChange={handleChange}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Bill Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  value={orderNumber}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount
                </label>
                <input
                  type="text"
                  id="totalAmount"
                  name="totalAmount"
                  value={totalAmount}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500"
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Discount
                </label>
                <input
                  type="text"
                  id="discount"
                  onChange={handleDiscountChange}
                  className=" w-full bg-gray-50 border border-gray-300 text-gray-900 
                    text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="00"
                />
              </div>

              <div>
                <h1 className='text-center font-bold mb-3'>Payment Method</h1>
                <div className="flex flex-col gap-4 md:flex-row justify-center">
                  <div className="flex flex-col items-center mb-2">
                    {/* Cash Payment */}
                    <label htmlFor="cash_amount" className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                      Cash
                    </label>
                    <input
                      type="text"
                      id="cash_amount"
                      onChange={handleCashAmountChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 
                    text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="00"
                    />
                  </div>

                  <div className="flex flex-col items-center mb-2">
                    <label htmlFor="online_payment" className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                      Online
                    </label>
                    <input
                      type="text"
                      id="online_payment"
                      onChange={handleCashOnlineChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 
                    text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="00"
                    />
                  </div>

                  <div className="flex flex-col items-center mb-2">
                    <label htmlFor="complimentary_amount" className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                      Complimentary
                    </label>
                    <input
                      type="text"
                      id="complimentary_amount"
                      onChange={handleComplimentaryChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
        dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="00"
                    />
                  </div>

                  <div className="flex flex-col items-center mb-2">
                    <label htmlFor="due_amount" className="text-sm font-medium 
                  text-gray-900 dark:text-gray-300 mb-2">
                      Credit
                    </label>
                    <input
                      type="text"
                      id="due_amount"
                      name="dueAmount"
                      value={`${(Number(formData.dueAmount).toFixed(2))}`}
                      className="bg-gray-50 border border-gray-300 text-gray-900 
                    text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      readOnly
                    />
                  </div>
                  {/* <div className="flex flex-col items-center mb-2">
                    <label htmlFor="discount" className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                      Discount
                    </label>
                    <input
                      type="text"
                      id="discount"
                      onChange={handleDiscountChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 
                    text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="00"
                    />
                  </div> */}
                </div>
              </div>
              {/*  */}
              <button
                type="submit"
                className="mx-auto block w-96 py-3 bg-green-200 text-green-800 rounded-full focus:outline-none mt-2 font-semibold text-lg hover:bg-green-100"
              >
                Process Payment

                {/* Payment Success Pop-up */}
                {paymentSuccess && (
                  <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white border border-green-500 rounded p-7 shadow-md z-50 absolute">
                      <p className="text-green-500 font-semibold text-center text-xl">Payment Successful!
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Failed Pop-up */}
                {paymentFailed && (
                  <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white border border-red-500 rounded p-7 
                  shadow-md z-50 absolute">
                      <p className="text-red-500 font-semibold text-center text-xl">
                        Payment Failed!</p>
                    </div>
                  </div>
                )}
              </button>
              <button
                type="button"  // Set the type to "button" to prevent form submission
                onClick={closeModal}
                className="mx-auto block w-96 py-3 bg-red-200 text-red-800 rounded-full focus:outline-none mt-2 font-semibold text-lg hover:bg-red-100"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
