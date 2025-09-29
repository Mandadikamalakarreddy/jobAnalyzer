import { useState } from "react";
import { cn } from "~/lib/utils";

interface QuestionGeneratorProps {
  analysis: JobAnalysis;
  className?: string;
}

export default function QuestionGenerator({ analysis, className }: QuestionGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'behavioral' | 'technical' | 'coding' | 'systemDesign'>('behavioral');
  const [expandedCoding, setExpandedCoding] = useState<string | null>(null);

  const { interviewQuestions } = analysis.analysis;

  const tabs = [
    { id: 'behavioral', label: 'Behavioral', icon: '🗣️', count: interviewQuestions.behavioral.length },
    { id: 'technical', label: 'Technical', icon: '⚡', count: interviewQuestions.technical.length },
    { id: 'coding', label: 'Coding', icon: '💻', count: interviewQuestions.coding.length },
    { id: 'systemDesign', label: 'System Design', icon: '🏗️', count: interviewQuestions.systemDesign.length },
  ] as const;

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hard: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[difficulty as keyof typeof colors] || colors.medium;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const toggleCodingExpansion = (questionId: string) => {
    setExpandedCoding(expandedCoding === questionId ? null : questionId);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Interview Questions</h2>
        <p className="text-gray-600">
          Tailored questions based on the job requirements for <strong>{analysis.jobTitle}</strong> at <strong>{analysis.company}</strong>
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center justify-center gap-2",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Behavioral Questions */}
          {activeTab === 'behavioral' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🗣️</span>
                <h3 className="text-lg font-semibold text-gray-800">Behavioral Questions</h3>
                <p className="text-sm text-gray-600">- Focus on past experiences and soft skills</p>
              </div>
              {interviewQuestions.behavioral.map((question, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Q{index + 1}
                        </span>
                        <span className="text-blue-600 text-xs">Behavioral</span>
                      </div>
                      <p className="text-gray-800 font-medium">{question}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(question)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {interviewQuestions.behavioral.length === 0 && (
                <p className="text-gray-500 italic text-center py-8">No behavioral questions generated</p>
              )}
            </div>
          )}

          {/* Technical Questions */}
          {activeTab === 'technical' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <h3 className="text-lg font-semibold text-gray-800">Technical Questions</h3>
                <p className="text-sm text-gray-600">- Test domain knowledge and technical concepts</p>
              </div>
              {interviewQuestions.technical.map((question, index) => (
                <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          Q{index + 1}
                        </span>
                        <span className="text-purple-600 text-xs">Technical</span>
                      </div>
                      <p className="text-gray-800 font-medium">{question}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(question)}
                      className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {interviewQuestions.technical.length === 0 && (
                <p className="text-gray-500 italic text-center py-8">No technical questions generated</p>
              )}
            </div>
          )}

          {/* Coding Questions */}
          {activeTab === 'coding' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💻</span>
                <h3 className="text-lg font-semibold text-gray-800">Coding Challenges</h3>
                <p className="text-sm text-gray-600">- Programming problems with solutions and complexity analysis</p>
              </div>
              {interviewQuestions.coding.map((challenge, index) => (
                <div key={challenge.id} className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Challenge {index + 1}
                          </span>
                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getDifficultyColor(challenge.difficulty))}>
                            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                          </span>
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                            {challenge.category}
                          </span>
                        </div>
                        <h4 className="text-gray-800 font-semibold mb-2">{challenge.question}</h4>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {challenge.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(challenge.question + '\n\n' + challenge.solution)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Copy question and solution"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleCodingExpansion(challenge.id)}
                      className="w-full text-left p-3 bg-green-100 hover:bg-green-200 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-green-800">
                        {expandedCoding === challenge.id ? 'Hide' : 'Show'} Solution & Analysis
                      </span>
                      <svg
                        className={cn("w-5 h-5 text-green-600 transition-transform", 
                          expandedCoding === challenge.id ? 'rotate-180' : ''
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {expandedCoding === challenge.id && (
                    <div className="border-t border-green-200 bg-white p-4 space-y-4">
                      {challenge.explanation && (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Explanation</h5>
                          <p className="text-gray-700 text-sm">{challenge.explanation}</p>
                        </div>
                      )}

                      {challenge.hints && challenge.hints.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Hints</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {challenge.hints.map((hint, hintIndex) => (
                              <li key={hintIndex} className="text-gray-700 text-sm">{hint}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Solution</h5>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{challenge.solution}</code>
                        </pre>
                      </div>

                      {challenge.codeExample && (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Example Usage</h5>
                          <pre className="bg-blue-50 p-3 rounded-lg text-sm">
                            <code>{challenge.codeExample}</code>
                          </pre>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {challenge.timeComplexity && (
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <h6 className="font-semibold text-yellow-800 text-sm">Time Complexity</h6>
                            <p className="text-yellow-700 font-mono text-sm">{challenge.timeComplexity}</p>
                          </div>
                        )}
                        {challenge.spaceComplexity && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h6 className="font-semibold text-blue-800 text-sm">Space Complexity</h6>
                            <p className="text-blue-700 font-mono text-sm">{challenge.spaceComplexity}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {interviewQuestions.coding.length === 0 && (
                <p className="text-gray-500 italic text-center py-8">No coding challenges generated</p>
              )}
            </div>
          )}

          {/* System Design Questions */}
          {activeTab === 'systemDesign' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏗️</span>
                <h3 className="text-lg font-semibold text-gray-800">System Design Questions</h3>
                <p className="text-sm text-gray-600">- Architecture and scalability discussions</p>
              </div>
              {interviewQuestions.systemDesign.map((question, index) => (
                <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                          Q{index + 1}
                        </span>
                        <span className="text-orange-600 text-xs">System Design</span>
                      </div>
                      <p className="text-gray-800 font-medium">{question}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(question)}
                      className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {interviewQuestions.systemDesign.length === 0 && (
                <p className="text-gray-500 italic text-center py-8">No system design questions generated</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-2">Preparation Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong>For Behavioral Questions:</strong> Use the STAR method (Situation, Task, Action, Result) to structure your answers.
          </div>
          <div>
            <strong>For Technical Questions:</strong> Explain your thought process and consider edge cases.
          </div>
          <div>
            <strong>For Coding Challenges:</strong> Start with brute force, then optimize. Discuss time/space complexity.
          </div>
          <div>
            <strong>For System Design:</strong> Ask clarifying questions, consider scalability, and discuss trade-offs.
          </div>
        </div>
      </div>
    </div>
  );
}