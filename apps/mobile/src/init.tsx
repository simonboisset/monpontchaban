import { useFonts } from 'expo-font';

export const FontProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontsLoaded] = useFonts({
    Roboto: require('../assets/fonts/Roboto-Regular.ttf'),
    RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <>{children}</>;
};
