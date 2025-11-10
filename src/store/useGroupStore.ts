import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Group, User } from "../types/NeonApiInterface";
import { NeonClientApi } from "../components/common/NeonApiClient";

interface GroupStore {
  groups: Group[];
  createGroup: (name: string, creator: User) => Promise<string>;
  inviteUser: (groupId: string, email: string) => Promise<void>;
  getGroupById: (id: string) => Group | undefined;
  setGroups: (groups: Group[]) => void;
}
const client = new NeonClientApi();
export const getGroups = async () => {
  try {
    const { groups } = await client.getGroups({
      userInfo: {
        accessToken: localStorage.getItem("shitai-accessToken") || "",
      },
    });
    localStorage.setItem("shitai-groups", JSON.stringify(groups));
    return groups;
  } catch (error) {
    return [];
  }
};
export const useGroupStore = create<GroupStore>()((set, get) => ({
  groups: [],
  createGroup: async (name, creator) => {
    const result = await client.insertGroup({
      userInfo: {
        accessToken: localStorage.getItem("shitai-accessToken") || "",
      },
      name,
    });
    const newGroups = await getGroups();
    set((state) => ({
      groups: newGroups,
    }));
    return result.id || "";
  },
  inviteUser: async (groupId, user) => {
    const result = await client.invitationGroup({
      userInfo: {
        accessToken: localStorage.getItem("shitai-accessToken") || "",
      },
      groupId,
      invitationUserId: user,
    });
    const newGroups = await getGroups();
    set((state) => ({
      groups: newGroups,
    }));
  },
  getGroupById: (id) => get().groups.find((g) => g.id == id),
  setGroups: (groups) => {
    set((state) => ({ groups: [...groups] }));
  },
}));
