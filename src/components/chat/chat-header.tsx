import { ArrowLeft, Settings } from 'lucide-react';
import { Persona } from '@/lib/personas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ThemeToggle } from '../theme-toggle';

interface ChatHeaderProps {
  persona: Persona;
  isLoading: boolean;
}

export function ChatHeader({ persona, isLoading }: ChatHeaderProps) {
  return (
    <header className="flex items-center p-2 md:p-4 border-b">
      <Button variant="ghost" size="icon" className="md:hidden mr-2" asChild>
        <Link href="/">
          <ArrowLeft />
        </Link>
      </Button>
      <Avatar className="h-10 w-10">
        <AvatarImage src={persona.avatar} alt={persona.name} data-ai-hint="persona avatar" />
        <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <h2 className="font-semibold text-lg">{persona.name}</h2>
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Typing...' : 'Online'}
        </p>
      </div>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
