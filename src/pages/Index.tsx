import HeaderNav from "@/components/HeaderNav";
import SosButton from "@/components/SosButton";
import EmergencyShare from "@/components/EmergencyShare";
import NotificationsPanel from "@/components/NotificationsPanel";
import VoiceChat from "@/components/VoiceChat";
import MoodCheck from "@/components/MoodCheck";
import BreathingMeditation from "@/components/BreathingMeditation";
import BrainQuiz from "@/components/BrainQuiz";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Video } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <HeaderNav />
      <main role="main" className="container mx-auto px-4 py-6">
        <h1 className="sr-only">CareConnect Accessible Medical Companion</h1>

        {/* Hero intro */}
        <section className="mb-6 rounded-lg bg-gradient-to-br from-brand to-primary p-6 text-primary-foreground">
          <p className="text-2xl font-bold">Welcome back</p>
          <p className="text-lg opacity-90">Your health tools at a glance.</p>
        </section>

        {/* Key Actions */}
        <section aria-label="Key actions" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <EmergencyShare />
          <NotificationsPanel />
          <Card>
            <CardHeader>
              <CardTitle>Weekly Family Video Call</CardTitle>
              <CardDescription>Every Sunday at 5:00 PM</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Button asChild variant="hero" size="lg" aria-label="Join family video call">
                <a href="#"><Video /> Join Now</a>
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-5 w-5" /> <span>Next: Sun, 5:00 PM</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Personal Doctor Contact</CardTitle>
              <CardDescription>Call or message your doctor.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild variant="soft" size="lg" aria-label="Call doctor">
                <a href="tel:+1234567890">Call Doctor</a>
              </Button>
              <Button asChild variant="soft" size="lg" aria-label="Message doctor">
                <a href="sms:+1234567890">Message Doctor</a>
              </Button>
            </CardContent>
          </Card>
          <VoiceChat />
          <MoodCheck />
          <BreathingMeditation />
          <BrainQuiz />
        </section>
      </main>
      <SosButton />
    </div>
  );
}
