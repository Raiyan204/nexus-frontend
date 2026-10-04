import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore, Contact, InteractionLineage, Badge } from '../../store/useStore';
import { TextInput } from 'react-native';

export default function ContactDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { contacts, allBadges, updateContact } = useStore();
  
  const contact: Contact | undefined = contacts.find(c => c.id === id);
  const [isEditingSocial, setIsEditingSocial] = React.useState(false);
  const [socialLinks, setSocialLinks] = React.useState(contact?.socialMediaLinks || '');
  const [showBadgeSelector, setShowBadgeSelector] = React.useState(false);

  const handleSaveSocial = () => {
    if (contact) {
      updateContact(contact.id, { socialMediaLinks: socialLinks });
      setIsEditingSocial(false);
    }
  };

  const handleAddBadge = (badge: Badge) => {
    if (contact) {
      const currentBadges = contact.badges || [];
      if (!currentBadges.find(b => b.id === badge.id)) {
        updateContact(contact.id, { badges: [...currentBadges, badge] });
      }
      setShowBadgeSelector(false);
    }
  };

  if (!contact) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center p-4">
        <Text className="text-white text-xl">Contact not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-blue-600 rounded-lg">
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <View className="flex-row items-center p-6 bg-gray-800 border-b border-gray-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-blue-400 text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white tracking-tight">{contact.name}</Text>
      </View>

      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row flex-wrap gap-4 mb-8">
          <View className="bg-gray-800 p-4 rounded-xl flex-1 min-w-[250px] border border-gray-700/50 shadow-lg">
            <Text className="text-gray-400 text-sm uppercase tracking-widest mb-1">Email</Text>
            <Text className="text-white text-lg">{contact.email || 'N/A'}</Text>
          </View>
          <View className="bg-gray-800 p-4 rounded-xl flex-1 min-w-[250px] border border-gray-700/50 shadow-lg">
            <Text className="text-gray-400 text-sm uppercase tracking-widest mb-1">Phone</Text>
            <Text className="text-white text-lg">{contact.phoneNumber || 'N/A'}</Text>
          </View>
          <View className="bg-gray-800 p-4 rounded-xl flex-1 min-w-[250px] border border-gray-700/50 shadow-lg">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-gray-400 text-sm uppercase tracking-widest">Other Social Links</Text>
              <TouchableOpacity onPress={() => isEditingSocial ? handleSaveSocial() : setIsEditingSocial(true)}>
                <Text className="text-blue-400 font-bold">{isEditingSocial ? 'Save' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>
            {isEditingSocial ? (
              <TextInput 
                className="text-white bg-gray-900 p-2 rounded border border-gray-600"
                value={socialLinks}
                onChangeText={setSocialLinks}
                placeholder="e.g. twitter.com/user, github.com/user"
                placeholderTextColor="#666"
              />
            ) : (
              <Text className="text-blue-400 text-lg">{contact.socialMediaLinks || 'None added'}</Text>
            )}
          </View>
        </View>

        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-2xl font-bold text-white">Tags & Badges</Text>
            <TouchableOpacity onPress={() => setShowBadgeSelector(!showBadgeSelector)} className="px-3 py-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <Text className="text-blue-400 font-medium">+ Add Badge</Text>
            </TouchableOpacity>
          </View>
          
          {showBadgeSelector && (
            <View className="flex-row flex-wrap gap-2 mb-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
              {allBadges.map(badge => (
                <TouchableOpacity key={badge.id} onPress={() => handleAddBadge(badge)} style={{ backgroundColor: badge.colorHex + '40', borderColor: badge.colorHex }} className="px-3 py-1 rounded-full border">
                  <Text style={{ color: badge.colorHex }} className="font-semibold">{badge.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View className="flex-row flex-wrap gap-2">
            {contact.badges && contact.badges.length > 0 ? contact.badges.map(badge => (
              <View key={badge.id} style={{ backgroundColor: badge.colorHex + '20', borderColor: badge.colorHex }} className="px-3 py-1 rounded-full border">
                <Text style={{ color: badge.colorHex }} className="font-semibold">{badge.name}</Text>
              </View>
            )) : <Text className="text-gray-500">No badges assigned.</Text>}
          </View>
        </View>

        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-2xl font-bold text-white">Interaction Lineage</Text>
            <TouchableOpacity className="px-3 py-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <Text className="text-blue-400 font-medium">+ Add Note</Text>
            </TouchableOpacity>
          </View>
          
          {contact.lineages && contact.lineages.length > 0 ? (
            <View className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700/50">
              {contact.lineages.map((lineage: InteractionLineage, idx: number) => (
                <View key={lineage.id} className={`p-4 ${idx !== contact.lineages.length - 1 ? 'border-b border-gray-700/50' : ''}`}>
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center gap-2">
                      <View className="w-2 h-2 rounded-full bg-blue-500" />
                      <Text className="text-white font-semibold text-lg">{lineage.interactionType}</Text>
                    </View>
                    <Text className="text-gray-400 text-sm">
                      {new Date(lineage.interactionDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text className="text-gray-300 leading-relaxed ml-4">{lineage.summary}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-gray-800/50 p-6 rounded-xl border border-dashed border-gray-700 flex items-center justify-center">
              <Text className="text-gray-500 text-lg">No interaction history found.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
