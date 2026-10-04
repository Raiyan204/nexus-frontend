import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useChatStore } from '../store/useChatStore';
import { useUserStore } from '../store/useUserStore';
import { useRouter } from 'expo-router';

export default function FloatingChat() {
  const { messages, isConnected, isChatOpen, toggleChat, connect, disconnect, sendMessage } = useChatStore();
  const { flags } = useUserStore();
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const aiEnabled = flags?.aiEnabled ?? false;
  const isPro = flags?.subscriptionTier === 'PRO';

  // Connect WebSocket on mount (only if AI is enabled)
  useEffect(() => {
    if (aiEnabled) {
      connect();
      return () => disconnect();
    }
  }, [aiEnabled]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  // Floating Action Button (always shown)
  if (!isChatOpen) {
    return (
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={toggleChat}
      >
        <Text style={styles.floatingButtonText}>{isPro ? '💬' : '🔒'}</Text>
      </TouchableOpacity>
    );
  }

  // If user is FREE, show upgrade prompt
  if (!aiEnabled) {
    return (
      <View style={styles.chatContainer}>
        {/* Header */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <View style={styles.lockedBadge}>
              <Text style={styles.lockedBadgeText}>PRO</Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleChat}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Upgrade Prompt */}
        <View style={styles.upgradePromptContainer}>
          <Text style={styles.upgradeEmoji}>🤖</Text>
          <Text style={styles.upgradeTitle}>Meet Your AI Assistant</Text>
          <Text style={styles.upgradeDescription}>
            Upgrade to PRO to unlock your personal AI CRM assistant. Add contacts, query relationships, and draft messages — all by just chatting.
          </Text>
          
          <View style={styles.featurePreview}>
            <View style={styles.previewItem}>
              <Text style={styles.previewIcon}>💬</Text>
              <Text style={styles.previewText}>"Add Sarah from the AI Summit"</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewIcon}>🔍</Text>
              <Text style={styles.previewText}>"Who do I know in real estate?"</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewIcon}>✉️</Text>
              <Text style={styles.previewText}>"Draft a follow-up to Bob"</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.upgradeCTA}
            onPress={() => { toggleChat(); router.push('/pricing'); }}
            activeOpacity={0.85}
          >
            <Text style={styles.upgradeCTAText}>Upgrade to PRO →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // PRO user — full chat experience
  return (
    <View style={styles.chatContainer}>
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <View style={[styles.statusDot, isConnected ? styles.statusConnected : styles.statusDisconnected]} />
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleChat}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messageList}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <View key={msg.id || index} style={[styles.messageBubbleRow, msg.sender === 'USER' ? styles.userRow : styles.assistantRow]}>
            <View style={[
              styles.messageBubble,
              msg.sender === 'USER' ? styles.userBubble :
              msg.sender === 'SYSTEM' ? styles.systemBubble : styles.assistantBubble
            ]}>
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
            <Text style={[styles.timestamp, msg.sender === 'USER' ? styles.timestampRight : styles.timestampLeft]}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="E.g. Connect Alice and Bob..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    borderRadius: 30,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: 24,
  },
  chatContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 24 : 0,
    right: Platform.OS === 'web' ? 24 : 0,
    width: Platform.OS === 'web' ? 400 : '100%',
    height: Platform.OS === 'web' ? 620 : '65%',
    zIndex: 999,
    backgroundColor: '#111827',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  headerBar: {
    backgroundColor: '#0F172A',
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusConnected: {
    backgroundColor: '#10B981',
  },
  statusDisconnected: {
    backgroundColor: '#EF4444',
  },
  proBadge: {
    backgroundColor: '#4F46E530',
    borderWidth: 1,
    borderColor: '#818CF850',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  proBadgeText: {
    color: '#A5B4FC',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  lockedBadge: {
    backgroundColor: '#F5970020',
    borderWidth: 1,
    borderColor: '#F5970050',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  lockedBadgeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closeButton: {
    color: '#6B7280',
    fontWeight: '700',
    fontSize: 22,
  },
  // Upgrade prompt styles
  upgradePromptContainer: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeEmoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  upgradeTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  upgradeDescription: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  featurePreview: {
    width: '100%',
    gap: 10,
    marginBottom: 28,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
  },
  previewIcon: {
    fontSize: 18,
  },
  previewText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontStyle: 'italic',
    flex: 1,
  },
  upgradeCTA: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
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
  // Chat message styles
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageBubbleRow: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  assistantRow: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#4F46E5',
    borderTopRightRadius: 4,
  },
  systemBubble: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#065F46',
    borderTopLeftRadius: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  timestampRight: {
    textAlign: 'right',
  },
  timestampLeft: {
    textAlign: 'left',
  },
  inputRow: {
    padding: 14,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1E293B',
    color: '#FFFFFF',
    padding: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#374151',
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 10,
    padding: 14,
    borderRadius: 24,
  },
  sendButtonActive: {
    backgroundColor: '#4F46E5',
  },
  sendButtonInactive: {
    backgroundColor: '#374151',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
