import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, MessageCircle, User, Briefcase, Code, GraduationCap, RefreshCw, AlertCircle } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { QuestionCard } from './components/QuestionCard';
import { TypingIndicator } from './components/TypingIndicator';
import { chatService } from './services/chatService';
import type { ChatMessage as ChatMessageType } from './services/chatService';

function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isResumeLoaded, setIsResumeLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    "Tell me about your professional experience",
    "What are your key technical skills and expertise?",
    "What's your educational background?",
    "Can you share details about your notable projects?",
    "What are your career achievements and accomplishments?",
    "How can someone contact you professionally?",
    "What certifications or qualifications do you have?",
    "What's your current role and responsibilities?"
  ];

  useEffect(() => {
    // Check if resume is loaded
    const checkResumeStatus = () => {
      setIsResumeLoaded(chatService.isResumeLoaded());
    };

    // Check immediately and then every 2 seconds until loaded
    checkResumeStatus();
    const interval = setInterval(() => {
      checkResumeStatus();
      if (chatService.isResumeLoaded()) {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatService.sendMessage(message);
      
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        message: response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };

  const handleReloadResume = async () => {
    setIsResumeLoaded(false);
    await chatService.reloadResume();
    setIsResumeLoaded(chatService.isResumeLoaded());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Bot size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hi, I’m Siyan’s AI Assistant</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hi! I'm an AI assistant trained on a professional resume. Ask me anything about the candidate's background, skills, experience, and qualifications. I'll provide detailed information based on their resume.
          </p>
          
          {/* Resume Status Indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {isResumeLoaded ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Resume loaded and ready
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
                <RefreshCw size={12} className="animate-spin" />
                Loading resume data...
              </div>
            )}
            <button
              onClick={handleReloadResume}
              disabled={!inputMessage.trim() || isTyping || !isResumeLoaded}
              title="Reload resume"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Professional Highlights */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="text-blue-600" size={20} />
              <h3 className="font-semibold text-gray-800">AI-Powered</h3>
            </div>
            <p className="text-sm text-gray-600">Intelligent resume analysis</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Code className="text-green-600" size={20} />
              <h3 className="font-semibold text-gray-800">Real-time</h3>
            </div>
            <p className="text-sm text-gray-600">Dynamic question answering</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="text-purple-600" size={20} />
              <h3 className="font-semibold text-gray-800">Comprehensive</h3>
            </div>
            <p className="text-sm text-gray-600">Complete professional profile</p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <User size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Welcome! Ask me anything about the candidate's professional background</p>
                {!isResumeLoaded && (
                  <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg mb-4">
                    <AlertCircle size={16} />
                    <p className="text-sm">Please ensure your resume.pdf is in the public folder</p>
                  </div>
                )}
                <p className="text-sm text-gray-400">Try asking about experience, skills, projects, education, or achievements</p>
              </div>
            )}
            
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.message}
                placeholder="Ask me anything about the candidate's professional background..."
                timestamp={message.timestamp}
                disabled={!isResumeLoaded}
              />
            ))}
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Predefined Questions */}
          {messages.length === 0 && (
            <div className="p-6 border-t border-gray-200 bg-white">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Suggested questions:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                {predefinedQuestions.map((question, index) => (
                  <QuestionCard
                    key={index}
                    question={question}
                    onClick={handleQuestionClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about Siyan's professional background..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {inputMessage && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <MessageCircle size={18} className="text-blue-500" />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                <Send size={18} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;