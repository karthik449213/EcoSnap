import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { getCircles } from '@/lib/services/circleEngine';
import { Circle } from '@/lib/models';
import { useRouter } from 'expo-router';

export default function CirclesPage() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const data = await getCircles();
      setCircles(data);
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Eco Circles</Text>
      <FlatList
        data={circles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/circle/${item.id}`)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Total Points: {item.totalPoints}</Text>
            <Text>Rank: {item.weeklyRank}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No circles yet.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
});