import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { getWishesByGroupIdCall, useWishStore } from "../store/useWishStore";
import CreateWishForm from "../components/wish/CreateWishForm";
import { WishFormData, ParticipationSchema } from "../types/NeonApiInterface";
import Loading from "../components/common/Loading";
import { useEffect, useState } from "react";
import { getGroups, useGroupStore } from "../store/useGroupStore";
import { useAuth, auth as accessTokenAuth } from "../store/useAuth";

const CreateWish = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);
  const currentGroupId = useAppStore((state) => state.currentGroupId);
  const createWish = useWishStore((state) => state.createWish);
  const setWishes = useWishStore((state) => state.setWishes);
  const { auth } = useAuth();
  const setUser = useAppStore((state) => state.setUser);
  const setGroups = useGroupStore((state) => state.setGroups);
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const { isAuthenticated, id, name, email } = await accessTokenAuth();
      auth(isAuthenticated, id);
      setUser({
        id: id ? id.toString() : "",
        name,
        email,
      });
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      const groups = await getGroups();
      localStorage.setItem("shitai-groups", JSON.stringify(groups));
      setGroups(groups);
      if (currentGroupId) {
        setWishes(await getWishesByGroupIdCall(currentGroupId));
      }
      setIsLoading(false);
    })();
  }, [currentGroupId]);
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-20">
        <Loading message="作成中です..." />
      </div>
    );
  }
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="text-center py-12 text-gray-500">
          <p>ユーザー情報が見つかりません</p>
        </div>
      </div>
    );
  }

  if (!currentGroupId) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">グループを選択してください</p>
          <button
            onClick={() => navigate("/settings")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
            設定へ
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: WishFormData) => {
    setIsLoading(true);
    const category = data.newCategory || data.category;

    const participationConfirmSchema: ParticipationSchema = {
      type: data.participationConfirmType,
      ...(data.participationConfirmType === "datetime" && {
        datetimeLabel: data.participationDatetimeLabel,
        datetimeRequired: data.participationDatetimeRequired,
      }),
      ...(data.participationConfirmType === "note" && {
        noteLabel: data.participationNoteLabel,
        noteRequired: data.participationNoteRequired,
      }),
      ...(data.participationConfirmType === "mixed" && {
        datetimeLabel: data.participationDatetimeLabel,
        datetimeRequired: data.participationDatetimeRequired,
        noteLabel: data.participationNoteLabel,
        noteRequired: data.participationNoteRequired,
      }),
    };

    const postConfirmSchema: ParticipationSchema = {
      type: data.postConfirmType,
      ...(data.postConfirmType === "datetime" && {
        datetimeLabel: data.postDatetimeLabel,
        datetimeRequired: data.postDatetimeRequired,
      }),
      ...(data.postConfirmType === "note" && {
        noteLabel: data.postNoteLabel,
        noteRequired: data.postNoteRequired,
      }),
      ...(data.postConfirmType === "mixed" && {
        datetimeLabel: data.postDatetimeLabel,
        datetimeRequired: data.postDatetimeRequired,
        noteLabel: data.postNoteLabel,
        noteRequired: data.postNoteRequired,
      }),
    };

    const wishId = await createWish({
      groupId: currentGroupId,
      creatorId: currentUser.id,
      category,
      imageData: data.imageData,
      title: data.title,
      displayDate: data.displayDate,
      displayText: data.displayText,
      notes: data.notes,
      deadline: data.deadline,
      minParticipants: data.minParticipants,
      maxParticipants: data.maxParticipants,
      actionLabel: data.actionLabel,
      participationConfirmSchema,
      postConfirmSchema,
      implementationDatetime: data.implementationDatetime,
    });
    setIsLoading(false);
    navigate(`/wish/${wishId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">したいことを作成</h1>
        <p className="text-gray-600 mt-2">新しいしたいことを作成します</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <CreateWishForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/")}
          submitLabel="作成"
        />
      </div>
    </div>
  );
};

export default CreateWish;
