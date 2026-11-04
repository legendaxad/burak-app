import type { ImageSourcePropType } from 'react-native';

export type ProductCategory = 'Mains' | 'Soups' | 'Pasta' | 'Rice' | 'Desserts';
export type ProductAvailability = 'Available' | 'Low stock' | 'Unavailable';
export type OrderStatus = 'Paused' | 'Process' | 'Finished';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  image: ImageSourcePropType;
  availability: ProductAvailability;
  stock: number;
  rating: number;
  servings: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  initials: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  image: ImageSourcePropType;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  createdAt: string;
  eta: string;
  items: OrderItem[];
  deliveryFee: number;
  paymentMethod: string;
  paymentLastFour: string;
}

export interface DashboardStatistics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  revenueThisMonth: number;
  revenueChangePercent: number;
  revenueByDay: { label: string; amount: number }[];
}
