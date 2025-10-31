import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'red' | 'purple';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-600 dark:text-green-400',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/50',
    text: 'text-red-600 dark:text-red-400',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/50',
    text: 'text-purple-600 dark:text-purple-400',
  },
};

const Card: React.FC<CardProps> = ({ title, value, icon, color }) => {
  const colors = colorClasses[color];
  return (
    <div className="bg-card dark:bg-dark-card p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colors.bg}`}>
        <i className={`fas ${icon} text-xl w-6 h-6 text-center ${colors.text}`}></i>
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{value}</p>
      </div>
    </div>
  );
};

export default Card;