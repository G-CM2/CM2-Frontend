import { cn } from '@/lib/utils';
import {
    ChevronRight,
    Container,
    LayoutDashboard
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  {
    title: '대시보드',
    icon: LayoutDashboard,
    path: '/dashboard',
    description: '전체 시스템 현황'
  },
  {
    title: '컨테이너',
    icon: Container,
    path: '/containers',
    description: '컨테이너 목록 및 관리'
  }
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

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
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
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
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
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
    </div>
  );
}; 