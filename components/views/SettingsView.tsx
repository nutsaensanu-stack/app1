import React from 'react';
import type { TranslationKey } from '../../lib/i18n';

interface SettingsViewProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  language: 'en' | 'th';
  setLanguage: (lang: 'en' | 'th') => void;
  t: (key: TranslationKey) => string;
  onResetData: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, setIsDarkMode, language, setLanguage, t, onResetData }) => {
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{t('settings')}</h1>

      {/* Language Settings */}
      <div className="bg-card dark:bg-dark-card p-6 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-4">{t('language')}</h2>
        <div className="flex items-center space-x-4">
          <p className="text-text-secondary dark:text-dark-text-secondary">{t('selectLanguage')}:</p>
          <div className="flex rounded-lg shadow-sm border border-slate-300 dark:border-slate-600">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md transition-colors ${
                language === 'en'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-700 text-text-primary dark:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-slate-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('th')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md transition-colors border-l border-slate-300 dark:border-slate-600 ${
                language === 'th'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-700 text-text-primary dark:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-slate-600'
              }`}
            >
              ไทย
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-card dark:bg-dark-card p-6 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-4">{t('appearance')}</h2>
        <div className="flex items-center justify-between">
          <label htmlFor="dark-mode-toggle" className="font-medium text-text-primary dark:text-dark-text-primary">
            {t('darkMode')}
          </label>
          <div className="relative inline-block w-12 h-6 align-middle select-none">
            <input 
              type="checkbox" 
              name="dark-mode-toggle" 
              id="dark-mode-toggle"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-slate-400 border-2 border-gray-300 dark:border-slate-600 appearance-none cursor-pointer"
            />
            <label htmlFor="dark-mode-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-slate-600 cursor-pointer"></label>
          </div>
        </div>
      </div>
      
      {/* Data Management */}
      <div className="bg-card dark:bg-dark-card p-6 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-4">{t('dataManagement')}</h2>
        <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary dark:text-dark-text-primary">{t('resetData')}</p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{t('resetDataDesc')}</p>
            </div>
            <button 
                onClick={onResetData}
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 transition flex items-center text-sm font-medium">
                <i className="fas fa-trash-alt mr-2"></i>{t('resetBtn')}
            </button>
        </div>
      </div>

    </div>
  );
};

export default SettingsView;