import React, { useState, useEffect } from 'react';
import type { Driver } from '../../types';
import { DriverStatus } from '../../types';
import type { TranslationKey } from '../../lib/i18n';

interface EditDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: Driver) => void;
  driver: Driver;
  t: (key: TranslationKey) => string;
}

const EditDriverModal: React.FC<EditDriverModalProps> = ({ isOpen, onClose, onSave, driver, t }) => {
  const [formData, setFormData] = useState<Driver>(driver);

  useEffect(() => {
    setFormData(driver);
  }, [driver]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-card dark:bg-dark-card rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200/80 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{t('editDriver')}</h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">{t('name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">{t('phone')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="shift" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">{t('shift')}</label>
              <select
                id="shift"
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
            </div>
            <div>
              <label htmlFor="licenseType" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">{t('license')}</label>
              <input
                type="text"
                id="licenseType"
                name="licenseType"
                value={formData.licenseType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">{t('status')}</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={DriverStatus.Active}>{DriverStatus.Active}</option>
                <option value={DriverStatus.Inactive}>{DriverStatus.Inactive}</option>
              </select>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-slate-900/50 flex justify-end gap-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-secondary dark:text-dark-text-secondary bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600">
              {t('cancel')}
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
              {t('saveChanges')}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EditDriverModal;