import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  HelpCircle
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedResponses = {
    greeting: [
      "Hello! I'm G1Cure's AI assistant. How can I help you today?",
      "Hi there! Welcome to G1Cure. What would you like to know about our healthcare platform?",
      "Greetings! I'm here to help you with any questions about G1Cure. What can I assist you with?"
    ],
    features: [
      "G1Cure offers comprehensive healthcare management including patient records, appointment scheduling, telemedicine, billing, and analytics. Which feature interests you most?",
      "Our platform includes patient management, video consultations, smart billing, appointment scheduling, and detailed analytics. Would you like to know more about any specific feature?"
    ],
    pricing: [
      "We offer a 7-day free trial to get you started! After that, our pricing is flexible based on your clinic size and needs. Would you like to schedule a demo to discuss pricing?",
      "You can try G1Cure free for 7 days. Our pricing plans are designed for clinics of all sizes. Shall I connect you with our sales team for detailed pricing?"
    ],
    demo: [
      "I'd be happy to help you book a demo! You can schedule one through our contact page, or I can connect you with our team right away. What works better for you?",
      "Great choice! A demo is the best way to see G1Cure in action. You can book one on our contact page or I can arrange for someone to reach out to you."
    ],
    support: [
      "For technical support, you can reach us at support@g1cure.com or call +91 98765 43210. Our support team is available Monday to Friday, 9 AM to 6 PM IST.",
      "Our support team is here to help! Contact us at support@g1cure.com or through our contact page. We typically respond within 24 hours."
    ],
    default: [
      "I'm not sure about that specific question, but I'd be happy to connect you with our team who can provide detailed information. Would you like me to do that?",
      "That's a great question! For detailed information, I recommend reaching out to our team through the contact page or scheduling a demo. Can I help you with anything else about G1Cure?",
      "I don't have specific information about that, but our team would love to help! You can contact us through our contact page or book a demo to get all your questions answered."
    ]
  };

  const quickActions = [
    { text: "Book a Demo", action: "demo" },
    { text: "View Features", action: "features" },
    { text: "Pricing Info", action: "pricing" },
    { text: "Get Support", action: "support" }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: predefinedResponses.greeting[0],
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return predefinedResponses.greeting[Math.floor(Math.random() * predefinedResponses.greeting.length)];
    }
    
    if (message.includes('feature') || message.includes('what') || message.includes('do')) {
      return predefinedResponses.features[Math.floor(Math.random() * predefinedResponses.features.length)];
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('plan')) {
      return predefinedResponses.pricing[Math.floor(Math.random() * predefinedResponses.pricing.length)];
    }
    
    if (message.includes('demo') || message.includes('show') || message.includes('see')) {
      return predefinedResponses.demo[Math.floor(Math.random() * predefinedResponses.demo.length)];
    }
    
    if (message.includes('support') || message.includes('help') || message.includes('contact')) {
      return predefinedResponses.support[Math.floor(Math.random() * predefinedResponses.support.length)];
    }
    
    return predefinedResponses.default[Math.floor(Math.random() * predefinedResponses.default.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action: string) => {
    const responses = predefinedResponses[action as keyof typeof predefinedResponses] || predefinedResponses.default;
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const botMessage: Message = {
      id: Date.now().toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className={`w-80 ${isMinimized ? 'h-16' : 'h-96'} shadow-2xl border-0 bg-white dark:bg-gray-900 transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Bot className="w-4 h-4" />
            </motion.div>
            <div>
              <CardTitle className="text-sm font-medium">G1Cure Assistant</CardTitle>
              <p className="text-xs opacity-90">Online now</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-6 h-6 p-0 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-6 h-6 p-0 text-white hover:bg-white/20"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col h-80"
            >
              <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            message.sender === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}>
                            {message.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                          </div>
                          <div className={`px-3 py-2 rounded-lg text-sm ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}>
                            {message.text}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Bot className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <div className="flex gap-1">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions */}
                  {messages.length <= 1 && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick actions:</p>
                      <div className="grid grid-cols-2 gap-1">
                        {quickActions.map((action) => (
                          <Button
                            key={action.text}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action.action)}
                            className="text-xs h-8"
                          >
                            {action.text}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 text-sm"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        size="sm"
                        className="px-3"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export function ChatBotTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Show chatbot after 2 minutes on first visit
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
        
        // Auto-close after 10 seconds if no interaction
        const closeTimer = setTimeout(() => {
          setIsOpen(false);
        }, 10000);
        setAutoCloseTimer(closeTimer);
      }
    }, 120000); // 2 minutes

    return () => clearTimeout(timer);
  }, [hasShown]);

  const handleOpen = () => {
    setIsOpen(true);
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <motion.button
              onClick={handleOpen}
              className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  '0 4px 20px rgba(59, 130, 246, 0.3)',
                  '0 4px 30px rgba(147, 51, 234, 0.4)',
                  '0 4px 20px rgba(59, 130, 246, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && <ChatBot isOpen={isOpen} onClose={handleClose} />}
      </AnimatePresence>
    </>
  );
}
