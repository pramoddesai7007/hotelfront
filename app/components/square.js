
'use client';
import axios from 'axios';
import Link from 'next/link';
import { faLayerGroup, faTableCellsLarge, faTableList, faListUl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from 'react';

const Square = () => {
    const [counts, setCounts] = useState({
        sectionCount: 0,
        tableCount: 0,
        mainCategoryCount: 0,
        menuCount: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://hotelback-6pw8.onrender.com/api/hotel/counts');
                setCounts(response.data);
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="flex items-center text-gray-800 mb-2 mt-16 font-sans">
                <div className="p-4 w-full">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 sm:col-span-6 md:col-span-3">
                            <Link href={'/section'}>
                                <div className="flex flex-row bg-white shadow-md rounded p-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100 text-blue-500">
                                        <div className="rounded-full  p-4"> <FontAwesomeIcon icon={faLayerGroup} size="xl" color="blue" /></div>

                                    </div>
                                    <div className="flex flex-col flex-grow ml-4">
                                        <div className="text-sm text-gray-500 font-medium">SECTION</div>
                                        <div className="font-bold text-sm">{counts.sectionCount}</div>
                                    </div>
                                </div>
                            </Link>
                        </div>


                        <div className="col-span-12 sm:col-span-6 md:col-span-3">
                            <Link href={'/tables'}>
                                <div className="flex flex-row bg-white shadow-md rounded p-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-green-100 text-green-500">
                                        <div className=" rounded-full  p-4"> <FontAwesomeIcon icon={faTableCellsLarge} size="xl" color="green" /></div>
                                    </div>
                                    <div className="flex flex-col flex-grow ml-4">
                                        <div className="text-sm text-gray-500 font-medium">TABLE LIST</div>
                                        <div className="font-bold text-sm">{counts.tableCount}</div>
                                    </div>
                                </div>
                            </Link>
                        </div>


                        <div className="col-span-12 sm:col-span-6 md:col-span-3">
                            <Link href={'/main'}>
                                <div className="flex flex-row bg-white shadow-md rounded p-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-orange-100 text-orange-500">
                                        <div className=" rounded-full  p-4"> <FontAwesomeIcon icon={faTableList} size="xl" color="orange" /></div>
                                    </div>
                                    <div className="flex flex-col flex-grow ml-4">
                                        <div className="text-sm text-gray-500 whitespace-nowrap font-medium">MAIN MENU</div>
                                        <div className="font-bold text-sm">{counts.mainCategoryCount}</div>
                                    </div>
                                </div>
                            </Link>
                        </div>


                        <div className="col-span-12 sm:col-span-6 md:col-span-3">
                            <Link href={'/menu'}>
                                <div className="flex flex-row bg-white shadow-md rounded p-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-red-100 text-red-500">
                                        <div className=" rounded-full  p-4"> <FontAwesomeIcon icon={faListUl} size="xl" color="red" /></div>
                                    </div>
                                    <div className="flex flex-col flex-grow ml-4">
                                        <div className="text-sm text-gray-500 font-medium">MENU LIST</div>
                                        <div className="font-bold text-sm">{counts.menuCount}</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Square