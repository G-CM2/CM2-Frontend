import { cn } from '@/lib/utils';
import { TutorialMenu } from '@/widgets/tutorial/ui/tutorial-menu';
import {
    ChevronRight,
    Container,
    HelpCircle,
    Layers,
    LayoutDashboard,
    Server
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  {
    name: '대시보드',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: '컨테이너',
    href: '/containers',
    icon: Container,
  },
  {
    name: '서비스',
    href: '/services',
    icon: Server,
  },
  {
    name: '클러스터',
    href: '/cluster',
    icon: Layers,
  },
  {
    name: '튜토리얼',
    href: '/tutorial',
    icon: HelpCircle,
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [showTutorialMenu, setShowTutorialMenu] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          Container Manager
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Docker 컨테이너 관리 대시보드
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            if (item.name === '튜토리얼') {
              return (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => setShowTutorialMenu(true)}
                    className={cn(
                      'flex w-full items-center justify-between p-3 rounded-lg transition-colors group',
                      active
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center">
                      <Icon className={cn(
                        'w-5 h-5 mr-3',
                        active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      )} />
                      <div>
                        <div className="font-medium">{item.name}</div>
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      'w-4 h-4 transition-transform',
                      active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    )} />
                  </button>
                </li>
              );
            }
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg transition-colors group',
                    active
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center">
                    <Icon className={cn(
                      'w-5 h-5 mr-3',
                      active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    )} />
                    <div>
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    'w-4 h-4 transition-transform',
                    active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  )} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div>Version 1.0.0</div>
          <div className="mt-1">© 2024 Container Manager</div>
        </div>
      </div>
      {/* 튜토리얼 메뉴 모달 */}
      {showTutorialMenu && (
        <TutorialMenu onClose={() => setShowTutorialMenu(false)} />
      )}
    </div>
  );
}; 