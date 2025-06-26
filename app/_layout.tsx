import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from '../data/Database';
import { TransactionProvider } from '../context/TransactionContext';
import { DatabaseProvider } from '../context/DatabaseProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { LightTheme: NavigationLightTheme, DarkTheme: NavigationDarkTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
    reactNavigationDark: DarkTheme,
  });

  const CombinedDefaultTheme = {
    ...NavigationLightTheme,
    ...MD3LightTheme,
    colors: {
      ...NavigationLightTheme.colors,
      ...MD3LightTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...NavigationDarkTheme,
    ...MD3DarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...MD3DarkTheme.colors,
    },
  };

  const theme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

    // ✅ Initialize DB when app starts
    useEffect(() => {
      const setupDb = async () => {
        try {
          await initDatabase();
          console.log('✅ Database initialized');
        } catch (err) {
          console.error('❌ Database initialization failed:', err);
        }
      };
  
      setupDb();
    }, []);
  

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={theme}>
        <StatusBar style="auto" /> 
        <DatabaseProvider>
          <TransactionProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </TransactionProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
