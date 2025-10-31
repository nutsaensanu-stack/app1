import React, { useState, useMemo } from 'react';
import type { Driver, PickupPoint, Assignment } from '../../types';
import type { TranslationKey } from '../../lib/i18n';
import { GoogleGenAI } from '@google/genai';

interface MapViewProps {
  drivers: Driver[];
  pickupPoints: PickupPoint[];
  assignments: Assignment[];
  t: (key: TranslationKey) => string;
}

const MapView: React.FC<MapViewProps> = ({ drivers, pickupPoints, assignments, t }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [sources, setSources] = useState<any[]>([]);

  const todaysAssignments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return assignments
      .filter(a => a.assignmentDate === today)
      .map(a => {
        const driver = drivers.find(d => d.id === a.driverId);
        const point = pickupPoints.find(p => p.id === a.pickupPointId);
        return { ...a, driverName: driver?.name, pointName: point?.name, pointAddress: point?.address };
      })
      .filter(a => a.driverName && a.pointName);
  }, [assignments, drivers, pickupPoints]);
  
  const handleSuggestRoute = async () => {
    setIsLoading(true);
    setError('');
    setAiResponse('');
    setSources([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        const pointsText = todaysAssignments
            .map(a => `- ${a.pointName} at ${a.pointAddress}`)
            .join('\n');

        const prompt = `${t('aiRoutePrompt')}\n${pointsText}`;

        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              tools: [{ googleMaps: {} }],
              toolConfig: {
                retrievalConfig: {
                  latLng: userLocation
                }
              }
            },
          });
          
          setAiResponse(response.text);

          const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          setSources(groundingChunks.filter(c => c.maps?.uri));

        } catch (err) {
          console.error('AI Error:', err);
          setError(t('aiError'));
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Geolocation Error:', err);
        setError(t('locationError'));
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{t('liveMapView')}</h1>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-card dark:bg-dark-card p-6 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <h2 className="text-lg font-semibold mb-2">{t('todaysRoutes')}</h2>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
                  {t('assignments')}: {todaysAssignments.length}
                </p>
                <button 
                  onClick={handleSuggestRoute} 
                  disabled={isLoading}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-primary-700 transition flex items-center text-sm font-medium disabled:bg-primary-300 disabled:cursor-not-allowed"
                >
                  <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-magic'} mr-2`}></i>
                  {isLoading ? t('generating') : t('aiSuggestRoute')}
                </button>
            </div>
            
             {error && <div className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg text-sm">{error}</div>}

            {aiResponse && (
                <div className="bg-card dark:bg-dark-card p-6 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <h2 className="text-lg font-semibold mb-2">{t('aiRouteSuggestion')}</h2>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{aiResponse}</div>

                    {sources.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold mb-2">{t('sources')}</h3>
                            <ul className="list-disc list-inside text-xs space-y-1">
                                {sources.map((source, index) => (
                                    <li key={index}>
                                        <a href={source.maps.uri} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            {source.maps.title || 'View on Google Maps'}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
        <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <h2 className="text-lg font-semibold mb-4 px-2">{t('todaysAssignments')}</h2>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {todaysAssignments.length > 0 ? (
                todaysAssignments.map(a => (
                    <div key={a.id} className="p-3 bg-background dark:bg-slate-900/70 rounded-lg">
                        <p className="font-semibold text-sm">{a.pointName}</p>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{a.pointAddress}</p>
                        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">{t('driver')}: {a.driverName}</p>
                    </div>
                ))
            ) : (
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary px-2">{t('noAssignments')}</p>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;