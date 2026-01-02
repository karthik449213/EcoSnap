import { DEMO_USERS, useDemoAuth } from '@/lib/demoAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const DemoLoginScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useDemoAuth();

  const handleSelectUser = (username: string) => {
    console.log('[DemoLogin] Selecting user:', username);
    login(username);
    router.replace('/home');
  };

  return (
    <LinearGradient colors={["#E9F7EF", "#E0F2FE"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/EcoSnap.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <Text style={styles.title}>EcoSnap</Text>
          <Text style={styles.subtitle}>Demo Mode - Select a User</Text>
        </View>

        <View style={styles.usersContainer}>
          {DEMO_USERS.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={styles.userCard}
              onPress={() => handleSelectUser(user.username)}
              activeOpacity={0.7}
            >
              <View style={styles.userAvatar}>
                <Image source={user.avatar} style={styles.avatarImage} resizeMode="cover" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.username}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.stat}>
                    🛡️ {user.ecoPoints} pts
                  </Text>
                  <Text style={styles.stat}>
                    🔥 {user.streak} day streak
                  </Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is demo mode with local data. No internet required.
          </Text>
        </View>
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
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#065F46',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#059669',
    marginTop: 8,
    fontWeight: '600',
  },
  usersContainer: {
    flex: 1,
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  stat: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 24,
    color: '#D1D5DB',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
