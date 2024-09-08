"use client";
import { Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation';
import React from 'react';
import Header from '../components/page-specific/ChatSummary/Header';
import SearchSummarySection from '../components/page-specific/ChatSummary/SearchSummarySection';
import Footer from '@/components/global/Footer';

const SearchSummary = () => {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchSummarySection />
      </Suspense>
      <Footer />
    </>
  );
};

export default SearchSummary;
