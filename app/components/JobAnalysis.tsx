import { cn } from "~/lib/utils";

interface JobAnalysisProps {
  analysis: JobAnalysis;
  className?: string;
}

export default function JobAnalysis({ analysis, className }: JobAnalysisProps) {
  const { analysis: jobAnalysis } = analysis;

  const getRoleTypeIcon = (roleType: string) => {
    const icons = {
      frontend: "🎨",
      backend: "⚙️",
      fullstack: "🔄",
      devops: "🔧",
      data: "📊",
      mobile: "📱",
      other: "💻"
    };
    return icons[roleType as keyof typeof icons] || icons.other;
  };

  const getExperienceLevelColor = (level: string) => {
    const colors = {
      entry: "bg-green-500/20 text-green-200 border-green-400/30",
      mid: "bg-blue-500/20 text-blue-200 border-blue-400/30",
      senior: "bg-purple-500/20 text-purple-200 border-purple-400/30",
      lead: "bg-red-500/20 text-red-200 border-red-400/30"
    };
    return colors[level as keyof typeof colors] || colors.mid;
  };

  const formatExperienceLevel = (level: string) => {
    const labels = {
      entry: "Entry Level",
      mid: "Mid Level",
      senior: "Senior Level",
      lead: "Lead/Principal"
    };
    return labels[level as keyof typeof labels] || level;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-100">{analysis.jobTitle}</span>
            <p className="text-lg text-gray-300">{analysis.company}</p>
            <p className="text-sm text-gray-400">
              Analyzed on {new Date(analysis.analysisDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn("px-3 py-1 rounded-full border text-sm font-medium", getExperienceLevelColor(jobAnalysis.experienceLevel))}>
              {formatExperienceLevel(jobAnalysis.experienceLevel)}
            </div>
            <div className="text-2xl">{getRoleTypeIcon(jobAnalysis.roleType)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-200">{jobAnalysis.requiredSkills.length}</div>
            <div className="text-sm text-blue-300">Required Skills</div>
          </div>
          <div className="text-center p-4 bg-emerald-500/20 border border-emerald-400/30 rounded-lg">
            <div className="text-2xl font-bold text-emerald-200">{jobAnalysis.preferredSkills.length}</div>
            <div className="text-sm text-emerald-300">Preferred Skills</div>
          </div>
          <div className="text-center p-4 bg-purple-500/20 border border-purple-400/30 rounded-lg">
            <div className="text-2xl font-bold text-purple-200">{jobAnalysis.technicalStack.length}</div>
            <div className="text-sm text-purple-300">Tech Stack Items</div>
          </div>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Required Skills */}
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Required Skills
          </h3>
          <div className="space-y-2">
            {jobAnalysis.requiredSkills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                <span className="font-medium text-red-200">{skill}</span>
                <span className="text-xs text-red-300 bg-red-500/30 px-2 py-1 rounded-full">Required</span>
              </div>
            ))}
            {jobAnalysis.requiredSkills.length === 0 && (
              <p className="text-gray-400 italic">No specific required skills identified</p>
            )}
          </div>
        </div>

        {/* Preferred Skills */}
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Preferred Skills
          </h3>
          <div className="space-y-2">
            {jobAnalysis.preferredSkills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-lg">
                <span className="font-medium text-emerald-200">{skill}</span>
                <span className="text-xs text-emerald-300 bg-emerald-500/30 px-2 py-1 rounded-full">Nice to have</span>
              </div>
            ))}
            {jobAnalysis.preferredSkills.length === 0 && (
              <p className="text-gray-400 italic">No specific preferred skills identified</p>
            )}
          </div>
        </div>
      </div>

      {/* Technical Stack */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Technical Stack & Architecture
        </h3>
        <div className="flex flex-wrap gap-2">
          {jobAnalysis.technicalStack.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium border border-blue-400/30"
            >
              {tech}
            </span>
          ))}
          {jobAnalysis.technicalStack.length === 0 && (
            <p className="text-gray-400 italic">No specific technical stack identified</p>
          )}
        </div>
      </div>

      {/* Key Responsibilities */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Key Responsibilities
        </h3>
        <div className="space-y-2">
          {jobAnalysis.keyResponsibilities.map((responsibility, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="w-6 h-6 bg-purple-500/20 border border-purple-400/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-purple-300">{index + 1}</span>
              </div>
              <span className="text-gray-300">{responsibility}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Company Information */}
      {jobAnalysis.companyInfo && (
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Company Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jobAnalysis.companyInfo.size && (
              <div className="text-center p-4 bg-orange-500/20 border border-orange-400/30 rounded-lg">
                <div className="font-semibold text-orange-200 capitalize">{jobAnalysis.companyInfo.size}</div>
                <div className="text-sm text-orange-300">Company Size</div>
              </div>
            )}
            {jobAnalysis.companyInfo.industry && (
              <div className="text-center p-4 bg-orange-500/20 border border-orange-400/30 rounded-lg">
                <div className="font-semibold text-orange-200">{jobAnalysis.companyInfo.industry}</div>
                <div className="text-sm text-orange-300">Industry</div>
              </div>
            )}
            {jobAnalysis.companyInfo.culture && jobAnalysis.companyInfo.culture.length > 0 && (
              <div className="p-4 bg-orange-500/20 border border-orange-400/30 rounded-lg">
                <div className="font-semibold text-orange-200 text-center mb-2">Culture</div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {jobAnalysis.companyInfo.culture.map((trait, index) => (
                    <span key={index} className="text-xs bg-orange-500/30 text-orange-200 px-2 py-1 rounded-full">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Role Type Information */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <span className="text-2xl">{getRoleTypeIcon(jobAnalysis.roleType)}</span>
          Role Type: {jobAnalysis.roleType.charAt(0).toUpperCase() + jobAnalysis.roleType.slice(1)}
        </h3>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <p className="text-gray-300">
            This position is classified as a <strong className="text-white">{jobAnalysis.roleType}</strong> role at the{" "}
            <strong className="text-white">{formatExperienceLevel(jobAnalysis.experienceLevel).toLowerCase()}</strong> level.
          </p>
        </div>
      </div>
    </div>
  );
}