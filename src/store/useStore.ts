import { create } from 'zustand';
import { API_BASE_URL } from '../constants/config';

export interface Badge {
  id: string;
  name: string;
  colorHex: string;
}

export interface InteractionLineage {
  id: string;
  interactionDate: string;
  interactionType: string;
  summary: string;
}

export interface Contact {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  comment?: string;
  socialMediaLinks?: string;
  badges: Badge[];
  lineages: InteractionLineage[];
}

export interface Relationship {
  id: string;
  sourcePerson: { id: string };
  targetPerson: { id: string };
  relationshipType: string;
}

export interface AgentDraft {
  id: string;
  contact: Contact;
  draftContent: string;
  status: 'PENDING' | 'SENT';
}

interface AppState {
  contacts: Contact[];
  relationships: Relationship[];
  agentDrafts: AgentDraft[];
  allBadges: Badge[];
  fetchData: () => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  sendDraft: (id: string) => Promise<void>;
  updateDraft: (id: string, content: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  contacts: [],
  relationships: [],
  agentDrafts: [],
  allBadges: [],
  
  fetchData: async () => {
    try {
      const [contactsRes, relsRes, draftsRes, badgesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/contacts`),
        fetch(`${API_BASE_URL}/api/relationships`),
        fetch(`${API_BASE_URL}/api/drafts/pending`),
        fetch(`${API_BASE_URL}/api/badges`)
      ]);
      
      const contacts = await contactsRes.json();
      const relationships = await relsRes.json();
      const agentDrafts = await draftsRes.json();
      const allBadges = badgesRes.ok ? await badgesRes.json() : [];
      
      set({ contacts, relationships, agentDrafts, allBadges });
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  },

  updateContact: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updatedContact = await res.json();
        set((state) => ({
          contacts: state.contacts.map(c => c.id === id ? updatedContact : c)
        }));
      }
    } catch (error) {
      console.error("Failed to update contact", error);
    }
  },

  sendDraft: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/drafts/${id}/send`, { method: 'POST' });
      if (res.ok) {
        set((state) => ({
          agentDrafts: state.agentDrafts.map(d => d.id === id ? { ...d, status: 'SENT' } : d)
        }));
      }
    } catch (error) {
      console.error("Failed to send draft", error);
    }
  },

  updateDraft: async (id, content) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/drafts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        set((state) => ({
          agentDrafts: state.agentDrafts.map(d => d.id === id ? { ...d, draftContent: content } : d)
        }));
      }
    } catch (error) {
      console.error("Failed to update draft", error);
    }
  }
}));
