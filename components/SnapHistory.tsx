import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock snap history data - in production, this would come from storage/database
export const MOCK_SNAP_HISTORY = [
  {
    id: 'snap-1',
    imageUri: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    title: 'Recycling Plastic',
    timestamp: new Date(2026, 0, 2, 10, 30),
    points: 50,
    category: 'recycling',
  },
  {
    id: 'snap-2',
    imageUri: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    title: 'Reusable Bag',
    timestamp: new Date(2026, 0, 1, 14, 15),
    points: 30,
    category: 'reduction',
  },
  {
    id: 'snap-3',
    imageUri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    title: 'Composting',
    timestamp: new Date(2025, 11, 31, 9, 45),
    points: 40,
    category: 'composting',
  },
  {
    id: 'snap-4',
    imageUri: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400',
    title: 'Plant-Based Meal',
    timestamp: new Date(2025, 11, 30, 12, 0),
    points: 25,
    category: 'food',
  },
  {
    id: 'snap-5',
    imageUri: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    title: 'Public Transport',
    timestamp: new Date(2025, 11, 29, 8, 30),
    points: 35,
    category: 'transport',
  },
];

interface SnapHistoryProps {
  username?: string;
}

export const SnapHistory: React.FC<SnapHistoryProps> = ({ username }) => {
  const router = useRouter();

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recycling':
        return 'recycle';
      case 'reduction':
        return 'leaf';
      case 'composting':
        return 'nutrition';
      case 'food':
        return 'restaurant';
      case 'transport':
        return 'bus';
      default:
        return 'camera';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recycling':
        return '#10B981';
      case 'reduction':
        return '#3B82F6';
      case 'composting':
        return '#8B5CF6';
      case 'food':
        return '#F59E0B';
      case 'transport':
        return '#06B6D4';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="time" size={24} color="#52A675" />
          <Text style={styles.title}>Recent Eco Actions</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => router.push('/snaps')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={18} color="#52A675" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrolling Snap Cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MOCK_SNAP_HISTORY.map((snap) => (
          <TouchableOpacity key={snap.id} style={styles.snapCard} activeOpacity={0.9}>
            {/* Snap Image */}
            <Image 
              source={{ uri: snap.imageUri }} 
              style={styles.snapImage}
              resizeMode="cover"
            />
            
            {/* Overlay Gradient */}
            <View style={styles.overlay} />

            {/* Category Badge */}
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(snap.category) }]}>
              <Ionicons name={getCategoryIcon(snap.category) as any} size={16} color="#FFFFFF" />
            </View>

            {/* Snap Info */}
            <View style={styles.snapInfo}>
              <Text style={styles.snapTitle} numberOfLines={1}>
                {snap.title}
              </Text>
              <View style={styles.snapMeta}>
                <Text style={styles.snapTimestamp}>{formatTimestamp(snap.timestamp)}</Text>
                <View style={styles.pointsBadge}>
                  <Ionicons name="flash" size={12} color="#F59E0B" />
                  <Text style={styles.pointsText}>+{snap.points}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Add New Snap Card */}
        <TouchableOpacity 
          style={styles.addSnapCard} 
          activeOpacity={0.8}
          onPress={() => router.push('/camera')}
        >
          <View style={styles.addSnapIcon}>
            <Ionicons name="camera" size={32} color="#52A675" />
          </View>
          <Text style={styles.addSnapText}>Take New Snap</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Ionicons name="images" size={20} color="#6B7280" />
          <Text style={styles.summaryText}>
            <Text style={styles.summaryValue}>{MOCK_SNAP_HISTORY.length}</Text> snaps this week
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Ionicons name="trending-up" size={20} color="#10B981" />
          <Text style={styles.summaryText}>
            <Text style={styles.summaryValue}>
              {MOCK_SNAP_HISTORY.reduce((sum, snap) => sum + snap.points, 0)}
            </Text> points earned
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#52A675',
  },
  scrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  snapCard: {
    width: 140,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  snapImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    gap: 4,
  },
  snapTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  snapMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  snapTimestamp: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  addSnapCard: {
    width: 140,
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
  },
  addSnapIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSnapText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  summaryText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontWeight: '700',
    color: '#1F2937',
  },
});
