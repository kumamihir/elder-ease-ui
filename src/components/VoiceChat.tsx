import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function VoiceChat() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        setTranscript(event.results[last][0].transcript);
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggle = async () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      toast({ title: "Voice not supported", description: "Your browser doesn't support speech recognition." });
      return;
    }
    if (!listening) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.start();
        setListening(true);
      } catch (e) {
        toast({ title: "Microphone blocked", description: "Please allow microphone access." });
      }
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    <Card aria-labelledby="voice-chat-title">
      <CardHeader>
        <CardTitle id="voice-chat-title">Voice Chat</CardTitle>
        <CardDescription>Press the microphone to talk.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant={listening ? "destructive" : "hero"} size="lg" onClick={toggle} aria-label="Toggle voice chat">
          {listening ? <Square /> : <Mic />}
          {listening ? "Stop" : "Speak"}
        </Button>
        {transcript && (
          <p className="mt-3 text-lg">You said: <span className="font-semibold">{transcript}</span></p>
        )}
      </CardContent>
    </Card>
  );
}
