import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Group, User } from "../types/NeonApiInterface";

interface GroupStore {
  groups: Group[];
  createGroup: (name: string, creator: User) => string;
  inviteUser: (groupId: string, user: User) => void;
  getGroupById: (id: string) => Group | undefined;
}

export const useGroupStore = create<GroupStore>()(
  persist(
    (set, get) => ({
      groups: [],
      createGroup: (name, creator) => {
        const newGroup: Group = {
          id: `group-${Date.now()}`,
          name,
          members: [creator],
          createdAt: new Date().toISOString(),
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
    }),
    {
      name: "group-storage",
    }
  )
);
