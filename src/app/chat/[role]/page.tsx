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
      setMessages([
        {
          id: 'initial',
          sender: 'ai',
          text: currentPersona.initialMessage,
        },
      ]);
    } else {
      router.push('/');
    }
  }, [params.role, router]);

  const handleSendMessage = async (text: string) => {
    if (!persona) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
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
      // remove the user message if the AI fails
       setMessages((prev) => prev.slice(0, -1));
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
