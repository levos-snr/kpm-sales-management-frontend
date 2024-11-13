import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
}));

export default useStore;