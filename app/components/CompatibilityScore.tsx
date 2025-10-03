import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

interface CompatibilityScoreProps {
  compatibilityScore: CompatibilityScore;
  className?: string;
}

export default function CompatibilityScore({ compatibilityScore, className }: CompatibilityScoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-500/20', text: 'text-green-200', border: 'border-green-400/30', color: '#10b981' };
    if (score >= 60) return { bg: 'bg-yellow-500/20', text: 'text-yellow-200', border: 'border-yellow-400/30', color: '#f59e0b' };
    return { bg: 'bg-red-500/20', text: 'text-red-200', border: 'border-red-400/30', color: '#ef4444' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Very Good Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    if (score >= 40) return 'Poor Match';
    return 'Very Poor Match';
  };

  // Draw circular progress chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 70;
    const lineWidth = 12;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Progress circle
    const progress = compatibilityScore.overall / 100;
    const startAngle = -Math.PI / 2; // Start from top
    const endAngle = startAngle + (2 * Math.PI * progress);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = getScoreColor(compatibilityScore.overall).color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#f3f4f6';
    ctx.font = 'bold 28px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${compatibilityScore.overall}%`, centerX, centerY - 5);

    ctx.font = '14px system-ui';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Overall', centerX, centerY + 20);
  }, [compatibilityScore.overall]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6">
        <span className="text-2xl font-bold text-gray-100 mb-4">Compatibility Analysis</span>
        
        {/* Overall Score Visualization */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              className="drop-shadow-sm"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={cn("px-3 py-1 rounded-full text-sm font-medium border mt-16", 
                  getScoreColor(compatibilityScore.overall).bg,
                  getScoreColor(compatibilityScore.overall).text,
                  getScoreColor(compatibilityScore.overall).border
                )}>
                  {getScoreLabel(compatibilityScore.overall)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Detailed Breakdown</h3>
        <div className="space-y-4">
          {/* Skills Match */}
          <div className="flex items-center justify-between p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <div>
              <h4 className="font-semibold text-blue-200">Skills Match</h4>
              <p className="text-sm text-blue-300">How well your skills align with job requirements</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-200">{compatibilityScore.skillsMatch}%</div>
              <div className="w-24 bg-blue-400/30 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${compatibilityScore.skillsMatch}%` }}
                />
              </div>
            </div>
          </div>

          {/* Experience Level */}
          <div className="flex items-center justify-between p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
            <div>
              <h4 className="font-semibold text-purple-200">Experience Level</h4>
              <p className="text-sm text-purple-300">Match between your experience and role requirements</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-200">{compatibilityScore.experienceLevel}%</div>
              <div className="w-24 bg-purple-400/30 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${compatibilityScore.experienceLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Technical Stack */}
          <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-lg border border-green-400/30">
            <div>
              <h4 className="font-semibold text-green-200">Technical Stack</h4>
              <p className="text-sm text-green-300">Familiarity with required technologies and tools</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-200">{compatibilityScore.technicalStack}%</div>
              <div className="w-24 bg-green-400/30 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${compatibilityScore.technicalStack}%` }}
                />
              </div>
            </div>
          </div>

          {/* Culture Fit */}
          <div className="flex items-center justify-between p-4 bg-orange-500/20 rounded-lg border border-orange-400/30">
            <div>
              <h4 className="font-semibold text-orange-200">Culture Fit</h4>
              <p className="text-sm text-orange-300">Alignment with company culture and work style</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-200">{compatibilityScore.cultureFit}%</div>
              <div className="w-24 bg-orange-400/30 rounded-full h-2 mt-2">
                <div 
                  className="bg-orange-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${compatibilityScore.cultureFit}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Skills Analysis</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Matched Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-semibold text-green-200">Skills You Have</h4>
            </div>
            <div className="space-y-2">
              {compatibilityScore.breakdown.requiredSkillsMatched.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-500/20 rounded border border-green-400/30">
                  <span className="text-green-400">✓</span>
                  <span className="text-green-200 text-sm">{skill}</span>
                </div>
              ))}
              {compatibilityScore.breakdown.requiredSkillsMatched.length === 0 && (
                <p className="text-gray-400 italic text-sm">No matching skills identified</p>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <h4 className="font-semibold text-red-200">Skills to Develop</h4>
            </div>
            <div className="space-y-2">
              {compatibilityScore.breakdown.missingSkills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-red-500/20 rounded border border-red-400/30">
                  <span className="text-red-400">✗</span>
                  <span className="text-red-200 text-sm">{skill}</span>
                </div>
              ))}
              {compatibilityScore.breakdown.missingSkills.length === 0 && (
                <p className="text-gray-400 italic text-sm">All required skills covered!</p>
              )}
            </div>
          </div>

          {/* Additional Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h4 className="font-semibold text-blue-200">Bonus Skills</h4>
            </div>
            <div className="space-y-2">
              {compatibilityScore.breakdown.additionalSkills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-blue-500/20 rounded border border-blue-400/30">
                  <span className="text-blue-400">+</span>
                  <span className="text-blue-200 text-sm">{skill}</span>
                </div>
              ))}
              {compatibilityScore.breakdown.additionalSkills.length === 0 && (
                <p className="text-gray-400 italic text-sm">No additional skills identified</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Personalized Recommendations
        </h3>
        <div className="space-y-3">
          {compatibilityScore.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-200">{index + 1}</span>
              </div>
              <p className="text-gray-300">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Score Legend */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Score Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-300"><strong className="text-gray-200">80-100%:</strong> Excellent Match</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300"><strong className="text-gray-200">60-79%:</strong> Good Match</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-300"><strong className="text-gray-200">0-59%:</strong> Needs Work</span>
          </div>
        </div>
      </div>
    </div>
  );
}