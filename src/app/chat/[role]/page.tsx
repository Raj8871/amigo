
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { personaChat } from '@/ai/flows/persona-chat';
import { personas, Persona } from '@/lib/personas';
import { useToast } from '@/hooks/use-toast';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [persona, setPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const role = params.role as string;
    const currentPersona = personas[role];

    if (currentPersona) {
      setPersona(currentPersona);
      try {
        const storedMessages = localStorage.getItem(`chat_${role}`);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        } else {
          const initialMessage = {
            id: 'initial',
            sender: 'ai' as const,
            text: currentPersona.initialMessage,
          };
          setMessages([initialMessage]);
        }
      } catch (error) {
        console.error("Failed to parse messages from localStorage", error);
        const initialMessage = {
          id: 'initial',
          sender: 'ai' as const,
          text: currentPersona.initialMessage,
        };
        setMessages([initialMessage]);
      }
    } else {
      router.push('/');
    }
  }, [params.role, router]);

  useEffect(() => {
    if (persona && messages.length > 0) {
      try {
        localStorage.setItem(`chat_${persona.key}`, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save messages to localStorage", error);
      }
    }
  }, [messages, persona]);


  const handleSendMessage = async (text: string) => {
    if (!persona) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const chatHistory = messages
        .slice(-10)
        .map((m) => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`)
        .join('\n');

      const response = await personaChat({
        role: persona.promptRole,
        message: text,
        chatHistory,
      });

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: response.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
      });
      // revert to previous messages if AI fails
       setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  if (!persona) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader persona={persona} isLoading={isLoading} />
      <ChatMessages messages={messages} persona={persona} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
