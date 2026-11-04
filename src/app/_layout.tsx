import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Brand } from '@/constants/theme';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Brand.canvas } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="products/new" />
          <Stack.Screen name="products/[id]" />
          <Stack.Screen name="orders/[id]" />
        </Stack>
      </>
    </ThemeProvider>
  );
}
