import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  style?: ViewStyle;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const InfoCard: React.FC<Props> = ({ title, value, subtitle, style, iconName = 'leaf' }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.iconWrap}>
        <Ionicons name={iconName} size={22} color="#0F5132" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    width: '48%',
  },
  iconWrap: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 8,
    alignSelf: 'flex-start',
  },
  title: {
    marginTop: 12,
    color: '#065F46',
    fontWeight: '700',
    fontSize: 14,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B4F2C',
    marginTop: 4,
  },
  subtitle: {
    marginTop: 6,
    color: '#4B5563',
    fontSize: 12,
  },
});
