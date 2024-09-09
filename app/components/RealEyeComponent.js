import { useEffect } from "react";

const RealEyeComponent = () => {
  useEffect(() => {
    // Dynamically import the RealEye SDK with Webpack ignoring external module
    import(
      /* webpackIgnore: true */ "https://app.realeye.io/sdk/js/testRunnerEmbeddableSdk-1.6.js"
    )
      .then(({ EmbeddedPageSdk }) => {
        const debugMode = false;
        const stimulusId = '1cd50ee3-8e5f-4731-a6a0-fee0ecfea4b6'; // Replace with your stimulus ID
        const forceRun = false;

        // Initialize the RealEye SDK
        window.reSdk = new EmbeddedPageSdk(debugMode, stimulusId, forceRun);
        console.log("RealEye SDK initialized successfully:", window.reSdk);
      })
      .catch((err) => {
        console.error("Error loading RealEye SDK:", err);
      });
  }, []);

  return null; // No UI needed for this component
};

export default RealEyeComponent;
