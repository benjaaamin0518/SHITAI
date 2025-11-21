import { useAppStore } from "../store/useAppStore";
import { getWishes, useWishStore } from "../store/useWishStore";
import WishList from "../components/wish/WishList";
import { useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import { getGroups, useGroupStore } from "../store/useGroupStore";
import { useNavigate } from "react-router-dom";
import { useAuth, auth as accessTokenAuth } from "../store/useAuth";
import { Wish } from "../types/NeonApiInterface";

const MyWishes = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const getWishesByCreatorId = useWishStore(
    (state) => state.getWishesByCreatorId
  );
  const [isLoading, setIsLoading] = useState(true);
  const setWishes = useWishStore((state) => state.setWishes);
  const { auth } = useAuth();
  const setUser = useAppStore((state) => state.setUser);
  const setGroups = useGroupStore((state) => state.setGroups);
  const navigate = useNavigate();
  
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
      setWishes(await getWishes());
      setIsLoading(false);
    })();
  }, []);
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="text-center py-12 text-gray-500">
          <p>ユーザー情報が見つかりません</p>
        </div>
      </div>
    );
  }
  const mywishes(getWishesByCreatorId(currentUser.id));
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-20">
        <Loading message="したいことを読み込んでいます..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">作成したしたいこと</h1>
        <p className="text-gray-600 mt-2">あなたが作成したしたいこと一覧</p>
      </div>

      <WishList
        wishes={myWishes}
        emptyMessage="まだしたいことを作成していません"
      />
    </div>
  );
};

export default MyWishes;
