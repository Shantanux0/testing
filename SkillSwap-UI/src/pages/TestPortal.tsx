import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { testApi, TestResponse, TestHistory, TestResultResponse, UserAnswer } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Play, History, CheckCircle2, XCircle, Clock, Brain, Timer, AlertTriangle, ArrowRight, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TestPortal = () => {
  const [activeTest, setActiveTest] = useState<TestResponse | null>(null);
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);
  const [testResult, setTestResult] = useState<TestResultResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins default
  const [mode, setMode] = useState<"dashboard" | "test">("dashboard");

  // Load history on mount
  useEffect(() => { loadHistory(); }, []);

  // Timer logic
  useEffect(() => {
    if (activeTest && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && activeTest) {
      handleSubmitTest(); // Auto submit
    }
  }, [activeTest, timeLeft]);


  const loadHistory = async () => {
    try {
      const history = await testApi.getTestHistory();
      setTestHistory(history);
    } catch (e) { toast.error("Could not load history"); }
  };

  const handleGenerateTest = async () => {
    if (!skillName.trim()) return toast.error("Enter a skill name");
    setLoading(true);
    try {
      const test = await testApi.generateTest(skillName.trim());
      setActiveTest(test);
      setAnswers({});
      setTimeLeft(600); // Reset timer
      setMode("test");
      setSkillName("");
    } catch (error: any) {
      toast.error(error.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    setLoading(true);
    try {
      const userAnswers: UserAnswer[] = activeTest.questions.map((q) => ({
        questionNumber: q.questionNumber || q.questionId || 0,
        selectedAnswer: answers[q.questionId || q.questionNumber || 0] || "",
      }));

      const result = await testApi.submitTest(activeTest.testId, userAnswers);
      setTestResult(result);
      setActiveTest(null);
      setMode("dashboard");
      await loadHistory();
    } catch (error: any) {
      toast.error(error.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- Cinematic Components ---

  const DashboardView = () => (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-bold text-slate-900">Skill Certification</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Prove your expertise to unlock teaching privileges.
          Pass a quick 10-question test to earn your verified badge.
        </p>
      </div>

      {/* Generator Card */}
      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative bg-white border border-slate-200 p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Take a new test</h2>
              <p className="text-slate-500">AI-generated, multiple choice</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="What skill do you want to certify? (e.g. React)"
              className="h-14 text-lg bg-slate-50 border-slate-200 rounded-xl"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateTest()}
            />
            <Button
              size="lg"
              onClick={handleGenerateTest}
              disabled={loading}
              className="h-14 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
            >
              {loading ? "Generating..." : "Start Test"}
            </Button>
          </div>
        </div>
      </div>

      {/* History Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold border-b pb-4">
          <History className="w-5 h-5 text-indigo-500" />
          Your Certifications
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testHistory.map((test) => (
            <div key={test.testId} className="group relative bg-white border border-slate-200 p-6 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-900">{test.skillName}</h3>
                <Badge variant={test.passed ? "default" : "destructive"} className="rounded-md">
                  {test.passed ? "Verified" : "Failed"}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex justify-between">
                  <span>Score</span>
                  <span className={`font-mono font-medium ${test.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round((test.score / test.totalQuestions) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span>{new Date(test.completedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {test.passed && (
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Award className="w-12 h-12 text-yellow-400 rotate-12 drop-shadow-sm" />
                </div>
              )}
            </div>
          ))}
        </div>
        {testHistory.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            No certifications yet. Take your first test above!
          </div>
        )}
      </div>
    </div>
  );

  const TestRunnerView = () => {
    if (!activeTest) return null;

    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white overflow-y-auto">
        {/* Focus Mode Header */}
        <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-indigo-300 border-indigo-500/30">
                Focus Mode
              </Badge>
              <h2 className="font-bold text-lg">{activeTest.skillName} Certification</h2>
            </div>

            <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              <Timer className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-8 pb-32 space-y-8">
          {activeTest.questions.map((q, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={q.questionId}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <div className="space-y-4 w-full">
                  <p className="text-lg font-medium leading-relaxed">{q.questionText || q.question}</p>
                  <div className="grid gap-3">
                    {q.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.questionId || 0]: opt }))}
                        className={`text-left p-4 rounded-xl border transition-all duration-200 ${answers[q.questionId || 0] === opt
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-900/50 border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-6">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <p className="text-slate-400 text-sm">
              {Object.keys(answers).length} of {activeTest.questions.length} answered
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-white"
                onClick={() => {
                  if (confirm("Quit test? Progress will be lost.")) {
                    setActiveTest(null);
                    setMode("dashboard");
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 shadow-lg shadow-emerald-500/20"
                onClick={handleSubmitTest}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Answers"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      {mode === "dashboard" ? <DashboardView /> : <TestRunnerView />}

      {/* Result Modal */}
      <Dialog open={!!testResult} onOpenChange={(open) => !open && setTestResult(null)}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-slate-50">
              {testResult?.passed ? (
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              ) : (
                <XCircle className="w-10 h-10 text-red-500" />
              )}
            </div>
            <DialogTitle className="text-2xl font-bold">
              {testResult?.passed ? "Certification Earned!" : "Test Failed"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="flex justify-center gap-8 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-3xl font-bold font-mono text-slate-900">
                  {testResult?.score}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="text-3xl font-bold font-mono text-slate-900">
                  {testResult?.correctAnswers}/{testResult?.totalQuestions}
                </p>
              </div>
            </div>

            {testResult?.passed && (
              <p className="text-green-600 font-medium bg-green-50 p-3 rounded-lg">
                You are now authorized to teach this skill!
              </p>
            )}
            {!testResult?.passed && (
              <p className="text-red-500 font-medium bg-red-50 p-3 rounded-lg">
                Don't give up! Study and try again.
              </p>
            )}
          </div>

          <Button size="lg" className="w-full" onClick={() => setTestResult(null)}>
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TestPortal;
