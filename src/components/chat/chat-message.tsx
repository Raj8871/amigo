import { Message } from '@/app/chat/[role]/page';
import { Persona } from '@/lib/personas';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ChatMessageProps {
  message: Message;
  persona: Persona;
}

export function ChatMessage({ message, persona }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  return (
    <div
      className={cn(
        'flex items-end gap-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={persona.avatar} alt={persona.name} />
          <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xs md:max-w-md lg:max-w-xl px-4 py-3 rounded-2xl',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted rounded-bl-none'
        )}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
}
