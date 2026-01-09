import React, { useState, useEffect } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1 className="products-title">The Collection</h1>
          <p className="products-subtitle">Performance pieces built for discipline</p>
        </div>

        <div className="products-grid-page">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onClick={handleProductClick}
            />
          ))}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;