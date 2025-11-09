import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Group, User } from "../types/NeonApiInterface";
import { NeonClientApi } from "../components/common/NeonApiClient";

interface GroupStore {
  groups: Group[];
  createGroup: (name: string, creator: User) => string;
  inviteUser: (groupId: string, user: User) => void;
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
    return groups;
  } catch (error) {
    return [];
  }
};
export const useGroupStore = create<GroupStore>()((set, get) => ({
  groups: [],
  createGroup: (name, creator) => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      members: [creator],
    };
    set((state) => ({ groups: [...state.groups, newGroup] }));
    return newGroup.id;
  },
  inviteUser: (groupId, user) => {
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId && !g.members.some((m) => m.id === user.id)
          ? { ...g, members: [...g.members, user] }
          : g
      ),
    }));
  },
  getGroupById: (id) => get().groups.find((g) => g.id === id),
  setGroups: (groups) => {
    set((state) => ({ groups: groups }));
  },
}));
