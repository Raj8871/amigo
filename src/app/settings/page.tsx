
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Paintbrush, Bot, User, Type, BotIcon, MessageSquareHeart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from "react";
import type { PersonaChatInput } from "@/ai/flows/persona-chat";
import { Label } from "@/components/ui/label";


export default function SettingsPage() {
  const [language, setLanguage] = useState<PersonaChatInput['language']>('English');


  useEffect(() => {
    try {
      const storedLanguage = localStorage.getItem('aiLanguage') as PersonaChatInput['language'];
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    } catch (error) {
      console.error("Failed to read language from localStorage", error);
    }
  }, []);

  const handleLanguageChange = (value: string) => {
    const newLanguage = value as PersonaChatInput['language'];
    setLanguage(newLanguage);
    try {
      localStorage.setItem('aiLanguage', newLanguage);
    } catch (error) {
      console.error("Failed to save language to localStorage", error);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-headline text-2xl font-bold text-primary">
            AI Amigo
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Customize your AI Amigo experience.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="h-6 w-6" />
                AI Image Generation
              </CardTitle>
              <CardDescription>
                Create a unique avatar for your AI persona.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Button asChild>
                  <Link href="/settings/image-generation">
                    <Paintbrush className="mr-2 h-4 w-4" />
                    Generate Images
                  </Link>
                </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BotIcon className="h-6 w-6" />
                Persona Customization
              </CardTitle>
              <CardDescription>
                Modify how your AI personas look and behave.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Edit Your Profile</Label>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link href="/settings/user-profile">
                      <User className="h-4 w-4" />
                      <span>Change Your Name &amp; DP</span>
                    </Link>
                </Button>
              </div>
              <div className="space-y-2">
                <Label>AI Display Pictures</Label>
                 <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link href="/settings/persona">
                      <Bot className="h-4 w-4" />
                      <span>Change AI Display Pictures</span>
                    </Link>
                </Button>
              </div>
               <div className="space-y-2">
                <Label>AI Conversation Style</Label>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link href="/settings/persona-style">
                      <MessageSquareHeart className="h-4 w-4" />
                      <span>Customize Conversation Style</span>
                    </Link>
                </Button>
              </div>
              <div className="space-y-2">
                <Label>AI Conversation Language</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Hinglish">Hinglish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-6 w-6" />
                Appearance
              </CardTitle>
              <CardDescription>
                Adjust the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Style</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="base">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
