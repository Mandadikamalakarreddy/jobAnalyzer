import { cn } from "~/lib/utils";

interface KeyInsightsProps {
  analysis: JobAnalysis;
  className?: string;
}

export default function KeyInsights({ analysis, className }: KeyInsightsProps) {
  const { 
    requiredSkills, 
    preferredSkills, 
    experienceLevel, 
    keyResponsibilities,
    companyInfo,
    compatibilityScore 
  } = analysis.analysis;

  const missingSkills = compatibilityScore.breakdown.missingSkills || [];
  const matchedSkills = compatibilityScore.breakdown.requiredSkillsMatched || [];
  const additionalSkills = compatibilityScore.breakdown.additionalSkills || [];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Key Insights & Preparation</h2>
        <p className="text-gray-300">
          Strategic insights to help you prepare for the <strong className="text-white">{analysis.jobTitle}</strong> position
        </p>
      </div>

      {/* Skills Gap Analysis */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-100">Skills Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Matched Skills */}
          <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✅</span>
              <h4 className="font-semibold text-green-200">Your Strengths</h4>
            </div>
            <p className="text-sm text-gray-300 mb-3">Skills you already have:</p>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-sm border border-green-400/30"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">Analyzing...</p>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📚</span>
              <h4 className="font-semibold text-orange-200">Skills to Learn</h4>
            </div>
            <p className="text-sm text-gray-300 mb-3">Focus your preparation here:</p>
            <div className="flex flex-wrap gap-2">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-orange-500/20 text-orange-200 px-3 py-1 rounded-full text-sm border border-orange-400/30"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-green-400">Great! You have all required skills</p>
              )}
            </div>
          </div>

          {/* Additional Skills */}
          <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⭐</span>
              <h4 className="font-semibold text-purple-200">Bonus Points</h4>
            </div>
            <p className="text-sm text-gray-300 mb-3">Skills that give you an edge:</p>
            <div className="flex flex-wrap gap-2">
              {additionalSkills.length > 0 ? (
                additionalSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-400/30"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">Focus on required skills first</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Roadmap */}
      {missingSkills.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-100">Recommended Learning Path</h3>
          </div>

          <div className="space-y-3">
            {missingSkills.slice(0, 3).map((skill, index) => (
              <div key={index} className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                    Step {index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-200 mb-2">Learn {skill}</h4>
                    <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                      <li>Start with official documentation and tutorials</li>
                      <li>Build a small project to practice</li>
                      <li>Prepare to discuss your learning experience in the interview</li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Culture Insights */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-100">Company Culture</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-200 mb-2">Company Size</h4>
            <p className="text-gray-300">{companyInfo.size}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-200 mb-2">Industry</h4>
            <p className="text-gray-300">{companyInfo.industry}</p>
          </div>
        </div>

        {companyInfo.culture && companyInfo.culture.length > 0 && (
          <div className="mt-4 bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-200 mb-3">Cultural Values</h4>
            <div className="flex flex-wrap gap-2">
              {companyInfo.culture.map((value, index) => (
                <span
                  key={index}
                  className="bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-sm border border-emerald-400/30"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Talking Points */}
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-100">Key Talking Points</h3>
        </div>

        <div className="space-y-3">
          <div className="bg-pink-500/10 border border-pink-400/30 rounded-lg p-4">
            <h4 className="font-semibold text-pink-200 mb-2">Experience Level Required</h4>
            <p className="text-gray-300 capitalize">
              {experienceLevel} level position - Emphasize your {experienceLevel === 'entry' ? 'eagerness to learn and foundational skills' : experienceLevel === 'mid' ? 'proven track record and growing expertise' : 'leadership experience and deep technical knowledge'}
            </p>
          </div>

          <div className="bg-pink-500/10 border border-pink-400/30 rounded-lg p-4">
            <h4 className="font-semibold text-pink-200 mb-2">Top Responsibilities to Discuss</h4>
            <ul className="text-gray-300 space-y-2">
              {keyResponsibilities.slice(0, 3).map((responsibility, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">→</span>
                  <span>{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-pink-500/10 border border-pink-400/30 rounded-lg p-4">
            <h4 className="font-semibold text-pink-200 mb-2">Questions to Ask the Interviewer</h4>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">→</span>
                <span>What does success look like in this role within the first 6 months?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">→</span>
                <span>How does the team approach {requiredSkills[0] || 'technical challenges'}?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">→</span>
                <span>What opportunities for growth and learning are available?</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Preparation Checklist */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-100">Interview Preparation Checklist</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400 text-lg">✓</span>
            <span>Review the job description and requirements thoroughly</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400 text-lg">✓</span>
            <span>Research the company culture and recent news</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400 text-lg">✓</span>
            <span>Prepare STAR method examples for behavioral questions</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400 text-lg">✓</span>
            <span>Practice coding challenges relevant to the role</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400 text-lg">✓</span>
            <span>Review your resume and be ready to discuss each point</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400 text-lg">✓</span>
            <span>Prepare thoughtful questions to ask the interviewer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
