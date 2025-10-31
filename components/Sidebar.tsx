import React from 'react';
import type { TranslationKey } from '../lib/i18n';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  t: (key: TranslationKey) => string;
}

const NavItem: React.FC<{ icon: string; label: string; viewName: string; activeView: string; setActiveView: (view: string) => void; isSidebarOpen: boolean }> = ({ icon, label, viewName, activeView, setActiveView, isSidebarOpen }) => (
  <button
    onClick={() => setActiveView(viewName)}
    className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-colors duration-200 ${
      activeView === viewName
        ? 'bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-400 font-semibold'
        : 'text-text-secondary dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-slate-800'
    }`}
    aria-label={label}
  >
    <i className={`fas ${icon} w-6 h-6 text-center text-lg`}></i>
    <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 whitespace-nowrap'}`}>{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isSidebarOpen, toggleSidebar, t }) => {
  const navItems = [
    { icon: 'fa-truck-fast', label: t('driverManagement'), viewName: 'dashboard' },
    { icon: 'fa-id-card', label: t('drivers'), viewName: 'drivers' },
    { icon: 'fa-map-marker-alt', label: t('pickupPoints'), viewName: 'pickup-points' },
    { icon: 'fa-clipboard-list', label: t('assignments'), viewName: 'assignments' },
    { icon: 'fa-chart-pie', label: t('reports'), viewName: 'reports' },
    { icon: 'fa-map-marked-alt', label: t('mapView'), viewName: 'map' },
  ];

  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen bg-card dark:bg-dark-card border-r border-gray-200/80 dark:border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/80 dark:border-slate-800">
          <div className={`flex items-center transition-all duration-300 ${isSidebarOpen ? 'w-full' : 'w-auto'}`}>
             <i className="fas fa-truck-fast text-primary-500 text-2xl"></i>
            {isSidebarOpen && <span className="ml-3 text-xl font-bold whitespace-nowrap">{t('appName')}</span>}
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <NavItem key={item.viewName} {...item} activeView={activeView} setActiveView={setActiveView} isSidebarOpen={isSidebarOpen} />
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200/80 dark:border-slate-800">
          <NavItem icon="fa-cog" label={t('settings')} viewName="settings" activeView={activeView} setActiveView={setActiveView} isSidebarOpen={isSidebarOpen} />
        </div>
        <div className="p-4 border-t border-gray-200/80 dark:border-slate-800">
          <button
            onClick={toggleSidebar}
            className="flex items-center w-full px-4 py-3 text-sm rounded-lg text-text-secondary dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200"
            aria-label={t('collapseSidebar')}
          >
            <i className={`fas ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} w-6 h-6 text-center text-lg`}></i>
            <span className={`ml-3 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 whitespace-nowrap'}`}>{t('collapseSidebar')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;