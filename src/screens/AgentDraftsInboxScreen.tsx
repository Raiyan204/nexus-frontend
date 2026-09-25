import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useStore, AgentDraft } from '../store/useStore';

export default function AgentDraftsInboxScreen() {
  const { agentDrafts, sendDraft, updateDraft } = useStore();
  const pendingDrafts = agentDrafts.filter(d => d.status === 'PENDING');
  
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
    // This triggers a mock API call in our Zustand store
    sendDraft(id);
    alert('Message sent successfully!');
  };

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <View className="flex-row items-center justify-between mb-6 mt-10">
        <View className="flex-row items-center space-x-3">
          <Text className="text-2xl font-bold text-white">Agent Inbox</Text>
          <View className="bg-red-500 rounded-full px-3 py-1 items-center justify-center">
            <Text className="text-white font-bold">{pendingDrafts.length}</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={async () => {
            await fetch('http://localhost:8080/api/drafts/generate', { method: 'POST' });
            alert('Agent cron triggered!');
            setTimeout(() => useStore.getState().fetchData(), 2000);
          }}
          className="bg-emerald-600 px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-bold text-sm">Generate Drafts</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {pendingDrafts.length === 0 ? (
          <View className="mt-20 items-center">
            <Text className="text-gray-500 text-lg">No pending drafts to review.</Text>
            <Text className="text-gray-600 mt-2">The AI agent is all caught up!</Text>
          </View>
        ) : (
          pendingDrafts.map(draft => (
            <View key={draft.id} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 mb-4">
              {/* Draft Header */}
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg text-blue-400 font-bold">To: {draft.contact?.firstName} {draft.contact?.lastName}</Text>
                <View className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/50">
                  <Text className="text-blue-400 text-xs font-bold uppercase tracking-wider">AI Generated</Text>
                </View>
              </View>

              {/* Draft Content or Editor */}
              {editingId === draft.id ? (
                <TextInput
                  className="bg-gray-900 text-white p-4 rounded-xl border border-blue-500 mb-5 min-h-[120px] text-base leading-6"
                  multiline
                  value={editContent}
                  onChangeText={setEditContent}
                  textAlignVertical="top"
                />
              ) : (
                <Text className="text-gray-300 text-base mb-5 leading-6">{draft.draftContent}</Text>
              )}

              {/* Action Buttons */}
              <View className="flex-row justify-end space-x-3">
                {editingId === draft.id ? (
                  <TouchableOpacity 
                    onPress={handleSave} 
                    className="px-5 py-2.5 bg-gray-700 rounded-xl"
                  >
                    <Text className="text-white font-bold">Save</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    onPress={() => handleEdit(draft)} 
                    className="px-5 py-2.5 bg-gray-700 rounded-xl"
                  >
                    <Text className="text-white font-bold">Edit</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  onPress={() => handleSend(draft.id)}
                  className="px-5 py-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-900"
                >
                  <Text className="text-white font-bold">Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
