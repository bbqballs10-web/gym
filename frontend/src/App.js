import React, { useState, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import WaitlistBanner from "./components/WaitlistBanner";
import ProductCategories from "./components/ProductCategories";
import Features from "./components/Features";
import Reviews from "./components/Reviews";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import EmailPopup from "./components/EmailPopup";
import GiveawayPopup from "./components/GiveawayPopup";
import AnnouncementBar from "./components/AnnouncementBar";
import ScrollToTop from "./components/ScrollToTop";
import { PaymentMethods } from "./components/TrustBadges";
import { Toaster } from "./components/ui/sonner";
import AdminRoute from "./components/AdminRoute";
import LiveVisitorCounter from "./components/LiveVisitorCounter";

// Lazy load pages for better performance
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const CompleteProfile = lazy(() => import("./pages/CompleteProfile"));
const SizeGuide = lazy(() => import("./pages/SizeGuide"));
const FAQ = lazy(() => import("./pages/FAQ"));
const About = lazy(() => import("./pages/About"));
const Returns = lazy(() => import("./pages/Returns"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

// Loading fallback
const PageLoader = () => (
  <div className="page-loader">
    <div className="loader-spinner"></div>
  </div>
);

// Home component with unified popup system
const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  // Hero CTA and Newsletter button both trigger popup
  const handleEarlyAccessClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="landing-page">
      <Header />
      <main className="landing-content">
        <Hero onEarlyAccessClick={handleEarlyAccessClick} />
        <WaitlistBanner onClick={handleEarlyAccessClick} />
        <ProductCategories />
        <TrustBar />
        <AnnouncementBar />
        <Features />
        <Reviews />
        <PaymentMethods />
        <Newsletter onJoinClick={handleEarlyAccessClick} />
      </main>
      <Footer />
      {/* Giveaway popup (auto-trigger: 7 seconds / exit intent) */}
      <GiveawayPopup />
      {/* Manual popup triggered by CTA buttons */}
      {showPopup && (
        <EmailPopup isOpen={showPopup} onClose={handlePopupClose} />
      )}
    </div>
  );
};

// Router wrapper to handle auth callback detection
const AppRouter = () => {
  const location = useLocation();
  
  // Check URL fragment for session_id (Google OAuth callback)
  // This must be synchronous during render, NOT in useEffect
  if (location.hash?.includes('session_id=')) {
    return <Suspense fallback={<PageLoader />}><AuthCallback /></Suspense>;
  }
  
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<><Header /><Products /><Footer /></>} />
        <Route path="/products/:id" element={<><Header /><ProductDetail /><Footer /></>} />
        <Route path="/cart" element={<><Header /><Cart /><Footer /></>} />
        <Route path="/checkout" element={<><Header /><Checkout /><Footer /></>} />
        <Route path="/checkout/success" element={<><Header /><CheckoutSuccess /><Footer /></>} />
        <Route path="/login" element={<><Header /><Login /><Footer /></>} />
        <Route path="/register" element={<><Header /><Register /><Footer /></>} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/complete-profile" element={<><Header /><CompleteProfile /><Footer /></>} />
        <Route path="/size-guide" element={<><Header /><SizeGuide /><Footer /></>} />
        <Route path="/faq" element={<><Header /><FAQ /><Footer /></>} />
        <Route path="/about" element={<><Header /><About /><Footer /></>} />
        <Route path="/returns" element={<><Header /><Returns /><Footer /></>} />
        <Route path="/dashboard" element={<><Header /><Dashboard /><Footer /></>} />
        <Route path="/account" element={<><Header /><Dashboard /><Footer /></>} />
        <Route path="/track" element={<><Header /><OrderTracking /><Footer /></>} />
        <Route path="/track-order" element={<><Header /><OrderTracking /><Footer /></>} />
        <Route path="/wishlist" element={<><Header /><Wishlist /><Footer /></>} />
        <Route path="/admin" element={<AdminRoute><><Header /><Admin /><Footer /></></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><><Header /><Admin /><Footer /></></AdminRoute>} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </Suspense>
    </>
  );
};

// Wrapper component to provide auth context to LiveVisitorCounter
const LiveVisitorWrapper = () => {
  const { user } = useAuth();
  const isAdmin = user?.is_admin || false;
  return <LiveVisitorCounter isAdmin={isAdmin} />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="App">
            <BrowserRouter>
              <AppRouter />
              <LiveVisitorWrapper />
            </BrowserRouter>
            <Toaster />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
