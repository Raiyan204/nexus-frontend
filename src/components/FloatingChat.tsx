import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useChatStore } from '../store/useChatStore';

export default function FloatingChat() {
  const { messages, isConnected, isChatOpen, toggleChat, connect, disconnect, sendMessage } = useChatStore();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  if (!isChatOpen) {
    return (
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={toggleChat}
        className="bg-blue-600 shadow-lg items-center justify-center rounded-full"
      >
        <Text className="text-white font-bold text-lg">💬</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.chatContainer} className="bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-700">
      {/* Header */}
      <View className="bg-gray-900 p-4 flex-row justify-between items-center border-b border-gray-700">
        <View className="flex-row items-center">
          <Text className="text-white font-bold text-lg">AI Assistant</Text>
          <View className={`ml-2 w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </View>
        <TouchableOpacity onPress={toggleChat}>
          <Text className="text-gray-400 font-bold text-xl">✕</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView 
        className="flex-1 p-4"
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <View key={msg.id || index} className={`mb-4 max-w-[85%] ${msg.sender === 'USER' ? 'self-end' : 'self-start'}`}>
            <View className={`p-3 rounded-2xl ${msg.sender === 'USER' ? 'bg-blue-600 rounded-tr-sm' : msg.sender === 'SYSTEM' ? 'bg-gray-700 rounded-tl-sm' : 'bg-green-700 rounded-tl-sm'}`}>
              <Text className="text-white">{msg.content}</Text>
            </View>
            <Text className={`text-xs text-gray-500 mt-1 ${msg.sender === 'USER' ? 'text-right' : 'text-left'}`}>
              {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="p-3 bg-gray-900 border-t border-gray-700 flex-row items-center">
          <TextInput
            className="flex-1 bg-gray-800 text-white p-3 rounded-full border border-gray-700"
            placeholder="E.g. Connect Alice and Bob..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity 
            className={`ml-2 p-3 rounded-full ${inputText.trim() ? 'bg-blue-600' : 'bg-gray-700'}`}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text className="text-white font-bold">↑</Text>
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
  },
  chatContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 24 : 0,
    right: Platform.OS === 'web' ? 24 : 0,
    width: Platform.OS === 'web' ? 380 : '100%',
    height: Platform.OS === 'web' ? 600 : '60%',
    zIndex: 999,
  }
});
