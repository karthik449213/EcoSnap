import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Dimensions, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Image 
} from 'react-native';
import { useDemoAuth } from '../lib/demoAuth';

const { width, height } = Dimensions.get('window');

type Category = 'bins' | 'gardens' | 'donations';

// FAKE MAP: Simulated eco points with relative positions
const simulatedEcoPoints = [
  { id: 1, name: 'NGO Recycling', type: 'bins', offsetX: 80, offsetY: 120, icon: '🔴' },
  { id: 2, name: 'Gov Dump Point', type: 'bins', offsetX: -100, offsetY: 80, icon: '🔴' },
  { id: 3, name: 'Community Garden', type: 'gardens', offsetX: 40, offsetY: -140, icon: '🟢' },
  { id: 4, name: 'Donation Center', type: 'donations', offsetX: -140, offsetY: -60, icon: '🟡' },
  { id: 5, name: 'Recycle Hub', type: 'bins', offsetX: 120, offsetY: -80, icon: '🔴' },
  { id: 6, name: 'Garden Space', type: 'gardens', offsetX: -100, offsetY: 140, icon: '🟢' },
];

// Fake map grid background component
const MapGridBackground = () => {
  return (
    <View style={styles.mapBackground}>
      {/* Grid pattern */}
      {[...Array(6)].map((_, i) => (
        <View key={`h-${i}`} style={[styles.gridLine, { top: (height * 0.35 * (i + 1)) / 6 }]} />
      ))}
      {[...Array(6)].map((_, i) => (
        <View key={`v-${i}`} style={[styles.gridLine, { left: (width * (i + 1)) / 6, height: height * 0.35 }]} />
      ))}
      
      {/* Roads/streets pattern */}
      <View style={[styles.road, { width: width * 0.8, height: 4, top: height * 0.25 }]} />
      <View style={[styles.road, { width: 4, height: height * 0.3, left: width * 0.35, top: height * 0.15 }]} />
    </View>
  );
};

// Pulsing + Ripple animation for user location
const PulsingDot = ({ pulseAnim, rippleAnim }: any) => {
  return (
    <View style={styles.dotContainer}>
      {/* Ripple layers */}
      <Animated.View 
        style={[
          styles.ripple,
          { 
            transform: [{ scale: rippleAnim }],
            opacity: rippleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 0]
            })
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.ripple,
          { 
            transform: [{ scale: rippleAnim }],
            opacity: rippleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 0]
            })
          }
        ]} 
      />
      
      {/* Pulsing dot */}
      <Animated.View 
        style={[
          styles.pulse,
          { 
            transform: [{ scale: pulseAnim }],
          }
        ]} 
      />
      
      {/* Static center dot */}
      <View style={styles.centerDot} />
    </View>
  );
};

// Eco point card with fade animation
const EcoPointCard = ({ 
  point, 
  visible, 
  fadeAnim 
}: any) => {
  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.ecoPointCard,
        {
          left: width / 2 + point.offsetX - 20,
          top: height * 0.25 + point.offsetY - 20,
          opacity: fadeAnim,
        }
      ]}
    >
      <View style={styles.ecoPointDot}>
        <Text style={{ fontSize: 14 }}>{point.icon}</Text>
      </View>
      <View style={styles.ecoPointLabel}>
        <Text style={styles.ecoPointName}>{point.name}</Text>
      </View>
    </Animated.View>
  );
};

