import Script from 'next/script';
import { useEffect } from 'react';

const RealEyeComponent = () => {
  useEffect(() => {
    const initializeRealEyeSDK = () => {
      if (window.EmbeddedPageSdk) {
        const debugMode = false;
        const stimulusId = '7a412c3d-9121-4027-a9be-5a8db7a9cd53';
        const forceRun = false;

        const reSdk = new window.EmbeddedPageSdk(debugMode, stimulusId, forceRun);
      }
    };

    if (document.readyState === 'complete') {
      initializeRealEyeSDK();
    } else {
      window.addEventListener('load', initializeRealEyeSDK);
    }

    return () => {
      window.removeEventListener('load', initializeRealEyeSDK);
    };
  }, []);

  return (
    <>
      <Script
        src="https://app.realeye.io/sdk/js/testRunnerEmbeddableSdk-1.6.js"
        strategy="lazyOnload"
        onLoad={() => console.log("RealEye SDK Loaded")}
      />
    </>
  );
};

export default RealEyeComponent;
