import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { PersonaSelector } from "@/components/chat/persona-selector";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-headline text-2xl font-bold text-primary">
            AI Amigo
          </Link>
          <div className="flex items-center space-x-4">
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
                Your Human-Like AI Chat Companion
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Choose a persona and start a conversation. Your AI Amigo is here to listen, support, and chat with you, anytime you need.
            </p>
        </section>

        <section className="sticky top-16 z-40 bg-background/95 py-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <PersonaSelector />
            </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h2 className="font-headline text-3xl font-bold tracking-tight">
                        Experience Lifelike Conversations
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Our advanced AI adapts its personality, tone, and style based on the role you choose. Whether you need a supportive friend, a caring mother, a fun-loving girlfriend, AI Amigo delivers a uniquely tailored chat experience.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="/chat/friend">Start Chatting Now</Link>
                    </Button>
                </div>
                <div>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <Image
                          src="https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxBaSUyMHxlbnwwfHx8fDE3NTUwMjE0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                          alt="Chat illustration"
                          width={600}
                          height={400}
                          className="w-full h-auto object-cover"
                          data-ai-hint="chat illustration"
                      />
                    </CardContent>
                  </Card>
                </div>
            </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} AI Amigo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
