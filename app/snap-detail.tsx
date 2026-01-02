import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSnapsStore, Snap } from '../lib/snapsStore';

const { width } = Dimensions.get('window');

export default function SnapDetailScreen() {
  const router = useRouter();
  const { snapId } = useLocalSearchParams();
  const { snaps, deleteSnap } = useSnapsStore();
  const [snap, setSnap] = useState<Snap | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (snapId && typeof snapId === 'string') {
      const foundSnap = snaps.find((s: Snap) => s.id === snapId);
      setSnap(foundSnap || null);
      // Prefetch image if available
      if (foundSnap && typeof foundSnap.imageUri === 'string') {
        Image.prefetch(foundSnap.imageUri).finally(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }
  }, [snapId, snaps]);

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

  const getCategoryLabel = useCallback((category: string) => {
    switch (category) {
      case 'recycling':
        return 'Recycling';
      case 'reduction':
        return 'Reduction';
      case 'composting':
        return 'Composting';
      case 'food':
        return 'Food';
      case 'transport':
        return 'Transport';
      default:
        return 'Other';
    }
  }, []);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Snap',
      'Are you sure you want to delete this snap? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            if (snap?.id) {
              deleteSnap(snap.id);
              router.back();
            }
          },
          style: 'destructive',
        },
      ]
    );
  }, [snap, deleteSnap, router]);

  if (!snap) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Snap not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Snap Details</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={typeof snap.imageUri === 'string' ? { uri: snap.imageUri } : snap.imageUri}
            style={styles.fullImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          {/* Category Badge */}
          <View
            style={[
              styles.categoryBadgeLarge,
              { backgroundColor: getCategoryColor(snap.category) },
            ]}
          >
            <Ionicons
              name={getCategoryIcon(snap.category)}
              size={24}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* Details Content */}
        <View style={styles.detailsContainer}>
          {/* Title and Category */}
          <View style={styles.titleSection}>
            <Text style={styles.snapTitle}>{snap.title}</Text>
            <View style={styles.categoryBadge}>
              <Ionicons
                name={getCategoryIcon(snap.category)}
                size={14}
                color="#FFFFFF"
              />
              <Text style={styles.categoryText}>{getCategoryLabel(snap.category)}</Text>
            </View>
          </View>

          {/* Points Card */}
          <View style={styles.pointsCard}>
            <View style={styles.pointsLeft}>
              <Ionicons name="flash" size={32} color="#F59E0B" />
            </View>
            <View style={styles.pointsRight}>
              <Text style={styles.pointsLabel}>Points Earned</Text>
              <Text style={styles.pointsValue}>+{snap.points}</Text>
            </View>
          </View>

          {/* Timestamp Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar" size={20} color="#52A675" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Captured</Text>
                <Text style={styles.infoValue}>{formatDate(snap.timestamp)}</Text>
              </View>
            </View>
          </View>

          {/* Description Card */}
          {snap.description && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="document-text" size={20} color="#52A675" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{snap.description}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Impact Section */}
          <View style={styles.impactSection}>
            <Text style={styles.sectionTitle}>Environmental Impact</Text>
            <View style={styles.impactGrid}>
              <View style={styles.impactItem}>
                <View style={styles.impactIconContainer}>
                  <Ionicons name="leaf" size={20} color="#10B981" />
                </View>
                <Text style={styles.impactText}>CO₂ Saved</Text>
                <Text style={styles.impactValue}>
                  {Math.round(snap.points * 0.5)}g
                </Text>
              </View>
              <View style={styles.impactItem}>
                <View style={styles.impactIconContainer}>
                  <Ionicons name="water" size={20} color="#3B82F6" />
                </View>
                <Text style={styles.impactText}>Water Saved</Text>
                <Text style={styles.impactValue}>
                  {Math.round(snap.points * 2)}L
                </Text>
              </View>
              <View style={styles.impactItem}>
                <View style={styles.impactIconContainer}>
                  <Ionicons name="trash" size={20} color="#8B5CF6" />
                </View>
                <Text style={styles.impactText}>Waste Reduced</Text>
                <Text style={styles.impactValue}>
                  {Math.round(snap.points * 0.1)}kg
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/camera')}
            >
              <Ionicons name="camera" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Take Another Snap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 20,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 350,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  categoryBadgeLarge: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  snapTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pointsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  pointsLeft: {
    marginRight: 16,
  },
  pointsRight: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F59E0B',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  impactSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  impactItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  impactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  impactText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#52A675',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
