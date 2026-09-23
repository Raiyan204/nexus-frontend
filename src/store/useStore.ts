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
  firstName: string;
  lastName: string;
  badges: Badge[];
  lineage: InteractionLineage[];
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
}

export interface AgentDraft {
  id: string;
  contactId: string;
  contactName: string;
  content: string;
  status: 'PENDING' | 'SENT';
}

interface AppState {
  contacts: Contact[];
  relationships: Relationship[];
  agentDrafts: AgentDraft[];
  sendDraft: (id: string) => void;
  updateDraft: (id: string, content: string) => void;
}

// Mock Data representing the database state
const mockBadges = [
  { id: 'b1', name: 'VIP', colorHex: '#fbbf24' },
  { id: 'b2', name: 'Alumni', colorHex: '#3b82f6' },
  { id: 'b3', name: 'Investor', colorHex: '#10b981' }
];

export const useStore = create<AppState>((set) => ({
  contacts: [
    {
      id: 'c1',
      firstName: 'Alice',
      lastName: 'Smith',
      badges: [mockBadges[0], mockBadges[1]],
      lineage: [
        { id: 'l1', interactionDate: '2025-01-15T10:00:00Z', interactionType: 'Coffee Meeting', summary: 'Discussed Q1 roadmap and overall strategy.' },
        { id: 'l2', interactionDate: '2025-03-20T14:30:00Z', interactionType: 'Email', summary: 'Sent follow-up on the new project.' }
      ]
    },
    {
      id: 'c2',
      firstName: 'Bob',
      lastName: 'Johnson',
      badges: [mockBadges[2]],
      lineage: []
    },
    {
      id: 'c3',
      firstName: 'Charlie',
      lastName: 'Davis',
      badges: [],
      lineage: []
    }
  ],
  relationships: [
    { id: 'r1', sourceId: 'c1', targetId: 'c2', type: 'Colleague' },
    { id: 'r2', sourceId: 'c2', targetId: 'c3', type: 'Introduced By' },
    { id: 'r3', sourceId: 'c3', targetId: 'c1', type: 'Mentor' }
  ],
  agentDrafts: [
    {
      id: 'd1',
      contactId: 'c2',
      contactName: 'Bob Johnson',
      content: "Hi Bob, it's been over 6 months since we last connected! I wanted to check in and see how your portfolio is doing since you became an Investor. Would love to grab coffee next week.",
      status: 'PENDING'
    }
  ],
  sendDraft: (id) => set((state) => ({
    agentDrafts: state.agentDrafts.map(d => d.id === id ? { ...d, status: 'SENT' } : d)
  })),
  updateDraft: (id, content) => set((state) => ({
    agentDrafts: state.agentDrafts.map(d => d.id === id ? { ...d, content } : d)
  }))
}));
