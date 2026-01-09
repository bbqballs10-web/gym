import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    category: "Shipping",
    questions: [
      {
        q: "Where do you ship from?",
        a: "We ship internationally from Singapore. All orders are processed within 1-2 business days."
      },
      {
        q: "How long does shipping take?",
        a: "Delivery times vary by country. Standard shipping typically takes 7-14 business days. Express options are available at checkout for faster delivery (3-5 business days)."
      },
      {
        q: "Is shipping free?",
        a: "Yes! We offer free tracked shipping on all orders over $100 USD. Orders under $100 have a flat rate of $25 USD."
      },
      {
        q: "Do you provide tracking?",
        a: "Yes, all orders include tracked shipping. You'll receive a tracking number via email once your order ships."
      }
    ]
  },
  {
    category: "Sizing & Fit",
    questions: [
      {
        q: "What size should I get?",
        a: "Our shirts run true to size with an athletic fit. If you prefer a looser fit, we recommend sizing up. Check our Size Guide for detailed measurements."
      },
      {
        q: "Are the shirts unisex?",
        a: "Yes, our Performance T-Shirts are designed with a unisex fit that works for all body types."
      },
      {
        q: "What about shorts sizing?",
        a: "Our Performance Shorts come in both Men's and Women's sizing for the best fit. Size charts are available on each product page."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy. Items must be unworn, unwashed, and in original packaging. Simply contact us to initiate a return."
      },
      {
        q: "Can I exchange for a different size?",
        a: "Yes! If the size doesn't fit, contact us within 30 days and we'll arrange an exchange for the correct size."
      },
      {
        q: "How do I start a return?",
        a: "Email us at support@razetraining.com with your order number and reason for return. We'll send you return instructions within 24 hours."
      }
    ]
  },
  {
    category: "Product & Care",
    questions: [
      {
        q: "What material are the shirts made of?",
        a: "Our Performance T-Shirts are made from lightweight, sweat-wicking fabric engineered for high-output training sessions. They hold structure and fit after repeated washes."
      },
      {
        q: "How do I wash the products?",
        a: "Machine wash cold with like colors. Tumble dry low or hang dry. Do not bleach or iron directly on prints."
      },
      {
        q: "Are the products squat/deadlift proof?",
        a: "Absolutely. Our athletic cut is designed to stay in place under tension — perfect for overhead movements, inversions, and full-range exercises."
      }
    ]
  },
  {
    category: "Orders & Payment",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe checkout."
      },
      {
        q: "Can I modify or cancel my order?",
        a: "Orders can be modified or cancelled within 2 hours of placing them. After that, they enter processing. Contact us immediately if you need changes."
      },
      {
        q: "I didn't receive an order confirmation?",
        a: "Check your spam folder first. If you still don't see it, contact us with your email and we'll resend the confirmation."
      }
    ]
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="faq-page">
      <div className="container">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about RAZE products and ordering.</p>
        </div>

        <div className="faq-content">
          {faqs.map((category, idx) => (
            <div key={idx} className="faq-category">
              <h2 className="faq-category-title">{category.category}</h2>
              <div className="faq-list">
                {category.questions.map((item, qIdx) => (
                  <FAQItem key={qIdx} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h3>Still have questions?</h3>
          <p>Can't find what you're looking for? Reach out to our support team.</p>
          <a href="mailto:support@razetraining.com" className="faq-contact-btn">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
