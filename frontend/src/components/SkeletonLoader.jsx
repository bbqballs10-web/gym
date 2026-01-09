import React from 'react';

const SkeletonLoader = ({ width = '100%', height = '200px', borderRadius = '8px' }) => {
  return (
    <div 
      className="skeleton-loader"
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="product-card-skeleton">
    <SkeletonLoader height="250px" borderRadius="12px" />
    <div style={{ padding: '16px' }}>
      <SkeletonLoader height="14px" width="60%" borderRadius="4px" />
      <div style={{ height: '8px' }} />
      <SkeletonLoader height="20px" width="80%" borderRadius="4px" />
      <div style={{ height: '8px' }} />
      <SkeletonLoader height="24px" width="40%" borderRadius="4px" />
    </div>
  </div>
);

export const HeroImageSkeleton = () => (
  <div className="hero-image-skeleton">
    <SkeletonLoader height="100%" borderRadius="12px" />
  </div>
);

export default SkeletonLoader;
