import { useParams, useNavigate } from "react-router-dom";
import { useWishStore } from "../store/useWishStore";
import CreateWishForm from "../components/wish/CreateWishForm";
import { WishFormData, ParticipationSchema } from "../types/NeonApiInterface";

const WishEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getWishById = useWishStore((state) => state.getWishById);
  const editWish = useWishStore((state) => state.editWish);

  if (!id) {
    return null;
  }

  const wish = getWishById(id);

  if (!wish) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="text-center py-12 text-gray-500">
          <p>したいことが見つかりません</p>
        </div>
      </div>
    );
  }

  const defaultValues: Partial<WishFormData> = {
    category: wish.category,
    imageData: wish.imageData,
    title: wish.title,
    displayDate: wish.displayDate,
    displayText: wish.displayText,
    notes: wish.notes,
    deadline: wish.deadline,
    minParticipants: wish.minParticipants,
    maxParticipants: wish.maxParticipants,
    actionLabel: wish.actionLabel,
    participationConfirmType: wish.participationConfirmSchema.type,
    participationDatetimeLabel: wish.participationConfirmSchema.datetimeLabel,
    participationDatetimeRequired:
      wish.participationConfirmSchema.datetimeRequired,
    participationNoteLabel: wish.participationConfirmSchema.noteLabel,
    participationNoteRequired: wish.participationConfirmSchema.noteRequired,
    postConfirmType: wish.postConfirmSchema.type,
    postDatetimeLabel: wish.postConfirmSchema.datetimeLabel,
    postDatetimeRequired: wish.postConfirmSchema.datetimeRequired,
    postNoteLabel: wish.postConfirmSchema.noteLabel,
    postNoteRequired: wish.postConfirmSchema.noteRequired,
  };

  const handleSubmit = (data: WishFormData) => {
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

    editWish(id, {
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
    });

    navigate(`/wish/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">したいことを編集</h1>
        <p className="text-gray-600 mt-2">情報を更新してください</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <CreateWishForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/wish/${id}`)}
          submitLabel="更新"
        />
      </div>
    </div>
  );
};

export default WishEdit;
