// 'use client'

// import { useRouter } from 'next/navigation'
// import React from 'react'
// import Billing from '../page'


// const OrderPage = ({ params }) => {
//     const router=useRouter()
//     const { tableId } = params;

//     return (

//         <Billing tableId={tableId} />
//         )
// }

// export default OrderPage

// OrderPage.js

'use client'
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Billing from '../page'
import axios from 'axios';

const OrderPage = ({ params }) => {
    const router = useRouter();
    const { tableId } = params;
    const [acPercentage, setACPercentage] = useState(null);

    useEffect(() => {
        const fetchACPercentage = async () => {
            try {
                // Fetch the table information to get the associated section ID
                const tableResponse = await axios.get(`https://hotelback-6pw8.onrender.com/api/table/tables/${tableId}`);
                const table = tableResponse.data;

                // Fetch the section information using the section ID
                const sectionResponse = await axios.get(`https://hotelback-6pw8.onrender.com/api/section/${table.section._id}`);
                const section = sectionResponse.data;
                console.log(section.acPercentage)
                // Use the section information to get acPercentage
                setACPercentage(section.acPercentage);
            } catch (error) {
                console.error('Error fetching AC Percentage:', error);
            }
        };

        fetchACPercentage();
    }, [tableId]);

    return (
        <Billing tableId={tableId} acPercentage={acPercentage} />
    );
}

export default OrderPage;
