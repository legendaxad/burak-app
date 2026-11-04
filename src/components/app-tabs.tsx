import { NativeTabs } from 'expo-router/native-tabs';
import { Brand } from '@/constants/theme';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={Brand.surface}
      tintColor={Brand.goldDeep}
      iconColor={Brand.muted}
      selectedIconColor={Brand.goldDeep}
      indicatorColor="#F5EBD9"
      labelStyle={{ default: { color: Brand.muted, fontSize: 10 }, selected: { color: Brand.goldDeep, fontWeight: '700', fontSize: 10 } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="products">
        <NativeTabs.Trigger.Label>Products</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="fork.knife" md="restaurant_menu" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="receipt" md="receipt_long" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="help">
        <NativeTabs.Trigger.Label>Help</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="questionmark.circle" md="help" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
