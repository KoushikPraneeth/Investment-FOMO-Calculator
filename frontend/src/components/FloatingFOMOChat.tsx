import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X, SendHorizontal, Loader2 } from "lucide-react";
import type { InvestmentResult } from "../services/api";

interface ChatMessage {
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface FloatingFOMOChatProps {
  results: InvestmentResult | null;
  assetSymbol?: string;
}

export const FloatingFOMOChat: React.FC<FloatingFOMOChatProps> = ({
  results,
  assetSymbol = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoMessageTimer, setAutoMessageTimer] = useState<NodeJS.Timeout | null>(null);
  const [welcomeMessageSent, setWelcomeMessageSent] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send welcome message when component mounts
  useEffect(() => {
    if (!welcomeMessageSent && messages.length === 0) {
      generateWelcomeMessage();
    }
  }, []);
  
  // Set up auto-messaging when results change
  useEffect(() => {
    if (results && messages.length > 0) { // Only if we already have the welcome message
      // Add results-based message
      const resultsMessage: ChatMessage = {
        type: "bot",
        content: `Hey! I noticed you're ${results.profitLoss >= 0 ? "celebrating" : "sulking about"} your ${assetSymbol} investment. Need to talk about it? 😏`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, resultsMessage]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
      
      // Schedule auto messages
      scheduleAutoMessage();
    }
    
    return () => {
      if (autoMessageTimer) {
        clearTimeout(autoMessageTimer);
      }
    };
  }, [results]);
  
  // Reset unread count when chat is opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const scheduleAutoMessage = () => {
    if (autoMessageTimer) {
      clearTimeout(autoMessageTimer);
    }
    
    // Schedule a random message between 15-30 seconds
    const timer = setTimeout(() => {
      if (results) {
        sendAutoMessage();
      }
    }, Math.random() * 15000 + 15000); // 15-30 seconds
    
    setAutoMessageTimer(timer);
  };

  const sendAutoMessage = () => {
    if (!results) return;
    
    const annoying_messages = [
      `Still thinking about that ${results.profitLoss >= 0 ? "profit" : "loss"} of $${Math.abs(results.profitLoss).toLocaleString()}? I am! 🤑`,
      `Did you know if you had invested in something else, you might be ${results.profitLoss >= 0 ? "even richer" : "not so sad"} right now?`,
      `Just a friendly reminder: you ${results.profitLoss >= 0 ? "made" : "lost"} ${results.profitLossPercentage.toFixed(2)}% on your investment. Sleep well tonight! 😴`,
      `Hey, remember all those pizzas you could have bought with $${Math.abs(results.profitLoss).toLocaleString()}? I do!`,
      `Not to be annoying, but have you considered ${results.profitLoss >= 0 ? "investing more" : "cutting your losses"}? Just asking! 🙃`,
      `${results.profitLoss >= 0 ? "Congrats on your gains!" : "Sorry about your losses!"} Want to talk about your feelings? I'm here 24/7!`,
      `Pssst! ${results.profitLoss >= 0 ? "Don't get too cocky about your gains" : "Don't be too sad about your losses"}. The market is unpredictable!`,
      `Just checking in on your emotional state after ${results.profitLoss >= 0 ? "winning" : "losing"} with ${assetSymbol}. Need a virtual shoulder? 👋`,
    ];
    
    const randomMessage = annoying_messages[Math.floor(Math.random() * annoying_messages.length)];
    
    const newMessage: ChatMessage = {
      type: "bot",
      content: randomMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Increment unread count if chat is closed
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
    }
    
    scheduleAutoMessage(); // Schedule next message
  };

  const generateWelcomeMessage = async () => {
    setIsLoading(true);
    
    try {
      const prompt = `You are a witty, sarcastic investment therapist. The user has just opened an Investment FOMO Calculator website. 
      
Create a funny, attention-grabbing first message to send them. Make it related to investment FOMO (Fear Of Missing Out) and be slightly annoying but humorous. 

Keep it short (1-2 sentences) and make them curious about what they might have missed out on in the investment world. Don't ask a direct question that requires an answer.`;

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "deepseek-r1-distill-llama-70b",
          temperature: 0.8,
          max_completion_tokens: 4096,
          top_p: 0.95,
          stream: false,
          stop: null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
        }
      );

