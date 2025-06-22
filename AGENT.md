# 🤖 Agent Development Guidelines

## Overview

This document outlines best practices for AI agents when contributing to this codebase. Following these guidelines ensures consistent, maintainable, and professional code generation.

## 🎯 Core Principles

### 1. **Code Quality Standards**

- ✅ Write clean, readable, and well-commented code
- ✅ Follow existing code patterns and naming conventions
- ✅ Implement proper error handling and edge cases
- ✅ Ensure cross-browser compatibility
- ✅ Optimize for performance and accessibility

### 2. **Documentation First**

- ✅ Update `FUNCTIONALITY.md` for any new features
- ✅ Document all public methods and complex logic
- ✅ Include usage examples for new functionality
- ✅ Update README.md when adding major features
- ✅ Maintain inline comments for complex algorithms

### 3. **Version Control Best Practices**

- ✅ Make atomic commits (one feature/fix per commit)
- ✅ Write descriptive commit messages with emojis
- ✅ Update version numbers following semantic versioning
- ✅ Tag releases appropriately
- ✅ Never commit broken or incomplete code

## 📋 Pre-Commit Checklist

### Code Review

- [ ] Code follows project conventions
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Code is properly formatted and indented
- [ ] No hardcoded values (use constants/config)

### Testing

- [ ] Functionality works as expected
- [ ] Responsive design tested on multiple screen sizes
- [ ] Cross-browser compatibility verified
- [ ] Accessibility features maintained
- [ ] Performance impact assessed

### Documentation

- [ ] `FUNCTIONALITY.md` updated with new features
- [ ] Inline code comments added for complex logic
- [ ] README.md updated if necessary
- [ ] Version number incremented appropriately

## 🔄 Development Workflow

### 1. **Feature Development**

```bash
# 1. Analyze requirements
# 2. Plan implementation approach
# 3. Write code following standards
# 4. Test thoroughly
# 5. Document changes
# 6. Commit with proper message
```

### 2. **Commit Message Format**

```
<emoji> <type>: <description>

<body explaining what and why>

<footer with breaking changes if any>
```

**Examples:**

```bash
✨ feat: Add minimalist search interface with channel categories
🐛 fix: Resolve mobile responsiveness issue in filter bar
📚 docs: Update API documentation for new search methods
🎨 style: Improve visual hierarchy in category cards
```

### 3. **Version Numbering**

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (0.X.0): New features (backward compatible)
- **PATCH** (0.0.X): Bug fixes (backward compatible)

## 🏗️ Architecture Guidelines

### File Organization

```
/
├── index.html          # Main HTML structure (GitHub Pages entry point)
├── styles.css          # All CSS styles
├── app.js             # Main JavaScript logic
├── README.md          # Project documentation
├── FUNCTIONALITY.md   # Feature documentation
├── AGENT.md          # This file
├── package.json      # Version and dependencies
├── .gitignore        # Git ignore rules
├── 404.html           # Custom 404 page for GitHub Pages (optional)
├── robots.txt         # Search engine directives (optional)
├── sitemap.xml        # Site structure for SEO (optional)
└── favicon.ico        # Website icon
```

### GitHub Pages Specific Files

- **index.html**: Must be in root directory as entry point
- **404.html**: Custom error page for better UX
- **robots.txt**: Control search engine crawling
- **sitemap.xml**: Help search engines index the site
- **favicon.ico**: Website icon for browser tabs
- **CNAME**: Custom domain configuration (if using custom domain)

### Code Structure

- **HTML**: Semantic, accessible markup
- **CSS**: Mobile-first, BEM methodology preferred
- **JavaScript**: ES6+, modular design, proper error handling

### Naming Conventions

- **Variables**: camelCase (`searchResults`, `isLoading`)
- **Functions**: camelCase with descriptive names (`performSearch`, `toggleFavorites`)
- **CSS Classes**: kebab-case (`search-interface`, `category-item`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `DEFAULT_TIMEOUT`)

## 🎨 UI/UX Standards

### Design Principles

- **Minimalist**: Clean, uncluttered interface
- **Intuitive**: Self-explanatory navigation and actions
- **Responsive**: Works seamlessly on all devices
- **Accessible**: WCAG 2.1 AA compliance
- **Performance**: Fast loading and smooth interactions

### Visual Consistency

- Use established color palette and gradients
- Maintain consistent spacing and typography
- Follow existing animation patterns
- Ensure proper contrast ratios
- Use meaningful icons and emojis

## 🔒 Security Considerations

### Input Validation

- ✅ Sanitize all user inputs
- ✅ Escape HTML content
- ✅ Validate API responses
- ✅ Implement rate limiting where appropriate

### Data Handling

