import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  FileText,
  FolderPlus,
  LogOut,
  Calendar,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { getGroups, useGroupStore } from "../store/useGroupStore";
import { useEffect } from "react";
import { useAuth, auth as accessTokenAuth } from "../store/useAuth";

const Settings = () => {
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);
  const logout = useAppStore((state) => state.logout);
  const { logout: authLogout } = useAuth();
  const currentGroupId = useAppStore((state) => state.currentGroupId);
  const groups = useGroupStore((state) => state.groups);
  let currentGroup = groups.find((g) => g.id == currentGroupId);
  const { auth } = useAuth();
  const setUser = useAppStore((state) => state.setUser);
  const setGroups = useGroupStore((state) => state.setGroups);
  useEffect(() => {
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
    })();
  }, []);

  const handleLogout = () => {
    if (confirm("ログアウトしますか？")) {
      logout();
      authLogout();
      navigate("/login");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">設定</h1>
        <p className="text-gray-600 mt-2">グループとアカウントの管理</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
            <h2 className="text-white font-bold text-lg flex items-center space-x-2">
              <Users size={24} />
              <span>グループ管理</span>
            </h2>
          </div>
          <div className="divide-y">
            <button
              onClick={() => navigate("/groups/new")}
              className="w-full px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors text-left">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FolderPlus className="text-red-600" size={24} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  グループを作成
                </div>
                <div className="text-sm text-gray-600">
                  新しいグループを作成します
                </div>
              </div>
            </button>

            {currentGroup && (
              <button
                onClick={() => navigate(`/groups/${currentGroupId}/invite`)}
                className="w-full px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors text-left">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserPlus className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    ユーザーを招待
                  </div>
                  <div className="text-sm text-gray-600">
                    「{currentGroup.name}」にユーザーを招待
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-white font-bold text-lg flex items-center space-x-2">
              <FileText size={24} />
              <span>マイページ</span>
            </h2>
          </div>
          <div className="divide-y">
            <button
              onClick={() => navigate("/my-wishes")}
              className="w-full px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors text-left">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  作成したしたいこと
                </div>
                <div className="text-sm text-gray-600">
                  あなたが作成したしたいこと一覧
                </div>
              </div>
            </button>
            {currentGroup && (
              <button
                onClick={() => navigate("/user-participation")}
                className="w-full px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors text-left">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    ユーザーごとの参加状況
                  </div>
                  <div className="text-sm text-gray-600">
                    メンバーの参加予定を確認
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {currentGroup && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-4">現在のグループ</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-bold text-lg text-gray-800 mb-2">
                {currentGroup.name}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                メンバー: {currentGroup.members.length}人
              </div>
              <div className="space-y-2">
                {currentGroup.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">
                      {member.name}
                    </span>
                    {/*<span className="text-gray-500">({member.email})</span>*/}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!currentGroupId && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-800 font-semibold">
              グループが選択されていません
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              ヘッダーからグループを選択するか、新しいグループを作成してください
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
            <h2 className="text-white font-bold text-lg flex items-center space-x-2">
              <LogOut size={24} />
              <span>アカウント</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">
                ログイン中のユーザー
              </div>
              <div className="font-semibold text-gray-800">
                {currentUser?.name}
              </div>
              <div className="text-sm text-gray-600">{currentUser?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md flex items-center justify-center space-x-2">
              <LogOut size={20} />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
