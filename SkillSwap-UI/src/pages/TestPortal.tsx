import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { testApi, TestResponse, TestHistory, TestResultResponse, UserAnswer } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCw,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";

const TestPortal = () => {
  // --- State ---
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<"start" | "test" | "result">("start");
  const [loading, setLoading] = useState(false);

  // Dashboard Data
  const [history, setHistory] = useState<TestHistory[]>([]);
  const [skillName, setSkillName] = useState("");

  // Active Test Data
  const [activeTest, setActiveTest] = useState<TestResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Result Data
  const [testResult, setTestResult] = useState<TestResultResponse | null>(null);

  // --- Effects ---

  useEffect(() => {
    loadHistory();
    const state = location.state as { autoCheckSkill?: string };
    if (state?.autoCheckSkill) {
      setSkillName(state.autoCheckSkill);
    }
  }, [location.state]);

  useEffect(() => {
    if (activeTest && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
      return () => clearInterval(timer);
    } else if (activeTest && timeLeft === 0) {
      handleSubmitTest();
    }
  }, [timeLeft, activeTest]);

  // --- Actions ---

  const loadHistory = async () => {
    try {
      const data = await testApi.getTestHistory();
      setHistory(data);
    } catch (e) {
      console.error("Failed to load history");
    }
  };

  // --- Strict Mode Effects ---
  useEffect(() => {
    if (mode === 'test') {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
      const handleContextMenu = (e: Event) => e.preventDefault();
      document.addEventListener('contextmenu', handleContextMenu);

      const handleVisibilityChange = () => {
        if (document.hidden) {
          toast.error("WARNING: Tab switching is prohibited!", {
            description: "Your test will be auto-submitted if you continue.",
            duration: 5000
          });
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
      };
    }
  }, [mode]);


  const handleStartTest = async () => {
    if (!skillName.trim()) {
      toast.error("Please enter a skill");
      return;
    }
    setLoading(true);
    try {
      const test = await testApi.generateTest(skillName.trim());
      setActiveTest(test);
      setAnswers({});
      setTimeLeft(10 * 60); // 10 minutes
      setCurrentQuestionIndex(0);
      setMode("test");
    } catch (e: any) {
      toast.error(e.message || "Failed to start test");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: number, fullOptionText: string) => {
    const optionLetter = fullOptionText.charAt(0);
    setAnswers(prev => ({ ...prev, [questionId]: optionLetter }));
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    setLoading(true);
    try {
      const userAnswers: UserAnswer[] = activeTest.questions.map(q => ({
        questionNumber: q.questionNumber || 0,
        selectedAnswer: answers[q.questionNumber || 0] || ""
      }));

      const result = await testApi.submitTest(activeTest.testId, userAnswers);
      setTestResult(result);
      setMode("result");
      loadHistory();
    } catch (e: any) {
      toast.error(e.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // --- Views ---

  const StartView = () => (
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="text-center space-y-6">
        <h1 className="font-serif text-5xl md:text-8xl font-bold tracking-tighter">Skill Validation</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto tracking-wide">
          Prove your mastery. Earn your badge. Unlock teaching privileges.
        </p>
      </div>

      {/* Generator */}
      <div className="bg-white/5 border border-white/10 p-12 text-center space-y-8 relative overflow-hidden group backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />

        <div className="space-y-4">
          <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Target Skill</label>
          <Input
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="e.g. Java, React, Python"
            className="text-center text-4xl font-serif border-0 border-b border-white/20 rounded-none bg-transparent focus:border-white h-20 shadow-none text-white placeholder:text-gray-800 transition-all focus:ring-0"
          />
        </div>

        <Button
          onClick={handleStartTest}
          disabled={loading}
          className="h-16 px-12 bg-white text-black hover:bg-gray-200 rounded-none text-sm uppercase tracking-[0.2em] transition-transform hover:scale-105"
        >
          {loading ? <RotateCw className="animate-spin" /> : "Initialize Assessment"}
        </Button>
      </div>

      {/* History */}
      <div className="space-y-8">
        <h2 className="font-serif text-2xl font-bold border-b border-white/10 pb-4 text-white/50">Recent Certifications</h2>
        <div className="grid gap-4">
          {history.map((item) => (
            <div key={item.testId} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 flex items-center justify-center border ${item.isPassed ? 'border-white bg-white text-black' : 'border-red-500/50 text-red-500'}`}>
                  {item.isPassed ? <Award className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{item.skillName}</h3>
                  <div className="text-xs uppercase tracking-widest text-gray-500">{new Date(item.completedAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl font-bold">{Math.round((item.score / item.totalQuestions) * 100)}%</div>
                <div className={`text-xs uppercase tracking-widest ${item.isPassed ? 'text-green-500' : 'text-red-500'}`}>
                  {item.isPassed ? 'Verified' : 'Failed'}
                </div>
              </div>
            </div>
          ))}
          {history.length === 0 && <div className="text-center text-gray-600 py-8 italic">No tests taken yet.</div>}
        </div>
      </div>
    </div>
  );

  const TestRunnerView = () => {
    if (!activeTest) return null;
    const currentQ = activeTest.questions[currentQuestionIndex];

    return (
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col justify-center min-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-white pb-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-widest text-red-500 mb-2 animate-pulse">Strict Mode Active</div>
            <h1 className="font-serif text-4xl font-bold">{activeTest.skillName}</h1>
          </div>
          <div className="flex items-center gap-4 font-mono text-3xl">
            <Clock className="w-6 h-6" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question */}
        <div className="flex-1">
          <div className="mb-12">
            <span className="text-xs font-bold bg-white text-black px-3 py-1 mb-6 inline-block tracking-widest">
              QUESTION {currentQuestionIndex + 1} / {activeTest.questions.length}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQ.options.map((opt, idx) => {
              const letter = opt.charAt(0); // "A"
              const isSelected = answers[currentQ.questionNumber || 0] === letter;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(currentQ.questionNumber || 0, opt)}
                  className={`w-full text-left p-6 border transition-all duration-300 group
                                    ${isSelected
                      ? 'bg-white text-black border-white scale-[1.02]'
                      : 'bg-transparent border-white/20 hover:border-white hover:bg-white/5'
                    }`}
                >
                  <span className={`mr-6 font-mono text-sm tracking-widest ${isSelected ? 'opacity-100' : 'opacity-40'}`}>0{idx + 1}</span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="hover:bg-transparent hover:text-gray-400 text-gray-600 uppercase tracking-widest"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {activeTest.questions.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i === currentQuestionIndex ? 'bg-white scale-150' : (answers[activeTest.questions[i].questionNumber || 0] ? 'bg-white/50' : 'bg-white/20')}`}
              />
            ))}
          </div>

          {currentQuestionIndex === activeTest.questions.length - 1 ? (
            <Button
              onClick={handleSubmitTest}
              disabled={loading}
              className="rounded-none bg-white text-black hover:bg-gray-200 px-10 h-14 uppercase tracking-widest text-sm font-bold"
            >
              {loading ? "Submitting..." : "Submit Test"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(Math.min(activeTest.questions.length - 1, currentQuestionIndex + 1))}
              className="rounded-none border border-white bg-transparent text-white hover:bg-white hover:text-black px-10 h-14 uppercase tracking-widest text-sm transition-colors"
            >
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const ResultView = () => {
    if (!testResult) return null;
    return (
      <div className="max-w-2xl mx-auto text-center space-y-16 py-12">
        <div className="relative inline-block">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1.5 }}
            className={`w-40 h-40 rounded-full flex items-center justify-center border-4 ${testResult.isPassed ? 'border-white bg-white text-black' : 'border-red-600 text-red-600'}`}
          >
            {testResult.isPassed ? <CheckCircle2 className="w-20 h-20" /> : <XCircle className="w-20 h-20" />}
          </motion.div>
        </div>

        <div className="space-y-6">
          <h1 className="font-serif text-6xl md:text-7xl font-bold tracking-tighter">
            {testResult.isPassed ? "Certified" : "Not Qualified"}
          </h1>
          <p className="text-xl text-gray-400 font-light">
            {testResult.isPassed
              ? `You have successfully proven your mastery in ${testResult.skillName}.`
              : `You did not meet the passing score for ${testResult.skillName}.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 max-w-sm mx-auto border-t border-b border-white/20 py-12">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Score</div>
            <div className="font-serif text-5xl font-bold">{testResult.score}%</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Correct</div>
            <div className="font-serif text-5xl font-bold">{testResult.correctAnswers}/{testResult.totalQuestions}</div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <Button
            onClick={() => { setMode("start"); setSkillName(""); setActiveTest(null); }}
            className="rounded-none bg-white text-black hover:bg-gray-200 px-10 h-14 uppercase tracking-widest"
          >
            Return to Portal
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans relative">
      {/* Film Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
      />

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference text-white">
        <div className="flex items-center gap-8">
          {/* Logo - Navigates to Home */}
          <Logo className="text-white" />
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:block text-xs uppercase tracking-widest opacity-50">
            {mode === 'test' ? 'Assessment in Progress' : 'Test Portal'}
          </div>
          <div className="w-[1px] h-4 bg-white/30 mx-2" />
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-white transition-colors"
          >
            Exit <div className="w-8 h-[1px] bg-white" />
          </button>
        </div>
      </nav>


      <div className="relative z-10 w-full min-h-screen flex flex-col p-6 pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex-1"
          >
            {mode === "start" && <StartView />}
            {mode === "test" && <TestRunnerView />}
            {mode === "result" && <ResultView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestPortal;
