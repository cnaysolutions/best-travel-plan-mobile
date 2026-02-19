import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, Platform, Alert, ActivityIndicator,
  KeyboardAvoidingView, Modal, FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Plane, Calendar, Users, ChevronDown, X, Minus, Plus, Car, Hotel, Loader2 } from 'lucide-react-native';
import { supabase } from '@/config/supabase';

// ─── Website Theme Colors (exact match) ───────────────────────────────────────
const C = {
  navy: '#1E2A36',
  navyMedium: '#2C3E50',
  ivory: '#F7F5F2',
  ivoryDark: '#EDE9E3',
  champagne: '#D6C5A3',
  champagneLight: '#EDE4D0',
  foreground: '#1E2A36',
  muted: '#6B7280',
  border: '#D6C5A3',
  card: '#FFFFFF',
  accent: '#C9A24D',
  white: '#FFFFFF',
  destructive: '#EF4444',
};

type Airport = {
  id: number;
  name: string;
  city: string;
  country: string;
  iata_code: string;
  is_major: boolean;
};

type FlightClass = 'economy' | 'business' | 'first';

function formatDate(d: Date | null) {
  if (!d) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatDateISO(d: Date) {
  return d.toISOString().split('T')[0];
}

// Airport search component
function AirportSearch({
  label,
  placeholder,
  value,
  onSelect,
  onClear,
}: {
  label: string;
  placeholder: string;
  value: Airport | null;
  onSelect: (a: Airport) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [searching, setSearching] = useState(false);
  const [showList, setShowList] = useState(false);
  const timer = useRef<any>(null);

  const search = (q: string) => {
    setQuery(q);
    clearTimeout(timer.current);
    if (q.length < 2) { setResults([]); setShowList(false); return; }
    timer.current = setTimeout(async () => {
      setSearching(true);
      const { data } = await supabase
        .from('airports')
        .select('id, name, city, country, iata_code, is_major')
        .or(`city.ilike.%${q}%,iata_code.ilike.%${q}%,name.ilike.%${q}%`)
        .order('is_major', { ascending: false })
        .limit(8);
      setResults(data ?? []);
      setShowList(true);
      setSearching(false);
    }, 300);
  };

  const select = (airport: Airport) => {
    onSelect(airport);
    setQuery('');
    setResults([]);
    setShowList(false);
  };

  const clear = () => {
    onClear();
    setQuery('');
    setResults([]);
    setShowList(false);
  };

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <Plane color={C.champagne} size={16} />
        {value ? (
          <View style={styles.selectedAirport}>
            <Text style={styles.selectedAirportText}>
              {value.city} ({value.iata_code})
            </Text>
            <Text style={styles.selectedAirportSub}>{value.name}</Text>
          </View>
        ) : (
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor={C.muted}
            value={query}
            onChangeText={search}
            autoCorrect={false}
            autoCapitalize="none"
          />
        )}
        {searching && <ActivityIndicator size="small" color={C.champagne} />}
        {(value || query.length > 0) && (
          <TouchableOpacity onPress={clear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X color={C.muted} size={16} />
          </TouchableOpacity>
        )}
      </View>
      {showList && results.length > 0 && (
        <View style={styles.dropdown}>
          {results.map((a) => (
            <TouchableOpacity key={a.id} style={styles.dropdownItem} onPress={() => select(a)}>
              <Text style={styles.dropdownCode}>{a.iata_code}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.dropdownCity}>{a.city}</Text>
                <Text style={styles.dropdownName} numberOfLines={1}>{a.name} · {a.country}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// Passenger counter row
function PassengerRow({
  label, sublabel, value, onChange, min = 0,
}: { label: string; sublabel: string; value: number; onChange: (n: number) => void; min?: number }) {
  return (
    <View style={styles.passengerRow}>
      <View>
        <Text style={styles.passengerLabel}>{label}</Text>
        <Text style={styles.passengerSub}>{sublabel}</Text>
      </View>
      <View style={styles.passengerControls}>
        <TouchableOpacity
          style={[styles.counterBtn, value <= min && styles.counterBtnDisabled]}
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Minus color={value <= min ? C.muted : C.navy} size={14} />
        </TouchableOpacity>
        <Text style={styles.counterValue}>{value}</Text>
        <TouchableOpacity style={styles.counterBtn} onPress={() => onChange(value + 1)}>
          <Plus color={C.navy} size={14} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PlanTripScreen() {
  const [depAirport, setDepAirport] = useState<Airport | null>(null);
  const [destAirport, setDestAirport] = useState<Airport | null>(null);
  const [depDate, setDepDate] = useState<Date | null>(null);
  const [retDate, setRetDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [flightClass, setFlightClass] = useState<FlightClass>('economy');
  const [includeCarRental, setIncludeCarRental] = useState(true);
  const [includeHotel, setIncludeHotel] = useState(true);
  const [loading, setLoading] = useState(false);

  // Date picker state
  const [showDepPicker, setShowDepPicker] = useState(false);
  const [showRetPicker, setShowRetPicker] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isFormValid = Boolean(depAirport) && Boolean(destAirport) && Boolean(depDate) && Boolean(retDate) && adults > 0;

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert('Incomplete', 'Please fill in all required fields.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to plan your trip.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-dynamic-pricing', {
        body: {
          departureCity: `${depAirport!.city} (${depAirport!.iata_code})`,
          destinationCity: `${destAirport!.city} (${destAirport!.iata_code})`,
          departureLocation: {
            iataCode: depAirport!.iata_code,
            cityName: depAirport!.city,
            countryCode: depAirport!.country.substring(0, 2).toUpperCase(),
          },
          destinationLocation: {
            iataCode: destAirport!.iata_code,
            cityName: destAirport!.city,
            countryCode: destAirport!.country.substring(0, 2).toUpperCase(),
          },
          departureDate: formatDateISO(depDate!),
          returnDate: formatDateISO(retDate!),
          passengers: { adults, children, infants },
          flightClass,
          includeCarRental,
          includeHotel,
        },
      });
      if (error) throw error;

      // Save to trips table and navigate to results
      const { data: trip, error: tripErr } = await supabase.from('trips').insert({
        user_id: user.id,
        departure_city: `${depAirport!.city} (${depAirport!.iata_code})`,
        destination_city: `${destAirport!.city} (${destAirport!.iata_code})`,
        departure_date: formatDateISO(depDate!),
        return_date: formatDateISO(retDate!),
        adults, children, infants,
        flight_class: flightClass,
        include_car_rental: includeCarRental,
        include_hotel: includeHotel,
        trip_plan: data,
        status: 'complete',
      }).select().single();

      if (tripErr) throw tripErr;
      Alert.alert('Trip Planned!', 'Your trip plan has been saved. View it in Trips.');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not calculate trip costs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const classes: { value: FlightClass; label: string }[] = [
    { value: 'economy', label: 'Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Plan My Trip</Text>
            <Text style={styles.pageSubtitle}>
              Search from 6,000+ airports worldwide
            </Text>
          </View>

          {/* Card: Destination */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconWrap}>
                <Plane color={C.champagne} size={18} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Where would you like to go?</Text>
                <Text style={styles.cardSubtitle}>Search airports by city or IATA code</Text>
              </View>
            </View>

            <AirportSearch
              label="Departure Airport"
              placeholder="e.g. London, LHR, Dubai..."
              value={depAirport}
              onSelect={setDepAirport}
              onClear={() => setDepAirport(null)}
            />

            <AirportSearch
              label="Destination Airport"
              placeholder="e.g. Paris, CDG, New York..."
              value={destAirport}
              onSelect={setDestAirport}
              onClear={() => setDestAirport(null)}
            />
          </View>

          {/* Card: Dates */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconWrap}>
                <Calendar color={C.champagne} size={18} />
              </View>
              <View>
                <Text style={styles.cardTitle}>When works best for you?</Text>
              </View>
            </View>

            <View style={styles.datesRow}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Departure Date</Text>
                <TouchableOpacity
                  style={styles.inputWrap}
                  onPress={() => { setShowRetPicker(false); setShowDepPicker(true); }}
                >
                  <Calendar color={C.champagne} size={16} />
                  <Text style={[styles.textInput, !depDate && { color: C.muted }]}>
                    {depDate ? formatDate(depDate) : 'Pick a date'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: 10 }} />
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Return Date</Text>
                <TouchableOpacity
                  style={styles.inputWrap}
                  onPress={() => { setShowDepPicker(false); setShowRetPicker(true); }}
                >
                  <Calendar color={C.champagne} size={16} />
                  <Text style={[styles.textInput, !retDate && { color: C.muted }]}>
                    {retDate ? formatDate(retDate) : 'Pick a date'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDepPicker && (
              <DateTimePicker
                value={depDate ?? today}
                mode="date"
                minimumDate={today}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(_, d) => { setShowDepPicker(false); if (d) setDepDate(d); }}
              />
            )}
            {showRetPicker && (
              <DateTimePicker
                value={retDate ?? (depDate ?? today)}
                mode="date"
                minimumDate={depDate ?? today}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(_, d) => { setShowRetPicker(false); if (d) setRetDate(d); }}
              />
            )}
          </View>

          {/* Card: Passengers */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconWrap}>
                <Users color={C.champagne} size={18} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Who's coming along?</Text>
                <Text style={styles.cardSubtitle}>Add passengers and select cabin class</Text>
              </View>
            </View>

            <PassengerRow label="Adults" sublabel="Age 12+" value={adults} onChange={setAdults} min={1} />
            <View style={styles.divider} />
            <PassengerRow label="Children" sublabel="Age 2–11" value={children} onChange={setChildren} />
            <View style={styles.divider} />
            <PassengerRow label="Infants" sublabel="Under 2" value={infants} onChange={setInfants} />

            <Text style={[styles.label, { marginTop: 16, marginBottom: 8 }]}>Cabin Class</Text>
            <View style={styles.classRow}>
              {classes.map((c) => (
                <TouchableOpacity
                  key={c.value}
                  style={[styles.classBtn, flightClass === c.value && styles.classBtnActive]}
                  onPress={() => setFlightClass(c.value)}
                >
                  <Text style={[styles.classBtnText, flightClass === c.value && styles.classBtnTextActive]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Card: Options */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Optional Inclusions</Text>
            <Text style={[styles.cardSubtitle, { marginBottom: 12 }]}>
              Toggle items on or off to adjust your estimate
            </Text>

            <TouchableOpacity style={styles.toggleRow} onPress={() => setIncludeHotel(!includeHotel)}>
              <View style={styles.toggleLeft}>
                <View style={styles.toggleIconWrap}>
                  <Hotel color={C.champagne} size={16} />
                </View>
                <View>
                  <Text style={styles.toggleLabel}>Include Hotel</Text>
                  <Text style={styles.toggleSub}>Accommodation cost estimate</Text>
                </View>
              </View>
              <View style={[styles.toggle, includeHotel && styles.toggleActive]}>
                <View style={[styles.toggleThumb, includeHotel && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.toggleRow} onPress={() => setIncludeCarRental(!includeCarRental)}>
              <View style={styles.toggleLeft}>
                <View style={styles.toggleIconWrap}>
                  <Car color={C.champagne} size={16} />
                </View>
                <View>
                  <Text style={styles.toggleLabel}>Include Car Rental</Text>
                  <Text style={styles.toggleSub}>Airport pickup included</Text>
                </View>
              </View>
              <View style={[styles.toggle, includeCarRental && styles.toggleActive]}>
                <View style={[styles.toggleThumb, includeCarRental && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, !isFormValid && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid || loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={C.ivory} size="small" />
              : <>
                  <Plane color={C.ivory} size={18} />
                  <Text style={styles.submitBtnText}>Plan My Trip</Text>
                </>
            }
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.ivory },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  pageHeader: { marginBottom: 20, paddingTop: 8 },
  pageTitle: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 28, fontWeight: '600', color: C.navy, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: C.muted },

  card: {
    backgroundColor: C.card, borderRadius: 16, padding: 18, marginBottom: 14,
    borderWidth: 1, borderColor: C.champagneLight,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  cardIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: C.champagneLight, alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '600', color: C.navy, marginBottom: 2 },
  cardSubtitle: { fontSize: 13, color: C.muted },

  fieldGroup: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '500', color: C.navy, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.ivory, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: C.border,
  },
  textInput: { flex: 1, fontSize: 14, color: C.navy, padding: 0 },

  selectedAirport: { flex: 1 },
  selectedAirportText: { fontSize: 14, fontWeight: '600', color: C.navy },
  selectedAirportSub: { fontSize: 12, color: C.muted, marginTop: 1 },

  dropdown: {
    backgroundColor: C.white, borderRadius: 10, marginTop: 4,
    borderWidth: 1, borderColor: C.champagneLight,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6,
    zIndex: 99,
  },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: C.ivoryDark },
  dropdownCode: { fontSize: 14, fontWeight: '700', color: C.accent, width: 36 },
  dropdownCity: { fontSize: 14, fontWeight: '600', color: C.navy },
  dropdownName: { fontSize: 12, color: C.muted },

  datesRow: { flexDirection: 'row', marginBottom: 0 },

  passengerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  passengerLabel: { fontSize: 14, fontWeight: '500', color: C.navy },
  passengerSub: { fontSize: 12, color: C.muted, marginTop: 1 },
  passengerControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterBtn: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center', backgroundColor: C.white,
  },
  counterBtnDisabled: { opacity: 0.4 },
  counterValue: { fontSize: 18, fontWeight: '600', color: C.navy, minWidth: 24, textAlign: 'center' },

  classRow: { flexDirection: 'row', gap: 8 },
  classBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1,
    borderColor: C.border, alignItems: 'center', backgroundColor: C.white,
  },
  classBtnActive: { backgroundColor: C.navy, borderColor: C.navy },
  classBtnText: { fontSize: 13, fontWeight: '500', color: C.navy },
  classBtnTextActive: { color: C.ivory },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.champagneLight, alignItems: 'center', justifyContent: 'center' },
  toggleLabel: { fontSize: 14, fontWeight: '500', color: C.navy },
  toggleSub: { fontSize: 12, color: C.muted, marginTop: 1 },
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: '#D1D5DB', padding: 2 },
  toggleActive: { backgroundColor: C.accent },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.white },
  toggleThumbActive: { transform: [{ translateX: 20 }] },

  divider: { height: 1, backgroundColor: C.ivoryDark, marginVertical: 2 },

  submitBtn: {
    backgroundColor: C.navy, borderRadius: 12, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: C.ivory, fontSize: 16, fontWeight: '600' },
});
