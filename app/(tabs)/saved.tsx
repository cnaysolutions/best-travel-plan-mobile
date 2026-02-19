import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, RefreshControl, Alert, Platform,
} from 'react-native';
import { MapPin, Calendar, Users, Plane, Car, Hotel, ChevronRight, Trash2 } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { supabase } from '@/config/supabase';

const C = {
  navy: '#1E2A36', navyMedium: '#2C3E50', ivory: '#F7F5F2', ivoryDark: '#EDE9E3',
  champagne: '#D6C5A3', champagneLight: '#EDE4D0', muted: '#6B7280',
  border: '#D6C5A3', card: '#FFFFFF', accent: '#C9A24D', white: '#FFFFFF',
};

type Trip = {
  id: string;
  departure_city: string;
  destination_city: string;
  departure_date: string;
  return_date: string;
  adults: number;
  children: number;
  infants: number;
  flight_class: string;
  include_car_rental: boolean;
  include_hotel: boolean;
  trip_plan: any;
  status: string;
  created_at: string;
};

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function nights(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
}

function fmtEur(n: number) {
  return `€${Math.round(n).toLocaleString('en-US')}`;
}

export default function TripsScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadTrips = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (!user) return;
      const { data } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setTrips(data);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  };

  useFocusEffect(useCallback(() => { loadTrips(); }, []));

  const deleteTrip = (id: string) => {
    Alert.alert('Delete Trip', 'Remove this trip plan?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          await supabase.from('trips').delete().eq('id', id);
          setTrips(prev => prev.filter(t => t.id !== id));
      }},
    ]);
  };

  const getTotalCost = (trip: Trip) => {
    const plan = trip.trip_plan;
    if (!plan) return null;
    return plan.totalCost ?? plan.total_cost ?? plan.total ?? null;
  };

  if (loading) return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pageHeader}><Text style={styles.pageTitle}>My Trips</Text></View>
      <View style={styles.center}><ActivityIndicator size="large" color={C.navy} /></View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>My Trips</Text>
        {trips.length > 0 && <Text style={styles.pageSub}>{trips.length} trip{trips.length > 1 ? 's' : ''} planned</Text>}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadTrips(true)} tintColor={C.navy} />}
        contentContainerStyle={!isLoggedIn || trips.length === 0 ? styles.emptyFlex : { padding: 16, paddingBottom: 24 }}
      >
        {!isLoggedIn ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✈️</Text>
            <Text style={styles.emptyTitle}>Sign in to view your trips</Text>
            <Text style={styles.emptyText}>Your planned trips will appear here once you sign in.</Text>
          </View>
        ) : trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyTitle}>No trips planned yet</Text>
            <Text style={styles.emptyText}>Use the Plan Trip tab to start your first trip estimate.</Text>
          </View>
        ) : (
          trips.map((trip) => {
            const total = getTotalCost(trip);
            const n = nights(trip.departure_date, trip.return_date);
            const pax = trip.adults + (trip.children ?? 0) + (trip.infants ?? 0);
            return (
              <View key={trip.id} style={styles.card}>
                {/* Route */}
                <View style={styles.routeRow}>
                  <View style={styles.routeLeft}>
                    <Text style={styles.routeFrom}>{trip.departure_city}</Text>
                    <Plane color={C.champagne} size={14} style={{ marginHorizontal: 6 }} />
                    <Text style={styles.routeTo}>{trip.destination_city}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteTrip(trip.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Trash2 color="#EF4444" size={16} />
                  </TouchableOpacity>
                </View>

                {/* Details */}
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Calendar color={C.muted} size={13} />
                    <Text style={styles.detailText}>{fmtDate(trip.departure_date)} – {fmtDate(trip.return_date)}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Users color={C.muted} size={13} />
                    <Text style={styles.detailText}>{pax} passenger{pax > 1 ? 's' : ''} · {n} nights</Text>
                  </View>
                </View>

                {/* Tags */}
                <View style={styles.tagsRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{trip.flight_class ?? 'Economy'}</Text>
                  </View>
                  {trip.include_hotel && (
                    <View style={styles.tag}>
                      <Hotel color={C.accent} size={11} />
                      <Text style={styles.tagText}>Hotel</Text>
                    </View>
                  )}
                  {trip.include_car_rental && (
                    <View style={styles.tag}>
                      <Car color={C.accent} size={11} />
                      <Text style={styles.tagText}>Car rental</Text>
                    </View>
                  )}
                </View>

                {/* Total */}
                {total != null && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Estimated Total</Text>
                    <Text style={styles.totalValue}>{fmtEur(total)}</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F5F2' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyFlex: { flex: 1 },

  pageHeader: {
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.champagneLight,
  },
  pageTitle: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 26, fontWeight: '600', color: C.navy },
  pageSub: { fontSize: 13, color: C.muted, marginTop: 2 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: C.navy, marginBottom: 8, textAlign: 'center' },
  emptyText: { fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 21 },

  card: {
    backgroundColor: C.white, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: C.champagneLight,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  routeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  routeLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  routeFrom: { fontSize: 15, fontWeight: '700', color: C.navy, flexShrink: 1 },
  routeTo: { fontSize: 15, fontWeight: '700', color: C.navy, flexShrink: 1 },

  detailsRow: { gap: 5, marginBottom: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, color: C.muted },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.champagneLight, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8,
  },
  tagText: { fontSize: 12, color: C.navy, fontWeight: '500', textTransform: 'capitalize' },

  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 10, borderTopWidth: 1, borderTopColor: C.ivoryDark,
  },
  totalLabel: { fontSize: 13, color: C.muted, fontWeight: '500' },
  totalValue: { fontSize: 22, fontWeight: '700', color: C.navy, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
});
