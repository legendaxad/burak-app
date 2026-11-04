import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { DetailRow, IconButton, LoadState, Page, PrimaryButton, ScreenHeader, StatusBadge, Surface } from '@/components/AppUI';
import { Brand, Fonts } from '@/constants/theme';
import { burakRepository } from '@/services/burakRepository';
import { useMockResource } from '@/hooks/use-mock-resource';
import { useRepositoryRefresh } from '@/hooks/use-repository-refresh';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useMockResource(burakRepository.getProduct, id);
  useRepositoryRefresh('products', product.reload);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const toggleAvailability = async () => {
    if (!product.data) return;
    setSaving(true);
    setSaveError('');
    try {
      const available = product.data.availability === 'Unavailable';
      await burakRepository.updateProduct({ ...product.data, availability: available ? 'Available' : 'Unavailable', stock: available ? Math.max(1, product.data.stock) : 0 });
      await product.reload();
    } catch {
      setSaveError('Could not update availability. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <ScreenHeader title="Product details" subtitle="Review this dish and its availability." action={<IconButton icon="arrow.left" label="Go back" onPress={() => router.back()} />} />
      <View style={styles.content}>
        {product.loading || !product.data ? <LoadState error={product.error ?? (!product.loading ? 'This product is no longer on the menu.' : null)} onRetry={product.reload} /> : <>
          <Image source={product.data.image} resizeMode="cover" style={styles.image} />
          <Surface style={styles.infoCard}>
            <View style={styles.titleRow}><View style={styles.titleCopy}><Text style={styles.category}>{product.data.category.toUpperCase()} · {product.data.servings}</Text><Text style={styles.name}>{product.data.name}</Text></View><StatusBadge status={product.data.availability} /></View>
            <View style={styles.rating}><Text style={styles.star}>★</Text><Text style={styles.ratingText}>{product.data.rating.toFixed(1)}</Text><Text style={styles.ratingMuted}> · Guest favorite</Text></View>
            <Text style={styles.description}>{product.data.description}</Text>
            <DetailRow label="Menu price" value={money(product.data.price)} />
            <DetailRow label="Stock on hand" value={`${product.data.stock} ${product.data.stock === 1 ? 'portion' : 'portions'}`} />
          </Surface>
          {saveError ? <Text style={styles.error}>{saveError}</Text> : null}
          <PrimaryButton title="Edit product" icon="pencil" onPress={() => router.push({ pathname: '/products/new', params: { id: product.data!.id } })} />
          <PrimaryButton title={product.data.availability === 'Unavailable' ? 'Set as available' : 'Mark unavailable'} onPress={toggleAvailability} disabled={saving} secondary />
        </>}
      </View>
    </Page>
  );
}

const money = (value: number) => `$${value.toFixed(2)}`;
const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 15 },
  image: { width: '100%', height: 230, borderRadius: 18, backgroundColor: '#E7E1D8' },
  infoCard: { padding: 18 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  titleCopy: { flex: 1 },
  category: { color: Brand.goldDeep, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  name: { color: Brand.text, fontSize: 22, fontWeight: '800', fontFamily: Fonts.serif, marginTop: 5 },
  rating: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  star: { color: Brand.goldDeep, fontSize: 14 },
  ratingText: { color: Brand.text, fontSize: 12, fontWeight: '700', marginLeft: 5 },
  ratingMuted: { color: Brand.muted, fontSize: 12 },
  description: { color: Brand.muted, fontSize: 13, lineHeight: 20, marginVertical: 14 },
  error: { color: Brand.red, fontSize: 12 },
});
