import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export const SplashScreen: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (data.session) {
        router.replace('/home');
      } else {
        router.replace('/auth');
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [router]);

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
