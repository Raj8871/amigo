
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
import { ArrowLeft, Upload } from 'lucide-react';

export default function PersonaSettingsPage() {
  const [personas, setPersonas] = useState<Record<string, Persona>>({});
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPersonas = localStorage.getItem('personas');
      if (storedPersonas) {
        setPersonas(JSON.parse(storedPersonas));
      } else {
        setPersonas(defaultPersonas);
      }
    } catch (error) {
      console.error("Failed to load personas from localStorage", error);
      setPersonas(defaultPersonas);
    }
  }, []);

  const selectedPersona = selectedPersonaKey ? personas[selectedPersonaKey] : null;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (selectedPersona) {
      const newPersonas = {
        ...personas,
        [selectedPersona.key]: {
          ...selectedPersona,
          name: e.target.value,
        },
      };
      setPersonas(newPersonas);
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedPersona) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPersonas = {
          ...personas,
          [selectedPersona.key]: {
            ...selectedPersona,
            avatar: reader.result as string,
          },
        };
        setPersonas(newPersonas);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem('personas', JSON.stringify(personas));
      toast({
        title: "Success",
        description: "Your persona settings have been saved.",
      });
      router.push('/settings');
    } catch (error) {
      console.error("Failed to save personas to localStorage", error);
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
          <h1 className="text-xl font-bold text-primary">Edit Personas</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-2xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Select a Persona</CardTitle>
              <CardDescription>Choose which AI persona you want to customize.</CardDescription>
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

          {selectedPersona && (
            <Card>
              <CardHeader>
                <CardTitle>Customize {selectedPersona.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="persona-name">Persona Name</Label>
                  <Input
                    id="persona-name"
                    value={selectedPersona.name}
                    onChange={handleNameChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Display Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedPersona.avatar} />
                      <AvatarFallback>{selectedPersona.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button asChild variant="outline">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </Button>
                  </div>
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
