/**
 * Configuration Management for TV Show Search App
 * Handles environment variables and secrets securely
 */

class ConfigManager {
  constructor() {
    this.config = {
      // Analytics Configuration
      analytics: {
        // This will be replaced during build/deployment with actual ID
        measurementId: this.getAnalyticsMeasurementId(),
        enabled: this.isAnalyticsEnabled(),
        debug: this.isDebugMode(),
      },

      // API Configuration
      api: {
        baseUrl: "https://api.tvmaze.com",
        timeout: 10000,
        retries: 3,
      },

      // App Configuration
      app: {
        name: "TV Show Search App",
        version: "2.0.0",
        environment: this.getEnvironment(),
        maxResults: 50,
        debounceDelay: 300,
        toastDuration: 3000,
      },
    };
  }

  // Get Analytics Measurement ID from environment or fallback
  getAnalyticsMeasurementId() {
    // Check if running in GitHub Pages with injected environment variable
    if (typeof window !== "undefined" && window.GA_MEASUREMENT_ID) {
      return window.GA_MEASUREMENT_ID;
    }

    // Check for build-time replacement (will be replaced during deployment)
    const buildTimeId = "{{GA_MEASUREMENT_ID}}";
    if (buildTimeId !== "{{GA_MEASUREMENT_ID}}") {
      return buildTimeId;
    }

    // Development fallback - disabled analytics
    console.warn(
      "Analytics Measurement ID not configured. Analytics disabled."
    );
    return null;
  }

  // Check if analytics should be enabled
  isAnalyticsEnabled() {
    // Disable in development or if no measurement ID
    if (this.isLocalDevelopment() || !this.getAnalyticsMeasurementId()) {
      return false;
    }

    // Check if user has opted out
    if (localStorage.getItem("analytics-disabled") === "true") {
      return false;
    }

    return true;
  }

  // Check if running in debug mode
  isDebugMode() {
    return (
      this.isLocalDevelopment() ||
      (typeof URLSearchParams !== "undefined" &&
        new URLSearchParams(window.location.search).has("debug"))
    );
  }

  // Detect environment
  getEnvironment() {
    if (this.isLocalDevelopment()) {
      return "development";
    } else if (window.location.hostname.includes("github.io")) {
      return "production";
    } else {
      return "staging";
    }
  }

  // Check if running locally
  isLocalDevelopment() {
    return (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "" ||
        window.location.protocol === "file:")
    );
  }

  // Get configuration value by path
  get(path) {
    const keys = path.split(".");
    let value = this.config;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  // Set configuration value by path
  set(path, newValue) {
    const keys = path.split(".");
    let current = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = newValue;
  }

  // Log configuration (without sensitive data)
  logConfig() {
    if (this.isDebugMode()) {
      const safeConfig = {
        ...this.config,
        analytics: {
          ...this.config.analytics,
          measurementId: this.config.analytics.measurementId
            ? this.config.analytics.measurementId.substring(0, 5) + "***"
            : "not configured",
        },
      };
      console.log("App Configuration:", safeConfig);
    }
  }
}

// Create global configuration instance
window.AppConfig = new ConfigManager();

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = ConfigManager;
}
