import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Heart, MapPin, Calendar, Users, DollarSign, Trash2 } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/config/supabase';

type SavedTrip = {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  travelers: number;
  total_cost: number;
  cost_breakdown: any;
  created_at: string;
};

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function nights(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
}

export default function SavedScreen() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadTrips = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setTrips(data);
    } catch {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { loadTrips(); }, []));

  const deleteTrip = async (id: string) => {
    Alert.alert('Delete Trip', 'Are you sure you want to remove this saved trip?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('saved_trips').delete().eq('id', id);
          if (!error) setTrips(prev => prev.filter(t => t.id !== id));
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}><Text style={styles.headerTitle}>Saved Trips</Text></View>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Trips</Text>
        {trips.length > 0 && <Text style={styles.headerCount}>{trips.length} trips</Text>}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadTrips(true)} tintColor="#3b82f6" />}
        contentContainerStyle={trips.length === 0 ? styles.emptyContainer : { padding: 16, paddingBottom: 24 }}
      >
        {!isLoggedIn ? (
          <View style={styles.emptyState}>
            <Heart color="#d1d5db" size={64} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Sign in to view saved trips</Text>
            <Text style={styles.emptyText}>Create an account to save and sync your trip plans across devices</Text>
          </View>
        ) : trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart color="#d1d5db" size={64} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No saved trips yet</Text>
            <Text style={styles.emptyText}>Plan a trip and tap "Save Trip" to see it here</Text>
          </View>
        ) : (
          trips.map((trip) => (
            <View key={trip.id} style={styles.card}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.destRow}>
                  <MapPin color="#3b82f6" size={18} />
                  <Text style={styles.destName}>{trip.destination}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteTrip(trip.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Trash2 color="#ef4444" size={18} />
                </TouchableOpacity>
              </View>

              {/* Details */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Calendar color="#6b7280" size={15} />
                  <Text style={styles.detailText}>
                    {fmtDate(trip.start_date)} – {fmtDate(trip.end_date)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Users color="#6b7280" size={15} />
                  <Text style={styles.detailText}>{trip.travelers} traveller{trip.travelers > 1 ? 's' : ''}</Text>
                </View>
                <View style={styles.detailItem}>
                  <DollarSign color="#6b7280" size={15} />
                  <Text style={styles.detailText}>{nights(trip.start_date, trip.end_date)} nights</Text>
                </View>
              </View>

              {/* Cost Breakdown */}
              {trip.cost_breakdown && (
                <View style={styles.breakdown}>
                  {[
                    { label: '✈️ Flights', key: 'flights' },
                    { label: '🏨 Hotel', key: 'accommodation' },
                    { label: '🚕 Transport', key: 'transport' },
                    { label: '🍽️ Food', key: 'food' },
                    { label: '🎭 Activities', key: 'activities' },
                  ].map(row => trip.cost_breakdown[row.key] > 0 && (
                    <View key={row.key} style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>{row.label}</Text>
                      <Text style={styles.breakdownValue}>{fmtMoney(trip.cost_breakdown[row.key])}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Total */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Estimate</Text>
                <Text style={styles.totalValue}>{fmtMoney(trip.total_cost)}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1f2937' },
  headerCount: { fontSize: 15, color: '#9ca3af', fontWeight: '600' },

  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, paddingTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#4b5563', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#9ca3af', textAlign: 'center', lineHeight: 22 },

  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14,
    borderWidth: 1.5, borderColor: '#e5e7eb',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  destRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  destName: { fontSize: 18, fontWeight: '800', color: '#1f2937' },

  detailsGrid: { gap: 6, marginBottom: 14 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14, color: '#6b7280' },

  breakdown: {
    backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: '#f3f4f6',
  },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  breakdownLabel: { fontSize: 14, color: '#374151' },
  breakdownValue: { fontSize: 14, fontWeight: '600', color: '#1f2937' },

  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 12, borderTopWidth: 1.5, borderTopColor: '#e5e7eb',
  },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#374151' },
  totalValue: { fontSize: 22, fontWeight: '800', color: '#3b82f6' },
});
