import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: { fontWeight: '800', color: '#065F46' },
        headerTintColor: '#065F46',
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ title: 'EcoSnap' }} />
      <Stack.Screen name="camera" options={{ title: 'Snap Action', headerTransparent: true, headerTintColor: '#F8FAFC', headerTitle: '' }} />
      <Stack.Screen name="preview" options={{ title: 'Preview' }} />
      <Stack.Screen name="success" options={{ headerShown: false }} />
    </Stack>
  );
}
