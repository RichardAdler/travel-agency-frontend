"use client";
import { useState } from 'react';
import Navbar from '@/components/global/Navbar';
import HomeHeader from '../components/page-specific/Home/HomeHeader';
import SearchForm from '@/components/page-specific/Home/SearchForm';
import PopularDestinations from '@/components/page-specific/Home/PopularDestinations';
import BlogSection from '@/components/page-specific/Home/BlogSection';
import TravelersTestimonials from '@/components/page-specific/Home/TravelersTestimonials';
import NewsletterSection from '@/components/page-specific/Home/Newsletter';
import Footer from '@/components/global/Footer';
import ChatWidget from '../components/global/chatwidget/ChatWidget';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
  };

  return (
    <>
      <Navbar />
      <HomeHeader toggleChat={toggleChat} />
      <SearchForm />
      <PopularDestinations />
      <BlogSection />
      <TravelersTestimonials />
      <NewsletterSection />
      <Footer />
      <ChatWidget isOpen={isChatOpen} toggleChat={toggleChat} />
    </>
  );
}