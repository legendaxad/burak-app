import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ChoiceChip, EmptyState, LoadState, OrderCard, Page, ScreenHeader, SearchField, SectionTitle } from '@/components/AppUI';
import { burakRepository } from '@/services/burakRepository';
import { useMockResource } from '@/hooks/use-mock-resource';
import { useRepositoryRefresh } from '@/hooks/use-repository-refresh';
import type { OrderStatus } from '@/types/domain';

const filters: ('All' | OrderStatus)[] = ['All', 'Paused', 'Process', 'Finished'];

export default function OrdersScreen() {
  const orders = useMockResource(burakRepository.getOrders);
  const customerData = useMockResource(burakRepository.getCustomers);
  useRepositoryRefresh('orders', orders.reload);
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [query, setQuery] = useState('');
  const counts = useMemo(() => ({
    All: orders.data?.length ?? 0,
    Paused: orders.data?.filter((order) => order.status === 'Paused').length ?? 0,
    Process: orders.data?.filter((order) => order.status === 'Process').length ?? 0,
    Finished: orders.data?.filter((order) => order.status === 'Finished').length ?? 0,
  }), [orders.data]);
  const filtered = useMemo(() => orders.data?.filter((order) => {
    const customer = customerData.data?.find((person) => person.id === order.customerId);
    const matchesFilter = filter === 'All' || order.status === filter;
    const matchesSearch = `${order.id} ${customer?.name ?? ''} ${order.items.map((item) => item.name).join(' ')}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesSearch;
  }) ?? [], [customerData.data, filter, orders.data, query]);

  return (
    <Page>
      <ScreenHeader title="Orders" subtitle="Keep each order moving, one step at a time." />
      <View style={styles.content}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search by order or customer" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((item) => <ChoiceChip key={item} label={item} count={counts[item]} selected={filter === item} onPress={() => setFilter(item)} />)}
        </ScrollView>
        <SectionTitle title={filter === 'All' ? 'All orders' : `${filter} orders`} actionLabel={orders.data ? `${filtered.length} shown` : undefined} />
        {orders.loading || !orders.data ? <LoadState error={orders.error} onRetry={orders.reload} /> : filtered.length ? filtered.map((order) => (
          <OrderCard key={order.id} order={order} customer={customerData.data?.find((customer) => customer.id === order.customerId)} onPress={() => router.push(`/orders/${order.id}`)} />
        )) : <EmptyState title="No orders found" message="There are no orders matching this view. Try a different status or search." />}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({ content: { paddingHorizontal: 20, gap: 14 }, filters: { gap: 8, paddingRight: 4 }, });
