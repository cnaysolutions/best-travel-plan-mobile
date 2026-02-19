import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Plane, Briefcase, User } from 'lucide-react-native';

const C = {
  navy: '#1E2A36',
  ivory: '#F7F5F2',
  champagne: '#D6C5A3',
  accent: '#C9A24D',
  muted: '#9AA0A6',
  card: '#FFFFFF',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.navy,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
          shadowColor: C.navy,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarActiveTintColor: C.champagne,
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Plan Trip',
          tabBarIcon: ({ color, size }) => <Plane color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'My Trips',
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size - 2} />,
        }}
      />
    </Tabs>
  );
}
