import { InfoCard } from '@/components/InfoCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { StreakBadge } from '@/components/StreakBadge';
import { Leaderboard } from '@/components/Leaderboard';
import { SnapHistory } from '@/components/SnapHistory';
import { useDemoAuth } from '@/lib/demoAuth';
import { useApp } from '@/lib/appContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { currentUser, logout } = useDemoAuth();
  const { user: appUser } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleSignOut = useCallback(() => {
    console.log('[HomeScreen] Signing out...');
    logout();
    router.replace('/welcome');
  }, [router, logout]);

  if (!currentUser) {
    return (
      <LinearGradient colors={["#E9F7EF", "#E0F2FE"]} style={styles.container}>
        <SafeAreaView style={[styles.safe, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#065F46" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

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
              <Text style={styles.appName}>{currentUser.username}</Text>
              <Text style={styles.email}>{currentUser.email}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
                <Text style={styles.signOutText}>Switch User</Text>
              </TouchableOpacity>
              <View style={styles.avatar}>
                <Image source={currentUser.avatar} style={styles.avatarImage} resizeMode="cover" />
              </View>
            </View>
          </View>

          <StreakBadge streak={appUser.streakCount || currentUser?.streak || 0} />

          <View style={styles.cardRow}>
            <InfoCard title="Current Streak" value={`${appUser.streakCount || currentUser?.streak || 0} days`} subtitle="Keep it going" iconName="flame" />
            <InfoCard title="Eco Points" value={`${appUser.totalPoints || currentUser?.ecoPoints || 0}`} subtitle="All-time" iconName="shield-checkmark" />
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Snap Eco Action</Text>
            <Text style={styles.heroCopy}>Capture a quick proof of your eco-friendly move and grow your streak.</Text>
            <PrimaryButton label="Snap Eco Action" onPress={() => router.push('/camera')} />
          </View>

          <TouchableOpacity 
            style={styles.mapCard}
            onPress={() => router.push('/map')}
          >
            <View style={styles.mapIconContainer}>
              <Ionicons name="map" size={28} color="#52A675" />
            </View>
            <View style={styles.mapContent}>
              <Text style={styles.mapTitle}>Find Recycling Centers</Text>
              <Text style={styles.mapSubtitle}>Discover nearby eco-friendly locations</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.achievementsCard}
            onPress={() => router.push('/achievements')}
          >
            <View style={styles.achievementsIconContainer}>
              <Ionicons name="star" size={28} color="#F59E0B" />
            </View>
            <View style={styles.achievementsContent}>
              <Text style={styles.achievementsTitle}>View Achievements</Text>
              <Text style={styles.achievementsSubtitle}>Track your progress & unlock badges</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleCard}
            onPress={() => router.push('/circles')}
          >
            <View style={styles.achievementsIconContainer}>
              <Ionicons name="people" size={28} color="#6366F1" />
            </View>
            <View style={styles.achievementsContent}>
              <Text style={styles.achievementsTitle}>Eco Circles</Text>
              <Text style={styles.achievementsSubtitle}>Join or view your circles</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.missionsCard}
            onPress={() => router.push('/missions')}
          >
            <View style={styles.missionsIconContainer}>
              <Ionicons name="target" size={28} color="#8B5CF6" />
            </View>
            <View style={styles.missionsContent}>
              <Text style={styles.missionsTitle}>Daily Missions</Text>
              <Text style={styles.missionsSubtitle}>Complete challenges for bonus XP</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Daily Tip</Text>
            <Text style={styles.tipBody}>Turn off taps while brushing to save up to 4 gallons of water.</Text>
          </View>

          <SnapHistory username={currentUser.username} />

          <Leaderboard 
            currentUserPoints={appUser.totalPoints || currentUser?.ecoPoints || 0} 
            currentUserRank={Math.floor(Math.random() * 500) + 1}
          />
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
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
  mapCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mapIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContent: {
    flex: 1,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  mapSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  achievementsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementsContent: {
    flex: 1,
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  achievementsSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  missionsCard: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  missionsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DDD6FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionsContent: {
    flex: 1,
  },
  missionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  missionsSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
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
