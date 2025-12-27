import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export const CameraScreen: React.FC = () => {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    const ensureSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/auth');
      }
    };
    ensureSession();
  }, [router]);

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        router.push({ pathname: '/preview', params: { photoUri: photo.uri } });
      }
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color="#047857" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.permissionText}>We need camera access to snap eco actions.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionLabel}>Allow Camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraWrap}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back" />
        <View style={styles.overlayTop}>
          <Text style={styles.overlayTitle}>Capture your eco action</Text>
          <Text style={styles.overlaySub}>Keep it steady and clear</Text>
        </View>
        <View style={styles.overlayBottom}>
          <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} activeOpacity={0.85}>
            {isCapturing ? (
              <ActivityIndicator color="#065F46" />
            ) : (
              <Ionicons name="camera" size={28} color="#065F46" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraWrap: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  overlayTop: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
  },
  overlayTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
    textAlign: 'center',
  },
  overlaySub: {
    color: '#E2E8F0',
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  captureBtn: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 6,
    borderColor: '#E0F2FE',
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionText: {
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 12,
  },
  permissionButton: {
    backgroundColor: '#34D399',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionLabel: {
    color: '#FFF',
    fontWeight: '700',
  },
});
