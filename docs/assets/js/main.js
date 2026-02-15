// MemeScout Showcase - Main JavaScript

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Demo Data - Sample meme coins for demonstration
const sampleTokens = [
    {
        id: '1',
        symbol: 'MOONROCK',
        name: 'Moon Rock Token',
        coinbaseUrl: 'https://coinmarketcap.com/search/?q=MOONROCK',  // CoinMarketCap search
        currentPrice: 0.0025,
        initialPrice: 0.001,
        priceChangePercent: 150,
        volume24h: 1500000,
        marketCap: 2500000,
        memeScore: 87.5,
        launchDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 5,
        tags: ['rocket'],
        riskLevel: 'MEDIUM',
        holders: 2500,
        twitterFollowers: 15000,
        liquidityLocked: true
    },
    {
        id: '2',
        symbol: 'ROCKETMEME',
        name: 'Rocket Meme Coin',
        coinbaseUrl: 'https://coinmarketcap.com/search/?q=ROCKETMEME',  // CoinMarketCap search
        currentPrice: 0.015,
        initialPrice: 0.005,
        priceChangePercent: 200,
        volume24h: 3200000,
        marketCap: 15000000,
        memeScore: 92.0,
        launchDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 3,
        tags: ['rocket'],
        riskLevel: 'LOW',
        holders: 8500,
        twitterFollowers: 45000,
        liquidityLocked: true
    },
    {
        id: '3',
        symbol: 'DOGEX',
        name: 'Doge X Token',
        coinbaseUrl: 'https://coinmarketcap.com/search/?q=DOGEX',  // CoinMarketCap search
        currentPrice: 0.0085,
        initialPrice: 0.003,
        priceChangePercent: 183,
        volume24h: 980000,
        marketCap: 8500000,
        memeScore: 78.3,
        launchDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 7,
        tags: ['dog'],
        riskLevel: 'MEDIUM',
        holders: 3200,
        twitterFollowers: 22000,
        liquidityLocked: false
    },
    {
        id: '4',
        symbol: 'PEPEMAX',
        name: 'Pepe Maximalist',
        coinbaseUrl: 'https://coinmarketcap.com/search/?q=PEPEMAX',  // CoinMarketCap search
        currentPrice: 0.0012,
        initialPrice: 0.0008,
        priceChangePercent: 50,
        volume24h: 650000,
        marketCap: 1200000,
        memeScore: 65.8,
        launchDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 6,
        tags: ['pepe'],
        riskLevel: 'HIGH',
        holders: 1500,
        twitterFollowers: 8000,
        liquidityLocked: false
    },
    {
        id: '5',
        symbol: 'SHIB2',
        name: 'Shiba Inu 2.0',
        coinbaseUrl: 'https://coinmarketcap.com/search/?q=SHIB2',  // CoinMarketCap search
        currentPrice: 0.0035,
        initialPrice: 0.002,
        priceChangePercent: 75,
        volume24h: 2100000,
        marketCap: 3500000,
        memeScore: 82.1,
        launchDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 4,
        tags: ['dog', 'shib'],
        riskLevel: 'LOW',
        holders: 5400,
        twitterFollowers: 35000,
        liquidityLocked: true
    },
    {
        id: '6',
        symbol: 'FLOKI3',
        name: 'Floki Evolution',
        coinbaseUrl: 'https://coinmarketcap.com/search/?q=FLOKI3',  // CoinMarketCap search
        currentPrice: 0.0068,
        initialPrice: 0.0025,
        priceChangePercent: 172,
        volume24h: 1750000,
        marketCap: 6800000,
        memeScore: 88.9,
        launchDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 2,
        tags: ['dog'],
        riskLevel: 'MEDIUM',
        holders: 4200,
        twitterFollowers: 28000,
        liquidityLocked: true
    }
];

