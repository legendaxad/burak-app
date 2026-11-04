import type { ReactNode } from 'react';
import { ActivityIndicator, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { Brand, Fonts } from '@/constants/theme';
import type { Customer, Order, OrderStatus, Product } from '@/types/domain';

export const money = (amount: number) => `$${amount.toFixed(2)}`;

const platformIcons: Record<string, { ios: string; android: string; web: string }> = {
  plus: { ios: 'plus', android: 'add', web: 'add' },
  'arrow.left': { ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' },
  pencil: { ios: 'pencil', android: 'edit', web: 'edit' },
  'play.fill': { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' },
  checkmark: { ios: 'checkmark', android: 'check', web: 'check' },
  'checkmark.circle': { ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' },
  'fork.knife': { ios: 'fork.knife', android: 'restaurant_menu', web: 'restaurant_menu' },
  'paperplane.fill': { ios: 'paperplane.fill', android: 'send', web: 'send' },
};

function AppIcon({ name, size, color }: { name: string; size: number; color: string }) {
  return <SymbolView name={platformIcons[name] ?? { ios: name, android: name, web: name }} size={size} tintColor={color} />;
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.page}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function ScreenHeader({ title, subtitle, hero = false, action }: { title: string; subtitle: string; hero?: boolean; action?: ReactNode }) {
  const HeaderContent = (
    <View style={[styles.headerInner, hero && styles.headerInnerHero]}>
      <View style={styles.brandRow}>
        <Text style={styles.wordmark}>BURAK</Text>
        <View style={styles.headerActions}>
          {action}
          <View style={styles.openPill}><View style={styles.openDot} /><Text style={styles.openText}>OPEN</Text></View>
        </View>
      </View>
      <Text style={[styles.headerTitle, hero && styles.heroTitle]}>{title}</Text>
      <Text style={styles.headerSubtitle}>{subtitle}</Text>
      {hero && <Text style={styles.heroFootnote}>The choice, not just a choice.</Text>}
    </View>
  );

  return (
    <ImageBackground source={require('@/assets/images/burak/hero.png')} resizeMode="cover" imageStyle={styles.headerImage} style={[styles.header, hero && styles.headerHero]}>
      <View style={styles.headerShade} />
      {HeaderContent}
    </ImageBackground>
  );
}

export function IconButton({ icon, label, onPress, tintColor = Brand.gold }: { icon: string; label: string; onPress: () => void; tintColor?: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={8} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
      <AppIcon name={icon} size={19} color={tintColor} />
    </Pressable>
  );
}

export function SearchField({ value, onChangeText, placeholder = 'Search products or orders' }: { value: string; onChangeText: (value: string) => void; placeholder?: string }) {
  return (
    <View style={styles.searchField}>
      <SymbolView name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }} size={18} tintColor={Brand.muted} />
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#99948C" style={styles.searchInput} returnKeyType="search" accessibilityLabel={placeholder} />
      {value.length > 0 && <Pressable onPress={() => onChangeText('')} accessibilityRole="button" accessibilityLabel="Clear search"><Text style={styles.clearSearch}>×</Text></Pressable>}
    </View>
  );
}

export function SectionTitle({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction && <Pressable onPress={onAction} accessibilityRole="button"><Text style={styles.linkText}>{actionLabel}</Text></Pressable>}
    </View>
  );
}

export function PrimaryButton({ title, onPress, secondary = false, disabled = false, icon }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean; icon?: string }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" style={({ pressed }) => [styles.primaryButton, secondary && styles.secondaryButton, disabled && styles.disabledButton, pressed && !disabled && styles.pressed]}>
      {icon && <AppIcon name={icon} size={16} color={secondary ? Brand.text : Brand.ink} />}
      <Text style={[styles.primaryButtonText, secondary && styles.secondaryButtonText]}>{title}</Text>
    </Pressable>
  );
}

export function ChoiceChip({ label, selected, onPress, count }: { label: string; selected: boolean; onPress: () => void; count?: number }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={[styles.choiceChip, selected && styles.choiceChipSelected]}>
      <Text style={[styles.choiceChipText, selected && styles.choiceChipTextSelected]}>{label}</Text>
      {count !== undefined && <Text style={[styles.choiceCount, selected && styles.choiceChipTextSelected]}>{count}</Text>}
    </Pressable>
  );
}

