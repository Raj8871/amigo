
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { personaChat, PersonaChatInput, PersonaChatOutput } from '@/ai/flows/persona-chat';
import { personas as defaultPersonas, Persona } from '@/lib/personas';
import { useToast } from '@/hooks/use-toast';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import type { UserProfile } from '@/lib/user-profile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  imageUrl?: string | null;
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [role, setRole] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<PersonaChatInput['language']>('English');
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'You', avatar: '' });
  const [conversationStyle, setConversationStyle] = useState<string>('');
  const [lastImageDataUri, setLastImageDataUri] = useState<string | null>(null);

  const [tapCount, setTapCount] = useState(0);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  useEffect(() => {
    const roleFromParams = Array.isArray(params.role) ? params.role[0] : params.role;
    if (roleFromParams) {
      setRole(roleFromParams);
    }
  }, [params]);


  useEffect(() => {
    if (!role) {
      // router.push('/'); // Disabled to prevent redirect on initial render
      return;
    }

    try {
      const storedLanguage = localStorage.getItem('aiLanguage') as PersonaChatInput['language'];
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }
      const storedStyles = localStorage.getItem('personaStyles');
      if (storedStyles) {
        const styles = JSON.parse(storedStyles);
        if (styles[role]) {
            setConversationStyle(styles[role]);
        }
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
    
    try {
        const storedPersonas = localStorage.getItem('personas');
        const personas = storedPersonas ? JSON.parse(storedPersonas) : defaultPersonas;
        const currentPersona = personas[role];

        if (currentPersona) {
            setPersona(currentPersona);
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
        } else {
            router.push('/');
        }
    } catch (error) {
        console.error("Failed to process personas or messages", error);
        router.push('/');
    }
  }, [role, router]);

  useEffect(() => {
    if (persona && messages.length > 0) {
      try {
        localStorage.setItem(`chat_${persona.key}`, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save messages to localStorage", error);
      }
    }
  }, [messages, persona]);

  useEffect(() => {
    if (tapCount === 5) {
      setShowDeleteAllDialog(true);
      setTapCount(0);
    }

    if (tapCount > 0) {
      const timer = setTimeout(() => setTapCount(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [tapCount]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) => prevMessages.filter((m) => m.id !== messageId));
  };

  const handleDeleteAllMessages = () => {
    if (!persona) return;
    const initialMessage = {
        id: 'initial',
        sender: 'ai' as const,
        text: persona.initialMessage,
    };
    setMessages([initialMessage]);
    try {
        localStorage.removeItem(`chat_${persona.key}`);
    } catch (error) {
        console.error("Failed to remove messages from localStorage", error);
    }
    setShowDeleteAllDialog(false);
    toast({
        title: "Chat Cleared",
        description: `All messages with ${persona.name} have been deleted.`,
    });
  };

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

      const response: PersonaChatOutput = await personaChat({
        role: persona.promptRole,
        message: text,
        chatHistory,
        language: language,
        conversationStyle: conversationStyle,
        lastImageDataUri: lastImageDataUri
      });

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: response.response,
        imageUrl: response.imageUrl
      };

      if (response.imageUrl) {
        setLastImageDataUri(response.imageUrl);
      }

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
    <>
      <div className="flex flex-col h-screen bg-background overflow-hidden" onClick={() => setTapCount(c => c + 1)}>
        <ChatHeader persona={persona} isLoading={isLoading} />
        <ChatMessages messages={messages} persona={persona} userProfile={userProfile} isLoading={isLoading} onDeleteMessage={handleDeleteMessage} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Messages?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the entire conversation with {persona.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTapCount(0)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAllMessages}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
