import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { useUserStore } from '../store/useUserStore';
import FloatingChat from '../components/FloatingChat';

export default function DashboardScreen() {
  const { contacts, relationships, agentDrafts } = useStore();
  const { profile, flags } = useUserStore();
  const router = useRouter();

  const pendingDrafts = agentDrafts.filter(d => d.status === 'PENDING').length;
  const isPro = profile?.subscriptionTier === 'PRO';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Nexus</Text>
          <Text style={styles.headerSubtitle}>Your Autonomous CRM</Text>
        </View>
        {isPro && (
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>⭐ PRO</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Metrics Overview */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>NETWORK</Text>
            <Text style={styles.metricValue}>{contacts.length}</Text>
            <Text style={styles.metricSubtext}>Nodes Active</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>CONNECTIONS</Text>
            <Text style={styles.metricValue}>{relationships.length}</Text>
            <Text style={[styles.metricSubtext, { color: '#60A5FA' }]}>Relationships Mapped</Text>
          </View>
        </View>

        {/* AI Agent Section — conditional on tier */}
        {isPro ? (
          <View style={styles.aiSection}>
            <View style={styles.aiSectionHeader}>
              <View>
                <Text style={styles.aiSectionLabel}>AI AGENT STATUS</Text>
                <Text style={styles.aiSectionTitle}>Autopilot Active</Text>
              </View>
              <View style={styles.aiIcon}>
                <Text style={{ fontSize: 24 }}>✨</Text>
              </View>
            </View>
            
            <Text style={styles.aiSectionDesc}>
              Your agent has analyzed your interaction lineage and prepared{' '}
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{pendingDrafts}</Text>{' '}
              messages for contacts you haven't spoken to recently.
            </Text>

            <TouchableOpacity 
              onPress={() => router.push('/inbox')}
              style={styles.reviewDraftsButton}
            >
              <Text style={styles.reviewDraftsButtonText}>Review Drafts →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* FREE Tier — Upgrade Prompt */
          <TouchableOpacity 
            style={styles.upgradeSection}
            onPress={() => router.push('/pricing')}
            activeOpacity={0.85}
          >
            <View style={styles.upgradeSectionHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.upgradeLabel}>
                  <Text style={styles.upgradeLabelText}>PRO FEATURE</Text>
                </View>
                <Text style={styles.upgradeSectionTitle}>AI Autopilot</Text>
                <Text style={styles.upgradeSectionDesc}>
                  Unlock AI-powered draft messages. Your agent will monitor your network and draft personalized check-ins for neglected contacts.
                </Text>
              </View>
              <View style={styles.upgradeIconContainer}>
                <Text style={{ fontSize: 40 }}>🔒</Text>
              </View>
            </View>
            <View style={styles.upgradeCTA}>
              <Text style={styles.upgradeCTAText}>Unlock with PRO →</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            onPress={() => router.push('/explore')}
            style={styles.actionCard}
          >
            <Text style={{ fontSize: 30, marginBottom: 8 }}>🕸️</Text>
            <Text style={styles.actionLabel}>View Map</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/pricing')}
            style={styles.actionCard}
          >
            <Text style={{ fontSize: 30, marginBottom: 8 }}>💎</Text>
            <Text style={styles.actionLabel}>{isPro ? 'Manage Plan' : 'Go PRO'}</Text>
          </TouchableOpacity>
        </View>

        {/* Network Health — PRO only */}
        {isPro && (
          <View style={styles.healthSection}>
            <Text style={styles.sectionTitle}>Network Health</Text>
            <View style={styles.healthGrid}>
              <View style={styles.healthCard}>
                <Text style={styles.healthValue}>{pendingDrafts}</Text>
                <Text style={styles.healthLabel}>Pending Drafts</Text>
              </View>
              <View style={styles.healthCard}>
                <Text style={styles.healthValue}>{contacts.length > 0 ? Math.round((relationships.length / contacts.length) * 100) : 0}%</Text>
                <Text style={styles.healthLabel}>Connectivity</Text>
              </View>
              <View style={styles.healthCard}>
                <Text style={[styles.healthValue, { color: '#10B981' }]}>●</Text>
                <Text style={styles.healthLabel}>Agent Online</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <FloatingChat />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 24,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 2,
  },
  proBadge: {
    backgroundColor: '#4F46E520',
    borderWidth: 1,
    borderColor: '#818CF850',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  proBadgeText: {
    color: '#A5B4FC',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  metricLabel: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricSubtext: {
    color: '#10B981',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  // AI Section (PRO)
  aiSection: {
    backgroundColor: '#1a1635',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#4F46E530',
    marginBottom: 24,
  },
  aiSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  aiSectionLabel: {
    color: '#A5B4FC',
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 10,
    marginBottom: 4,
  },
  aiSectionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  aiIcon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#4F46E520',
    borderWidth: 1,
    borderColor: '#818CF850',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSectionDesc: {
    color: '#94A3B8',
    marginBottom: 20,
    lineHeight: 22,
    fontSize: 15,
  },
  reviewDraftsButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDraftsButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  // Upgrade Section (FREE)
  upgradeSection: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F5970030',
    marginBottom: 24,
  },
  upgradeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  upgradeLabel: {
    backgroundColor: '#F5970020',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  upgradeLabelText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  upgradeSectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  upgradeSectionDesc: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 21,
  },
  upgradeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeCTA: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  upgradeCTAText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  // Quick Actions
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  // Network Health
  healthSection: {
    marginBottom: 24,
  },
  healthGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  healthCard: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  healthValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  healthLabel: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
