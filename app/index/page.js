'use client';
import { useState } from 'react';
import HomeHeader from '../components/page-specific/Home/HomeHeader';
import Footer from '../components/global/Footer';
import SpecialOffers from '@/components/page-specific/Home/SpecialOffers';
import HolidayTypes from '@/components/page-specific/Home/HolidayTypes';
import ContactSection from '@/components/page-specific/Home/ContactSection';
import Navbar from '@/components/global/Navbar';
import SearchLocation from '@/components/page-specific/Home/SearchLocation';
import SearchForm from '@/components/page-specific/Home/SearchForm';
import BlogSection from '@/components/page-specific/Home/BlogSection';
import PopularDestinations from '@/components/page-specific/Home/PopularDestinations';
import TravelersTestimonials from '@/components/page-specific/Home/TravelersTestimonials';
import NewsletterSection from '@/components/page-specific/Home/Newsletter';
import ChatWidget from '../components/global/chatwidget/ChatWidget';

export default function Home() {
    // State to manage whether the chat is open or closed
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Function to toggle chat open/close
    const toggleChat = () => {
        setIsChatOpen(prevState => !prevState);
    };

    return (
        <>
            <Navbar />
            {/* Pass toggleChat function to the HomeHeader */}
            <HomeHeader toggleChat={toggleChat} />

            {/* Other sections */}
            <SearchForm />
            <PopularDestinations />
            <BlogSection />
            <TravelersTestimonials />
            <NewsletterSection />

            <Footer />

            {/* Chat Widget */}
            <ChatWidget isOpen={isChatOpen} toggleChat={toggleChat} />
        </>
    );
}
