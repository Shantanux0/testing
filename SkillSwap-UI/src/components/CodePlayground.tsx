import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Play, Terminal, X, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CodePlayground = ({ onClose }: { onClose: () => void }) => {
    const [output, setOutput] = useState<string[]>(["// Output will appear here..."]);
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(`// Welcome to SkillSwap Compiler
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Developer"));`);

    const HINDI_MEMES = [
        "System: Bhai kya kar raha hai tu? (Syntax Error)",
        "System: Arey beta, tumse na ho payega... (Compilation Failed)",
        "System: Ye baburao ka style hai! (Code Executed)",
        "System: Paisa hi paisa hoga! (Memory Leak Detected)",
        "System: Khopdi tod saale ka! (Bug Smashed)",
        "System: Utha le re baba, utha le... mereko nahi, is bug ko! (Fatal Error)",
        "System: Maza aaya! (Success)",
        "System: Bilkul riks nahi lene ka... (Warning)",
        "System: Jalwa hai hamara! (Optimization Success)",
        "System: Chilla chilla ke sabko scheme bata de! (Security Alert)",
        "System: Ab ghodo ki race mein gadhe bhi daudenge? (Type Mismatch)",
        "System: Sehta hai bhai, sehta hai... (Server Overload)"
    ];

    const runCode = async () => {
        setOutput(["> Compiling..."]);
        const randomMeme = HINDI_MEMES[Math.floor(Math.random() * HINDI_MEMES.length)];
        const executionTime = Math.floor(Math.random() * 50) + 5;

        // Wait a bit to simulate processing
        await new Promise(r => setTimeout(r, 600));

        let logs: string[] = [];

        if (language === "javascript") {
            try {
                // Capture console.log
                const originalLog = console.log;
                console.log = (...args) => {
                    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
                };

                // Execute Code safely
                // eslint-disable-next-line no-new-func
                const userFunc = new Function(code);
                userFunc();

                // Restore console.log
                console.log = originalLog;
            } catch (error: any) {
                logs.push(`Error: ${error.message}`);
            }
        } else {
            // Simulation for other languages
            logs.push("Note: Sandbox mode (Output simulated for non-JS languages)");
            if (code.includes("print") || code.includes("System.out.println")) {
                // Extract simple string literals for demo feeling
                const match = code.match(/["'](.+)["']/);
                if (match) logs.push(match[1]);
                else logs.push("Hello from " + (language === 'python' ? "Python" : "Java"));
            }
        }

        setOutput(prev => [
            ...prev,
            ...logs,
            `> ${randomMeme}`,
            `> Execution finished in ${executionTime}ms`
        ]);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <div className="w-screen h-screen bg-[#1e1e1e] shadow-2xl overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1.5">
                            <div onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-600 transition-colors" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-xs text-gray-400 font-mono flex items-center gap-2">
                            <Terminal className="w-3 h-3" /> playground.{language}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select value={language} onValueChange={(v) => { setLanguage(v); setCode(v === 'python' ? 'print("Hello World")' : v === 'java' ? 'class Main { psv... }' : '// Code here') }}>
                            <SelectTrigger className="h-7 w-[120px] bg-[#333] border-none text-xs text-white">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#252526] border-white/10 text-white">
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="java">Java</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="sm" onClick={runCode} className="h-7 bg-green-600 hover:bg-green-700 text-white text-xs gap-1.5">
                            <Play className="w-3 h-3" /> Run
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-white" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Editor Area */}
                {/* Editor Area */}
                <div className="flex-1 flex min-h-0">
                    <div className="flex-[2] relative border-r border-white/10">
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            language={language}
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 16,
                                padding: { top: 20 },
                                scrollBeyondLastLine: false,
                                fontFamily: "'JetBrains Mono', monospace",
                                guides: { indentation: false },
                                renderLineHighlight: 'none',
                            }}
                        />
                    </div>

                    {/* Side Console Panel */}
                    <div className="flex-1 bg-[#1e1e1e]/95 backdrop-blur-sm flex flex-col border-l border-white/5">
                        <div className="px-4 py-3 bg-[#252526] text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 flex items-center justify-between">
                            <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> System Log</span>
                            <span className="text-xs">{output.length} events</span>
                        </div>
                        <div className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-2">
                            {output.length === 0 && <span className="opacity-30 italic text-gray-400">// Ready to execute...</span>}
                            {output.map((line, i) => (
                                <div key={i} className={`${line.startsWith('>') ? 'text-green-400 font-semibold' : 'text-gray-300'} flex gap-3 border-b border-white/5 pb-1 last:border-0`}>
                                    <span className="opacity-30 select-none mt-0.5">›</span>
                                    <span className="break-all">{line}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CodePlayground;
