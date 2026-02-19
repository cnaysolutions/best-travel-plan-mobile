import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ActivityIndicator, TextInput,
} from 'react-native';
import {
  User, Settings, Bell, HelpCircle, LogOut, ChevronRight,
  Globe, Shield, Star, Edit3,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { supabase } from '@/config/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Stats = { trips: number; countries: number; total_budget: number };

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [stats, setStats] = useState<Stats>({ trips: 0, countries: 0, total_budget: 0 });
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Load stats from saved_trips
        const { data } = await supabase
          .from('saved_trips')
          .select('destination, total_cost')
          .eq('user_id', user.id);

        if (data) {
          const totalBudget = data.reduce((sum, t) => sum + (t.total_cost || 0), 0);
          const uniqueCountries = new Set(data.map(t => t.destination.split(',').pop()?.trim())).size;
          setStats({ trips: data.length, countries: uniqueCountries, total_budget: totalBudget });
        }
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  useFocusEffect(loadProfile);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          await supabase.auth.signOut();
          setUser(null);
          setSigningOut(false);
        },
      },
    ]);
  };

  const fmtBudget = (n: number) => {
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
    return `$${n}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>
        <View style={styles.center}><ActivityIndicator size="large" color="#3b82f6" /></View>
      </SafeAreaView>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>
        <View style={styles.center}>
          <View style={styles.authCard}>
            <View style={styles.authIcon}>
              <User color="#3b82f6" size={40} />
            </View>
            <Text style={styles.authTitle}>Sign in to your account</Text>
            <Text style={styles.authSub}>Save trips, sync across devices, and track your travel budget</Text>
            <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/auth/login')}>
              <Text style={styles.signInBtnText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signUpBtn} onPress={() => router.push('/auth/signup')}>
              <Text style={styles.signUpBtnText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const displayName = user.user_metadata?.full_name
    || user.user_metadata?.name
    || user.email?.split('@')[0]
    || 'Traveller';

  const menuItems = [
    { id: 'settings', title: 'Account Settings', icon: Settings, onPress: () => Alert.alert('Coming Soon', 'Account settings will be available in a future update.') },
    { id: 'notifications', title: 'Notifications', icon: Bell, onPress: () => Alert.alert('Coming Soon') },
    { id: 'website', title: 'Visit Website', icon: Globe, onPress: () => Alert.alert('Link', 'https://www.best-travel-plan.cloud') },
    { id: 'privacy', title: 'Privacy Policy', icon: Shield, onPress: () => {} },
    { id: 'help', title: 'Help & Support', icon: HelpCircle, onPress: () => {} },
    { id: 'rate', title: 'Rate the App', icon: Star, onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <User color="#3b82f6" size={36} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => Alert.alert('Coming Soon', 'Profile editing coming soon.')}>
            <Edit3 color="#3b82f6" size={16} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stats.trips}</Text>
            <Text style={styles.statLabel}>Trips{'\n'}Planned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stats.countries}</Text>
            <Text style={styles.statLabel}>Countries{'\n'}Explored</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{fmtBudget(stats.total_budget)}</Text>
            <Text style={styles.statLabel}>Total{'\n'}Budget</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, idx === menuItems.length - 1 && styles.menuItemLast]}
              onPress={item.onPress}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconWrap}>
                  <item.icon color="#3b82f6" size={18} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <ChevronRight color="#d1d5db" size={18} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} disabled={signingOut}>
          {signingOut
            ? <ActivityIndicator color="#ef4444" size="small" />
            : <>
                <LogOut color="#ef4444" size={18} />
                <Text style={styles.signOutText}>Sign Out</Text>
              </>
          }
        </TouchableOpacity>

        <Text style={styles.versionText}>Best Travel Plan • v1.0.0</Text>
        <Text style={styles.versionText}>www.best-travel-plan.cloud</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1f2937' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },

  authCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: 28,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  authIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#eff6ff',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  authTitle: { fontSize: 20, fontWeight: '800', color: '#1f2937', marginBottom: 8, textAlign: 'center' },
  authSub: { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  signInBtn: {
    width: '100%', backgroundColor: '#3b82f6', borderRadius: 14, paddingVertical: 15,
    alignItems: 'center', marginBottom: 10,
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  signInBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  signUpBtn: { width: '100%', borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb' },
  signUpBtnText: { color: '#374151', fontSize: 16, fontWeight: '600' },

  userCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 18, padding: 18, marginBottom: 14,
    borderWidth: 1.5, borderColor: '#e5e7eb',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  avatar: {
    width: 66, height: 66, borderRadius: 33, backgroundColor: '#eff6ff',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 17, fontWeight: '800', color: '#1f2937', marginBottom: 3 },
  userEmail: { fontSize: 14, color: '#9ca3af' },
  editBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#eff6ff',
    alignItems: 'center', justifyContent: 'center',
  },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb',
  },
  statNum: { fontSize: 22, fontWeight: '800', color: '#3b82f6', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#9ca3af', textAlign: 'center', lineHeight: 15 },

  menuSection: {
    backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden', marginBottom: 16,
    borderWidth: 1.5, borderColor: '#e5e7eb',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 15, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  menuText: { fontSize: 15, color: '#1f2937', fontWeight: '500' },

  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 14, paddingVertical: 15, marginBottom: 20,
    borderWidth: 1.5, borderColor: '#fee2e2',
  },
  signOutText: { fontSize: 15, color: '#ef4444', fontWeight: '700' },
  versionText: { textAlign: 'center', fontSize: 13, color: '#d1d5db', marginBottom: 4 },
});
