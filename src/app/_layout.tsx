import { Tabs } from 'expo-router';
import { useColorScheme, Text } from 'react-native';
import '../global.css'; // Make sure global css is imported for NativeWind

import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useUserStore } from '../store/useUserStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const fetchData = useStore(state => state.fetchData);
  const { fetchProfile, fetchFlags } = useUserStore();

  useEffect(() => {
    fetchData();
    fetchProfile();
    fetchFlags();
  }, [fetchData]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderTopColor: isDark ? '#1E293B' : '#E2E8F0',
        },
        tabBarActiveTintColor: isDark ? '#818CF8' : '#4F46E5', // Indigo
        tabBarInactiveTintColor: isDark ? '#64748B' : '#94A3B8',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🕸️</Text>,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Drafts',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>📬</Text>,
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          title: 'Pro',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>💎</Text>,
        }}
      />
      <Tabs.Screen
        name="contact/[id]"
        options={{
          href: null, // Hide from the tab bar
        }}
      />
    </Tabs>
  );
}
