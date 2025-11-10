import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/NeonApiInterface";

export const DEFAULT_CATEGORIES = [
  "イベント",
  "旅行",
  "食事",
  "スポーツ",
  "趣味",
  "勉強",
  "その他",
];

interface AppStore {
  currentUser: User | null;
  currentGroupId: string | null;
  categories: string[];
  setCategories: (categories: string[]) => void;
  setUser: (user: User) => void;
  logout: () => void;
  selectGroup: (id: string | null) => void;
  addCategory: (category: string) => { success: boolean; error?: string };
}

export const useAppStore = create<AppStore>()((set, get) => ({
  currentUser: null,
  currentGroupId: localStorage.getItem("shitai-groupId"),
  categories: DEFAULT_CATEGORIES,
  setCategories: (categories: string[]) => set({ categories: [...categories] }),
  setUser: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null, currentGroupId: null }),
  selectGroup: (id) => {
    if (id) {
      localStorage.setItem("shitai-groupId", id);
    }
    set({ currentGroupId: id });
  },
  addCategory: (category: string) => {
    const trimmedCategory = category.trim();

    if (!trimmedCategory) {
      return { success: false, error: "カテゴリー名を入力してください" };
    }

    const currentCategories = get().categories;
    if (currentCategories.includes(trimmedCategory)) {
      return { success: false, error: "このカテゴリーは既に存在します" };
    }

    set({ categories: [...currentCategories, trimmedCategory] });
    return { success: true };
  },
}));
