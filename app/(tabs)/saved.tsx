import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Heart, MapPin, Calendar, DollarSign } from 'lucide-react-native';

export default function SavedScreen() {
  const savedTrips = [
    {
      id: 1,
      destination: 'Paris, France',
      dates: 'Jun 15 - Jun 22, 2024',
      budget: '$2,500',
      travelers: 2,
    },
    {
      id: 2,
      destination: 'Tokyo, Japan',
      dates: 'Aug 10 - Aug 20, 2024',
      budget: '$3,800',
      travelers: 1,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Trips</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {savedTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart color="#d1d5db" size={64} />
            <Text style={styles.emptyTitle}>No saved trips yet</Text>
            <Text style={styles.emptyText}>
              Start planning your dream trip and save it here
            </Text>
          </View>
        ) : (
          savedTrips.map((trip) => (
            <TouchableOpacity key={trip.id} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View style={styles.tripDestination}>
                  <MapPin color="#3b82f6" size={20} />
                  <Text style={styles.tripTitle}>{trip.destination}</Text>
                </View>
                <Heart color="#ef4444" size={24} fill="#ef4444" />
              </View>

              <View style={styles.tripDetails}>
                <View style={styles.tripDetail}>
                  <Calendar color="#6b7280" size={16} />
                  <Text style={styles.tripDetailText}>{trip.dates}</Text>
                </View>

                <View style={styles.tripDetail}>
                  <DollarSign color="#6b7280" size={16} />
                  <Text style={styles.tripDetailText}>{trip.budget}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  tripCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tripDestination: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  tripDetails: {
    marginBottom: 16,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDetailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
