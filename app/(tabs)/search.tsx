import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator, FlatList,
} from 'react-native';
import { Search as SearchIcon, MapPin, Clock, TrendingUp, X } from 'lucide-react-native';
import { supabase } from '@/config/supabase';
import { useRouter } from 'expo-router';

type SearchResult = {
  id: string;
  destination: string;
  country: string;
  region?: string;
  avg_cost_7days?: number;
  currency?: string;
};

type RecentSearch = {
  destination: string;
  searched_at: string;
};

const TRENDING = [
  { destination: 'Paris', country: 'France', avg_cost_7days: 2200 },
  { destination: 'Bali', country: 'Indonesia', avg_cost_7days: 1100 },
  { destination: 'Tokyo', country: 'Japan', avg_cost_7days: 2800 },
  { destination: 'New York', country: 'USA', avg_cost_7days: 3200 },
  { destination: 'Barcelona', country: 'Spain', avg_cost_7days: 1800 },
  { destination: 'Dubai', country: 'UAE', avg_cost_7days: 2500 },
];

function fmtMoney(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const loadRecentSearches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('search_history')
        .select('destination, searched_at')
        .eq('user_id', user.id)
        .order('searched_at', { ascending: false })
        .limit(6);
      if (data) setRecent(data);
    } catch {}
  };

  const doSearch = async (q: string) => {
    setSearching(true);
    try {
      const { data } = await supabase
        .from('destinations')
        .select('id, destination, country, region, avg_cost_7days, currency')
        .or(`destination.ilike.%${q}%,country.ilike.%${q}%`)
        .limit(20);
      setResults(data ?? []);
    } catch {
      // Fallback: filter trending locally
      setResults(
        TRENDING.filter(t =>
          t.destination.toLowerCase().includes(q.toLowerCase()) ||
          t.country.toLowerCase().includes(q.toLowerCase())
        ).map((t, i) => ({ id: String(i), ...t }))
      );
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = async (dest: string) => {
    // Log to search history
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('search_history').upsert({
          user_id: user.id,
          destination: dest,
          searched_at: new Date().toISOString(),
        });
      }
    } catch {}

    // Navigate to home with destination pre-filled
    // We use router navigation with params
    router.push({ pathname: '/', params: { destination: dest } });
  };

  const showTrending = query.length < 2 && results.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrap}>
          <SearchIcon color="#6b7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="#9ca3af"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X color="#9ca3af" size={18} />
            </TouchableOpacity>
          )}
          {searching && <ActivityIndicator size="small" color="#3b82f6" />}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Search results */}
        {query.length >= 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Results</Text>
            {results.length === 0 && !searching && (
              <Text style={styles.noResults}>No destinations found for "{query}"</Text>
            )}
            {results.map((item, idx) => (
              <TouchableOpacity key={item.id ?? idx} style={styles.item} onPress={() => handleSelect(item.destination)}>
                <View style={styles.itemLeft}>
                  <MapPin color="#3b82f6" size={18} />
                  <View>
                    <Text style={styles.itemName}>{item.destination}</Text>
                    <Text style={styles.itemSub}>{item.country}{item.region ? `, ${item.region}` : ''}</Text>
                  </View>
                </View>
                {item.avg_cost_7days && (
                  <Text style={styles.itemCost}>from {fmtMoney(item.avg_cost_7days)}/wk</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Searches */}
        {query.length < 2 && recent.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recent.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.item} onPress={() => handleSelect(item.destination)}>
                <View style={styles.itemLeft}>
                  <Clock color="#9ca3af" size={18} />
                  <Text style={styles.itemName}>{item.destination}</Text>
                </View>
                <Text style={styles.itemTime}>
                  {new Date(item.searched_at).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Trending */}
        {showTrending && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Trending Destinations</Text>
            {TRENDING.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.trendItem} onPress={() => handleSelect(item.destination)}>
                <View style={styles.trendRank}>
                  <Text style={styles.trendRankText}>{idx + 1}</Text>
                </View>
                <View style={styles.itemLeft}>
                  <View>
                    <Text style={styles.itemName}>{item.destination}</Text>
                    <Text style={styles.itemSub}>{item.country}</Text>
                  </View>
                </View>
                <View style={styles.trendCostWrap}>
                  <Text style={styles.trendCost}>{fmtMoney(item.avg_cost_7days)}</Text>
                  <Text style={styles.trendCostSub}>avg/week</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: '#fff' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1f2937' },

  searchBar: { backgroundColor: '#fff', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  searchInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#f3f4f6', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1f2937' },

  section: { padding: 20, paddingBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 12 },
  noResults: { fontSize: 15, color: '#9ca3af', textAlign: 'center', paddingVertical: 20 },

  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: '#e5e7eb',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  itemSub: { fontSize: 13, color: '#9ca3af', marginTop: 1 },
  itemCost: { fontSize: 13, fontWeight: '600', color: '#3b82f6' },
  itemTime: { fontSize: 13, color: '#9ca3af' },

  trendItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: '#e5e7eb',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  trendRank: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#eff6ff',
    alignItems: 'center', justifyContent: 'center',
  },
  trendRankText: { fontSize: 13, fontWeight: '800', color: '#3b82f6' },
  trendCostWrap: { alignItems: 'flex-end' },
  trendCost: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  trendCostSub: { fontSize: 11, color: '#9ca3af' },
});
