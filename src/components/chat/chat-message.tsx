
import { Message } from '@/app/chat/[role]/page';
import { Persona } from '@/lib/personas';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { UserProfile } from '@/lib/user-profile';
import { motion } from 'framer-motion';
import { Trash } from 'lucide-react';
import { Button } from '../ui/button';

interface ChatMessageProps {
  message: Message;
  persona: Persona;
  userProfile: UserProfile;
  onDelete: (id: string) => void;
}

export function ChatMessage({ message, persona, userProfile, onDelete }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  
  if (message.id === 'initial') {
     return (
        <div className="flex items-end gap-2 justify-start">
            <Avatar className="h-8 w-8">
              <AvatarImage src={persona.avatar} alt={persona.name} />
              <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="max-w-xs md:max-w-md lg:max-w-xl px-4 py-3 rounded-2xl bg-muted rounded-bl-none">
              <p className="text-sm">{message.text}</p>
            </div>
        </div>
     )
  }

  return (
    <div className="relative">
       <div className={cn("absolute inset-y-0 flex items-center", isUser ? 'right-0' : 'left-0')}>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(message.id)}
          className="h-8 w-8"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: isUser ? -80 : 0, right: isUser ? 0 : 80 }}
        dragElastic={0.1}
        className={cn(
          'flex items-end gap-2 relative bg-background',
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
        {isUser && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback>{userProfile.name?.charAt(0) || 'Y'}</AvatarFallback>
          </Avatar>
        )}
      </motion.div>
    </div>
  );
}
