'use client'
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
