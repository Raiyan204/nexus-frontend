import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Draft = {
  id: string;
  personId: string;
  draftText: string;
  createdAt: string; // ISO string
};

export default function DraftsList() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await fetch('/api/drafts');
        if (!res.ok) throw new Error('Failed to load drafts');
        const data: Draft[] = await res.json();
        setDrafts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  const handleAccept = async (draft: Draft) => {
    // Simple example: send the draft as a chat message, then delete the draft
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft.draftText, sender: 'USER' }),
      });
      // Optionally, delete the draft (not implemented server‑side yet)
      setDrafts(prev => prev.filter(d => d.id !== draft.id));
    } catch (e) {
      console.error('Failed to send draft', e);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading drafts…</Text>
      </View>
    );
  }

  if (drafts.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No pending drafts.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pending Drafts</Text>
      {drafts.map(draft => (
        <View key={draft.id} style={styles.card}>
          <Text style={styles.person}>Contact: {draft.personId}</Text>
          <Text style={styles.text}>{draft.draftText}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleAccept(draft)} style={styles.acceptBtn}>
              <Text style={styles.btnText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDrafts(prev => prev.filter(d => d.id !== draft.id))} style={styles.discardBtn}>
              <Text style={styles.btnText}>Discard</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#111827', // dark background for premium feel
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  person: {
    color: '#9ca3af',
    marginBottom: 4,
  },
  text: {
    color: '#e5e7eb',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acceptBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  discardBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
