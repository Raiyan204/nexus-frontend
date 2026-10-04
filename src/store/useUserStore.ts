import { create } from 'zustand';
import { API_BASE_URL } from '../constants/config';

export type SubscriptionTier = 'FREE' | 'PRO';

interface UserProfile {
  id: string;
  email: string;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
}

interface FeatureFlags {
  aiEnabled: boolean;
  subscriptionTier: SubscriptionTier;
  serverAiEnabled: boolean;
}

interface UserState {
  profile: UserProfile | null;
  flags: FeatureFlags | null;
  isLoading: boolean;
  isUpgrading: boolean;
  fetchProfile: () => Promise<void>;
  fetchFlags: () => Promise<void>;
  upgradeToPro: () => Promise<boolean>;
  downgradeToFree: () => Promise<boolean>;
  isPro: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  flags: null,
  isLoading: false,
  isUpgrading: false,

  fetchProfile: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch(`${API_BASE_URL}/api/user/profile`);
      if (res.ok) {
        const data = await res.json();
        set({ profile: data as UserProfile });
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFlags: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/feature-flags`);
      if (res.ok) {
        const data = await res.json();
        set({ flags: data as FeatureFlags });
      }
    } catch (error) {
      console.error('Failed to fetch feature flags', error);
    }
  },

  upgradeToPro: async () => {
    try {
      set({ isUpgrading: true });
      const res = await fetch(`${API_BASE_URL}/api/user/upgrade`, { method: 'POST' });
      if (res.ok) {
        // Refresh profile and flags after upgrade
        await get().fetchProfile();
        await get().fetchFlags();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to upgrade', error);
      return false;
    } finally {
      set({ isUpgrading: false });
    }
  },

  downgradeToFree: async () => {
    try {
      set({ isUpgrading: true });
      const res = await fetch(`${API_BASE_URL}/api/user/downgrade`, { method: 'POST' });
      if (res.ok) {
        await get().fetchProfile();
        await get().fetchFlags();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to downgrade', error);
      return false;
    } finally {
      set({ isUpgrading: false });
    }
  },

  isPro: () => {
    const { profile } = get();
    return profile?.subscriptionTier === 'PRO';
  },
}));
