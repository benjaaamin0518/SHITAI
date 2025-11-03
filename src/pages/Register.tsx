import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { User } from "../types/NeonApiInterface";
import { NeonClientApi } from "../components/common/NeonApiClient";
import { useAuth } from "../store/useAuth";
const Register = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const setUser = useAppStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const client = new NeonClientApi();
  const { login } = useAuth();
  if (isAuthenticated) {
    logout();
  }
  const handleRegister = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setError("");

      if (password !== confirmPassword) {
        setError("パスワードが一致しません");
        return;
      }

      if (password.length < 6) {
        setError("パスワードは6文字以上で入力してください");
        return;
      }

      setIsLoading(true);

      const result = await client.insertUserInfo({
        email: email!,
        password: password!,
        ...(name ? { name } : {}),
      });
      if (result !== 200) {
        setError("登録に失敗しました。");
        setIsLoading(false);
        return;
      }
      await login(email, password);
      navigate("/login");
    } catch (err) {
      setError("登録に失敗しました。");
    } finally {
      setIsLoading(false);
    }
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
              <UserPlus className="text-red-600" size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            新規ユーザー登録
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                名前
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田太郎"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

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
                placeholder="6文字以上"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                パスワード（確認）
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="もう一度入力"
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
              {isLoading ? "登録中..." : "登録"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-red-600 hover:text-red-700 font-medium text-sm">
              すでにアカウントをお持ちの方はこちら
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white text-sm">
            デモアプリケーションです。入力された情報はローカルに保存されます。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
