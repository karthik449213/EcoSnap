import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { PrimaryButton } from '@/components/PrimaryButton';
import { logEcoAction } from '@/lib/ecoActions';
import { supabase } from '@/lib/supabase';

export const PreviewScreen: React.FC = () => {
  const { photoUri } = useLocalSearchParams<{ photoUri?: string }>();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState<string>('Fetching location...');
  const fallback = require('@/assets/images/1.png');
  const source = photoUri ? { uri: photoUri } : fallback;

  useEffect(() => {
    const ensureSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/auth');
      }
    };
    ensureSession();
  }, [router]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocation('Location access denied');
          return;
        }
        const cached = await Location.getLastKnownPositionAsync();
        const position = cached || (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
        if (position?.coords) {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } else {
          setLocation('Location unavailable');
        }
      } catch (err) {
        setLocation('Location unavailable');
      }
    };
    fetchLocation();
  }, []);

  const handleConfirm = async () => {
    if (!photoUri) {
      Alert.alert('No photo found', 'Take a photo before confirming.');
      return;
    }
    setIsSaving(true);
    try {
      const { streak } = await logEcoAction(photoUri);
      router.replace(`/success?streak=${streak}`);
    } catch (err: any) {
      Alert.alert('Could not log action', err?.message || 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageWrap}>
        <Image source={source} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.locationCard}>
        <Ionicons name="location" size={18} color="#065F46" />
        <Text style={styles.locationText}>{location}</Text>
      </View>

      <View style={styles.actionArea}>
        <PrimaryButton label={isSaving ? 'Saving…' : 'Confirm Action'} onPress={handleConfirm} />
        <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#DC2626" /> : <Text style={styles.cancelText}>Cancel</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    gap: 14,
  },
  imageWrap: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  locationText: {
    color: '#065F46',
    fontWeight: '600',
    fontSize: 14,
  },
  actionArea: {
    gap: 10,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelText: {
    color: '#DC2626',
    fontWeight: '700',
  },
});
