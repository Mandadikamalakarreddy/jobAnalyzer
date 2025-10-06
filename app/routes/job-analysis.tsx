import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import JobAnalysis from "~/components/JobAnalysis";
import KeyInsights from "~/components/KeyInsights";
import JobRequirements from "~/components/JobRequirements";
import Navbar from "~/components/Navbar";

export function meta({ params }: any) {
  const jobId = params?.id || "Unknown";
  return [
    { title: `JobAnalyzer | Job Analysis ${jobId}` },
    {
      name: "description",
      content:
        "View comprehensive job analysis with AI-powered insights and interview preparation",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function JobAnalysisPage() {
  const { auth, isLoading, kv } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<
    "analysis" | "insights" | "requirements"
  >("analysis");
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
          console.error("Job analysis not found");
          navigate("/analyze-job");
          return;
        }

        const parsedAnalysis = JSON.parse(analysisData);
        setAnalysis(parsedAnalysis);
      } catch (error) {
        console.error("Error loading job analysis:", error);
        navigate("/analyze-job");
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
      <div className="min-h-screen bg-[#1B1B1B] text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-300">Loading job analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#1B1B1B] text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              Analysis Not Found
            </h2>
            <p className="text-gray-300 mb-6">
              The job analysis you're looking for doesn't exist.
            </p>
            <Link
              to="/analyze-job"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Analyze New Job
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "analysis",
      label: "Job Analysis",
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
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      id: "insights",
      label: "Key Insights",
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      id: "requirements",
      label: "Job Requirements",
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[#1B1B1B] text-white">
      <Navbar />

      <section className="mx-auto w-[95%] max-w-5xl px-6 pt-40 pb-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/analyze-job"
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Back to job analyzer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div className="flex flex-col gap-4">
              <span className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Job Analysis Results
              </span>
              <p className="text-gray-300 leading-relaxed mb-4 text-base">
                Comprehensive analysis for{" "}
                <strong className="text-white font-semibold px-1">
                  {analysis.jobTitle}
                </strong>
                at{" "}
                <strong className="text-white font-semibold px-1">
                  {analysis.company}
                </strong>
              </p>
            </div>
          </div>

          {/* Tab Navigation - New Design */}
          <div className="flex justify-center mb-12 ">
            <div className="relative bg-white/5 border border-white/10 p-2 rounded-full shadow-lg backdrop-blur-md">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_-30px_rgba(59,130,246,0.6)] backdrop-blur-md md:p-8">
          {activeTab === "analysis" && <JobAnalysis analysis={analysis} />}
          {activeTab === "insights" && (
            <KeyInsights analysis={analysis} />
          )}
          {activeTab === "requirements" && (
            <JobRequirements analysis={analysis} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/analyze-job"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Analyze Another Job
          </Link>
          <Link
            to={`/interview-prep/${id}`}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Interview Preparation
          </Link>
        </div>
      </section>
    </main>
  );
}
