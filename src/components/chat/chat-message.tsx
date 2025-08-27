
import type { Message } from '@/app/chat/[role]/page';
import type { Persona } from '@/lib/personas';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { UserProfile } from '@/lib/user-profile';
import { motion } from 'framer-motion';
import { Download, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import Image from 'next/image';

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

  if (message.imageUrl) {
    return (
      <div className={cn("flex items-end gap-2", isUser ? 'justify-end' : 'justify-start')}>
          {!isUser && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={persona.avatar} alt={persona.name} />
              <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div className="max-w-xs md:max-w-md lg:max-w-xl">
             <Dialog>
                <DialogTrigger asChild>
                    <Image
                        src={message.imageUrl}
                        alt="AI generated image"
                        width={300}
                        height={300}
                        className="rounded-lg cursor-pointer object-cover"
                    />
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                    <Image
                        src={message.imageUrl}
                        alt="AI generated image"
                        width={1024}
                        height={1024}
                        className="w-full h-auto rounded-lg"
                    />
                </DialogContent>
            </Dialog>
            <div className="flex items-center justify-between mt-1 px-1">
                <p className="text-sm">{message.text}</p>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <a href={message.imageUrl} download="ai-amigo-image.png">
                        <Download className="h-4 w-4" />
                    </a>
                </Button>
            </div>
          </div>
           {isUser && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name?.charAt(0) || 'Y'}</AvatarFallback>
            </Avatar>
          )}
      </div>
    )
  }

  return (
    <div className="group relative">
      <div className={cn(
        "absolute inset-y-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity", 
        isUser ? 'left-0' : 'right-0'
      )}>
        {!isUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(message.id)}
              className="h-8 w-8"
            >
              <Trash className="h-4 w-4" />
            </Button>
        )}
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: isUser ? -80 : 0, right: isUser ? 0 : 80 }}
        dragElastic={0.1}
        onDragEnd={(event, info) => {
            if (isUser && info.offset.x < -50) {
                onDelete(message.id);
            }
        }}
        className={cn(
          'flex items-end gap-2 relative bg-background z-10',
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
      <div className={cn("absolute inset-y-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity", isUser ? 'left-0' : 'right-0')}>
        {isUser && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
