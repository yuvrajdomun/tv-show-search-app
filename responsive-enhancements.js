/**
 * Responsive Enhancements for TV Show Search App
 * Mobile-first JavaScript improvements and touch interactions
 */

class ResponsiveEnhancements {
  constructor(app) {
    this.app = app;
    this.viewport = this.getViewportInfo();
    this.touchSupport = this.detectTouchSupport();
    this.deviceInfo = this.getDeviceInfo();
    this.resizeObserver = null;
    this.orientationChangeTimeout = null;

    this.init();
  }

  init() {
    this.setupViewportTracking();
    this.setupTouchEnhancements();
    this.setupResponsiveImages();
    this.setupGestureHandling();
    this.setupPerformanceOptimizations();
    this.setupAccessibilityEnhancements();
    this.setupOrientationHandling();
    this.setupKeyboardOptimizations();
  }

  // ===================================================================
  // VIEWPORT & DEVICE DETECTION
  // ===================================================================

  getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      availableWidth: window.screen.availWidth,
      availableHeight: window.screen.availHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
      isDesktop: window.innerWidth >= 1024,
      isLandscape: window.innerWidth > window.innerHeight,
      isPortrait: window.innerHeight > window.innerWidth,
      breakpoint: this.getCurrentBreakpoint(),
    };
  }

  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width < 480) return "xs";
    if (width < 768) return "sm";
    if (width < 1024) return "md";
    if (width < 1280) return "lg";
    if (width < 1536) return "xl";
    return "2xl";
  }

  detectTouchSupport() {
    return {
      hasTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      hasPointer: "onpointerdown" in window,
      hasHover: window.matchMedia("(hover: hover)").matches,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isAndroid: /Android/.test(navigator.userAgent),
      isMobile: /Mobi|Android/i.test(navigator.userAgent),
    };
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      language: navigator.language,
      languages: navigator.languages,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      deviceMemory: navigator.deviceMemory || 4,
      connection:
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection,
    };
  }

  // ===================================================================
  // VIEWPORT TRACKING & RESPONSIVE UPDATES
  // ===================================================================

  setupViewportTracking() {
    // Throttled resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateViewportInfo();
        this.handleResponsiveChanges();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    // Track resize events for analytics
    this.app.addEventListenerSafe(window, "resize", () => {
      this.app.analytics.trackViewportChange?.(this.viewport);
    });

    // Setup Resize Observer for container-based responsive design
    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          this.handleContainerResize(entry);
        }
      });

      // Observe main container
      const container = document.querySelector(".container");
      if (container) {
        this.resizeObserver.observe(container);
      }
    }
  }

  updateViewportInfo() {
    const oldBreakpoint = this.viewport.breakpoint;
    this.viewport = this.getViewportInfo();

    // Trigger breakpoint change event if needed
    if (oldBreakpoint !== this.viewport.breakpoint) {
      this.handleBreakpointChange(oldBreakpoint, this.viewport.breakpoint);
    }
  }

  handleResponsiveChanges() {
    this.adjustLayoutForViewport();
    this.updateTouchTargets();
    this.optimizeForCurrentViewport();
    this.updateGridColumns();
    this.adjustModalSizes();
  }

  handleBreakpointChange(oldBreakpoint, newBreakpoint) {
    console.log(`Breakpoint changed: ${oldBreakpoint} → ${newBreakpoint}`);

    // Update CSS custom properties
    document.documentElement.style.setProperty(
      "--current-breakpoint",
      newBreakpoint
    );

    // Trigger custom event
    window.dispatchEvent(
      new CustomEvent("breakpointChange", {
        detail: { oldBreakpoint, newBreakpoint, viewport: this.viewport },
      })
    );

    // Analytics tracking
    this.app.analytics.trackBreakpointChange?.(oldBreakpoint, newBreakpoint);
  }

  handleContainerResize(entry) {
    const { width, height } = entry.contentRect;

    // Adjust grid columns based on container width
    const results = document.getElementById("results");
    if (results) {
      const columns = this.calculateOptimalColumns(width);
      results.style.setProperty("--grid-columns", columns);
    }
  }

  calculateOptimalColumns(containerWidth) {
    const cardMinWidth = 280;
    const gap = 24;
    const columns = Math.floor((containerWidth + gap) / (cardMinWidth + gap));
    return Math.max(1, columns);
  }

  // ===================================================================
  // TOUCH & GESTURE ENHANCEMENTS
  // ===================================================================

  setupTouchEnhancements() {
    if (!this.touchSupport.hasTouch) return;

    // Add touch-specific CSS class
    document.documentElement.classList.add("touch-device");

    // Disable hover effects on touch devices
    if (!this.touchSupport.hasHover) {
      document.documentElement.classList.add("no-hover");
    }

    // Improve touch target sizes
    this.updateTouchTargets();

    // Add touch feedback
    this.setupTouchFeedback();

    // Handle iOS-specific issues
    if (this.touchSupport.isIOS) {
      this.setupIOSFixes();
    }
  }

  updateTouchTargets() {
    const touchTargets = document.querySelectorAll(
      'button, a, input, select, [role="button"]'
    );

    touchTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      const minSize = 44; // WCAG minimum

      if (rect.width < minSize || rect.height < minSize) {
        target.style.minWidth = `${minSize}px`;
        target.style.minHeight = `${minSize}px`;
        target.classList.add("touch-target-enhanced");
      }
    });
  }

  setupTouchFeedback() {
    // Add visual feedback for touch interactions
    const addTouchFeedback = (element) => {
      element.addEventListener("touchstart", () => {
        element.classList.add("touch-active");
      });

      element.addEventListener("touchend", () => {
        setTimeout(() => {
          element.classList.remove("touch-active");
        }, 150);
      });

      element.addEventListener("touchcancel", () => {
        element.classList.remove("touch-active");
      });
    };

    // Apply to interactive elements
    document
      .querySelectorAll("button, .category-item, .show-card, .genre-pill")
      .forEach(addTouchFeedback);
  }

  setupIOSFixes() {
    // Fix iOS viewport height issues
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);

    // Fix iOS scroll momentum
    document.body.style.webkitOverflowScrolling = "touch";

    // Prevent zoom on input focus
    const inputs = document.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute(
            "content",
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          );
        }
      });

      input.addEventListener("blur", () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute(
            "content",
            "width=device-width, initial-scale=1.0"
          );
        }
      });
    });
  }

  // ===================================================================
  // GESTURE HANDLING
  // ===================================================================

  setupGestureHandling() {
    if (!this.touchSupport.hasTouch) return;

    // Swipe gestures for navigation
    this.setupSwipeGestures();

    // Pull-to-refresh (if supported)
    this.setupPullToRefresh();

    // Pinch-to-zoom handling
    this.setupPinchHandling();
  }

  setupSwipeGestures() {
    let startX, startY, startTime;
    const threshold = 50; // Minimum distance for swipe
    const timeThreshold = 300; // Maximum time for swipe

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      if (!startX || !startY) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const deltaTime = Date.now() - startTime;

      if (deltaTime > timeThreshold) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > threshold && absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      } else if (absY > threshold && absY > absX) {
        // Vertical swipe
        if (deltaY > 0) {
          this.handleSwipeDown();
        } else {
          this.handleSwipeUp();
        }
      }

      startX = startY = startTime = null;
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
  }

  handleSwipeLeft() {
    // Could be used for navigation or dismissing elements
    console.log("Swipe left detected");
  }

  handleSwipeRight() {
    // Could be used for navigation or showing menus
    console.log("Swipe right detected");
  }

  handleSwipeUp() {
    // Could be used for showing more content
    console.log("Swipe up detected");
  }

  handleSwipeDown() {
    // Could trigger pull-to-refresh
    console.log("Swipe down detected");
  }

  setupPullToRefresh() {
    // Simple pull-to-refresh implementation
    let startY = 0;
    let isPulling = false;
    const threshold = 100;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > threshold) {
        // Show pull-to-refresh indicator
        this.showPullToRefreshIndicator();
      }
    };

    const handleTouchEnd = (e) => {
      if (!isPulling) return;

      const currentY = e.changedTouches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > threshold) {
        this.triggerRefresh();
      }

      this.hidePullToRefreshIndicator();
      isPulling = false;
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
  }

  showPullToRefreshIndicator() {
    // Implementation for showing refresh indicator
    console.log("Show pull-to-refresh indicator");
  }

  hidePullToRefreshIndicator() {
    // Implementation for hiding refresh indicator
    console.log("Hide pull-to-refresh indicator");
  }

  triggerRefresh() {
    // Trigger app refresh
    console.log("Triggering refresh");
    this.app.showToast("Refreshing...", "info");
    // Could trigger a new search or reload current results
  }

  setupPinchHandling() {
    // Prevent default pinch-to-zoom on specific elements
    const preventPinch = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Apply to specific containers where pinch should be disabled
    const containers = document.querySelectorAll(".search-form, .results");
    containers.forEach((container) => {
      container.addEventListener("touchstart", preventPinch, {
        passive: false,
      });
    });
  }

  // ===================================================================
  // RESPONSIVE IMAGES & PERFORMANCE
  // ===================================================================

  setupResponsiveImages() {
    // Implement lazy loading for images
    this.setupLazyLoading();

    // Setup responsive image loading
    this.setupResponsiveImageLoading();

    // Optimize image loading based on connection
    this.optimizeImageLoadingForConnection();
  }

  setupLazyLoading() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              this.loadImage(img);
              imageObserver.unobserve(img);
            }
          });
        },
        {
          rootMargin: "50px",
        }
      );

      // Observe all images with data-src
      const lazyImages = document.querySelectorAll("img[data-src]");
      lazyImages.forEach((img) => imageObserver.observe(img));
    }
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.classList.add("loaded");
      img.removeAttribute("data-src");
    }
  }

  setupResponsiveImageLoading() {
    // Load appropriate image sizes based on viewport
    const loadAppropriateImage = (img) => {
      const { width } = this.viewport;
      let size = "medium";

      if (width < 480) size = "small";
      else if (width > 1200) size = "large";

      const srcset = img.dataset.srcset;
      if (srcset) {
        const sources = srcset.split(",");
        const appropriateSource =
          sources.find((src) => src.includes(size)) || sources[0];
        img.src = appropriateSource.split(" ")[0];
      }
    };

    // Apply to show images
    const showImages = document.querySelectorAll(".show-image img");
    showImages.forEach(loadAppropriateImage);
  }

  optimizeImageLoadingForConnection() {
    const connection = this.deviceInfo.connection;
    if (!connection) return;

    // Adjust image quality based on connection speed
    const isSlowConnection =
      connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g" ||
      connection.saveData;

    if (isSlowConnection) {
      document.documentElement.classList.add("slow-connection");

      // Load lower quality images
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        if (img.dataset.lowQuality) {
          img.src = img.dataset.lowQuality;
        }
      });
    }
  }

  // ===================================================================
  // PERFORMANCE OPTIMIZATIONS
  // ===================================================================

  setupPerformanceOptimizations() {
    // Implement virtual scrolling for large lists
    this.setupVirtualScrolling();

    // Optimize animations based on device performance
    this.optimizeAnimations();

    // Setup performance monitoring
    this.setupPerformanceMonitoring();
  }

  setupVirtualScrolling() {
    // Simple virtual scrolling implementation for results
    const resultsContainer = document.getElementById("results");
    if (!resultsContainer) return;

    const itemHeight = 400; // Approximate height of show card
    const bufferSize = 5; // Number of items to render outside viewport

    const updateVisibleItems = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const containerTop = resultsContainer.offsetTop;

      const startIndex = Math.max(
        0,
        Math.floor((scrollTop - containerTop) / itemHeight) - bufferSize
      );
      const endIndex = Math.min(
        this.app.filteredResults.length,
        Math.ceil((scrollTop + viewportHeight - containerTop) / itemHeight) +
          bufferSize
      );

      // Only update if there are many items (performance optimization)
      if (this.app.filteredResults.length > 50) {
        this.renderVisibleItems(startIndex, endIndex);
      }
    };

    // Throttled scroll handler
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateVisibleItems, 16); // ~60fps
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  renderVisibleItems(startIndex, endIndex) {
    // Implementation would update the DOM to show only visible items
    console.log(`Rendering items ${startIndex} to ${endIndex}`);
  }

  optimizeAnimations() {
    // Reduce animations on low-end devices
    const isLowEndDevice =
      this.deviceInfo.hardwareConcurrency < 4 ||
      this.deviceInfo.deviceMemory < 4;

    if (isLowEndDevice) {
      document.documentElement.classList.add("reduced-animations");
    }

    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      document.documentElement.classList.add("prefers-reduced-motion");
    }
  }

  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ("PerformanceObserver" in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime);
        this.app.analytics.trackPerformanceMetric?.("LCP", lastEntry.startTime);
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log("FID:", entry.processingStart - entry.startTime);
          this.app.analytics.trackPerformanceMetric?.(
            "FID",
            entry.processingStart - entry.startTime
          );
        });
      }).observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log("CLS:", clsValue);
        this.app.analytics.trackPerformanceMetric?.("CLS", clsValue);
      }).observe({ entryTypes: ["layout-shift"] });
    }
  }

  // ===================================================================
  // ACCESSIBILITY ENHANCEMENTS
  // ===================================================================

  setupAccessibilityEnhancements() {
    // Improve focus management
    this.setupFocusManagement();

    // Add ARIA labels and descriptions
    this.enhanceARIALabels();

    // Setup keyboard navigation
    this.setupKeyboardNavigation();

    // Add screen reader announcements
    this.setupScreenReaderAnnouncements();
  }

  setupFocusManagement() {
    // Ensure focus is visible and properly managed
    const focusableElements =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    // Trap focus in modals
    const trapFocus = (container) => {
      const focusableEls = container.querySelectorAll(focusableElements);
      const firstFocusableEl = focusableEls[0];
      const lastFocusableEl = focusableEls[focusableEls.length - 1];

      container.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusableEl) {
              lastFocusableEl.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableEl) {
              firstFocusableEl.focus();
              e.preventDefault();
            }
          }
        }
      });
    };

    // Apply to modals
    const modals = document.querySelectorAll(".shortcuts-help");
    modals.forEach(trapFocus);
  }

  enhanceARIALabels() {
    // Add missing ARIA labels
    const searchInput = document.getElementById("search-input");
    if (searchInput && !searchInput.getAttribute("aria-label")) {
      searchInput.setAttribute("aria-label", "Search for TV shows");
    }

    // Add ARIA live regions for dynamic content
    const resultsContainer = document.getElementById("results");
    if (resultsContainer) {
      resultsContainer.setAttribute("aria-live", "polite");
      resultsContainer.setAttribute("aria-label", "Search results");
    }

    // Add ARIA expanded states
    const toggleButtons = document.querySelectorAll("[data-toggle]");
    toggleButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation for mobile
    document.addEventListener("keydown", (e) => {
      if (this.viewport.isMobile) {
        this.handleMobileKeyboardNavigation(e);
      }
    });
  }

  handleMobileKeyboardNavigation(e) {
    // Handle virtual keyboard navigation
    const activeElement = document.activeElement;

    switch (e.key) {
      case "Enter":
        if (activeElement.classList.contains("category-item")) {
          activeElement.click();
          e.preventDefault();
        }
        break;
      case "Escape":
        if (activeElement.tagName === "INPUT") {
          activeElement.blur();
        }
        break;
    }
  }

  setupScreenReaderAnnouncements() {
    // Create live region for announcements
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "assertive");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    liveRegion.id = "screen-reader-announcements";
    document.body.appendChild(liveRegion);

    // Announce search results
    this.announceSearchResults = (count, term) => {
      const message =
        count > 0
          ? `Found ${count} results for "${term}"`
          : `No results found for "${term}"`;

      liveRegion.textContent = message;
    };
  }

  // ===================================================================
  // ORIENTATION & KEYBOARD HANDLING
  // ===================================================================

  setupOrientationHandling() {
    const handleOrientationChange = () => {
      clearTimeout(this.orientationChangeTimeout);
      this.orientationChangeTimeout = setTimeout(() => {
        this.updateViewportInfo();
        this.handleOrientationSpecificChanges();
      }, 300); // Delay to ensure viewport has updated
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);
  }

  handleOrientationSpecificChanges() {
    const { isLandscape, isMobile } = this.viewport;

    if (isMobile && isLandscape) {
      // Optimize for mobile landscape
      document.documentElement.classList.add("mobile-landscape");
      this.optimizeForMobileLandscape();
    } else {
      document.documentElement.classList.remove("mobile-landscape");
    }
  }

  optimizeForMobileLandscape() {
    // Reduce header height in landscape
    const header = document.querySelector(".header");
    if (header) {
      header.style.paddingBlock = "1rem";
    }

    // Adjust modal heights
    const modals = document.querySelectorAll(".shortcuts-content");
    modals.forEach((modal) => {
      modal.style.maxHeight = "70vh";
    });
  }

  setupKeyboardOptimizations() {
    // Handle virtual keyboard on mobile
    if (this.touchSupport.isMobile) {
      this.setupVirtualKeyboardHandling();
    }
  }

  setupVirtualKeyboardHandling() {
    // Detect virtual keyboard
    const initialViewportHeight = window.innerHeight;

    const handleViewportChange = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;

      if (heightDifference > 150) {
        // Virtual keyboard is likely open
        document.documentElement.classList.add("virtual-keyboard-open");
        this.adjustForVirtualKeyboard(heightDifference);
      } else {
        // Virtual keyboard is likely closed
        document.documentElement.classList.remove("virtual-keyboard-open");
        this.resetVirtualKeyboardAdjustments();
      }
    };

    window.addEventListener("resize", handleViewportChange);
  }

  adjustForVirtualKeyboard(keyboardHeight) {
    // Adjust layout when virtual keyboard is open
    const activeElement = document.activeElement;

    if (activeElement && activeElement.tagName === "INPUT") {
      // Scroll input into view
      setTimeout(() => {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }

  resetVirtualKeyboardAdjustments() {
    // Reset any adjustments made for virtual keyboard
    console.log("Virtual keyboard closed, resetting adjustments");
  }

  // ===================================================================
  // UTILITY METHODS
  // ===================================================================

  adjustLayoutForViewport() {
    const { isMobile, isTablet, isDesktop } = this.viewport;

    // Update CSS custom properties
    document.documentElement.style.setProperty(
      "--is-mobile",
      isMobile ? "1" : "0"
    );
    document.documentElement.style.setProperty(
      "--is-tablet",
      isTablet ? "1" : "0"
    );
    document.documentElement.style.setProperty(
      "--is-desktop",
      isDesktop ? "1" : "0"
    );

    // Adjust grid columns
    this.updateGridColumns();

    // Adjust font sizes
    this.adjustFontSizes();
  }

  updateGridColumns() {
    const results = document.getElementById("results");
    if (!results) return;

    const { width } = this.viewport;
    let columns;

    if (width < 480) columns = 1;
    else if (width < 768) columns = 2;
    else if (width < 1024) columns = 3;
    else if (width < 1280) columns = 4;
    else columns = 5;

    results.style.setProperty("--grid-columns", columns);
  }

  adjustFontSizes() {
    // Implement dynamic font sizing based on viewport
    const baseFontSize = this.viewport.width < 480 ? 14 : 16;
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  }

  adjustModalSizes() {
    const modals = document.querySelectorAll(".shortcuts-content");
    const { height, isMobile } = this.viewport;

    modals.forEach((modal) => {
      if (isMobile) {
        modal.style.maxHeight = `${height * 0.8}px`;
        modal.style.margin = "1rem";
      } else {
        modal.style.maxHeight = "80vh";
        modal.style.margin = "2rem";
      }
    });
  }

  // ===================================================================
  // CLEANUP
  // ===================================================================

  destroy() {
    // Clean up observers and event listeners
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    clearTimeout(this.orientationChangeTimeout);

    // Remove responsive classes
    document.documentElement.classList.remove(
      "touch-device",
      "no-hover",
      "mobile-landscape",
      "virtual-keyboard-open",
      "slow-connection",
      "reduced-animations"
    );
  }
}

// Export for use in main app
window.ResponsiveEnhancements = ResponsiveEnhancements;
