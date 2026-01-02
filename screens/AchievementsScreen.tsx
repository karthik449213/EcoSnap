import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const AchievementsScreen: React.FC = () => {
  const router = useRouter();
  const [ecoPoints] = useState(8500);

  const achievements = [
    {
      id: 1,
      name: 'Green Starter',
      icon: '🌱',
      color: '#D1FAE5',
      borderColor: '#10B981',
      description: 'First action taken',
      unlocked: true,
    },
    {
      id: 2,
      name: 'Eco Warrior',
      icon: '♻️',
      color: '#DBEAFE',
      borderColor: '#3B82F6',
      description: '10 eco actions',
      unlocked: true,
    },
    {
      id: 3,
      name: "Nature's Friend",
      icon: '💡',
      color: '#FEF3C7',
      borderColor: '#F59E0B',
      description: '30 day streak',
      unlocked: false,
    },
  ];

  const weeklyChalllenges = [
    {
      id: 1,
      title: 'Recycle 50 Bottles',
      icon: '🍾',
      color: '#BFDBFE',
      backgroundColor: '#93C5FD',
      progress: '12/50',
    },
    {
      id: 2,
      title: 'Plant a tree',
      icon: '🌱',
      color: '#BBF7D0',
      backgroundColor: '#86EFAC',
      progress: '1/3',
    },
    {
      id: 3,
      title: 'Bike to Work',
      icon: '🚴',
      color: '#BFDBFE',
      backgroundColor: '#93C5FD',
      progress: '2/10',
    },
  ];

  const handleChallengeStart = (challengeTitle: string) => {
    Alert.alert(
      'Challenge Started',
      `You've started: ${challengeTitle}. Keep tracking your progress!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <LinearGradient colors={['#A7D7C5', '#C5F0E3']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('@/assets/images/EcoSnap.png')}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.pointsLabel}>Eco-Points</Text>
              <Text style={styles.pointsValue}>{ecoPoints.toLocaleString()}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/home')}>
            <Ionicons name="menu" size={28} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Achievements Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Achievements</Text>
            <Text style={styles.sectionSubtitle}>
              Turn real-world eco actions into streaks 🔥
            </Text>

            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementWrapper}>
                  <View
                    style={[
                      styles.achievementBadge,
                      {
                        backgroundColor: achievement.color,
                        borderColor: achievement.borderColor,
                      },
                      !achievement.unlocked && styles.achievementLocked,
                    ]}
                  >
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    {!achievement.unlocked && (
                      <View style={styles.lockOverlay}>
                        <Ionicons name="lock-closed" size={24} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Weekly Challenges Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Challenges</Text>

            {weeklyChalllenges.map((challenge) => (
              <View key={challenge.id} style={styles.challengeCard}>
                <LinearGradient
                  colors={[challenge.backgroundColor, challenge.color]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.challengeGradient}
                >
                  <View style={styles.challengeLeft}>
                    <View style={styles.challengeIconContainer}>
                      <Text style={styles.challengeIcon}>{challenge.icon}</Text>
                    </View>
                    <View style={styles.challengeInfo}>
                      <Text style={styles.challengeTitle}>{challenge.title}</Text>
                      <Text style={styles.challengeProgress}>{challenge.progress}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.goButton}
                    onPress={() => handleChallengeStart(challenge.title)}
                  >
                    <Text style={styles.goButtonText}>GO!</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ))}
          </View>

          <View style={styles.spacer} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(200, 230, 201, 0.7)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 22,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
    marginBottom: 16,
  },
  achievementWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  achievementBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 48,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 50,
  },
  achievementName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  challengeCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  challengeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 16,
  },
  challengeLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  challengeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeIcon: {
    fontSize: 28,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  challengeProgress: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  goButton: {
    backgroundColor: '#52A675',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  goButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  spacer: {
    height: 24,
  },
});
