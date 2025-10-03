import { useState } from "react";
import { cn } from "~/lib/utils";

interface CodingChallengeProps {
  challenge: CodingQuestion;
  className?: string;
  onComplete?: (completed: boolean) => void;
}

export default function CodingChallenge({ challenge, className, onComplete }: CodingChallengeProps) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-500/20 text-green-200 border-green-400/30',
      medium: 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30',
      hard: 'bg-red-500/20 text-red-200 border-red-400/30',
    };
    return colors[difficulty as keyof typeof colors] || colors.medium;
  };

  const getDifficultyIcon = (difficulty: string) => {
    const icons = {
      easy: '🟢',
      medium: '🟡',
      hard: '🔴',
    };
    return icons[difficulty as keyof typeof icons] || icons.medium;
  };

  const handleCompleteChallenge = () => {
    const completed = !isCompleted;
    setIsCompleted(completed);
    onComplete?.(completed);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className={cn("bg-white/5 border border-white/10 backdrop-blur-md rounded-xl overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 border-b border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={cn("px-3 py-1 rounded-full text-sm font-medium border", getDifficultyColor(challenge.difficulty))}>
                {getDifficultyIcon(challenge.difficulty)} {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
              </span>
              <span className="bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                {challenge.category}
              </span>
              {isCompleted && (
                <span className="bg-green-500/30 text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  ✅ Completed
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">{challenge.question}</h3>
            <div className="flex flex-wrap gap-2">
              {challenge.tags.map((tag, index) => (
                <span key={index} className="bg-white/10 text-gray-300 px-2 py-1 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => copyToClipboard(challenge.question)}
              className="p-2 text-blue-300 hover:bg-blue-500/30 rounded-lg transition-colors"
              title="Copy question"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={handleCompleteChallenge}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isCompleted 
                  ? "text-green-300 hover:bg-green-500/30" 
                  : "text-gray-300 hover:bg-white/10"
              )}
              title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isCompleted ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Problem Description */}
        {challenge.explanation && (
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-200 mb-2">Problem Description</h4>
            <p className="text-blue-100">{challenge.explanation}</p>
          </div>
        )}

        {/* Example */}
        {challenge.codeExample && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="font-semibold text-gray-100 mb-2">Example</h4>
            <pre className="text-sm text-gray-300 font-mono">
              <code>{challenge.codeExample}</code>
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {challenge.hints && challenge.hints.length > 0 && (
            <button
              onClick={() => setShowHints(!showHints)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                showHints
                  ? "bg-orange-500/30 text-orange-200 border border-orange-400/30"
                  : "bg-orange-500/20 text-orange-300 border border-orange-400/30 hover:bg-orange-500/30"
              )}
            >
              💡 {showHints ? 'Hide Hints' : `Show Hints (${challenge.hints.length})`}
            </button>
          )}

          <button
            onClick={() => setShowSolution(!showSolution)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
              showSolution
                ? "bg-green-500/30 text-green-200 border border-green-400/30"
                : "bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30"
            )}
          >
            👁️ {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
        </div>

        {/* Hints Section */}
        {showHints && challenge.hints && challenge.hints.length > 0 && (
          <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-4">
            <h4 className="font-semibold text-orange-200 mb-3">💡 Hints</h4>
            <div className="space-y-2">
              {challenge.hints.map((hint, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="bg-orange-500/30 text-orange-200 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-orange-100">{hint}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your Solution Area */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-100">Your Solution</h4>
            <div className="text-sm text-gray-300">
              {userCode.length} characters
            </div>
          </div>
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="Write your solution here..."
            className="w-full h-48 p-3 bg-gray-800/70 border border-white/20 text-gray-200 placeholder-gray-400 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <div className="flex justify-between items-center mt-3">
            <div className="text-xs text-gray-400">
              Tip: Write your approach step by step, then implement the solution
            </div>
            <button
              onClick={() => copyToClipboard(userCode)}
              disabled={!userCode.trim()}
              className="px-3 py-1 text-sm bg-blue-500/30 text-blue-200 rounded hover:bg-blue-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Copy Code
            </button>
          </div>
        </div>

        {/* Solution Section */}
        {showSolution && (
          <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-200 flex items-center gap-2">
                ✅ Optimal Solution
              </h4>
              <button
                onClick={() => copyToClipboard(challenge.solution)}
                className="px-3 py-1 text-sm bg-green-500/30 text-green-200 rounded hover:bg-green-500/40 transition-colors"
              >
                Copy Solution
              </button>
            </div>
            <pre className="bg-gray-800/70 p-4 rounded-lg border border-white/10 overflow-x-auto text-sm">
              <code className="text-gray-200">{challenge.solution}</code>
            </pre>

            {/* Complexity Analysis */}
            {(challenge.timeComplexity || challenge.spaceComplexity) && (
              <div className="mt-4 pt-4 border-t border-green-400/30">
                <h5 className="font-semibold text-green-200 mb-2">Complexity Analysis</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {challenge.timeComplexity && (
                    <div className="bg-white/5 p-3 rounded border border-white/10">
                      <div className="text-sm font-medium text-gray-300">Time Complexity</div>
                      <div className="text-lg font-mono text-green-200">{challenge.timeComplexity}</div>
                    </div>
                  )}
                  {challenge.spaceComplexity && (
                    <div className="bg-white/5 p-3 rounded border border-white/10">
                      <div className="text-sm font-medium text-gray-300">Space Complexity</div>
                      <div className="text-lg font-mono text-green-200">{challenge.spaceComplexity}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}