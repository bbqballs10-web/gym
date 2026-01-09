# RAZE Training - Product Requirements Document

## Original Problem Statement
Restore and enhance the RAZE Training e-commerce application from the user's GitHub backup. The app is a minimalist performance training wear brand for gymnasts.

## User Personas
- **Primary**: Gymnasts (MAG/WAG/Other) looking for high-quality training apparel
- **Secondary**: Coaches, parents, and general fitness enthusiasts
- **Global Audience**: International customers in 10+ language markets

## Core Requirements

### Completed Features
- Full-stack e-commerce application (FastAPI + React + MongoDB)
- User authentication (Email/Password + Google OAuth)
- Product catalog with multiple variants
- Shopping cart with bundle discounts
- Waitlist functionality for upcoming products
- Admin dashboard for order management
- n8n webhook integrations for email automation
- Compressed WebP product images (~100KB each)
- "Sold count" display on products
- Hero section with Front/Back product toggle
- Skeleton loading for images

### Multi-Language Support (Completed January 2025)
- **10 Languages Supported**: English, Spanish, French, German, Portuguese, Italian, Japanese, Chinese (Simplified), Korean, Dutch
- **Auto-Detection**: Uses browser language preference
- **Persistence**: Language choice saved to localStorage and cookies
- **Manual Selection**: Language selector dropdown in header
- **Coverage**: Header, Footer, Hero, TrustBar, Newsletter, Cart, Auth pages, Product cards, Popups

### Currency Localization (Completed January 2025)
- **Region-Specific Currencies**:
  - USD ($) - English
  - EUR (€) - Spanish, French, German, Portuguese, Italian, Dutch
  - JPY (¥) - Japanese
  - CNY (¥) - Chinese
  - KRW (₩) - Korean
- **Exchange Rate Conversion**: Automatic conversion from USD base prices
- **Proper Formatting**: Symbol positioning (before/after), decimal handling
- **Coverage**: Product cards, Cart, Checkout, Bundle banners

## Architecture

```
/app/
├── backend/           # FastAPI Python backend
│   ├── server.py      # Main server with all routes
│   └── .env           # Environment configuration
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React contexts (Auth, Cart, Wishlist)
│   │   ├── data/        # Product data (products.js, mock.js)
│   │   ├── locales/     # Translation JSON files (10 languages)
│   │   ├── utils/       # Utility functions (currency.js, etc.)
│   │   ├── i18n.js      # i18next configuration
│   │   └── App.js       # Main React app
│   └── public/images/   # Local compressed product images
└── memory/            # Project documentation
```

## Tech Stack
- **Backend**: FastAPI, Python, Motor (MongoDB async driver)
- **Frontend**: React, react-router-dom, react-i18next
- **Database**: MongoDB
- **Styling**: CSS with custom design system
- **i18n**: i18next with browser language detection
- **Build**: craco (with CSS minification disabled)

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth initiation
- `POST /api/waitlist` - Join product waitlist
- `POST /api/webhook/*` - n8n webhook triggers
- `POST /api/checkout/create-session` - Stripe checkout (needs API key)

## Known Configurations
- **CORS**: Must use specific origins (not wildcard) due to credentials
- **CSS Minification**: Disabled in craco.config.js (temporary workaround)
- **Images**: All product images are local WebP files in `/app/frontend/public/images/`

## Upcoming Tasks (P1)
1. **Stripe Integration**: Add Stripe API key for checkout functionality
2. **Google OAuth gymnastics_type Gap**: Collect this info from first-time Google users

## Future Tasks (P2+)
1. Re-enable CSS minification with proper fix (e.g., lightningcss)
2. Product descriptions translation
3. Admin dashboard translation

## Last Updated
January 7, 2025 - Added currency localization with region-specific currencies (USD, EUR, JPY, CNY, KRW)
