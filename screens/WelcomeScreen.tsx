import { PrimaryButton } from '@/components/PrimaryButton';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <LinearGradient 
      colors={['#A7D7C5', '#B8E6D5', '#C5F0E3', '#D4F4F0', '#E0F7FA']} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* Hero Text */}
          <View style={styles.heroSection}>
            <Text style={styles.mainTitle}>Snap. Drop.{'\n'}Save the Planet.</Text>
            <Text style={styles.subtitle}>Turn real-world eco actions into streaks</Text>
          </View>

          {/* Illustration Section */}
          <View style={styles.illustrationSection}>
            <View style={styles.illustrationContainer}>
              {/* Person 1 - Taking photo of recycling */}
              <View style={styles.person}>
                <View style={[styles.personBody, { backgroundColor: '#6FCF97' }]}>
                  <View style={styles.head} />
                  <View style={[styles.shirt, { backgroundColor: '#6FCF97' }]} />
                  <View style={[styles.pants, { backgroundColor: '#5A8FB4' }]} />
                </View>
                <View style={styles.recycleBin}>
                  <Text style={styles.recycleIcon}>♻️</Text>
                </View>
                <View style={styles.bottle1} />
                <View style={styles.bottle2} />
              </View>

              {/* Person 2 - Holding reusable cup */}
              <View style={styles.person}>
                <View style={[styles.personBody, { backgroundColor: '#6FCF97' }]}>
                  <View style={styles.head} />
                  <View style={[styles.shirt, { backgroundColor: '#6FCF97' }]} />
                  <View style={[styles.pants, { backgroundColor: '#5A8FB4' }]} />
                </View>
                <View style={styles.cup}>
                  <Text style={styles.cupIcon}>☕</Text>
                </View>
              </View>

              {/* Person 3 - Planting tree */}
              <View style={styles.person}>
                <View style={[styles.personBody, { backgroundColor: '#6FCF97' }]}>
                  <View style={styles.head} />
                  <View style={[styles.shirt, { backgroundColor: '#6FCF97' }]} />
                  <View style={[styles.pants, { backgroundColor: '#5A8FB4' }]} />
                </View>
                <View style={styles.plant}>
                  <Text style={styles.plantIcon}>🌱</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <PrimaryButton 
              label="Get Started" 
              onPress={() => router.push('/demoLogin')}
              style={styles.getStartedBtn}
            />
            <TouchableOpacity 
              onPress={() => router.push('/demoLogin')}
              style={styles.loginBtn}
            >
              <Text style={styles.loginText}>Select Demo User</Text>
            </TouchableOpacity>
          </View>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'flex-start',
    gap: 12,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#1F2937',
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 16,
    color: '#374151',
    opacity: 0.85,
    marginTop: 8,
    lineHeight: 22,
  },
  illustrationSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  illustrationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 10,
  },
  person: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 140,
  },
  personBody: {
    width: 50,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  head: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FDB07C',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  shirt: {
    flex: 1,
    width: '100%',
  },
  pants: {
    width: '100%',
    height: 30,
  },
  recycleBin: {
    position: 'absolute',
    bottom: 0,
    left: -25,
    width: 35,
    height: 40,
    backgroundColor: '#52A675',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recycleIcon: {
    fontSize: 18,
  },
  bottle1: {
    position: 'absolute',
    bottom: 35,
    left: -15,
    width: 6,
    height: 15,
    backgroundColor: '#93C5FD',
    borderRadius: 2,
  },
  bottle2: {
    position: 'absolute',
    bottom: 35,
    left: -8,
    width: 6,
    height: 15,
    backgroundColor: '#93C5FD',
    borderRadius: 2,
  },
  cup: {
    position: 'absolute',
    bottom: 60,
    right: 5,
    width: 20,
    height: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#52A675',
  },
  cupIcon: {
    fontSize: 12,
  },
  plant: {
    position: 'absolute',
    bottom: 0,
    right: -25,
    width: 30,
    height: 35,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  plantIcon: {
    fontSize: 24,
  },
  actionSection: {
    gap: 16,
    width: '100%',
  },
  getStartedBtn: {
    backgroundColor: '#52A675',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
