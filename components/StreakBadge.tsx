import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  streak: number;
}

export const StreakBadge: React.FC<Props> = ({ streak }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={18} color="#FB923C" />
      <Text style={styles.text}>{streak}-day streak</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 146, 60, 0.14)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignSelf: 'flex-start',
    gap: 8,
  },
  text: {
    color: '#9A3412',
    fontWeight: '700',
  },
});
