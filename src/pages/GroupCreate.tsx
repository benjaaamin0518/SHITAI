import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppStore } from '../store/useAppStore';
import { useGroupStore } from '../store/useGroupStore';
import { groupFormSchema } from '../utils/validators';

interface GroupFormData {
  name: string;
}

const GroupCreate = () => {
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);
  const selectGroup = useAppStore((state) => state.selectGroup);
  const createGroup = useGroupStore((state) => state.createGroup);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
  });

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="text-center py-12 text-gray-500">
          <p>ユーザー情報が見つかりません</p>
        </div>
      </div>
    );
  }

  const onSubmit = (data: GroupFormData) => {
    const groupId = createGroup(data.name, currentUser);
    selectGroup(groupId);
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">グループを作成</h1>
        <p className="text-gray-600 mt-2">新しいグループを作成します</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              グループ名 <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="例：友達グループ"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupCreate;
