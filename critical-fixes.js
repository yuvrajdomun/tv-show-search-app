/**
 * Critical Bug Fixes for TV Show Search App
 * Apply these fixes immediately to resolve high-priority issues
 */

// Fix 1: Analytics Infinite Loop Prevention
// Replace the initializeWhenReady method in analytics.js
function fixAnalyticsInfiniteLoop() {
  // In analytics.js, replace the initializeWhenReady method:
  /*
  initializeWhenReady() {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds maximum
    
    const checkConfig = () => {
      attempts++;
      
      if (window.AppConfig) {
        this.measurementId = window.AppConfig.get("analytics.measurementId");
        this.isEnabled = window.AppConfig.get("analytics.enabled") && typeof gtag !== "undefined";
        
        if (this.isEnabled) {
          this.initializeGA4();
          console.log("📊 AnalyticsManager initialized successfully");
        } else {
          console.log("📊 AnalyticsManager disabled (no config or gtag)");
        }
      } else if (attempts < maxAttempts) {
        setTimeout(checkConfig, 100);
      } else {
        console.warn("📊 AnalyticsManager disabled: Configuration timeout after 5 seconds");
        this.isEnabled = false;
      }
    };
    
    checkConfig();
  }
  */
}

// Fix 2: Event Listener Memory Leak Prevention
// Add these methods to the main app class
function addEventListenerCleanup() {
  // Add to constructor:
  /*
  this.eventListeners = [];
  this.isDestroyed = false;
  
  // Add cleanup on page unload
  window.addEventListener('beforeunload', () => {
    this.cleanup();
  });
  */
  // Add this method to the class:
  /*
  addEventListenerSafe(element, event, handler, options = false) {
    if (!element || typeof handler !== 'function') {
      console.error('Invalid element or handler for event listener');
      return;
    }

    try {
      element.addEventListener(event, handler, options);
      this.eventListeners.push({ element, event, handler, options });
    } catch (error) {
      console.error('Failed to add event listener:', error);
    }
  }
  
  cleanup() {
    this.isDestroyed = true;
    
    // Clear timeouts
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
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
        console.error('Error removing event listener:', error);
      }
    });
    this.eventListeners = [];
  }
  */
}

// Fix 3: Race Condition in Search
// Replace the performSearch method with this version:
function fixSearchRaceCondition() {
  /*
  async performSearch(searchTerm) {
    if (this.isDestroyed) return;
    
    try {
      // Generate unique request ID to prevent race conditions
      const requestId = Date.now() + Math.random();
      this.currentRequestId = requestId;
      
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
        throw new Error('Invalid search term');
      }

      const response = await axios.get(this.baseURL, {
        params: { q: sanitizedTerm },
        signal: this.abortController.signal,
      });

      // Only process if this is still the latest request
      if (this.currentRequestId !== requestId || this.isDestroyed) {
        return;
      }

      this.currentResults = response.data || [];

      // Track search performance
      const responseTime = performance.now() - this.searchStartTime;
      this.analytics.trackSearch(sanitizedTerm, this.currentResults.length, "text");
      this.analytics.trackPerformance(sanitizedTerm, responseTime);

      this.displayResults(this.currentResults, sanitizedTerm);

    } catch (error) {
      if (error.name === 'AbortError') return;
      
      this.analytics.trackError("search_error", error.message);
      this.handleError(error);
    } finally {
      this.hideLoading();
    }
  }
  */
}

// Fix 4: Safe localStorage Operations
// Replace localStorage operations with these safe versions:
function addSafeLocalStorage() {
  /*
  // Add this to the class:
  loadFromStorage(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
      this.showToast("Storage error. Some preferences may not be saved.", "error");
      return defaultValue;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
      this.showToast("Storage error. Some preferences may not be saved.", "error");
      return false;
    }
  }
  
  // Update constructor to use safe loading:
  this.searchHistory = this.loadFromStorage("tvshow_search_history", []);
  this.favorites = this.loadFromStorage("tvshow_favorites", {});
  
  // Update addToSearchHistory method:
  addToSearchHistory(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) return;

    // Remove duplicates and add to beginning
    this.searchHistory = [
      searchTerm,
      ...this.searchHistory.filter(term => term !== searchTerm)
    ].slice(0, 10);

    this.saveToStorage("tvshow_search_history", this.searchHistory);
  }
  */
}

// Fix 5: Enhanced Input Sanitization
function enhanceInputSanitization() {
  /*
  // Replace the sanitizeInput method:
  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>\"'&]/g, "") // Remove potentially dangerous characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .substring(0, 100) // Limit length
      .trim();
  }
  
  // Add input validation:
  validateSearchTerm(term) {
    if (typeof term !== 'string') return false;
    if (term.length < 2 || term.length > 100) return false;
    if (/<script|javascript:|data:|vbscript:/i.test(term)) return false;
    return true;
  }
  
  // Update handleSearch method:
  async handleSearch() {
    const searchTerm = this.elements.input.value.trim();

    if (!searchTerm) {
      this.showToast("Please enter a search term", "error");
      return;
    }

    if (!this.validateSearchTerm(searchTerm)) {
      this.showToast("Invalid search term. Please use only letters, numbers, and spaces.", "error");
      return;
    }

    await this.performSearch(searchTerm);
  }
  */
}

