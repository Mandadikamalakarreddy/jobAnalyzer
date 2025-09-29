import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { analyzeJobDescription } from "~/lib/ai-analyzer";
import { cn } from "~/lib/utils";
import { usePuterStore } from "~/lib/puter";

interface JobUploaderProps {
  className?: string;
}

export default function JobUploader({ className }: JobUploaderProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [company, setCompany] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [location, setLocation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { kv } = usePuterStore();

  const isFormValid = jobTitle.trim() && jobDescription.trim() && company.trim();

  const handleAnalysis = useCallback(async () => {
    if (!isFormValid || !kv) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const jobData: JobUploadData = {
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
        company: company.trim(),
        jobUrl: jobUrl.trim() || undefined,
        location: location.trim() || undefined,
      };

      // Analyze job description using AI
      const analysis = await analyzeJobDescription(jobData);

      // Store analysis in Puter KV store
      await kv.set(`job_analysis:${analysis.id}`, JSON.stringify(analysis));

      // Navigate to job analysis page
      navigate(`/job-analysis/${analysis.id}`);
    } catch (err) {
      console.error('Error analyzing job description:', err);
      setError('Failed to analyze job description. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobTitle, jobDescription, company, jobUrl, location, kv, navigate, isFormValid]);

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setJobDescription(clipboardText);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  }, []);

  const handleSampleJob = useCallback(() => {
    setJobTitle("Senior Frontend Engineer");
    setCompany("TechCorp Inc.");
    setLocation("Remote");
    setJobDescription(`We are looking for a Senior Frontend Engineer to join our dynamic team. You will be responsible for building scalable, responsive web applications using modern JavaScript frameworks.

Key Responsibilities:
• Develop and maintain frontend applications using React, TypeScript, and modern CSS
• Collaborate with designers and backend engineers to implement user-facing features
• Optimize applications for maximum speed and scalability
• Write clean, maintainable, and well-documented code
• Participate in code reviews and mentor junior developers
• Stay up-to-date with the latest frontend technologies and best practices

Required Skills:
• 5+ years of experience in frontend development
• Proficiency in React, TypeScript, HTML5, CSS3, and JavaScript ES6+
• Experience with state management libraries (Redux, Zustand, or similar)
• Familiarity with build tools (Webpack, Vite) and package managers (npm, yarn)
• Knowledge of RESTful APIs and GraphQL
• Experience with version control systems (Git)
• Strong problem-solving skills and attention to detail

Preferred Qualifications:
• Experience with Next.js or other React frameworks
• Knowledge of testing frameworks (Jest, React Testing Library)
• Familiarity with design systems and component libraries
• Experience with CI/CD pipelines
• Backend development experience is a plus

We offer competitive salary, comprehensive benefits, and a collaborative remote-first work environment.`);
  }, []);

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-6", className)}>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI-Powered Job Analysis
        </h1>
        <p className="text-gray-600">
          Analyze any job posting to get personalized interview questions, skill requirements, and preparation guidance
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handlePasteFromClipboard}
            className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Paste from Clipboard
          </button>
          <button
            onClick={handleSampleJob}
            className="px-4 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Load Sample Job
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
              Job Title *
            </label>
            <input
              id="jobTitle"
              type="text"
              placeholder="e.g., Senior Frontend Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium text-gray-700">
              Company Name *
            </label>
            <input
              id="company"
              type="text"
              placeholder="e.g., Google, Microsoft, Startup Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location (Optional)
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g., Remote, San Francisco, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="jobUrl" className="text-sm font-medium text-gray-700">
              Job URL (Optional)
            </label>
            <input
              id="jobUrl"
              type="url"
              placeholder="https://company.com/jobs/123"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
            Job Description *
          </label>
          <textarea
            id="jobDescription"
            placeholder="Paste the complete job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
          <div className="text-xs text-gray-500">
            Character count: {jobDescription.length}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleAnalysis}
          disabled={!isFormValid || isAnalyzing}
          className={cn(
            "w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200",
            "flex items-center justify-center gap-2",
            isFormValid && !isAnalyzing
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              : "bg-gray-300 cursor-not-allowed"
          )}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing Job Description...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze Job & Generate Questions
            </>
          )}
        </button>

        {!isFormValid && (
          <p className="text-sm text-gray-500 text-center">
            Please fill in the job title, company name, and job description to proceed
          </p>
        )}
      </div>

      {/* Features Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What you'll get:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Skills Analysis</h4>
              <p className="text-sm text-gray-600">Required vs preferred skills breakdown</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Interview Questions</h4>
              <p className="text-sm text-gray-600">Behavioral, technical, and coding challenges</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Compatibility Score</h4>
              <p className="text-sm text-gray-600">Multi-dimensional role matching</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Preparation Plan</h4>
              <p className="text-sm text-gray-600">Personalized study recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}