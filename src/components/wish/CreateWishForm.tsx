import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wishFormSchema } from "../../utils/validators";
import {
  WishFormData,
  ParticipationSchemaType,
} from "../../types/NeonApiInterface";
import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { DEFAULT_CATEGORIES, useAppStore } from "../../store/useAppStore";
import { formatDateTime } from "../../utils/date";
import { getWishByIdCall, useWishStore } from "../../store/useWishStore";
import Loading from "../common/Loading";

interface CreateWishFormProps {
  defaultValues?: Partial<WishFormData>;
  onSubmit: (data: WishFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const CreateWishForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "作成",
}: CreateWishFormProps) => {
  const categories = useAppStore((state) => state.categories);
  const addCategory = useAppStore((state) => state.addCategory);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string>("");
  const [participationType, setParticipationType] =
    useState<ParticipationSchemaType>(
      defaultValues?.participationConfirmType || "none"
    );
  const [postType, setPostType] = useState<ParticipationSchemaType>(
    defaultValues?.postConfirmType || "none"
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.imageData || null
  );
  const currentGroupId = useAppStore((state) => state.currentGroupId);
  const setCategories = useAppStore((state) => state.setCategories);
  const [isLoading, setIsLoading] = useState(true);
  const getWishesByGroupId = useWishStore((state) => state.getWishesByGroupId);
  const setWishes = useWishStore((state) => state.setWishes);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      if (currentGroupId) {
        const cat = Array.from(
          new Set([
            ...DEFAULT_CATEGORIES,
            ...getWishesByGroupId(currentGroupId).map((ele) => ele.category),
          ])
        );
        setCategories(cat);
      }
      setIsLoading(false);
    })();
  }, [currentGroupId]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WishFormData>({
    resolver: zodResolver(wishFormSchema),
    defaultValues: {
      category: defaultValues?.category || "",
      imageData: defaultValues?.imageData || "",
      title: defaultValues?.title || "",
      displayDate: defaultValues?.displayDate || "",
      displayText: defaultValues?.displayText || "",
      notes: defaultValues?.notes || "",
      deadline: defaultValues?.deadline
        ? formatDateTime(defaultValues?.deadline)
        : "",
      minParticipants: defaultValues?.minParticipants || 1,
      maxParticipants: defaultValues?.maxParticipants,
      actionLabel: defaultValues?.actionLabel || "参加する",
      participationConfirmType: participationType,
      postConfirmType: postType,
      implementationDatetime: defaultValues?.implementationDatetime
        ? formatDateTime(defaultValues?.implementationDatetime)
        : "",
    },
  });

  const category = watch("category");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("ファイルサイズは5MB以下にしてください");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      console.log(base64String);
      setImagePreview(base64String);
      setValue("imageData", base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("imageData", "");
  };
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-20">
        <Loading message="カテゴリ情報を取得中です..." />
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          カテゴリー <span className="text-red-600">*</span>
        </label>
        {!showNewCategory ? (
          <div className="space-y-2">
            <select
              {...register("category")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <option value="">選択してください</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCategory(true)}
              className="text-sm text-red-600 hover:text-red-700 font-medium">
              + 新しいカテゴリーを追加
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              {...register("newCategory")}
              placeholder="新しいカテゴリー名"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              onBlur={(e) => {
                const newCategoryValue = e.target.value.trim();
                if (newCategoryValue) {
                  const result = addCategory(newCategoryValue);
                  if (result.success) {
                    setValue("category", newCategoryValue);
                    setShowNewCategory(false);
                    setCategoryError("");
                  } else {
                    setCategoryError(result.error || "");
                  }
                }
              }}
            />
            {categoryError && (
              <p className="text-red-600 text-sm">{categoryError}</p>
            )}
            <button
              type="button"
              onClick={() => {
                setShowNewCategory(false);
                setCategoryError("");
              }}
              className="text-sm text-gray-600 hover:text-gray-700 font-medium">
              既存のカテゴリーから選択
            </button>
          </div>
        )}
        {errors.category && (
          <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          画像
        </label>

        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="プレビュー"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg">
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors bg-gray-50">
              <div className="text-center">
                <Upload size={48} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  クリックして画像をアップロード
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF, WebP (最大5MB)
                </p>
              </div>
            </label>
          </div>
        )}

        <input type="hidden" {...register("imageData")} />
        {errors.imageData && (
          <p className="text-red-600 text-sm mt-1">
            {errors.imageData.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          タイトル <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          {...register("title")}
          placeholder="例：お花見に行きたい"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          表示日時
        </label>
        <input
          type="text"
          {...register("displayDate")}
          placeholder="例：2025年4月上旬"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          表示文字列
        </label>
        <textarea
          {...register("displayText")}
          placeholder="簡単な説明"
          rows={2}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          備考
        </label>
        <textarea
          {...register("notes")}
          placeholder="詳細な説明や注意事項"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          期限
        </label>
        <input
          type="datetime-local"
          {...register("deadline")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          実施日時
        </label>
        <input
          type="datetime-local"
          {...register("implementationDatetime")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            最低確定人数 <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            {...register("minParticipants", { valueAsNumber: true })}
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.minParticipants && (
            <p className="text-red-600 text-sm mt-1">
              {errors.minParticipants.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            最大確定人数
          </label>
          <input
            type="number"
            {...register("maxParticipants", { valueAsNumber: true })}
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          参加アクション名 <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          {...register("actionLabel")}
          placeholder="例：参加する"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        {errors.actionLabel && (
          <p className="text-red-600 text-sm mt-1">
            {errors.actionLabel.message}
          </p>
        )}
      </div>
      {submitLabel == "作成" ? (
        <>
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              参加時確認項目
            </h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                確認タイプ
              </label>
              <select
                {...register("participationConfirmType")}
                value={participationType}
                onChange={(e) =>
                  setParticipationType(
                    e.target.value as ParticipationSchemaType
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="none">なし</option>
                <option value="datetime">日時項目</option>
                <option value="note">備考項目</option>
                <option value="mixed">日時＋備考</option>
              </select>
            </div>

            {(participationType === "datetime" ||
              participationType === "mixed") && (
              <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <input
                    type="text"
                    {...register("participationDatetimeLabel")}
                    placeholder="日時項目名（例：希望日時）"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {errors.participationDatetimeLabel && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.participationDatetimeLabel.message}
                    </p>
                  )}
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("participationDatetimeRequired")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">必須</span>
                </label>
              </div>
            )}

            {(participationType === "note" ||
              participationType === "mixed") && (
              <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <input
                    type="text"
                    {...register("participationNoteLabel")}
                    placeholder="備考項目名（例：メッセージ）"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {errors.participationNoteLabel && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.participationNoteLabel.message}
                    </p>
                  )}
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("participationNoteRequired")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">必須</span>
                </label>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              確定後確認項目
            </h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                確認タイプ
              </label>
              <select
                {...register("postConfirmType")}
                value={postType}
                onChange={(e) =>
                  setPostType(e.target.value as ParticipationSchemaType)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="none">なし</option>
                <option value="datetime">日時項目</option>
                <option value="note">備考項目</option>
                <option value="mixed">日時＋備考</option>
              </select>
            </div>

            {(postType === "datetime" || postType === "mixed") && (
              <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <input
                    type="text"
                    {...register("postDatetimeLabel")}
                    placeholder="日時項目名（例：実施日時）"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {errors.postDatetimeLabel && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.postDatetimeLabel.message}
                    </p>
                  )}
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("postDatetimeRequired")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">必須</span>
                </label>
              </div>
            )}

            {(postType === "note" || postType === "mixed") && (
              <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <input
                    type="text"
                    {...register("postNoteLabel")}
                    placeholder="備考項目名（例：感想）"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {errors.postNoteLabel && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.postNoteLabel.message}
                    </p>
                  )}
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("postNoteRequired")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">必須</span>
                </label>
              </div>
            )}
          </div>
        </>
      ) : (
        <></>
      )}

      <div className="flex space-x-4 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
            キャンセル
          </button>
        )}
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md">
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CreateWishForm;