// Fix 6: Production Logging
function addProductionLogging() {
  /*
  // Add these methods to the class:
  isProduction() {
    return window.location.hostname.includes('github.io') || 
           window.location.hostname.includes('netlify.app') ||
           window.location.protocol === 'https:';
  }
  
  logError(message, error = null) {
    console.error(message, error);
    
    // Send to analytics in production
    if (error && this.analytics) {
      this.analytics.trackError('app_error', `${message}: ${error.message || error}`);
    }
  }

  logDebug(message, data = null) {
    if (!this.isProduction()) {
      console.log(message, data);
    }
  }
  
  // Replace all console.log statements with this.logDebug()
  // Replace all console.error statements with this.logError()
  */
}

// Fix 7: Improved Error Handling
function addGlobalErrorHandling() {
  /*
  // Add to the end of app.js:
  
  // Global error handlers
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    if (window.tvShowApp && window.tvShowApp.analytics) {
      window.tvShowApp.analytics.trackError('global_error', event.error?.message || 'Unknown error');
    }
    
    // Show user-friendly error message
    if (window.tvShowApp) {
      window.tvShowApp.showToast('An unexpected error occurred. Please refresh if issues persist.', 'error');
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (window.tvShowApp && window.tvShowApp.analytics) {
      window.tvShowApp.analytics.trackError('unhandled_promise', event.reason?.message || 'Promise rejection');
    }
    
    event.preventDefault();
  });
  */
}

// Fix 8: Optimize DOM Manipulation
function optimizeDOMManipulation() {
  /*
  // Replace the showSearchSuggestions method:
  showSearchSuggestions(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) {
      this.hideSuggestions();
      return;
    }

    const suggestions = this.searchHistory
      .filter((term) => term.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);

    if (suggestions.length > 0) {
      // Use DocumentFragment for better performance
      const fragment = document.createDocumentFragment();
      
      suggestions.forEach((suggestion, index) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.dataset.index = index;
        div.textContent = suggestion; // Use textContent instead of innerHTML
        fragment.appendChild(div);
      });

      // Single DOM update
      this.elements.suggestions.replaceChildren(fragment);
      this.elements.suggestions.classList.remove("hidden");
      this.suggestionIndex = -1;

      // Use event delegation instead of individual listeners
      if (!this.suggestionsDelegated) {
        this.addEventListenerSafe(this.elements.suggestions, 'click', (e) => {
          if (e.target.matches('.suggestion-item')) {
            this.elements.input.value = e.target.textContent;
            this.performSearch(e.target.textContent);
            this.hideSuggestions();
          }
        });
        this.suggestionsDelegated = true;
      }
    } else {
      this.hideSuggestions();
    }
  }
  */
}

// Quick Implementation Guide
console.log(`
🚀 CRITICAL FIXES IMPLEMENTATION GUIDE

Apply these fixes in order:

1. Analytics Infinite Loop (HIGH PRIORITY)
   - Update analytics.js initializeWhenReady method
   
2. Event Listener Cleanup (HIGH PRIORITY)
   - Add eventListeners array to constructor
   - Add addEventListenerSafe method
   - Add cleanup method
   - Replace all addEventListener calls
   
3. Search Race Condition (HIGH PRIORITY)
   - Add currentRequestId to constructor
   - Update performSearch method
   
4. Safe localStorage (MEDIUM PRIORITY)
   - Add loadFromStorage and saveToStorage methods
   - Update constructor and related methods
   
5. Input Sanitization (MEDIUM PRIORITY)
   - Update sanitizeInput method
   - Add validateSearchTerm method
   - Update handleSearch method
   
6. Production Logging (LOW PRIORITY)
   - Add isProduction, logError, logDebug methods
   - Replace console statements
   
7. Global Error Handling (LOW PRIORITY)
   - Add global error listeners
   
8. DOM Optimization (LOW PRIORITY)
   - Update showSearchSuggestions method
   - Use DocumentFragment and event delegation

After applying fixes, test thoroughly:
- Search functionality
- Error scenarios
- Memory usage (dev tools)
- Performance (network tab)
- Mobile responsiveness
`);

export {
  fixAnalyticsInfiniteLoop,
  addEventListenerCleanup,
  fixSearchRaceCondition,
  addSafeLocalStorage,
  enhanceInputSanitization,
  addProductionLogging,
  addGlobalErrorHandling,
  optimizeDOMManipulation,
};
