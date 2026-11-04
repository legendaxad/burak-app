import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import { ChoiceChip, IconButton, LoadState, Page, PrimaryButton, ScreenHeader, Surface } from '@/components/AppUI';
import { Brand } from '@/constants/theme';
import { burakRepository } from '@/services/burakRepository';
import { useMockResource } from '@/hooks/use-mock-resource';
import type { ProductCategory } from '@/types/domain';

const categories: ProductCategory[] = ['Mains', 'Soups', 'Pasta', 'Rice', 'Desserts'];
const categoryImages: Record<ProductCategory, ImageSourcePropType> = {
  Mains: require('@/assets/images/burak/fr-kebab.jpg'),
  Soups: require('@/assets/images/burak/korean-soup.png'),
  Pasta: require('@/assets/images/burak/salmon-pasta.png'),
  Rice: require('@/assets/images/burak/kebuli-rice.png'),
  Desserts: require('@/assets/images/burak/kebuli-rice.png'),
};

export default function ProductEditorScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useMockResource(burakRepository.getProduct, id);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState<ProductCategory>('Mains');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const previewImage = existing.data?.image ?? categoryImages[category];

  useEffect(() => {
    if (!existing.data) return;
    setName(existing.data.name);
    setDescription(existing.data.description);
    setPrice(String(existing.data.price));
    setStock(String(existing.data.stock));
    setCategory(existing.data.category);
  }, [existing.data]);

  const save = async () => {
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    if (!name.trim() || !description.trim() || !price.trim() || !stock.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0 || !Number.isInteger(numericStock) || numericStock < 0) {
      setError('Add a name, description, valid price, and whole-number stock quantity.');
      return;
    }
    setSaving(true);
    setError('');
    const availability = numericStock === 0 ? 'Unavailable' as const : numericStock < 7 ? 'Low stock' as const : 'Available' as const;
    const fields = { name: name.trim(), description: description.trim(), price: numericPrice, stock: numericStock, category, availability };
    try {
      if (existing.data) {
        await burakRepository.updateProduct({ ...existing.data, ...fields });
      } else {
        await burakRepository.createProduct({ ...fields, image: previewImage, rating: 4.8, servings: '1 plate' });
      }
      router.replace('/products');
    } catch {
      setError('We couldn’t save this product. Please try again.');
      setSaving(false);
    }
  };

  return (
    <Page>
      <ScreenHeader title={id ? 'Edit product' : 'New product'} subtitle="Keep your menu clear and up to date." action={<IconButton icon="arrow.left" label="Go back" onPress={() => router.back()} />} />
      <View style={styles.content}>
        {id && (existing.loading || !existing.data) ? <LoadState error={existing.error ?? (!existing.loading ? 'This product could not be found.' : null)} onRetry={existing.reload} /> : <>
          <Surface style={styles.form}>
            <View style={styles.photoRow}>
              <Image source={previewImage} resizeMode="cover" style={styles.photoPreview} />
              <View style={styles.photoCopy}><Text style={styles.label}>Menu photo</Text><Text style={styles.photoHint}>Preview updates with your selected category.</Text></View>
            </View>
            <Field label="Product name" value={name} onChangeText={setName} placeholder="e.g. Turkish breakfast" />
            <Field label="Description" value={description} onChangeText={setDescription} placeholder="A short description for your team" multiline />
            <View style={styles.fieldRow}>
              <Field label="Price (USD)" value={price} onChangeText={setPrice} placeholder="0.00" keyboardType="decimal-pad" />
              <Field label="Stock" value={stock} onChangeText={setStock} placeholder="0" keyboardType="number-pad" />
            </View>
            <View style={styles.categorySection}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
                {categories.map((item) => <ChoiceChip key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />)}
              </ScrollView>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </Surface>
          <PrimaryButton title={saving ? 'Saving…' : 'Save product'} onPress={save} disabled={saving} />
        </>}
      </View>
    </Page>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType, multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: 'decimal-pad' | 'number-pad'; multiline?: boolean }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#99948C" keyboardType={keyboardType} multiline={multiline} textAlignVertical={multiline ? 'top' : 'center'} style={[styles.input, multiline && styles.multiline]} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 16 },
  form: { padding: 17, gap: 16 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Brand.line },
  photoPreview: { width: 68, height: 68, borderRadius: 15, backgroundColor: '#E7E1D8' },
  photoCopy: { flex: 1, gap: 5 },
  photoHint: { color: Brand.muted, fontSize: 11, lineHeight: 16 },
  field: { flex: 1, gap: 7 },
  label: { color: Brand.text, fontSize: 12, fontWeight: '700' },
  input: { minHeight: 46, borderWidth: 1, borderColor: Brand.line, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 10, color: Brand.text, fontSize: 14, backgroundColor: '#FCFBF9' },
  multiline: { minHeight: 92, paddingTop: 12 },
  fieldRow: { flexDirection: 'row', gap: 12 },
  categorySection: { gap: 9 },
  categories: { gap: 8 },
  error: { color: Brand.red, fontSize: 12, lineHeight: 18 },
});
