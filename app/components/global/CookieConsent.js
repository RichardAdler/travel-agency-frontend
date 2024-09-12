// components/global/CookieConsent.js
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function CookieConsent() {
  const [isConsentGiven, setIsConsentGiven] = useState(true);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      setIsConsentGiven(false);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365 });
    setIsConsentGiven(true);
  };

  const handleDecline = () => {
    Cookies.set('cookie_consent', 'false', { expires: 365 });
    setIsConsentGiven(true);
  };

  if (isConsentGiven) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <p>
          We use cookies to improve your experience. By accepting, you agree to our{' '}
          <a href="/privacy-policy" className="underline">Privacy Policy</a>.
        </p>
        <div>
          <button className="bg-blue-500 text-white px-4 py-2 mr-2" onClick={handleAccept}>Accept</button>
          <button className="bg-red-500 text-white px-4 py-2" onClick={handleDecline}>Decline</button>
        </div>
      </div>
    </div>
  );
}
