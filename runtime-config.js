// Default runtime configuration for development
// This file will be replaced during GitHub Actions deployment with actual values
window.RUNTIME_CONFIG = {
  GA_MEASUREMENT_ID: "", // Will be injected during deployment
  BUILD_TIME: new Date().toISOString(),
  ENVIRONMENT: "development",
};

// If we have a runtime config, merge it with the global config
if (window.AppConfig && window.RUNTIME_CONFIG.GA_MEASUREMENT_ID) {
  window.AppConfig.set(
    "analytics.measurementId",
    window.RUNTIME_CONFIG.GA_MEASUREMENT_ID
  );
  window.AppConfig.set("app.environment", window.RUNTIME_CONFIG.ENVIRONMENT);
  console.log("🔧 Runtime configuration loaded");
}
