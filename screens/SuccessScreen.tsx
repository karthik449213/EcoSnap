import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RareDropModal } from '@/components/RareDropModal';
import { LinearGradient } from 'expo-linear-gradient';
import { RareDrop } from '@/lib/services/rewardEngine';

export const SuccessScreen: React.FC = () => {
  const { streak, rarity } = useLocalSearchParams<{ streak?: string; rarity?: string }>();
  const router = useRouter();
  const currentStreak = Number(streak) || 6;
  const [rareDrop, setRareDrop] = useState<RareDrop | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (rarity) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rarity));
        setRareDrop(parsed);
        setShowModal(true);
      } catch {}
    }
  }, [rarity]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <LinearGradient colors={["#E9F7EF", "#E0F2FE"]} style={styles.container}>
      <RareDropModal drop={rareDrop} visible={showModal} onClose={handleModalClose} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="checkmark" size={46} color="#065F46" />
          </View>
          <Text style={styles.title}>Action logged!</Text>
          <Text style={styles.subtitle}>Your streak just hit {currentStreak} days. Keep the momentum.</Text>
          {rareDrop && (
            <View style={styles.rarityInfo}>
              <Text style={styles.rarityLabel}>
                {rareDrop.tier === 'legendary' && '👑 Legendary Drop!'}
                {rareDrop.tier === 'epic' && '🌟 Epic Drop!'}
                {rareDrop.tier === 'rare' && '⭐ Rare Find!'}
              </Text>
            </View>
          )}
          <PrimaryButton label="Back to Home" onPress={() => router.replace('/home')} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 18,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  iconWrap: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#BBF7D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#065F46',
  },
  subtitle: {
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 20,
  },
  rarityInfo: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  rarityLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B45309',
  },
});
