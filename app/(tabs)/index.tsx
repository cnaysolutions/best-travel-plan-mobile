import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, Platform, Alert, ActivityIndicator,
  KeyboardAvoidingView, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plane, Calendar, MapPin, Users, ChevronDown, X, DollarSign, Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '@/config/supabase';
import { ENV } from '@/config/env';

const POPULAR = ['Paris', 'Tokyo', 'New York', 'Bali', 'Dubai', 'Barcelona', 'London', 'Rome'];

type CostBreakdown = {
  flights: number;
  accommodation: number;
  transport: number;
  food: number;
  activities: number;
  total: number;
  currency: string;
  nights: number;
  days: number;
};

type TravelerOption = { label: string; value: string };

const TRAVELER_OPTIONS: TravelerOption[] = [
  { label: '1 Person', value: '1' },
  { label: '2 People', value: '2' },
  { label: '3 People', value: '3' },
  { label: '4 People', value: '4' },
  { label: '5 People', value: '5' },
  { label: '6 People', value: '6' },
  { label: '7-10 People', value: '8' },
  { label: '10+ People', value: '12' },
];

function formatDate(d: Date | null) {
  if (!d) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateISO(d: Date) {
  return d.toISOString().split('T')[0];
}

function fmtMoney(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

export default function HomeScreen() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [travelers, setTravelers] = useState('2');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CostBreakdown | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);

  // Date pickers
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  // Traveler picker
  const [showTravelerPicker, setShowTravelerPicker] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedTravelerLabel = TRAVELER_OPTIONS.find(o => o.value === travelers)?.label ?? `${travelers} People`;

  const handlePlanTrip = useCallback(async () => {
    if (!destination.trim()) {
      Alert.alert('Missing Info', 'Please enter a destination.');
      return;
    }
    if (!startDate || !endDate) {
      Alert.alert('Missing Dates', 'Please select your travel dates.');
      return;
    }
    if (endDate <= startDate) {
      Alert.alert('Invalid Dates', 'End date must be after start date.');
      return;
    }

    setLoading(true);
    try {
      // Call the same API the website uses
      const response = await fetch(`${ENV.API_URL}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destination.trim(),
          startDate: formatDateISO(startDate),
          endDate: formatDateISO(endDate),
          travelers: parseInt(travelers),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setShowResult(true);
    } catch (err: any) {
      // Fallback: try direct Supabase edge function if REST API fails
      try {
        const { data, error } = await supabase.functions.invoke('plan-trip', {
          body: {
            destination: destination.trim(),
            startDate: formatDateISO(startDate!),
            endDate: formatDateISO(endDate!),
            travelers: parseInt(travelers),
          },
        });
        if (error) throw error;
        setResult(data);
        setShowResult(true);
      } catch {
        Alert.alert('Error', err?.message ?? 'Could not calculate trip cost. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [destination, startDate, endDate, travelers]);

  const handleSaveTrip = useCallback(async () => {
    if (!result) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Sign In Required', 'Please sign in to save trips.', [
          { text: 'Cancel', style: 'cancel' },
          // Navigation would go to login screen
        ]);
        return;
      }

      const { error } = await supabase.from('saved_trips').insert({
        user_id: user.id,
        destination,
        start_date: formatDateISO(startDate!),
        end_date: formatDateISO(endDate!),
        travelers: parseInt(travelers),
        total_cost: result.total,
        cost_breakdown: result,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
      Alert.alert('Saved!', 'Your trip has been saved.');
      setShowResult(false);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to save trip.');
    } finally {
      setSaving(false);
    }
  }, [result, destination, startDate, endDate, travelers]);

  const nights = startDate && endDate
    ? Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <LinearGradient colors={['#3b82f6', '#1d4ed8']} style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Best Travel Plan</Text>
              <Text style={styles.headerSubtitle}>Plan Your Complete Trip Cost in Minutes</Text>
            </View>
          </LinearGradient>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Where do you want to go?</Text>

            {/* Destination */}
            <View style={styles.inputContainer}>
              <MapPin color="#3b82f6" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Enter destination city or country"
                value={destination}
                onChangeText={setDestination}
                placeholderTextColor="#9ca3af"
                autoCorrect={false}
                returnKeyType="done"
              />
              {destination.length > 0 && (
                <TouchableOpacity onPress={() => setDestination('')}>
                  <X color="#9ca3af" size={18} />
                </TouchableOpacity>
              )}
            </View>

            {/* Popular Destinations */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {POPULAR.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[styles.chip, destination === city && styles.chipActive]}
                  onPress={() => setDestination(city)}
                >
                  <Text style={[styles.chipText, destination === city && styles.chipTextActive]}>
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Dates */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>When are you travelling?</Text>
            <View style={styles.dateRow}>
              {/* Start Date */}
              <TouchableOpacity
                style={[styles.inputContainer, styles.halfWidth]}
                onPress={() => { setShowEndPicker(false); setShowStartPicker(true); }}
              >
                <Calendar color="#3b82f6" size={18} />
                <Text style={[styles.input, !startDate && { color: '#9ca3af' }]}>
                  {startDate ? formatDate(startDate) : 'Start date'}
                </Text>
              </TouchableOpacity>

              {/* End Date */}
              <TouchableOpacity
                style={[styles.inputContainer, styles.halfWidth]}
                onPress={() => { setShowStartPicker(false); setShowEndPicker(true); }}
              >
                <Calendar color="#3b82f6" size={18} />
                <Text style={[styles.input, !endDate && { color: '#9ca3af' }]}>
                  {endDate ? formatDate(endDate) : 'End date'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Duration chip */}
            {nights > 0 && (
              <View style={styles.durationChip}>
                <Clock color="#3b82f6" size={14} />
                <Text style={styles.durationText}>{nights} night{nights !== 1 ? 's' : ''}</Text>
              </View>
            )}

            {/* iOS Date pickers */}
            {Platform.OS === 'ios' && showStartPicker && (
              <DateTimePicker
                value={startDate ?? today}
                mode="date"
                minimumDate={today}
                onChange={(_, d) => { setShowStartPicker(false); if (d) setStartDate(d); }}
              />
            )}
            {Platform.OS === 'ios' && showEndPicker && (
              <DateTimePicker
                value={endDate ?? (startDate ?? today)}
                mode="date"
                minimumDate={startDate ?? today}
                onChange={(_, d) => { setShowEndPicker(false); if (d) setEndDate(d); }}
              />
            )}

            {/* Android Date pickers */}
            {Platform.OS === 'android' && showStartPicker && (
              <DateTimePicker
                value={startDate ?? today}
                mode="date"
                minimumDate={today}
                display="default"
                onChange={(_, d) => { setShowStartPicker(false); if (d) setStartDate(d); }}
              />
            )}
            {Platform.OS === 'android' && showEndPicker && (
              <DateTimePicker
                value={endDate ?? (startDate ?? today)}
                mode="date"
                minimumDate={startDate ?? today}
                display="default"
                onChange={(_, d) => { setShowEndPicker(false); if (d) setEndDate(d); }}
              />
            )}

            {/* Travelers */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>How many travellers?</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowTravelerPicker(true)}
            >
              <Users color="#3b82f6" size={20} />
              <Text style={styles.input}>{selectedTravelerLabel}</Text>
              <ChevronDown color="#9ca3af" size={18} />
            </TouchableOpacity>

            {/* Plan Button */}
            <TouchableOpacity
              style={styles.planButton}
              onPress={handlePlanTrip}
              activeOpacity={0.85}
              disabled={loading}
            >
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                style={styles.planButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <>
                      <Plane color="#ffffff" size={20} />
                      <Text style={styles.planButtonText}>Calculate Trip Cost</Text>
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Traveler Picker Modal */}
      <Modal visible={showTravelerPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTravelerPicker(false)}
        >
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHandle} />
            <Text style={styles.pickerTitle}>Number of Travellers</Text>
            {TRAVELER_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.pickerOption, travelers === opt.value && styles.pickerOptionActive]}
                onPress={() => { setTravelers(opt.value); setShowTravelerPicker(false); }}
              >
                <Text style={[styles.pickerOptionText, travelers === opt.value && styles.pickerOptionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="slide">
        <View style={styles.resultOverlay}>
          <View style={styles.resultSheet}>
            <View style={styles.pickerHandle} />

            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.resultTitle}>✈️ {destination}</Text>
                <Text style={styles.resultSub}>
                  {formatDate(startDate!)} – {formatDate(endDate!)} · {travelers} traveller{parseInt(travelers) > 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowResult(false)}>
                <X color="#9ca3af" size={22} />
              </TouchableOpacity>
            </View>

            {result && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Cost rows */}
                {[
                  { label: '✈️  Flights', value: result.flights },
                  { label: '🏨  Accommodation', value: result.accommodation },
                  { label: '🚕  Local Transport', value: result.transport },
                  { label: '🍽️  Food & Dining', value: result.food },
                  { label: '🎭  Activities & Sights', value: result.activities },
                ].map(row => (
                  <View key={row.label} style={styles.costRow}>
                    <Text style={styles.costLabel}>{row.label}</Text>
                    <Text style={styles.costValue}>{fmtMoney(row.value, result.currency)}</Text>
                  </View>
                ))}

                <View style={styles.costTotalRow}>
                  <View>
                    <Text style={styles.costTotalLabel}>Total Estimate</Text>
                    <Text style={styles.costTotalSub}>for {result.nights} nights</Text>
                  </View>
                  <Text style={styles.costTotalValue}>{fmtMoney(result.total, result.currency)}</Text>
                </View>

                <View style={styles.resultActions}>
                  <TouchableOpacity style={styles.btnSecondary} onPress={() => setShowResult(false)}>
                    <Text style={styles.btnSecondaryText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnPrimary} onPress={handleSaveTrip} disabled={saving}>
                    {saving
                      ? <ActivityIndicator color="#fff" size="small" />
                      : <Text style={styles.btnPrimaryText}>💾  Save Trip</Text>
                    }
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerContent: { alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6 },
  headerSubtitle: { fontSize: 15, color: '#e0e7ff', textAlign: 'center', lineHeight: 22 },

  formContainer: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 12 },

  inputContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 12, borderWidth: 1.5, borderColor: '#e5e7eb',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  input: { flex: 1, fontSize: 15, color: '#1f2937' },
  dateRow: { flexDirection: 'row', gap: 10 },
  halfWidth: { flex: 1, marginBottom: 12 },

  chipsScroll: { marginBottom: 4, marginHorizontal: -4 },
  chip: {
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e7eb',
    borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, marginRight: 8, marginHorizontal: 4,
  },
  chipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  chipText: { fontSize: 14, color: '#3b82f6', fontWeight: '500' },
  chipTextActive: { color: '#fff' },

  durationChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#eff6ff', alignSelf: 'flex-start',
    borderRadius: 12, paddingVertical: 5, paddingHorizontal: 10, marginBottom: 8,
  },
  durationText: { fontSize: 13, color: '#3b82f6', fontWeight: '600' },

  planButton: {
    marginTop: 24, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8,
  },
  planButtonGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, gap: 10,
  },
  planButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  // Traveler Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  pickerSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24,
    paddingBottom: 40,
  },
  pickerHandle: { width: 40, height: 4, backgroundColor: '#d1d5db', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  pickerTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 16 },
  pickerOption: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, marginBottom: 4 },
  pickerOptionActive: { backgroundColor: '#eff6ff' },
  pickerOptionText: { fontSize: 16, color: '#374151' },
  pickerOptionTextActive: { color: '#3b82f6', fontWeight: '700' },

  // Result Modal
  resultOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  resultSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40, maxHeight: '85%',
  },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  resultTitle: { fontSize: 20, fontWeight: '800', color: '#1f2937', marginBottom: 4 },
  resultSub: { fontSize: 14, color: '#6b7280' },

  costRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  costLabel: { fontSize: 15, color: '#374151' },
  costValue: { fontSize: 15, fontWeight: '700', color: '#1f2937' },

  costTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 16, marginBottom: 4,
  },
  costTotalLabel: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  costTotalSub: { fontSize: 13, color: '#9ca3af' },
  costTotalValue: { fontSize: 28, fontWeight: '800', color: '#3b82f6' },

  resultActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  btnSecondary: {
    flex: 1, padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center',
  },
  btnSecondaryText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  btnPrimary: {
    flex: 2, padding: 14, borderRadius: 12, backgroundColor: '#3b82f6', alignItems: 'center',
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  btnPrimaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
