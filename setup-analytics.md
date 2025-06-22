# 🔐 Analytics Setup with GitHub Secrets

## Quick Setup Guide

Your Google Analytics Measurement ID: `G-0JTM0343LS`

### Step 1: Add GitHub Secret

1. **Go to your repository on GitHub**

   ```
   https://github.com/yuvrajdomun/tv-show-search-app
   ```

2. **Navigate to Settings**

   - Click on "Settings" tab in your repository
   - Scroll down to "Security" section in the left sidebar
   - Click on "Secrets and variables" → "Actions"

3. **Add New Repository Secret**
   - Click "New repository secret"
   - **Name**: `GA_MEASUREMENT_ID`
   - **Value**: `G-0JTM0343LS`
   - Click "Add secret"

### Step 2: Enable GitHub Pages with Actions

1. **Go to Pages Settings**
   - In your repository, go to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - This will use the custom deployment workflow

### Step 3: Trigger Deployment

1. **Push any change to main branch** or manually trigger:

   ```bash
   git add .
   git commit -m "🔧 Configure analytics with secrets"
   git push origin main
   ```

2. **Check the Actions tab** to see the deployment progress:
   ```
   https://github.com/yuvrajdomun/tv-show-search-app/actions
   ```

## 🔍 How It Works

### Security Features

- ✅ **Measurement ID stored securely** in GitHub Secrets
- ✅ **Never exposed in source code** or version control
- ✅ **Automatically injected** during deployment
- ✅ **Environment-specific configuration** (dev vs prod)
- ✅ **Privacy-compliant** with IP anonymization

### Development vs Production

- **Development**: Analytics disabled for localhost
- **Production**: Analytics enabled with your measurement ID
- **Debugging**: Add `?debug=true` to URL for detailed logs

### Configuration System

```javascript
// Your app automatically detects the environment
window.AppConfig.get("analytics.enabled"); // true in production
window.AppConfig.get("analytics.measurementId"); // G-0JTM0343LS
window.AppConfig.get("app.environment"); // 'production'
```

## 📊 What You'll Track

Once deployed, your analytics will automatically track:

### User Behavior

- ✅ Search queries and results
- ✅ Channel preferences (Netflix, HBO, etc.)
- ✅ Favorite shows and engagement
- ✅ View mode preferences (grid/list)
- ✅ Filter usage patterns
- ✅ Session duration and return visits

### Performance Metrics

- ✅ Search response times
- ✅ Error rates and types
- ✅ Page load performance
- ✅ Mobile vs desktop usage

### Content Insights

- ✅ Most popular shows
- ✅ Trending searches
- ✅ Genre preferences
- ✅ Geographic distribution

## 🎯 Verification Steps

### 1. Check Deployment Logs

```bash
# Look for these messages in GitHub Actions:
✅ Injecting Analytics Measurement ID: G-0JT***
✅ Updated index.html with environment variables
✅ Analytics ID found in index.html
```

### 2. Test in Browser

```javascript
// Open browser console on your live site:
console.log(window.AppConfig.get("analytics.measurementId"));
// Should show: G-0JTM0343LS

// Check if analytics is working:
console.log(window.gtag);
// Should show the gtag function
```

### 3. Google Analytics Dashboard

1. Go to [analytics.google.com](https://analytics.google.com)
2. Select your property
3. Check "Realtime" → "Overview"
4. Visit your site and see real-time data

## 🔧 Troubleshooting

### Issue: Analytics not working

**Check:**

- [ ] Secret `GA_MEASUREMENT_ID` is set correctly
- [ ] GitHub Actions deployment succeeded
- [ ] Browser console shows measurement ID
- [ ] Not using ad blocker or privacy extensions

### Issue: No data in Google Analytics

**Verify:**

- [ ] Measurement ID matches exactly: `G-0JTM0343LS`
- [ ] Site is deployed to GitHub Pages
- [ ] Real users are visiting (not just you)
- [ ] Wait 24-48 hours for data to appear

### Issue: Development mode

**Expected behavior:**

- Analytics disabled on localhost
- Console shows: "Analytics disabled (development)"
- Only works on live GitHub Pages site

## 🚀 Advanced Configuration

### Custom Events

Your app automatically tracks custom events:

```javascript
// These are automatically sent:
gtag("event", "tv_show_search", {
  search_query: "Breaking Bad",
  results_found: 15,
});

gtag("event", "channel_selection", {
  channel_name: "Netflix",
  results_found: 50,
});
```

### Privacy Controls

```javascript
// Users can opt out:
localStorage.setItem("analytics-disabled", "true");

// Check opt-out status:
window.AppConfig.get("analytics.enabled");
```

### Debug Mode

Add `?debug=true` to your URL to see detailed analytics logs:

```
https://yuvrajdomun.github.io/tv-show-search-app?debug=true
```

## 📈 Expected Results

### Week 1

- Basic visitor tracking
- Search patterns emerge
- Popular shows identified

### Week 2-4

- User behavior patterns
- Peak usage times
- Geographic distribution
- Device preferences

### Month 2+

- Content trends
- User retention data
- Feature adoption rates
- Performance optimizations

---

## 🎉 Next Steps

1. **Set up the GitHub secret** (5 minutes)
2. **Deploy and verify** analytics are working
3. **Monitor your dashboard** for insights
4. **Use data to improve** your app

Your TV Show Search App will now have enterprise-level analytics while keeping your measurement ID secure! 🔐📊
