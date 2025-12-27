import React, { useCallback, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '@/components/PrimaryButton';
import { InfoCard } from '@/components/InfoCard';
import { StreakBadge } from '@/components/StreakBadge';
import { supabase } from '@/lib/supabase';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [streak, setStreak] = useState<number | null>(null);
  const [totalActions, setTotalActions] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [email, setEmail] = useState('');

  const loadStats = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      router.replace('/auth');
      return;
    }
    setEmail(session.user.email || '');

    const { data: streakRow } = await supabase
      .from('streaks')
      .select('current_streak')
      .eq('user_id', session.user.id)
      .maybeSingle();
    setStreak(streakRow?.current_streak ?? 0);

    const { count } = await supabase
      .from('eco_actions')
      .select('id', { head: true, count: 'exact' })
      .eq('user_id', session.user.id);
    setTotalActions(count ?? 0);
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      loadStats().finally(() => {
        if (active) setLoading(false);
      });
      return () => {
        active = false;
      };
    }, [loadStats])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStats().finally(() => setRefreshing(false));
  }, [loadStats]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.replace('/auth');
  }, [router]);

  return (
    <LinearGradient colors={["#E9F7EF", "#E0F2FE"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#065F46" />}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.appName}>EcoSnap</Text>
              {email ? <Text style={styles.email}>{email}</Text> : null}
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
                <Text style={styles.signOutText}>Sign out</Text>
              </TouchableOpacity>
              <Image source={require('@/assets/images/EcoSnap.png')} style={styles.avatar} />
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#065F46" />
              <Text style={styles.loadingText}>Loading your stats…</Text>
            </View>
          ) : (
            <>
              <StreakBadge streak={streak ?? 0} />

              <View style={styles.cardRow}>
                <InfoCard title="Current Streak" value={`${streak ?? 0} days`} subtitle="Keep it going" iconName="flame" />
                <InfoCard title="Eco Actions" value={`${totalActions ?? 0}`} subtitle="All-time" iconName="leaf" />
              </View>
            </>
          )}

          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Snap Eco Action</Text>
            <Text style={styles.heroCopy}>Capture a quick proof of your eco-friendly move and grow your streak.</Text>
            <PrimaryButton label="Snap Eco Action" onPress={() => router.push('/camera')} />
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Daily Tip</Text>
            <Text style={styles.tipBody}>Turn off taps while brushing to save up to 4 gallons of water.</Text>
          </View>
        </ScrollView>
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
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 18,
  },
  headerRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greeting: {
    color: '#14532D',
    fontSize: 14,
    opacity: 0.85,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#065F46',
    marginTop: 4,
  },
  email: {
    color: '#14532D',
    opacity: 0.75,
    marginTop: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
  },
  signOutBtn: {
    backgroundColor: 'rgba(220,38,38,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderColor: 'rgba(220,38,38,0.3)',
    borderWidth: 1,
  },
  signOutText: {
    color: '#B91C1C',
    fontWeight: '700',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    gap: 12,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B4F2C',
  },
  heroCopy: {
    color: '#4B5563',
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderColor: '#93C5FD',
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    gap: 6,
  },
  tipTitle: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  tipBody: {
    color: '#1E293B',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#1F2937',
  },
});
