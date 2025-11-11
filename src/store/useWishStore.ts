import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Wish, Participant, Group } from "../types/NeonApiInterface";
import { NeonClientApi } from "../components/common/NeonApiClient";

interface WishStore {
  wishes: Wish[];
  setWishes: (wishes: Wish[]) => void;
  createWish: (
    wish: Omit<Wish, "id" | "participants" | "withdrawn" | "createdAt">
  ) => Promise<string>;
  editWish: (id: string, wish: Partial<Wish>) => Promise<void>;
  withdrawWish: (id: string) => Promise<void>;
  joinWish: (id: string, participant: Participant) => Promise<void>;
  updateParticipantConfirmation: (
    wishId: string,
    userId: string,
    data: Record<string, string>
  ) => Promise<void>;
  getRankingWishes: () => Wish[];
  getWishById: (id: string) => Wish | undefined;
  getWishesByGroupId: (groupId: string) => Wish[];
  getWishesByCreatorId: (creatorId: string) => Wish[];
  isWishConfirmed: (wish: Wish) => boolean;
  canUserJoin: (wish: Wish, userId: string) => boolean;
}
const client = new NeonClientApi();
export const getWishes = async () => {
  try {
    const groups = localStorage.getItem("shitai-groups");
    let res: Wish[] = [];
    if (groups) {
      const groupsArr: Group[] = JSON.parse(groups);
      for (const group of groupsArr) {
        let wishes = [];
        wishes = await client
          .getWishes({
            userInfo: {
              accessToken: localStorage.getItem("shitai-accessToken") || "",
            },
            id: group.id,
          })
          .then((res) => res.wishes);
        res = [...res, ...wishes];
      }
      console.log(res);
      return res;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};
export const getWishesByGroupIdCall = async (groupId: string) => {
  try {
    let wishes = [];
    wishes = await client
      .getWishes({
        userInfo: {
          accessToken: localStorage.getItem("shitai-accessToken") || "",
        },
        id: groupId,
      })
      .then((res) => res.wishes);
    return wishes;
  } catch (error) {
    return [];
  }
};
export const getWishByIdCall = async (id: string) => {
  try {
    let wishes: Wish[] = [];
    const wish: Wish = await client
      .getWishById({
        userInfo: {
          accessToken: localStorage.getItem("shitai-accessToken") || "",
        },
        id,
      })
      .then((res) => res.wish);
    wishes.push(wish);
    return wishes;
  } catch (error) {
    return [];
  }
};
export const useWishStore = create<WishStore>()((set, get) => ({
  wishes: [],
  setWishes: (wishes: Wish[]) => {
    set((state) => ({ wishes: wishes }));
  },
  createWish: async (wish) => {
    const result = await client.insertWish({
      userInfo: {
        accessToken: localStorage.getItem("shitai-accessToken") || "",
      },
      ...wish,
    });
    return result.id || "";
  },
  editWish: async (id, wishUpdate) => {
    const result = await client.updateWish({
      userInfo: {
        accessToken: localStorage.getItem("shitai-accessToken") || "",
      },
      id,
      ...wishUpdate,
    });
  },
  withdrawWish: async (id) => {
    const result = await client.updateWish({
      userInfo: {
        accessToken: localStorage.getItem("shitai-accessToken") || "",
      },
      id,
      withdrawn: true,
    });
    const wishes = await getWishByIdCall(id);
    set((state) => ({
      wishes: wishes,
    }));
  },
  joinWish: async (id, participant) => {
    let result = await client.joinWish({
      userInfo: {
        accessToken: localStorage.getItem("shitai-accessToken") || "",
      },
      wishId: id,
    });
    result = await client.insertAnswer({
      userInfo: {
        accessToken: localStorage.getItem("shitai-accessToken") || "",
      },
      id,
      participationAnswers: participant.participationAnswers,
    });
    const wishes = await getWishByIdCall(id);
    set((state) => ({
      wishes: wishes,
    }));
  },
  updateParticipantConfirmation: async (wishId, userId, data) => {
    const result = await client.insertAnswer({
      userInfo: {
        accessToken: localStorage.getItem("shitai-accessToken") || "",
      },
      id: wishId,
      postAnswers: {
        note: data.note || "",
        datetime: data.datetime || "",
      },
    });
    const wishes = await getWishByIdCall(wishId);
    set((state) => ({
      wishes: wishes,
    }));
  },
  getRankingWishes: () => {
    const { wishes, isWishConfirmed } = get();
    console.log(wishes);
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
  getWishById: (id) => get().wishes.find((w) => w.id == id),
  getWishesByGroupId: (groupId) =>
    get().wishes.filter((w) => w.groupId == groupId),
  getWishesByCreatorId: (creatorId) =>
    get().wishes.filter((w) => w.creatorId == creatorId),
  isWishConfirmed: (wish) => wish.participants.length >= wish.minParticipants,
  canUserJoin: (wish, userId) => {
    if (wish.withdrawn) return false;
    if (wish.creatorId === userId) return false;
    if (wish.participants.some((p) => p.userId == userId)) return false;
    if (
      wish.maxParticipants &&
      wish.participants.length >= wish.maxParticipants
    )
      return false;
    return true;
  },
}));
