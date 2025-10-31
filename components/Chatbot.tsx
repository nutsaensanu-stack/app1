import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Driver, PickupPoint, Assignment } from '../types';
import type { TranslationKey } from '../lib/i18n';

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  drivers: Driver[];
  pickupPoints: PickupPoint[];
  assignments: Assignment[];
  t: (key: TranslationKey) => string;
  language: 'en' | 'th';
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, setIsOpen, drivers, pickupPoints, assignments, t, language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'ai', text: t('welcomeMessage') }]);
    }
  }, [isOpen, messages.length, t]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // When data context or language changes, re-initialize the chat
    const initializeChat = () => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // Create a summarized context to avoid exceeding token limits
        const summarizedContext = {
            drivers: drivers.map(({ id, name, shift, status }) => ({ id, name, shift, status })),
            pickupPoints: pickupPoints.map(({ id, groupName, name, address }) => ({ id, groupName, name, address })),
            assignments: assignments.map(({ id, driverId, pickupPointId, status }) => ({ id, driverId, pickupPointId, status })),
            summary: {
                totalDrivers: drivers.length,
                activeDrivers: drivers.filter(d => d.status === 'Active').length,
                totalPickupPoints: pickupPoints.length,
                totalAssignments: assignments.length,
                completedAssignments: assignments.filter(a => a.status === 'Completed').length,
            }
        };

        const systemInstruction = `You are an expert AI assistant for a logistics application called 'DriverApp'. 
        Your task is to answer user questions based on the following real-time data context, provided in a summarized JSON format.
        Always be helpful and concise. If a user asks for details not present in the summary (like a phone number), state that you have the summary data but not that specific detail.
        Respond in the user's language, which is currently: ${language === 'th' ? 'Thai' : 'English'}.
        Current data summary:
        ${JSON.stringify(summarizedContext)}`; // Use compact JSON

        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
        setChat(newChat);
    };

    if (isOpen) {
        initializeChat();
    }
  }, [isOpen, drivers, pickupPoints, assignments, language]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    const userMessage: Message = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const responseStream = await chat.sendMessageStream({ message: userInput });
      
      let aiResponseText = '';
      setMessages(prev => [...prev, { sender: 'ai', text: '' }]); // Add empty AI message bubble

      for await (const chunk of responseStream) {
        aiResponseText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponseText };
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: t('aiError') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Widget */}
      <div className={`fixed bottom-24 right-6 w-full max-w-sm rounded-xl shadow-2xl bg-card dark:bg-dark-card border border-slate-200/80 dark:border-slate-700 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200/80 dark:border-slate-700">
          <h3 className="font-bold text-lg flex items-center gap-2"><i className="fas fa-robot text-primary-500"></i> {t('aiAssistant')}</h3>
          <button onClick={() => setIsOpen(false)} className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div ref={chatHistoryRef} className="flex-1 p-4 space-y-4 overflow-y-auto h-96">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && <i className="fas fa-robot p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 self-start"></i>}
              <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary rounded-bl-none'}`}>
                 <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2">
               <i className="fas fa-robot p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 self-start"></i>
               <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-700 rounded-bl-none">
                  <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
               </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200/80 dark:border-slate-700">
          <div className="relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={t('typeYourMessage')}
              className="w-full bg-background dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg pl-4 pr-12 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            <button type="submit" disabled={!userInput.trim() || isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:bg-primary-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-primary-700 transition-transform transform hover:scale-110"
        aria-label="Toggle Chat"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'}`}></i>
      </button>
    </>
  );
};

export default Chatbot;