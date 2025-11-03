import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Wish, Participant } from "../types/NeonApiInterface";

interface WishStore {
  wishes: Wish[];
  createWish: (
    wish: Omit<Wish, "id" | "participants" | "withdrawn" | "createdAt">
  ) => string;
  editWish: (id: string, wish: Partial<Wish>) => void;
  withdrawWish: (id: string) => void;
  joinWish: (id: string, participant: Participant) => void;
  updateParticipantConfirmation: (
    wishId: string,
    userId: string,
    data: Record<string, string>
  ) => void;
  getRankingWishes: () => Wish[];
  getWishById: (id: string) => Wish | undefined;
  getWishesByGroupId: (groupId: string) => Wish[];
  getWishesByCreatorId: (creatorId: string) => Wish[];
  isWishConfirmed: (wish: Wish) => boolean;
  canUserJoin: (wish: Wish, userId: string) => boolean;
}

export const useWishStore = create<WishStore>()(
  persist(
    (set, get) => ({
      wishes: [],
      createWish: (wish) => {
        const newWish: Wish = {
          ...wish,
          id: `wish-${Date.now()}`,
          participants: [],
          withdrawn: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ wishes: [...state.wishes, newWish] }));
        return newWish.id;
      },
      editWish: (id, wishUpdate) => {
        set((state) => ({
          wishes: state.wishes.map((w) =>
            w.id === id ? { ...w, ...wishUpdate } : w
          ),
        }));
      },
      withdrawWish: (id) => {
        set((state) => ({
          wishes: state.wishes.map((w) =>
            w.id === id ? { ...w, withdrawn: true } : w
          ),
        }));
      },
      joinWish: (id, participant) => {
        console.log(participant);
        set((state) => ({
          wishes: state.wishes.map((w) =>
            w.id === id
              ? {
                  ...w,
                  participants: [...w.participants, participant],
                }
              : w
          ),
        }));
      },
      updateParticipantConfirmation: (wishId, userId, data) => {
        set((state) => ({
          wishes: state.wishes.map((w) =>
            w.id === wishId
              ? {
                  ...w,
                  participants: w.participants.map((p) =>
                    p.userId === userId
                      ? {
                          ...p,
                          postAnswers: {
                            datetime: data.datetime || "",
                            note: data.note || "",
                          },
                        }
                      : p
                  ),
                }
              : w
          ),
        }));
      },
      getRankingWishes: () => {
        const { wishes, isWishConfirmed } = get();
        const now = new Date();
        return wishes
          .filter((w) => {
            if (w.withdrawn) return false;
            if (w.deadline) {
              const deadlineDate = new Date(w.deadline);
              if (deadlineDate < now) return false;
            }
            const isConfirmed = isWishConfirmed(w);
            const hasMaxParticipants =
              w.maxParticipants && w.participants.length >= w.maxParticipants;
            return !isConfirmed || (isConfirmed && !hasMaxParticipants);
          })
          .sort((a, b) => b.participants.length - a.participants.length);
      },
      getWishById: (id) => get().wishes.find((w) => w.id === id),
      getWishesByGroupId: (groupId) =>
        get().wishes.filter((w) => w.groupId === groupId),
      getWishesByCreatorId: (creatorId) =>
        get().wishes.filter((w) => w.creatorId === creatorId),
      isWishConfirmed: (wish) =>
        wish.participants.length >= wish.minParticipants,
      canUserJoin: (wish, userId) => {
        if (wish.withdrawn) return false;
        if (wish.creatorId === userId) return false;
        if (wish.participants.some((p) => p.userId === userId)) return false;
        if (
          wish.maxParticipants &&
          wish.participants.length >= wish.maxParticipants
        )
          return false;
        return true;
      },
    }),
    {
      name: "wish-storage",
    }
  )
);
