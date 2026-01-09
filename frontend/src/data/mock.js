// Mock data for RAZE landing page

export const brandContent = {
  tagline: "Built by Discipline",
  heroTitle: "RAZE",
  heroSubtitle: "Minimalist performance training wear engineered for gymnastics. Built for overhead movement, inversion, and full range control—designed to perform through repetition and stay clean beyond the gym.",
  launchNote: "Drop 01 is live."
};

// Pricing structure
export const pricing = {
  shirt: 45,
  shorts: 55,
  trainingSetBundle: 69, // Shirt + Shorts bundle price
  discounts: {
    twoShirts: 0.20,    // 20% off when buying 2 shirts
    threeShirts: 0.35,  // 35% off when buying 3+ shirts
  }
};

// Hero product (single shirt for hero section - Black/Cyan)
export const heroProduct = {
  id: 1,
  name: "Performance T-Shirt",
  color: "Black / Cyan",
  // Front view - clean transparent PNG
  image: "/images/products/front_shirt_black_cyan.png",
  // Back view - cyan logo with "Built by Discipline" design
  backImage: "/images/products/back_shirt_black_cyan.png"
};

// All shirt variants (4 styles)
export const shirts = [
  {
    id: 1,
    name: "Performance T-Shirt",
    category: "Shirts",
    variant: "Black / Cyan",
    color: "Black",
    logoColor: "Cyan",
    hex: "#00D4FF",
    image: "/images/products/front_shirt_black_cyan.png",
    backImage: "/images/products/back_shirt_black_cyan.png",
    price: 45,
    originalPrice: 65,
    sizes: ["XS", "S", "M", "L"],
    status: "available",
    soldCount: 425
  },
  {
    id: 2,
    name: "Performance T-Shirt",
    category: "Shirts",
    variant: "Black / Silver",
    color: "Black",
    logoColor: "Silver",
    hex: "#C0C0C0",
    image: "/images/products/front_shirt_black_silver.png",
    backImage: "/images/products/back_shirt_black_silver.png",
    price: 45,
    originalPrice: 65,
    sizes: ["XS", "S", "M", "L"],
    status: "available",
    soldCount: 183
  },
  {
    id: 3,
    name: "Performance T-Shirt",
    category: "Shirts",
    variant: "Grey / Cyan",
    color: "Grey",
    logoColor: "Cyan",
    hex: "#00D4FF",
    image: "/images/products/front_shirt_grey_cyan.png",
    backImage: "/images/products/back_shirt_grey_cyan.png",
    price: 45,
    originalPrice: 65,
    sizes: ["XS", "S", "M", "L"],
    status: "available",
    soldCount: 298
  },
  {
    id: 4,
    name: "Performance T-Shirt",
    category: "Shirts",
    variant: "Grey / White",
    color: "Grey",
    logoColor: "White",
    hex: "#FFFFFF",
    image: "/images/products/front_shirt_grey_white.png",
    backImage: "/images/products/back_shirt_grey_white.png",
    price: 45,
    originalPrice: 65,
    sizes: ["XS", "S", "M", "L"],
    status: "available",
    soldCount: 201
  }
];

// Shorts variants (2 styles with Men's/Women's option)
export const shorts = [
  {
    id: 5,
    name: "Performance Shorts",
    category: "Shorts",
    variant: "Black / Cyan",
    color: "Black",
    logoColor: "Cyan",
    hex: "#00D4FF",
    image: "/images/products/c4dg91vy_5.webp",
    backImage: "/images/products/0zp1wq7a_1.webp",
    price: 55,
    originalPrice: 75,
    mensSizes: ["S", "M", "L", "XL"],
    womensSizes: ["XS", "S", "M", "L"],
    sizes: ["S", "M", "L", "XL"],
    status: "available",
    soldCount: 357
  },
  {
    id: 6,
    name: "Performance Shorts",
    category: "Shorts",
    variant: "Black / Silver",
    color: "Black",
    logoColor: "Silver",
    hex: "#C0C0C0",
    image: "/images/products/lauo11fr_6.webp",
    backImage: "/images/products/0zp1wq7a_1.webp",
    price: 55,
    originalPrice: 75,
    mensSizes: ["S", "M", "L", "XL"],
    womensSizes: ["XS", "S", "M", "L"],
    sizes: ["S", "M", "L", "XL"],
    status: "available",
    soldCount: 115
  }
];

// For backwards compatibility
export const mensShorts = shorts;
export const womensShorts = shorts;

// Combined products array for compatibility
export const products = [...shirts, ...shorts];

// Bundle configuration
export const bundles = [
  {
    id: "training-set",
    name: "RAZE Training Set",
    description: "Shirt + Shorts — designed to work together",
    bundlePrice: 69,
    originalBundlePrice: 100,
    savings: 31, // $45 + $55 = $100, bundle = $69
    savingsText: "Save $31"
  }
];

export const features = [
  {
    id: 1,
    title: "Performance Driven",
    description: "Technical fabrics selected for heat management, stretch retention, and repeated high-intensity use.",
    icon: "activity"
  },
  {
    id: 2,
    title: "Minimalist Design",
    description: "No loud graphics. No distractions. Every detail serves movement, focus, and longevity.",
    icon: "minimize-2"
  },
  {
    id: 3,
    title: "Gymnastics Heritage",
    description: "Born from gymnastics — a discipline where precision, control, and durability aren't optional.",
    icon: "target"
  },
  {
    id: 4,
    title: "Purpose-Built Fit",
    description: "Engineered patterns for overhead movement, compression, and control — not lifestyle silhouettes.",
    icon: "globe"
  }
];

export const socialLinks = {
  instagram: "https://www.instagram.com/raze_training_wear/",
  tiktok: "https://www.tiktok.com/@razetrainingwear",
  twitter: "https://x.com/razetraining",
  youtube: "https://www.youtube.com/@razetrainingwear",
  email: "support@razetraining.com"
};