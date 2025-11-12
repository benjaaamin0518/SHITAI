import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Edit,
  Trash2,
  CheckCircle,
  FileText,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import {
  getWishByIdCall,
  getWishes,
  useWishStore,
} from "../store/useWishStore";
import { useGroupStore } from "../store/useGroupStore";
import ConfirmationModal from "../components/wish/ConfirmationModal";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { linkifyText } from "../utils/linkify";
import Loading from "../components/common/Loading";
import { formatDisplayDate } from "../utils/date";

const WishDetail = () => {
  const { id } = useParams<{ id: string }>();
  //const [wish,setWish] = useState(getWishById(id));
  const selectGroup = useAppStore((state) => state.selectGroup);
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);
  const getWishById = useWishStore((state) => state.getWishById);
  const isWishConfirmed = useWishStore((state) => state.isWishConfirmed);
  const joinWish = useWishStore((state) => state.joinWish);
  const withdrawWish = useWishStore((state) => state.withdrawWish);
  const canUserJoin = useWishStore((state) => state.canUserJoin);
  const updateParticipantConfirmation = useWishStore(
    (state) => state.updateParticipantConfirmation
  );
  const getGroupById = useGroupStore((state) => state.getGroupById);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showParticipationConfirm, setShowParticipationConfirm] =
    useState(false);
  const [showPostConfirm, setShowPostConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const setWishes = useWishStore((state) => state.setWishes);
  const currentGroupId = useAppStore((state) => state.currentGroupId);

  if (!id) {
    return null;
  }
  const [wish, setWish] = useState(getWishById(id));
  useEffect(() => {
    (async () => {
      console.log(id);
      setWishes(await getWishByIdCall(id));
      setWish(getWishById(id));
      setIsLoading(false);
    })();
  }, [currentGroupId]);
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-20">
        <Loading message="したいことを読み込んでいます..." />
      </div>
    );
  } else if (!wish) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="text-center py-12 text-gray-500">
          <p>したいことが見つかりません</p>
        </div>
      </div>
    );
  }
  if (wish.groupId) {
    selectGroup(wish.groupId);
  }
  const group = getGroupById(wish.groupId);
  const creator = group?.members.find((m) => m.id == wish.creatorId);
  const isCreator = currentUser?.id == wish.creatorId;
  const isParticipant = wish.participants.some(
    (p) => p.userId == currentUser?.id
  );
  const isConfirmed = isWishConfirmed(wish);
  const isMaxParticipantsReached =
    wish.maxParticipants && wish.participants.length >= wish.maxParticipants;
  const canJoin = currentUser ? canUserJoin(wish, currentUser.id) : false;
  let currentParticipant = wish.participants.find(
    (p) => p.userId == currentUser?.id
  );
  const hasPostAnswers =
    currentParticipant?.postAnswers &&
    (currentParticipant.postAnswers.datetime ||
      currentParticipant.postAnswers.note);
  const showPostConfirmButton =
    isConfirmed &&
    isParticipant &&
    wish.postConfirmSchema.type !== "none" &&
    !hasPostAnswers &&
    !wish.withdrawn;

  const handleJoinClick = async () => {
    if (wish.participationConfirmSchema.type !== "none") {
      setShowParticipationConfirm(true);
    } else {
      await handleJoin({ datetime: "", note: "" });
    }
  };

  const handleJoin = async (confirmData: Record<string, string>) => {
    setIsLoading(true);
    if (!currentUser) return;
    await joinWish(id, {
      userId: currentUser.id,
      joinedAt: new Date().toISOString(),
      participationAnswers: {
        datetime: confirmData.datetime || "",
        note: confirmData.note || "",
      },
    });
    setWish(getWishById(id));
    setIsLoading(false);
  };

  const handlePostConfirm = async (data: Record<string, string>) => {
    setIsLoading(true);

    if (!currentUser) return;
    await updateParticipantConfirmation(id, currentUser.id, data);
    setWish(getWishById(id));
    setIsLoading(false);
  };

  const handleWithdraw = async () => {
    setIsLoading(true);

    await withdrawWish(id);
    setShowWithdrawDialog(false);
    setIsLoading(false);

    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {wish.imageData && (
          <div className="relative">
            <img
              src={wish.imageData}
              alt={wish.title}
              className="w-full h-64 object-cover"
            />
            {isConfirmed && (
              <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                確定
              </div>
            )}
            {wish.withdrawn && (
              <div className="absolute top-4 right-4 bg-gray-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                取り下げ済み
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded mb-3">
                {wish.category}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {wish.title}
              </h1>
              {creator && (
                <div className="text-sm text-gray-600 mt-1">
                  作成者: {creator.name}
                </div>
              )}
            </div>
            {isCreator && !wish.withdrawn && (
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => navigate(`/wish/${id}/edit`)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="編集">
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => setShowWithdrawDialog(true)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="取り下げ">
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>

          {(wish.implementationDatetime && (
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar size={18} className="mr-2" />
              <span>{formatDisplayDate(wish.implementationDatetime)}</span>
            </div>
          )) ||
            (wish.displayDate && (
              <div className="flex items-center text-gray-600 mb-2">
                <Calendar size={18} className="mr-2" />
                <span>{wish.displayDate}</span>
              </div>
            ))}

          {wish.displayText && (
            <p className="text-gray-700 text-lg mb-4">{wish.displayText}</p>
          )}

          {wish.notes && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">備考</h3>
              <p
                className="text-gray-700 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: linkifyText(wish.notes) }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            {wish.deadline && (
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-700 font-semibold mb-1">
                  期限
                </div>
                <div className="text-lg font-bold text-orange-900">
                  {dayjs(wish.deadline).utc().format("YYYY/MM/DD HH:mm")}
                </div>
                <div className="text-sm text-orange-600 mt-1">
                  {dayjs(wish.deadline).fromNow()}
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-700 font-semibold mb-1">
                確定人数
              </div>
              <div className="text-lg font-bold text-blue-900">
                {wish.minParticipants}人
                {wish.maxParticipants && ` 〜 ${wish.maxParticipants}人`}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-gray-800 flex items-center space-x-2">
                <Users size={24} />
                <span>参加状況</span>
              </h3>
              <div className="text-3xl font-bold text-blue-600">
                {wish.participants.length} / {wish.maxParticipants}
              </div>
            </div>

            {wish.participants.length > 0 ? (
              <div className="space-y-2">
                {wish.participants.map((participant, index) => {
                  console.log(participant);
                  const member = group?.members.find(
                    (m) => m.id == participant.userId
                  );
                  const hasParticipationAnswers =
                    participant.participationAnswers &&
                    (participant.participationAnswers.datetime ||
                      participant.participationAnswers.note);
                  const hasPostAnswers =
                    participant.postAnswers &&
                    (participant.postAnswers.datetime ||
                      participant.postAnswers.note);

                  return (
                    <div key={index} className="bg-white rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">
                            {member?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {dayjs(participant.joinedAt)
                              .utc()
                              .format("YYYY/MM/DD HH:mm")}
                          </div>
                        </div>
                        {isConfirmed && (
                          <CheckCircle className="text-green-600" size={20} />
                        )}
                      </div>

                      {hasParticipationAnswers && (
                        <div className="mt-2 pl-5 text-sm space-y-1">
                          <div className="text-gray-700">
                            <span className="font-medium">参加時</span>
                          </div>
                          {participant.participationAnswers?.datetime && (
                            <div className="text-gray-700">
                              <span className="font-medium">
                                {wish.participationConfirmSchema
                                  .datetimeLabel || "日時"}
                                :
                              </span>{" "}
                              {participant.participationAnswers.datetime ==
                              "1900/1/1 0:00"
                                ? "未回答"
                                : dayjs(
                                    participant.participationAnswers.datetime
                                  ).format("YYYY/MM/DD HH:mm")}
                            </div>
                          )}
                          {participant.participationAnswers?.note && (
                            <div className="text-gray-700">
                              <span className="font-medium">
                                {wish.participationConfirmSchema.noteLabel ||
                                  "備考"}
                                :
                              </span>{" "}
                              {participant.participationAnswers.note}
                            </div>
                          )}
                        </div>
                      )}

                      {hasPostAnswers && (
                        <div className="mt-2 pl-5 text-sm space-y-1 border-t pt-2">
                          <div className="text-gray-700">
                            <span className="font-medium">確定後</span>
                          </div>
                          {participant.postAnswers?.datetime && (
                            <div className="text-gray-700">
                              <span className="font-medium">
                                {wish.postConfirmSchema.datetimeLabel || "日時"}
                                :
                              </span>{" "}
                              {participant.postAnswers.datetime ==
                              "1900/1/1 0:00"
                                ? "未回答"
                                : dayjs(
                                    participant.postAnswers.datetime
                                  ).format("YYYY/MM/DD HH:mm")}
                            </div>
                          )}
                          {participant.postAnswers?.note && (
                            <div className="text-gray-700">
                              <span className="font-medium">
                                {wish.postConfirmSchema.noteLabel || "備考"}:
                              </span>{" "}
                              {participant.postAnswers.note}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                まだ参加者がいません
              </div>
            )}
          </div>

          {canJoin && (
            <button
              onClick={async () => await handleJoinClick()}
              className="w-full py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-md">
              {wish.actionLabel}
            </button>
          )}

          {isMaxParticipantsReached && !isParticipant && !wish.withdrawn && (
            <div className="bg-orange-100 text-orange-700 text-center py-4 rounded-lg font-semibold border border-orange-300">
              募集は締め切られました（最大人数に達しました）
            </div>
          )}

          {showPostConfirmButton && (
            <button
              onClick={() => setShowPostConfirm(true)}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center space-x-2">
              <FileText size={24} />
              <span>確認項目を入力する</span>
            </button>
          )}

          {wish.withdrawn && (
            <div className="bg-gray-100 text-gray-600 text-center py-4 rounded-lg font-semibold">
              このしたいことは取り下げられました
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showParticipationConfirm}
        onClose={() => setShowParticipationConfirm(false)}
        onSubmit={handleJoin}
        schema={wish.participationConfirmSchema}
        title="参加確認"
        submitButtonText={wish.actionLabel}
      />

      <ConfirmationModal
        isOpen={showPostConfirm}
        onClose={() => setShowPostConfirm(false)}
        onSubmit={handlePostConfirm}
        schema={wish.postConfirmSchema}
        title="確認項目の入力"
        submitButtonText="送信"
      />

      {showWithdrawDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              取り下げの確認
            </h3>
            <p className="text-gray-700 mb-6">
              本当にこのしたいことを取り下げますか？この操作は取り消せません。
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowWithdrawDialog(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                キャンセル
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                取り下げる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishDetail;
