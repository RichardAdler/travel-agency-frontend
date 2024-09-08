// app/components/page-specific/SpecialOffers.js
import React from 'react';

const SpecialOffers = () => {
    return (
        <section className="py-8 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Replace with actual offer items */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Offer 1</h3>
                        <p className="mb-2">Details about offer 1.</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Learn More</button>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Offer 2</h3>
                        <p className="mb-2">Details about offer 2.</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Learn More</button>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Offer 3</h3>
                        <p className="mb-2">Details about offer 3.</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Learn More</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpecialOffers;
