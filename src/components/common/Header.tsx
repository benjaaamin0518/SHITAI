import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { useGroupStore } from "../../store/useGroupStore";

const Header = () => {
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);
  const currentGroupId = useAppStore((state) => state.currentGroupId);
  const selectGroup = useAppStore((state) => state.selectGroup);
  const groups = useGroupStore((state) => state.groups);

  const handleGroupChange = (groupId: string) => {
    selectGroup(groupId || null);
    if (groupId) {
      navigate("/");
    }
  };

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold tracking-wide">SHITAI</h1>

            {groups.length > 0 && (
              <select
                value={currentGroupId || ""}
                onChange={(e) => handleGroupChange(e.target.value)}
                className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-300">
                <option value="">グループを選択</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
              <User size={20} />
              <span className="font-semibold">
                {currentUser?.name || "Guest"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
