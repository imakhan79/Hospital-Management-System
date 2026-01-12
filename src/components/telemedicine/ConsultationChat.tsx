import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, FileText, Image, Paperclip } from "lucide-react";

interface Message {
  id: string;
  sender: 'doctor' | 'patient';
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  fileName?: string;
}

interface ConsultationChatProps {
  consultationId: string;
}

export const ConsultationChat = ({ consultationId }: ConsultationChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'doctor',
      content: 'Hello! How are you feeling today?',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      sender: 'patient',
      content: 'Hi Doctor, I\'ve been experiencing some chest pain since yesterday.',
      timestamp: new Date(Date.now() - 240000),
      type: 'text'
    },
    {
      id: '3',
      sender: 'doctor',
      content: 'I understand. Can you describe the pain? Is it sharp or dull?',
      timestamp: new Date(Date.now() - 180000),
      type: 'text'
    },
    {
      id: '4',
      sender: 'patient',
      content: 'It\'s more of a dull ache, and it gets worse when I breathe deeply.',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'doctor', // In real app, this would be determined by current user role
        content: newMessage,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-96">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                message.sender === 'doctor' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.sender === 'doctor' ? 'DR' : 'PT'}
                  </AvatarFallback>
                </Avatar>
                <Card className={`${
                  message.sender === 'doctor' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100'
                }`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'doctor' 
                        ? 'text-blue-100' 
                        : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Image className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};