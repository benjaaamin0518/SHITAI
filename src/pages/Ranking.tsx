import { useNavigate } from "react-router-dom";
import { Trophy, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import {
  getWishes,
  getWishesByGroupIdCall,
  useWishStore,
} from "../store/useWishStore";
import Loading from "../components/common/Loading";
import { useAuth, auth as accessTokenAuth } from "../store/useAuth";
import { getGroups, useGroupStore } from "../store/useGroupStore";

const Ranking = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const currentGroupId = useAppStore((state) => state.currentGroupId);
  const wishes = useWishStore((state) => state.wishes);
  const getRankingWishes = useWishStore((state) => state.getRankingWishes);
  const setWishes = useWishStore((state) => state.setWishes);
  const { auth } = useAuth();
  const setUser = useAppStore((state) => state.setUser);
  const setGroups = useGroupStore((state) => state.setGroups);
  const currentUser = useAppStore((state) => state.currentUser);

  if (!currentGroupId) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="text-center py-12 text-gray-500">
          <p>グループを選択してください</p>
        </div>
      </div>
    );
  }
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const beforeToken = localStorage.getItem("shitai-accessToken");
      if (currentUser == null) {
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
      }
      const afterToken = localStorage.getItem("shitai-accessToken");
      if (beforeToken != afterToken) {
        const groups = await getGroups();
        localStorage.setItem("shitai-groups", JSON.stringify(groups));
        setGroups(groups);
      } else {
        const groups = localStorage.getItem("shitai-groups");
        if (groups) {
          setGroups(JSON.parse(groups));
        }
      }
      if (currentGroupId) {
        setWishes(await getWishesByGroupIdCall(currentGroupId));
      }
      setIsLoading(false);
    })();
  }, []);

  const rankingWishes = getRankingWishes().filter(
    (w) => w.groupId == currentGroupId
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-20">
        <Loading message="ランキングを読み込んでいます..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Trophy className="text-yellow-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">ランキング</h1>
        </div>
        <p className="text-gray-600">参加人数の多い順</p>
      </div>

      {rankingWishes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>未確定のしたいことがありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rankingWishes.map((wish, index) => (
            <div
              key={wish.id}
              onClick={() => navigate(`/wish/${wish.id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
              <div className="flex items-center p-4">
                <div className="flex-shrink-0 w-16 text-center">
                  {index === 0 && (
                    <div className="text-3xl font-bold text-yellow-500">
                      1st
                    </div>
                  )}
                  {index === 1 && (
                    <div className="text-3xl font-bold text-gray-400">2nd</div>
                  )}
                  {index === 2 && (
                    <div className="text-3xl font-bold text-orange-600">
                      3rd
                    </div>
                  )}
                  {index > 2 && (
                    <div className="text-2xl font-bold text-gray-600">
                      {index + 1}
                    </div>
                  )}
                </div>

                {wish.imageData && (
                  <div className="flex-shrink-0 w-24 h-24 ml-4">
                    <img
                      src={wish.imageData}
                      alt={wish.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}

                <div className="flex-1 ml-4">
                  <div className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded mb-2">
                    {wish.category}
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {wish.title}
                  </h3>
                  {wish.displayText && (
                    <p className="text-sm text-gray-600">{wish.displayText}</p>
                  )}
                </div>

                <div className="flex-shrink-0 ml-4 text-center">
                  <div className="flex items-center justify-center space-x-1 text-blue-600">
                    <Users size={20} />
                    <span className="text-2xl font-bold">
                      {wish.participants.length}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    / {wish.maxParticipants}人
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ranking;
