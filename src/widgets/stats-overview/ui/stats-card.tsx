import React, { ReactNode } from 'react';
import { Card } from '@/shared/ui';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard = ({ title, value, icon, trend }: StatsCardProps) => {
  return (
    <Card title={title} className="h-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <span className="text-3xl font-bold">{value}</span>
          
          {trend && (
            <div className="flex items-center">
              <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
                <svg 
                  className="w-4 h-4 inline" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={trend.isPositive 
                      ? "M5 10l7-7m0 0l7 7m-7-7v18" 
                      : "M19 14l-7 7m0 0l-7-7m7 7V3"} 
                  />
                </svg>
                <span className="ml-1 text-xs">{Math.abs(trend.value)}%</span>
              </span>
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">지난주 대비</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
          {icon}
        </div>
      </div>
    </Card>
  );
}; 