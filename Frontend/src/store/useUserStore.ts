import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

type UserState = {
  user: {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
    isAdmin: boolean;
  } | null;
  setUser: (user: UserState["user"]) => void;

  accessToken: string | null;
  isTokenExpired: (at: string) => boolean;
  clearUserAndAccessToken: () => void;
  setAccessToken: (token: string) => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")!) || null,
  accessToken: JSON.parse(localStorage.getItem("token")!) || null,
  setAccessToken: (token) => {
    const at = token;
    set({ accessToken: at });
  },
  clearUserAndAccessToken: () => set({ user: null, accessToken: null }),
  setUser: (userInput: UserState["user"]) => {
    const authorizedUser = userInput;
    set({ user: authorizedUser });
  },
  isTokenExpired: (at: string) => {
    const token = at;

    let decoded;
    try {
      decoded = jwtDecode(token!) as { exp?: number };
    } catch (e) {
      return true;
    }
    if (!decoded.exp) {
      return true;
    }
    const currentTime = new Date().getTime();

    if (currentTime > decoded.exp * 1000) {
      localStorage.removeItem("user");
      return true;
    }

    return false;
  },
}));
