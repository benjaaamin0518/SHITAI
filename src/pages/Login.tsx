import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { TestUser, User } from "../types/NeonApiInterface";
import { useAuth } from "../store/useAuth";
import { getGroups, useGroupStore } from "../store/useGroupStore";

const testUsers: TestUser[] = [
  {
    name: "田中太郎",
    email: "tanaka@example.com",
    password: "testtest",
  },
  {
    name: "佐藤花子",
    email: "sato@example.com",
    password: "testtest",
  },
  {
    name: "鈴木一郎",
    email: "suzuki@example.com",
    password: "testtest",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const setUser = useAppStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setGroups = useGroupStore((state) => state.setGroups);
  const selectGroup = useAppStore((state) => state.selectGroup);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const response = await login(email, password);
    const user = response;

    if (user.statusCode === 200) {
      setUser({
        id: user.id ? user.id.toString() : "",
        name: user.name,
        email: user.email,
      });
      const groups = await getGroups();
      localStorage.removeItem("shitai-groupId");
      selectGroup(null);
      localStorage.setItem("shitai-groups", JSON.stringify(groups));
      setGroups(groups);
      navigate("/");
    } else {
      setError(
        "ユーザーが見つかりません。正しいメールアドレスを入力してください。"
      );
    }
    setIsLoading(false);
  };

  const handleQuickLogin = async (user: TestUser) => {
    setError("");
    setIsLoading(true);

    const response = await login(user.email, user.password);

    if (response.statusCode === 200) {
      setUser({
        id: response.id ? response.id.toString() : "",
        name: response.name,
        email: response.email,
      });
      const groups = await getGroups();
      localStorage.setItem("shitai-groups", JSON.stringify(groups));
      setGroups(groups);
      navigate("/");
    } else {
      setError(
        "ユーザーが見つかりません。正しいメールアドレスを入力してください。"
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">SHITAI</h1>
          <p className="text-red-100 text-lg">したいことを叶えよう</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <LogIn className="text-red-600" size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            ログイン
          </h2>

          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md">
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          <div className="text-center mb-6">
            <button
              onClick={() => navigate("/register")}
              className="text-red-600 hover:text-red-700 font-medium text-sm">
              新規ユーザー登録はこちら
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 text-center mb-4">
              テストユーザーでログイン
            </p>
            <div className="space-y-2">
              {testUsers.map((user) => (
                <button
                  key={user.name}
                  onClick={() => handleQuickLogin(user)}
                  disabled={isLoading}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-left px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                    <LogIn size={20} className="text-gray-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
