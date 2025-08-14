import { useEffect, useRef } from 'react';
import { Message } from '@/app/chat/[role]/page';
import { Persona } from '@/lib/personas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ChatMessagesProps {
  messages: Message[];
  persona: Persona;
  isLoading: boolean;
}

export function ChatMessages({ messages, persona, isLoading }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1" viewportRef={scrollAreaRef}>
      <div className="p-4 md:p-6 space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} persona={persona} />
        ))}
        {isLoading && (
          <div className="flex items-end space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={persona.avatar} alt={persona.name} />
              <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
