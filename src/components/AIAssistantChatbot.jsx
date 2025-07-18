import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
import { MessageCircle, Send, X, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AILogo from '../images/ailogo.png';
import AILogoBotAvatar from '../images/ai_logo_bot.png';
import { LanguageContext } from '../App';
import { sendMessageToAI } from '../utils/aiService';

const AIAssistantChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const context = useContext(LanguageContext);

  // Use language context or default to German
  const language = context?.language || 'de';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Language-aware translations - memoized to prevent unnecessary re-renders
  const translations = useMemo(() => ({
    en: {
      greeting: "Hello! I'm Rapi, your AI assistant from RapidWorks. How can I help you with your startup?",
      aiAssistant: "AI Assistant",
      placeholder: "Type your message...",
      quickResponses: [
        "How can you help me build my startup?",
        "I need help with a startup problem",
        "How can I get in touch with you?"
      ],
      quickResponsesLabel: "Quick responses:",
      fallbackResponse: "Thank you for your message! I'll be happy to connect you with the right team. Simply book a free consultation appointment through our website."
    },
    de: {
      greeting: "Hallo! Ich bin Rapi, dein AI-Assistent von RapidWorks. Wie kann ich dir bei deinem Startup helfen?",
      aiAssistant: "KI-Assistant",
      placeholder: "Ihre Nachricht eingeben...",
      quickResponses: [
        "Wie könnt ihr mich beim Aufbau meines Startups unterstützen?",
        "Ich brauche Unterstützung bei einem Startup-Problem",
        "Wie kann ich mit euch in Kontakt kommen?"
      ],
      quickResponsesLabel: "Schnelle Antworten:",
      fallbackResponse: "Vielen Dank für deine Nachricht! Für eine persönliche Beratung empfehle ich dir, einen Termin mit unserem Team zu vereinbaren."
    }
  }), []);

  const t = useMemo(() => translations[language], [translations, language]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial greeting when chatbot opens
      setMessages([
        {
          id: 1,
          text: t.greeting,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, t.greeting]);

  // Update greeting when language changes
  useEffect(() => {
    if (isOpen && messages.length > 0 && messages[0].sender === 'bot') {
      setMessages(prev => [
        {
          ...prev[0],
          text: t.greeting
        },
        ...prev.slice(1)
      ]);
    }
  }, [t.greeting, isOpen, messages.length]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(async (messageText) => {
    if (!messageText || !messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Scroll to bottom after user message
    setTimeout(() => scrollToBottom(), 100);

    // Add loading message
    const loadingMessage = {
      id: Date.now() + 1,
      text: "...",
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Get AI response with language context
      const aiResponse = await sendMessageToAI(messageText, language);
      
      // Replace loading message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, text: aiResponse, isLoading: false }
            : msg
        )
      );
      
      // Scroll to bottom after bot response
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Replace loading message with error message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { 
                ...msg, 
                text: t.fallbackResponse, 
                isLoading: false 
              }
            : msg
        )
      );
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [t, language]);

  const handleQuickResponse = useCallback((response) => {
    handleSendMessage(response);
  }, [handleSendMessage]);

  const FABButton = () => (
    <div className="fixed bottom-6 right-6 z-50 max-md:bottom-4 max-md:right-3">
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 max-md:w-14 max-md:h-14 rounded-full hover:scale-105 transition-all duration-300 overflow-hidden p-0 border-0 bg-transparent"
          aria-label="AI Assistant öffnen"
          style={{ background: 'none', boxShadow: 'none' }}
        >
          <img 
            src={AILogo} 
            alt="AI Assistant" 
            className="w-full h-full object-cover rounded-full border-0"
            style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
          />
        </button>
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#47156D] text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap max-md:-top-5 max-md:text-xs max-md:px-3 max-md:py-1 max-md:right-0 max-md:left-auto max-md:transform-none max-md:-translate-x-0">
          {t.aiAssistant}
        </div>
      </div>
    </div>
  );

  const ChatWindow = () => (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`fixed z-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        isMaximized 
          ? 'top-20 left-20 right-20 bottom-20 w-auto h-auto max-w-4xl max-h-3xl mx-auto max-md:top-4 max-md:left-3 max-md:right-3 max-md:bottom-4 max-md:max-w-none max-md:max-h-none' 
          : 'bottom-6 right-6 w-[420px] h-[600px] md:w-[420px] md:h-[600px] max-md:bottom-4 max-md:right-3 max-md:left-3 max-md:w-auto max-md:h-[80vh] max-md:max-h-[600px]'
      }`} style={{ background: 'linear-gradient(135deg, #540E92 0%, #540E92 100%)' }}>
      {/* Header */}
      <div className="p-6 max-md:p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 max-md:space-x-3">
            <div className="w-16 h-16 max-md:w-12 max-md:h-12 rounded-full overflow-hidden">
              <img 
                src={AILogoBotAvatar} 
                alt="Rapi AI Assistant" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg max-md:text-base">Rapi</h3>
              <p className="text-sm max-md:text-xs text-white/80">{t.aiAssistant}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 max-md:space-x-1">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 max-md:p-1.5 hover:bg-white/20 rounded-full transition-colors"
            >
              <Maximize2 className="w-5 h-5 max-md:w-4 max-md:h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 max-md:p-1.5 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 max-md:w-4 max-md:h-4" />
            </button>
          </div>
        </div>
        
        {/* Initial greeting in header */}
        {messages.length > 0 && (
          <div className="text-white">
            <p className="text-sm font-medium leading-relaxed">
              {messages[0].text}
            </p>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 max-md:p-4 space-y-4 bg-white">
            {/* Quick Response Buttons */}
            {messages.length === 1 && (
              <div className="space-y-3">
                {t.quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickResponse(response)}
                    className="w-full p-4 text-left text-sm text-gray-700 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-purple-200 hover:border-purple-300"
                  >
                    {response}
                  </button>
                ))}
              </div>
            )}
            
            {/* User messages (skip the initial greeting) */}
            {messages.slice(1).map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`${isMaximized ? 'max-w-lg max-md:max-w-sm' : 'max-w-xs max-md:max-w-[280px]'} px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  ) : message.sender === 'bot' ? (
                    <div className="text-sm prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="mb-2 last:mb-0 pl-4">{children}</ul>,
                          li: ({ children }) => <li className="mb-1 list-disc">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 max-md:p-4 bg-white border-t border-gray-200">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const message = formData.get('message').trim();
              if (message) {
                handleSendMessage(message);
                e.target.reset();
              }
            }}>
              <div className="flex space-x-3 max-md:space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  name="message"
                  placeholder={t.placeholder}
                  className="flex-1 px-4 py-3 max-md:px-3 max-md:py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-gray-50"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="w-12 h-12 max-md:w-10 max-md:h-10 text-white rounded-2xl flex items-center justify-center hover:opacity-90 transition-all shadow-lg"
                  style={{ backgroundColor: '#540E92' }}
                >
                  <Send className="w-5 h-5 max-md:w-4 max-md:h-4" style={{ transform: 'rotate(0deg)' }} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );

  return (
    <>
      {!isOpen && <FABButton />}
      {isOpen && <ChatWindow />}
    </>
  );
};

export default AIAssistantChatbot; 