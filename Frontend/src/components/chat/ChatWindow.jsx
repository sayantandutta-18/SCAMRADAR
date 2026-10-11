import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Send, Trash2, AlertCircle, Bot } from 'lucide-react';
import ChatBubble from './ChatBubble';
import { sendChatMessage } from '../../api/chat.api';
import { SUGGESTED_CHAT_QUESTIONS } from '../../constants/scamTypes';

const ChatWindow = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  const handleSend = async (text) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    if (!text) {
      setInputValue('');
    }

    const newUserMessage = {
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messageText);
      
      const botMessage = {
        text: response?.data?.reply || response?.reply || "I couldn't process that response.",
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        text: "Sorry, I'm having trouble connecting to the server right now. Please try again later.",
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          height: isMinimized ? 'auto' : '32rem' 
        }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-20 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-96 bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="font-semibold text-slate-100">ScamRadar AI</h3>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            {messages.length > 0 && !isMinimized && (
              <button 
                onClick={clearChat}
                className="p-1 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                title="Clear chat"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <Minus size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-1 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                    <span className="text-3xl">🛡️</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-200 mb-2">How can I help you stay safe?</h4>
                    <p className="text-sm text-slate-400 px-4">
                      I can help identify scams, explain risks, or guide you through reporting fraud.
                    </p>
                  </div>
                  
                  <div className="w-full flex flex-col gap-2 mt-4 px-2">
                    {SUGGESTED_CHAT_QUESTIONS && SUGGESTED_CHAT_QUESTIONS.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(question)}
                        className="text-left text-sm py-2 px-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    msg.isError ? (
                      <div key={idx} className="flex justify-center my-2">
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-1 px-3 rounded-full flex items-center space-x-1">
                          <AlertCircle size={12} />
                          <span>{msg.text}</span>
                        </div>
                      </div>
                    ) : (
                      <ChatBubble
                        key={idx}
                        message={msg.text}
                        isUser={msg.isUser}
                        timestamp={msg.timestamp}
                      />
                    )
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start mb-4"
                    >
                      <div className="flex max-w-[80%] flex-row">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex flex-col ml-3 items-start">
                          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 rounded-tl-none">
                            <div className="flex space-x-1 items-center h-5">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10 bg-slate-800/30">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 p-2 rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatWindow;
