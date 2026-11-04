import type { Order } from '@/types/domain';
import { products } from './products';

const byId = (id: string) => products.find((product) => product.id === id)!;

export const orders: Order[] = [
  {
    id: 'BRK-24018', customerId: 'cus-001', status: 'Process', createdAt: 'Today, 11:42 AM', eta: 'Ready in 18 min',
    items: [byId('prd-005'), byId('prd-003'), byId('prd-001')].map((product, index) => ({ productId: product.id, name: product.name, quantity: index === 1 ? 2 : 1, unitPrice: product.price, image: product.image })),
    deliveryFee: 3, paymentMethod: 'Visa', paymentLastFour: '7495',
  },
  {
    id: 'BRK-24017', customerId: 'cus-002', status: 'Paused', createdAt: 'Today, 11:28 AM', eta: 'Waiting for confirmation',
    items: [byId('prd-001'), byId('prd-002')].map((product) => ({ productId: product.id, name: product.name, quantity: 1, unitPrice: product.price, image: product.image })),
    deliveryFee: 3, paymentMethod: 'Mastercard', paymentLastFour: '1028',
  },
  {
    id: 'BRK-24016', customerId: 'cus-003', status: 'Finished', createdAt: 'Today, 10:55 AM', eta: 'Delivered at 11:31 AM',
    items: [byId('prd-004'), byId('prd-005')].map((product) => ({ productId: product.id, name: product.name, quantity: 1, unitPrice: product.price, image: product.image })),
    deliveryFee: 4, paymentMethod: 'PayPal', paymentLastFour: '—',
  },
  {
    id: 'BRK-24015', customerId: 'cus-004', status: 'Process', createdAt: 'Today, 10:38 AM', eta: 'Ready in 9 min',
    items: [byId('prd-002'), byId('prd-003')].map((product) => ({ productId: product.id, name: product.name, quantity: 1, unitPrice: product.price, image: product.image })),
    deliveryFee: 3, paymentMethod: 'Visa', paymentLastFour: '4921',
  },
  {
    id: 'BRK-24014', customerId: 'cus-005', status: 'Finished', createdAt: 'Yesterday, 8:14 PM', eta: 'Delivered at 8:47 PM',
    items: [byId('prd-005'), byId('prd-004')].map((product) => ({ productId: product.id, name: product.name, quantity: 1, unitPrice: product.price, image: product.image })),
    deliveryFee: 3, paymentMethod: 'Visa', paymentLastFour: '3312',
  },
];
