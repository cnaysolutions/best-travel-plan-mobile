import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plane, Calendar, MapPin, Users } from 'lucide-react-native';

export default function HomeScreen() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState('2');

  const handlePlanTrip = () => {
    // Navigate to trip planning details
    console.log('Planning trip to:', destination);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Best Travel Plan</Text>
            <Text style={styles.headerSubtitle}>
              Plan Your Complete Trip Cost in Minutes
            </Text>
          </View>
        </LinearGradient>

        {/* Trip Planning Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Where do you want to go?</Text>

          {/* Destination Input */}
          <View style={styles.inputContainer}>
            <MapPin color="#3b82f6" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter destination"
              value={destination}
              onChangeText={setDestination}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Date Inputs */}
          <View style={styles.dateRow}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Calendar color="#3b82f6" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Start date"
                value={startDate}
                onChangeText={setStartDate}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Calendar color="#3b82f6" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="End date"
                value={endDate}
                onChangeText={setEndDate}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Travelers Input */}
          <View style={styles.inputContainer}>
            <Users color="#3b82f6" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Number of travelers"
              value={travelers}
              onChangeText={setTravelers}
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Plan Trip Button */}
          <TouchableOpacity
            style={styles.planButton}
            onPress={handlePlanTrip}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8']}
              style={styles.planButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Plane color="#ffffff" size={20} />
              <Text style={styles.planButtonText}>Plan My Trip</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Popular Destinations */}
          <View style={styles.popularSection}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.destinationScroll}
            >
              {['Paris', 'Tokyo', 'New York', 'Bali', 'Dubai'].map((city) => (
                <TouchableOpacity
                  key={city}
                  style={styles.destinationCard}
                  onPress={() => setDestination(city)}
                >
                  <Text style={styles.destinationText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  planButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  planButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  planButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  popularSection: {
    marginTop: 30,
  },
  destinationScroll: {
    marginTop: 10,
  },
  destinationCard: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  destinationText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
});
