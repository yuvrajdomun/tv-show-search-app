# 📺 TV Show Search App

A premium, Netflix-like TV show search application with advanced features and modern UX design. Search for TV shows, browse by channel/network, manage favorites, and enjoy a seamless user experience.

![TV Show App Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) ![CSS3](https://img.shields.io/badge/CSS3-Modern-blue) ![API](https://img.shields.io/badge/API-TVMaze-orange)

## ✨ Features

### 🔍 Smart Search

- **Real-time search** with debounced input (300ms delay)
- **Auto-complete suggestions** from search history
- **Search history** persistence with localStorage
- **Quick search tags** for popular shows
- **Keyboard navigation** with arrow keys and Enter

### 📺 Channel/Network Search

- **Browse by streaming service** (Netflix, HBO, Prime Video, Disney+, etc.)
- **Channel filter dropdown** populated from search results
- **Quick channel tags** with visual feedback
- **Smart channel matching** for network and web channels

### ⭐ Favorites System

- **One-click favorites** with star/unstar functionality
- **Persistent storage** with localStorage
- **Favorites-only view** toggle
- **Visual indicators** on favorited shows

### 🎛️ Advanced Filtering

- **Genre filtering** with all TV genres
- **Status filtering** (Running, Ended, etc.)
- **Channel/Network filtering** from search results
- **Multiple sort options** (Rating, Name, Year, Relevance)
- **Client-side filtering** for instant results

### 🎨 Premium UX Design

- **Modern card-based layout** with hover effects
- **Grid/List view modes** with preference saving
- **Responsive design** for all screen sizes
- **Loading animations** and smooth transitions
- **Toast notifications** for user feedback
- **Accessibility features** with ARIA labels

### ⌨️ Keyboard Shortcuts

- `/` - Focus search input
- `Esc` - Clear search/close modals
- `F` - Toggle favorites view
- `C` - Clear all filters
- `?` - Show/hide keyboard shortcuts
- `Arrow keys` - Navigate suggestions

### 🚀 Performance Features

- **Request cancellation** to prevent race conditions
- **Debounced search** to reduce API calls
- **Result limiting** (50 shows max) for optimal performance
- **Lazy loading** for images
- **Efficient DOM manipulation**

## 🛠️ Technologies Used

- **Vanilla JavaScript (ES6+)** - Modern JavaScript features
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with Grid, Flexbox, and animations
- **TVMaze API** - Comprehensive TV show database
- **LocalStorage** - Client-side data persistence
- **Responsive Design** - Mobile-first approach

## 📋 API Reference

This app uses the [TVMaze API](https://www.tvmaze.com/api) for TV show data:

- **Search Shows**: `https://api.tvmaze.com/search/shows?q={query}`
- **All Shows**: `https://api.tvmaze.com/shows` (for channel filtering)
- **No API key required** - Free and open API

## 🚀 Getting Started

### Prerequisites

- Modern web browser with JavaScript enabled
- Internet connection for API requests

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/tv-show-search-app.git
   cd tv-show-search-app
   ```

2. **Open the application**

   - Simply open `index.html` in your web browser
   - Or use a local server:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (http-server)
   npx http-server

   # Using Live Server (VS Code extension)
   Right-click index.html → "Open with Live Server"
   ```

3. **Start searching!**
   - Enter a TV show name in the search box
   - Browse by channel using the quick tags
   - Use filters to refine your results
   - Star your favorite shows

## 📱 Usage Examples

### Basic Search

```javascript
// Search for shows
Enter "Breaking Bad" in search box → Get comprehensive results

// Use quick tags
Click "Netflix" → See all Netflix shows
```

### Advanced Filtering

```javascript
// Combine filters
Search "Drama" → Filter by "HBO" → Sort by "Rating"

// Keyboard shortcuts
Press "/" → Focus search
Press "F" → Show only favorites
Press "C" → Clear all filters
```

### Favorites Management

```javascript
// Add to favorites
Click ⭐ on any show card

// View favorites only
Click "Show Favorites Only" or press "F"
```

## 🎯 Key Features Breakdown

### Search Intelligence

- **Debounced input**: Waits 300ms after user stops typing
- **Request cancellation**: Cancels previous requests to prevent race conditions
- **Error handling**: Graceful degradation with user-friendly messages
- **Input sanitization**: XSS prevention and data validation

### UI/UX Excellence

- **Modern design**: Clean, Netflix-inspired interface
- **Smooth animations**: CSS transitions and loading states
- **Responsive layout**: Works on desktop, tablet, and mobile
- **Accessibility**: Keyboard navigation and screen reader support

### Performance Optimization

- **Efficient filtering**: Client-side processing for instant results
- **Memory management**: Proper cleanup of event listeners
- **Image optimization**: Lazy loading and fallback placeholders
- **Caching strategy**: Smart use of localStorage for persistence

## 🔧 Configuration

### Customization Options

You can easily customize the app by modifying these variables in `app.js`:

```javascript
// Search configuration
this.searchTimeout = 300; // Debounce delay in ms
this.maxResults = 50; // Maximum results to display

// UI preferences
this.defaultViewMode = "grid"; // 'grid' or 'list'
this.toastDuration = 3000; // Toast message duration
```

### Adding New Channels

To add more channel quick-search tags, edit the HTML in `index.html`:

```html
<button class="channel-tag" data-channel="Your Channel">🆕 Your Channel</button>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TVMaze API](https://www.tvmaze.com/api) for providing comprehensive TV show data
- [Axios](https://axios-http.com/) for reliable HTTP requests
- Modern CSS Grid and Flexbox for responsive layouts
- The open-source community for inspiration and best practices

## 📞 Support

If you have any questions or run into issues:

1. Check the [Issues](https://github.com/yourusername/tv-show-search-app/issues) page
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce

---

**Made with ❤️ and modern web technologies**

_Enjoy discovering your next favorite TV show!_ 📺✨
