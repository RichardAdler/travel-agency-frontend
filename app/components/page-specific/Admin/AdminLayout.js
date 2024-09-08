"use client";
import React from "react";
import Sidebar from "./Sidebar"; 
import Footer from "@/components/global/Footer";

const AdminLayout = ({ children }) => {
    return (

        <>
            <div className="h-[100px] bg-gray-800"></div>
                <div className="flex">
                    {/* Sidebar */}                
                    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">                    
                        <nav className="flex-1">
                            <Sidebar />
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                        {children}
                    </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminLayout;
