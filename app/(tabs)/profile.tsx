import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { User, LogOut, Settings, ChevronRight, MapPin, CreditCard, Shield } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/config/supabase';

const C = {
  navy: '#1E2A36', ivoryDark: '#EDE9E3', ivory: '#F7F5F2',
  champagne: '#D6C5A3', champagneLight: '#EDE4D0', muted: '#6B7280',
  card: '#FFFFFF', accent: '#C9A24D', border: '#D6C5A3', white: '#FFFFFF',
};

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ trips: 0, countries: 0 });
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    loadProfile();
  }, []));

  const loadProfile = async () => {
    setLoading(true);
    const { data: { user: u } } = await supabase.auth.getUser();
    setUser(u);
    if (u) {
      const { data: trips } = await supabase.from('trips').select('destination_city').eq('user_id', u.id);
      if (trips) {
        const countries = new Set(trips.map((t: any) => t.destination_city?.split('(')[0]?.trim()));
        setStats({ trips: trips.length, countries: countries.size });
      }
    }
    setLoading(false);
  };

  const signOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
          await supabase.auth.signOut();
          setUser(null);
          setStats({ trips: 0, countries: 0 });
      }},
    ]);
  };

  const getInitials = () => {
    const name = user?.user_metadata?.full_name || user?.email || '';
    return name.charAt(0).toUpperCase();
  };

  if (loading) return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}><ActivityIndicator size="large" color={C.navy} /></View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Header */}
        <View style={s.pageHeader}>
          <Text style={s.pageTitle}>Profile</Text>
        </View>

        {user ? (
          <>
            {/* Avatar + Name */}
            <View style={s.avatarCard}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{getInitials()}</Text>
              </View>
              <View style={s.avatarInfo}>
                <Text style={s.userName}>
                  {user.user_metadata?.full_name || 'Traveller'}
                </Text>
                <Text style={s.userEmail}>{user.email}</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={s.statsRow}>
              <View style={s.statCard}>
                <Text style={s.statValue}>{stats.trips}</Text>
                <Text style={s.statLabel}>Trips Planned</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statCard}>
                <Text style={s.statValue}>{stats.countries}</Text>
                <Text style={s.statLabel}>Destinations</Text>
              </View>
            </View>

            {/* Menu */}
            <View style={s.menuCard}>
              <MenuItem icon={<Settings color={C.accent} size={18} />} label="Settings" />
              <View style={s.menuDivider} />
              <MenuItem icon={<Shield color={C.accent} size={18} />} label="Privacy Policy" />
              <View style={s.menuDivider} />
              <MenuItem icon={<CreditCard color={C.accent} size={18} />} label="Credits" />
            </View>

            <TouchableOpacity style={s.signOutBtn} onPress={signOut}>
              <LogOut color="#EF4444" size={18} />
              <Text style={s.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={s.guestState}>
            <View style={s.guestAvatar}>
              <User color={C.champagne} size={40} />
            </View>
            <Text style={s.guestTitle}>Not signed in</Text>
            <Text style={s.guestText}>
              Sign in to save trips, sync across devices and access your full trip history.
            </Text>
            <TouchableOpacity style={s.signInBtn}>
              <Text style={s.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <TouchableOpacity style={s.menuItem}>
      <View style={s.menuIconWrap}>{icon}</View>
      <Text style={s.menuLabel}>{label}</Text>
      <ChevronRight color={C.muted} size={16} />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F5F2' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 32 },

  pageHeader: {
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.champagneLight,
  },
  pageTitle: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 26, fontWeight: '600', color: C.navy },

  avatarCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    margin: 16, padding: 20, backgroundColor: C.white, borderRadius: 16,
    borderWidth: 1, borderColor: C.champagneLight,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: C.ivory, fontSize: 24, fontWeight: '700' },
  avatarInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '700', color: C.navy, marginBottom: 2 },
  userEmail: { fontSize: 13, color: C.muted },

  statsRow: {
    flexDirection: 'row', marginHorizontal: 16, marginBottom: 14,
    backgroundColor: C.white, borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: C.champagneLight,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statCard: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: C.champagneLight, marginVertical: 4 },
  statValue: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 28, fontWeight: '700', color: C.navy },
  statLabel: { fontSize: 12, color: C.muted, marginTop: 2 },

  menuCard: {
    marginHorizontal: 16, marginBottom: 14, backgroundColor: C.white, borderRadius: 16,
    borderWidth: 1, borderColor: C.champagneLight,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  menuIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.champagneLight, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: C.navy },
  menuDivider: { height: 1, backgroundColor: C.ivoryDark, marginLeft: 64 },

  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginHorizontal: 16, padding: 16, borderRadius: 12,
    borderWidth: 1, borderColor: '#FCA5A5', backgroundColor: '#FFF5F5',
  },
  signOutText: { fontSize: 14, fontWeight: '600', color: '#EF4444' },

  guestState: { alignItems: 'center', padding: 40, paddingTop: 60 },
  guestAvatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: C.champagneLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  guestTitle: { fontSize: 20, fontWeight: '700', color: C.navy, marginBottom: 8 },
  guestText: { fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  signInBtn: {
    backgroundColor: C.navy, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40,
  },
  signInText: { color: C.ivory, fontSize: 15, fontWeight: '600' },
});
