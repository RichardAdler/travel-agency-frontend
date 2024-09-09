import Script from 'next/script';
import { useEffect } from 'react';

const RealEyeComponent = () => {
  useEffect(() => {
    const initializeRealEyeSDK = () => {
      if (window.EmbeddedPageSdk) {
        const debugMode = false;
        const stimulusId = 'f46b76c8-274e-4dd7-8f3e-9c92d5f5fd44';
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
