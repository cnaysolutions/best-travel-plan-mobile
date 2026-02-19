import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, ActivityIndicator, KeyboardAvoidingView,
  ScrollView, Alert,
} from 'react-native';
import { Compass, Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '@/config/supabase';

const C = {
  navy: '#1E2A36', ivory: '#F7F5F2', ivoryDark: '#EDE9E3',
  champagne: '#D6C5A3', champagneLight: '#EDE4D0', muted: '#6B7280',
  card: '#FFFFFF', accent: '#C9A24D', border: '#D6C5A3',
};

export default function AuthScreen({ onSuccess }: { onSuccess?: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        onSuccess?.();
      } else {
        const { error: err } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName } },
        });
        if (err) throw err;
        Alert.alert('Check your email', 'We sent a confirmation link to your inbox.');
      }
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

          {/* Brand */}
          <View style={s.brand}>
            <View style={s.brandIcon}>
              <Compass color={C.champagne} size={28} />
            </View>
            <Text style={s.brandName}>Best Holiday Plan</Text>
            <Text style={s.brandSub}>Your private travel cost advisor</Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            {/* Tabs */}
            <View style={s.tabs}>
              <TouchableOpacity
                style={[s.tab, mode === 'login' && s.tabActive]}
                onPress={() => { setMode('login'); setError(''); }}
              >
                <Text style={[s.tabText, mode === 'login' && s.tabTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.tab, mode === 'signup' && s.tabActive]}
                onPress={() => { setMode('signup'); setError(''); }}
              >
                <Text style={[s.tabText, mode === 'signup' && s.tabTextActive]}>Create Account</Text>
              </TouchableOpacity>
            </View>

            <View style={s.form}>
              {mode === 'signup' && (
                <View style={s.fieldGroup}>
                  <Text style={s.label}>Full Name</Text>
                  <View style={s.inputWrap}>
                    <User color={C.champagne} size={16} />
                    <TextInput
                      style={s.input} placeholder="Your full name"
                      placeholderTextColor={C.muted} value={fullName}
                      onChangeText={setFullName} autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              <View style={s.fieldGroup}>
                <Text style={s.label}>Email Address</Text>
                <View style={s.inputWrap}>
                  <Mail color={C.champagne} size={16} />
                  <TextInput
                    style={s.input} placeholder="your@email.com"
                    placeholderTextColor={C.muted} value={email}
                    onChangeText={setEmail} keyboardType="email-address"
                    autoCapitalize="none" autoCorrect={false}
                  />
                </View>
              </View>

              <View style={s.fieldGroup}>
                <Text style={s.label}>Password</Text>
                <View style={s.inputWrap}>
                  <Lock color={C.champagne} size={16} />
                  <TextInput
                    style={s.input} placeholder="Password"
                    placeholderTextColor={C.muted} value={password}
                    onChangeText={setPassword} secureTextEntry={!showPw}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                    {showPw
                      ? <EyeOff color={C.muted} size={16} />
                      : <Eye color={C.muted} size={16} />
                    }
                  </TouchableOpacity>
                </View>
              </View>

              {!!error && <Text style={s.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[s.submitBtn, loading && { opacity: 0.6 }]}
                onPress={submit}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color={C.ivory} size="small" />
                  : <Text style={s.submitText}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
                }
              </TouchableOpacity>
            </View>
          </View>

          <Text style={s.footer}>
            Travel planning that feels handled.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.ivory },
  content: { padding: 24, paddingTop: 48, paddingBottom: 40 },

  brand: { alignItems: 'center', marginBottom: 32 },
  brandIcon: {
    width: 72, height: 72, borderRadius: 20, backgroundColor: C.navy,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  brandName: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 28, fontWeight: '600', color: C.navy, marginBottom: 4,
  },
  brandSub: { fontSize: 14, color: C.muted },

  card: {
    backgroundColor: C.card, borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: C.champagneLight,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 4,
  },

  tabs: { flexDirection: 'row', backgroundColor: C.ivoryDark },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { backgroundColor: C.card, borderBottomWidth: 2, borderBottomColor: C.accent },
  tabText: { fontSize: 14, fontWeight: '500', color: C.muted },
  tabTextActive: { color: C.navy, fontWeight: '600' },

  form: { padding: 20, gap: 0 },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '500', color: C.navy, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.ivory, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 13,
    borderWidth: 1, borderColor: C.border,
  },
  input: { flex: 1, fontSize: 14, color: C.navy, padding: 0 },

  errorText: { fontSize: 13, color: '#EF4444', marginBottom: 12 },

  submitBtn: {
    backgroundColor: C.navy, borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 4,
  },
  submitText: { color: C.ivory, fontSize: 15, fontWeight: '600' },

  footer: { textAlign: 'center', fontSize: 13, color: C.muted, marginTop: 28 },
});
