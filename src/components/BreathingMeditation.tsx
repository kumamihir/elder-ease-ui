import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BreathingMeditation() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("Breathe In");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    let step = 0;
    timerRef.current = window.setInterval(() => {
      step = (step + 1) % 4;
      if (step === 0) setPhase("Breathe In");
      if (step === 1) setPhase("Hold");
      if (step === 2) setPhase("Breathe Out");
      if (step === 3) setPhase("Hold");
    }, 3000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [running]);

  return (
    <Card aria-labelledby="meditation-title">
      <CardHeader>
        <CardTitle id="meditation-title">Meditation</CardTitle>
        <CardDescription>Guided 3-3-3-3 breathing for relaxation.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className={`h-28 w-28 rounded-full border-4 border-primary/30 ${running ? "animate-pulse" : ""}`} />
          <p className="mt-3 text-xl">{running ? phase : "Ready"}</p>
          <Button className="mt-4" variant={running ? "destructive" : "hero"} onClick={() => setRunning(!running)} aria-label="Start or stop meditation">
            {running ? "Stop" : "Start"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
