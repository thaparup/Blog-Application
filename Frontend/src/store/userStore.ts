import { create } from "zustand";

type UserState = {
  user: {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
  } | null;
  accessToken: string | null;
  setUser: (user: UserState["user"]) => void;
  setAccessToken: (token: string) => void;
  clearUser: () => void;
};

export const userStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  clearUser: () => set({ user: null, accessToken: null }),
}));
