
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Paintbrush, Bot, User, Type, BotIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from "react";
import type { PersonaChatInput } from "@/ai/flows/persona-chat";
import { generateImage } from "@/ai/flows/generate-image";
import { useToast } from "@/hooks/use-toast";


export default function SettingsPage() {
  const { toast } = useToast();
  const [language, setLanguage] = useState<PersonaChatInput['language']>('English');
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);


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

  const handleGenerateImage = async () => {
    if (!imagePrompt) {
      toast({
        variant: "destructive",
        title: "Prompt is required",
        description: "Please enter a prompt to generate an image.",
      });
      return;
    }
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const result = await generateImage({ prompt: imagePrompt });
      setGeneratedImage(result.imageDataUri);
    } catch (error) {
      console.error("Image generation failed:", error);
      toast({
        variant: "destructive",
        title: "Image Generation Failed",
        description: "Could not generate image. Please try again.",
      });
    } finally {
      setIsGenerating(false);
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
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="prompt">Image Prompt</Label>
                <Input 
                  id="prompt" 
                  type="text" 
                  placeholder="e.g., a friendly robot with a warm smile" 
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              <Button onClick={handleGenerateImage} disabled={isGenerating}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Image
              </Button>
               {isGenerating && (
                <div className="flex items-center justify-center p-8">
                  <p>Generating your image...</p>
                </div>
              )}
              {generatedImage && (
                <div className="mt-4">
                  <Label>Generated Image</Label>
                  <div className="mt-2 rounded-lg overflow-hidden border">
                    <Image
                      src={generatedImage}
                      alt="Generated AI"
                      width={512}
                      height={512}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
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
                <Label>AI Persona Descriptions</Label>
                <Button variant="outline" className="w-full justify-start gap-2">
                    <Bot className="h-4 w-4" />
                    <span>Change Persona Descriptions</span>
                </Button>
              </div>
              <div className="space-y-2">
                <Label>AI Display Pictures</Label>
                 <Button variant="outline" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    <span>Change AI Display Pictures</span>
                </Button>
              </div>
               <div className="space-y-2">
                <Label>AI Conversation Style</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
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
