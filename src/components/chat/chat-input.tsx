import { useState, useRef, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, Paperclip, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="p-2 md:p-4 border-t bg-background">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" type="button" className="flex-shrink-0">
          <Smile />
        </Button>
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 resize-none"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
          autoFocus
        />
        <Button variant="ghost" size="icon" type="button" className="flex-shrink-0">
          <Paperclip />
        </Button>
        <Button size="icon" type="submit" disabled={isLoading || !text.trim()} className="flex-shrink-0">
          {text.trim() ? <Send /> : <Mic />}
        </Button>
      </form>
    </div>
  );
}
