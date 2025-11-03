import { create } from "zustand";
import { NeonClientApi } from "../components/common/NeonApiClient";
import {
  loginAuthApiResponse,
  loginAuthResponse,
} from "../types/NeonApiInterface";

interface AuthState {
  isAuthenticated: boolean;
  id: number | null;
  auth: (isAuthenticated: boolean, id: number | null) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{
    statusCode: number;
    id: number | null;
    name: string;
    email: string;
  }>;
  logout: () => void;
}
const client = new NeonClientApi();
export const auth: () => Promise<{
  isAuthenticated: boolean;
  id: number | null;
  name: string;
  email: string;
}> = async () => {
  try {
    if (localStorage.getItem("shitai-accessToken")) {
      const result = await client.accessTokenAuth({
        userInfo: {
          accessToken: localStorage.getItem("shitai-accessToken") || "",
        },
      });
      const { id, name, email } = result;
      return { isAuthenticated: result.statusCode === 200, id, name, email };
    } else {
      return { isAuthenticated: false, id: null, name: "", email: "" };
    }
  } catch (error) {
    return { isAuthenticated: false, id: null, name: "", email: "" };
  }
};
export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: true,
  id: null,
  auth: (isAuthenticated: boolean, getId: number | null) => {
    set({ isAuthenticated: isAuthenticated });
    set({ id: getId });
  },
  login: async (email: string, password: string) => {
    console.log(email);
    const result = await client.loginAuth({ userId: email, password });
    if (result.statusCode === 200) {
      set({ isAuthenticated: true });
    }
    return result;
  },
  logout: () => {
    localStorage.removeItem("shitai-accessToken");
    localStorage.removeItem("shitai-refreshToken");
    set({ isAuthenticated: false });
  },
}));
