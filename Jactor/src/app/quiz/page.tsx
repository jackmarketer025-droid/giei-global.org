
"use client";

import { useState, useEffect } from 'react';
import { generateQuizQuestions, type GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Timer, BrainCircuit, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function QuizPage() {
  const [quizData, setQuizData] = useState<GenerateQuizQuestionsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    async function loadQuiz() {
      try {
        const result = await generateQuizQuestions({
          syllabus: "General Knowledge, ICT in Bangladesh, Basic Computer Architecture, Operating Systems, Digital Literacy",
          numQuestions: 10,
          difficulty: "medium"
        });
        setQuizData(result);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load quiz", error);
        setLoading(false);
      }
    }
    loadQuiz();
  }, []);

  useEffect(() => {
    if (!loading && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [loading, isFinished, timeLeft]);

  const handleNext = () => {
    if (quizData && selectedAnswer === quizData.questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }
    
    if (quizData && currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto" />
          <h2 className="text-2xl font-headline">কুইজ জেনারেট হচ্ছে...</h2>
          <p className="text-muted-foreground">দয়া করে অপেক্ষা করুন।</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-headline">কুইজ লোড করতে সমস্যা হয়েছে</h2>
          <Button onClick={() => window.location.reload()}>আবার চেষ্টা করুন</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentIndex];

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <Navbar />
      
      <div className="max-w-3xl mx-auto">
        {!isFinished ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold font-headline">মেধা যাচাই পরীক্ষা</h1>
                <p className="text-muted-foreground">প্রশ্ন {currentIndex + 1} / {quizData.questions.length}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Timer className="w-5 h-5 text-primary" />
                <span className="font-mono text-xl font-bold text-primary">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <Progress value={(currentIndex / quizData.questions.length) * 100} className="h-2" />

            <Card className="glass-panel border-none p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed">
                {currentQuestion.questionText}
              </h2>
              <div className="space-y-4">
                {currentQuestion.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAnswer(option)}
                    className={`w-full p-4 text-left rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                      selectedAnswer === option
                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-white/5 border-white/10 hover:border-primary/50'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      selectedAnswer === option ? 'border-white bg-white/20' : 'border-white/20'
                    }`}>
                      {selectedAnswer === option && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                size="lg"
                disabled={!selectedAnswer}
                onClick={handleNext}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-12 h-14 font-bold"
              >
                {currentIndex === quizData.questions.length - 1 ? 'সাবমিট করুন' : 'পরবর্তী প্রশ্ন'}
              </Button>
            </div>
          </div>
        ) : (
          <Card className="glass-panel border-none text-center p-12 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <BrainCircuit className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-4xl font-headline mb-4">পরীক্ষা সম্পন্ন হয়েছে!</h2>
            <p className="text-xl text-muted-foreground mb-8">
              আপনি {quizData.questions.length} টি প্রশ্নের মধ্যে {score} টি সঠিক উত্তর দিয়েছেন।
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-sm text-muted-foreground mb-1">সঠিক উত্তর</p>
                <p className="text-2xl font-bold font-headline">{score}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-sm text-muted-foreground mb-1">অর্জিত নম্বর</p>
                <p className="text-2xl font-bold font-headline">{score * 10}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="outline" className="rounded-full px-8 border-white/10">
                <a href="/">ফিরে যান</a>
              </Button>
              <Button className="bg-primary text-primary-foreground rounded-full px-8 font-bold">
                ফলাফল বিস্তারিত দেখুন
              </Button>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
