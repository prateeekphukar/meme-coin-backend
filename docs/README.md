# MemeScout Showcase Website

This is the showcase website for MemeScout - a production-ready backend API for discovering, tracking, and analyzing meme coins.

## 🌐 Live Site

The site is designed to be deployed to GitHub Pages at: `https://prateeekphukar.github.io/meme-coin-showcase/`

## 📁 Structure

```
showcase/
├── index.html              # Main landing page
├── blog.html               # Blog listing page
├── blog/
│   ├── building-memescout.html    # Blog post 1
│   └── spotting-meme-coins.html   # Blog post 2
└── assets/
    ├── css/
    │   └── style.css       # Custom styles
    └── js/
        └── main.js         # Interactive functionality
```

## ✨ Features

### Landing Page (index.html)
- Hero section with gradient background
- Stats showcase
- 9 feature cards highlighting all capabilities:
  - Real-time discovery
  - Intelligent scoring
  - **NEW** New launches tracker
  - **NEW** Coinbase integration
  - **NEW** Price history
  - User watchlists
  - Smart alerts
  - **NEW** Volume filtering
  - High performance caching
- API endpoints documentation
- Live demo with interactive filters
- Tech stack overview
- Blog teaser section
- Call-to-action section

### Blog Section
- Blog listing page (blog.html)
- Two comprehensive blog posts:
  1. **Building a Production-Ready Meme Coin Tracker with NestJS**
     - Architecture overview
     - Tech stack deep dive
     - Feature implementation details
     - Database schema design
     - Performance optimizations
     - Deployment guide
  
  2. **How to Spot the Next Big Meme Coin: Key Metrics and Indicators**
     - MemeScore framework explanation
     - Momentum indicators (volume, growth, price action)
     - Liquidity indicators (pool size, locked %, ratios)
     - Stability & trust indicators
     - Real-world example analysis
     - Red flags to avoid
     - Practical strategy guide

## 🚀 Deployment to GitHub Pages

### Option 1: Create a New Repository

1. Create a new repository named `meme-coin-showcase`:
   ```bash
   # Create new repo on GitHub first, then:
   cd showcase
   git init
   git add .
   git commit -m "Initial showcase website"
   git branch -M main
   git remote add origin https://github.com/prateeekphukar/meme-coin-showcase.git
   git push -u origin main
   ```

2. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to "Pages" section
   - Source: Deploy from branch
   - Branch: `main` / `root`
   - Save

3. Your site will be live at: `https://prateeekphukar.github.io/meme-coin-showcase/`

### Option 2: Use gh-pages Branch in Existing Repo

1. From the showcase directory:
   ```bash
   cd showcase
   git init
   git add .
   git commit -m "Add showcase website"
   git checkout -b gh-pages
   git remote add origin https://github.com/prateeekphukar/meme-coin-backend.git
   git push origin gh-pages
   ```

2. Enable GitHub Pages:
   - Repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / `root`
   - Save

3. Your site will be live at: `https://prateeekphukar.github.io/meme-coin-backend/`

### Option 3: Deploy from Main Repo docs/ Folder

1. Move showcase contents to a `docs` folder in the main repo:
   ```bash
   cd /workspaces/meme-coin-backend
   mv showcase docs
   git add docs
   git commit -m "Add showcase website to docs folder"
   git push
   ```

2. Enable GitHub Pages:
   - Repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `main` / `docs`
   - Save

## 🎨 Features Highlighted

The showcase comprehensively covers all new features added to MemeScout:

### ✅ New Launches Tracker
- Track newly launched coins with high volume
- Filter by days since launch and minimum volume
- View price history and % change since launch
- Interactive demo with adjustable parameters

### ✅ Coinbase Integration
- Every token includes clickable Coinbase URL
- Direct links to trade on Coinbase
- Seamless user experience

### ✅ Price History
- Historical price snapshots
- Trend analysis
- Auto-calculated price changes

### ✅ Volume Filtering
- Filter by 24h trading volume
- Identify high-activity coins
- Risk assessment based on liquidity

### ✅ API Documentation
- Clear endpoint descriptions
- Query parameter examples
- Response format examples
- Links to full documentation

## 📱 Responsive Design

The site is fully responsive and works perfectly on:
- Desktop (1920px+)
- Laptop (1366px - 1920px)
- Tablet (768px - 1366px)
- Mobile (320px - 768px)

## 🔧 Customization

### Updating API Endpoint
If you deploy the backend to a live server, update the API base URL in `main.js`:
```javascript
const API_BASE_URL = 'https://your-api-domain.com/api/v1';
```

### Adding More Blog Posts
1. Create a new HTML file in `blog/` directory
2. Use the existing blog post structure as a template
3. Add the post to `blog.html` listing page
4. Update related posts section in other posts

### Changing Colors
Update CSS variables in `style.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... other colors */
}
```

## 📊 Analytics (Optional)

To add Google Analytics, insert this before the closing `</head>` tag:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

## 🤝 Contributing

Feel free to submit issues or pull requests to improve the showcase website!

## 📄 License

MIT License - same as the main MemeScout project

## 💡 Credits

- Design & Development: Pratik Fulkar
- Built with: Bootstrap 5, Custom CSS, Vanilla JavaScript
- Backend: NestJS, PostgreSQL, Prisma, Redis

---

Made with ❤️ for the MemeScout project
