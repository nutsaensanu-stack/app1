import React, { useState, useMemo } from 'react';
import type { Driver } from '../../types';
import { DriverStatus } from '../../types';
import type { TranslationKey } from '../../lib/i18n';
import EditDriverModal from '../modals/EditDriverModal';

interface DriversViewProps {
  drivers: Driver[];
  onUpdateDriver: (driver: Driver) => Promise<void>;
  onDeleteDriver: (driverId: string) => Promise<void>;
  onSetDrivers: (drivers: Driver[]) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const DriversView: React.FC<DriversViewProps> = ({ drivers, onUpdateDriver, onDeleteDriver, onSetDrivers, t }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (driver: Driver) => {
    setEditingDriver(driver);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingDriver(null);
  };

  const handleSaveChanges = (updatedDriver: Driver) => {
    onUpdateDriver(updatedDriver);
    handleCloseModal();
  };
  
  const handleDeleteClick = (driverId: string) => {
    onDeleteDriver(driverId);
  }

  const parseDriversCsv = (csv: string) => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
      alert(t('csvInvalidFormat'));
      return;
    }
    const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1);

    const requiredHeaders = ['Driver ID', 'Driver Name', 'IDShift', 'TimeHolidayDate'];
    if (!requiredHeaders.every(h => header.includes(h))) {
      alert(t('csvUnknownFormat'));
      return;
    }

    try {
      const newDrivers: Driver[] = rows.map(row => {
        const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
        const driverData = Object.fromEntries(header.map((key, i) => [key, values[i]]));
        
        const shiftValue = driverData['IDShift'];
        let determinedShift: 'Day' | 'Night';

        // Make shift parsing more robust
        if (shiftValue?.toLowerCase() === 'day' || shiftValue?.toLowerCase() === 'night') {
            determinedShift = shiftValue.charAt(0).toUpperCase() + shiftValue.slice(1).toLowerCase() as 'Day' | 'Night';
        } else if (shiftValue && shiftValue.includes('-')) {
            // Handle time ranges like "11:00 - 20:00"
            const startTimeStr = shiftValue.split('-')[0].trim();
            const startHour = parseInt(startTimeStr.split(':')[0], 10);
            // Assume shifts starting before 6 PM (18:00) are Day shifts
            if (!isNaN(startHour) && startHour < 18) {
                determinedShift = 'Day';
            } else {
                determinedShift = 'Night';
            }
        } else {
            // Fallback for unexpected values
            console.warn(`Unrecognized shift value "${shiftValue}", defaulting to 'Day'.`);
            determinedShift = 'Day';
        }

        return {
            id: driverData['Driver ID'],
            name: driverData['Driver Name'],
            shift: determinedShift,
            holidayDate: driverData['TimeHolidayDate'],
            phone: 'N/A', // Default value
            licenseType: 'N/A', // Default value
            status: DriverStatus.Active, // Default value
        };
      });
      onSetDrivers(newDrivers);
      alert(`${newDrivers.length} ${t('drivers')} ${t('importedSuccessfully')}`);
    } catch (error) {
      console.error('Failed to parse Drivers CSV:', error);
      alert(t('csvImportError'));
    }
  };


  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          parseDriversCsv(csvText);
          setIsUploading(false);
          if (e.target) e.target.value = '';
        }
      }, 100);
    };
    reader.onerror = () => {
      alert(t('csvImportError'));
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const headers = ['Driver ID', 'Driver Name', 'IDShift', 'TimeHolidayDate'];
    const csvContent = headers.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'drivers_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const filteredDrivers = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return drivers.filter(driver =>
      driver.name.toLowerCase().includes(lowercasedTerm) ||
      driver.phone.toLowerCase().includes(lowercasedTerm) ||
      driver.shift.toLowerCase().includes(lowercasedTerm) ||
      driver.licenseType.toLowerCase().includes(lowercasedTerm) ||
      driver.status.toLowerCase().includes(lowercasedTerm)
    );
  }, [drivers, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{t('manageDrivers')}</h1>
        <div className="flex gap-2 flex-wrap justify-end items-center">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="bg-white dark:bg-dark-card border border-slate-300 dark:border-slate-600 rounded-lg pl-9 pr-3 py-2 text-sm w-48 focus:ring-2 focus:ring-primary-500 focus:outline-none"/>
          </div>
          <button onClick={handleDownloadTemplate} className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition flex items-center text-sm font-medium">
            <i className="fas fa-download mr-2"></i>{t('downloadTemplate')}
          </button>
          <label className={`bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition cursor-pointer flex items-center text-sm font-medium ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <i className="fas fa-upload mr-2"></i>{t('importBtn')}
              <input type="file" className="hidden" accept=".csv" onChange={handleImport} disabled={isUploading} />
          </label>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-primary-700 transition flex items-center text-sm font-medium">
            <i className="fas fa-plus mr-2"></i>{t('addDriver')}
          </button>
        </div>
      </div>
       {isUploading && (
          <div className="mt-4">
              <p className="text-sm font-medium mb-1 text-text-secondary dark:text-dark-text-secondary">{t('uploading')}</p>
              <div className="w-full bg-gray-200 rounded-full dark:bg-slate-700">
                  <div className="bg-primary-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${uploadProgress}%` }}> {uploadProgress}%</div>
              </div>
          </div>
      )}
      
      <div className="bg-card dark:bg-dark-card rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200/80 dark:border-slate-800">
              <tr className="text-sm text-text-secondary dark:text-dark-text-secondary">
                <th className="py-3 px-4 font-semibold">{t('name')}</th>
                <th className="py-3 px-4 font-semibold">{t('phone')}</th>
                <th className="py-3 px-4 font-semibold">{t('shift')}</th>
                <th className="py-3 px-4 font-semibold">{t('license')}</th>
                <th className="py-3 px-4 font-semibold">{t('status')}</th>
                <th className="py-3 px-4 font-semibold">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map(driver => (
                <tr key={driver.id} className="border-b border-slate-200/80 dark:border-slate-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium text-text-primary dark:text-dark-text-primary">{driver.name}</td>
                  <td className="py-3 px-4 text-text-secondary dark:text-dark-text-secondary">{driver.phone}</td>
                  <td className="py-3 px-4 text-text-secondary dark:text-dark-text-secondary">{driver.shift}</td>
                  <td className="py-3 px-4 text-text-secondary dark:text-dark-text-secondary">{driver.licenseType}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      driver.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-4">
                    <button onClick={() => handleEditClick(driver)} className="text-blue-500 hover:text-blue-700"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDeleteClick(driver.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && editingDriver && (
        <EditDriverModal
          driver={editingDriver}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
          t={t}
        />
      )}
    </div>
  );
};

export default DriversView;