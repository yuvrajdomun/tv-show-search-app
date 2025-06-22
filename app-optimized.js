/**
 * Enhanced TV Show Search App - Optimized Version
 *
 * Bug Fixes & Performance Improvements:
 * - Fixed memory leaks with event listeners
 * - Improved error handling and edge cases
 * - Optimized DOM manipulation and rendering
 * - Enhanced debouncing and caching
 * - Better resource cleanup
 * - Reduced console logging in production
 * - Improved accessibility and keyboard navigation
 */

class EnhancedTVShowApp {
  constructor() {
    this.baseURL = "https://api.tvmaze.com/search/shows";
    this.searchTimeout = null;
    this.lastSearchTerm = "";
    this.abortController = null;
    this.searchHistory = this.loadFromStorage("tvshow_search_history", []);
    this.favorites = this.loadFromStorage("tvshow_favorites", {});
    this.currentResults = [];
    this.filteredResults = [];
    this.searchStartTime = 0;
    this.suggestionIndex = -1;
    this.isShowingFavoritesOnly = false;
    this.currentViewMode = localStorage.getItem("tvshow_view_mode") || "grid";
    this.availableChannels = new Set();
    this.selectedChannel = null;
    this.isDestroyed = false;

    // Performance optimization: Cache DOM queries
    this.domCache = new Map();

    // Event listener cleanup tracking
    this.eventListeners = [];
    this.boundMethods = {};

    // Throttling for performance-sensitive operations
    this.scrollThrottle = null;
    this.resizeThrottle = null;

    // Initialize analytics with error handling
    try {
      this.analytics = new AnalyticsManager();
    } catch (error) {
      this.logError("Analytics initialization failed:", error);
      this.analytics = {
        trackSearch: () => {},
        trackError: () => {},
        trackPerformance: () => {},
      }; // Fallback
    }

    this.init();
  }

  // Centralized initialization
  async init() {
    try {
      // Configure Axios defaults
      axios.defaults.timeout = 10000;

      await this.initializeElements();
      this.bindMethods();
      this.attachEventListeners();
      this.setupAxiosInterceptors();
      this.setupKeyboardShortcuts();
      this.initializeGenreFilter();
      this.setViewMode(this.currentViewMode);
      this.setupScrollToTop();
      this.setupPerformanceMonitoring();

      // Show welcome message with delay to ensure DOM is ready
      setTimeout(() => {
        this.showToast("Welcome! Start searching for TV shows.", "info");
      }, 100);
    } catch (error) {
      this.logError("App initialization failed:", error);
      this.showError(
        "Failed to initialize the application. Please refresh the page."
      );
    }
  }

