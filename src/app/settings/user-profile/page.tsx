
"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, User } from 'lucide-react';
import type { UserProfile } from '@/lib/user-profile';

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({ name: 'You', avatar: '' });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error("Failed to load user profile from localStorage", error);
    }
  }, []);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile(p => ({ ...p, name: e.target.value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(p => ({ ...p, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      toast({
        title: "Success",
        description: "Your profile has been saved.",
      });
      router.push('/settings');
    } catch (error) {
      console.error("Failed to save profile to localStorage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your profile. Please try again.",
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
          <h1 className="text-xl font-bold text-primary">Edit Your Profile</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-2xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                Customize Your Profile
              </CardTitle>
              <CardDescription>
                Change your display name and avatar for chats.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user-name">Your Name</Label>
                <Input
                  id="user-name"
                  value={profile.name}
                  onChange={handleNameChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Your Display Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>{profile.name?.charAt(0) || 'Y'}</AvatarFallback>
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

          <div className="flex justify-end gap-2">
             <Button variant="outline" onClick={() => router.push('/settings')}>
                Cancel
            </Button>
            <Button onClick={handleSave}>
                Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
