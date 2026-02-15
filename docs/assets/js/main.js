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
        coinbaseUrl: 'https://coinmarketcap.com/currencies/moonrock/',
        currentPrice: 0.0025,
        initialPrice: 0.001,
        priceChangePercent: 150,
        volume24h: 1500000,
        marketCap: 2500000,
        memeScore: 87.5,
        launchDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 5
    },
    {
        id: '2',
        symbol: 'ROCKETMEME',
        name: 'Rocket Meme Coin',
        coinbaseUrl: 'https://coinmarketcap.com/currencies/rocketmeme/',
        currentPrice: 0.015,
        initialPrice: 0.005,
        priceChangePercent: 200,
        volume24h: 3200000,
        marketCap: 15000000,
        memeScore: 92.0,
        launchDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 3
    },
    {
        id: '3',
        symbol: 'DOGEX',
        name: 'Doge X Token',
        coinbaseUrl: 'https://coinmarketcap.com/currencies/dogex/',
        currentPrice: 0.0085,
        initialPrice: 0.003,
        priceChangePercent: 183,
        volume24h: 980000,
        marketCap: 8500000,
        memeScore: 78.3,
        launchDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 7
    },
    {
        id: '4',
        symbol: 'PEPEMAX',
        name: 'Pepe Maximalist',
        coinbaseUrl: 'https://coinmarketcap.com/currencies/pepemax/',
        currentPrice: 0.0012,
        initialPrice: 0.0008,
        priceChangePercent: 50,
        volume24h: 650000,
        marketCap: 1200000,
        memeScore: 65.8,
        launchDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 6
    },
    {
        id: '5',
        symbol: 'SHIB2',
        name: 'Shiba Inu 2.0',
        coinbaseUrl: 'https://coinmarketcap.com/currencies/shib2/',
        currentPrice: 0.0035,
        initialPrice: 0.002,
        priceChangePercent: 75,
        volume24h: 2100000,
        marketCap: 3500000,
        memeScore: 82.1,
        launchDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 4
    },
    {
        id: '6',
        symbol: 'FLOKI3',
        name: 'Floki Evolution',
        coinbaseUrl: 'https://coinmarketcap.com/currencies/floki3/',
        currentPrice: 0.0068,
        initialPrice: 0.0025,
        priceChangePercent: 172,
        volume24h: 1750000,
        marketCap: 6800000,
        memeScore: 88.9,
        launchDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        daysSinceLaunch: 2
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

// Display demo results
function displayDemoResults(tokens) {
    const container = document.getElementById('demo-results');
    container.innerHTML = '';
    
    tokens.forEach(coin => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';
        
        const priceChangeClass = coin.priceChangePercent >= 0 ? 'price-change-positive' : 'price-change-negative';
        const priceChangeIcon = coin.priceChangePercent >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
        
        col.innerHTML = `
            <div class="card h-100 border-primary">
                <div class="card-body">
                    <a href="${coin.coinbaseUrl}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="text-decoration-none">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h4 class="mb-0 fw-bold text-dark">
                                    ${coin.symbol}
                                    <i class="bi bi-box-arrow-up-right" style="font-size: 0.8rem; opacity: 0.6;"></i>
                                </h4>
                                <small class="text-muted">${coin.name}</small>
                                <div class="mt-1">
                                    <span class="badge bg-info text-dark">
                                        <i class="bi bi-clock me-1"></i>
                                        ${coin.daysSinceLaunch} days ago
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