      const cleanedResponse = cleanResponse(response.data.choices[0].message.content);
      
      const welcomeMessage: ChatMessage = {
        type: "bot",
        content: cleanedResponse,
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      setWelcomeMessageSent(true);
      
      if (!isOpen) {
        setUnreadCount(1);
      }
      
      // Schedule first auto message after welcome
      const timer = setTimeout(() => {
        sendAutoMessage();
      }, Math.random() * 15000 + 15000); // 15-30 seconds
      
      setAutoMessageTimer(timer);
      
    } catch (err) {
      console.error("Groq API Error:", err);
      // Fallback to a default message if API fails
      const fallbackMessage: ChatMessage = {
        type: "bot",
        content: "*whispers* Psst! Did you know that someone just made a fortune while you're browsing this calculator? Just saying... 💰",
        timestamp: new Date(),
      };
      
      setMessages([fallbackMessage]);
      setWelcomeMessageSent(true);
      
      if (!isOpen) {
        setUnreadCount(1);
      }
      
      // Schedule auto messages even if welcome message failed
      scheduleAutoMessage();
    } finally {
      setIsLoading(false);
    }
  };
  
  const cleanResponse = (response: string) => {
    // Remove content between <think> and </think> tags
    return response.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  };

  const generateResponse = async (userMessage: string) => {
    if (!results) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `You are a witty, sarcastic investment therapist helping someone cope with investment FOMO. 
      
Context: The user invested $${results.investmentAmount} in ${assetSymbol} and ${
        results.profitLoss > 0 ? "made" : "lost"
      } $${Math.abs(
        results.profitLoss
      )} (${results.profitLossPercentage.toFixed(2)}%).

User message: ${userMessage}

Respond in a witty, slightly annoying way that pokes fun at their investment decision. Be sarcastic but not mean. Keep your response short (1-3 sentences). Occasionally remind them about what they could have bought with that money or what they missed out on. If they made money, suggest they just got lucky.`;

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "deepseek-r1-distill-llama-70b",
          temperature: 0.8,
          max_completion_tokens: 4096,
          top_p: 0.95,
          stream: false,
          stop: null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
        }
      );

      const cleanedResponse = cleanResponse(response.data.choices[0].message.content);
      
      const botMessage: ChatMessage = {
        type: "bot",
        content: cleanedResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Don't increment unread count for responses to user messages
      // as the user is already engaged with the chat
      
      scheduleAutoMessage(); // Reset auto-message timer after user interaction
      
    } catch (err) {
      setError("Your therapist is on vacation. Try again later.");
      console.error("Groq API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !results) return;

    const userMessage: ChatMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    generateResponse(inputMessage);
    setInputMessage("");
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    // Unread count will be reset by the useEffect that watches isOpen
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <div className="relative">
        <button
          onClick={toggleChat}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 ${
            isOpen ? "bg-red-500 hover:bg-red-600" : "bg-teal-accent hover:bg-teal-accent-darker"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </button>
        
        {/* Notification Badge */}
        {!isOpen && unreadCount > 0 && (
          <>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse z-10">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
            <div className="absolute -top-2 -right-2 bg-red-400 opacity-75 rounded-full w-6 h-6 animate-ping"></div>
          </>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-teal-accent dark:bg-teal-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <h3 className="font-medium">FOMO Therapy</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-3 overflow-y-auto max-h-96 space-y-3"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    msg.type === "user"
                      ? "bg-teal-accent text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-charcoal-dark dark:text-white"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-charcoal-light dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Your therapist is thinking...</span>
              </div>
            )}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tell me about your investment regrets..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-accent dark:focus:ring-teal-500 focus:border-transparent text-sm"
              disabled={isLoading || !results}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading || !results}
              className="p-2 bg-teal-accent dark:bg-teal-600 text-white rounded-md hover:bg-teal-accent-darker dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};