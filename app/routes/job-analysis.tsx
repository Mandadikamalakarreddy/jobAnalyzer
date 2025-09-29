import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import JobAnalysis from "~/components/JobAnalysis";
import QuestionGenerator from "~/components/QuestionGenerator";
import CompatibilityScore from "~/components/CompatibilityScore";
import Navbar from "~/components/Navbar";

export function meta({ params }: any) {
  const jobId = params?.id || "Unknown";
  return [
    { title: `JobAnalyzer | Job Analysis ${jobId}` },
    {
      name: "description",
      content: "View comprehensive job analysis with AI-powered insights and interview preparation",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function JobAnalysisPage() {
  const { auth, isLoading, kv } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'questions' | 'compatibility'>('analysis');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth/?next=/job-analysis/${id}`);
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

  if (isLoading || isLoadingAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading job analysis...</p>
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

  const tabs = [
    { id: 'analysis', label: 'Job Analysis', icon: '📋' },
    { id: 'questions', label: 'Interview Questions', icon: '❓' },
    { id: 'compatibility', label: 'Compatibility Score', icon: '📊' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/analyze-job"
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
              title="Back to job analyzer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Job Analysis Results
              </h1>
              <p className="text-gray-600">
                Comprehensive analysis for <strong>{analysis.jobTitle}</strong> at <strong>{analysis.company}</strong>
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'analysis' && <JobAnalysis analysis={analysis} />}
          {activeTab === 'questions' && <QuestionGenerator analysis={analysis} />}
          {activeTab === 'compatibility' && <CompatibilityScore compatibilityScore={analysis.analysis.compatibilityScore} />}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/analyze-job"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Analyze Another Job
          </Link>
          <Link
            to={`/interview-prep/${id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Interview Preparation
          </Link>
        </div>
      </main>
    </div>
  );
}