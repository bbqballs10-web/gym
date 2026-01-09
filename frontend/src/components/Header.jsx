import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const scrollToSection = (sectionId) => {
    // Check if we're on home page
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="header-logo">
            <h1 className="logo-text">RAZE</h1>
            <span className="logo-tagline">Built by Discipline</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/products" className="nav-link">
              {t('nav.products')}
            </Link>
            <button onClick={() => scrollToSection('features')} className="nav-link">
              {t('nav.whyRaze')}
            </button>
            <button onClick={() => scrollToSection('newsletter')} className="nav-link">
              {t('nav.earlyAccess')}
            </button>
          </nav>

          {/* Cart and User Actions */}
          <div className="header-actions">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="wishlist-icon-btn">
              <Heart size={22} strokeWidth={2} />
              {wishlistCount > 0 && (
                <span className="wishlist-badge">{wishlistCount}</span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="cart-icon-btn">
              <ShoppingCart size={22} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>

            {/* User Menu */}
            <div className="user-menu-container">
              <button 
                className="user-icon-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={22} strokeWidth={2} />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  {isAuthenticated ? (
                    <>
                      <Link to="/account" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        {t('nav.account')}
                      </Link>
                      <Link to="/account/orders" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        {t('nav.orders')}
                      </Link>
                      <Link to="/account/credit" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        {t('nav.razeCredit')}
                      </Link>
                      {user?.is_admin && (
                        <Link to="/admin" className="dropdown-item admin-link" onClick={() => setIsUserMenuOpen(false)}>
                          {t('nav.adminDashboard')}
                        </Link>
                      )}
                      <button className="dropdown-item" onClick={handleLogout}>
                        {t('nav.logOut')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        {t('nav.logIn')}
                      </Link>
                      <Link to="/register" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        {t('nav.signUp')}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mobile-nav">
            <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              {t('nav.products')}
            </Link>
            <button onClick={() => scrollToSection('features')} className="nav-link">
              {t('nav.whyRaze')}
            </button>
            <button onClick={() => scrollToSection('newsletter')} className="nav-link">
              {t('nav.earlyAccess')}
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/account" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  {t('nav.account')}
                </Link>
                <button className="nav-link" onClick={handleLogout}>
                  {t('nav.logOut')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  {t('nav.logIn')}
                </Link>
                <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  {t('nav.signUp')}
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;