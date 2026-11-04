import type { Product } from '@/types/domain';

export const products: Product[] = [
  {
    id: 'prd-001', name: 'Korean Spicy Soup', description: 'A warming broth with crisp greens, chili oil, and fragrant herbs.',
    category: 'Soups', price: 15, image: require('@/assets/images/burak/korean-soup.png'), availability: 'Available', stock: 24, rating: 4.9, servings: '1 bowl',
  },
  {
    id: 'prd-002', name: 'Vegetarian Soup', description: 'Seasonal vegetables, garden herbs, and a light house broth.',
    category: 'Soups', price: 13, image: require('@/assets/images/burak/vegetarian-soup.png'), availability: 'Low stock', stock: 6, rating: 4.7, servings: '1 bowl',
  },
  {
    id: 'prd-003', name: 'Salmon Pasta', description: 'Fresh salmon and silky pasta finished with a lemon cream sauce.',
    category: 'Pasta', price: 22, image: require('@/assets/images/burak/salmon-pasta.png'), availability: 'Available', stock: 18, rating: 4.8, servings: '1 plate',
  },
  {
    id: 'prd-004', name: 'Kebuli Rice', description: 'Spiced basmati rice served with roasted vegetables and herbs.',
    category: 'Rice', price: 18, image: require('@/assets/images/burak/kebuli-rice.png'), availability: 'Available', stock: 15, rating: 4.6, servings: '1 plate',
  },
  {
    id: 'prd-005', name: 'FR Kebab', description: 'Tender grilled kebab with a side of fragrant rice.',
    category: 'Mains', price: 25, image: require('@/assets/images/burak/fr-kebab.jpg'), availability: 'Available', stock: 12, rating: 4.8, servings: '10 pc',
  },
  {
    id: 'prd-006', name: 'Turkish Cutlet', description: 'Char-grilled cutlet seasoned with the restaurant spice blend.',
    category: 'Mains', price: 21, image: require('@/assets/images/burak/fr-kebab.jpg'), availability: 'Unavailable', stock: 0, rating: 4.5, servings: '1 plate',
  },
  {
    id: 'prd-007', name: 'Honey Baklava', description: 'Flaky pastry layered with pistachio and house-made syrup.',
    category: 'Desserts', price: 12, image: require('@/assets/images/burak/kebuli-rice.png'), availability: 'Low stock', stock: 4, rating: 4.9, servings: '3 pieces',
  },
];
