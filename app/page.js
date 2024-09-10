"use client"; 

import { useState } from 'react';
import Navbar from '@/components/global/Navbar';
import HomeHeader from '@/components/page-specific/Home/HomeHeader';
import SearchForm from '@/components/page-specific/Home/SearchForm';
import PopularDestinations from '@/components/page-specific/Home/PopularDestinations';
import BlogSection from '@/components/page-specific/Home/BlogSection';
import TravelersTestimonials from '@/components/page-specific/Home/TravelersTestimonials';
import NewsletterSection from '@/components/page-specific/Home/Newsletter';
import Footer from '@/components/global/Footer';
import ChatWidget from '@/components/global/chatwidget/ChatWidget';
import RealEyeComponent from '@/components/RealEyeComponent'; 
import Hotjar from '@hotjar/browser';

const siteId = 3660453;
const hotjarVersion = 6;

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Hotjar on the client-side only
      Hotjar.init(siteId, hotjarVersion);
    }
  }, []);

  return (
    <>
      <Navbar />
      <HomeHeader toggleChat={toggleChat} />
      <div data-re-aoi-name="QuickSearch">
        <SearchForm />
      </div>
      <div data-re-aoi-name="PopularDestinations">
        <PopularDestinations />
      </div>
      <div data-re-aoi-name="BlogSection">
        <BlogSection />
      </div>
      <div data-re-aoi-name="Testimonials">
        <TravelersTestimonials />
      </div>
      <div data-re-aoi-name="Newsletter">
        <NewsletterSection />
      </div>
      <Footer />
      <ChatWidget isOpen={isChatOpen} toggleChat={toggleChat} />
      <RealEyeComponent />
    </>
  );
}