// Load demo data
function loadDemoData() {
    const maxDays = parseInt(document.getElementById('maxDays').value) || 7;
    const minVolume = parseInt(document.getElementById('minVolume').value) || 100000;
    const limit = parseInt(document.getElementById('limit').value) || 6;
    
    // Show loading
    document.getElementById('demo-loading').style.display = 'block';
    document.getElementById('demo-results').innerHTML = '';
    document.getElementById('demo-error').style.display = 'none';
    
    // Simulate API delay
    setTimeout(() => {
        try {
            // Filter sample data based on parameters
            const filteredTokens = sampleTokens.filter(token => {
                return token.daysSinceLaunch <= maxDays && token.volume24h >= minVolume;
            }).slice(0, limit);
            
            // Hide loading
            document.getElementById('demo-loading').style.display = 'none';
            
            if (filteredTokens.length === 0) {
                document.getElementById('demo-error').style.display = 'block';
                document.getElementById('demo-error').innerHTML = `
                    <i class="bi bi-info-circle"></i> No coins found matching your criteria. 
                    Try adjusting the filters (max days: ${maxDays}, min volume: $${minVolume.toLocaleString()}).
                `;
                return;
            }
            
            // Display results
            displayDemoResults(filteredTokens);
        } catch (error) {
            document.getElementById('demo-loading').style.display = 'none';
            document.getElementById('demo-error').style.display = 'block';
            document.getElementById('demo-error').innerHTML = `
                <i class="bi bi-exclamation-triangle"></i> Error loading demo data. 
                This is a static demo. For real-time data, deploy the API backend.
            `;
        }
    }, 800);
}

// Filter tokens by tag
function filterByTag(tag, element) {
    const buttons = document.querySelectorAll('.tag-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Use the element parameter or fallback to event.target
    const activeBtn = element || event?.target;
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    let filtered = tag === 'all' ? sampleTokens : sampleTokens.filter(t => t.tags?.includes(tag));
    displayDemoResults(filtered);
}

// Search tokens
function filterTokens() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const filtered = sampleTokens.filter(token => 
        token.symbol.toLowerCase().includes(searchTerm) ||
        token.name.toLowerCase().includes(searchTerm)
    );
    displayDemoResults(filtered);
}

