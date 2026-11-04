import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState, LoadState, money, OrderCard, Page, PrimaryButton, ScreenHeader, SectionTitle, StatCard, Surface } from '@/components/AppUI';
import { burakRepository } from '@/services/burakRepository';
import { Brand } from '@/constants/theme';
import { useMockResource } from '@/hooks/use-mock-resource';
import { useRepositoryRefresh } from '@/hooks/use-repository-refresh';

export default function HomeScreen() {
  const stats = useMockResource(burakRepository.getDashboard);
  const orders = useMockResource(burakRepository.getOrders);
  const customerData = useMockResource(burakRepository.getCustomers);
  useRepositoryRefresh('orders', orders.reload);
  const recentOrders = useMemo(() => orders.data?.slice(0, 3) ?? [], [orders.data]);

  return (
    <Page>
      <ScreenHeader hero title="Good afternoon, Burak" subtitle="Here’s how your restaurant is doing today." />
      <View style={styles.content}>
        <SectionTitle title="Today at a glance" />
        {stats.loading || !stats.data ? <LoadState error={stats.error} onRetry={stats.reload} /> : (
          <View style={styles.statGrid}>
            <StatCard label="Total orders" value={stats.data.totalOrders.toLocaleString()} icon="receipt" note="Across all time" />
            <StatCard label="Pending" value={String(stats.data.pendingOrders).padStart(2, '0')} icon="hourglass" note="Need attention" accent />
            <StatCard label="Completed" value={stats.data.completedOrders.toLocaleString()} icon="checkmark.circle" note="Successful orders" />
          </View>
        )}

        {stats.data && <Surface style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <View><Text style={styles.cardEyebrow}>REVENUE OVERVIEW</Text><Text style={styles.revenueValue}>{money(stats.data.revenueThisMonth)}</Text></View>
            <View style={styles.growthPill}><Text style={styles.growthText}>↗ {stats.data.revenueChangePercent}%</Text></View>
          </View>
          <Text style={styles.revenueCaption}>This month · compared to last month</Text>
          <View style={styles.chart}>
            {stats.data.revenueByDay.map((day, index) => <View key={`${day.label}-${index}`} style={styles.chartColumn}>
              <View style={styles.barTrack}><View style={[styles.bar, { height: `${day.amount}%`, backgroundColor: index === 5 ? Brand.goldDeep : '#E7D7BC' }]} /></View>
              <Text style={styles.chartLabel}>{day.label}</Text>
            </View>)}
          </View>
        </Surface>}

        <View style={styles.quickNav}>
          <Pressable onPress={() => router.navigate('/products')} style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]} accessibilityRole="button">
            <View style={styles.quickIcon}><Text style={styles.quickIconText}>＋</Text></View><View style={styles.quickCopy}><Text style={styles.quickTitle}>Manage menu</Text><Text style={styles.quickHint}>See products and stock</Text></View><Text style={styles.arrow}>›</Text>
          </Pressable>
          <Pressable onPress={() => router.navigate('/orders')} style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]} accessibilityRole="button">
            <View style={[styles.quickIcon, styles.quickIconDark]}><Text style={styles.quickIconText}>↗</Text></View><View style={styles.quickCopy}><Text style={styles.quickTitle}>View orders</Text><Text style={styles.quickHint}>{stats.data?.pendingOrders ?? 12} orders need attention</Text></View><Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>

        <SectionTitle title="Recent orders" actionLabel="See all" onAction={() => router.navigate('/orders')} />
        {orders.loading || !orders.data ? <LoadState error={orders.error} onRetry={orders.reload} /> : recentOrders.length ? recentOrders.map((order) => (
          <OrderCard key={order.id} order={order} customer={customerData.data?.find((customer) => customer.id === order.customerId)} onPress={() => router.push(`/orders/${order.id}`)} />
        )) : <EmptyState title="No orders yet" message="New orders will show here as soon as customers place them." />}

        <PrimaryButton title="Browse the menu" onPress={() => router.navigate('/products')} secondary icon="fork.knife" />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 16 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  revenueCard: { padding: 18, gap: 7 },
  revenueHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardEyebrow: { color: Brand.muted, letterSpacing: 1, fontSize: 9, fontWeight: '800' },
  revenueValue: { color: Brand.text, fontSize: 26, fontWeight: '800', marginTop: 4 },
  growthPill: { borderRadius: 18, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: '#E7F1E8' },
  growthText: { color: Brand.green, fontSize: 11, fontWeight: '700' },
  revenueCaption: { color: Brand.muted, fontSize: 11 },
  chart: { height: 96, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginTop: 8, gap: 8 },
  chartColumn: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end', gap: 5 },
  barTrack: { width: '100%', height: 72, justifyContent: 'flex-end', overflow: 'hidden', borderRadius: 8, backgroundColor: '#F7F4EF' },
  bar: { width: '100%', borderRadius: 8, minHeight: 8 },
  chartLabel: { color: Brand.muted, fontSize: 10 },
  quickNav: { flexDirection: 'row', gap: 10 },
  quickAction: { flex: 1, minHeight: 94, borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: Brand.surface, borderWidth: 1, borderColor: '#EFEBE5' },
  quickIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5EBD9' },
  quickIconDark: { backgroundColor: '#E7ECE8' },
  quickIconText: { color: Brand.charcoal, fontSize: 18, fontWeight: '700' },
  quickCopy: { flex: 1, minWidth: 0, gap: 4 },
  quickTitle: { color: Brand.text, fontSize: 12, fontWeight: '700' },
  quickHint: { color: Brand.muted, fontSize: 10, lineHeight: 14 },
  arrow: { color: Brand.muted, fontSize: 20 },
  pressed: { opacity: 0.75 },
});
