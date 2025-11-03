import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Trophy, Settings } from 'lucide-react';

const FooterTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/', icon: Home, label: 'ホーム' },
    { path: '/ranking', icon: Trophy, label: 'ランキング' },
    { path: '/settings', icon: Settings, label: '設定' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="container mx-auto">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
                  isActive
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-semibold mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default FooterTabs;
