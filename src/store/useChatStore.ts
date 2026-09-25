import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useStore } from './useStore';

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isChatOpen: boolean;
  stompClient: Client | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (content: string) => void;
  toggleChat: () => void;
  addMessage: (message: ChatMessage) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [{
    id: 'welcome',
    sender: 'SYSTEM',
    content: 'Welcome! I am the Autonomous Agent CRM assistant. Ask me to add people or connect them.',
    timestamp: new Date().toISOString()
  }],
  isConnected: false,
  isChatOpen: false, // Default closed on mobile, or user toggle
  stompClient: null,

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  connect: () => {
    if (get().stompClient?.connected) return;

    const socket = new SockJS('http://localhost:8080/ws-chat');
    
    // In React Native Web / Expo, text-encoding is occasionally needed if STOMP complains about TextEncoder,
    // but usually @stomp/stompjs handles it.
    
    const stompClient = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        set({ isConnected: true });

        // Subscribe to chat messages
        stompClient.subscribe('/topic/messages', (msg) => {
          if (msg.body) {
            const messageObj: ChatMessage = JSON.parse(msg.body);
            get().addMessage(messageObj);
          }
        });

        // Subscribe to graph updates to refresh the main store
        stompClient.subscribe('/topic/updates', (msg) => {
          if (msg.body) {
            console.log("Received graph update:", msg.body);
            // Refresh contacts and relationships from backend when an update occurs
            useStore.getState().fetchData();
          }
        });
      },
      onDisconnect: () => {
        set({ isConnected: false });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();
    set({ stompClient });
  },

  disconnect: () => {
    const { stompClient } = get();
    if (stompClient) {
      stompClient.deactivate();
      set({ stompClient: null, isConnected: false });
    }
  },

  sendMessage: (content: string) => {
    const { stompClient, isConnected } = get();
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      content,
      timestamp: new Date().toISOString()
    };
    
    get().addMessage(userMsg);

    if (stompClient && isConnected) {
      stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(userMsg)
      });
    } else {
      console.warn("STOMP client not connected, message not sent to backend.");
      get().addMessage({
        id: Date.now().toString() + '-sys',
        sender: 'SYSTEM',
        content: 'Error: Cannot send message, not connected to server.',
        timestamp: new Date().toISOString()
      });
    }
  }
}));
