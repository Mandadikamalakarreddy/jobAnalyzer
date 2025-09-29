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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading interview preparation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Not Found</h2>
            <p className="text-gray-600 mb-6">The job analysis you're looking for doesn't exist.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to={`/job-analysis/${id}`}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
              title="Back to job analysis"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Interview Preparation
              </h1>
              <p className="text-gray-600">
                Get ready for your <strong>{analysis.jobTitle}</strong> interview at <strong>{analysis.company}</strong>
              </p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analysis.analysis.interviewQuestions.behavioral.length}</div>
                <div className="text-sm text-blue-800">Behavioral Questions</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analysis.analysis.interviewQuestions.technical.length}</div>
                <div className="text-sm text-purple-800">Technical Questions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {completedChallenges.length}/{codingChallenges.length}
                </div>
                <div className="text-sm text-green-800">Coding Challenges</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{analysis.analysis.interviewQuestions.systemDesign.length}</div>
                <div className="text-sm text-orange-800">System Design</div>
              </div>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveSection('questions')}
                  className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center justify-center gap-2 ${
                    activeSection === 'questions'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">❓</span>
                  <span>Interview Questions</span>
                </button>
                <button
                  onClick={() => setActiveSection('coding')}
                  className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center justify-center gap-2 ${
                    activeSection === 'coding'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">💻</span>
                  <span>Coding Practice ({codingChallenges.length})</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeSection === 'questions' && (
            <QuestionGenerator analysis={analysis} />
          )}

          {activeSection === 'coding' && (
            <div className="space-y-6">
              {codingChallenges.length > 0 ? (
                <>
                  {/* Challenge Selection */}
                  {codingChallenges.length > 1 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Challenge</h3>
                      <div className="flex flex-wrap gap-2">
                        {codingChallenges.map((challenge, index) => (
                          <button
                            key={challenge.id}
                            onClick={() => setSelectedChallenge(index)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                              selectedChallenge === index
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <span className="text-sm">#{index + 1}</span>
                            <span className="text-sm">{challenge.difficulty}</span>
                            {completedChallenges.includes(challenge.id) && (
                              <span className="text-green-600">✓</span>
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
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="text-6xl mb-4">💻</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Coding Challenges Available</h3>
                  <p className="text-gray-600">
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