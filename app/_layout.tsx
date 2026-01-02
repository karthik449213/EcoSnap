import '@/lib/devConfig';
import { DemoAuthProvider } from '@/lib/demoAuth';
import { Stack } from "expo-router";
import { ActivityIndicator, View } from 'react-native';
import { useState, useEffect } from 'react';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('═══════════════════════════════════════');
    console.log('🌱 EcoSnap App Started (Demo Mode)');
    console.log('═══════════════════════════════════════');
    setIsReady(true);
  }, []);

  // Block rendering until app is ready
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#065F46" />
      </View>
    );
  }

  return (
    <DemoAuthProvider>
      <Stack
        screenOptions={{
          headerTitleStyle: { fontWeight: '800', color: '#065F46' },
          headerTintColor: '#065F46',
          contentStyle: { backgroundColor: '#F8FAFC' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="demoLogin" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'EcoSnap' }} />
        <Stack.Screen name="map" options={{ headerShown: false }} />
        <Stack.Screen name="achievements" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ title: 'Snap Action', headerTransparent: true, headerTintColor: '#F8FAFC', headerTitle: '' }} />
        <Stack.Screen name="preview" options={{ title: 'Preview' }} />
        <Stack.Screen name="success" options={{ headerShown: false }} />
      </Stack>
    </DemoAuthProvider>
  );
}
