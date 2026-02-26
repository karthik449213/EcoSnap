import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getDailyMission, getWeeklyMission, generateDailyMission } from '@/lib/services/missionEngine';
import { Mission } from '@/lib/models';

export const MissionsScreen: React.FC = () => {
  const router = useRouter();
  const [dailyMission, setDailyMission] = useState<Mission | null>(null);
  const [weeklyMission, setWeeklyMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const daily = await getDailyMission();
        const weekly = await getWeeklyMission();
        setDailyMission(daily);
        setWeeklyMission(weekly);
      } catch (err) {
        console.error('[MissionsScreen] Error loading missions:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleResetDaily = async () => {
    const newDaily = await generateDailyMission();
    setDailyMission(newDaily);
  };

  if (loading) {
    return (
      <LinearGradient colors={['#A7D7C5', '#C5F0E3']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ActivityIndicator size="large" color="#065F46" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#A7D7C5', '#C5F0E3']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.title}>Daily Missions</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Daily Mission */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Challenge</Text>
            {dailyMission && (
              <View style={styles.missionCard}>
                <View style={styles.missionHeader}>
                  <Text style={styles.missionType}>Daily Mission 🌅</Text>
                  <Text style={styles.reward}>+{dailyMission.rewardXP} XP</Text>
                </View>
                <Text style={styles.missionDescription}>Complete 3 eco actions from the list below:</Text>
                <View style={styles.actionsList}>
                  {dailyMission.actions.length > 0 ? (
                    dailyMission.actions.map((action, idx) => (
                      <View key={idx} style={styles.actionItem}>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                        <Text style={styles.actionText}>{action}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noActionsText}>Loading actions...</Text>
                  )}
                </View>
                <TouchableOpacity style={styles.resetButton} onPress={handleResetDaily}>
                  <Text style={styles.resetButtonText}>🔄 Reroll</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Weekly Mission */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week's Goal</Text>
            {weeklyMission && (
              <View style={styles.missionCard}>
                <View style={styles.missionHeader}>
                  <Text style={styles.missionType}>Weekly Mission 🎯</Text>
                  <Text style={styles.reward}>+{weeklyMission.rewardXP} XP</Text>
                </View>
                <Text style={styles.missionDescription}>
                  Log 5 eco actions within 7 days to earn bonus XP!
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '40%' }]} />
                </View>
                <Text style={styles.progressText}>2 / 5 actions completed</Text>
              </View>
            )}
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#065F46' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  missionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionType: { fontSize: 16, fontWeight: '700', color: '#065F46' },
  reward: { fontSize: 14, fontWeight: '600', color: '#10B981', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  missionDescription: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  actionsList: { marginBottom: 12 },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  actionText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  noActionsText: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' },
  resetButton: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    marginTop: 8,
  },
  resetButtonText: { fontSize: 12, fontWeight: '600', color: '#0284C7' },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: '100%', backgroundColor: '#10B981' },
  progressText: { fontSize: 12, color: '#6B7280' },
  spacer: { height: 60 },
});
