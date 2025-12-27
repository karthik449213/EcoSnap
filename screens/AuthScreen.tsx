import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { PrimaryButton } from '@/components/PrimaryButton';

export const AuthScreen: React.FC = () => {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const redirectIfSession = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) return;
    if (data.session) {
      router.replace('/home');
    }
  }, [router]);

  useEffect(() => {
    redirectIfSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/home');
      }
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [redirectIfSession, router]);

  const handleRequestCode = async () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Enter your email to get a login code.');
      return;
    }
    setIsRequesting(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: undefined,
        },
      });
      if (error) throw error;
      setCodeSent(true);
      Alert.alert('Check your email', 'We sent a 6-digit code to finish signing in.');
    } catch (err: any) {
      Alert.alert('Could not send code', err?.message || 'Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!email.trim() || !code.trim()) {
      Alert.alert('Missing code', 'Enter the code from your email.');
      return;
    }
    if (mode === 'signup' && !username.trim()) {
      Alert.alert('Missing username', 'Enter a username to complete signup.');
      return;
    }
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: 'email',
      });
      if (error) throw error;

      if (mode === 'signup' && data.user && username.trim()) {
        await supabase.from('users_profile').update({
          username: username.trim(),
        }).eq('id', data.user.id);
      }

      router.replace('/home');
    } catch (err: any) {
      Alert.alert(mode === 'signup' ? 'Signup failed' : 'Sign-in failed', err?.message || 'Invalid or expired code.');
    } finally {
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
              <TouchableOpacity onPress={handleRequestCode} disabled={isRequesting} style={styles.resendBtn}>
                {isRequesting ? (
                  <ActivityIndicator color="#065F46" />
                ) : (
                  <Text style={styles.resendText}>Resend code</Text>
                )}
              </TouchableOpacity>
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
    alignItems: 'center',
    paddingVertical: 10,
  },
  resendText: {
    color: '#047857',
    fontWeight: '700',
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
