import { Wish } from "../../types/NeonApiInterface";
import WishListItem from "./WishListItem";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";

dayjs.extend(relativeTime);
dayjs.locale("ja");

interface WishListProps {
  wishes: Wish[];
  emptyMessage?: string;
}

const WishList = ({ wishes, emptyMessage }: WishListProps) => {
  if (wishes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {wishes.map((wish) => (
        <WishListItem key={wish.id} wish={wish} />
      ))}
    </div>
  );
};

export default WishList;
