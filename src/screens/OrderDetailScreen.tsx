import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { DetailRow, IconButton, LoadState, Page, PrimaryButton, ScreenHeader, StatusBadge, Surface } from '@/components/AppUI';
import { Brand, Fonts } from '@/constants/theme';
import { burakRepository } from '@/services/burakRepository';
import { useMockResource } from '@/hooks/use-mock-resource';
import { useRepositoryRefresh } from '@/hooks/use-repository-refresh';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useMockResource(burakRepository.getOrder, id);
  const customerData = useMockResource(burakRepository.getCustomer, order.data?.customerId);
  useRepositoryRefresh('orders', order.reload);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const customer = customerData.data;
  const total = order.data ? order.data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) + order.data.deliveryFee : 0;
  const nextAction = order.data?.status === 'Paused' ? 'Start preparing' : order.data?.status === 'Process' ? 'Mark as finished' : null;

  const advanceOrder = async () => {
    if (!order.data) return;
    setSaving(true);
    setError('');
    try {
      await burakRepository.updateOrderStatus(order.data.id, order.data.status === 'Paused' ? 'Process' : 'Finished');
      await order.reload();
    } catch {
      setError('We couldn’t update this order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <ScreenHeader title="Order details" subtitle="Order, customer, and payment information." action={<IconButton icon="arrow.left" label="Go back" onPress={() => router.back()} />} />
      <View style={styles.content}>
        {order.loading || !order.data ? <LoadState error={order.error ?? (!order.loading ? 'This order could not be found.' : null)} onRetry={order.reload} /> : <>
          <Surface style={styles.summaryCard}>
            <View style={styles.summaryTop}><View><Text style={styles.orderId}>{order.data.id}</Text><Text style={styles.date}>{order.data.createdAt}</Text></View><StatusBadge status={order.data.status} /></View>
            <View style={styles.divider} />
            <DetailRow label="Preparation" value={order.data.eta} />
            <DetailRow label="Items" value={`${order.data.items.reduce((sum, item) => sum + item.quantity, 0)} dishes`} />
            <DetailRow label="Order total" value={`$${total.toFixed(2)}`} />
          </Surface>

          <Text style={styles.sectionTitle}>Customer</Text>
          <Surface style={styles.customerCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{customer?.initials ?? 'B'}</Text></View>
            <View style={styles.customerInfo}><Text style={styles.customerName}>{customer?.name ?? 'BURAK guest'}</Text><Text style={styles.customerEmail}>{customer?.email ?? 'No email provided'}</Text><Text style={styles.customerLocation}>⌖  {customer?.location ?? 'Location not provided'}</Text></View>
          </Surface>

          <Text style={styles.sectionTitle}>Ordered items</Text>
          <Surface style={styles.itemsCard}>
            {order.data.items.map((item, index) => <View key={`${item.productId}-${index}`} style={[styles.itemRow, index > 0 && styles.itemDivider]}>
              <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
              <View style={styles.itemCopy}><Text style={styles.itemName}>{item.name}</Text><Text style={styles.itemQuantity}>Qty {item.quantity}</Text></View>
              <Text style={styles.itemPrice}>${(item.unitPrice * item.quantity).toFixed(2)}</Text>
            </View>)}
            <View style={styles.totalArea}><DetailRow label="Subtotal" value={`$${(total - order.data.deliveryFee).toFixed(2)}`} /><DetailRow label="Delivery" value={`$${order.data.deliveryFee.toFixed(2)}`} /><DetailRow label="Total paid" value={`$${total.toFixed(2)}`} /></View>
          </Surface>

          <Text style={styles.sectionTitle}>Payment</Text>
          <Surface style={styles.paymentCard}>
            <View style={styles.paymentIcon}><Text style={styles.paymentIconText}>$</Text></View>
            <View style={styles.paymentCopy}><Text style={styles.paymentName}>{order.data.paymentMethod}</Text><Text style={styles.paymentNumber}>{order.data.paymentLastFour === '—' ? 'Paid in full' : `••••  ${order.data.paymentLastFour}`}</Text></View>
            <Text style={styles.paid}>PAID</Text>
          </Surface>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {nextAction ? <PrimaryButton title={saving ? 'Updating…' : nextAction} icon={order.data.status === 'Paused' ? 'play.fill' : 'checkmark'} onPress={advanceOrder} disabled={saving} /> : <PrimaryButton title="Order complete" icon="checkmark.circle" onPress={() => router.navigate('/orders')} secondary />}
        </>}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 13 },
  summaryCard: { padding: 17 },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { color: Brand.text, fontSize: 18, fontWeight: '800' },
  date: { color: Brand.muted, fontSize: 12, marginTop: 4 },
  divider: { height: 1, backgroundColor: Brand.line, marginTop: 14 },
  sectionTitle: { color: Brand.text, fontSize: 17, fontWeight: '700', fontFamily: Fonts.serif, marginTop: 4 },
  customerCard: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  avatar: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: Brand.charcoal },
  avatarText: { color: Brand.gold, fontSize: 16, fontWeight: '800' },
  customerInfo: { flex: 1, gap: 4 },
  customerName: { color: Brand.text, fontSize: 15, fontWeight: '700' },
  customerEmail: { color: Brand.muted, fontSize: 11 },
  customerLocation: { color: Brand.muted, fontSize: 11, marginTop: 2 },
  itemsCard: { padding: 13 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 7 },
  itemDivider: { borderTopWidth: 1, borderTopColor: Brand.line },
  itemImage: { width: 48, height: 48, borderRadius: 13, backgroundColor: '#E7E1D8' },
  itemCopy: { flex: 1, gap: 4 },
  itemName: { color: Brand.text, fontSize: 13, fontWeight: '700' },
  itemQuantity: { color: Brand.muted, fontSize: 11 },
  itemPrice: { color: Brand.text, fontSize: 13, fontWeight: '700' },
  totalArea: { borderTopWidth: 1, borderTopColor: Brand.line, marginTop: 8, paddingTop: 4 },
  paymentCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5EBD9' },
  paymentIconText: { color: Brand.goldDeep, fontSize: 18, fontWeight: '800' },
  paymentCopy: { flex: 1, gap: 4 },
  paymentName: { color: Brand.text, fontSize: 13, fontWeight: '700' },
  paymentNumber: { color: Brand.muted, fontSize: 11 },
  paid: { color: Brand.green, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
  error: { color: Brand.red, fontSize: 12 },
});
