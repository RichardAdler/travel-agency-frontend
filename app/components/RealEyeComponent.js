import { useEffect } from "react";

const RealEyeComponent = () => {
  useEffect(() => {
    // Dynamically import the RealEye SDK with Webpack ignoring the external module
    import(
      /* webpackIgnore: true */ "https://app.realeye.io/sdk/js/testRunnerEmbeddableSdk-1.6.js"
    )
      .then(({ EmbeddedPageSdk }) => {
        const debugMode = false;
        const stimulusId = "f46b76c8-274e-4dd7-8f3e-9c92d5f5fd44"; // Replace with your stimulus ID
        const forceRun = false;

        // Initialize the RealEye SDK and store it globally
        window.reSdk = new EmbeddedPageSdk(debugMode, stimulusId, forceRun);
        console.log("RealEye SDK initialized successfully:", window.reSdk);
      })
      .catch((err) => {
        console.error("Error loading RealEye SDK:", err);
      });
  }, []);

  return null; // This component doesn't render anything UI-wise
};

export default RealEyeComponent;
