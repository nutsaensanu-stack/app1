import React, { useMemo, useState } from 'react';
import Card from '../common/Card';
import type { Driver, PickupPoint, Assignment } from '../../types';
import { AssignmentStatus } from '../../types';
import type { TranslationKey } from '../../lib/i18n';

interface DashboardViewProps {
  drivers: Driver[];
  pickupPoints: PickupPoint[];
  assignments: Assignment[];
  t: (key: TranslationKey) => string;
}

const getDayAbbreviation = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const DriverCard: React.FC<{
  driver: Driver;
  assignments: Assignment[];
  pickupPoints: PickupPoint[];
  t: (key: TranslationKey) => string;
  selectedPoints: Set<string>;
  onToggleSelect: (pointId: string) => void;
}> = ({ driver, assignments, pickupPoints, t, selectedPoints, onToggleSelect }) => {
  const assignedPoints = useMemo(() => {
    const pointIds = assignments.filter(a => a.driverId === driver.id).map(a => a.pickupPointId);
    return pickupPoints.filter(p => pointIds.includes(p.id));
  }, [assignments, pickupPoints, driver.id]);

  // FIX: Explicitly type the initial value for the reduce function to ensure correct type inference for `groupedPoints`.
  const groupedPoints = useMemo(() => {
    return assignedPoints.reduce((acc, point) => {
      const groupKey = point.groupName || t('noGroup');
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(point);
      return acc;
    }, {} as Record<string, PickupPoint[]>);
  }, [assignedPoints, t]);

  const holidayAbbr = getDayAbbreviation(driver.holidayDate);
  const shiftTime = driver.shift === 'Day' ? '08:00 - 17:00' : '20:00 - 05:00';

  return (
    <div className="bg-card dark:bg-dark-card rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col [break-inside:avoid]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">{driver.name}</h3>
          <p className="text-xs text-text-secondary dark:text-dark-text-secondary">ID: {driver.id}</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-sm text-text-primary dark:text-dark-text-primary">{shiftTime}</p>
          <div className="flex items-center justify-end gap-2 mt-1">
            {holidayAbbr && (
              <span className="text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                <i className="fas fa-calendar-times mr-1"></i>
                {holidayAbbr}
              </span>
            )}
            <button className="text-text-secondary dark:text-dark-text-secondary hover:text-primary-500 text-xs">
              <i className="fas fa-pencil-alt"></i>
            </button>
          </div>
        </div>
      </div>
      <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">{t('pickupPointsLabel')} ({assignedPoints.length}):</p>
      <div className="flex-1 pr-2 space-y-3">
        {Object.keys(groupedPoints).length === 0 ? (
           <div className="flex items-center justify-center h-full text-sm text-text-secondary dark:text-dark-text-secondary">
             {t('noAssignments')}
           </div>
        ) : Object.entries(groupedPoints).map(([groupName, points]) => (
          <div key={groupName}>
            <h4 className="font-semibold text-sm text-primary-600 dark:text-primary-400 mb-2">{groupName}</h4>
            <ul className="space-y-2">
              {points.map(point => {
                const isSelected = selectedPoints.has(point.id);
                return (
                  <li key={point.id} className="bg-background dark:bg-slate-900/70 p-2.5 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">{point.id}</p>
                      <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{point.name || t('noInfo')}</p>
                    </div>
                    <button
                      onClick={() => onToggleSelect(point.id)}
                      className={`p-1.5 w-7 h-7 flex items-center justify-center text-sm rounded-md transition-colors ${
                        isSelected
                          ? 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400'
                          : 'text-text-secondary dark:text-dark-text-secondary hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                      aria-pressed={isSelected}
                    >
                       <i className={`fas ${isSelected ? 'fa-check' : 'fa-copy'}`}></i>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};


const DashboardView: React.FC<DashboardViewProps> = ({ drivers, pickupPoints, assignments, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoints, setSelectedPoints] = useState<Set<string>>(new Set());

  const handleTogglePointSelection = (pointId: string) => {
    setSelectedPoints(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(pointId)) {
        newSelected.delete(pointId);
      } else {
        newSelected.add(pointId);
      }
      return newSelected;
    });
  };
  
  const activeDrivers = drivers.filter(d => d.status === 'Active').length;
  const onLeaveDrivers = drivers.length - activeDrivers;
  const totalGroups = new Set(pickupPoints.map(p => p.groupName)).size;

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === AssignmentStatus.Completed).length;
  const progressPercent = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  const filteredDrivers = useMemo(() => 
    drivers.filter(driver => 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [drivers, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="bg-card dark:bg-dark-card p-6 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center space-x-4">
          <i className="fas fa-truck-fast text-3xl text-primary-500"></i>
          <div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{t('driverManagement')}</h1>
            <p className="text-text-secondary dark:text-dark-text-secondary">{t('driverManagementDesc')}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-card dark:bg-dark-card p-1 rounded-lg border border-slate-200/80 dark:border-slate-800">
          <button className="px-4 py-1.5 text-sm rounded-md bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-slate-100 font-semibold">{t('staff')}</button>
          <button className="px-4 py-1.5 text-sm rounded-md text-text-secondary dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-slate-700">{t('pickupGroups')}</button>
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder={t('search')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background dark:bg-dark-background rounded-md pl-9 pr-3 py-1.5 text-sm w-40 focus:ring-2 focus:ring-primary-500 focus:outline-none border border-transparent focus:border-primary-400"/>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
          <button className="px-3 py-1.5 text-sm rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2"><i className="fas fa-sync-alt"></i> {t('reload')}</button>
          <button className="px-3 py-1.5 text-sm rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2"><i className="fas fa-sliders-h"></i> {t('workload')}</button>
          <button className="px-3 py-1.5 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-2"><i className="fas fa-magic"></i> {t('aiSuggest')}</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title={t('staff')} value={drivers.length} icon="fa-users" color="blue" />
        <Card title={t('workingToday')} value={activeDrivers} icon="fa-user-check" color="green" />
        <Card title={t('onLeave')} value={onLeaveDrivers} icon="fa-user-clock" color="red" />
        <Card title={t('totalGroups')} value={totalGroups} icon="fa-layer-group" color="purple" />
      </div>

       <div>
        <div className="flex justify-between items-center mb-1 px-1">
          <span className="text-xs font-medium text-text-secondary dark:text-dark-text-secondary">{t('assignmentStatus')}</span>
          <span className="text-xs font-semibold text-text-primary dark:text-dark-text-primary">{completedAssignments} / {totalAssignments}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-slate-700">
          <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="columns-1 md:columns-2 xl:columns-4 gap-6 space-y-6">
        {filteredDrivers.map(driver => (
          <DriverCard 
            key={driver.id} 
            driver={driver} 
            assignments={assignments} 
            pickupPoints={pickupPoints} 
            t={t}
            selectedPoints={selectedPoints}
            onToggleSelect={handleTogglePointSelection} 
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardView;