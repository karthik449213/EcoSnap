import { PrimaryButton } from '@/components/PrimaryButton';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const AuthScreen: React.FC = () => {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const handleRequestCode = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to receive a login code.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsRequesting(true);
    try {
      console.log('[AuthScreen] Requesting OTP for:', email.trim().toLowerCase());
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: mode === 'signup',
        },
      });
      
      if (error) {
        console.error('[AuthScreen] OTP request error:', error);
        throw error;
      }
      
      console.log('[AuthScreen] OTP sent successfully');
      setCodeSent(true);
      Alert.alert(
        'Check Your Email', 
        `We sent a 6-digit verification code to ${email.trim().toLowerCase()}. Please check your inbox and spam folder.`
      );
    } catch (err: any) {
      console.error('[AuthScreen] Request code failed:', err);
      const errorMessage = err?.message || 'Unable to send verification code. Please check your internet connection and try again.';
      Alert.alert('Error Sending Code', errorMessage);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!email.trim() || !code.trim()) {
      Alert.alert('Code Required', 'Please enter the 6-digit code from your email.');
      return;
    }
    
    if (code.trim().length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a valid 6-digit code.');
      return;
    }
    
    if (mode === 'signup' && !username.trim()) {
      Alert.alert('Username Required', 'Please enter a username to complete signup.');
      return;
    }
    
    if (navigating) {
      return; // Prevent multiple navigation attempts
    }

    setIsVerifying(true);
    try {
      console.log('[AuthScreen] Verifying OTP for:', email.trim().toLowerCase());
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: 'email',
      });
      
      if (error) {
        console.error('[AuthScreen] OTP verification error:', error);
        throw error;
      }
      
      if (!data.session || !data.user) {
        throw new Error('Authentication failed. No session created.');
      }
      
      console.log('[AuthScreen] OTP verified successfully, user:', data.user.id);
      console.log('[AuthScreen] Session established:', data.session.access_token ? 'YES' : 'NO');

      // Handle signup profile update
      if (mode === 'signup' && username.trim()) {
        console.log('[AuthScreen] Updating username for new user');
        const { error: profileError } = await supabase
          .from('users_profile')
          .update({ username: username.trim() })
          .eq('id', data.user.id);
        
        if (profileError) {
          console.error('[AuthScreen] Profile update error:', profileError);
          // Don't block login for profile errors
        }
      }

      // Navigate to home only after successful session creation
      setNavigating(true);
      console.log('[AuthScreen] Navigating to home...');
      router.replace('/home');
    } catch (err: any) {
      console.error('[AuthScreen] Verification failed:', err);
      
      let errorMessage = 'The verification code is invalid or has expired. Please request a new code.';
      if (err?.message?.includes('network') || err?.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      Alert.alert(
        mode === 'signup' ? 'Signup Failed' : 'Verification Failed',
        errorMessage
      );
      setIsVerifying(false);
    }
  };

  return (
    <LinearGradient colors={["#E9F7EF", "#E0F2FE"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.card}>
          <Text style={styles.title}>EcoSnap</Text>
          <Text style={styles.subtitle}>
            {mode === 'signin' 
              ? 'Sign in with your email to keep snapping eco actions.' 
              : 'Create an account and start building your eco streak.'}
          </Text>

          {!codeSent && (
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, mode === 'signin' && styles.toggleBtnActive]}
                onPress={() => setMode('signin')}
              >
                <Text style={[styles.toggleText, mode === 'signin' && styles.toggleTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}
                onPress={() => setMode('signup')}
              >
                <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#94A3B8"
            editable={!codeSent}
          />

          {codeSent ? (
            <>
              {mode === 'signup' && (
                <>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="johndoe"
                    autoCapitalize="none"
                    style={styles.input}
                    placeholderTextColor="#94A3B8"
                  />
                </>
              )}
              <Text style={styles.label}>6-digit code</Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                keyboardType="number-pad"
                style={styles.input}
                placeholderTextColor="#94A3B8"
                maxLength={6}
              />
              <PrimaryButton
                label={isVerifying ? 'Verifying…' : mode === 'signup' ? 'Create Account' : 'Verify & Continue'}
                onPress={handleVerifyCode}
                style={styles.primary}
                textStyle={{ opacity: isVerifying ? 0.8 : 1 }}
              />
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={handleRequestCode} disabled={isRequesting} style={styles.resendBtn}>
                  {isRequesting ? (
                    <ActivityIndicator color="#065F46" />
                  ) : (
                    <Text style={styles.resendText}>Resend code</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setCodeSent(false);
                    setCode('');
                    setEmail('');
                  }} 
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelText}>Change email</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <PrimaryButton
              label={isRequesting ? 'Sending…' : mode === 'signup' ? 'Send signup code' : 'Send login code'}
              onPress={handleRequestCode}
              style={styles.primary}
              textStyle={{ opacity: isRequesting ? 0.8 : 1 }}
            />
          )}
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
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#065F46',
  },
  subtitle: {
    color: '#1F2937',
    lineHeight: 20,
    marginTop: 4,
  },
  label: {
    marginTop: 6,
    color: '#065F46',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  primary: {
    marginTop: 4,
  },
  resendBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  resendText: {
    color: '#047857',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginTop: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#F8FAFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  toggleText: {
    color: '#64748B',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#065F46',
    fontWeight: '700',
  },
});
