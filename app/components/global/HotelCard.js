import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HotelCard = ({ hotel, checkInDate, nights, adults }) => {
    const [photoUrl, setPhotoUrl] = useState('');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/photos`, {
                    params: { locationId: hotel.location_id }
                });
                const photos = response.data.data;
                if (photos && photos.length > 0) {
                    setPhotoUrl(photos[0].images.large.url);
                }
            } catch (error) {
                console.error('Error fetching photos:', error);
                setPhotoUrl('/images/default-hotel.jpg'); 
            }
        };

        fetchPhotos();
    }, [backendUrl, hotel.location_id]);

    return (
        <div className="max-w-xs md:max-w-sm lg:max-w-md rounded-md overflow-hidden shadow-lg bg-white flex flex-col transition-transform hover:scale-105">
            <img 
                className="w-full h-48 md:h-60 lg:h-72 object-cover" 
                src={photoUrl || "/images/default-hotel.jpg"} 
                alt={hotel.name} 
            />
            <div className="flex flex-col flex-grow justify-between p-4 md:p-6">
                <div>
                    <div className="font-bold text-lg md:text-xl lg:text-2xl mb-2">{hotel.name}</div>
                    <p className="text-gray-700 text-sm md:text-base">{hotel.address_obj.address_string}</p>
                </div>
                <div className="flex justify-center mt-4">
                    {/* Pass query parameters in the URL */}
                    <Link href={`/location/${hotel.location_id}?checkInDate=${checkInDate}&nights=${nights}&adults=${adults}`}>
                        <button className="bg-[#E16A3D] hover:bg-[#FFA450] text-white font-bold py-2 px-4 rounded-md transition-colors duration-300">
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
