import { create } from 'zustand';

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
  fetchData: () => Promise<void>;
  sendDraft: (id: string) => Promise<void>;
  updateDraft: (id: string, content: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  contacts: [],
  relationships: [],
  agentDrafts: [],
  
  fetchData: async () => {
    try {
      const [contactsRes, relsRes, draftsRes] = await Promise.all([
        fetch('http://localhost:8080/api/contacts'),
        fetch('http://localhost:8080/api/relationships'),
        fetch('http://localhost:8080/api/drafts/pending')
      ]);
      
      const contacts = await contactsRes.json();
      const relationships = await relsRes.json();
      const agentDrafts = await draftsRes.json();
      
      set({ contacts, relationships, agentDrafts });
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  },

  sendDraft: async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/drafts/${id}/send`, { method: 'POST' });
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
      const res = await fetch(`http://localhost:8080/api/drafts/${id}`, {
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
