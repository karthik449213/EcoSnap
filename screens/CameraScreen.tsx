import { useDemoAuth } from '@/lib/demoAuth';
import { Ionicons } from '@expo/vector-icons';
import { CameraCapturedPicture, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { 
  ActivityIndicator, 
  Dimensions,
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  GestureResponderEvent,
  Pressable
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const CameraScreen: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useDemoAuth();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    console.log('[CameraScreen] Checking authentication...');
    if (!currentUser) {
      console.warn('[CameraScreen] Not authenticated, redirecting to /welcome');
      router.replace('/welcome');
    } else {
      console.log('[CameraScreen] User authenticated:', currentUser.username);
    }
  }, [router, currentUser]);

  // Capture photo on single tap
  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing || isRecording) return;
    setIsCapturing(true);
    try {
      console.log('[CameraScreen] Capturing photo...');
      const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        console.log('[CameraScreen] Photo captured:', photo.uri);
        router.push({ pathname: '/preview', params: { photoUri: photo.uri } });
      }
    } catch (error) {
      console.error('[CameraScreen] Photo capture failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  // Start recording on long press
  const handleLongPressStart = () => {
    longPressTimer.current = setTimeout(async () => {
      if (!cameraRef.current || isRecording) return;
      try {
        console.log('[CameraScreen] Starting video recording...');
        setIsRecording(true);
        // Note: Video recording requires additional Expo configuration
        // For now, we'll just show the recording state
        console.log('[CameraScreen] Video recording started (demo mode)');
      } catch (error) {
        console.error('[CameraScreen] Video recording failed:', error);
        setIsRecording(false);
      }
    }, 500); // 500ms long press threshold
  };

  // Stop recording on release
  const handleLongPressEnd = async () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (isRecording) {
      try {
        console.log('[CameraScreen] Stopping video recording...');
        setIsRecording(false);
        // In demo mode, just capture a photo instead
        await handleCapture();
      } catch (error) {
        console.error('[CameraScreen] Stop recording failed:', error);
        setIsRecording(false);
      }
    }
  };

  // Toggle between front and back camera
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
    console.log('[CameraScreen] Camera facing toggled to:', facing === 'back' ? 'front' : 'back');
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color="#047857" size="large" />
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
    <View style={styles.container}>
      {/* CAMERA PREVIEW - FULL SCREEN, EDGE-TO-EDGE */}
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing={facing}
      />

      {/* OVERLAY UI - FLOATING ABOVE CAMERA */}
      
      {/* TOP-RIGHT: FLIP CAMERA BUTTON */}
      <Pressable 
        style={styles.flipButton}
        onPress={toggleCameraFacing}
      >
        <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
      </Pressable>

      {/* BOTTOM CENTER: SHUTTER BUTTON */}
      <Pressable
        style={styles.shutterContainer}
        onPressIn={handleLongPressStart}
        onPressOut={handleLongPressEnd}
        onPress={!isRecording ? handleCapture : undefined}
      >
        <View style={[
          styles.shutterButton,
          isRecording && styles.shutterButtonRecording
        ]}>
          {isCapturing ? (
            <ActivityIndicator color="#FFFFFF" size="large" />
          ) : isRecording ? (
            <View style={styles.recordingIndicator} />
          ) : (
            <View style={styles.shutterInner} />
          )}
        </View>
      </Pressable>

      {/* RECORDING INDICATOR (TOP CENTER) */}
      {isRecording && (
        <View style={styles.recordingBadge}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>REC</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // FULL SCREEN CONTAINER - NO SAFE AREA PADDING
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  // CAMERA VIEW - FILLS ENTIRE SCREEN (EDGE-TO-EDGE)
  camera: {
    ...StyleSheet.absoluteFillObject, // Position absolute, covers full screen
    width: width,
    height: height,
  },

  // FLIP CAMERA BUTTON - TOP RIGHT CORNER
  flipButton: {
    position: 'absolute',
    top: 50, // Below status bar
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Floats above camera
  },

  // SHUTTER BUTTON CONTAINER - BOTTOM CENTER
  shutterContainer: {
    position: 'absolute',
    bottom: 40,
    left: width / 2 - 45, // Center horizontally (90px button / 2)
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  // SHUTTER BUTTON - LARGE CIRCULAR BUTTON
  shutterButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    borderWidth: 5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Android shadow
  },

  // SHUTTER BUTTON - RECORDING STATE (RED)
  shutterButtonRecording: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)', // Red when recording
    borderColor: '#EF4444',
  },

  // SHUTTER INNER CIRCLE (PHOTO MODE)
  shutterInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
  },

  // RECORDING INDICATOR (RED SQUARE IN CENTER)
  recordingIndicator: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },

  // RECORDING BADGE - TOP CENTER
  recordingBadge: {
    position: 'absolute',
    top: 50,
    left: width / 2 - 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    zIndex: 10,
  },

  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },

  recordingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // PERMISSION SCREEN STYLES
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F3F4F6',
  },

  permissionText: {
    textAlign: 'center',
    color: '#1F2937',
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },

  permissionButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  permissionLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
