import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { useApp } from '@/lib/appContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// store key for global impact
const GLOBAL_IMPACT_KEY = 'global_impact';

export const CommunityImpactScreen: React.FC = () => {
  const { user } = useApp();
  const [globalImpact, setGlobalImpact] = useState({ plasticSaved: 0, co2Reduced: 0, wasteDiverted: 0 });

  useEffect(() => {
    const load = async () => {
      const w = await AsyncStorage.getItem(GLOBAL_IMPACT_KEY);
      if (w) {
        try {
          setGlobalImpact(JSON.parse(w));
        } catch {}
      }
    };
    load();
  }, []);

  // when user impact changes, also bump global (for demo)
  useEffect(() => {
    const store = async () => {
      const current = globalImpact;
      const updated = {
        plasticSaved: current.plasticSaved + user.impactStats.plasticSaved,
        co2Reduced: current.co2Reduced + user.impactStats.co2Reduced,
        wasteDiverted: current.wasteDiverted + user.impactStats.wasteDiverted,
      };
      await AsyncStorage.setItem(GLOBAL_IMPACT_KEY, JSON.stringify(updated));
      setGlobalImpact(updated);
    };
    store();
  }, [user.impactStats]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Impact</Text>
      <View style={styles.statRow}>
        <Text>Plastic saved:</Text>
        <Text>{user.impactStats.plasticSaved.toFixed(1)} kg</Text>
      </View>
      <View style={styles.statRow}>
        <Text>CO₂ reduced:</Text>
        <Text>{user.impactStats.co2Reduced.toFixed(1)} kg</Text>
      </View>
      <View style={styles.statRow}>
        <Text>Waste diverted:</Text>
        <Text>{user.impactStats.wasteDiverted.toFixed(1)} kg</Text>
      </View>

      <Text style={[styles.title, { marginTop: 24 }]}>Community Impact</Text>
      <View style={styles.statRow}>
        <Text>Plastic saved:</Text>
        <Text>{globalImpact.plasticSaved.toFixed(1)} kg</Text>
      </View>
      <View style={styles.statRow}>
        <Text>CO₂ reduced:</Text>
        <Text>{globalImpact.co2Reduced.toFixed(1)} kg</Text>
      </View>
      <View style={styles.statRow}>
        <Text>Waste diverted:</Text>
        <Text>{globalImpact.wasteDiverted.toFixed(1)} kg</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});
