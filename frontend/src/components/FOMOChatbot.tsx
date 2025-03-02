import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { SendHorizontal, Brain, Loader2 } from "lucide-react";
import type { InvestmentResult } from "../services/api";

interface ChatMessage {
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface FOMOChatbotProps {
  results: InvestmentResult;
  assetSymbol: string;
}

export const FOMOChatbot: React.FC<FOMOChatbotProps> = ({
  results,
  assetSymbol,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const cleanResponse = (response: string) => {
    // Remove content between <think> and </think> tags
    return response.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  };

  const generateResponse = async (userMessage: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `You are a witty, sarcastic investment therapist helping someone cope with investment FOMO. 
      
Context: The user invested $${results.investmentAmount} in ${assetSymbol} and ${
        results.profitLoss > 0 ? "made" : "lost"
      } $${Math.abs(
        results.profitLoss
      )} (${results.profitLossPercentage.toFixed(2)}%).

User's message: "${userMessage}"

Respond as a humorous therapist who specializes in investment-related emotional support. Be witty and sarcastic, but ultimately comforting. Keep it concise (1-2 short paragraphs). Mix in some investing jargon humorously. Make references to common investing memes and themes. Use emojis sparingly but effectively.`;

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

      const botResponse = cleanResponse(
        response.data.choices[0].message.content
      );
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: botResponse, timestamp: new Date() },
      ]);
    } catch (err) {
      setError(
        "Sorry, your therapist is having an existential crisis. Try again? 🤔"
      );
      console.error("Groq API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage("");
    setMessages((prev) => [
      ...prev,
      { type: "user", content: message, timestamp: new Date() },
    ]);
    await generateResponse(message);
  };

  return (
    <div className="mt-8 p-6 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg transition-colors duration-300">
      <div className="flex items-center mb-4">
        <Brain className="w-6 h-6 mr-2 text-teal-accent dark:text-dark-text-accent" />
        <h3 className="text-xl font-bold text-charcoal-dark dark:text-dark-text-primary">FOMO Therapy</h3>
      </div>

      {/* Chat Display Area */}
      <div
        ref={chatContainerRef}
        className="bg-warm-gray-lighter dark:bg-dark-bg-tertiary rounded-lg p-4 h-64 overflow-y-auto mb-4 space-y-4 transition-colors duration-300"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.type === "user"
                  ? "bg-teal-accent text-white dark:bg-teal-accent-darker"
                  : "bg-white dark:bg-dark-bg-primary text-charcoal dark:text-dark-text-secondary border border-warm-gray dark:border-dark-bg-tertiary"
              }`}
            >
              <div className="text-sm whitespace-pre-line">{msg.content}</div>
              <div
                className={`text-xs mt-1 ${
                  msg.type === "user"
                    ? "text-teal-accent-lighter dark:text-teal-accent"
                    : "text-charcoal-light dark:text-dark-text-secondary"
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-charcoal-light dark:text-dark-text-secondary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Your therapist is thinking...</span>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Tell me about your investment regrets..."
          className="flex-1 px-4 py-2 border border-warm-gray dark:border-dark-bg-tertiary dark:bg-dark-bg-primary dark:text-dark-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-teal-accent dark:focus:ring-dark-text-accent focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="px-4 py-2 bg-teal-accent dark:bg-teal-accent-darker text-white rounded-md hover:bg-teal-accent-darker dark:hover:bg-teal-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent dark:focus:ring-offset-dark-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
