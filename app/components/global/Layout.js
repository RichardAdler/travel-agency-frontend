// app/components/global/Layout.js
import React from 'react';
import Navbar from './Navbar';
import ChatWidget from './ChatWidgetold';
import Footer from './Footer';
import HomeHeader from '../page-specific/Home/HomeHeader';

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            {children}
            <ChatWidget />
            <Footer />
        </div>
    );
};

export default Layout;