export function StatusBadge({ status }: { status: OrderStatus | Product['availability'] }) {
  const colors = status === 'Finished' || status === 'Available'
    ? { bg: '#E7F1E8', fg: '#3D7955' }
    : status === 'Process' || status === 'Low stock'
      ? { bg: '#F6EBD7', fg: '#9A7139' }
      : { bg: '#F5E5E2', fg: '#A95142' };
  return <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}><Text style={[styles.statusText, { color: colors.fg }]}>{status}</Text></View>;
}

export function Surface({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export function StatCard({ label, value, icon, note, accent = false }: { label: string; value: string; icon: string; note?: string; accent?: boolean }) {
  return (
    <Surface style={styles.statCard}>
      <View style={[styles.statIcon, accent && styles.statIconAccent]}><AppIcon name={icon} size={18} color={accent ? Brand.goldDeep : Brand.charcoal} /></View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {note && <Text style={styles.statNote}>{note}</Text>}
    </Surface>
  );
}

export function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${product.name}, ${money(product.price)}, ${product.availability}`} style={({ pressed }) => [styles.productCard, pressed && styles.pressed]}>
      <Image source={product.image} style={styles.productImage} resizeMode="cover" />
      <View style={styles.productCardBody}>
        <View style={styles.productTitleRow}><Text numberOfLines={1} style={styles.productName}>{product.name}</Text><SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} size={14} tintColor={Brand.muted} /></View>
        <Text style={styles.productMeta}>{product.category} · {product.servings}</Text>
        <View style={styles.productBottomRow}><Text style={styles.productPrice}>{money(product.price)}</Text><StatusBadge status={product.availability} /></View>
      </View>
    </Pressable>
  );
}

export function OrderCard({ order, customer, onPress }: { order: Order; customer?: Customer; onPress: () => void }) {
  const total = order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) + order.deliveryFee;
  const description = order.items.map((item) => item.quantity > 1 ? `${item.name} ×${item.quantity}` : item.name).join(' · ');
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${order.id}, ${customer?.name ?? 'Customer'}, ${order.status}, ${money(total)}`} style={({ pressed }) => [styles.orderCard, pressed && styles.pressed]}>
      <View style={styles.orderTopRow}>
        <View><Text style={styles.orderNumber}>{order.id}</Text><Text style={styles.orderDate}>{order.createdAt}</Text></View>
        <StatusBadge status={order.status} />
      </View>
      <View style={styles.orderDivider} />
      <Text style={styles.orderCustomer}>{customer?.name ?? 'Customer'}</Text>
      <Text numberOfLines={1} style={styles.orderItems}>{description}</Text>
      <View style={styles.orderBottomRow}><Text style={styles.orderEta}>{order.eta}</Text><Text style={styles.orderTotal}>{money(total)}</Text></View>
    </Pressable>
  );
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <Surface style={styles.emptyState}>
      <View style={styles.emptyIcon}><SymbolView name={{ ios: 'tray', android: 'inbox', web: 'inbox' }} size={23} tintColor={Brand.goldDeep} /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {action}
    </Surface>
  );
}

