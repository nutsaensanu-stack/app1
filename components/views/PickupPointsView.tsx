import React, { useState, useMemo } from 'react';
import type { PickupPoint } from '../../types';
import type { TranslationKey } from '../../lib/i18n';

interface PickupPointsViewProps {
  pickupPoints: PickupPoint[];
  setPickupPoints: (points: PickupPoint[]) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const PickupPointsView: React.FC<PickupPointsViewProps> = ({ pickupPoints, setPickupPoints, t }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const parsePickupPointsCsv = (csv: string) => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
      alert(t('csvInvalidFormat'));
      return;
    }
    const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1);

    const requiredHeaders = ['Group Name', 'Pickup Point ID', 'Pickup Point Name', 'Text Address'];
    if (!requiredHeaders.every(h => header.includes(h))) {
      alert(t('csvUnknownFormat'));
      return;
    }

    try {
      const newPickupPoints: PickupPoint[] = rows.map(row => {
        const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
        const pointData = Object.fromEntries(header.map((key, i) => [key, values[i]]));
        return {
            id: pointData['Pickup Point ID'],
            groupName: pointData['Group Name'],
            name: pointData['Pickup Point Name'],
            address: pointData['Text Address'],
            gps: { lat: 0, lng: 0 },
            contactPerson: 'N/A',
            contactPhone: 'N/A',
        };
      });
      setPickupPoints(newPickupPoints);
      alert(`${newPickupPoints.length} ${t('pickupPoints')} ${t('importedSuccessfully')}`);
    } catch (error) {
      console.error('Failed to parse Pickup Points CSV:', error);
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
          parsePickupPointsCsv(csvText);
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
    const headers = ['Group Name', 'Pickup Point ID', 'Pickup Point Name', 'Text Address'];
    const csvContent = headers.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pickup_points_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const filteredPickupPoints = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return pickupPoints.filter(point =>
      point.name.toLowerCase().includes(lowercasedTerm) ||
      point.address.toLowerCase().includes(lowercasedTerm) ||
      point.groupName.toLowerCase().includes(lowercasedTerm) ||
      point.contactPerson.toLowerCase().includes(lowercasedTerm)
    );
  }, [pickupPoints, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{t('managePickupPoints')}</h1>
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
              <i className="fas fa-plus mr-2"></i>{t('addPoint')}
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
                <th className="py-3 px-4 font-semibold">{t('address')}</th>
                <th className="py-3 px-4 font-semibold">{t('group')}</th>
                <th className="py-3 px-4 font-semibold">{t('contactPerson')}</th>
                <th className="py-3 px-4 font-semibold">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredPickupPoints.map(point => (
                <tr key={point.id} className="border-b border-slate-200/80 dark:border-slate-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium text-text-primary dark:text-dark-text-primary">{point.name}</td>
                  <td className="py-3 px-4 text-text-secondary dark:text-dark-text-secondary">{point.address}</td>
                  <td className="py-3 px-4 text-text-secondary dark:text-dark-text-secondary">{point.groupName}</td>
                  <td className="py-3 px-4 text-text-secondary dark:text-dark-text-secondary">{point.contactPerson} ({point.contactPhone})</td>
                  <td className="py-3 px-4 space-x-4">
                    <button className="text-blue-500 hover:text-blue-700"><i className="fas fa-edit"></i></button>
                    <button className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PickupPointsView;