// Display demo results
function displayDemoResults(tokens) {
    const container = document.getElementById('demo-results');
    container.innerHTML = '';
    
    tokens.forEach(coin => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';
        
        const priceChangeClass = coin.priceChangePercent >= 0 ? 'price-change-positive' : 'price-change-negative';
        const priceChangeIcon = coin.priceChangePercent >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
        
        // Get risk badge color
        const riskColors = {
            'LOW': 'success',
            'MEDIUM': 'warning',
            'HIGH': 'danger',
            'CRITICAL': 'dark'
        };
        const riskColor = riskColors[coin.riskLevel] || 'warning';
        
        // Create tags HTML
        const tagsHtml = coin.tags ? coin.tags.map(tag => 
            `<span class="badge bg-secondary me-1">${tag}</span>`
        ).join('') : '';
        
        col.innerHTML = `
            <div class="card h-100 border-primary" style="cursor: pointer;">
                <div class="card-body">
                    <a href="${coin.coinbaseUrl}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="card-link-header"
                       style="display: block; text-decoration: none; color: inherit; transition: all 0.2s;">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h4 class="mb-0 fw-bold text-dark" style="color: #667eea;">
                                    ${coin.symbol}
                                    <i class="bi bi-box-arrow-up-right" style="font-size: 0.8rem; opacity: 0.6;"></i>
                                </h4>
                                <small class="text-muted">${coin.name}</small>
                                <div class="mt-2">
                                    ${tagsHtml}
                                </div>
                                <div class="mt-2">
                                    <span class="badge bg-info text-dark">
                                        <i class="bi bi-clock me-1"></i>
                                        ${coin.daysSinceLaunch} days ago
                                    </span>
                                    <span class="badge bg-${riskColor}">
                                        <i class="bi bi-exclamation-triangle me-1"></i>
                                        Risk: ${coin.riskLevel}
                                    </span>
                                </div>
                            </div>
                            <span class="badge px-3 py-2 rounded-pill" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                ${coin.memeScore?.toFixed(2) || '0.00'}
                            </span>
                        </div>
                    </a>
                    
                    <div class="mt-3">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Current Price:</span>
                            <span class="fw-bold">$${formatPrice(coin.currentPrice)}</span>
                        </div>
                        
                        ${coin.initialPrice ? `
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Initial Price:</span>
                                <span class="fw-bold">$${formatPrice(coin.initialPrice)}</span>
                            </div>
                        ` : ''}
                        
                        ${coin.priceChangePercent !== undefined ? `
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Change:</span>
                                <span class="fw-bold ${priceChangeClass}">
                                    <i class="bi ${priceChangeIcon}"></i>
                                    ${Math.abs(coin.priceChangePercent).toFixed(2)}%
                                </span>
                            </div>
                        ` : ''}
                        
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">24h Volume:</span>
                            <span class="fw-bold">$${formatNumber(coin.volume24h)}</span>
                        </div>
                        
                        ${coin.marketCap ? `
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Market Cap:</span>
                                <span class="fw-bold">$${formatNumber(coin.marketCap)}</span>
                            </div>
                        ` : ''}
                        
                        ${coin.holders ? `
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Holders:</span>
                                <span class="fw-bold">${formatNumber(coin.holders)}</span>
                            </div>
                        ` : ''}
                        
                        ${coin.twitterFollowers ? `
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Twitter:</span>
                                <span class="fw-bold">${formatNumber(coin.twitterFollowers)}</span>
                            </div>
                        ` : ''}
                        
                        ${coin.liquidityLocked ? `
                            <div class="mt-2 p-2 bg-success bg-opacity-10 rounded">
                                <small class="text-success"><i class="bi bi-lock-fill"></i> Liquidity Locked</small>
                            </div>
                        ` : ''}
                        
                        <div class="mt-3 pt-3 border-top">
                            <a href="${coin.coinbaseUrl}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               class="btn btn-primary btn-sm w-100">
                                <i class="bi bi-graph-up me-2"></i>
                                View on CoinMarketCap
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(col);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    populateCoinSelectors();
    updatePortfolioDisplay();
});

// Utility function to format price
function formatPrice(price) {
    if (!price) return 'N/A';
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
}

// Utility function to format numbers
function formatNumber(num) {
    if (!num) return 'N/A';
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// Portfolio management
let portfolio = [];

function addToPortfolio(coinId) {
    const coin = sampleTokens.find(t => t.id === coinId);
    if (coin && !portfolio.find(p => p.id === coinId)) {
        portfolio.push({ ...coin, quantity: 1 });
        updatePortfolioDisplay();
        showNotification(`${coin.symbol} added to portfolio!`);
    }
}

function removeFromPortfolio(coinId) {
    portfolio = portfolio.filter(p => p.id !== coinId);
    updatePortfolioDisplay();
}

function updatePortfolioDisplay() {
    const container = document.getElementById('portfolioCards');
    
    if (portfolio.length === 0) {
        container.innerHTML = `
            <div class="card w-100 text-center">
                <div class="card-body">
                    <i class="bi bi-inbox" style="font-size: 2rem; color: #ccc;"></i>
                    <h5 class="card-title mt-3">Your portfolio is empty</h5>
                    <p class="card-text text-muted">Add coins from the demo to start tracking</p>
                </div>
            </div>
        `;
        return;
    }
    
    let totalValue = 0;
    let previousTotalValue = 0;
    
    const cards = portfolio.map(coin => {
        const value = coin.currentPrice * (coin.quantity || 1);
        totalValue += value;
        previousTotalValue += (coin.initialPrice || coin.currentPrice) * (coin.quantity || 1);
        
        return `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${coin.symbol}</h5>
                    <p class="card-text text-muted">${coin.name}</p>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Quantity:</span>
                        <span class="fw-bold">${coin.quantity || 1}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Price:</span>
                        <span class="fw-bold">$${formatPrice(coin.currentPrice)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-3">
                        <span>Value:</span>
                        <span class="fw-bold">$${formatPrice(value)}</span>
                    </div>
                    <button class="btn btn-sm btn-outline-danger w-100" onclick="removeFromPortfolio('${coin.id}')">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = cards;
    
    // Update portfolio summary
    const change24h = ((totalValue - previousTotalValue) / previousTotalValue) * 100;
    document.getElementById('totalValue').textContent = '$' + formatNumber(totalValue);
    document.getElementById('totalChange').textContent = (change24h >= 0 ? '+' : '') + change24h.toFixed(2) + '%';
}

// Populate coin selectors
function populateCoinSelectors() {
    const selects = document.querySelectorAll('#coin1, #coin2');
    selects.forEach(select => {
        sampleTokens.forEach(coin => {
            const option = document.createElement('option');
            option.value = coin.id;
            option.textContent = `${coin.symbol} - ${coin.name}`;
            select.appendChild(option);
        });
    });
}

// Update comparison
function updateComparison() {
    const coin1Id = document.getElementById('coin1').value;
    const coin2Id = document.getElementById('coin2').value;
    const result = document.getElementById('comparison-result');
    
    if (!coin1Id || !coin2Id) {
        result.innerHTML = '';
        return;
    }
    
    const coin1 = sampleTokens.find(t => t.id === coin1Id);
    const coin2 = sampleTokens.find(t => t.id === coin2Id);
    
    result.innerHTML = `
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>${coin1.symbol}</th>
                    <th>${coin2.symbol}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>MemeScore</strong></td>
                    <td><span class="badge bg-primary">${coin1.memeScore}</span></td>
                    <td><span class="badge bg-primary">${coin2.memeScore}</span></td>
                </tr>
                <tr>
                    <td><strong>Current Price</strong></td>
                    <td>$${formatPrice(coin1.currentPrice)}</td>
                    <td>$${formatPrice(coin2.currentPrice)}</td>
                </tr>
                <tr>
                    <td><strong>Price Change %</strong></td>
                    <td><span class="price-change-${coin1.priceChangePercent >= 0 ? 'positive' : 'negative'}">
                        ${coin1.priceChangePercent >= 0 ? '+' : ''}${coin1.priceChangePercent.toFixed(2)}%
                    </span></td>
                    <td><span class="price-change-${coin2.priceChangePercent >= 0 ? 'positive' : 'negative'}">
                        ${coin2.priceChangePercent >= 0 ? '+' : ''}${coin2.priceChangePercent.toFixed(2)}%
                    </span></td>
                </tr>
                <tr>
                    <td><strong>24h Volume</strong></td>
                    <td>$${formatNumber(coin1.volume24h)}</td>
                    <td>$${formatNumber(coin2.volume24h)}</td>
                </tr>
                <tr>
                    <td><strong>Market Cap</strong></td>
                    <td>$${formatNumber(coin1.marketCap)}</td>
                    <td>$${formatNumber(coin2.marketCap)}</td>
                </tr>
                <tr>
                    <td><strong>Holders</strong></td>
                    <td>${formatNumber(coin1.holders)}</td>
                    <td>${formatNumber(coin2.holders)}</td>
                </tr>
                <tr>
                    <td><strong>Twitter Followers</strong></td>
                    <td>${formatNumber(coin1.twitterFollowers)}</td>
                    <td>${formatNumber(coin2.twitterFollowers)}</td>
                </tr>
                <tr>
                    <td><strong>Risk Level</strong></td>
                    <td><span class="badge risk-${coin1.riskLevel.toLowerCase()}">${coin1.riskLevel}</span></td>
                    <td><span class="badge risk-${coin2.riskLevel.toLowerCase()}">${coin2.riskLevel}</span></td>
                </tr>
                <tr>
                    <td><strong>Liquidity Locked</strong></td>
                    <td>
                        ${coin1.liquidityLocked ? '<i class="bi bi-check-circle text-success"></i>' : '<i class="bi bi-x-circle text-danger"></i>'}
                    </td>
                    <td>
                        ${coin2.liquidityLocked ? '<i class="bi bi-check-circle text-success"></i>' : '<i class="bi bi-x-circle text-danger"></i>'}
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

// Show notification
function showNotification(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed bottom-0 end-0 m-3';
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Load demo data on page load
if (document.getElementById('demo-results')) {
    loadDemoData();
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Add animation on scroll for feature cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards if they exist
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card, .api-card, .blog-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Newsletter form handling (placeholder)
const newsletterForms = document.querySelectorAll('input[type="email"]');
newsletterForms.forEach(form => {
    const submitBtn = form.nextElementSibling;
    if (submitBtn && submitBtn.tagName === 'BUTTON') {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = form.value;
            if (email && email.includes('@')) {
                alert('Thank you for subscribing! (This is a demo - no actual subscription created)');
                form.value = '';
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
});

// Console message
console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 MemeScout Showcase                                      ║
║                                                              ║
║   Built with: NestJS, TypeScript, PostgreSQL, Prisma        ║
║   Author: Pratik Fulkar                                     ║
║   GitHub: https://github.com/prateeekphukar                 ║
║                                                              ║
║   Like what you see? Star the repo! ⭐                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
