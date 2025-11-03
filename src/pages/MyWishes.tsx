import { useAppStore } from '../store/useAppStore';
import { useWishStore } from '../store/useWishStore';
import WishList from '../components/wish/WishList';

const MyWishes = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const getWishesByCreatorId = useWishStore((state) => state.getWishesByCreatorId);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="text-center py-12 text-gray-500">
          <p>ユーザー情報が見つかりません</p>
        </div>
      </div>
    );
  }

  const myWishes = getWishesByCreatorId(currentUser.id);

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
