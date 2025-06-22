/**
 * Enhanced TV Show Search App - Premium UX Version
 *
 * New Features:
 * - Favorites system with local storage
 * - Search suggestions and autocomplete
 * - Advanced filtering and sorting
 * - Keyboard shortcuts and navigation
 * - Toast notifications
 * - Grid/List view modes
 * - Scroll to top functionality
 * - Search history and popular searches
 * - Performance optimizations
 */

class EnhancedTVShowApp {
  constructor() {
    this.baseURL = "https://api.tvmaze.com/search/shows";
    this.searchTimeout = null;
    this.lastSearchTerm = "";
    this.abortController = null;
    this.searchHistory = JSON.parse(
      localStorage.getItem("tvshow_search_history") || "[]"
    );
    this.favorites = JSON.parse(
      localStorage.getItem("tvshow_favorites") || "{}"
    );
    this.currentResults = [];
    this.filteredResults = [];
    this.searchStartTime = 0;
    this.suggestionIndex = -1;
    this.isShowingFavoritesOnly = false;
    this.currentViewMode = localStorage.getItem("tvshow_view_mode") || "grid";
    this.availableChannels = new Set();
    this.selectedChannel = null;

    // Configure Axios defaults
    axios.defaults.timeout = 10000;

    this.initializeElements();
    this.attachEventListeners();
    this.setupAxiosInterceptors();
    this.setupKeyboardShortcuts();
    this.initializeGenreFilter();
    this.setViewMode(this.currentViewMode);
    this.setupScrollToTop();

    // Show welcome message
    this.showToast(
      "Welcome! Start searching for TV shows or try a popular search.",
      "info"
    );
  }

  initializeElements() {
    this.elements = {
      form: document.getElementById("search-form"),
      input: document.getElementById("search-input"),
      clearButton: document.getElementById("clear-search"),
      suggestions: document.getElementById("search-suggestions"),
      loading: document.getElementById("loading"),
      error: document.getElementById("error"),
      errorMessage: document.getElementById("error-message"),
      retryButton: document.getElementById("retry-button"),
      results: document.getElementById("results"),
      resultsStats: document.getElementById("results-stats"),
      resultsCount: document.getElementById("results-count"),
      searchTime: document.getElementById("search-time"),
      genreFilter: document.getElementById("genre-filter"),
      statusFilter: document.getElementById("status-filter"),
      channelFilter: document.getElementById("channel-filter"),
      sortFilter: document.getElementById("sort-filter"),
      toggleFavorites: document.getElementById("toggle-favorites"),
      gridView: document.getElementById("grid-view"),
      listView: document.getElementById("list-view"),
      scrollToTop: document.getElementById("scroll-to-top"),
      helpButton: document.getElementById("help-button"),
      shortcutsHelp: document.getElementById("shortcuts-help"),
      closeShortcuts: document.getElementById("close-shortcuts"),
      categoryItems: document.querySelectorAll(".category-item"),
      genrePills: document.querySelectorAll(".genre-pill"),
      clearFiltersBtn: document.getElementById("clear-filters"),
      toastContainer: document.getElementById("toast-container"),
    };
  }

