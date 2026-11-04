import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/(tabs)" asChild>
            <TabButton icon="home">Home</TabButton>
          </TabTrigger>
          <TabTrigger name="products" href="/products" asChild>
            <TabButton icon="restaurant_menu">Products</TabButton>
          </TabTrigger>
          <TabTrigger name="orders" href="/orders" asChild>
            <TabButton icon="receipt_long">Orders</TabButton>
          </TabTrigger>
          <TabTrigger name="help" href="/help" asChild>
            <TabButton icon="help">Help</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, icon, ...props }: TabTriggerSlotProps & { icon: string }) {
  return (
    <Pressable {...props} accessibilityRole="tab" accessibilityState={{ selected: isFocused }} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <View style={[styles.tabIcon, isFocused && styles.tabIconSelected]}>
        <SymbolView name={{ ios: icon, android: icon, web: icon }} tintColor={isFocused ? Brand.goldDeep : Brand.muted} size={18} />
      </View>
      <Text style={[styles.tabLabel, isFocused && styles.tabLabelSelected]}>{children}</Text>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const insets = useSafeAreaInsets();

  return (
    <View {...props} style={[styles.tabListContainer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.innerContainer}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingTop: 9,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  innerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    backgroundColor: Brand.surface,
    borderColor: Brand.line,
    borderWidth: 1,
    maxWidth: 560,
    elevation: 8,
    shadowColor: '#231F19',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 },
  },
  tabButton: { flex: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center', gap: 2 },
  tabIcon: { width: 27, height: 25, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  tabIconSelected: { backgroundColor: '#F5EBD9' },
  tabLabel: { color: Brand.muted, fontSize: 10, fontWeight: '600' },
  tabLabelSelected: { color: Brand.goldDeep, fontWeight: '800' },
  pressed: { opacity: 0.68 },
});
