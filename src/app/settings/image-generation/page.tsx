
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateImage } from '@/ai/flows/generate-image';

export default function ImageGenerationPage() {
  const { toast } = useToast();
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <ArrowLeft />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-primary">AI Image Generation</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-2xl py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paintbrush className="h-6 w-6" />
              Generate an Image
            </CardTitle>
            <CardDescription>
              Create a unique avatar for your AI persona using a text prompt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
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
              <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Generating your image...</p>
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
      </main>
    </div>
  );
}
