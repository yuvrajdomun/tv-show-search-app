# 📋 TV Show Search App - Functionality Documentation

## Overview

This document provides comprehensive documentation for all functions, features, and components in the TV Show Search App.

**Current Version:** 2.0.0  
**Last Updated:** December 2024  
**Architecture:** Vanilla JavaScript ES6+ with modern CSS and responsive design

---

## 🏗️ Core Architecture

### Main Class: `EnhancedTVShowApp`

The primary application class that manages all functionality and state.

```javascript
class EnhancedTVShowApp {
  constructor()           // Initialize app with default settings
  init()                 // Start the application
}
```

---

## 🔍 Search Functionality

### Core Search Methods

#### `performSearch(searchTerm)`

**Purpose:** Execute TV show search using TVMaze API  
**Parameters:**

- `searchTerm` (string): The search query
  **Returns:** Promise  
  **Features:**
- Debounced input (300ms delay)
- Request cancellation to prevent race conditions
- Search history tracking
- Loading state management
- Error handling with user feedback

#### `debouncedSearch(searchTerm)`

**Purpose:** Implement search debouncing for better UX  
**Parameters:**

- `searchTerm` (string): The search query
  **Behavior:**
- Delays search execution by 300ms
- Cancels previous searches if new input received
- Shows search interface for queries < 2 characters

#### `searchByChannel(channel, clickedItem)`

**Purpose:** Search shows by specific streaming service or TV network  
**Parameters:**

- `channel` (string): Channel/network name
- `clickedItem` (HTMLElement): The clicked category item
  **Features:**
- Direct API filtering by network/webChannel
- Fallback to text search if no direct matches
- Visual feedback with active states
- Toast notifications for results

#### `searchChannelFallback(channel)`

**Purpose:** Fallback search when direct channel filtering fails  
**Parameters:**

- `channel` (string): Channel name to search for
  **Behavior:**
- Performs text-based search using channel name
- Provides user feedback on results

---

## 🎯 Search Interface Components

### Minimalist Search Interface

#### `showSearchInterface()`

**Purpose:** Display the category-based search interface  
**Conditions:** Only shows when search input is empty  
**Elements:**

- Streaming services section
- TV networks section
- Genre pills section

#### `hideSearchInterface()`

**Purpose:** Hide search interface during active searches  
**Triggers:** When user performs search or selects category

### Search Suggestions

#### `showSearchSuggestions(searchTerm)`

**Purpose:** Display autocomplete suggestions from search history  
**Parameters:**

- `searchTerm` (string): Current input value
  **Features:**
- Filters from stored search history
- Limits to 5 suggestions
- Keyboard navigation support
- Click-to-select functionality

#### `handleSuggestionNavigation(event)`

**Purpose:** Handle keyboard navigation in suggestions  
**Supported Keys:**

- `ArrowDown`: Move to next suggestion
- `ArrowUp`: Move to previous suggestion
- `Enter`: Select highlighted suggestion
- `Escape`: Close suggestions

---

## 🎛️ Filter System

### Filter Methods

#### `applyFilters()`

**Purpose:** Apply all active filters to current results  
**Filter Types:**

- Genre filtering
- Status filtering (Running/Ended)
- Channel/Network filtering
- Favorites-only view
- Sorting (relevance, rating, name, year)

#### `populateChannelFilter()`

**Purpose:** Dynamically populate channel dropdown from search results  
**Behavior:**

- Extracts unique networks from current results
- Sorts alphabetically
- Updates dropdown options

#### `clearAllFilters()`

**Purpose:** Reset all filters to default state  
**Actions:**

- Clears all filter selections
- Resets search input
- Shows search interface
- Removes active category selections
- Provides user feedback

---

## ⭐ Favorites System

### Favorites Management

#### `toggleFavorite(showId, button)`

**Purpose:** Add/remove shows from favorites  
**Parameters:**

- `showId` (string): Unique show identifier
- `button` (HTMLElement): The favorite button element
  **Storage:** localStorage with key `tvshow_favorites`  
  **Features:**
- Visual feedback with star icons
- Toast notifications
- Persistent storage
- Metadata tracking (name, image, timestamp)

#### `toggleFavoritesView()`

**Purpose:** Switch between all shows and favorites-only view  
**Behavior:**

- Filters current results to show only favorited items
- Updates button state and text
- Maintains filter state across searches

---

## 🎨 UI/UX Components

### Visual Elements

#### `createShowCard(show)`

**Purpose:** Generate HTML for individual show cards  
**Parameters:**

- `show` (object): Show data from API
  **Returns:** HTML string  
  **Features:**
- Responsive card layout
- Favorite button integration
- Image lazy loading with fallbacks
- Rich metadata display (rating, year, network, genres)
- Sanitized content to prevent XSS

#### `renderResults()`

**Purpose:** Render filtered results to the DOM  
**Features:**

- Grid/list view support
- Smooth scrolling to results
- Favorite button event binding
- Empty state handling

### View Modes

#### `setViewMode(mode)`

**Purpose:** Switch between grid and list view modes  
**Parameters:**

- `mode` (string): 'grid' or 'list'
  **Storage:** localStorage with key `tvshow_view_mode`  
  **Features:**
- Persistent view preference
- Visual button state updates
- Responsive layout adjustments

---

## 📊 Data Management

### State Management

#### Properties

```javascript
{
  currentResults: [],      // Raw search results
  filteredResults: [],     // Results after applying filters
  searchHistory: [],       // Stored search terms
  favorites: {},          // Favorited shows object
  selectedChannel: null,   // Currently selected channel
  isShowingFavoritesOnly: false,
  currentViewMode: 'grid'
}
```

