import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useUserStore } from '../store/useUserStore';

const FEATURES_FREE = [
  { icon: '👤', label: 'Up to 50 Contacts' },
  { icon: '🕸️', label: 'Interactive Network Graph' },
  { icon: '🏷️', label: 'Custom Badges & Tags' },
  { icon: '📝', label: 'Interaction Lineage Timeline' },
  { icon: '🔗', label: 'Social Media Links' },
];

const FEATURES_PRO = [
  { icon: '♾️', label: 'Unlimited Contacts' },
  { icon: '🤖', label: 'AI-Powered Draft Messages' },
  { icon: '💬', label: 'Conversational AI Chatbot' },
  { icon: '⏰', label: 'Automated "Stay in Touch" Alerts' },
  { icon: '🔮', label: 'Social Media Auto-Enrichment' },
  { icon: '🧠', label: 'Relationship Intelligence Insights' },
  { icon: '⚡', label: 'Priority Support' },
];

export default function PricingScreen() {
  const { profile, isUpgrading, fetchProfile, fetchFlags, upgradeToPro, downgradeToFree } = useUserStore();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchFlags();
  }, []);

  const isPro = profile?.subscriptionTier === 'PRO';

  const handleUpgrade = async () => {
    const success = await upgradeToPro();
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }
  };

  const handleDowngrade = async () => {
    await downgradeToFree();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription</Text>
        <Text style={styles.headerSubtitle}>
          {isPro ? '✨ You\'re on Nexus PRO' : 'Unlock the full power of Nexus'}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Success Toast */}
        {showSuccess && (
          <View style={styles.successToast}>
            <Text style={styles.successToastText}>🎉 Welcome to Nexus PRO! All features unlocked.</Text>
          </View>
        )}

        {/* Current Plan Badge */}
        <View style={styles.currentPlanRow}>
          <View style={[styles.currentPlanBadge, isPro ? styles.proBadge : styles.freeBadge]}>
            <Text style={[styles.currentPlanBadgeText, isPro ? styles.proBadgeText : styles.freeBadgeText]}>
              {isPro ? '⭐ PRO' : 'FREE'} PLAN
            </Text>
          </View>
          <Text style={styles.currentPlanEmail}>{profile?.email || 'Loading...'}</Text>
        </View>

        {/* Pricing Cards Container */}
        <View style={styles.cardsContainer}>
          {/* FREE Tier Card */}
          <View style={[styles.card, styles.freeCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTierLabel}>Starter</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceAmount}>$0</Text>
                <Text style={styles.pricePeriod}>/month</Text>
              </View>
              <Text style={styles.cardDesc}>Essential relationship tracking</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.featuresList}>
              {FEATURES_FREE.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                  <Text style={styles.featureLabel}>{f.label}</Text>
                </View>
              ))}
            </View>

            {isPro && (
              <TouchableOpacity style={styles.downgradeButton} onPress={handleDowngrade} disabled={isUpgrading}>
                <Text style={styles.downgradeButtonText}>Downgrade to Free</Text>
              </TouchableOpacity>
            )}
            {!isPro && (
              <View style={styles.currentPlanButton}>
                <Text style={styles.currentPlanButtonText}>Current Plan</Text>
              </View>
            )}
          </View>

          {/* PRO Tier Card */}
          <View style={[styles.card, styles.proCard]}>
            {/* Popular Badge */}
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>✨ MOST POPULAR</Text>
            </View>

            <View style={styles.cardHeader}>
              <Text style={[styles.cardTierLabel, styles.proTierLabel]}>PRO</Text>
              <View style={styles.priceRow}>
                <Text style={[styles.priceAmount, styles.proPrice]}>$19</Text>
                <Text style={[styles.pricePeriod, styles.proPricePeriod]}>/month</Text>
              </View>
              <Text style={[styles.cardDesc, styles.proDesc]}>AI-powered autonomous CRM</Text>
            </View>

            <View style={[styles.divider, styles.proDivider]} />

            <View style={styles.featuresList}>
              <Text style={styles.proIncludesText}>Everything in Free, plus:</Text>
              {FEATURES_PRO.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                  <Text style={[styles.featureLabel, styles.proFeatureLabel]}>{f.label}</Text>
                </View>
              ))}
            </View>

            {isPro ? (
              <View style={styles.proCurrentPlanButton}>
                <Text style={styles.proCurrentPlanButtonText}>⭐ Current Plan</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgrade}
                disabled={isUpgrading}
                activeOpacity={0.85}
              >
                {isUpgrading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.upgradeButtonText}>Upgrade to PRO →</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Trust / Info Section */}
        <View style={styles.trustSection}>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>🔒</Text>
            <View>
              <Text style={styles.trustTitle}>Secure Payments</Text>
              <Text style={styles.trustDesc}>Powered by Stripe. Your data is safe.</Text>
            </View>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>🔄</Text>
            <View>
              <Text style={styles.trustTitle}>Cancel Anytime</Text>
              <Text style={styles.trustDesc}>No lock-in. Downgrade at any time.</Text>
            </View>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>💎</Text>
            <View>
              <Text style={styles.trustTitle}>14-Day Free Trial</Text>
              <Text style={styles.trustDesc}>Try PRO risk-free for two weeks.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  successToast: {
    backgroundColor: '#065F4620',
    borderWidth: 1,
    borderColor: '#10B98150',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  successToastText: {
    color: '#34D399',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
  currentPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  currentPlanBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  freeBadge: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  proBadge: {
    backgroundColor: '#4F46E520',
    borderColor: '#818CF850',
  },
  currentPlanBadgeText: {
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  freeBadgeText: {
    color: '#9CA3AF',
  },
  proBadgeText: {
    color: '#A5B4FC',
  },
  currentPlanEmail: {
    color: '#6B7280',
    fontSize: 14,
  },
  cardsContainer: {
    ...(Platform.OS === 'web' ? { flexDirection: 'row' as const } : {}),
    gap: 20,
    marginBottom: 32,
  },
  card: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
  },
  freeCard: {
    backgroundColor: '#111827',
    borderColor: '#1E293B',
  },
  proCard: {
    backgroundColor: '#1a1635',
    borderColor: '#4F46E540',
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4F46E530',
    borderWidth: 1,
    borderColor: '#818CF850',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  popularBadgeText: {
    color: '#A5B4FC',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTierLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  proTierLabel: {
    color: '#A5B4FC',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  proPrice: {
    color: '#FFFFFF',
  },
  pricePeriod: {
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 4,
  },
  proPricePeriod: {
    color: '#818CF8',
  },
  cardDesc: {
    color: '#6B7280',
    fontSize: 14,
  },
  proDesc: {
    color: '#94A3B8',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginBottom: 20,
  },
  proDivider: {
    backgroundColor: '#4F46E530',
  },
  featuresList: {
    gap: 14,
    marginBottom: 24,
  },
  proIncludesText: {
    color: '#818CF8',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 18,
  },
  featureLabel: {
    color: '#D1D5DB',
    fontSize: 15,
    fontWeight: '500',
  },
  proFeatureLabel: {
    color: '#E0E7FF',
  },
  currentPlanButton: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  currentPlanButtonText: {
    color: '#6B7280',
    fontWeight: '700',
    fontSize: 15,
  },
  downgradeButton: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  downgradeButtonText: {
    color: '#9CA3AF',
    fontWeight: '700',
    fontSize: 15,
  },
  proCurrentPlanButton: {
    backgroundColor: '#4F46E520',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#818CF850',
  },
  proCurrentPlanButtonText: {
    color: '#A5B4FC',
    fontWeight: '700',
    fontSize: 15,
  },
  upgradeButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.3,
  },
  trustSection: {
    gap: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  trustIcon: {
    fontSize: 28,
  },
  trustTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  trustDesc: {
    color: '#6B7280',
    fontSize: 13,
  },
});
