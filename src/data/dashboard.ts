import type { DashboardStatistics } from '@/types/domain';

export const dashboardStatistics: DashboardStatistics = {
  totalOrders: 1284,
  pendingOrders: 12,
  completedOrders: 1272,
  revenueThisMonth: 18450,
  revenueChangePercent: 12.8,
  revenueByDay: [
    { label: 'M', amount: 42 }, { label: 'T', amount: 66 }, { label: 'W', amount: 52 },
    { label: 'T', amount: 82 }, { label: 'F', amount: 61 }, { label: 'S', amount: 100 }, { label: 'S', amount: 74 },
  ],
};
