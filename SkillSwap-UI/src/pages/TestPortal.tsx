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
    const optionLetter = (fullOptionText || " ").charAt(0);
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

  // --- Demo Data ---
  const DEMO_HISTORY: TestHistory[] = [
    { testId: -1, skillName: "React.js (Demo)", score: 12, totalQuestions: 15, isPassed: true, testStatus: "COMPLETED", createdAt: new Date().toISOString(), testExpiresAt: 0 },
    { testId: -2, skillName: "Java (Demo)", score: 6, totalQuestions: 15, isPassed: false, testStatus: "COMPLETED", createdAt: new Date(Date.now() - 86400000).toISOString(), testExpiresAt: 0 }
  ];

  const DEMO_RESULT: TestResultResponse = {
    resultId: -1,
    testId: -1,
    skillName: "React.js (Demo)",
    score: 80,
    totalQuestions: 15,
    correctAnswers: 12,
    isPassed: true,
    attemptDate: new Date().toISOString(),
    questionResults: [
      { questionNumber: 1, question: "What is the Virtual DOM?", correctAnswer: "A lightweight copy of the real DOM", userAnswer: "A lightweight copy of the real DOM", isCorrect: true },
      { questionNumber: 2, question: "Which hook is used for side effects?", correctAnswer: "useEffect", userAnswer: "useState", isCorrect: false },
      { questionNumber: 3, question: "How do you pass data to child components?", correctAnswer: "Props", userAnswer: "Props", isCorrect: true }
    ]
  };

  const handleViewHistory = async (testId: number) => {
    if (testId < 0) {
      // Demo Mode
      setTestResult(testId === -1 ? DEMO_RESULT : { ...DEMO_RESULT, resultId: -2, skillName: "Java (Demo)", score: 40, correctAnswers: 6, isPassed: false });
      setMode("result");
      return;
    }

    setLoading(true);
    try {
      const result = await testApi.getTestResult(testId);
      setTestResult(result);
      setMode("result");
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || e.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    setHistory(DEMO_HISTORY);
    toast.success("Demo history loaded");
  };

  const StartView = () => {
    const isHistoryPage = location.pathname === '/tests';

    return (
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <h1 className="font-serif text-4xl md:text-8xl font-bold tracking-tighter leading-none">Skill Validation</h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto tracking-wide">
            Prove your mastery. Earn your badge. Unlock teaching privileges.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            {isHistoryPage ? (
              <Button onClick={() => navigate('/test-portal')} variant="outline" className="rounded-none border-gray-300 bg-transparent text-black hover:bg-black hover:text-white">
                Start New Assessment <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={() => navigate('/tests')} variant="outline" className="rounded-none border-gray-300 bg-transparent text-black hover:bg-black hover:text-white">
                View History <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Generator - Only on /test-portal */}
        {!isHistoryPage && (
          <div className="bg-gray-50 border border-gray-200 p-12 text-center space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />

            <div className="space-y-4">
              <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Target Skill</label>
              <Input
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Java, React, Python"
                className="text-center text-2xl md:text-4xl font-serif border-0 border-b border-gray-300 rounded-none bg-transparent focus:border-black h-16 md:h-20 shadow-none text-black placeholder:text-gray-300 transition-all focus:ring-0"
              />
            </div>

            <Button
              onClick={handleStartTest}
              disabled={loading}
              className="w-full md:w-auto h-14 md:h-16 px-12 bg-black text-white hover:bg-gray-800 rounded-none text-xs md:text-sm uppercase tracking-[0.2em] transition-transform hover:scale-105"
            >
              {loading ? <RotateCw className="animate-spin" /> : "Initialize Assessment"}
            </Button>
          </div>
        )}

        {/* History - Only on /tests */}
        {isHistoryPage && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="font-serif text-2xl font-bold border-b border-gray-200 pb-4 text-gray-800">Your Test History</h2>
            <div className="grid gap-4">
              {history.map((item) => (
                <button
                  key={item.testId}
                  onClick={() => handleViewHistory(item.testId)}
                  className="w-full text-left flex items-center justify-between p-6 bg-white border border-gray-200 hover:border-black transition-all shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 flex items-center justify-center border ${item.isPassed ? 'border-gray-200 bg-gray-50 text-black' : 'border-red-100 bg-red-50 text-red-500'}`}>
                      {item.isPassed ? <Award className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-black transition-colors">{item.skillName}</h3>
                      <div className="text-xs uppercase tracking-widest text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-2xl font-bold">{Math.round((item.score / item.totalQuestions) * 100)}%</div>
                    <div className={`text-xs uppercase tracking-widest ${item.isPassed ? 'text-green-600' : 'text-red-500'}`}>
                      {item.isPassed ? 'Verified' : 'Failed'}
                    </div>
                  </div>
                </button>
              ))}
              {history.length === 0 && (
                <div className="text-center py-12 space-y-4">
                  <div className="text-gray-400 italic">No tests taken yet.</div>
                  <Button onClick={loadDemoData} variant="link" className="text-gray-500 hover:text-black">
                    View Demo History
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const TestRunnerView = () => {
    if (!activeTest) return null;
    const currentQ = activeTest.questions[currentQuestionIndex];

    return (
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col justify-center min-h-[80vh]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b-2 border-black pb-6 mb-12 md:mb-16 gap-6">
          <div className="text-center md:text-left">
            <div className="text-[10px] md:text-xs uppercase tracking-widest text-red-500 mb-2 animate-pulse">Strict Mode Active</div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold uppercase">{activeTest.skillName}</h1>
          </div>
          <div className="flex items-center gap-4 font-mono text-2xl md:text-3xl">
            <Clock className="w-5 h-5 md:w-6 md:h-6" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question */}
        <div className="flex-1">
          <div className="mb-8 md:mb-12">
            <span className="text-[10px] font-bold bg-black text-white px-3 py-1 mb-4 md:mb-6 inline-block tracking-widest">
              QUESTION {currentQuestionIndex + 1} / {activeTest.questions.length}
            </span>
            <h2 className="text-2xl md:text-4xl font-serif leading-tight md:leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-3 md:space-y-4">
            {currentQ.options.map((opt, idx) => {
              const letter = (opt || " ").charAt(0); // "A"
              const isSelected = answers[currentQ.questionNumber || 0] === letter;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(currentQ.questionNumber || 0, opt)}
                  className={`w-full text-left p-4 md:p-6 border transition-all duration-300 group
                                    ${isSelected
                      ? 'bg-black text-white border-black scale-[1.01] md:scale-[1.02]'
                      : 'bg-white border-gray-200 hover:border-black hover:bg-gray-50 text-black'
                    }`}
                >
                  <span className={`mr-4 md:mr-6 font-mono text-xs md:text-sm tracking-widest ${isSelected ? 'opacity-100' : 'text-gray-400'}`}>0{idx + 1}</span>
                  <span className="text-sm md:text-base">{opt}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="hover:bg-transparent hover:text-gray-500 text-gray-400 uppercase tracking-widest"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {activeTest.questions.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i === currentQuestionIndex ? 'bg-black scale-150' : (answers[activeTest.questions[i].questionNumber || 0] ? 'bg-gray-400' : 'bg-gray-200')}`}
              />
            ))}
          </div>

          {currentQuestionIndex === activeTest.questions.length - 1 ? (
            <Button
              onClick={handleSubmitTest}
              disabled={loading}
              className="rounded-none bg-black text-white hover:bg-gray-800 px-10 h-14 uppercase tracking-widest text-sm font-bold"
            >
              {loading ? "Submitting..." : "Submit Test"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(Math.min(activeTest.questions.length - 1, currentQuestionIndex + 1))}
              className="rounded-none border border-black bg-transparent text-black hover:bg-black hover:text-white px-10 h-14 uppercase tracking-widest text-sm transition-colors"
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
      <div className="max-w-4xl mx-auto space-y-16 py-12">
        <div className="text-center space-y-16">
          <div className="relative inline-block">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1.5 }}
              className={`w-40 h-40 rounded-full flex items-center justify-center border-4 ${testResult.isPassed ? 'border-black bg-black text-white' : 'border-red-600 text-red-600 bg-white'}`}
            >
              {testResult.isPassed ? <CheckCircle2 className="w-20 h-20" /> : <XCircle className="w-20 h-20" />}
            </motion.div>
          </div>

          <div className="space-y-6">
            <h1 className="font-serif text-6xl md:text-7xl font-bold tracking-tighter">
              {testResult.isPassed ? "Certified" : "Not Qualified"}
            </h1>
            <p className="text-xl text-gray-500 font-light">
              {testResult.isPassed
                ? `You have successfully proven your mastery in ${testResult.skillName}.`
                : `You did not meet the passing score for ${testResult.skillName}.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 max-w-sm mx-auto border-t border-b border-gray-200 py-12">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Score</div>
              <div className="font-serif text-5xl font-bold">{testResult.score}%</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Correct</div>
              <div className="font-serif text-5xl font-bold">{testResult.correctAnswers}/{testResult.totalQuestions}</div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        {testResult.questionResults && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
            <h2 className="font-serif text-2xl font-bold border-b border-gray-200 pb-4">Detailed Analysis</h2>
            <div className="space-y-4">
              {testResult.questionResults.map((q, i) => (
                <div key={i} className={`p-6 border ${q.isCorrect ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex gap-4 mb-4">
                    <span className={`font-mono text-sm tracking-widest ${q.isCorrect ? 'text-green-600' : 'text-red-500'}`}>0{q.questionNumber}</span>
                    <h3 className="font-serif text-lg leading-relaxed">{q.question}</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 pl-10 text-sm">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Your Answer</div>
                      <div className={`${q.isCorrect ? 'text-green-600' : 'text-red-500'} font-medium`}>{q.userAnswer}</div>
                    </div>
                    {!q.isCorrect && (
                      <div>
                        <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Correct Answer</div>
                        <div className="text-green-600 font-medium">{q.correctAnswer}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-6 pt-12">
          <Button
            onClick={() => { setMode("start"); setSkillName(""); setActiveTest(null); }}
            className="rounded-none bg-black text-white hover:bg-gray-800 px-10 h-14 uppercase tracking-widest"
          >
            Return to Portal
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans relative">

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 text-black bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo - Navigates to Home */}
          <Logo className="text-black scale-90 md:scale-100" />
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:block text-[10px] md:text-xs uppercase tracking-widest opacity-50">
            {mode === 'test' ? 'Assessment' : 'Test Portal'}
          </div>
          <div className="hidden sm:block w-[1px] h-4 bg-black/20" />
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest hover:text-black transition-colors"
          >
            Exit <div className="hidden sm:block w-8 h-[1px] bg-black" />
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
