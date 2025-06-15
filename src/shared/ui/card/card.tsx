import { cn } from '@/shared/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ title, children, className = '' }: CardProps) => {
  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-full", className)}>
      {title && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export const CardHeader = ({ children, className }: CardHeaderProps) => {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-200 dark:border-gray-700", className)}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className }: CardTitleProps) => {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className }: CardDescriptionProps) => {
  return (
    <p className={cn("text-sm text-gray-600 dark:text-gray-400 mt-1", className)}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className }: CardContentProps) => {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  );
}; 