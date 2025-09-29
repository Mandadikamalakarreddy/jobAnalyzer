import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta() {
  return [
    { title: "JobAnalyzer | AI-Powered Job Analysis Platform" },
    { name: "description", content: "Analyze job descriptions, generate interview questions, and prepare for your dream job with AI-powered insights" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<JobAnalysis[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth/?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadAnalyses = async () => {
      if (!kv) return;
      
      setLoadingAnalyses(true);
      try {
        const analysisItems = (await kv.list("job_analysis:*", true)) as KVItem[];
        const parsedAnalyses = analysisItems?.map(
          (item) => JSON.parse(item.value) as JobAnalysis
        );
        
        // Sort by analysis date (most recent first)
        const sortedAnalyses = parsedAnalyses?.sort((a, b) => 
          new Date(b.analysisDate || 0).getTime() - new Date(a.analysisDate || 0).getTime()
        );
        
        setAnalyses(sortedAnalyses || []);
      } catch (error) {
        console.error('Error loading analyses:', error);
        setAnalyses([]);
      } finally {
        setLoadingAnalyses(false);
      }
    };

    if (auth.isAuthenticated && kv) {
      loadAnalyses();
    }
  }, [auth.isAuthenticated, kv]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            AI-Powered Job Analysis Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Analyze job descriptions, generate personalized interview questions, practice coding challenges, 
            and get compatibility scores to land your dream job.
          </p>
          <Link 
            to="/analyze-job" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Analyze Your First Job 🚀
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Job Analysis</h3>
            <p className="text-gray-600">Extract skills, responsibilities, and requirements from any job posting</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">❓</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Interview Questions</h3>
            <p className="text-gray-600">Generate behavioral, technical, and system design questions</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Coding Challenges</h3>
            <p className="text-gray-600">Practice with role-specific coding problems and solutions</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Compatibility Score</h3>
            <p className="text-gray-600">Get detailed breakdown of your match with the role</p>
          </div>
        </div>

        {/* Recent Analyses Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Your Recent Analyses</h2>
            {analyses.length > 0 && (
              <Link 
                to="/analyze-job"
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
              >
                <span>Analyze New Job</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Link>
            )}
          </div>

          {loadingAnalyses && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-600">Loading your analyses...</p>
            </div>
          )}

          {!loadingAnalyses && analyses.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Start Your Job Analysis?</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Paste any job description and get instant insights, interview questions, and preparation materials.
              </p>
              <Link 
                to="/analyze-job"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Started Now
              </Link>
            </div>
          )}

          {!loadingAnalyses && analyses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.slice(0, 6).map((analysis) => (
                <div key={analysis.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                        {analysis.jobTitle}
                      </h3>
                      <p className="text-sm text-gray-600">{analysis.company}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-green-600">●</span>
                      <span className="text-gray-500">Analyzed</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Skills Found:</span>
                      <span className="font-semibold">{analysis.analysis.requiredSkills.length + analysis.analysis.preferredSkills.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Questions Generated:</span>
                      <span className="font-semibold">
                        {analysis.analysis.interviewQuestions.behavioral.length + 
                         analysis.analysis.interviewQuestions.technical.length + 
                         analysis.analysis.interviewQuestions.coding.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Experience Level:</span>
                      <span className="font-semibold capitalize">{analysis.analysis.experienceLevel}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      to={`/job-analysis/${analysis.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center transition-colors"
                    >
                      View Analysis
                    </Link>
                    <Link 
                      to={`/interview-prep/${analysis.id}`}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center transition-colors"
                    >
                      Practice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Paste Job Description</h3>
              <p className="text-gray-600">Simply copy and paste any job posting from LinkedIn, Indeed, or company websites</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Analysis</h3>
              <p className="text-gray-600">Our AI extracts key skills, generates questions, and creates personalized challenges</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Prepare & Practice</h3>
              <p className="text-gray-600">Practice with tailored questions, coding challenges, and get your compatibility score</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
