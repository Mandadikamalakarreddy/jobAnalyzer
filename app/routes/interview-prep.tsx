import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import QuestionGenerator from "~/components/QuestionGenerator";
import CodingChallenge from "~/components/CodingChallenge";
import Navbar from "~/components/Navbar";

export function meta({ params }: any) {
  const jobId = params?.id || "Unknown";
  return [
    { title: `JobAnalyzer | Interview Prep ${jobId}` },
    {
      name: "description",
      content: "Comprehensive interview preparation with practice questions and coding challenges",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function InterviewPrep() {
  const { auth, isLoading, kv } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [activeSection, setActiveSection] = useState<'questions' | 'coding'>('questions');
  const [selectedChallenge, setSelectedChallenge] = useState<number>(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth/?next=/interview-prep/${id}`);
    }
  }, [isLoading, auth.isAuthenticated, navigate, id]);

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!kv || !id) return;

      try {
        setIsLoadingAnalysis(true);
        const analysisData = await kv.get(`job_analysis:${id}`);

        if (!analysisData) {
          console.error('Job analysis not found');
          navigate('/analyze-job');
          return;
        }

        const parsedAnalysis = JSON.parse(analysisData);
        setAnalysis(parsedAnalysis);
      } catch (error) {
        console.error('Error loading job analysis:', error);
        navigate('/analyze-job');
      } finally {
        setIsLoadingAnalysis(false);
      }
    };

    if (kv && id) {
      loadAnalysis();
    }
  }, [kv, id, navigate]);

  const handleChallengeComplete = (challengeId: string, completed: boolean) => {
    setCompletedChallenges(prev => {
      if (completed) {
        return [...prev.filter(id => id !== challengeId), challengeId];
      } else {
        return prev.filter(id => id !== challengeId);
      }
    });
  };

  if (isLoading || isLoadingAnalysis) {
    return (
      <div className="min-h-screen bg-[#1B1B1B]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-300">Loading interview preparation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#1B1B1B]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Analysis Not Found</h2>
            <p className="text-gray-300 mb-6">The job analysis you're looking for doesn't exist.</p>
            <Link
              to="/analyze-job"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Analyze New Job
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const codingChallenges = analysis.analysis.interviewQuestions.coding || [];

  const tabs = [
    {
      id: "questions" as const,
      label: "Interview Questions",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "coding" as const,
      label: "Coding Practice",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#1B1B1B]">
      <Navbar />
      <main className="mx-auto w-[95%] max-w-6xl px-6 pb-20">
        {/* Header */}
        <div className="mb-8 pt-20">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to={`/job-analysis/${id}`}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Back to job analysis"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex flex-col gap-4">
              <span className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Interview Preparation
              </span>
              <p className="text-gray-300 leading-relaxed mb-4 text-base">
                Get ready for your <strong className="text-white font-semibold px-1">{analysis.jobTitle}</strong> interview at <strong className="text-white font-semibold px-1">{analysis.company}</strong>
              </p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Your Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-200">{analysis.analysis.interviewQuestions.behavioral.length}</div>
                <div className="text-sm text-blue-300">Behavioral Questions</div>
              </div>
              <div className="text-center p-4 bg-purple-500/20 border border-purple-400/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-200">{analysis.analysis.interviewQuestions.technical.length}</div>
                <div className="text-sm text-purple-300">Technical Questions</div>
              </div>
              <div className="text-center p-4 bg-green-500/20 border border-green-400/30 rounded-lg">
                <div className="text-2xl font-bold text-green-200">
                  {completedChallenges.length}/{codingChallenges.length}
                </div>
                <div className="text-sm text-green-300">Coding Challenges</div>
              </div>
              <div className="text-center p-4 bg-orange-500/20 border border-orange-400/30 rounded-lg">
                <div className="text-2xl font-bold text-orange-200">{analysis.analysis.interviewQuestions.systemDesign.length}</div>
                <div className="text-sm text-orange-300">System Design</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation - New Design */}
          <div className="flex justify-center mb-12">
            <div className="relative bg-white/5 border border-white/10 rounded-full shadow-lg backdrop-blur-md p-2">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                      activeSection === tab.id
                        ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {tab.icon}
                      <span>{tab.label} {tab.id === 'coding' ? `(${codingChallenges.length})` : ''}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_-30px_rgba(59,130,246,0.6)] backdrop-blur-md md:p-8">
          {activeSection === 'questions' && (
            <QuestionGenerator analysis={analysis} />
          )}

          {activeSection === 'coding' && (
            <div className="space-y-6">
              {codingChallenges.length > 0 ? (
                <>
                  {/* Challenge Selection */}
                  {codingChallenges.length > 1 && (
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-100 mb-4">Select Challenge</h3>
                      <div className="flex flex-wrap gap-2">
                        {codingChallenges.map((challenge, index) => (
                          <button
                            key={challenge.id}
                            onClick={() => setSelectedChallenge(index)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                              selectedChallenge === index
                                ? 'bg-blue-500/30 text-blue-200 border border-blue-400/30'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                            }`}
                          >
                            <span className="text-sm">#{index + 1}</span>
                            <span className="text-sm">{challenge.difficulty}</span>
                            {completedChallenges.includes(challenge.id) && (
                              <span className="text-green-400">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected Challenge */}
                  <CodingChallenge
                    challenge={codingChallenges[selectedChallenge]}
                    onComplete={(completed) => 
                      handleChallengeComplete(codingChallenges[selectedChallenge].id, completed)
                    }
                  />
                </>
              ) : (
                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">💻</div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">No Coding Challenges Available</h3>
                  <p className="text-gray-300">
                    Coding challenges will be generated based on the job requirements.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to={`/job-analysis/${id}`}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Analysis
          </Link>
          <Link
            to="/analyze-job"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Analyze Another Job
          </Link>
        </div>
      </main>
    </div>
  );
}