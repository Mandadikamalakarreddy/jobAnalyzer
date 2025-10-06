import { cn } from "~/lib/utils";

interface JobRequirementsProps {
  analysis: JobAnalysis;
  className?: string;
}

export default function JobRequirements({ analysis, className }: JobRequirementsProps) {
  const {
    requiredSkills,
    preferredSkills,
    experienceLevel,
    technicalStack,
    roleType,
    keyResponsibilities,
  } = analysis.analysis;

  const getExperienceLevelInfo = (level: string) => {
    const info = {
      entry: {
        years: '0-2 years',
        description: 'Early career professional with foundational knowledge',
        color: 'green',
      },
      mid: {
        years: '2-5 years',
        description: 'Experienced professional with proven track record',
        color: 'blue',
      },
      senior: {
        years: '5-8 years',
        description: 'Senior professional with deep expertise',
        color: 'purple',
      },
      lead: {
        years: '8+ years',
        description: 'Leadership role with extensive experience',
        color: 'orange',
      },
    };
    return info[level as keyof typeof info] || info.mid;
  };

  const roleTypeInfo = getExperienceLevelInfo(experienceLevel);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Job Requirements</h2>
        <p className="text-gray-300">
          Detailed requirements for the <strong className="text-white">{analysis.jobTitle}</strong> position
        </p>
      </div>

      {/* Experience Level & Role Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Experience Level */}
        <div className={`bg-${roleTypeInfo.color}-500/10 border border-${roleTypeInfo.color}-400/30 rounded-xl p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <svg className={`w-6 h-6 text-${roleTypeInfo.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className={`text-lg font-semibold text-${roleTypeInfo.color}-200`}>Experience Level</h3>
          </div>
          <div className="space-y-2">
            <div className={`text-3xl font-bold text-${roleTypeInfo.color}-200 capitalize`}>
              {experienceLevel}
            </div>
            <div className={`text-${roleTypeInfo.color}-300`}>{roleTypeInfo.years}</div>
            <p className="text-gray-300 text-sm mt-2">{roleTypeInfo.description}</p>
          </div>
        </div>

        {/* Role Type */}
        <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-indigo-200">Role Type</h3>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-indigo-200 capitalize">
              {roleType}
            </div>
            <p className="text-gray-300 text-sm mt-2">
              {roleType === 'frontend' && 'Focuses on user interface and client-side development'}
              {roleType === 'backend' && 'Focuses on server-side logic and databases'}
              {roleType === 'fullstack' && 'Works across both frontend and backend'}
              {roleType === 'devops' && 'Focuses on infrastructure and deployment automation'}
              {roleType === 'data' && 'Focuses on data processing and analytics'}
              {roleType === 'mobile' && 'Focuses on mobile application development'}
              {roleType === 'other' && 'Specialized role with unique requirements'}
            </p>
          </div>
        </div>
      </div>

      {/* Required Skills */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-100">Required Skills</h3>
          <span className="ml-auto bg-red-500/20 text-red-200 px-3 py-1 rounded-full text-sm border border-red-400/30">
            Must Have
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-4">These skills are essential for this role</p>
        <div className="flex flex-wrap gap-3">
          {requiredSkills.map((skill, index) => (
            <div
              key={index}
              className="group relative bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-3 transition-all cursor-default"
            >
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-lg">★</span>
                <span className="text-red-200 font-medium">{skill}</span>
              </div>
            </div>
          ))}
        </div>
        {requiredSkills.length === 0 && (
          <p className="text-gray-400 italic text-center py-4">No specific skills listed</p>
        )}
      </div>

      {/* Preferred Skills */}
      {preferredSkills && preferredSkills.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-100">Preferred Skills</h3>
            <span className="ml-auto bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-sm border border-yellow-400/30">
              Nice to Have
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-4">These skills will make you stand out</p>
          <div className="flex flex-wrap gap-3">
            {preferredSkills.map((skill, index) => (
              <div
                key={index}
                className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-4 py-3 transition-all cursor-default"
              >
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">☆</span>
                  <span className="text-yellow-200 font-medium">{skill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Stack */}
      {technicalStack && technicalStack.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-100">Technical Stack</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">Technologies and tools used in this role</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {technicalStack.map((tech, index) => (
              <div
                key={index}
                className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg px-4 py-3 text-center hover:bg-cyan-500/20 transition-all cursor-default"
              >
                <span className="text-cyan-200 font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Responsibilities */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-100">Key Responsibilities</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">What you'll be doing in this role</p>
        <div className="space-y-3">
          {keyResponsibilities.map((responsibility, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-lg hover:bg-emerald-500/20 transition-all"
            >
              <div className="w-6 h-6 bg-emerald-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-emerald-200">{index + 1}</span>
              </div>
              <p className="text-gray-300 flex-1">{responsibility}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Self-Assessment CTA */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-100 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ready to Apply?
            </h3>
            <p className="text-gray-300 text-sm">
              Review these requirements carefully and ensure you can speak to each skill and responsibility in your application and interview.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-white/5 rounded-lg px-4 py-2 text-sm text-gray-300 text-center">
              <div className="font-semibold text-gray-100">
                {requiredSkills.length + (preferredSkills?.length || 0)}
              </div>
              <div className="text-xs">Total Skills</div>
            </div>
            <div className="bg-white/5 rounded-lg px-4 py-2 text-sm text-gray-300 text-center">
              <div className="font-semibold text-gray-100">
                {keyResponsibilities.length}
              </div>
              <div className="text-xs">Responsibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preparation Tips */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-100">How to Prepare</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
            <h4 className="font-semibold text-purple-200 mb-2">For Required Skills</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Be ready to demonstrate proficiency</li>
              <li>Prepare specific examples of usage</li>
              <li>Review recent updates and best practices</li>
            </ul>
          </div>
          <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
            <h4 className="font-semibold text-purple-200 mb-2">For Responsibilities</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Match them to your past experiences</li>
              <li>Prepare STAR method examples</li>
              <li>Think about potential challenges</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
