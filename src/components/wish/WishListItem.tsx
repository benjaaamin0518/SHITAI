import { useNavigate } from "react-router-dom";
import { Calendar, Users, CheckCircle } from "lucide-react";
import { Wish } from "../../types/NeonApiInterface";
import { useWishStore } from "../../store/useWishStore";
import dayjs from "dayjs";
import { formatDisplayDate } from "../../utils/date";

interface WishListItemProps {
  wish: Wish;
}

const WishListItem = ({ wish }: WishListItemProps) => {
  const navigate = useNavigate();
  const isWishConfirmed = useWishStore((state) => state.isWishConfirmed);
  const isConfirmed = isWishConfirmed(wish);

  return (
    <div
      onClick={() => navigate(`/wish/${wish.id}`)}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden ${
        wish.withdrawn ? "opacity-60" : ""
      }`}>
      <div className="flex h-48">
        {wish.imageData && (
          <div className="flex-shrink-0 w-32">
            <img
              src={wish.imageData}
              alt={wish.title}
              className="w-32 h-48 object-cover"
            />
          </div>
        )}

        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded mb-2">
                {wish.category}
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">
                {wish.title}
              </h3>
            </div>

            {isConfirmed && (
              <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                <CheckCircle size={16} />
                <span>確定</span>
              </div>
            )}

            {wish.withdrawn && (
              <div className="bg-gray-400 text-white px-3 py-1 ml-2 rounded-full text-sm font-semibold">
                取り下げ済み
              </div>
            )}
          </div>

          <div className="space-y-1 text-sm">
            {(wish.implementationDatetime && (
              <div className="flex items-center text-gray-600">
                <Calendar size={14} className="mr-1" />
                <span>{formatDisplayDate(wish.implementationDatetime)}</span>
              </div>
            )) ||
              (wish.displayDate && (
                <div className="flex items-center text-gray-600">
                  <Calendar size={14} className="mr-1" />
                  <span>{wish.displayDate}</span>
                </div>
              ))}

            {wish.displayText && (
              <p className="text-gray-600 line-clamp-2">{wish.displayText}</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-1 text-blue-600">
                <Users size={16} />
                <span className="font-semibold">
                  {wish.participants.length} / {wish.maxParticipants}人
                </span>
              </div>

              {wish.deadline && (
                <div className="text-xs text-orange-600 font-semibold">
                  期限: {dayjs(wish.deadline).tz("Asia/Tokyo").fromNow()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishListItem;
