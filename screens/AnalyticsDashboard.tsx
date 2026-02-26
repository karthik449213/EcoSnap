import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAnalytics, AnalyticsData } from '@/lib/services/analyticsEngine';

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getAnalytics();
      setAnalytics(data);
    };
    load();
  }, []);

  if (!analytics) return null;

  return (
    <LinearGradient colors={['#E0F2FE', '#F0FDF4']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Growth Analytics</Text>
          <Text style={styles.subtitle}>Track your sustainability journey 📈</Text>

          {/* Core Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Metrics</Text>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Snap Frequency</Text>
              <Text style={styles.metricValue}>{analytics.snapFrequency}</Text>
              <Text style={styles.metricSubtext}>actions submitted</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Streak Breaks</Text>
              <Text style={styles.metricValue}>{analytics.streakBreaks}</Text>
              <Text style={styles.metricSubtext}>times streak reset</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Mission Completion</Text>
              <Text style={styles.metricValue}>{(analytics.missionCompletionRate * 100).toFixed(0)}%</Text>
              <Text style={styles.metricSubtext}>missions completed</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Rare Drop Rate</Text>
              <Text style={styles.metricValue}>{(analytics.rareDropTriggerRate * 100).toFixed(1)}%</Text>
              <Text style={styles.metricSubtext}>rarity triggers</Text>
            </View>
          </View>

          {/* Retention */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Retention Milestones 🔥</Text>

            <View style={styles.retentionGrid}>
              <View style={[styles.retentionCard, analytics.retention.day1 && styles.retentionUnlocked]}>
                <Text style={styles.retentionLabel}>Day 1</Text>
                <Text style={styles.retentionIcon}>{analytics.retention.day1 ? '✅' : '⏳'}</Text>
              </View>

              <View style={[styles.retentionCard, analytics.retention.day7 && styles.retentionUnlocked]}>
                <Text style={styles.retentionLabel}>Day 7</Text>
                <Text style={styles.retentionIcon}>{analytics.retention.day7 ? '✅' : '⏳'}</Text>
              </View>

              <View style={[styles.retentionCard, analytics.retention.day30 && styles.retentionUnlocked]}>
                <Text style={styles.retentionLabel}>Day 30</Text>
                <Text style={styles.retentionIcon}>{analytics.retention.day30 ? '✅' : '⏳'}</Text>
              </View>
            </View>
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
  title: { fontSize: 24, fontWeight: '800', color: '#065F46', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  metricCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 1,
  },
  metricLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  metricValue: { fontSize: 28, fontWeight: '800', color: '#065F46' },
  metricSubtext: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  retentionGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  retentionCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  retentionUnlocked: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  retentionLabel: { fontSize: 12, fontWeight: '600', color: '#374151' },
  retentionIcon: { fontSize: 24, marginTop: 8 },
  spacer: { height: 60 },
});

export default AnalyticsDashboard;
