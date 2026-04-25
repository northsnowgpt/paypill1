'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Send, Lock, Paperclip, Search,
  ChevronLeft, Shield, CheckCheck, Clock
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { mockMessages } from '@/data/mockData';

export default function Messaging() {
  const { messages, addMessage } = useAppStore();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const allMessages = messages.length > 0 ? messages : mockMessages;

  // Group by sender
  const chats = allMessages.reduce((acc, msg) => {
    const key = msg.senderId === 'u1' ? msg.recipientId : msg.senderId;
    if (!acc[key]) {
      acc[key] = {
        id: key,
        name: msg.senderId === 'u1' ? 'You' : msg.senderName,
        role: msg.senderId === 'u1' ? 'Patient' : msg.senderRole,
        messages: [],
        lastMessage: msg,
        unread: 0,
      };
    }
    acc[key].messages.push(msg);
    if (!msg.read && msg.senderId !== 'u1') acc[key].unread++;
    return acc;
  }, {} as Record<string, any>);

  const chatList = Object.values(chats);
  const activeChat = selectedChat ? chats[selectedChat] : null;

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    const msg = {
      id: 'msg-' + Date.now(),
      senderId: 'u1',
      senderName: 'John Doe',
      senderRole: 'Patient',
      recipientId: selectedChat,
      content: newMessage,
      encrypted: true,
      timestamp: new Date().toISOString(),
      read: false,
    };
    addMessage(msg);
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-primary-600" />
          Secure Messaging
        </h1>
        <p className="text-slate-500 mt-1">HIPAA-compliant communication with your care team</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)]">
        {/* Chat List */}
        <div className="w-80 rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                className="input-medical pl-9 text-sm"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {chatList.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  selectedChat === chat.id 
                    ? 'bg-primary-50 border border-primary-200' 
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-teal-700">{chat.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-800 text-sm truncate">{chat.name}</p>
                      {chat.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{chat.lastMessage.content.slice(0, 40)}...</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <span className="text-sm font-bold text-teal-700">{activeChat.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{activeChat.name}</p>
                    <p className="text-xs text-slate-500">{activeChat.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-600">
                  <Lock className="w-3.5 h-3.5" />
                  <span>End-to-end encrypted</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {activeChat.messages.map((msg: any, i: number) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.senderId === 'u1' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.senderId === 'u1' 
                        ? 'bg-primary-600 text-white rounded-br-md' 
                        : 'bg-slate-100 text-slate-800 rounded-bl-md'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <div className={`flex items-center gap-1 mt-1 text-xs ${
                        msg.senderId === 'u1' ? 'text-primary-200' : 'text-slate-400'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        {msg.senderId === 'u1' && (
                          <CheckCheck className="w-3 h-3 ml-1" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input 
                    type="text" 
                    className="input-medical flex-1"
                    placeholder="Type a secure message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
