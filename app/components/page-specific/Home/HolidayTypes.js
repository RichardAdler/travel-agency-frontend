// app/components/page-specific/HolidayTypes.js
import React from 'react';

const HolidayTypes = () => {
    return (
        <section className="py-8">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-4">Holiday Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Beach Holidays</h3>
                        <p className="mb-2">Relax on the most beautiful beaches around the world.</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Learn More</button>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Adventure Holidays</h3>
                        <p className="mb-2">Explore new destinations and enjoy thrilling adventures.</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Learn More</button>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Family Holidays</h3>
                        <p className="mb-2">Fun and relaxation for the whole family.</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Learn More</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HolidayTypes;