export function LoadState({ error, onRetry }: { error?: string | null; onRetry?: () => void }) {
  if (!error) return <View style={styles.loading}><ActivityIndicator color={Brand.goldDeep} /><Text style={styles.loadingText}>Loading BURAK…</Text></View>;
  return <EmptyState title="Something went wrong" message={error} action={onRetry ? <PrimaryButton title="Try again" onPress={onRetry} secondary /> : undefined} />;
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Brand.canvas },
  scrollContent: { paddingBottom: 28, gap: 20 },
  header: { minHeight: 158, backgroundColor: Brand.ink, overflow: 'hidden' },
  headerHero: { minHeight: 248 },
  headerImage: { opacity: 0.76 },
  headerShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,12,11,0.56)' },
  headerInner: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 22, flex: 1, justifyContent: 'space-between' },
  headerInnerHero: { paddingTop: 16, paddingBottom: 25 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordmark: { color: Brand.gold, fontSize: 21, fontWeight: '800', letterSpacing: 1.3, fontFamily: Fonts.serif },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.12)' },
  openPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: 'rgba(255,255,255,0.12)' },
  openDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#89BD81' },
  openText: { color: '#F4EEE3', fontSize: 10, letterSpacing: 0.7, fontWeight: '700' },
  headerTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '700', marginTop: 20, fontFamily: Fonts.serif },
  heroTitle: { fontSize: 30, maxWidth: 280, marginTop: 22 },
  headerSubtitle: { color: '#E8E0D4', fontSize: 13, marginTop: 5, lineHeight: 19 },
  heroFootnote: { color: Brand.gold, fontSize: 12, marginTop: 14, letterSpacing: 0.3 },
  searchField: { minHeight: 48, backgroundColor: Brand.surface, borderColor: Brand.line, borderWidth: 1, borderRadius: 13, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 },
  searchInput: { flex: 1, color: Brand.text, fontSize: 14, paddingVertical: 10 },
  clearSearch: { color: Brand.muted, fontSize: 21, paddingHorizontal: 3 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: Brand.text, fontSize: 18, fontWeight: '700', fontFamily: Fonts.serif },
  linkText: { color: Brand.goldDeep, fontSize: 13, fontWeight: '700' },
  primaryButton: { minHeight: 46, borderRadius: 12, backgroundColor: Brand.gold, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: Brand.ink, fontSize: 14, fontWeight: '800' },
  secondaryButton: { backgroundColor: '#F4F1EB', borderWidth: 1, borderColor: Brand.line },
  secondaryButtonText: { color: Brand.text },
  disabledButton: { opacity: 0.5 },
  pressed: { opacity: 0.76 },
  choiceChip: { minHeight: 38, borderRadius: 22, paddingHorizontal: 14, backgroundColor: Brand.surface, borderWidth: 1, borderColor: Brand.line, flexDirection: 'row', alignItems: 'center', gap: 7 },
  choiceChipSelected: { backgroundColor: Brand.charcoal, borderColor: Brand.charcoal },
  choiceChipText: { color: Brand.muted, fontSize: 12, fontWeight: '600' },
  choiceChipTextSelected: { color: Brand.gold },
  choiceCount: { color: Brand.muted, fontSize: 11, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start' },
  statusText: { fontSize: 10, fontWeight: '700' },
  surface: { backgroundColor: Brand.surface, borderRadius: 16, borderWidth: 1, borderColor: '#EFEBE5', padding: 16, elevation: 2, shadowColor: '#302A20', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  statCard: { flex: 1, minWidth: 98, padding: 13, gap: 4 },
  statIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: '#F1EFEB', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  statIconAccent: { backgroundColor: '#F5EBD9' },
  statValue: { color: Brand.text, fontSize: 19, fontWeight: '800' },
  statLabel: { color: Brand.muted, fontSize: 11 },
  statNote: { color: Brand.green, fontSize: 10, fontWeight: '700', marginTop: 2 },
  productCard: { flexDirection: 'row', backgroundColor: Brand.surface, borderRadius: 16, borderWidth: 1, borderColor: '#EFEBE5', overflow: 'hidden', minHeight: 112, elevation: 1, shadowColor: '#302A20', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  productImage: { width: 103, height: 112, backgroundColor: '#E7E1D8' },
  productCardBody: { flex: 1, justifyContent: 'center', paddingHorizontal: 13, paddingVertical: 12, gap: 5 },
  productTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 },
  productName: { flex: 1, color: Brand.text, fontSize: 14, fontWeight: '700' },
  productMeta: { color: Brand.muted, fontSize: 11 },
  productBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 },
  productPrice: { color: Brand.charcoal, fontSize: 14, fontWeight: '800' },
  orderCard: { backgroundColor: Brand.surface, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#EFEBE5', elevation: 2, shadowColor: '#302A20', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, gap: 7 },
  orderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNumber: { color: Brand.charcoal, fontSize: 14, fontWeight: '800' },
  orderDate: { color: Brand.muted, fontSize: 11, marginTop: 3 },
  orderDivider: { height: 1, backgroundColor: Brand.line, marginVertical: 2 },
  orderCustomer: { color: Brand.text, fontSize: 13, fontWeight: '700' },
  orderItems: { color: Brand.muted, fontSize: 11 },
  orderBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 },
  orderEta: { color: Brand.blue, fontSize: 11, fontWeight: '600' },
  orderTotal: { color: Brand.text, fontSize: 15, fontWeight: '800' },
  emptyState: { alignItems: 'center', paddingVertical: 30, gap: 9 },
  emptyIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5EBD9' },
  emptyTitle: { color: Brand.text, fontSize: 16, fontWeight: '700' },
  emptyMessage: { color: Brand.muted, fontSize: 13, lineHeight: 19, textAlign: 'center', maxWidth: 270 },
  loading: { padding: 32, alignItems: 'center', gap: 10 },
  loadingText: { color: Brand.muted, fontSize: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 14, borderBottomWidth: 1, borderBottomColor: Brand.line, paddingVertical: 12 },
  detailLabel: { color: Brand.muted, fontSize: 13 },
  detailValue: { color: Brand.text, fontSize: 13, fontWeight: '600', textAlign: 'right', flexShrink: 1 },
});
