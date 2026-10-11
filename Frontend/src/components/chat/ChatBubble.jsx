import React from 'react';
import { User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const ChatBubble = ({ message, isUser, timestamp }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
              <User className="h-4 w-4 text-white" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
              <Bot className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        
        <div className={`flex flex-col ${isUser ? 'mr-3 items-end' : 'ml-3 items-start'}`}>
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                : 'bg-white/10 backdrop-blur-md border border-white/10 text-slate-100 rounded-tl-none shadow-lg'
            }`}
          >
            {isUser ? (
              <p className="text-sm whitespace-pre-wrap">{message}</p>
            ) : (
              <div className="text-sm prose prose-invert max-w-none prose-p:my-1 prose-pre:bg-slate-800/50 prose-pre:border prose-pre:border-white/10 prose-a:text-blue-400">
                <ReactMarkdown>{message}</ReactMarkdown>
              </div>
            )}
          </div>
          <span className="text-xs text-slate-400 mt-1 mx-1 block">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
