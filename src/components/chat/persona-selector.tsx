"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { personas } from "@/lib/personas";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PersonaSelector() {
    const pathname = usePathname();
    const currentRole = pathname.split('/').pop();

    return (
        <div className="flex justify-center items-center flex-wrap gap-2 md:gap-4">
            {Object.values(personas).map((persona) => (
                <Button 
                    key={persona.key} 
                    variant={currentRole === persona.key ? "default" : "outline"} 
                    asChild 
                    className="flex-shrink-0"
                >
                    <Link href={`/chat/${persona.key}`} className="flex items-center gap-2">
                        <persona.icon className="h-4 w-4" />
                        <span>{persona.promptRole}</span>
                    </Link>
                </Button>
            ))}
        </div>
    );
}
