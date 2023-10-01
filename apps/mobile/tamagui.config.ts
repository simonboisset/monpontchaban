import { createAnimations } from '@tamagui/animations-react-native';
import { createInterFont } from '@tamagui/font-inter';
import { createMedia } from '@tamagui/react-native-media-driver';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';
import { createTamagui } from 'tamagui';

const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.3,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 10,
    mass: 1,
    stiffness: 500,
  },
  slow: {
    type: 'timing',
    damping: 10,
    mass: 1.2,
    stiffness: 100,
  },
  pulse: {
    type: 'timing',
    damping: 10,
    mass: 1.2,
    duration: 1000,
    stiffness: 100,
  },
  fade: {
    type: 'timing',
    damping: 10,
    mass: 1.2,
    duration: 500,
    stiffness: 100,
  },
});
const darkTheme = {
  ...themes.dark,
  background: 'hsl(0, 0%, 100%)',
  backgroundTransparent: 'hsla(0, 0%, 100%, 0.1)',
  foreground: 'hsl(240, 10%, 3.9%)',
  foregroundTransparent: 'hsla(240, 10%, 3.9%, 0.5)',
  primary: 'hsl(165, 15%, 58%)',
  primaryTransparent: 'hsla(165, 15%, 58%, 0.1)',
  primaryForeground: 'hsl(175, 11%, 19%)',
  primaryForegroundTransparent: 'hsla(175, 11%, 19%, 0.5)',
  success: 'hsl(165, 15%, 58%)',
  successTransparent: 'hsla(165, 15%, 58%, 0.1)',
  successForeground: 'hsl(175, 11%, 19%)',
  successForegroundTransparent: 'hsla(175, 11%, 19%, 0.5)',
  warning: 'hsl(37, 89%, 67%)',
  warningTransparent: 'hsla(37, 89%, 67%, 0.1)',
  warningForeground: 'hsl(22, 69%, 28%)',
  warningForegroundTransparent: 'hsla(22, 69%, 28%, 0.5)',
  error: 'hsl(1, 83%, 82%)',
  errorTransparent: 'hsla(1, 83%, 82%, 0.1)',
  errorForeground: 'hsl(1, 56%, 31%)',
  errorForegroundTransparent: 'hsla(1, 56%, 31%, 0.5)',
};
const lightTheme = {
  ...themes.light,
  background: 'hsl(240, 10%, 3.9%)',
  backgroundTransparent: 'hsla(240, 10%, 3.9%, 0.1)',
  foreground: 'hsl(0, 0%, 98%)',
  foregroundTransparent: 'hsla(0, 0%, 98%, 0.5)',
  primary: 'hsl(169, 16%, 26%)',
  primaryTransparent: 'hsla(169, 16%, 26%, 0.1)',
  primaryForeground: 'hsl(161, 17%, 78%)',
  primaryForegroundTransparent: 'hsla(161, 17%, 78%, 0.5)',
  success: 'hsl(169, 16%, 26%)',
  successTransparent: 'hsla(169, 16%, 26%, 0.1)',
  successForeground: 'hsl(161, 17%, 78%)',
  successForegroundTransparent: 'hsla(161, 17%, 78%, 0.5)',
  warning: 'hsl(22, 72%, 34%)',
  warningTransparent: 'hsla(22, 72%, 34%, 0.1)',
  warningForeground: 'hsl(34, 88%, 61%)',
  warningForegroundTransparent: 'hsla(34, 88%, 61%, 0.5)',
  error: 'hsl(1, 62%, 35%)',
  errorTransparent: 'hsla(1, 62%, 35%, 0.1)',
  errorForeground: 'hsl(1, 83%, 82%)',
  errorForegroundTransparent: 'hsla(1, 83%, 82%, 0.5)',
};
const headingFont = createInterFont({
  family: 'InterBold',
});
const bodyFont = createInterFont({
  family: 'Inter',
});
const config = createTamagui({
  animations,
  defaultTheme: 'dark',
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    dark: darkTheme,
    light: lightTheme,
    dark_success: {
      ...darkTheme,
      primary: 'hsl(165, 15%, 58%)',
      primaryForeground: 'hsl(175, 11%, 19%)',
    },
    dark_warning: {
      ...darkTheme,
      primary: 'hsl(37, 89%, 67%)',
      primaryForeground: 'hsl(22, 69%, 28%)',
    },
    dark_error: {
      ...darkTheme,
      primary: 'hsl(1, 83%, 82%)',
      primaryForeground: 'hsl(1, 56%, 31%)',
    },
    light_success: {
      ...lightTheme,
      primary: 'hsl(169, 16%, 26%)',
      primaryForeground: 'hsl(161, 17%, 78%)',
    },
    light_warning: {
      ...lightTheme,
      primary: 'hsl(22, 72%, 34%)',
      primaryForeground: 'hsl(34, 88%, 61%)',
    },
    light_error: {
      ...lightTheme,
      primary: 'hsl(1, 62%, 35%)',
      primaryForeground: 'hsl(1, 83%, 82%)',
    },
  },
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
});

export type AppConfig = typeof config;
declare module 'tamagui' {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}
export default config;
