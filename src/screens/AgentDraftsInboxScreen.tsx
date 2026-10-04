import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import { useStore, AgentDraft } from '../store/useStore';
import { useUserStore } from '../store/useUserStore';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../constants/config';

export default function AgentDraftsInboxScreen() {
  const { agentDrafts, sendDraft, updateDraft } = useStore();
  const { profile } = useUserStore();
  const router = useRouter();
  const pendingDrafts = agentDrafts.filter(d => d.status === 'PENDING');
  const isPro = profile?.subscriptionTier === 'PRO';
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleEdit = (draft: AgentDraft) => {
    setEditingId(draft.id);
    setEditContent(draft.draftContent);
  };

  const handleSave = () => {
    if (editingId) {
      updateDraft(editingId, editContent);
      setEditingId(null);
    }
  };

  const handleSend = (id: string) => {
    sendDraft(id);
    alert('Message sent successfully!');
  };

  // FREE tier: show upgrade gate
  if (!isPro) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Agent Inbox</Text>
        </View>
        <View style={styles.upgradeGate}>
          <Text style={styles.gateEmoji}>📬</Text>
          <Text style={styles.gateTitle}>AI-Powered Drafts</Text>
          <Text style={styles.gateDescription}>
            Upgrade to PRO to unlock AI-generated follow-up messages. Your agent will scan your network and prepare personalized drafts for contacts you haven't reached out to recently.
          </Text>
          
          <View style={styles.gatePreview}>
            <View style={styles.mockDraftCard}>
              <View style={styles.mockDraftHeader}>
                <View style={styles.mockDraftDot} />
                <Text style={styles.mockDraftTo}>To: Bob Johnson</Text>
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>AI</Text>
                </View>
              </View>
              <Text style={styles.mockDraftText}>
                "Hi Bob, it's been over 6 months since we last connected! I wanted to check in and see how your portfolio is doing..."
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.upgradeCTA}
            onPress={() => router.push('/pricing')}
            activeOpacity={0.85}
          >
            <Text style={styles.upgradeCTAText}>Unlock AI Drafts with PRO →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // PRO tier: full inbox
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Agent Inbox</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{pendingDrafts.length}</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={async () => {
            await fetch(`${API_BASE_URL}/api/drafts/generate`, { method: 'POST' });
            alert('Agent cron triggered!');
            setTimeout(() => useStore.getState().fetchData(), 2000);
          }}
          style={styles.generateButton}
        >
          <Text style={styles.generateButtonText}>⚡ Generate</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 }}>
        {pendingDrafts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyDesc}>No pending drafts to review. Your AI agent is monitoring your network.</Text>
          </View>
        ) : (
          pendingDrafts.map(draft => (
            <View key={draft.id} style={styles.draftCard}>
              {/* Draft Header */}
              <View style={styles.draftHeader}>
                <Text style={styles.draftTo}>To: {draft.contact?.firstName} {draft.contact?.lastName}</Text>
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>AI GENERATED</Text>
                </View>
              </View>

              {/* Draft Content or Editor */}
              {editingId === draft.id ? (
                <TextInput
                  style={styles.editor}
                  multiline
                  value={editContent}
                  onChangeText={setEditContent}
                  textAlignVertical="top"
                />
              ) : (
                <Text style={styles.draftContent}>{draft.draftContent}</Text>
              )}

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                {editingId === draft.id ? (
                  <TouchableOpacity onPress={handleSave} style={styles.editButton}>
                    <Text style={styles.editButtonText}>Save</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => handleEdit(draft)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>✏️ Edit</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity onPress={() => handleSend(draft.id)} style={styles.sendButton}>
                  <Text style={styles.sendButtonText}>Send →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 20,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyDesc: {
    color: '#6B7280',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  // Draft card
  draftCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  draftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  draftTo: {
    fontSize: 17,
    color: '#60A5FA',
    fontWeight: '700',
  },
  aiBadge: {
    backgroundColor: '#4F46E520',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#818CF850',
  },
  aiBadgeText: {
    color: '#A5B4FC',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  draftContent: {
    color: '#D1D5DB',
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 24,
  },
  editor: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4F46E5',
    marginBottom: 20,
    minHeight: 120,
    fontSize: 15,
    lineHeight: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderRadius: 12,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // Upgrade Gate
  upgradeGate: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gateEmoji: {
    fontSize: 56,
    marginBottom: 20,
  },
  gateTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  gateDescription: {
    color: '#94A3B8',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    maxWidth: 400,
  },
  gatePreview: {
    width: '100%',
    maxWidth: 420,
    marginBottom: 28,
  },
  mockDraftCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  mockDraftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  mockDraftDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
  mockDraftTo: {
    color: '#60A5FA',
    fontWeight: '700',
    flex: 1,
  },
  mockDraftText: {
    color: '#6B7280',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  upgradeCTA: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  upgradeCTAText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
