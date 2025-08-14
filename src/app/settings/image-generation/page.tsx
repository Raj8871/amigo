
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Paintbrush, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateImage } from '@/ai/flows/generate-image';
import { generateImageFromImage } from '@/ai/flows/generate-image-from-image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';


export default function ImageGenerationPage() {
  const { toast } = useToast();
  const [textPrompt, setTextPrompt] = useState('');
  const [generatedTextImage, setGeneratedTextImage] = useState<string | null>(null);
  const [isGeneratingText, setIsGeneratingText] = useState(false);

  const [imagePrompt, setImagePrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGenerateFromText = async () => {
    if (!textPrompt) {
      toast({
        variant: "destructive",
        title: "Prompt is required",
        description: "Please enter a prompt to generate an image.",
      });
      return;
    }
    setIsGeneratingText(true);
    setGeneratedTextImage(null);
    try {
      const result = await generateImage({ prompt: textPrompt });
      setGeneratedTextImage(result.imageDataUri);
    } catch (error) {
      console.error("Text-to-image generation failed:", error);
      toast({
        variant: "destructive",
        title: "Image Generation Failed",
        description: "Could not generate image from text. Please try again.",
      });
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleSourceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateFromImage = async () => {
    if (!imagePrompt) {
      toast({ variant: "destructive", title: "Style prompt is required" });
      return;
    }
    if (!sourceImage) {
      toast({ variant: "destructive", title: "Source image is required" });
      return;
    }
    setIsGeneratingImage(true);
    setGeneratedImages([]);
    try {
      const result = await generateImageFromImage({ prompt: imagePrompt, imageDataUri: sourceImage });
      setGeneratedImages(result.imageDataUris);
    } catch (error) {
      console.error("Image-to-image generation failed:", error);
      toast({
        variant: "destructive",
        title: "Image Generation Failed",
        description: "Could not generate images. Please try again.",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };


  return (
    <>
      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
           {selectedImage && (
            <Image
                src={selectedImage}
                alt="Selected generated image"
                width={1024}
                height={1024}
                className="w-full h-auto rounded-lg"
            />
           )}
        </DialogContent>
      </Dialog>
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

        <main className="flex-1 container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="text-to-image" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text-to-image">Generate from Text</TabsTrigger>
              <TabsTrigger value="image-to-image">Generate from Image</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text-to-image">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paintbrush className="h-6 w-6" />
                    Generate an Image with Text
                  </CardTitle>
                  <CardDescription>
                    Create a unique image for your AI persona using a text prompt.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="text-prompt">Image Prompt</Label>
                    <Input
                      id="text-prompt"
                      type="text"
                      placeholder="e.g., a friendly robot with a warm smile"
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      disabled={isGeneratingText}
                    />
                  </div>
                  <Button onClick={handleGenerateFromText} disabled={isGeneratingText}>
                    {isGeneratingText && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Image
                  </Button>
                  {isGeneratingText && (
                    <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Generating your image...</p>
                    </div>
                  )}
                  {generatedTextImage && (
                    <div className="mt-4">
                      <Label>Generated Image</Label>
                      <button onClick={() => setSelectedImage(generatedTextImage)} className="mt-2 rounded-lg overflow-hidden border block w-full cursor-pointer">
                        <Image
                          src={generatedTextImage}
                          alt="Generated AI"
                          width={512}
                          height={512}
                          className="w-full h-auto"
                        />
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="image-to-image">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-6 w-6" />
                     Generate New Styles from an Image
                  </CardTitle>
                  <CardDescription>
                    Upload a photo and generate new versions of the person in different styles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                       <Label>1. Upload Source Image</Label>
                       <Input
                          id="source-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleSourceImageUpload}
                          disabled={isGeneratingImage}
                          className="cursor-pointer"
                        />
                        {sourceImage && (
                          <div className="mt-2 rounded-lg overflow-hidden border w-full max-w-sm mx-auto">
                            <Image src={sourceImage} alt="Source" width={256} height={256} className="w-full h-auto object-cover" />
                          </div>
                        )}
                     </div>
                     <div className="space-y-4">
                        <Label htmlFor="image-prompt">2. Describe Style</Label>
                        <Input
                          id="image-prompt"
                          type="text"
                          placeholder="e.g., cyberpunk warrior, vintage photo"
                          value={imagePrompt}
                          onChange={(e) => setImagePrompt(e.target.value)}
                          disabled={isGeneratingImage || !sourceImage}
                        />
                        <Button onClick={handleGenerateFromImage} disabled={isGeneratingImage || !sourceImage || !imagePrompt}>
                          {isGeneratingImage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Generate 5 Images
                        </Button>
                     </div>
                  </div>

                  {isGeneratingImage && (
                    <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Generating new images... this may take a moment.</p>
                    </div>
                  )}

                  {generatedImages.length > 0 && (
                    <div className="mt-4">
                      <Label>Generated Images</Label>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {generatedImages.map((img, index) => (
                          <button key={index} onClick={() => setSelectedImage(img)} className="rounded-lg overflow-hidden border block cursor-pointer">
                            <Image
                              src={img}
                              alt={`Generated AI ${index + 1}`}
                              width={256}
                              height={256}
                              className="w-full h-auto object-cover aspect-square"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
