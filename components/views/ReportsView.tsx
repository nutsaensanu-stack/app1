
import React from 'react';
import type { Driver, Assignment } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TranslationKey } from '../../lib/i18n';

interface ReportsViewProps {
  drivers: Driver[];
  assignments: Assignment[];
  t: (key: TranslationKey) => string;
}

const ReportsView: React.FC<ReportsViewProps> = ({ drivers, assignments, t }) => {
  const assignmentsPerDriver = drivers.map(driver => ({
    name: driver.name,
    assignments: assignments.filter(a => a.driverId === driver.id).length,
  }));

  const shiftDistribution = drivers.reduce((acc, driver) => {
    if (driver.status === 'Active') {
      acc[driver.shift] = (acc[driver.shift] || 0) + 1;
    }
    return acc;
  }, {} as Record<'Day' | 'Night', number>);

  const shiftData = [
    { name: 'Day Shift', count: shiftDistribution.Day },
    { name: 'Night Shift', count: shiftDistribution.Night },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{t('reportsAndStats')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card dark:bg-dark-card p-6 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <h2 className="text-lg font-semibold mb-4">{t('assignmentsPerDriver')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assignmentsPerDriver} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} />
              <Legend />
              <Bar dataKey="assignments" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card dark:bg-dark-card p-6 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <h2 className="text-lg font-semibold mb-4">{t('activeDriverShiftDist')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shiftData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-card dark:bg-dark-card p-6 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <h2 className="text-lg font-semibold mb-4">{t('exportData')}</h2>
        <div className="flex flex-wrap gap-4">
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-primary-700 transition flex items-center text-sm font-medium">
              <i className="fas fa-file-csv mr-2"></i>{t('exportAllCSV')}
            </button>
            <button className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition flex items-center text-sm font-medium">
              <i className="fas fa-file-pdf mr-2"></i>{t('downloadMonthlyPDF')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;