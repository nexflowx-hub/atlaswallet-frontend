"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LOCALES = [
  { code: "en-GB", label: "English (UK)", flag: "🇬🇧" },
  { code: "pt-BR", label: "Português (Brasil)", flag: "🇧🇷" },
  { code: "pt-PT", label: "Português (Portugal)", flag: "🇵🇹" },
] as const;

const STORAGE_KEY = "atlaswallet.locale";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const [current, setCurrent] = useState<string>(() => {
    if (typeof window === "undefined") return "en-GB";
    return window.localStorage.getItem(STORAGE_KEY) || "en-GB";
  });

  function choose(code: string) {
    setCurrent(code);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, code);
    }
    // Real i18n routing would setCookie('NEXT_LOCALE', code) and reload.
  }

  const active = LOCALES.find((l) => l.code === current) || LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          aria-label="Select language"
        >
          <Languages className="h-4 w-4" />
          {!compact && <span className="text-xs">{active.flag} {active.code.split("-")[0].toUpperCase()}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => choose(l.code)}
            className="cursor-pointer justify-between"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{l.flag}</span>
              <span>{l.label}</span>
            </span>
            {l.code === current && <Check className="h-4 w-4 text-brand" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
