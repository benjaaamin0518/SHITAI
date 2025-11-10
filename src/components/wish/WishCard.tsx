import { useNavigate } from "react-router-dom";
import { Wish } from "../../types/NeonApiInterface";
import { useWishStore } from "../../store/useWishStore";
import { Calendar, Users, Clock } from "lucide-react";
import dayjs from "dayjs";
import { formatDisplayDate } from "../../utils/date";

interface WishCardProps {
  wish: Wish;
}

const WishCard = ({ wish }: WishCardProps) => {
  const navigate = useNavigate();
  const isWishConfirmed = useWishStore((state) => state.isWishConfirmed);
  const isConfirmed = isWishConfirmed(wish);

  const getTimeRemaining = () => {
    if (!wish.deadline) return null;
    const now = dayjs().utc();
    const deadline = dayjs(wish.deadline).utc();
    const diff = deadline.diff(now);

    if (diff < 0) return "期限切れ";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `残り ${days}日`;
    if (hours > 0) return `残り ${hours}時間`;
    return "間もなく終了";
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div
      onClick={() => navigate(`/wish/${wish.id}`)}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col ${
        wish.withdrawn ? "opacity-60" : ""
      }`}
      style={{ height: "400px" }}>
      {wish.imageData && (
        <div
          className="relative w-full flex-shrink-0"
          style={{ height: "auto" }}>
          <img
            src={wish.imageData}
            alt={wish.title}
            className="w-full h-full object-cover"
          />
          {isConfirmed && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              確定
            </div>
          )}
          {wish.withdrawn && (
            <div className="absolute top-2 right-2 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              取り下げ済み
            </div>
          )}
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <div className="text-xs text-red-600 font-semibold mb-2 uppercase">
          {wish.category}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {wish.title}
        </h3>
        {(wish.implementationDatetime && (
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Calendar size={14} className="mr-1 flex-shrink-0" />
            <span>{formatDisplayDate(wish.implementationDatetime)}</span>
          </div>
        )) ||
          (wish.displayDate && (
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Calendar size={14} className="mr-1 flex-shrink-0" />
              <span>{wish.displayDate}</span>
            </div>
          ))}
        {wish.displayText && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {wish.displayText}
          </p>
        )}
        <div className="flex items-center justify-between text-sm mt-auto">
          <div className="flex items-center text-gray-700">
            <Users size={16} className="mr-1" />
            <span className="font-semibold">
              {wish.participants.length}/{wish.minParticipants}
              {wish.maxParticipants && `〜${wish.maxParticipants}`}
            </span>
          </div>
          {timeRemaining && (
            <div className="flex items-center text-orange-600 font-medium">
              <Clock size={14} className="mr-1" />
              <span>{timeRemaining}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishCard;
