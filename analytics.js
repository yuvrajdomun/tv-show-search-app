/**
 * Analytics Module for TV Show Search App
 * Handles Google Analytics 4 tracking and custom events
 */

class AnalyticsManager {
  constructor() {
    this.isEnabled = false;
    this.userId = this.generateUserId();
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.measurementId = null;

    // Wait for configuration to be loaded
    this.initializeWhenReady();
  }

  // Initialize when configuration is ready
  initializeWhenReady() {
    const checkConfig = () => {
      if (window.AppConfig) {
        this.measurementId = window.AppConfig.get("analytics.measurementId");
        this.isEnabled =
          window.AppConfig.get("analytics.enabled") &&
          typeof gtag !== "undefined";

        if (this.isEnabled) {
          this.initializeGA4();
          console.log("📊 AnalyticsManager initialized successfully");
        } else {
          console.log("📊 AnalyticsManager disabled (no config or gtag)");
        }
      } else {
        // Retry after a short delay
        setTimeout(checkConfig, 100);
      }
    };

    checkConfig();
  }

  // Generate anonymous user ID
  generateUserId() {
    let userId = localStorage.getItem("tv_app_user_id");
    if (!userId) {
      userId =
        "user_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
      localStorage.setItem("tv_app_user_id", userId);
    }
    return userId;
  }

  // Generate session ID
  generateSessionId() {
    return (
      "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
    );
  }

  // Initialize GA4 with custom user properties
  initializeGA4() {
    if (!this.isEnabled || !this.measurementId) return;

    gtag("config", this.measurementId, {
      custom_map: {
        custom_parameter_1: "user_type",
      },
      user_id: this.userId,
      anonymize_ip: true,
      allow_google_signals: false,
    });

    // Set user properties
    gtag("set", {
      user_id: this.userId,
      custom_parameter_1: "tv_show_searcher",
    });
  }

  // Track search events
  trackSearch(searchTerm, resultCount, searchType = "text") {
    if (!this.isEnabled) return;

    gtag("event", "search", {
      search_term: searchTerm,
      search_type: searchType, // 'text', 'channel', 'genre'
      result_count: resultCount,
      event_category: "user_interaction",
      event_label: searchTerm,
      value: resultCount,
    });

    // Custom event for detailed tracking
    gtag("event", "tv_show_search", {
      search_query: searchTerm,
      search_method: searchType,
      results_found: resultCount,
      user_id: this.userId,
      session_id: this.sessionId,
    });
  }

  // Track channel/network selections
  trackChannelSearch(channel, resultCount) {
    if (!this.isEnabled) return;

    gtag("event", "select_content", {
      content_type: "channel",
      content_id: channel,
      result_count: resultCount,
    });

    gtag("event", "channel_selection", {
      channel_name: channel,
      results_found: resultCount,
      user_id: this.userId,
    });
  }

  // Track favorites actions
  trackFavoriteAction(showId, showName, action) {
    if (!this.isEnabled) return;

    gtag(
      "event",
      action === "add" ? "add_to_favorites" : "remove_from_favorites",
      {
        content_type: "tv_show",
        content_id: showId,
        content_name: showName,
        event_category: "engagement",
        event_label: showName,
      }
    );
  }

  // Track filter usage
  trackFilterUsage(filterType, filterValue) {
    if (!this.isEnabled) return;

    gtag("event", "filter_applied", {
      filter_type: filterType, // 'genre', 'status', 'sort'
      filter_value: filterValue,
      event_category: "user_interaction",
    });
  }

  // Track view mode changes
  trackViewModeChange(viewMode) {
    if (!this.isEnabled) return;

    gtag("event", "view_mode_change", {
      view_mode: viewMode, // 'grid', 'list'
      event_category: "user_preference",
    });
  }

  // Track user engagement time
  trackEngagementTime() {
    if (!this.isEnabled) return;

    const engagementTime = Math.round((Date.now() - this.startTime) / 1000);

    gtag("event", "user_engagement", {
      engagement_time_msec: engagementTime * 1000,
      session_id: this.sessionId,
    });
  }

  // Track errors
  trackError(errorType, errorMessage) {
    if (!this.isEnabled) return;

    gtag("event", "exception", {
      description: errorMessage,
      fatal: false,
      error_type: errorType,
    });
  }

  // Track performance metrics
  trackPerformance(searchTerm, responseTime) {
    if (!this.isEnabled) return;

    gtag("event", "timing_complete", {
      name: "search_response_time",
      value: responseTime,
      event_category: "performance",
      event_label: searchTerm,
    });
  }

  // Track popular shows (when clicked)
  trackShowClick(showId, showName, position) {
    if (!this.isEnabled) return;

    gtag("event", "select_content", {
      content_type: "tv_show",
      content_id: showId,
      content_name: showName,
      list_position: position,
    });
  }

  // Track keyboard shortcuts usage
  trackKeyboardShortcut(shortcut) {
    if (!this.isEnabled) return;

    gtag("event", "keyboard_shortcut_used", {
      shortcut_key: shortcut,
      event_category: "user_interaction",
    });
  }

  // Track session summary on page unload
  trackSessionEnd() {
    if (!this.isEnabled) return;

    const sessionDuration = Math.round((Date.now() - this.startTime) / 1000);
    const searchHistory = JSON.parse(
      localStorage.getItem("tvshow_search_history") || "[]"
    );
    const favoritesCount = Object.keys(
      JSON.parse(localStorage.getItem("tvshow_favorites") || "{}")
    ).length;

    gtag("event", "session_end", {
      session_duration: sessionDuration,
      searches_performed: searchHistory.length,
      favorites_count: favoritesCount,
      user_id: this.userId,
      session_id: this.sessionId,
    });
  }

  // Get user insights for display (privacy-friendly)
  getUserInsights() {
    const searchHistory = JSON.parse(
      localStorage.getItem("tvshow_search_history") || "[]"
    );
    const favorites = JSON.parse(
      localStorage.getItem("tvshow_favorites") || "{}"
    );

    return {
      totalSearches: searchHistory.length,
      favoriteShows: Object.keys(favorites).length,
      recentSearches: searchHistory.slice(0, 5),
      userId: this.userId.split("_")[1] + "***", // Partial ID for privacy
      sessionTime: Math.round((Date.now() - this.startTime) / 1000 / 60), // minutes
    };
  }
}

// Export for use in main app
window.AnalyticsManager = AnalyticsManager;
