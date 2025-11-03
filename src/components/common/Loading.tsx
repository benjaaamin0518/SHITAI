import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading = ({ message = '読み込み中...', fullScreen = false }: LoadingProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex flex-col items-center justify-center z-50">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-3" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default Loading;
