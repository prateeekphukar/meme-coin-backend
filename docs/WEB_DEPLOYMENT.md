# 🌐 Web Deployment Guide

## Overview

The MemeScout website is automatically deployed to GitHub Pages whenever changes are pushed to the `docs/` folder. The deployment process includes validation, asset integrity checks, and direct GitHub Pages publishing.

## Automatic Deployment

### GitHub Actions Workflow: `web-deploy.yml`

**Trigger Events:**
- Any push to `main` branch that modifies files in `docs/` folder
- Manual trigger via GitHub Actions tab

**What It Does:**

1. **✅ HTML Validation** - Verifies all HTML files have proper structure
2. **📦 Asset Integrity** - Checks that CSS, JS, and image folders exist with required files
3. **🔗 Link Validation** - Ensures all external links (CoinMarketCap URLs) are in correct format
4. **📊 Deployment Report** - Generates statistics on deployed files and assets
5. **🚀 GitHub Pages Deploy** - Publishes to `https://prateeekphukar.github.io/meme-coin-backend/`

### Deployment Flow

```
Push to main (docs/ changes)
         ↓
   Validate HTML
         ↓
   Check Assets
         ↓
   Validate URLs
         ↓
   Generate Report
         ↓
   Deploy to Pages
         ↓
✅ Live Website
```

## Local Testing

### Before Committing

Test the website locally by opening the HTML file in your browser:

```bash
# Option 1: Direct file access
open docs/index.html

# Option 2: Local server (Python 3)
cd docs
python -m http.server 8000
# Visit: http://localhost:8000

# Option 3: Local server (Node.js)
cd docs
npx http-server
```

### Validation Checks

Before pushing, ensure:

```bash
# Check for HTML validity
grep -l "<!DOCTYPE html>" docs/*.html

# Verify assets exist
test -f docs/assets/css/style.css && echo "✓ CSS"
test -f docs/assets/js/main.js && echo "✓ JS"

# Check CoinMarketCap URL format
grep "coinmarketcap.com/currencies/" docs/assets/js/main.js | head -1
# Should show: https://coinmarketcap.com/currencies/...

# Verify no old search format URLs
! grep "coinmarketcap.com/search" docs/assets/js/main.js && echo "✓ No old format URLs"
```

## Manual Deployment

If you need to trigger deployment manually:

1. Go to **GitHub Actions** tab
2. Select **🌐 Web Deployment**
3. Click **Run workflow**
4. Select branch: `main`
5. Click **Run workflow** button

The workflow will run and deploy within ~1-2 minutes.

## Deployment Status

- **Website URL:** https://prateeekphukar.github.io/meme-coin-backend/
- **Deploy Logs:** GitHub Actions → Web Deployment workflow
- **Last Deploy:** Check the workflow runs

## File Structure

```
docs/
├── index.html              # Main homepage
├── blog.html              # Blog listing page
├── assets/
│   ├── css/
│   │   └── style.css      # Main styling
│   ├── js/
│   │   └── main.js        # Demo functionality & sample data
│   └── images/            # Graphics and icons
├── blog/                  # Individual blog posts
├── QUICK_START.md         # Setup guide
├── DATABASE_SYNC.md       # Data sync documentation
├── ACTIONS_AND_SYNC.md    # GitHub Actions details
└── deploy.sh              # Manual deployment script (legacy)
```

## CoinMarketCap URL Format

All coin links now use the **direct currency page format**:

```
✓ Correct:  https://coinmarketcap.com/currencies/moonrock/
✗ Old:      https://coinmarketcap.com/search/?q=MOONROCK
```

The direct format provides:
- Better user experience (direct coin page vs search results)
- Improved SEO friendliness
- Faster page load times

## Environment & Permissions

The workflow requires GitHub Pages settings configured:

1. **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` / `docs/` folder
4. **CNAME:** (optional, for custom domain)

Current permissions (automatic in workflow):
- `contents: read` - Access source code
- `pages: write` - Deploy to Pages
- `id-token: write` - OIDC authentication

## Troubleshooting

### Workflow Fails - HTML Validation Error

**Error:** `✗ [file].html missing closing HTML tag`

**Solution:** Check that all HTML files have proper closing tags:
```html
</body>
</html>
```

### Links Not Updating Live

**Issue:** Made changes but website doesn't reflect them

**Solution:**
1. Verify changes are committed and pushed to `main`
2. Check GitHub Actions workflow status
3. Wait ~30 seconds for cache to clear
4. Hard refresh browser: `Ctrl+Shift+R` (Cmd+Shift+R on Mac)

### Asset Not Loading

**Issue:** CSS or JS files not loading

**Solutions:**
1. Check file exists in `docs/assets/css/` or `docs/assets/js/`
2. Verify path in HTML is correct: `assets/css/style.css`
3. Check browser console for 404 errors
4. Run: `test -f docs/assets/css/style.css && echo "✓ exists"`

## Quick Commands

```bash
# Deploy website quickly
git add docs/
git commit -m "Update website"
git push origin main

# Test locally
cd docs && python -m http.server 8000

# Check deployment status
gh run list --workflow=web-deploy.yml

# View latest logs
gh run view --log --workflow=web-deploy.yml | head -100
```

## Integration Points

- **Backend API:** API endpoints documented in `/api` section
- **Data Sync:** GitHub Actions workflow `data-sync-10min.yml`
- **Blog:** Blog posts in `docs/blog/` folder
- **Demo:** Sample data in `docs/assets/js/main.js`

## Related Documentation

- [Quick Start Guide](QUICK_START.md) - Backend setup
- [Data Sync Config](DATABASE_SYNC.md) - Database automation
- [GitHub Actions Setup](ACTIONS_AND_SYNC.md) - All workflows
- [GitHub Repository](https://github.com/prateeekphukar/meme-coin-backend)

---

**Last Updated:** February 15, 2026  
**Deployment Status:** ✅ Active  
**Website Health:** All systems operational
