import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { getGroups, useGroupStore } from "../store/useGroupStore";
import {
  getWishes,
  getWishesByGroupIdCall,
  useWishStore,
} from "../store/useWishStore";
import ParticipationCalendar from "../components/calendar/ParticipationCalendar";
import dayjs from "dayjs";
import { Wish } from "../types/NeonApiInterface";
import Loading from "../components/common/Loading";
import { useAuth, auth as accessTokenAuth } from "../store/useAuth";

const UserParticipation = () => {
  const navigate = useNavigate();
  const currentGroupId = useAppStore((state) => state.currentGroupId);
  let currentGroup = useGroupStore().groups.find((g) => g.id == currentGroupId);
  const groups = useGroupStore((state) => state.groups);
  const getWishesByGroupId = useWishStore((state) => state.getWishesByGroupId);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedUserIds(selectedOptions);
    setSelectedDate(null);
  };
  const [isLoading, setIsLoading] = useState(true);
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
  const getUserParticipationData = () => {
    console.log(selectedUserIds);
    if (!currentGroupId || selectedUserIds.length === 0)
      return { eventDates: [], wishesByDate: {} };

    const allWishes = getWishesByGroupId(currentGroupId).filter(
      (w) => !w.withdrawn
    );
    console.log(allWishes);
    const userWishes = allWishes.filter((wish) =>
      wish.participants.some((p) =>
        selectedUserIds.includes(p.userId.toString())
      )
    );

    const wishesByDate: { [key: string]: Wish[] } = {};
    const eventDates: string[] = [];

    userWishes.forEach((wish) => {
      if (wish.implementationDatetime) {
        const dateKey = dayjs(wish.implementationDatetime)
          .utc()
          .format("YYYY-MM-DD");
        if (!wishesByDate[dateKey]) {
          wishesByDate[dateKey] = [];
          eventDates.push(dateKey);
        }
        wishesByDate[dateKey].push(wish);
      }
    });

    Object.keys(wishesByDate).forEach((date) => {
      wishesByDate[date].sort((a, b) => {
        const timeA = dayjs(a.implementationDatetime).utc().valueOf();
        const timeB = dayjs(b.implementationDatetime).utc().valueOf();
        return timeA - timeB;
      });
    });
    console.log(userWishes, wishesByDate);
    return { eventDates, wishesByDate };
  };

  const { eventDates, wishesByDate } = getUserParticipationData();
  const sortedDates = Object.keys(wishesByDate).sort(
    (a, b) => dayjs(a).utc().valueOf() - dayjs(b).utc().valueOf()
  );

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    const element = dateRefs.current[date];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (selectedDate && dateRefs.current[selectedDate]) {
      setTimeout(() => {
        dateRefs.current[selectedDate]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedDate]);
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-20">
        <Loading message="参加状況を読み込んでいます..." />
      </div>
    );
  }
  if (!currentGroup) {
    return (
      <div className="container mx-auto px-4 py-6 pb-20 max-w-2xl">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-800 font-semibold">
            グループが選択されていません
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            ヘッダーからグループを選択するか、新しいグループを作成してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-20 max-w-2xl">
      <div className="mb-6">
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4">
          <ArrowLeft size={20} />
          <span>設定に戻る</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          ユーザーごとの参加状況
        </h1>
        <p className="text-gray-600 mt-2">メンバーの参加予定を確認</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ユーザーを選択（複数選択可）
            </label>
            <select
              multiple
              value={selectedUserIds}
              onChange={handleUserSelect}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              size={Math.min(currentGroup.members.length, 5)}>
              {currentGroup.members.map((member) => (
                <option key={member.id} value={member.id} className="py-2">
                  {member.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Ctrl（Mac: Command）を押しながらクリックで複数選択
            </p>
          </div>

          {selectedUserIds.length > 0 && (
            <>
              <div className="mb-6">
                <ParticipationCalendar
                  eventDates={eventDates}
                  onDateClick={handleDateClick}
                  selectedDate={selectedDate}
                />
              </div>

              {sortedDates.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    参加予定のしたいこと
                  </h3>
                  {sortedDates.map((date) => (
                    <div
                      key={date}
                      ref={(el) => (dateRefs.current[date] = el)}
                      className="scroll-mt-6">
                      <div className="bg-red-50 px-4 py-2 rounded-t-lg border-l-4 border-red-500">
                        <h4 className="font-bold text-red-800">
                          {dayjs(date).format("YYYY年M月D日 (ddd)")}
                        </h4>
                      </div>
                      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg divide-y">
                        {wishesByDate[date].map((wish) => {
                          const participantNames = wish.participants
                            .filter((p) =>
                              selectedUserIds.includes(p.userId.toString())
                            )
                            .map((p) => {
                              const user = currentGroup?.members.find(
                                (m) => m.id == p.userId
                              );
                              return user?.name;
                            })
                            .filter(Boolean)
                            .join(", ");

                          return (
                            <div
                              key={wish.id}
                              className="p-4 hover:bg-gray-50 transition-colors">
                              <button
                                onClick={() => navigate(`/wish/${wish.id}`)}
                                className="w-full text-left">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-800 mb-1">
                                      {wish.title}
                                    </div>
                                    {wish.implementationDatetime && (
                                      <div className="text-sm text-gray-600 mb-1">
                                        {dayjs(wish.implementationDatetime)
                                          .utc()
                                          .format("HH:mm")}
                                      </div>
                                    )}
                                    <div className="text-sm text-purple-600 font-medium">
                                      参加者: {participantNames}
                                    </div>
                                  </div>
                                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                    {wish.category}
                                  </span>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  選択したユーザーの参加予定はありません
                </div>
              )}
            </>
          )}

          {selectedUserIds.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ユーザーを選択してください
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserParticipation;
