import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { PersonDto } from '@/components/NetworkGraph';

type Props = {
  /** UUID of the selected person node */
  selectedNodeId: string;
  /** Callback to close the side panel */
  onClose: () => void;
  /** Callback after a successful save – parent can refresh the graph */
  onSave: () => void;
};

export const NodeDetailsPanel: React.FC<Props> = ({ selectedNodeId, onClose, onSave }) => {
  const [person, setPerson] = useState<PersonDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`/api/persons/${selectedNodeId}`);
        if (!res.ok) throw new Error('Failed to load person');
        const data: PersonDto = await res.json();
        setPerson(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [selectedNodeId]);

  const handleChange = (field: keyof PersonDto, value: string) => {
    if (!person) return;
    setPerson({ ...person, [field]: value });
  };

  const handleSave = async () => {
    if (!person) return;
    try {
      const res = await fetch(`/api/persons/${person.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person),
      });
      if (!res.ok) throw new Error('Save failed');
      onSave();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.panel}>
        <Text>Loading…</Text>
      </View>
    );
  }

  if (!person) {
    return (
      <View style={styles.panel}>
        <Text>Person not found.</Text>
        <TouchableOpacity onPress={onClose} style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Edit Person</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={person.name}
          onChangeText={(v) => handleChange('name', v)}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={person.email ?? ''}
          onChangeText={(v) => handleChange('email', v)}
        />
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={person.address ?? ''}
          onChangeText={(v) => handleChange('address', v)}
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={person.phoneNumber ?? ''}
          onChangeText={(v) => handleChange('phoneNumber', v)}
        />
        <Text style={styles.label}>Social Media Links (JSON)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          multiline
          numberOfLines={4}
          value={person.socialMediaLinks ?? ''}
          onChangeText={(v) => handleChange('socialMediaLinks', v)}
        />
        <Text style={styles.label}>Comment</Text>
        <TextInput
          style={styles.input}
          value={person.comment ?? ''}
          onChangeText={(v) => handleChange('comment', v)}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton]}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  scroll: {
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
