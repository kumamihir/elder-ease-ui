import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const QUESTIONS = [
  {
    q: "What day comes after Monday?",
    options: ["Sunday", "Tuesday", "Friday"],
    a: 1,
  },
  {
    q: "How many minutes are in one hour?",
    options: ["30", "60", "90"],
    a: 1,
  },
  {
    q: "Which is a fruit?",
    options: ["Carrot", "Apple", "Broccoli"],
    a: 1,
  },
];

export default function BrainQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const done = step >= QUESTIONS.length;

  const score = useMemo(() => answers.filter((a, i) => a === QUESTIONS[i].a).length, [answers]);

  const onAnswer = (idx: number) => {
    setAnswers((prev) => [...prev, idx]);
    setStep((s) => s + 1);
  };

  return (
    <Card aria-labelledby="quiz-title">
      <CardHeader>
        <CardTitle id="quiz-title">Brain Quiz</CardTitle>
        <CardDescription>Fun mental exercises for engagement.</CardDescription>
      </CardHeader>
      <CardContent>
        {!done ? (
          <div>
            <p className="text-xl mb-4">{QUESTIONS[step].q}</p>
            <div className="grid gap-3">
              {QUESTIONS[step].options.map((opt, i) => (
                <Button key={i} variant="soft" onClick={() => onAnswer(i)} aria-label={`Answer ${opt}`}>
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-2xl font-semibold">Score: {score} / {QUESTIONS.length}</p>
            <Button className="mt-4" variant="hero" onClick={() => { setStep(0); setAnswers([]); }} aria-label="Restart quiz">Play Again</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
