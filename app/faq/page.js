"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Footer from "../components/global/Footer";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is AI-powered personalization in this travel platform?",
      answer:
        "AI-powered personalization in our platform involves analyzing your preferences, search history, and past interactions to tailor recommendations specifically for you. Our AI learns about your interests—whether you prefer city breaks, adventure tours, or relaxing beach vacations—and suggests the best options accordingly. It also adapts over time, offering even more relevant choices as you use the platform."
    },
    {
      question: "How does the real-time data from TripAdvisor enhance the user experience?",
      answer:
        "By integrating TripAdvisor's API, we ensure that the travel data provided is up-to-date and reliable. This includes the latest reviews, photos, hotel availability, and attractions at your destination. Having real-time data means you can make informed decisions, knowing that the information is current and accurate, helping you avoid booking places that are fully booked or unavailable."
    },
    {
      question: "Is my data secure on this platform?",
      answer:
        "Absolutely. We prioritize your privacy and security. We use Firebase Authentication to handle login credentials, which includes robust encryption. All personal data is stored in Firestore and encrypted both in transit and at rest. Additionally, we comply with GDPR guidelines, ensuring that your data is handled responsibly and that you have control over how your data is used, including options to modify or delete it."
    },
    {
      question: "Can I plan my entire trip using this platform?",
      answer:
        "Yes! Currently, you can plan and book accommodations, activities, and destinations. Our platform is continually evolving, and soon you’ll also be able to book flights, car rentals, and even guided tours. The AI assistant can help streamline your entire itinerary, ensuring that every aspect of your trip is personalized and easy to manage in one place."
    },
    {
      question: "How do I get personalized travel suggestions?",
      answer:
        "To receive personalized suggestions, simply interact with our AI-powered assistant. It will ask you a few questions about your travel preferences—such as your destination, type of activities, and travel dates. Based on your input and past interactions, the AI will suggest hotels, attractions, and restaurants that align with your preferences. Over time, the assistant will become more accurate in predicting your likes and dislikes."
    },
    {
      question: "How do you handle user privacy under GDPR?",
      answer:
        "We strictly adhere to GDPR regulations. This means we inform you about what data we collect and how it will be used. You can easily request to have your data deleted or modified by contacting our support team. We also provide clear options for opting out of data tracking and customization services. Our goal is to make sure that your privacy is protected and that you remain in full control of your personal information."
    },
    {
      question: "What technologies does this platform use?",
      answer:
        "Our platform is built using cutting-edge technologies, including Next.js for the frontend, Firebase and Firestore for secure data handling, and OpenAI for delivering AI-powered recommendations. Additionally, we integrate TripAdvisor’s API to provide real-time travel data, ensuring that our users have the most current and relevant information available when planning their trips."
    },
    {
      question: "What happens if the API fails to retrieve travel data?",
      answer:
        "In case the API request fails due to network issues or rate limits, the system is equipped with fallback mechanisms. It will retry the request a few times, and if it still fails, you’ll receive a notification with a message asking you to try again later. We continuously monitor these occurrences to ensure minimal disruption to your experience."
    },
    {
      question: "Can I save my favorite destinations?",
      answer:
        "Yes, with an account, you can easily save your favorite destinations, hotels, or attractions for future reference. Once saved, you’ll find all your favorites in your personal dashboard, making it simple to plan return visits or recommend spots to friends and family. All saved data is securely stored in Firebase Firestore and can be accessed from any device once you log in."
    },
    {
      question: "Does this platform offer customer support?",
      answer:
        "Yes, we offer comprehensive customer support. You can contact us via the live chat feature on the platform, or send an inquiry through our contact form. Our support team is available to assist with technical issues, booking inquiries, and general questions. We strive to provide quick and helpful responses to ensure you have a seamless experience."
    }
  ];

  return (
    <>
      <header className="relative h-[45vh] sm:h-[45vh] md:h-[45vh] lg:h-[45vh]">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('/images/Header3.jpg')` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Frequently Asked Questions
          </h1>
        </div>
      </header>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`border-b border-gray-300 pb-4 mb-6 overflow-hidden transition-all duration-500 ${
                activeIndex === index ? "max-h-screen" : "max-h-24"
              }`}
            >
              <div
                className="flex justify-between items-center cursor-pointer text-2xl font-semibold mb-2 hover:text-blue-600 transition-colors duration-300"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                {activeIndex === index ? (
                  <FaChevronUp className="text-lg" />
                ) : (
                  <FaChevronDown className="text-lg" />
                )}
              </div>
              <div
                className={`transition-opacity duration-300 ease-in-out ${
                  activeIndex === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="text-lg text-gray-600 mt-2">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
