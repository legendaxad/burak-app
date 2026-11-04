/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#242321',
    background: '#F8F8FC',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#F1E4D0',
    textSecondary: '#77736D',
  },
  dark: {
    text: '#FFFFFF',
    background: '#191817',
    backgroundElement: '#282624',
    backgroundSelected: '#39332B',
    textSecondary: '#BEB8AE',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Brand = {
  ink: '#171615',
  charcoal: '#343434',
  gold: '#D7B77E',
  goldDeep: '#B78C4D',
  canvas: '#F8F8FC',
  surface: '#FFFFFF',
  text: '#292724',
  muted: '#817D76',
  line: '#E8E5DF',
  green: '#3D7955',
  red: '#A95142',
  blue: '#407DAB',
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 720;
