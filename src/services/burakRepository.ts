import type { Order, OrderStatus, Product } from '@/types/domain';
import { customers } from '@/data/customers';
import { dashboardStatistics } from '@/data/dashboard';
import { orders } from '@/data/orders';
import { products } from '@/data/products';

// This is the single local data boundary. Replace these methods with API calls when
// the BURAK backend is ready; screens should continue to consume the same models.
let productStore = [...products];
let orderStore = [...orders];
type Collection = 'products' | 'orders';
const listeners: Record<Collection, Set<() => void>> = { products: new Set(), orders: new Set() };
const notify = (collection: Collection) => listeners[collection].forEach((listener) => listener());

const settle = async <T,>(value: T): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return value;
};

export const burakRepository = {
  getProducts: () => settle([...productStore]),
  subscribe: (collection: Collection, listener: () => void) => {
    listeners[collection].add(listener);
    return () => { listeners[collection].delete(listener); };
  },
  getProduct: async (id?: string) => settle(productStore.find((product) => product.id === id) ?? null),
  createProduct: async (values: Omit<Product, 'id'>) => {
    const product: Product = { ...values, id: `prd-${String(productStore.length + 1).padStart(3, '0')}` };
    productStore = [product, ...productStore];
    notify('products');
    return settle(product);
  },
  updateProduct: async (product: Product) => {
    productStore = productStore.map((item) => item.id === product.id ? product : item);
    notify('products');
    return settle(product);
  },
  getOrders: () => settle([...orderStore]),
  getOrder: async (id?: string) => settle(orderStore.find((order) => order.id === id) ?? null),
  updateOrderStatus: async (id: string, status: OrderStatus) => {
    orderStore = orderStore.map((order) => order.id === id ? { ...order, status } : order);
    notify('orders');
    return settle(orderStore.find((order) => order.id === id) ?? null);
  },
  getCustomers: () => settle([...customers]),
  getCustomer: async (id?: string) => settle(customers.find((customer) => customer.id === id) ?? null),
  getDashboard: () => settle(dashboardStatistics),
};
