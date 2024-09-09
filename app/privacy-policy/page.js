"use client";
import React from 'react';
import Footer from '../components/global/Footer';

const PrivacyPolicy = () => {
  return (
    <>
    <div className="min-h-[80vh] bg-gray-900 text-gray-300" style={{ paddingTop: '100px' }}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-white">Privacy Policy</h1>
        <p className="text-lg mb-4">
          At Holiday Havens, we prioritize the privacy and security of our users. This privacy policy outlines how we collect, use, and protect your personal information.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-orange-400">1. Information We Collect</h2>
        <p className="mb-4">
          We collect personal information you provide directly to us, such as your name, email address, and booking preferences. Additionally, we collect data automatically through your use of our platform, including IP address, browser type, and device information.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-orange-400">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use your personal information to enhance your travel booking experience. This includes providing personalized recommendations, processing bookings, and sending you relevant updates. We may also use your data for internal analytics to improve our services.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-orange-400">3. Data Sharing</h2>
        <p className="mb-4">
          We do not sell your personal information to third parties. However, we may share your information with trusted partners for the purpose of facilitating bookings, payments, and customer support. These partners are required to handle your data in accordance with our privacy policy.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-orange-400">4. Data Security</h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your data from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-orange-400">5. Cookies</h2>
        <p className="mb-4">
          We use cookies to track user activity and enhance your experience on our website. You can control cookie settings through your browser, but disabling cookies may affect the functionality of our platform.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-orange-400">6. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this privacy policy periodically to reflect changes in our practices or legal requirements. Any updates will be posted on this page, and your continued use of our services after changes signifies your acceptance of the new policy.
        </p>

        <p className="text-lg mt-6">
          If you have any questions about our privacy policy, please contact us at <a href="mailto:privacy@holidayhavens.com" className="text-orange-400">privacy@holidayhavens.com</a>.
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default PrivacyPolicy;