  attachEventListeners() {
    // Form submission
    this.elements.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSearch();
    });

    // Real-time search with suggestions
    this.elements.input.addEventListener("input", (e) => {
      const value = e.target.value.trim();
      this.updateClearButton(value);
      this.debouncedSearch(value);
      this.showSearchSuggestions(value);
    });

    // Clear search button
    this.elements.clearButton.addEventListener("click", () => {
      this.clearSearch();
    });

    // Retry button
    this.elements.retryButton.addEventListener("click", () => {
      this.handleSearch();
    });

    // Filter changes
    this.elements.genreFilter.addEventListener("change", () =>
      this.applyFilters()
    );
    this.elements.statusFilter.addEventListener("change", () =>
      this.applyFilters()
    );
    this.elements.channelFilter.addEventListener("change", () =>
      this.applyFilters()
    );
    this.elements.sortFilter.addEventListener("change", () =>
      this.applyFilters()
    );

    // Favorites toggle
    this.elements.toggleFavorites.addEventListener("click", () => {
      this.toggleFavoritesView();
    });

    // View mode toggles
    this.elements.gridView.addEventListener("click", () =>
      this.setViewMode("grid")
    );
    this.elements.listView.addEventListener("click", () =>
      this.setViewMode("list")
    );

    // Scroll to top
    this.elements.scrollToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Help modal
    this.elements.helpButton.addEventListener("click", () =>
      this.showKeyboardShortcuts()
    );
    this.elements.closeShortcuts.addEventListener("click", () =>
      this.hideKeyboardShortcuts()
    );
    this.elements.shortcutsHelp.addEventListener("click", (e) => {
      if (e.target === this.elements.shortcutsHelp)
        this.hideKeyboardShortcuts();
    });

    // Category items (channels/streaming services)
    this.elements.categoryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const channel = item.dataset.channel;
        if (channel) {
          this.searchByChannel(channel, item);
        }
      });
    });

    // Genre pills
    this.elements.genrePills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const genre = pill.dataset.search;
        this.elements.input.value = genre;
        this.performSearch(genre);
        this.hideSearchInterface();
      });
    });

    // Clear filters button
    this.elements.clearFiltersBtn.addEventListener("click", () => {
      this.clearAllFilters();
    });

    // Suggestion navigation
    this.elements.input.addEventListener("keydown", (e) => {
      this.handleSuggestionNavigation(e);
    });

    // Click outside to hide suggestions
    document.addEventListener("click", (e) => {
      if (
        !this.elements.input.contains(e.target) &&
        !this.elements.suggestions.contains(e.target)
      ) {
        this.hideSuggestions();
      }
    });
  }

  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        console.log(`Making request to: ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => {
        console.log(`Received response from: ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
      }
    );
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Don't interfere when typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
        return;
      }

      switch (e.key) {
        case "/":
          e.preventDefault();
          this.elements.input.focus();
          break;
        case "Escape":
          this.clearSearch();
          this.hideSuggestions();
          this.hideKeyboardShortcuts();
          break;
        case "f":
        case "F":
          e.preventDefault();
          this.toggleFavoritesView();
          break;
        case "c":
        case "C":
          e.preventDefault();
          this.clearAllFilters();
          break;
        case "?":
          e.preventDefault();
          this.showKeyboardShortcuts();
          break;
      }
    });
  }

  setupScrollToTop() {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        this.elements.scrollToTop.classList.remove("hidden");
      } else {
        this.elements.scrollToTop.classList.add("hidden");
      }
    });
  }

  initializeGenreFilter() {
    // Popular TV genres
    const genres = [
      "Drama",
      "Comedy",
      "Action",
      "Thriller",
      "Horror",
      "Science-Fiction",
      "Fantasy",
      "Romance",
      "Crime",
      "Mystery",
      "Adventure",
      "Animation",
      "Documentary",
      "Family",
      "Music",
      "War",
      "Western",
      "History",
    ];

    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      this.elements.genreFilter.appendChild(option);
    });
  }

  updateClearButton(value) {
    if (value) {
      this.elements.clearButton.classList.remove("hidden");
    } else {
      this.elements.clearButton.classList.add("hidden");
    }
  }

  clearSearch() {
    this.elements.input.value = "";
    this.elements.input.focus();
    this.updateClearButton("");
    this.clearResults();
    this.hideSuggestions();
    this.showQuickSearch();
  }

  clearAllFilters() {
    this.elements.genreFilter.value = "";
    this.elements.statusFilter.value = "";
    this.elements.channelFilter.value = "";
    this.elements.sortFilter.value = "relevance";

    // Clear channel selection
    this.selectedChannel = null;
    this.elements.categoryItems.forEach((item) =>
      item.classList.remove("active")
    );

    // Clear favorites filter if active
    if (this.isShowingFavoritesOnly) {
      this.toggleFavoritesView();
    }

    // Clear search input
    this.elements.input.value = "";
    this.updateClearButton("");

    // Clear results and show search interface
    this.clearResults();
    this.showSearchInterface();

    this.showToast("All filters cleared", "info");
  }

  showSearchInterface() {
    const searchInterface = document.querySelector(".search-interface");
    if (searchInterface && this.elements.input.value.trim() === "") {
      searchInterface.style.display = "block";
    }
  }

  hideSearchInterface() {
    const searchInterface = document.querySelector(".search-interface");
    if (searchInterface) {
      searchInterface.style.display = "none";
    }
  }

  async searchByChannel(channel, clickedItem) {
    try {
      // Update UI to show selected channel
      this.elements.categoryItems.forEach((item) =>
        item.classList.remove("active")
      );
      clickedItem.classList.add("active");
      this.selectedChannel = channel;

      this.showLoading();
      this.hideSearchInterface();
      this.searchStartTime = performance.now();

      // Search for shows by channel/network
      const response = await axios.get(`https://api.tvmaze.com/shows`, {
        signal: this.abortController?.signal,
      });

      // Filter shows by the selected channel/network
      const channelShows = response.data.filter((show) => {
        const network = show.network?.name || show.webChannel?.name || "";
        return (
          network.toLowerCase().includes(channel.toLowerCase()) ||
          channel.toLowerCase().includes(network.toLowerCase())
        );
      });

      // Convert to the same format as search results
      this.currentResults = channelShows.map((show) => ({ show }));

      if (this.currentResults.length === 0) {
        // Fallback to search if no direct matches
        await this.searchChannelFallback(channel);
      } else {
        this.displayResults(this.currentResults, `shows on ${channel}`);
        this.showToast(
          `Found ${this.currentResults.length} shows on ${channel}`,
          "success"
        );
      }
    } catch (error) {
      console.error("Channel search error:", error);
      // Fallback to regular search
      await this.searchChannelFallback(channel);
    } finally {
      this.hideLoading();
    }
  }

  async searchChannelFallback(channel) {
    try {
      // Fallback: search for the channel name
      const response = await axios.get(this.baseURL, {
        params: { q: channel },
        signal: this.abortController?.signal,
      });

      this.currentResults = response.data || [];
      this.displayResults(this.currentResults, `"${channel}" related shows`);

      if (this.currentResults.length > 0) {
        this.showToast(
          `Found ${this.currentResults.length} ${channel}-related shows`,
          "info"
        );
      } else {
        this.showToast(`No shows found for ${channel}`, "error");
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  debouncedSearch(searchTerm) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (!searchTerm || searchTerm.length < 2) {
      this.showSearchInterface();
      return;
    }

    if (searchTerm === this.lastSearchTerm) {
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.performSearch(searchTerm);
    }, 300); // Reduced delay for better UX
  }

  showSearchSuggestions(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) {
      this.hideSuggestions();
      return;
    }

    // Show suggestions from search history
    const suggestions = this.searchHistory
      .filter((term) => term.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);

    if (suggestions.length > 0) {
      const suggestionsHTML = suggestions
        .map(
          (suggestion, index) =>
            `<div class="suggestion-item" data-index="${index}">${this.escapeHtml(
              suggestion
            )}</div>`
        )
        .join("");

      this.elements.suggestions.innerHTML = suggestionsHTML;
      this.elements.suggestions.classList.remove("hidden");
      this.suggestionIndex = -1;

      // Add click listeners to suggestions
      this.elements.suggestions
        .querySelectorAll(".suggestion-item")
        .forEach((item) => {
          item.addEventListener("click", () => {
            this.elements.input.value = item.textContent;
            this.performSearch(item.textContent);
            this.hideSuggestions();
          });
        });
    } else {
      this.hideSuggestions();
    }
  }

  handleSuggestionNavigation(e) {
    const suggestions =
      this.elements.suggestions.querySelectorAll(".suggestion-item");
    if (suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.suggestionIndex = Math.min(
          this.suggestionIndex + 1,
          suggestions.length - 1
        );
        this.updateSuggestionHighlight(suggestions);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.suggestionIndex = Math.max(this.suggestionIndex - 1, -1);
        this.updateSuggestionHighlight(suggestions);
        break;
      case "Enter":
        if (this.suggestionIndex >= 0) {
          e.preventDefault();
          const selectedSuggestion =
            suggestions[this.suggestionIndex].textContent;
          this.elements.input.value = selectedSuggestion;
          this.performSearch(selectedSuggestion);
          this.hideSuggestions();
        }
        break;
      case "Escape":
        this.hideSuggestions();
        break;
    }
  }

  updateSuggestionHighlight(suggestions) {
    suggestions.forEach((item, index) => {
      if (index === this.suggestionIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  hideSuggestions() {
    this.elements.suggestions.classList.add("hidden");
    this.suggestionIndex = -1;
  }

  async handleSearch() {
    const searchTerm = this.elements.input.value.trim();

    if (!searchTerm) {
      this.showToast("Please enter a search term", "error");
      return;
    }

    if (searchTerm.length < 2) {
      this.showToast("Search term must be at least 2 characters long", "error");
      return;
    }

    await this.performSearch(searchTerm);
  }

  async performSearch(searchTerm) {
    try {
      if (this.abortController) {
        this.abortController.abort();
      }

      this.abortController = new AbortController();
      this.lastSearchTerm = searchTerm;
      this.searchStartTime = performance.now();

      this.showLoading();
      this.hideError();
      this.hideQuickSearch();
      this.hideSuggestions();

      // Add to search history
      this.addToSearchHistory(searchTerm);

      const sanitizedTerm = this.sanitizeInput(searchTerm);

      const response = await axios.get(this.baseURL, {
        params: { q: sanitizedTerm },
        signal: this.abortController.signal,
      });

      this.currentResults = response.data || [];
      this.displayResults(this.currentResults, sanitizedTerm);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoading();
    }
  }

  addToSearchHistory(searchTerm) {
    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(
      (term) => term !== searchTerm
    );
    // Add to beginning
    this.searchHistory.unshift(searchTerm);
    // Keep only last 10 searches
    this.searchHistory = this.searchHistory.slice(0, 10);
    // Save to localStorage
    localStorage.setItem(
      "tvshow_search_history",
      JSON.stringify(this.searchHistory)
    );
  }

  sanitizeInput(input) {
    return input
      .replace(/[<>\"'&]/g, "")
      .substring(0, 100)
      .trim();
  }

  displayResults(data, searchTerm) {
    this.hideError();

    if (!data || data.length === 0) {
      this.showNoResults(searchTerm);
      return;
    }

    const validShows = data.filter(
      (item) => item.show && item.show.name && item.show.name.trim() !== ""
    );

    if (validShows.length === 0) {
      this.showNoResults(searchTerm);
      return;
    }

    this.currentResults = validShows.slice(0, 50); // Limit for performance
    this.populateChannelFilter();
    this.applyFilters();
  }

  populateChannelFilter() {
    // Extract unique channels from current results
    const channels = new Set();

    this.currentResults.forEach((item) => {
      const network = item.show.network?.name || item.show.webChannel?.name;
      if (network && network.trim()) {
        channels.add(network.trim());
      }
    });

    // Clear existing options (except "All Channels")
    const channelFilter = this.elements.channelFilter;
    while (channelFilter.children.length > 1) {
      channelFilter.removeChild(channelFilter.lastChild);
    }

    // Add channel options
    const sortedChannels = Array.from(channels).sort();
    sortedChannels.forEach((channel) => {
      const option = document.createElement("option");
      option.value = channel;
      option.textContent = channel;
      channelFilter.appendChild(option);
    });

    // Update available channels set
    this.availableChannels = channels;
  }

  applyFilters() {
    let filtered = [...this.currentResults];

    // Apply genre filter
    const selectedGenre = this.elements.genreFilter.value;
    if (selectedGenre) {
      filtered = filtered.filter(
        (item) => item.show.genres && item.show.genres.includes(selectedGenre)
      );
    }

    // Apply status filter
    const selectedStatus = this.elements.statusFilter.value;
    if (selectedStatus) {
      filtered = filtered.filter((item) => item.show.status === selectedStatus);
    }

    // Apply channel filter
    const selectedChannel = this.elements.channelFilter.value;
    if (selectedChannel) {
      filtered = filtered.filter((item) => {
        const network =
          item.show.network?.name || item.show.webChannel?.name || "";
        return network.toLowerCase().includes(selectedChannel.toLowerCase());
      });
    }

    // Apply favorites filter
    if (this.isShowingFavoritesOnly) {
      filtered = filtered.filter((item) => this.favorites[item.show.id]);
    }

    // Apply sorting
    const sortBy = this.elements.sortFilter.value;
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          const ratingA = a.show.rating?.average || 0;
          const ratingB = b.show.rating?.average || 0;
          return ratingB - ratingA;
        case "name":
          return a.show.name.localeCompare(b.show.name);
        case "year":
          const yearA = a.show.premiered
            ? new Date(a.show.premiered).getFullYear()
            : 0;
          const yearB = b.show.premiered
            ? new Date(b.show.premiered).getFullYear()
            : 0;
          return yearB - yearA;
        default:
          return 0; // Keep original order (relevance)
      }
    });

    this.filteredResults = filtered;
    this.renderResults();
    this.updateResultsStats();
  }

  renderResults() {
    if (this.filteredResults.length === 0) {
      this.showNoResults("your filters");
      return;
    }

    const resultsHTML = this.filteredResults
      .map((item) => this.createShowCard(item.show))
      .join("");

    this.elements.results.innerHTML = resultsHTML;
    this.elements.results.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Add favorite button listeners
    this.attachFavoriteListeners();
  }

  createShowCard(show) {
    const name = this.escapeHtml(show.name || "Unknown Title");
    const image = show.image?.medium || show.image?.original || null;
    const summary = this.stripHtml(show.summary || "No description available.");
    const rating = show.rating?.average || null;
    const premiered = show.premiered || null;
    const status = show.status || "Unknown";
    const genres = show.genres || [];
    const network =
      show.network?.name || show.webChannel?.name || "Unknown Network";
    const isFavorited = this.favorites[show.id] || false;

    return `
      <div class="show-card fade-in">
        <button class="favorite-button ${isFavorited ? "favorited" : ""}" 
                data-show-id="${show.id}" 
                aria-label="${
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }">
          ${isFavorited ? "⭐" : "☆"}
        </button>
        ${
          image
            ? `<img src="${image}" alt="${name}" class="show-image" loading="lazy">`
            : `<div class="show-image" style="display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #666;">
            <span style="font-size: 3rem;">📺</span>
          </div>`
        }
        <div class="show-content">
          <h3 class="show-title">${name}</h3>
          <div class="show-info">
            ${rating ? `<span class="show-rating">⭐ ${rating}</span>` : ""}
            ${
              premiered
                ? `<span>📅 ${new Date(premiered).getFullYear()}</span>`
                : ""
            }
            <span>📡 ${this.escapeHtml(network)}</span>
            <span>🎬 ${this.escapeHtml(status)}</span>
          </div>
          ${
            genres.length > 0
              ? `<div class="show-info">
              ${genres
                .slice(0, 3)
                .map((genre) => `<span>🏷️ ${this.escapeHtml(genre)}</span>`)
                .join("")}
            </div>`
              : ""
          }
          <p class="show-summary">${this.truncateText(summary, 200)}</p>
        </div>
      </div>
    `;
  }

  attachFavoriteListeners() {
    const favoriteButtons =
      this.elements.results.querySelectorAll(".favorite-button");
    favoriteButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const showId = button.dataset.showId;
        this.toggleFavorite(showId, button);
      });
    });
  }

  toggleFavorite(showId, button) {
    const show = this.currentResults.find(
      (item) => item.show.id == showId
    )?.show;
    if (!show) return;

    if (this.favorites[showId]) {
      delete this.favorites[showId];
      button.classList.remove("favorited");
      button.innerHTML = "☆";
      button.setAttribute("aria-label", "Add to favorites");
      this.showToast(`${show.name} removed from favorites`, "info");
    } else {
      this.favorites[showId] = {
        id: show.id,
        name: show.name,
        image: show.image?.medium,
        addedAt: Date.now(),
      };
      button.classList.add("favorited");
      button.innerHTML = "⭐";
      button.setAttribute("aria-label", "Remove from favorites");
      this.showToast(`${show.name} added to favorites`, "success");
    }

    localStorage.setItem("tvshow_favorites", JSON.stringify(this.favorites));

    // Refresh results if showing favorites only
    if (this.isShowingFavoritesOnly) {
      this.applyFilters();
    }
  }

  toggleFavoritesView() {
    this.isShowingFavoritesOnly = !this.isShowingFavoritesOnly;

    if (this.isShowingFavoritesOnly) {
      this.elements.toggleFavorites.classList.add("active");
      this.elements.toggleFavorites.textContent = "⭐ Show All Shows";
      this.showToast("Showing favorites only", "info");
    } else {
      this.elements.toggleFavorites.classList.remove("active");
      this.elements.toggleFavorites.textContent = "⭐ Show Favorites Only";
      this.showToast("Showing all shows", "info");
    }

    this.applyFilters();
  }

  setViewMode(mode) {
    this.currentViewMode = mode;
    localStorage.setItem("tvshow_view_mode", mode);

    if (mode === "grid") {
      this.elements.results.classList.remove("list-view");
      this.elements.gridView.classList.add("active");
      this.elements.listView.classList.remove("active");
    } else {
      this.elements.results.classList.add("list-view");
      this.elements.listView.classList.add("active");
      this.elements.gridView.classList.remove("active");
    }
  }

  updateResultsStats() {
    const searchTime = performance.now() - this.searchStartTime;
    const count = this.filteredResults.length;

    this.elements.resultsCount.textContent = `${count} result${
      count !== 1 ? "s" : ""
    }`;
    this.elements.searchTime.textContent = `(${(searchTime / 1000).toFixed(
      2
    )}s)`;
    this.elements.resultsStats.classList.remove("hidden");
  }

  showNoResults(searchTerm) {
    this.elements.results.innerHTML = `
      <div class="no-results">
        <h3>No shows found</h3>
        <p>We couldn't find any TV shows matching "${this.escapeHtml(
          searchTerm
        )}".</p>
        <p>Try different keywords, check your spelling, or adjust your filters.</p>
      </div>
    `;
    this.elements.resultsStats.classList.add("hidden");
  }

  showLoading() {
    this.elements.loading.classList.remove("hidden");
    this.elements.results.innerHTML = "";
    this.elements.resultsStats.classList.add("hidden");
  }

  hideLoading() {
    this.elements.loading.classList.add("hidden");
  }

  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.error.classList.remove("hidden");
    this.elements.results.innerHTML = "";
    this.elements.resultsStats.classList.add("hidden");
  }

  hideError() {
    this.elements.error.classList.add("hidden");
  }

  clearResults() {
    this.elements.results.innerHTML = "";
    this.hideError();
    this.hideLoading();
    this.elements.resultsStats.classList.add("hidden");
    this.currentResults = [];
    this.filteredResults = [];
  }

  showKeyboardShortcuts() {
    this.elements.shortcutsHelp.classList.remove("hidden");
  }

  hideKeyboardShortcuts() {
    this.elements.shortcutsHelp.classList.add("hidden");
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${this.escapeHtml(message)}</span>
      <button class="toast-close" aria-label="Close notification">×</button>
    `;

    this.elements.toastContainer.appendChild(toast);

    // Add close functionality
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => {
      this.removeToast(toast);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removeToast(toast);
    }, 5000);
  }

  removeToast(toast) {
    if (toast.parentNode) {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }

  handleError(error) {
    console.error("Search error:", error);

    let errorMessage = "An unexpected error occurred. Please try again.";

    if (error.name === "AbortError") {
      return;
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

  // Utility methods
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  }
}

// Initialize the enhanced app
document.addEventListener("DOMContentLoaded", () => {
  new EnhancedTVShowApp();
});

// Global error handlers
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  event.preventDefault();
});
