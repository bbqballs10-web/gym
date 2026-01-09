import React from 'react';
import { Truck, Mail, CheckCircle } from 'lucide-react';

const Returns = () => {
  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header">
          <h1 className="info-title">Shipping & Quality Guarantee</h1>
          <p className="info-subtitle">Built right. Shipped fast. Guaranteed.</p>
        </div>

        <div className="info-content">
          {/* Shipping Section */}
          <section className="info-section">
            <h2><Truck size={24} className="section-icon" /> Shipping</h2>
            
            <div className="policy-grid">
              <div className="policy-card">
                <h3>Domestic (US)</h3>
                <ul>
                  <li>Standard Shipping: 5-7 business days</li>
                  <li>Flat rate: $5.99</li>
                  <li>Free shipping on orders over $100</li>
                </ul>
              </div>
              <div className="policy-card">
                <h3>International</h3>
                <ul>
                  <li>Delivery: 10-14 business days</li>
                  <li>Flat rate: $14.99</li>
                  <li>Free shipping on orders over $150</li>
                </ul>
              </div>
            </div>

            <div className="policy-note">
              <p><strong>Note:</strong> International orders may be subject to customs duties and taxes, which are the responsibility of the recipient. Delivery times may vary during peak seasons or due to customs processing.</p>
            </div>
          </section>

          {/* Policy Section */}
          <section className="info-section">
            <h2>Our Policy</h2>
            
            <div className="policy-highlight">
              <CheckCircle size={20} />
              <span>Quality Guaranteed</span>
            </div>

            <p className="policy-statement">
              Every RAZE product is engineered for performance and built to last. We stand behind the quality of our gear with confidence.
            </p>

            <h3>All Sales Are Final</h3>
            <p>
              We do not offer returns or exchanges for sizing, fit preference, or change of mind. We encourage you to review our detailed size guide before purchasing to ensure the perfect fit.
            </p>

            <div className="policy-list-container">
              <h3>What's Not Covered</h3>
              <ul className="policy-list">
                <li>Sizing or fit preferences</li>
                <li>Change of mind</li>
                <li>Items that have been worn, washed, or altered</li>
                <li>Normal wear and tear</li>
              </ul>
            </div>
          </section>

          {/* Defects & Incorrect Orders */}
          <section className="info-section">
            <h2>Defects & Incorrect Orders</h2>
            
            <p className="policy-statement">
              We hold ourselves to the highest standard. If your order arrives defective or incorrect, we'll make it right — no questions asked.
            </p>

            <h3>We'll Issue a Full Refund For:</h3>
            <ul className="policy-list">
              <li>Manufacturing defects (stitching, fabric flaws, print errors)</li>
              <li>Incorrect item shipped</li>
              <li>Incorrect size shipped (different from what you ordered)</li>
              <li>Damaged items upon arrival</li>
            </ul>
          </section>

          {/* How to Claim Section */}
          <section className="info-section">
            <h2>How to Report an Issue</h2>
            
            <div className="steps-list">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Document the Issue</h3>
                  <p>Take clear photos of the defect or incorrect item, including the shipping label and packaging.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Contact Us</h3>
                  <p>Email <a href="mailto:support@razetraining.com">support@razetraining.com</a> with your order number and photos within 7 days of delivery.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Resolution</h3>
                  <p>Our team will review your claim and respond within 24-48 hours with a resolution.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Refund Processed</h3>
                  <p>Approved refunds are processed within 5-7 business days to your original payment method.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="info-section">
            <div className="info-tip">
              <Mail size={20} />
              <div>
                <h3>Questions?</h3>
                <p>Our team is here to help. Email us at <a href="mailto:support@razetraining.com">support@razetraining.com</a> and we'll respond within 24 hours.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Returns;
