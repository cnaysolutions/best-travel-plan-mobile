import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User, Eye, EyeOff, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/config/supabase';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert('Check your email', 'We sent you a confirmation link. Please verify your email to continue.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <X color="#6b7280" size={22} />
          </TouchableOpacity>

          <LinearGradient colors={['#3b82f6', '#1d4ed8']} style={styles.logoWrap}>
            <Text style={styles.logoText}>✈️</Text>
          </LinearGradient>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join Best Travel Plan and start planning your trips</Text>

          <View style={styles.inputWrap}>
            <User color="#9ca3af" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9ca3af"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrap}>
            <Mail color="#9ca3af" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrap}>
            <Lock color="#9ca3af" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff color="#9ca3af" size={20} /> : <Eye color="#9ca3af" size={20} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
            <LinearGradient colors={['#3b82f6', '#1d4ed8']} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnText}>Create Account</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.terms}>By creating an account, you agree to our Terms of Service and Privacy Policy at best-travel-plan.cloud</Text>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/auth/login')}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 24, paddingTop: 60, alignItems: 'center' },
  closeBtn: { position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },

  logoWrap: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  logoText: { fontSize: 32 },
  title: { fontSize: 26, fontWeight: '800', color: '#1f2937', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#6b7280', marginBottom: 32, textAlign: 'center' },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    width: '100%', backgroundColor: '#f9fafb', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 12, borderWidth: 1.5, borderColor: '#e5e7eb',
  },
  input: { flex: 1, fontSize: 15, color: '#1f2937' },

  btn: { width: '100%', borderRadius: 14, overflow: 'hidden', marginTop: 8, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  terms: { fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 12, lineHeight: 18 },

  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerText: { fontSize: 14, color: '#9ca3af' },

  signInRow: { flexDirection: 'row', alignItems: 'center' },
  signInText: { fontSize: 15, color: '#6b7280' },
  signInLink: { fontSize: 15, color: '#3b82f6', fontWeight: '700' },
});
