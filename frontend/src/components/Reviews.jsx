import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Marcus T.",
    rating: 5,
    text: "fits perfect, doesn't ride up during handstands. exactly what i was looking for",
    product: "Black / Cyan"
  },
  {
    id: 2,
    name: "Sarah K.",
    rating: 5,
    text: "finally a shirt that actually stays put. ordered 2 more lol",
    product: "Grey / Cyan"
  },
  {
    id: 3,
    name: "James R.",
    rating: 5,
    text: "wore it all week training, still looks new. quality is 10/10",
    product: "Black / Cyan"
  },
  {
    id: 4,
    name: "Emily W.",
    rating: 5,
    text: "so lightweight but somehow still holds its shape. love the minimal look",
    product: "Grey / Cyan"
  },
  {
    id: 5,
    name: "David L.",
    rating: 5,
    text: "best gym shirt i own now. wish i found this brand sooner",
    product: "Black / Cyan"
  },
  {
    id: 6,
    name: "Nina P.",
    rating: 5,
    text: "the fabric is amazing for gymnastics. breathes so well",
    product: "Grey / Cyan"
  },
  {
    id: 7,
    name: "Chris M.",
    rating: 5,
    text: "clean design, no annoying logos everywhere. just quality",
    product: "Black / Cyan"
  },
  {
    id: 8,
    name: "Alex H.",
    rating: 5,
    text: "bought for my husband, he won't wear anything else now",
    product: "Black / Cyan"
  }
];

const Reviews = () => {
  const { t } = useTranslation();
  // Double the reviews for seamless infinite scroll
  const doubledReviews = [...reviews, ...reviews];

  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-header">
        <h2 className="reviews-title">{t('reviews.title')}</h2>
        <div className="reviews-rating">
          <div className="stars-row">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
            ))}
          </div>
          <span className="rating-text">4.9 from 127 reviews</span>
        </div>
      </div>

      <div className="reviews-carousel-wrapper">
        <div className="reviews-carousel">
          {doubledReviews.map((review, index) => (
            <div key={`${review.id}-${index}`} className="review-card-compact">
              <div className="review-stars-compact">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill="#F59E0B"
                    color="#F59E0B"
                  />
                ))}
              </div>
              <p className="review-text-compact">"{review.text}"</p>
              <div className="review-author">
                <span className="author-name">{review.name}</span>
                <span className="author-product">{review.product}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
