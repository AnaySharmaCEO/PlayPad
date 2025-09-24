import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, MessageSquare, Bot, User, Download, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
// Simple markdown renderer for compatibility
const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const parseMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-lg font-medium mb-2">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-base font-medium mb-2">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-sm font-medium mb-1">{line.substring(4)}</h3>;
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return (
            <ul key={index} className="list-disc list-inside mb-2">
              <li className="mb-1">{line.substring(2)}</li>
            </ul>
          );
        }
        if (/^\d+\. /.test(line)) {
          return (
            <ol key={index} className="list-decimal list-inside mb-2">
              <li className="mb-1">{line.replace(/^\d+\. /, '')}</li>
            </ol>
          );
        }
        
        // Blockquotes
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-primary pl-3 italic text-muted-foreground mb-2">
              {line.substring(2)}
            </blockquote>
          );
        }
        
        // Code blocks
        if (line.startsWith('```')) {
          return (
            <pre key={index} className="bg-background/50 p-3 rounded-lg overflow-x-auto text-xs mb-2">
              <code>{line.replace(/```\w*/, '')}</code>
            </pre>
          );
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Regular paragraphs with inline formatting
        let processedLine = line;
        
        // Bold text
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic text
        processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Inline code
        processedLine = processedLine.replace(/`(.*?)`/g, '<code class="bg-background/50 px-1 py-0.5 rounded text-xs">$1</code>');
        
        return (
          <p 
            key={index} 
            className="mb-2 last:mb-0" 
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      });
  };
  
  return <div>{parseMarkdown(text)}</div>;
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface TextInterfaceProps {}

export const TextInterface: React.FC<TextInterfaceProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
    

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Make API call to backend chatbot
    fetch('http://localhost:5000/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: userMessage.text }),
    })
      .then((response) => response.json())
      .then((data) => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      })
      .catch((error) => {
        console.error('Error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(msg => `[${formatTime(msg.timestamp)}] ${msg.sender === 'user' ? 'You' : 'AI'}: ${msg.text}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-shrink-0 pb-4 border-b border-border/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-foreground" />
            <div>
              <h2 className="text-2xl font-semibold">AI Chat Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Chat with AI using rich text and markdown formatting
              </p>
            </div>
          </div>
          
          {/* Chat Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportConversation}
              disabled={messages.length === 0}
              className="rounded-xl"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearConversation}
              disabled={messages.length === 0}
              className="rounded-xl"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Messages Area - Main Chat Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col min-h-0"
      >
        {/* Scrollable Messages Container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <MessageSquare className="h-16 w-16 mx-auto mb-6 opacity-50" />
                  <h3 className="text-xl mb-4">Welcome to AI Chat</h3>
                  <div className="max-w-md mx-auto space-y-2 text-sm">
                    <p>Start a conversation with your AI assistant</p>
                    <p className="text-xs">💡 Try asking about <strong>scheduling</strong>, <strong>chess</strong>, or <strong>markdown formatting</strong></p>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-3 max-w-2xl ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </motion.div>

                {/* Message Bubble */}
                <div className="flex flex-col space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border border-border/50'
                    }`}
                  >
                    {message.sender === 'ai' ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <MarkdownRenderer text={message.text} />
                      </div>
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )}
                  </div>
                  <span
                    className={`text-xs text-muted-foreground px-3 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-xs">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-muted border border-border/50 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-current rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-current rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-current rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Input Area at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-shrink-0 pt-4 border-t border-border/50 bg-background"
        >
          <div className="flex space-x-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Markdown supported)"
              className="flex-1 rounded-xl border-border/50 focus:border-primary transition-colors"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>💡 Supports **bold**, *italic*, `code`, and more</span>
            <span>{inputValue.length}/2000</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};