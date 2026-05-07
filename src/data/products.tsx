import prod1 from '@/assets/images/product-1.png';
import prod2 from '@/assets/images/product-2.png';
import prod3 from '@/assets/images/product-3.png';
import col1 from '@/assets/images/collection-1.png';
import col2 from '@/assets/images/collection-2.png';
import col3 from '@/assets/images/collection-3.png';
import luxurySaree from '@/assets/images/luxury-saree.png';
import modelAvatar from '@/assets/images/model-avatar.png';

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  tag?: string;
  image: any;
  description: string;
  sizes: string[];
}

export const products: Product[] = [
  {
    id: '7',
    name: 'Golden Silk Royal Saree',
    price: 58000,
    rating: 4.9,
    reviews: 42,
    category: 'Saree',
    tag: 'Limited Edition',
    image: luxurySaree,
    description:
      'A masterpiece of textile art, this golden silk saree features hand-crafted embroidery and a shimmer that defines luxury. Perfect for the most prestigious events.',
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: '1',
    name: 'Maharani Crimson Silk Saree',
    price: 48500,
    rating: 4.9,
    reviews: 156,
    category: 'Saree',
    tag: '50% OFF',
    image: prod1,
    description:
      'Hand-woven Banarasi silk in deep crimson, adorned with 24k gold zari floral motifs. A masterpiece of traditional Indian craftsmanship.',
    sizes: ['Free Size'],
  },
  {
    id: '2',
    name: 'Vrindavan Emerald Lehenga',
    price: 89900,
    rating: 5.0,
    reviews: 112,
    category: 'Lehenga',
    tag: 'New',
    image: prod2,
    description:
      'Breathtaking forest green velvet lehenga featuring intricate peacock embroidery and hand-stitched sequins. Includes a sheer gold-bordered dupatta.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '3',
    name: 'Starry Night Fusion Gown',
    price: 65000,
    rating: 4.8,
    reviews: 89,
    category: 'Gown',
    tag: '30% OFF',
    image: prod3,
    description:
      'A contemporary floor-length gown in midnight navy silk-satin, featuring a hand-embroidered bodice and a dramatic pleated skirt.',
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: '4',
    name: 'Royal Heritage Silk Saree',
    price: 38000,
    rating: 4.7,
    reviews: 203,
    category: 'Saree',
    tag: 'LIMITED OFFER',
    image: luxurySaree,
    description:
      'A timeless heritage saree woven with pure Kanjivaram silk, embodying centuries of Indian craft. Its rich texture and vibrant palette speak of royalty.',
    sizes: ['Free Size'],
  },
  {
    id: '5',
    name: 'Desert Rose Collection Saree',
    price: 42000,
    rating: 4.9,
    reviews: 67,
    category: 'Saree',
    tag: 'Collection',
    image: col1,
    description:
      'Inspired by the hues of the Thar desert, this sand-colored silk saree features delicate rose-gold embroidery and a subtle shimmer.',
    sizes: ['Free Size'],
  },
  {
    id: '6',
    name: 'Ocean Mist Designer Lehenga',
    price: 76000,
    rating: 4.8,
    reviews: 45,
    category: 'Lehenga',
    tag: 'Designer',
    image: col2,
    description:
      'A refreshing aqua-blue lehenga with silver thread work and mirror accents. Perfect for summer weddings and seaside celebrations.',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '7',
    name: 'Midnight Bloom Gala Gown',
    price: 54000,
    rating: 4.7,
    reviews: 32,
    category: 'Gown',
    tag: 'Limited',
    image: col3,
    description:
      'A black velvet gown with hand-painted floral motifs and a structured trail. Designed for those who want to make a statement.',
    sizes: ['XS', 'S', 'M'],
  },
  {
    id: '8',
    name: 'Imperial Gold Festive Saree',
    price: 52000,
    rating: 4.9,
    reviews: 128,
    category: 'Saree',
    tag: '20% OFF',
    image: prod1, // Reusing prod1 for a variant
    description:
      'A variant of our signature crimson saree, this piece features heavier gold work on the borders, specifically for festive occasions.',
    sizes: ['Free Size'],
  },
  {
    id: '9',
    name: 'Emerald Forest Bridal Set',
    price: 95000,
    rating: 5.0,
    reviews: 18,
    category: 'Lehenga',
    tag: 'Bridal',
    image: prod2, // Reusing prod2 for a variant
    description:
      'The ultimate bridal lehenga in forest green, featuring 3D floral embroidery and thousands of hand-placed crystals.',
    sizes: ['Custom'],
  },
  {
    id: '10',
    name: 'Celestial Navy Evening Gown',
    price: 68000,
    rating: 4.8,
    reviews: 56,
    category: 'Gown',
    image: prod3, // Reusing prod3 for a variant
    description:
      'A celestial-themed navy gown with sparkling silver constellations embroidered across the skirt. Truly a work of art.',
    sizes: ['XS', 'S', 'M', 'L'],
  },
];

export const formatPrice = (price: number): string => '₹' + price.toLocaleString('en-IN');

export const categories = ['All', 'Saree', 'Lehenga', 'Gown', 'Kurta', 'Jewelry'] as const;
