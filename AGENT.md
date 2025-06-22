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
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles
├── app.js             # Main JavaScript logic
├── README.md          # Project documentation
├── FUNCTIONALITY.md   # Feature documentation
├── AGENT.md          # This file
├── package.json      # Version and dependencies
└── .gitignore        # Git ignore rules
```

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

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version number incremented
- [ ] Performance validated
- [ ] Security review completed

### Post-Deployment

- [ ] Functionality verified in production
- [ ] Performance metrics checked
- [ ] User feedback monitored
- [ ] Error logging reviewed

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
