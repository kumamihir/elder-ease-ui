import ThemeToggle from "@/components/ThemeToggle";
import { HeartPulse, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeaderNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <HeartPulse className="h-8 w-8 text-primary" aria-hidden="true" />
          <span className="text-2xl font-bold">CareConnect</span>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="hero" size="sm" aria-label="Call personal doctor">
            <a href="tel:+1234567890"><Phone /> Doctor</a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
