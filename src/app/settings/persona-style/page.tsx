
"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { personas as defaultPersonas, Persona } from '@/lib/personas';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MessageSquareHeart } from 'lucide-react';

export default function PersonaStylePage() {
  const [personas, setPersonas] = useState<Record<string, Persona>>({});
  const [styles, setStyles] = useState<Record<string, string>>({});
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPersonas = localStorage.getItem('personas');
      setPersonas(storedPersonas ? JSON.parse(storedPersonas) : defaultPersonas);
      
      const storedStyles = localStorage.getItem('personaStyles');
      setStyles(storedStyles ? JSON.parse(storedStyles) : {});
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setPersonas(defaultPersonas);
    }
  }, []);

  const selectedPersona = selectedPersonaKey ? personas[selectedPersonaKey] : null;

  const handleStyleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (selectedPersonaKey) {
      setStyles({
        ...styles,
        [selectedPersonaKey]: e.target.value,
      });
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem('personaStyles', JSON.stringify(styles));
      toast({
        title: "Success",
        description: "Persona conversation styles have been saved.",
      });
      router.push('/settings');
    } catch (error) {
      console.error("Failed to save styles to localStorage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your settings. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <ArrowLeft />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-primary">Customize Conversation Styles</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-2xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Select a Persona</CardTitle>
              <CardDescription>Choose which AI persona's conversation style you want to edit.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.values(personas).map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPersonaKey(p.key)}
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${selectedPersonaKey === p.key ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}
                >
                  <Avatar>
                    <AvatarImage src={p.avatar} />
                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="mt-2 text-sm font-medium">{p.name}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {selectedPersona && selectedPersonaKey && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquareHeart className="h-6 w-6"/>
                    Style for {selectedPersona.name}
                </CardTitle>
                <CardDescription>
                    Describe how you want this persona to talk. e.g., "romantic, careful, and funfull".
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="persona-style">Conversation Style</Label>
                  <Input
                    id="persona-style"
                    value={styles[selectedPersonaKey] || ''}
                    onChange={handleStyleChange}
                    placeholder="e.g., romantic and caring"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2">
             <Button variant="outline" onClick={() => router.push('/settings')}>
                Cancel
            </Button>
            <Button onClick={handleSave} disabled={!selectedPersonaKey}>
                Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
