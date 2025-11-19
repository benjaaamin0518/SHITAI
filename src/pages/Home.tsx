import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { DEFAULT_CATEGORIES, useAppStore } from "../store/useAppStore";
import {
  getWishes,
  getWishesByGroupIdCall,
  useWishStore,
} from "../store/useWishStore";
import WishList from "../components/wish/WishList";
import Loading from "../components/common/Loading";
import dayjs from "dayjs";
import { getGroups, useGroupStore } from "../store/useGroupStore";
import { useAuth, auth as accessTokenAuth } from "../store/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const currentGroupId = useAppStore((state) => state.currentGroupId);
  const categories = useAppStore((state) => state.categories);
  const getWishesByGroupId = useWishStore((state) => state.getWishesByGroupId);
  const isWishConfirmed = useWishStore((state) => state.isWishConfirmed);
  const setWishes = useWishStore((state) => state.setWishes);
  const setCategories = useAppStore((state) => state.setCategories);
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
        const cat = Array.from(
          new Set([
            ...DEFAULT_CATEGORIES,
            ...getWishesByGroupId(currentGroupId).map((ele) => ele.category),
          ])
        );
        setCategories(cat);
        setIsLoading(false);
      }
    })();
  }, [currentGroupId]);

  const allCategories = ["すべて", ...categories];

  if (!currentGroupId) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">グループを選択してください</p>
          <button
            onClick={() => navigate("/settings")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
            設定へ
          </button>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-20">
        <Loading message="したいことを読み込んでいます..." />
      </div>
    );
  }

  const allWishes = getWishesByGroupId(currentGroupId).filter((w) => {
    if (w.withdrawn) return false;
    if (w.deadline) {
      const deadlineDate = new Date(w.deadline);
      const now = new Date();
      if (deadlineDate < now) return false;
    }
    return true;
  });

  const filteredWishes =
    selectedCategory === "すべて"
      ? allWishes
      : allWishes.filter((w) => w.category === selectedCategory);

  const recentWishes = [...filteredWishes]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const approachingDeadline = filteredWishes
    .filter((w) => w.deadline)
    .sort((a, b) => {
      if (!a.deadline || !b.deadline) return 0;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })
    .slice(0, 5);

  const unconfirmedWishes = filteredWishes.filter((w) => !isWishConfirmed(w));
  const confirmedWishes = filteredWishes.filter((w) => isWishConfirmed(w));

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ホーム</h1>
          <p className="text-gray-600 mt-1">グループのしたいこと一覧</p>
        </div>
        <button
          onClick={() => navigate("/create")}
          className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md">
          <Plus size={20} />
          <span>新規作成</span>
        </button>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          カテゴリで絞り込み
        </h3>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-red-600 pl-3">
            新着（直近5件）
          </h2>
          <WishList
            wishes={recentWishes}
            emptyMessage="まだしたいことがありません"
          />
        </section>

        {approachingDeadline.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">
              期限接近
            </h2>
            <WishList
              wishes={approachingDeadline}
              emptyMessage="期限が設定されたしたいことはありません"
            />
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
            未確定（{unconfirmedWishes.length}件）
          </h2>
          <WishList
            wishes={unconfirmedWishes}
            emptyMessage="未確定のしたいことはありません"
          />
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-green-600 pl-3">
            確定済み（{confirmedWishes.length}件）
          </h2>
          <WishList
            wishes={confirmedWishes}
            emptyMessage="確定済みのしたいことはありません"
          />
        </section>
      </div>
    </div>
  );
};

export default Home;
