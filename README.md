# 🚀 Meme Coin Discovery & Ranking Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

Production-ready backend API for a Meme Coin Discovery & Ranking platform. Discover trending meme coins, analyze potential, track favorites, and set smart alerts—all powered by real-time DEX data.

## 🌐 Live Showcase & Integration

Check out the interactive showcase site: [MemeScout Showcase](https://prateeekphukar.github.io/meme-coin-showcase/)

### 📱 Android APK & Mobile Ready
The backend is specifically optimized for high-performance mobile clients:
- **Firebase Cloud Messaging (FCM)**: Native support for real-time push notifications.
- **RESTful JSON**: Lightweight, optimized payloads for low-latency mobile experiences.
- **JWT Auth**: Secure, biometric-compatible authentication flow.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features
### Core Functionality
- **Real-time Discovery**: Automatically discovers new meme coins from DEX APIs (DexScreener, CoinGecko)
- **Intelligent Scoring**: Multi-factor scoring engine analyzing momentum, liquidity, age, and stability
- **User Watchlists**: Create and manage personalized token watchlists
- **Smart Alerts**: Price, score, and percentage change alerts with background processing
- **RESTful API**: Clean, well-documented endpoints for mobile/web clients
- **Caching Layer**: Redis-powered caching for high-performance reads
