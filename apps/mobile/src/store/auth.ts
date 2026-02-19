import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isSetupComplete: boolean;
  childId: string | null;
  familyId: string | null;
  deviceToken: string | null;
  monitoringEnabled: boolean;
  completeSetup: (childId: string, familyId: string) => void;
  toggleMonitoring: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isSetupComplete: false,
      childId: null,
      familyId: null,
      deviceToken: null,
      monitoringEnabled: true,
      completeSetup: (childId, familyId) =>
        set({ 
          isSetupComplete: true, 
          childId, 
          familyId,
          deviceToken: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }),
      toggleMonitoring: () =>
        set((state) => ({ monitoringEnabled: !state.monitoringEnabled })),
      logout: () =>
        set({
          isSetupComplete: false,
          childId: null,
          familyId: null,
          deviceToken: null,
          monitoringEnabled: true,
        }),
    }),
    {
      name: 'safeguard-mobile-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