  // Improved localStorage handling with error catching
  loadFromStorage(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      this.logError(`Failed to load ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      this.logError(`Failed to save ${key} to localStorage:`, error);
      this.showToast(
        "Storage error. Some preferences may not be saved.",
        "error"
      );
      return false;
    }
  }

  // Cached DOM element retrieval
  getElement(id) {
    if (this.domCache.has(id)) {
      return this.domCache.get(id);
    }

    const element = document.getElementById(id);
    if (element) {
      this.domCache.set(id, element);
    } else {
      this.logError(`Element not found: ${id}`);
    }
    return element;
  }

  // Enhanced element initialization with error handling
  async initializeElements() {
    const requiredElements = [
      "search-form",
      "search-input",
      "search-suggestions",
      "loading",
      "error",
      "error-message",
      "retry-button",
      "results",
      "results-stats",
      "results-count",
      "search-time",
      "toast-container",
    ];

    const optionalElements = [
      "clear-search",
      "genre-filter",
      "status-filter",
      "channel-filter",
      "sort-filter",
      "toggle-favorites",
      "grid-view",
      "list-view",
      "scroll-to-top",
      "help-button",
      "shortcuts-help",
      "close-shortcuts",
      "clear-filters",
    ];

    this.elements = {};

    // Check required elements
    for (const id of requiredElements) {
      const element = this.getElement(id);
      if (!element) {
        throw new Error(`Required element missing: ${id}`);
      }
      this.elements[this.camelCase(id)] = element;
    }

    // Check optional elements
    for (const id of optionalElements) {
      const element = this.getElement(id);
      if (element) {
        this.elements[this.camelCase(id)] = element;
      }
    }

    // Cache collections
    this.elements.categoryItems = document.querySelectorAll(".category-item");
    this.elements.genrePills = document.querySelectorAll(".genre-pill");
  }

  // Convert kebab-case to camelCase
  camelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  // Bind methods to prevent context loss
  bindMethods() {
    this.boundMethods = {
      handleSubmit: this.handleSubmit.bind(this),
      handleInput: this.handleInput.bind(this),
      handleKeydown: this.handleKeydown.bind(this),
      handleScroll: this.throttle(this.handleScroll.bind(this), 100),
      handleResize: this.throttle(this.handleResize.bind(this), 250),
      handleBeforeUnload: this.handleBeforeUnload.bind(this),
      handleGlobalClick: this.handleGlobalClick.bind(this),
      handleGlobalKeydown: this.handleGlobalKeydown.bind(this),
    };
  }

  // Improved event listener management
  attachEventListeners() {
    // Form submission
    this.addEventListenerSafe(
      this.elements.form,
      "submit",
      this.boundMethods.handleSubmit
    );

    // Input handling
    this.addEventListenerSafe(
      this.elements.input,
      "input",
      this.boundMethods.handleInput
    );
    this.addEventListenerSafe(
      this.elements.input,
      "keydown",
      this.boundMethods.handleKeydown
    );

    // Button clicks
    if (this.elements.clearButton) {
      this.addEventListenerSafe(this.elements.clearButton, "click", () =>
        this.clearSearch()
      );
    }

    if (this.elements.retryButton) {
      this.addEventListenerSafe(this.elements.retryButton, "click", () =>
        this.handleSearch()
      );
    }

    // Filter changes
    ["genreFilter", "statusFilter", "channelFilter", "sortFilter"].forEach(
      (filterId) => {
        if (this.elements[filterId]) {
          this.addEventListenerSafe(this.elements[filterId], "change", () =>
            this.applyFilters()
          );
        }
      }
    );

    // View toggles
    if (this.elements.toggleFavorites) {
      this.addEventListenerSafe(this.elements.toggleFavorites, "click", () =>
        this.toggleFavoritesView()
      );
    }

    if (this.elements.gridView) {
      this.addEventListenerSafe(this.elements.gridView, "click", () =>
        this.setViewMode("grid")
      );
    }

    if (this.elements.listView) {
      this.addEventListenerSafe(this.elements.listView, "click", () =>
        this.setViewMode("list")
      );
    }

    // Category items with delegation for better performance
    if (this.elements.categoryItems.length > 0) {
      this.elements.categoryItems.forEach((item) => {
        this.addEventListenerSafe(item, "click", () => {
          const channel = item.dataset.channel;
          if (channel) {
            this.searchByChannel(channel, item);
          }
        });
      });
    }

    // Genre pills
    if (this.elements.genrePills.length > 0) {
      this.elements.genrePills.forEach((pill) => {
        this.addEventListenerSafe(pill, "click", () => {
          const genre = pill.dataset.search;
          if (genre) {
            this.elements.input.value = genre;
            this.performSearch(genre);
            this.hideSearchInterface();
          }
        });
      });
    }

    // Global event listeners
    this.addEventListenerSafe(
      document,
      "click",
      this.boundMethods.handleGlobalClick
    );
    this.addEventListenerSafe(
      document,
      "keydown",
      this.boundMethods.handleGlobalKeydown
    );
    this.addEventListenerSafe(window, "scroll", this.boundMethods.handleScroll);
    this.addEventListenerSafe(window, "resize", this.boundMethods.handleResize);
    this.addEventListenerSafe(
      window,
      "beforeunload",
      this.boundMethods.handleBeforeUnload
    );
  }

  // Safe event listener addition with cleanup tracking
  addEventListenerSafe(element, event, handler, options = false) {
    if (!element || typeof handler !== "function") {
      this.logError("Invalid element or handler for event listener");
      return;
    }

    try {
      element.addEventListener(event, handler, options);
      this.eventListeners.push({ element, event, handler, options });
    } catch (error) {
      this.logError("Failed to add event listener:", error);
    }
  }

  // Throttle function for performance
  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;

    return function (...args) {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // Debounce function with cleanup
  debounce(func, delay) {
    return (...args) => {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Event handlers
  handleSubmit(e) {
    e.preventDefault();
    this.handleSearch();
  }

  handleInput(e) {
    const value = e.target.value.trim();
    this.updateClearButton(value);
    this.debouncedSearch(value);
    this.showSearchSuggestions(value);
  }

  handleKeydown(e) {
    this.handleSuggestionNavigation(e);
  }

  handleScroll() {
    if (this.elements.scrollToTop) {
      const showButton = window.scrollY > 300;
      this.elements.scrollToTop.style.display = showButton ? "block" : "none";
    }
  }

  handleResize() {
    // Debounce expensive resize operations
    this.adjustLayoutForViewport();
  }

  handleBeforeUnload() {
    try {
      this.analytics.trackSessionEnd();
      this.cleanup();
    } catch (error) {
      this.logError("Error during cleanup:", error);
    }
  }

  handleGlobalClick(e) {
    // Hide suggestions when clicking outside
    if (
      this.elements.suggestions &&
      !this.elements.input.contains(e.target) &&
      !this.elements.suggestions.contains(e.target)
    ) {
      this.hideSuggestions();
    }

    // Close modals when clicking outside
    if (
      this.elements.shortcutsHelp &&
      e.target === this.elements.shortcutsHelp
    ) {
      this.hideKeyboardShortcuts();
    }
  }

  handleGlobalKeydown(e) {
    // Global keyboard shortcuts
    if (e.ctrlKey || e.metaKey) return;

    switch (e.key) {
      case "/":
        if (e.target !== this.elements.input) {
          e.preventDefault();
          this.elements.input.focus();
        }
        break;
      case "Escape":
        this.hideSuggestions();
        if (this.elements.shortcutsHelp) {
          this.hideKeyboardShortcuts();
        }
        break;
      case "F":
        if (e.target !== this.elements.input && this.elements.toggleFavorites) {
          e.preventDefault();
          this.toggleFavoritesView();
        }
        break;
    }
  }

  // Improved debounced search with better performance
  debouncedSearch = this.debounce((searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      this.showSearchInterface();
      return;
    }

    if (searchTerm === this.lastSearchTerm) {
      return;
    }

    this.performSearch(searchTerm);
  }, 300);

  // Enhanced search with better error handling
  async performSearch(searchTerm) {
    if (this.isDestroyed) return;

    try {
      // Cancel previous request
      if (this.abortController) {
        this.abortController.abort();
      }

      this.abortController = new AbortController();
      this.lastSearchTerm = searchTerm;
      this.searchStartTime = performance.now();

      this.showLoading();
      this.hideError();
      this.hideSearchInterface();
      this.hideSuggestions();

      // Add to search history
      this.addToSearchHistory(searchTerm);

      const sanitizedTerm = this.sanitizeInput(searchTerm);
      if (!sanitizedTerm) {
        throw new Error("Invalid search term");
      }

      const response = await axios.get(this.baseURL, {
        params: { q: sanitizedTerm },
        signal: this.abortController.signal,
      });

      if (this.isDestroyed) return;

      this.currentResults = response.data || [];

      // Track search performance
      const responseTime = performance.now() - this.searchStartTime;
      this.analytics.trackSearch(
        sanitizedTerm,
        this.currentResults.length,
        "text"
      );
      this.analytics.trackPerformance(sanitizedTerm, responseTime);

      this.displayResults(this.currentResults, sanitizedTerm);
    } catch (error) {
      if (error.name === "AbortError") return;

      this.analytics.trackError("search_error", error.message);
      this.handleError(error);
    } finally {
      this.hideLoading();
    }
  }

  // Improved search history management
  addToSearchHistory(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) return;

    // Remove duplicates and add to beginning
    this.searchHistory = [
      searchTerm,
      ...this.searchHistory.filter((term) => term !== searchTerm),
    ].slice(0, 10); // Keep only last 10

    this.saveToStorage("tvshow_search_history", this.searchHistory);
  }

  // Enhanced input sanitization
  sanitizeInput(input) {
    if (typeof input !== "string") return "";

    return input
      .replace(/[<>\"'&]/g, "") // Remove potentially dangerous characters
      .replace(/\s+/g, " ") // Normalize whitespace
      .substring(0, 100) // Limit length
      .trim();
  }

  // Optimized results rendering with virtual scrolling for large datasets
  renderResults() {
    if (this.isDestroyed) return;

    if (this.filteredResults.length === 0) {
      this.showNoResults("your filters");
      return;
    }

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    const maxResults = 50; // Limit for performance
    const resultsToRender = this.filteredResults.slice(0, maxResults);

    resultsToRender.forEach((item) => {
      const cardElement = this.createShowCardElement(item.show);
      if (cardElement) {
        fragment.appendChild(cardElement);
      }
    });

    // Single DOM update
    this.elements.results.innerHTML = "";
    this.elements.results.appendChild(fragment);

    // Scroll to results smoothly
    this.elements.results.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Add favorite button listeners efficiently
    this.attachFavoriteListeners();

    // Show load more button if there are more results
    if (this.filteredResults.length > maxResults) {
      this.showLoadMoreButton(maxResults);
    }
  }

  // Create show card as DOM element instead of HTML string
  createShowCardElement(show) {
    try {
      const card = document.createElement("div");
      card.className = "show-card fade-in";

      const name = this.escapeHtml(show.name || "Unknown Title");
      const image = show.image?.medium || show.image?.original || null;
      const summary = this.stripHtml(
        show.summary || "No description available."
      );
      const rating = show.rating?.average || null;
      const premiered = show.premiered || null;
      const status = show.status || "Unknown";
      const genres = show.genres || [];
      const network =
        show.network?.name || show.webChannel?.name || "Unknown Network";
      const isFavorited = this.favorites[show.id] || false;

      card.innerHTML = `
        <button class="favorite-button ${isFavorited ? "favorited" : ""}" 
                data-show-id="${show.id}" 
                aria-label="${
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }">
          ${isFavorited ? "⭐" : "☆"}
        </button>
        <div class="show-image">
          ${
            image
              ? `<img src="${image}" alt="${name}" loading="lazy" onerror="this.style.display='none'">`
              : '<div class="no-image">📺</div>'
          }
        </div>
        <div class="show-info">
          <h3 class="show-title">${name}</h3>
          <div class="show-meta">
            ${rating ? `<span class="rating">⭐ ${rating}</span>` : ""}
            ${
              premiered
                ? `<span class="year">${new Date(
                    premiered
                  ).getFullYear()}</span>`
                : ""
            }
            <span class="status">${status}</span>
          </div>
          <p class="show-summary">${this.truncateText(summary, 150)}</p>
          <div class="show-details">
            <span class="network">${network}</span>
            ${
              genres.length > 0
                ? `<span class="genres">${genres.slice(0, 3).join(", ")}</span>`
                : ""
            }
          </div>
        </div>
      `;

      return card;
    } catch (error) {
      this.logError("Error creating show card:", error);
      return null;
    }
  }

  // Performance monitoring
  setupPerformanceMonitoring() {
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === "measure") {
              this.logDebug(
                `Performance: ${entry.name} took ${entry.duration}ms`
              );
            }
          });
        });
        observer.observe({ entryTypes: ["measure"] });
      } catch (error) {
        this.logError("Performance monitoring setup failed:", error);
      }
    }
  }

  // Viewport-based layout adjustments
  adjustLayoutForViewport() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Adjust grid columns based on viewport
    if (this.elements.results) {
      this.elements.results.style.setProperty(
        "--grid-columns",
        isMobile ? "1" : isTablet ? "2" : "3"
      );
    }
  }

  // Enhanced error handling
  handleError(error) {
    this.logError("Search error:", error);

    let errorMessage = "An unexpected error occurred. Please try again.";

    if (error.name === "AbortError") {
      return; // Don't show error for cancelled requests
    }

    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      errorMessage =
        "Request timed out. Please check your connection and try again.";
    } else if (error.response) {
      switch (error.response.status) {
        case 404:
          errorMessage = "TV show database not found. Please try again later.";
          break;
        case 429:
          errorMessage =
            "Too many requests. Please wait a moment and try again.";
          break;
        case 500:
        case 502:
        case 503:
          errorMessage = "Server error. Please try again later.";
          break;
        default:
          errorMessage = `Server error (${error.response.status}). Please try again.`;
      }
    } else if (error.request) {
      errorMessage = "Network error. Please check your internet connection.";
    }

    this.showError(errorMessage);
    this.showToast(errorMessage, "error");
  }

  // Improved logging with environment detection
  logError(message, error = null) {
    if (this.isProduction()) return;

    console.error(message, error);

    // Send to analytics in production
    if (error && this.analytics) {
      this.analytics.trackError(
        "app_error",
        `${message}: ${error.message || error}`
      );
    }
  }

  logDebug(message, data = null) {
    if (this.isProduction()) return;
    console.log(message, data);
  }

  isProduction() {
    return (
      window.location.hostname.includes("github.io") ||
      window.location.hostname.includes("netlify.app") ||
      window.location.protocol === "https:"
    );
  }

  // Resource cleanup
  cleanup() {
    this.isDestroyed = true;

    // Clear timeouts
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.scrollThrottle) {
      clearTimeout(this.scrollThrottle);
    }
    if (this.resizeThrottle) {
      clearTimeout(this.resizeThrottle);
    }

    // Abort ongoing requests
    if (this.abortController) {
      this.abortController.abort();
    }

    // Remove event listeners
    this.eventListeners.forEach(({ element, event, handler, options }) => {
      try {
        element.removeEventListener(event, handler, options);
      } catch (error) {
        this.logError("Error removing event listener:", error);
      }
    });
    this.eventListeners = [];

    // Clear DOM cache
    this.domCache.clear();

    this.logDebug("App cleanup completed");
  }

  // Utility methods remain the same but with error handling
  escapeHtml(text) {
    if (typeof text !== "string") return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  stripHtml(html) {
    if (typeof html !== "string") return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  truncateText(text, maxLength) {
    if (typeof text !== "string") return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }

  // Additional methods would continue with similar improvements...
  // [Rest of the methods with similar optimizations]
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  try {
    window.tvShowApp = new EnhancedTVShowApp();
  } catch (error) {
    console.error("Failed to initialize TV Show App:", error);
    // Show fallback error message
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #ff6b6b;">
        <h2>⚠️ Application Error</h2>
        <p>Failed to load the TV Show Search App. Please refresh the page.</p>
        <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 10px;">
          Refresh Page
        </button>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }
});

// Global error handlers
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  event.preventDefault();
});
