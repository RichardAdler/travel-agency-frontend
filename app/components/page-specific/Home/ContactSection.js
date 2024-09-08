// app/components/page-specific/ContactSection.js
import React from 'react';

const ContactSection = () => {
    return (
        <section className="py-8 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                <p>If you have any questions or need assistance, feel free to reach out to us.</p>
                <form className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Message</label>
                        <textarea className="w-full p-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Send Message</button>
                </form>
            </div>
        </section>
    );
};

export default ContactSection;
