import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/views/DashboardView';
import DriversView from './components/views/DriversView';
import PickupPointsView from './components/views/PickupPointsView';
import AssignmentsView from './components/views/AssignmentsView';
import ReportsView from './components/views/ReportsView';
import MapView from './components/views/MapView';
import SettingsView from './components/views/SettingsView';
import Chatbot from './components/Chatbot';

import usePersistentState from './hooks/usePersistentState';
import { getTranslator } from './lib/i18n';
import type { Driver, PickupPoint, Assignment } from './types';
import { mockDrivers, mockAssignments, mockPickupPoints } from './lib/mockData';

// To connect to a real backend, uncomment the line below and ensure your server is running.
// const API_BASE_URL = 'http://localhost:3001'; 
const API_BASE_URL = null; // Use null to signify simulation mode

const App: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = usePersistentState('sidebarOpen', true);
  const [activeView, setActiveView] = usePersistentState('activeView', 'dashboard');
  const [isDarkMode, setIsDarkMode] = usePersistentState('darkMode', false);
  const [language, setLanguage] = usePersistentState<'en' | 'th'>('language', 'en');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const t = getTranslator(language);

  const fetchData = useCallback(async () => {
    // If API_BASE_URL is not set, simulate the API call with mock data
    if (!API_BASE_URL) {
      console.log("Running in simulated backend mode. Data will not be persisted.");
      setTimeout(() => {
        setDrivers(mockDrivers);
        setPickupPoints(mockPickupPoints);
        setAssignments(mockAssignments);
        setIsDataLoaded(true);
      }, 500); // Simulate network delay
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/data`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDrivers(data.drivers || []);
      setPickupPoints(data.pickupPoints || []);
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error("Failed to fetch data, using mock data as fallback:", error);
      setDrivers(mockDrivers);
      setPickupPoints(mockPickupPoints);
      setAssignments(mockAssignments);
    } finally {
        setIsDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleUpdateDriver = async (updatedDriver: Driver) => {
    if (!API_BASE_URL) {
      setDrivers(drivers.map(d => d.id === updatedDriver.id ? updatedDriver : d));
      return Promise.resolve();
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/drivers/${updatedDriver.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDriver),
      });
      if (!response.ok) throw new Error('Failed to update driver');
      const savedDriver = await response.json();
      setDrivers(drivers.map(d => d.id === savedDriver.id ? savedDriver : d));
    } catch (error) {
      console.error('Error updating driver:', error);
      // Fallback for UI update if API fails
      setDrivers(drivers.map(d => d.id === updatedDriver.id ? updatedDriver : d));
    }
  };
  
  const handleDeleteDriver = async (driverId: string) => {
     if (window.confirm('Are you sure you want to delete this driver?')) {
        if (!API_BASE_URL) {
          setDrivers(drivers.filter(d => d.id !== driverId));
          return Promise.resolve();
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/drivers/${driverId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete driver');
            setDrivers(drivers.filter(d => d.id !== driverId));
        } catch (error) {
            console.error('Error deleting driver:', error);
             // Fallback for UI update if API fails
            setDrivers(drivers.filter(d => d.id !== driverId));
        }
    }
  };

  const handleSetDrivers = async (newDrivers: Driver[]) => {
    if (!API_BASE_URL) {
        setDrivers(newDrivers);
        return Promise.resolve();
    }
    try {
        const response = await fetch(`${API_BASE_URL}/api/drivers/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDrivers),
        });
        if (!response.ok) throw new Error('Failed to import drivers');
        const importedDrivers = await response.json();
        setDrivers(importedDrivers);
    } catch (error) {
        console.error('Error importing drivers:', error);
        // Fallback for UI update if API fails
        setDrivers(newDrivers);
    }
  };
  
  const handleSetPickupPoints = async (newPoints: PickupPoint[]) => {
    if (!API_BASE_URL) {
        setPickupPoints(newPoints);
        return Promise.resolve();
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/pickup-points/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPoints),
      });
      if (!response.ok) throw new Error('Failed to import pickup points');
      const importedPoints = await response.json();
      setPickupPoints(importedPoints);
    } catch (error) {
        console.error('Error importing pickup points:', error);
        setPickupPoints(newPoints);
    }
  };

  const handleSetAssignments = async (newAssignments: Assignment[]) => {
    if (!API_BASE_URL) {
        setAssignments(newAssignments);
        return Promise.resolve();
    }
    try {
        const response = await fetch(`${API_BASE_URL}/api/assignments/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAssignments),
        });
        if (!response.ok) throw new Error('Failed to import assignments');
        const importedAssignments = await response.json();
        setAssignments(importedAssignments);
    } catch (error) {
        console.error('Error importing assignments:', error);
        setAssignments(newAssignments);
    }
  };
  
  const handleResetData = () => {
    if (window.confirm(t('resetDataConfirmation'))) {
        setDrivers(mockDrivers);
        setPickupPoints(mockPickupPoints);
        setAssignments(mockAssignments);
        alert('Data has been reset to the initial mock data.');
    }
  };


  const renderView = () => {
    if (!isDataLoaded) {
        return <div className="flex items-center justify-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i></div>;
    }
    switch (activeView) {
      case 'dashboard':
        return <DashboardView drivers={drivers} pickupPoints={pickupPoints} assignments={assignments} t={t} />;
      case 'drivers':
        return <DriversView drivers={drivers} onUpdateDriver={handleUpdateDriver} onDeleteDriver={handleDeleteDriver} onSetDrivers={handleSetDrivers} t={t} />;
      case 'pickup-points':
        return <PickupPointsView pickupPoints={pickupPoints} setPickupPoints={handleSetPickupPoints} t={t} />;
      case 'assignments':
        return <AssignmentsView assignments={assignments} drivers={drivers} pickupPoints={pickupPoints} setAssignments={handleSetAssignments} t={t} />;
      case 'reports':
        return <ReportsView drivers={drivers} assignments={assignments} t={t} />;
      case 'map':
        return <MapView drivers={drivers} pickupPoints={pickupPoints} assignments={assignments} t={t} />;
      case 'settings':
        return <SettingsView isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} language={language} setLanguage={setLanguage} onResetData={handleResetData} t={t} />;
      default:
        return <DashboardView drivers={drivers} pickupPoints={pickupPoints} assignments={assignments} t={t} />;
    }
  };

  return (
    <div className={`flex h-screen bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary font-sans antialiased`}>
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        t={t}
      />
      <main className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {renderView()}
      </main>
      <Chatbot 
        isOpen={isChatbotOpen} 
        setIsOpen={setIsChatbotOpen} 
        drivers={drivers}
        pickupPoints={pickupPoints}
        assignments={assignments}
        t={t}
        language={language}
      />
    </div>
  );
};

export default App;