"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Clock, Home, Lock, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

const MODES = [
  { label: "Beranda", value: "", icon: <Home className="size-4" /> },
  { label: "Linimasa", value: "timeline", icon: <Clock className="size-4" /> },
  { label: "Chapter", value: "chapter", icon: <BookOpen className="size-4" /> },
] as const;

export const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMode = searchParams.get("mode") ?? "";

  const switchMode = (mode: string) => {
    const params = mode ? `?mode=${mode}` : "";
    router.replace(`/ruang${params}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="mx-auto flex max-w-5xl items-center p-4">
        <Link href="/ruang" className="font-bold text-base">
          satuwaktu
        </Link>
        <Separator orientation="vertical" className="mx-4 hidden sm:block" />
        <Tabs
          value={currentMode}
          onValueChange={switchMode}
          className="hidden sm:block"
        >
          <TabsList variant="line">
            {MODES.map((m) => (
              <TabsTrigger key={m.value} value={m.value} icon={m.icon}>
                {m.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link href="/tentang">tentang</Link>
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/masuk" aria-label="masuk">
              <Lock className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="border-t sm:hidden py-1">
        <Tabs value={currentMode} onValueChange={switchMode}>
          <TabsList variant="line" className="w-full">
            {MODES.map((m) => (
              <TabsTrigger
                key={m.value}
                value={m.value}
                icon={m.icon}
                className="flex-1 text-sm font-semibold"
              >
                {m.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
};
