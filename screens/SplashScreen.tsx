import { useDemoAuth } from '@/lib/demoAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export const SplashScreen: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useDemoAuth();

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      console.log('[SplashScreen] Checking authentication...');
      
      // Simulate splash delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!isMounted) return;
      
      if (isAuthenticated) {
        console.log('[SplashScreen] User authenticated, redirecting to /home');
        router.replace('/home');
      } else {
        console.log('[SplashScreen] Not authenticated, redirecting to /welcome');
        router.replace('/welcome');
      }
    };
    
    load();
    return () => {
      isMounted = false;
    };
  }, [router, isAuthenticated]);

  return (
    <LinearGradient colors={["#E9F7EF", "#E0F2FE"]} style={styles.container}>
      <View style={styles.logoWrap}>
        <Image source={require('@/assets/images/EcoSnap.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>EcoSnap</Text>
        <Text style={styles.subtitle}>Snap eco actions. Keep the streak.</Text>
      </View>
      <ActivityIndicator size="small" color="#047857" />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 14,
  },
  logo: {
    width: 160,
    height: 160,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#065F46',
  },
  subtitle: {
    color: '#14532D',
    opacity: 0.8,
  },
});
