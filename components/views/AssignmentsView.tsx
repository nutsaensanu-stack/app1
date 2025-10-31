import React, { useState, useMemo } from 'react';
import type { Assignment, Driver, PickupPoint } from '../../types';
import { AssignmentStatus } from '../../types';
import type { TranslationKey } from '../../lib/i18n';

interface AssignmentsViewProps {
  assignments: Assignment[];
  drivers: Driver[];
  pickupPoints: PickupPoint[];
  setAssignments: (assignments: Assignment[]) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const AssignmentsView: React.FC<AssignmentsViewProps> = ({ assignments, drivers, pickupPoints, setAssignments, t }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const getDriverName = (driverId: string) => drivers.find(d => d.id === driverId)?.name || 'N/A';
  const getPickupPointName = (pointId: string) => pickupPoints.find(p => p.id === pointId)?.name || 'N/A';
  
  const parseAssignmentsCsv = (csv: string) => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
      alert(t('csvInvalidFormat'));
      return;
    }
    const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1);

    const requiredHeaders = ['Driver ID', 'Pickup Point ID'];
    if (!requiredHeaders.every(h => header.includes(h))) {
      alert(t('csvUnknownFormat'));
      return;
    }

    try {
      const newAssignments: Assignment[] = rows.map((row, index) => {
        const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
        const assignmentData = Object.fromEntries(header.map((key, i) => [key, values[i]]));
        return {
            id: `A${Date.now()}${index}`,
            driverId: assignmentData['Driver ID'],
            pickupPointId: assignmentData['Pickup Point ID'],
            assignmentDate: new Date().toISOString().split('T')[0],
            status: AssignmentStatus.Pending,
            notes: '',
        };
      });
      setAssignments(newAssignments);
      alert(`${newAssignments.length} ${t('assignments')} ${t('importedSuccessfully')}`);
    } catch (error) {
      console.error('Failed to parse Assignments CSV:', error);
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
          parseAssignmentsCsv(csvText);
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
    const headers = ['Driver ID', 'Pickup Point ID'];
    const csvContent = headers.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'assignments_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredAssignments = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return assignments.filter(assignment =>
      getDriverName(assignment.driverId).toLowerCase().includes(lowercasedTerm) ||
      getPickupPointName(assignment.pickupPointId).toLowerCase().includes(lowercasedTerm) ||
      assignment.assignmentDate.toLowerCase().includes(lowercasedTerm) ||
      assignment.status.toLowerCase().includes(lowercasedTerm) ||
      assignment.notes.toLowerCase().includes(lowercasedTerm)
    );
  }, [assignments, searchTerm, drivers, pickupPoints]);


  return (
     <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{t('manageAssignments')}</h1>
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
              <i className="fas fa-plus mr-2"></i>{t('addAssignment')}
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
                <th className="py-3 px-4 font-semibold">{t('driver')}</th>
                <th className="py-3 px-4 font-semibold">{t('pickupPoints')}</th>
                <th className="py-3 px-4 font-semibold">{t('date')}</th>
                <th className="py-3 px-4 font-semibold">{t('status')}</th>
                <th className="py-3 px-4 font-semibold">{t('notes')}</th>
                <th className="py-3 px-4 font-semibold">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map(assignment => (
                <tr key={assignment.id} className="border-b border-slate-200/80 dark:border-slate-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium text-text-primary dark:text-dark-text-primary">{getDriverName(assignment.driverId)}</td>
                  <td className="py-3 px-4 text-text-secondary dark:text-dark-text-secondary">{getPickupPointName(assignment.pickupPointId)}</td>
                  <td className="py-3 px-4 text-text-secondary dark:text-dark-text-secondary">{assignment.assignmentDate}</td>
                   <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        assignment.status === AssignmentStatus.Completed ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        assignment.status === AssignmentStatus.InProgress ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                      }`}>
                        {assignment.status}
                      </span>
                    </td>
                  <td className="py-3 px-4 text-sm text-text-secondary dark:text-dark-text-secondary truncate max-w-xs">{assignment.notes}</td>
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

export default AssignmentsView;