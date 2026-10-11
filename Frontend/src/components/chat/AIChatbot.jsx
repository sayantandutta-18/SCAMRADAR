import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import ChatWindow from './ChatWindow';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="relative h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg hover:shadow-blue-500/25 transition-all group"
          >
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
            <MessageSquare size={24} className="relative z-10 group-hover:animate-pulse" />
            
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-slate-900">
              AI
            </div>
          </motion.button>
        )}
      </div>

      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AIChatbot;
