import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const upcoming = [
  { id: 1, title: "Aspirin 75mg", time: "8:00 AM" },
  { id: 2, title: "Doctor Appointment", time: "Tue, 10:30 AM" },
];

export default function NotificationsPanel() {
  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      toast({ title: "Notifications not supported" });
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      toast({ title: "Reminders enabled", description: "We'll remind you on time." });
      setTimeout(() => {
        new Notification("Time for your medicine", { body: "Aspirin 75mg" });
      }, 5000);
    } else {
      toast({ title: "Permission denied", description: "You can enable notifications in your browser settings." });
    }
  };

  return (
    <Card aria-labelledby="notifications-title">
      <CardHeader>
        <CardTitle id="notifications-title">Notifications</CardTitle>
        <CardDescription>Easy reminders for medicines and appointments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Button onClick={enableNotifications} size="lg" variant="soft" aria-label="Enable reminders">
            <Bell /> Enable Reminders
          </Button>
        </div>
        <ul className="mt-4 space-y-3">
          {upcoming.map((n) => (
            <li key={n.id} className="flex justify-between items-center rounded-md bg-muted px-4 py-3">
              <span className="text-lg">{n.title}</span>
              <span className="text-muted-foreground">{n.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
