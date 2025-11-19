import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteFormSchema } from "../utils/validators";
import Loading from "../components/common/Loading";
import { useEffect, useState } from "react";
import { getGroups, useGroupStore } from "../store/useGroupStore";
import { useAuth, auth as accessTokenAuth } from "../store/useAuth";
import { useAppStore } from "../store/useAppStore";
interface InviteFormData {
  email: string;
}

const InviteUser = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const inviteUser = useGroupStore((state) => state.inviteUser);
  const getGroupById = useGroupStore((state) => state.getGroupById);
  const [isLoading, setIsLoading] = useState(false);

  const { auth } = useAuth();
  const setUser = useAppStore((state) => state.setUser);
  const setGroups = useGroupStore((state) => state.setGroups);
  const currentGroupId = useAppStore((state) => state.currentGroupId);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const beforeToken = localStorage.getItem("shitai-accessToken");
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
      setIsLoading(false);
    })();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
  });

  if (!groupId) {
    return null;
  }
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-20">
        <Loading message="招待中です..." />
      </div>
    );
  }

  const group = getGroupById(groupId);

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="text-center py-12 text-gray-500">
          <p>グループが見つかりません</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: InviteFormData) => {
    setIsLoading(true);
    await inviteUser(groupId, data.email);
    alert(`${data.email} を招待しました！`);
    setIsLoading(false);
    reset();
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">ユーザーを招待</h1>
        <p className="text-gray-600 mt-2">
          「{group.name}」にユーザーを招待します
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              メールアドレス <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="example@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              招待されたユーザーは自動的にこのグループに追加されます。
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              戻る
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
              招待
            </button>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            現在のメンバー ({group.members.length}人)
          </h3>
          <div className="space-y-2">
            {group.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium">{member.name}</span>
                <span className="text-gray-400">({member.email})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteUser;
