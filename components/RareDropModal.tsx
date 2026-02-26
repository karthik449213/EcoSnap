import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { RareDrop } from '@/lib/services/rewardEngine';

interface RareDropModalProps {
  drop: RareDrop | null;
  visible: boolean;
  onClose: () => void;
}

export const RareDropModal: React.FC<RareDropModalProps> = ({ drop, visible, onClose }) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && drop) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onClose());
    }
  }, [visible, drop]);

  if (!visible || !drop) return null;

  const rarityColors: Record<string, string> = {
    common: '#94A3B8',
    rare: '#3B82F6',
    epic: '#A855F7',
    legendary: '#FBBF24',
  };

  const rarityLabels: Record<string, string> = {
    common: '✨ Common',
    rare: '⭐ Rare',
    epic: '🌟 Epic',
    legendary: '👑 Legendary',
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.modal,
          {
            backgroundColor: rarityColors[drop.tier],
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.rarityText}>{rarityLabels[drop.tier]}</Text>
        <Text style={styles.typeText}>
          {drop.type === 'badge' && '🏅 Badge Earned!'}
          {drop.type === 'token' && '⚡ Streak Token!'}
          {drop.type === 'frame' && '🎨 Animated Frame!'}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  modal: {
    paddingHorizontal: 32,
    paddingVertical: 28,
    borderRadius: 20,
    alignItems: 'center',
  },
  rarityText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
