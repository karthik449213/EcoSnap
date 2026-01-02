import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDemoAuth } from '../lib/demoAuth';
import { useSnapsStore } from '../lib/snapsStore';

const { width } = Dimensions.get('window');
const GRID_SPACING = 4;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (width - GRID_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function SnapsScreen() {
  const router = useRouter();
  const { currentUser } = useDemoAuth();
  const { snaps, deleteSnap } = useSnapsStore();
  const [filter, setFilter] = useState<string>('all');
  const [snapsList, setSnapsList] = useState(snaps);

  useFocusEffect(
    useCallback(() => {
      setSnapsList(snaps);
      // Prefetch images for faster loading
      snaps.forEach((snap) => {
        if (typeof snap.imageUri === 'string') {
          Image.prefetch(snap.imageUri).catch(() => {
            // Silently handle prefetch errors
          });
        }
      });
    }, [snaps])
  );

  const getCategoryIcon = useCallback((category: string) => {
    switch (category) {
      case 'recycling':
        return 'repeat';
      case 'reduction':
        return 'leaf';
      case 'composting':
        return 'leaf';
      case 'food':
        return 'restaurant';
      case 'transport':
        return 'bus';
      default:
        return 'camera';
    }
  }, []);

  const getCategoryColor = useCallback((category: string) => {
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
  }, []);

  const filteredSnaps =
    filter === 'all'
      ? snapsList
      : snapsList.filter((snap) => snap.category === filter);

  const totalPoints = snapsList.reduce((sum, snap) => sum + snap.points, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Eco Snaps</Text>
          <Text style={styles.headerSubtitle}>{currentUser?.username}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/camera')} style={styles.cameraButton}>
          <Ionicons name="camera" size={24} color="#52A675" />
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{snapsList.length}</Text>
          <Text style={styles.statLabel}>Total Snaps</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalPoints}</Text>
          <Text style={styles.statLabel}>Points Earned</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentUser?.streak || 0}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'recycling' && styles.filterTabActive]}
          onPress={() => setFilter('recycling')}
        >
          <Ionicons name="repeat" size={16} color={filter === 'recycling' ? '#10B981' : '#6B7280'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'food' && styles.filterTabActive]}
          onPress={() => setFilter('food')}
        >
          <Ionicons name="restaurant" size={16} color={filter === 'food' ? '#F59E0B' : '#6B7280'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'transport' && styles.filterTabActive]}
          onPress={() => setFilter('transport')}
        >
          <Ionicons name="bus" size={16} color={filter === 'transport' ? '#06B6D4' : '#6B7280'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'composting' && styles.filterTabActive]}
          onPress={() => setFilter('composting')}
        >
          <Ionicons name="leaf" size={16} color={filter === 'composting' ? '#8B5CF6' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      {/* Grid of Snaps */}
      <FlatList
        data={filteredSnaps}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={12}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <TouchableOpacity
              style={styles.gridTouchable}
              activeOpacity={0.9}
              onPress={() => router.push(`/snap-detail?snapId=${item.id}`)}
            >
              <Image 
                source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : item.imageUri}
                style={styles.gridImage} 
                resizeMode="cover" 
              />
              
              {/* Overlay */}
              <View style={styles.gridOverlay} />

              {/* Category Badge */}
              <View
                style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}
              >
                <Ionicons name={getCategoryIcon(item.category)} size={14} color="#FFFFFF" />
              </View>

              {/* Points Badge */}
              <View style={styles.pointsBadge}>
                <Ionicons name="flash" size={12} color="#F59E0B" />
                <Text style={styles.pointsValue}>+{item.points}</Text>
              </View>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteIconButton}
              onPress={() => {
                Alert.alert(
                  'Delete Snap',
                  `Are you sure you want to delete "${item.title}"?`,
                  [
                    { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                    {
                      text: 'Delete',
                      onPress: () => {
                        deleteSnap(item.id);
                      },
                      style: 'destructive',
                    },
                  ]
                );
              }}
            >
              <Ionicons name="trash" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No snaps in this category</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/camera')}
            >
              <Text style={styles.emptyButtonText}>Take Your First Snap</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10B981',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: {
    backgroundColor: '#DBEAFE',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#1F2937',
  },
  gridContainer: {
    padding: GRID_SPACING,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: GRID_SPACING / 2,
    borderRadius: 12,
    overflow: 'visible',
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  gridTouchable: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  deleteIconButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
