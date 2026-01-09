// RAZE Products - Performance Training Wear

export const products = [
  // Performance T-Shirts
  {
    id: 1,
    name: 'Performance T-Shirt',
    category: 'shirts',
    type: 'shirt',
    variant: 'Black / Cyan',
    description: 'Minimalist performance training wear engineered for gymnastics — Designed for those who value freedom of movement, in and out of training.',
    price: 45,
    originalPrice: 65,
    color: 'Black',
    logo: 'Cyan',
    images: [
      '/images/products/69vwy1yl_ee.webp',
      '/images/products/uut87a31_dsw1.webp'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stock: { XS: 5, S: 2, M: 8, L: 15 },
    featured: true,
    mostPopular: true,
    soldCount: 425
  },
  {
    id: 2,
    name: 'Performance T-Shirt',
    category: 'shirts',
    type: 'shirt',
    variant: 'Black / Silver',
    description: 'Minimalist performance training wear engineered for gymnastics — Designed for those who value freedom of movement, in and out of training.',
    price: 45,
    originalPrice: 65,
    color: 'Black',
    logo: 'Silver',
    images: [
      '/images/products/s3nitfxo_2.webp',
      '/images/products/rp49piw5_21.webp'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stock: { XS: 8, S: 10, M: 12, L: 18 },
    featured: true,
    soldCount: 183
  },
  {
    id: 3,
    name: 'Performance T-Shirt',
    category: 'shirts',
    type: 'shirt',
    variant: 'Grey / Cyan',
    description: 'Minimalist performance training wear engineered for gymnastics — Designed for those who value freedom of movement, in and out of training.',
    price: 45,
    originalPrice: 65,
    color: 'Grey',
    logo: 'Cyan',
    images: [
      '/images/products/jf6ahqpn_4.webp',
      '/images/products/h5tbyhj3_8.webp'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stock: { XS: 10, S: 12, M: 15, L: 20 },
    featured: true,
    soldCount: 298
  },
  {
    id: 4,
    name: 'Performance T-Shirt',
    category: 'shirts',
    type: 'shirt',
    variant: 'Grey / White',
    description: 'Minimalist performance training wear engineered for gymnastics — Designed for those who value freedom of movement, in and out of training.',
    price: 45,
    originalPrice: 65,
    color: 'Grey',
    logo: 'White',
    images: [
      '/images/products/pr4hpazn_5.webp'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stock: { XS: 6, S: 14, M: 18, L: 22 },
    featured: true,
    soldCount: 201
  },
  // Performance Shorts (with Men's/Women's option)
  {
    id: 5,
    name: 'Performance Shorts',
    category: 'shorts',
    type: 'shorts',
    variant: 'Black / Cyan',
    description: 'Performance shorts engineered for gymnastics training. Designed to pair with Performance T-Shirts.',
    price: 55,
    originalPrice: 75,
    color: 'Black',
    logo: 'Cyan',
    images: [
      '/images/products/c4dg91vy_5.webp',
      '/images/products/0zp1wq7a_1.webp'
    ],
    mensSizes: ['S', 'M', 'L', 'XL'],
    womensSizes: ['XS', 'S', 'M', 'L'],
    sizes: ['S', 'M', 'L', 'XL'], // Default to men's
    inStock: true,
    stock: { XS: 6, S: 10, M: 14, L: 18, XL: 12 },
    featured: true,
    soldCount: 357
  },
  {
    id: 6,
    name: 'Performance Shorts',
    category: 'shorts',
    type: 'shorts',
    variant: 'Black / Silver',
    description: 'Performance shorts engineered for gymnastics training. Designed to pair with Performance T-Shirts.',
    price: 55,
    originalPrice: 75,
    color: 'Black',
    logo: 'Silver',
    images: [
      '/images/products/lauo11fr_6.webp',
      '/images/products/0zp1wq7a_1.webp'
    ],
    mensSizes: ['S', 'M', 'L', 'XL'],
    womensSizes: ['XS', 'S', 'M', 'L'],
    sizes: ['S', 'M', 'L', 'XL'], // Default to men's
    inStock: true,
    stock: { XS: 4, S: 8, M: 10, L: 14, XL: 10 },
    featured: true,
    soldCount: 115
  }
];


export const getProductById = (id) => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (category) => {
  return products.filter(p => p.category === category);
};

export const checkStock = (productId, size) => {
  const product = getProductById(productId);
  if (!product || !product.stock) return 0;
  return product.stock[size] || 0;
};

export default products;