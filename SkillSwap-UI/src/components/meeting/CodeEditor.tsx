import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Copy,
  Download,
  RotateCcw,
  Terminal,
  FileCode,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultCode = `// React Hooks Example - useEffect with dependencies
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This runs when userId changes
    setLoading(true);
    
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
    
    // Cleanup function (optional)
    return () => {
      console.log('Cleanup for userId:', userId);
    };
  }, [userId]); // 👈 Dependency array

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}

export default UserProfile;`;

const CodeEditor = () => {
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  const runCode = () => {
    setShowOutput(true);
    setOutput("✓ Component renders successfully\n✓ useEffect hook detected\n✓ Dependency array properly configured\n\nNo errors found!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const resetCode = () => {
    setCode(defaultCode);
    setOutput("");
    setShowOutput(false);
  };

  return (
    <div className="h-full flex flex-col glass-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Shared Workspace</span>
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32 h-8 bg-secondary border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground hover:text-foreground"
            onClick={resetCode}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground hover:text-foreground"
            onClick={copyCode}
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button
            size="sm"
            className="h-8 glow-button"
            onClick={runCode}
          >
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex min-h-0">
        {/* Line Numbers + Code */}
        <div className="flex-1 flex overflow-hidden">
          {/* Line Numbers */}
          <div className="w-12 bg-background/50 py-4 text-right pr-3 text-muted-foreground text-sm font-mono select-none overflow-hidden">
            {code.split("\n").map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 bg-transparent text-sm font-mono text-foreground resize-none focus:outline-none leading-6"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output Panel */}
        {showOutput && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 300 }}
            className="border-l border-border overflow-hidden"
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Output</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowOutput(false)}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 font-mono text-sm text-green-400 whitespace-pre-wrap">
              {output}
            </div>
          </motion.div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Line 1, Column 1</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>Synced with Sarah</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
