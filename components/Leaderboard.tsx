import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Fake leaderboard data - realistic top 5 eco warriors
const FAKE_LEADERBOARD = [
  { rank: 1, name: 'EcoWarrior', avatar: '🌍', points: 12450, streak: 89, change: '↑' },
  { rank: 2, name: 'GreenGuardian', avatar: '🌿', points: 11200, streak: 76, change: '↑' },
  { rank: 3, name: 'PlanetSaver', avatar: '♻️', points: 10890, streak: 65, change: '→' },
  { rank: 4, name: 'EcoNinja', avatar: '🥋', points: 9750, streak: 58, change: '↓' },
  { rank: 5, name: 'GreenHero', avatar: '💚', points: 8920, streak: 48, change: '↑' },
];

export const Leaderboard: React.FC<{ currentUserPoints: number; currentUserRank: number }> = ({ 
  currentUserPoints, 
  currentUserRank 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="podium" size={24} color="#F59E0B" />
        <Text style={styles.title}>Global Leaderboard</Text>
      </View>

      <View style={styles.leaderboardList}>
        {FAKE_LEADERBOARD.map((user) => (
          <View key={user.rank} style={styles.leaderboardRow}>
            {/* Rank */}
            <View style={[styles.rankBadge, getRankStyle(user.rank)]}>
              <Text style={[styles.rankText, getRankTextStyle(user.rank)]}>
                {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
              </Text>
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.avatar}>{user.avatar}</Text>
                <View style={styles.nameColumn}>
                  <Text style={styles.name}>{user.name}</Text>
                  <View style={styles.streakRow}>
                    <Ionicons name="flame" size={12} color="#F97316" />
                    <Text style={styles.streak}>{user.streak} days</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Points + Change */}
            <View style={styles.pointsSection}>
              <View style={styles.changeIndicator}>
                <Text style={[styles.changeText, user.change === '↑' && styles.changeUp, user.change === '↓' && styles.changeDown]}>
                  {user.change}
                </Text>
              </View>
              <Text style={styles.points}>{user.points.toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Your Rank Indicator */}
      <View style={styles.yourRankSection}>
        <View style={styles.yourRankContent}>
          <Text style={styles.yourRankLabel}>Your Rank</Text>
          <Text style={styles.yourRankNumber}>#{currentUserRank}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.yourRankContent}>
          <Text style={styles.yourRankLabel}>Your Points</Text>
          <Text style={styles.yourRankPoints}>{currentUserPoints.toLocaleString()}</Text>
        </View>
      </View>

      {/* Motivational Message */}
      <View style={styles.motivationCard}>
        <Ionicons name="bulb" size={20} color="#06B6D4" />
        <Text style={styles.motivationText}>
          Keep pushing! You're in the top {Math.floor(Math.random() * 20) + 1}% of eco warriors 🌱
        </Text>
      </View>
    </View>
  );
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return styles.rankBadgeGold;
    case 2:
      return styles.rankBadgeSilver;
    case 3:
      return styles.rankBadgeBronze;
    default:
      return styles.rankBadgeDefault;
  }
};

const getRankTextStyle = (rank: number) => {
  if (rank <= 3) return styles.rankTextPremium;
  return styles.rankTextDefault;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  leaderboardList: {
    gap: 10,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '700',
  },
  rankBadgeGold: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  rankBadgeSilver: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  rankBadgeBronze: {
    backgroundColor: '#FED7AA',
    borderWidth: 2,
    borderColor: '#F97316',
  },
  rankBadgeDefault: {
    backgroundColor: '#E0E7FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
  },
  rankTextPremium: {
    color: '#7C2D12',
  },
  rankTextDefault: {
    color: '#312E81',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    fontSize: 24,
  },
  nameColumn: {
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streak: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '600',
  },
  pointsSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  changeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  changeUp: {
    color: '#16A34A',
  },
  changeDown: {
    color: '#DC2626',
  },
  points: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  yourRankSection: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#86EFAC',
    padding: 12,
    gap: 12,
  },
  yourRankContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yourRankLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  yourRankNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#065F46',
    marginTop: 4,
  },
  yourRankPoints: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15803D',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#D1FAE5',
  },
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#CFFAFE',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#06B6D4',
  },
  motivationText: {
    flex: 1,
    fontSize: 13,
    color: '#0C4A6E',
    fontWeight: '600',
    lineHeight: 18,
  },
});