- ✅ Use HTTPS for all API calls
- ✅ Implement proper error boundaries
- ✅ Handle network failures gracefully
- ✅ Respect user privacy

## 📊 Performance Guidelines

### Optimization Strategies

- ✅ Debounce user inputs
- ✅ Implement request cancellation
- ✅ Use lazy loading for images
- ✅ Minimize DOM manipulations
- ✅ Cache frequently used data

### Monitoring

- ✅ Track API response times
- ✅ Monitor bundle size
- ✅ Measure user interaction metrics
- ✅ Identify performance bottlenecks

### GitHub Pages Performance

- ✅ Keep total bundle size under 100KB for fast loading
- ✅ Use CDN for external libraries (Axios via CDN)
- ✅ Implement browser caching headers (automatic with GitHub Pages)
- ✅ Optimize images and use modern formats (WebP, AVIF)
- ✅ Minimize HTTP requests by combining resources
- ✅ Use service workers for offline functionality (optional)
- ✅ Implement preloading for critical resources
- ✅ Monitor Core Web Vitals (LCP, FID, CLS)

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version number incremented
- [ ] Performance validated
- [ ] Security review completed
- [ ] GitHub Pages optimization completed (see below)

### GitHub Pages Optimization

#### **Static Site Requirements**

- [ ] All file paths are relative (no absolute paths)
- [ ] CDN links use HTTPS (for security and mixed content prevention)
- [ ] No server-side dependencies (client-side only)
- [ ] All external API calls use HTTPS endpoints
- [ ] CORS-friendly API endpoints only (TVMaze API ✅)

#### **Performance Optimization**

- [ ] Images optimized for web delivery (WebP format preferred)
- [ ] CSS and JS files optimized (minification optional for development)
- [ ] Lazy loading implemented for images
- [ ] Bundle size kept minimal (currently ~50KB total)
- [ ] Caching strategies implemented (localStorage for user data)

#### **SEO & Social Sharing**

- [ ] Meta tags for description, keywords, and Open Graph
- [ ] Favicon and app icons included (16x16, 32x32, 192x192)
- [ ] Structured data markup (JSON-LD for web app)
- [ ] Social media preview cards configured
- [ ] Canonical URLs set correctly

#### **GitHub Pages Specific**

- [ ] Repository is public (required for free GitHub Pages)
- [ ] Pages deployed from `main` branch root directory
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled (automatic with GitHub Pages)
- [ ] 404.html page created for better error handling
- [ ] robots.txt and sitemap.xml added (if needed)

#### **Mobile & Accessibility**

- [ ] Responsive design tested on multiple devices
- [ ] Touch targets are at least 44px (accessibility)
- [ ] Color contrast ratios meet WCAG AA standards
- [ ] Keyboard navigation fully functional
- [ ] Screen reader compatibility verified

#### **Browser Compatibility**

- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)
- [ ] Progressive enhancement implemented
- [ ] Graceful degradation for older browsers
- [ ] JavaScript polyfills added if needed

### GitHub Pages Setup Commands

```bash
# Enable GitHub Pages (via GitHub web interface)
# 1. Go to repository Settings
# 2. Scroll to Pages section
# 3. Source: Deploy from a branch
# 4. Branch: main / (root)
# 5. Save

# Verify deployment
# Site will be available at: https://username.github.io/repository-name
```

### Post-Deployment

- [ ] Functionality verified in production environment
- [ ] Performance metrics checked (Core Web Vitals)
- [ ] User feedback monitored and addressed
- [ ] Error logging reviewed (browser console)
- [ ] GitHub Pages URL accessibility confirmed
- [ ] Mobile responsiveness on live site verified
- [ ] SEO indexing verified (Google Search Console)
- [ ] Social sharing previews tested

## 🤝 Collaboration Guidelines

### Communication

- Use clear, descriptive language in commits
- Document decision rationale in complex changes
- Maintain consistent coding style
- Respect existing architectural decisions

### Code Reviews

- Focus on functionality, performance, and maintainability
- Suggest improvements constructively
- Verify documentation completeness
- Check for potential security issues

## 📈 Continuous Improvement

### Regular Tasks

- [ ] Review and update dependencies
- [ ] Optimize performance bottlenecks
- [ ] Enhance accessibility features
- [ ] Improve error handling
- [ ] Update documentation

### Innovation

- Stay updated with modern web development practices
- Evaluate new technologies for potential adoption
- Gather user feedback for feature improvements
- Monitor industry trends and best practices

---

## 🎯 Success Metrics

A successful agent contribution should:

- ✅ Enhance user experience
- ✅ Maintain code quality
- ✅ Include proper documentation
- ✅ Follow established patterns
- ✅ Be thoroughly tested
- ✅ Improve overall application value

**Remember: Quality over quantity. Every contribution should add meaningful value to the project.**