#### `addToSearchHistory(searchTerm)`

**Purpose:** Store search terms for autocomplete  
**Parameters:**

- `searchTerm` (string): Search query to store
  **Storage:** localStorage with key `tvshow_search_history`  
  **Limit:** 50 most recent searches

### Data Processing

#### `sanitizeInput(input)`

**Purpose:** Clean and validate user input  
**Parameters:**

- `input` (string): Raw user input
  **Returns:** Sanitized string  
  **Security:** Removes HTML tags and limits length

#### `escapeHtml(text)`

**Purpose:** Escape HTML characters to prevent XSS  
**Parameters:**

- `text` (string): Text to escape
  **Returns:** HTML-safe string

#### `stripHtml(html)`

**Purpose:** Remove HTML tags from content  
**Parameters:**

- `html` (string): HTML content
  **Returns:** Plain text string

---

## 🎹 User Interaction

### Keyboard Shortcuts

#### `setupKeyboardShortcuts()`

**Purpose:** Initialize global keyboard shortcuts  
**Shortcuts:**

- `/`: Focus search input
- `Escape`: Clear search/close modals
- `F`: Toggle favorites view
- `C`: Clear all filters
- `?`: Show/hide keyboard shortcuts help
- `Arrow keys`: Navigate suggestions

### Event Handling

#### Category Selection

- **Streaming Services**: Netflix, HBO, Prime Video, Disney+, Hulu, Apple TV+
- **TV Networks**: NBC, CBS, ABC, FOX
- **Genre Pills**: Drama, Comedy, Thriller, Action, Sci-Fi, Horror

#### Filter Controls

- **Sort Options**: Best Match, Highest Rated, A-Z, Newest
- **Status Filter**: All Shows, Currently Airing, Ended
- **Action Buttons**: Favorites toggle, Reset filters

---

## 🔄 Lifecycle Methods

### Initialization

#### `initializeElements()`

**Purpose:** Cache DOM element references  
**Elements:** All interactive components and containers

#### `attachEventListeners()`

**Purpose:** Bind event handlers to UI elements  
**Events:**

- Form submission
- Input changes
- Button clicks
- Keyboard interactions
- Scroll events

#### `setupAxiosInterceptors()`

**Purpose:** Configure HTTP request/response handling  
**Features:**

- Request timeout (10 seconds)
- Error response handling
- Loading state management

---

## 🎭 Animation & Visual Feedback

### Loading States

#### `showLoading()`

**Purpose:** Display loading spinner during API calls  
**Visual:** Animated spinner with "Searching for shows..." message

#### `hideLoading()`

**Purpose:** Hide loading indicator when request completes

### Toast Notifications

#### `showToast(message, type)`

**Purpose:** Display temporary user feedback messages  
**Parameters:**

- `message` (string): Notification text
- `type` (string): 'success', 'error', 'info'
  **Features:**
- Auto-dismiss after 3 seconds
- Slide-in animation
- Color-coded by type
- Closeable by user

### Error Handling

#### `showError(message)`

**Purpose:** Display error state with retry option  
**Parameters:**

- `message` (string): Error description
  **Features:**
- Retry button
- User-friendly error messages
- Graceful degradation

---

## 📱 Responsive Design

### Mobile Optimizations

- **Touch-friendly buttons**: Larger tap targets
- **Responsive grid**: Adapts to screen size
- **Vertical filter layout**: Stacks on mobile
- **Optimized spacing**: Better mobile UX

### Breakpoints

- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

---

## 🔧 Configuration

### Constants

```javascript
const CONFIG = {
  API_BASE_URL: "https://api.tvmaze.com/search/shows",
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 50,
  TOAST_DURATION: 3000,
  REQUEST_TIMEOUT: 10000,
};
```

### Storage Keys

- `tvshow_search_history`: Search autocomplete data
- `tvshow_favorites`: Favorited shows data
- `tvshow_view_mode`: User's preferred view mode

---

## 🚀 Performance Features

### Optimizations

- **Request cancellation**: Prevents race conditions
- **Debounced search**: Reduces API calls
- **Result limiting**: Maximum 50 shows for performance
- **Lazy image loading**: Improves initial load time
- **Efficient DOM updates**: Minimizes reflows

### Caching Strategy

- **Search history**: Persistent autocomplete
- **Favorites data**: Persistent user preferences
- **View preferences**: Remembers user choices

---

## 🔗 API Integration

### TVMaze API Endpoints

- **Search Shows**: `https://api.tvmaze.com/search/shows?q={query}`
- **All Shows**: `https://api.tvmaze.com/shows` (for channel filtering)

### Response Handling

- **Success**: Parse and display results
- **Error**: Show user-friendly error message
- **Timeout**: Provide retry option
- **Empty**: Display "no results" state

---

## 🧪 Testing Considerations

### Manual Testing Checklist

- [ ] Search functionality works across all input types
- [ ] Channel filtering works for all categories
- [ ] Favorites persist across browser sessions
- [ ] Responsive design works on all screen sizes
- [ ] Keyboard shortcuts function correctly
- [ ] Error states display appropriately
- [ ] Performance remains smooth with large result sets

### Browser Compatibility

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

---

## 📈 Version History

### v2.0.0 (Current)

- ✨ Minimalist search interface
- 🎯 Channel-focused design
- 🎨 Modern glassmorphism UI
- 📱 Enhanced mobile experience

### v1.0.0

- 🔍 Basic search functionality
- ⭐ Favorites system
- 🎛️ Advanced filtering
- ⌨️ Keyboard shortcuts

---

**For development guidelines and best practices, see [AGENT.md](./AGENT.md)**