export const MapScreen: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useDemoAuth();
  
  const [activeCategory, setActiveCategory] = useState<Category>('bins');
  const [locationStatus, setLocationStatus] = useState<'locating' | 'locked'>('locating');
  const [displayCoords, setDisplayCoords] = useState({ lat: 37.7829, lng: -122.4194 });
  const [visiblePoints, setVisiblePoints] = useState<Record<number, boolean>>({});

  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnims = useRef<Record<number, Animated.Value>>({}).current;

  // Initialize fade animations for eco points
  useEffect(() => {
    simulatedEcoPoints.forEach((point) => {
      if (!fadeAnims[point.id]) {
        fadeAnims[point.id] = new Animated.Value(0);
      }
    });
  }, []);

  // Pulsing animation (continuous)
  useEffect(() => {
    const pulseSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseSequence.start();
    return () => pulseSequence.stop();
  }, []);

  // Ripple animation (continuous radar-style)
  useEffect(() => {
    const rippleSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(rippleAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    rippleSequence.start();
    return () => rippleSequence.stop();
  }, []);

  // Simulate location refinement
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationStatus('locked');
      console.log('[FakeMap] Location locked! 🎯');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate coordinate changes for real-time feel
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayCoords((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.00005,
        lng: prev.lng + (Math.random() - 0.5) * 0.00005,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fade in eco points based on category
  useEffect(() => {
    simulatedEcoPoints.forEach((point) => {
      const isVisible = activeCategory === 'bins' 
        ? ['bins'].includes(point.type)
        : ['gardens'].includes(point.type)
        ? ['gardens'].includes(point.type)
        : ['donations'].includes(point.type);

      const newVisible = isVisible || activeCategory === 'bins';
      setVisiblePoints((prev) => ({ ...prev, [point.id]: newVisible }));

      if (newVisible) {
        Animated.timing(fadeAnims[point.id], {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(fadeAnims[point.id], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [activeCategory]);

  const filteredPoints = simulatedEcoPoints.filter((p) => {
    if (activeCategory === 'bins') return p.type === 'bins';
    if (activeCategory === 'gardens') return p.type === 'gardens';
    if (activeCategory === 'donations') return p.type === 'donations';
    return false;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.avatar}>{currentUser?.avatar || '👤'}</Text>
            <View>
              <Text style={styles.userName}>{currentUser?.username || 'User'}</Text>
              <Text style={styles.userEmail}>{currentUser?.email}</Text>
            </View>
          </View>
          <View style={styles.pointsContainer}>
            <Ionicons name="shield-checkmark" size={20} color="#52A675" />
            <Text style={styles.pointsText}>
              <Text style={styles.pointsNumber}>{currentUser?.ecoPoints || 0}</Text>
              <Text style={styles.pointsLabel}> Pts</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* FAKE MAP SECTION */}
      <View style={styles.mapContainer}>
        <MapGridBackground />

        {/* User location with animations */}
        <PulsingDot pulseAnim={pulseAnim} rippleAnim={rippleAnim} />

        {/* Eco points */}
        {filteredPoints.map((point) => (
          <EcoPointCard 
            key={point.id}
            point={point}
            visible={visiblePoints[point.id]}
            fadeAnim={fadeAnims[point.id]}
          />
        ))}

        {/* Location status badge */}
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, locationStatus === 'locked' && styles.statusDotLocked]} />
          <Text style={styles.statusText}>
            {locationStatus === 'locating' ? '🔍 Locating...' : '✓ Location locked'}
          </Text>
        </View>

        {/* Coordinates display */}
        <View style={styles.coordsDisplay}>
          <Text style={styles.coordsLabel}>Latitude</Text>
          <Text style={styles.coordsValue}>{displayCoords.lat.toFixed(6)}</Text>
          <Text style={styles.coordsLabel}>Longitude</Text>
          <Text style={styles.coordsValue}>{displayCoords.lng.toFixed(6)}</Text>
        </View>

        {/* Category Buttons */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[styles.categoryButton, activeCategory === 'bins' && styles.categoryButtonActive]}
            onPress={() => setActiveCategory('bins')}
          >
            <Text style={styles.categoryEmoji}>🔴</Text>
            <Text style={[styles.categoryLabel, activeCategory === 'bins' && styles.categoryLabelActive]}>
              Bins
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryButton, activeCategory === 'gardens' && styles.categoryButtonActive]}
            onPress={() => setActiveCategory('gardens')}
          >
            <Text style={styles.categoryEmoji}>🟢</Text>
            <Text style={[styles.categoryLabel, activeCategory === 'gardens' && styles.categoryLabelActive]}>
              Gardens
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryButton, activeCategory === 'donations' && styles.categoryButtonActive]}
            onPress={() => setActiveCategory('donations')}
          >
            <Text style={styles.categoryEmoji}>🟡</Text>
            <Text style={[styles.categoryLabel, activeCategory === 'donations' && styles.categoryLabelActive]}>
              Donations
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <SafeAreaView style={styles.bottomNavSafe}>
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/home')}
          >
            <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="map" size={24} color="#52A675" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/camera')}
          >
            <Ionicons name="camera-outline" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/achievements')}
          >
            <Ionicons name="trophy-outline" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  headerSafe: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    fontSize: 32,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 14,
  },
  pointsNumber: {
    fontWeight: '800',
    color: '#15803D',
  },
  pointsLabel: {
    color: '#6B7280',
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    margin: 12,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#C8E6C9',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#A5D6A7',
    opacity: 0.3,
  },
  road: {
    position: 'absolute',
    backgroundColor: '#B5E7A0',
    opacity: 0.5,
    borderRadius: 2,
  },
  dotContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    top: height * 0.25 - 20,
    left: width / 2 - 20,
    zIndex: 10,
  },
  ripple: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#52A675',
  },
  pulse: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#52A675',
    opacity: 0.7,
  },
  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1F2937',
    position: 'absolute',
  },
  ecoPointCard: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
    zIndex: 5,
  },
  ecoPointDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ecoPointLabel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ecoPointName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FBBF24',
  },
  statusDotLocked: {
    backgroundColor: '#52A675',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  coordsDisplay: {
    position: 'absolute',
    bottom: 80,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 20,
  },
  coordsLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  coordsValue: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  categoryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  categoryButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: '#1F2937',
  },
  bottomNavSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});
