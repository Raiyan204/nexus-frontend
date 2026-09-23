import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';

export default function ContactDetailScreen({ contactId }: { contactId: string }) {
  // If no contactId provided, default to 'c1' for demo fallback
  const idToUse = contactId || 'c1'; 
  const contact = useStore(state => state.contacts.find(c => c.id === idToUse));

  if (!contact) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-white text-lg">Contact not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-900 p-4">
      {/* Header Profile Section */}
      <View className="items-center mb-8 mt-10">
        <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4">
          <Text className="text-4xl text-white font-bold">{contact.firstName[0]}{contact.lastName[0]}</Text>
        </View>
        <Text className="text-3xl font-bold text-white">{contact.firstName} {contact.lastName}</Text>
        
        {/* Dynamic Badges Row */}
        <View className="flex-row mt-4 space-x-2">
          {contact.badges.map(badge => (
            <View 
              key={badge.id} 
              className="px-3 py-1 rounded-full flex-row items-center border"
              style={{ backgroundColor: badge.colorHex + '22', borderColor: badge.colorHex }}
            >
              <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: badge.colorHex }} />
              <Text className="font-semibold" style={{ color: badge.colorHex }}>{badge.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Interaction Timeline Section */}
      <View className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
        <Text className="text-xl font-bold text-white mb-6">Interaction Timeline</Text>
        
        {contact.lineage.length === 0 ? (
          <Text className="text-gray-400 italic">No past interactions recorded.</Text>
        ) : (
          <View className="pl-4 border-l-2 border-gray-700 ml-2 space-y-8 pb-4">
            {contact.lineage.map((interaction, index) => {
              const dateStr = new Date(interaction.interactionDate).toLocaleDateString();
              return (
                <View key={interaction.id} className="relative">
                  {/* Timeline Dot Indicator */}
                  <View className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-500 border-[2.5px] border-gray-800" />
                  
                  <Text className="text-sm text-blue-400 font-bold mb-1">
                    {dateStr} • {interaction.interactionType}
                  </Text>
                  <Text className="text-gray-300 text-base leading-6">{interaction.summary}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
