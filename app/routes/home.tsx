import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Target, MessageSquare, Code, BarChart3, Sparkles } from "lucide-react";


export function meta() {
  return [
    { title: "JobAnalyzer | AI-Powered Job Analysis Platform" },
    { name: "description", content: "Analyze job descriptions, generate interview questions, and prepare for your dream job with AI-powered insights" },
  ];
}

const AnimatedText = ({ words, delay = 0 }: { words: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState(words); // Start with full text for SSR
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return; // Skip animation on server
    
    setDisplayedText(""); // Reset for animation
    const timer = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= words.length) {
          setDisplayedText(words.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [words, delay, isClient]);
  
  return <>{displayedText}</>;
};
export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<JobAnalysis[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth/?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadAnalyses = async () => {
      if (!kv) return;
      
      setLoadingAnalyses(true);
      try {
        console.log('Loading analyses from KV store...');
        const analysisItems = (await kv.list("job_analysis:*", true)) as KVItem[];
        console.log('Raw analysis items from KV:', analysisItems);
        console.log('Analysis items type:', typeof analysisItems, 'Array?', Array.isArray(analysisItems));
        console.log('Analysis items length:', analysisItems?.length);
        
        if (!analysisItems || !Array.isArray(analysisItems)) {
          console.log('No analysis items or not an array, trying alternative approach...');
          // Try getting keys first, then values
          const keys = await kv.list("job_analysis:*");
          console.log('Keys found:', keys);
          
          if (keys && Array.isArray(keys)) {
            const analysisItemsAlt: KVItem[] = [];
            for (const key of keys) {
              if (typeof key === 'string') {
                const value = await kv.get(key);
                console.log(`Key: ${key}, Value length: ${value?.length}, Value preview: ${value?.substring(0, 100)}`);
                if (value && value.trim()) {
                  analysisItemsAlt.push({ key, value });
                }
              }
            }
            console.log('Alternative analysis items:', analysisItemsAlt);
            
            const parsedAnalyses = analysisItemsAlt.reduce((acc, item) => {
              try {
                if (item.value && item.value.trim()) {
                  const parsed = JSON.parse(item.value) as JobAnalysis;
                  acc.push(parsed);
                } else {
                  console.warn('Empty or invalid value for key:', item.key);
                }
              } catch (error) {
                console.error('Failed to parse JSON for key:', item.key, 'Error:', error, 'Value:', item.value);
              }
              return acc;
            }, [] as JobAnalysis[]);
            
            // Sort by analysis date (most recent first)
            const sortedAnalyses = parsedAnalyses.sort((a, b) => 
              new Date(b.analysisDate || 0).getTime() - new Date(a.analysisDate || 0).getTime()
            );
            
            console.log('Final analyses to display:', sortedAnalyses);
            setAnalyses(sortedAnalyses || []);
            return;
          }
        }
        
        const parsedAnalyses = analysisItems?.reduce((acc, item) => {
          try {
            console.log('Parsing item:', item);
            if (item.value && item.value.trim()) {
              const parsed = JSON.parse(item.value) as JobAnalysis;
              acc.push(parsed);
            } else {
              console.warn('Empty or invalid value for key:', item.key);
            }
          } catch (error) {
            console.error('Failed to parse JSON for key:', item.key, 'Error:', error, 'Value:', item.value);
          }
          return acc;
        }, [] as JobAnalysis[]);
        
        console.log('Parsed analyses:', parsedAnalyses);
        
        // Sort by analysis date (most recent first)
        const sortedAnalyses = parsedAnalyses?.sort((a, b) => 
          new Date(b.analysisDate || 0).getTime() - new Date(a.analysisDate || 0).getTime()
        );
        
        console.log('Final sorted analyses:', sortedAnalyses);
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
    <main className="min-h-screen bg-[#1B1B1B] text-white">
      <Navbar />
      
      {/* Hero Section */}
     <section className="relative mx-auto w-[95%] max-w-6xl px-6 pt-40 pb-20">
        <div className="absolute inset-0 -z-10 rounded-3xl bg-[#121212]" />
        
        <div 
          className={`inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="text-sm font-medium">
            <Sparkles className="w-4 h-4 inline-block mr-2 text-blue-400" />
            AI-Powered Job Analysis Platform
          </span>
        </div>
        
        <div className="max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-normal mb-4 tracking-tight text-left">
            <span className="text-gray-100">
              <AnimatedText words="Analyze jobs with" delay={0.2} />
            </span>
            <br />
            <span className="text-white font-medium">
              <AnimatedText words="AI-powered insights" delay={0.5} />
            </span>
          </h1>
          
          <p className={`text-lg md:text-xl text-gray-300 mb-8 max-w-6xl text-left transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Generate personalized interview questions, practice coding challenges, and get compatibility scores.{" "}
            <span className="text-white">Land your dream job faster.</span>
          </p>
           <Link 
              to="/analyze-job" >
          <div className={`flex flex-col sm:flex-row gap-4 items-start transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/20 cursor-pointer">
              Start Analyzing Now
            </button>
          </div>
          </Link>
        </div>

        {/* Dashboard Preview */}
        <div className={`relative mx-auto w-full mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden p-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="h-24 bg-white/5 rounded-lg"></div>
                  <div className="h-24 bg-white/5 rounded-lg"></div>
                  <div className="h-24 bg-white/5 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto w-[95%] max-w-6xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 !text-gray-300">
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">succeed</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Comprehensive tools to analyze jobs, prepare for interviews, and stand out from the competition
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: Target, title: "Job Analysis", desc: "Extract skills and requirements instantly", color: "blue" },
            { icon: MessageSquare, title: "Interview Questions", desc: "Behavioral and technical prep", color: "purple" },
            { icon: Code, title: "Coding Challenges", desc: "Role-specific practice problems", color: "green" },
            { icon: BarChart3, title: "Compatibility Score", desc: "Know your match percentage", color: "orange" }
          ].map((feature, i) => (
            <div key={i} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className={`w-12 h-12 bg-${feature.color}-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${feature.color}-500/20 transition-colors`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Analyses */}
      {analyses.length > 0 && (
        <section className="mx-auto w-[95%] max-w-6xl px-6 py-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Your Recent Analyses</h2>
            <Link to="/analyze-job">
              <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors cursor-pointer">
                Add More Jobs <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                      {analysis.jobTitle}
                    </h3>
                    <p className="text-sm text-gray-400">{analysis.company}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-green-400">●</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Skills Found:</span>
                    <span className="font-semibold">{analysis.analysis.requiredSkills.length + analysis.analysis.preferredSkills.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Questions:</span>
                    <span className="font-semibold">
                      {analysis.analysis.interviewQuestions.behavioral.length + 
                       analysis.analysis.interviewQuestions.technical.length + 
                       analysis.analysis.interviewQuestions.coding.length}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link to={`/job-analysis/${analysis.id}`}>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                      View
                    </button>
                  </Link>
                  <Link to={`/interview-prep/${analysis.id}`}>
                    <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                      Practice
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto w-[95%] max-w-6xl px-6 py-20">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 !text-gray-300">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { num: "1", title: "Paste Job Description", desc: "Copy from LinkedIn, Indeed, or any job board" },
            { num: "2", title: "AI Analysis", desc: "Extract skills, generate questions, create challenges" },
            { num: "3", title: "Prepare & Practice", desc: "Practice with tailored content and ace your interview" }
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">{step.num}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-300">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto w-[95%] max-w-3xl px-6 py-20">
        <div className="bg-[#1F1F1F] backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 !text-gray-300">
            Ready to land your dream job?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have already discovered the power of AI-driven preparation.
          </p>
          <Link to="/analyze-job" >
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/20 inline-flex items-center gap-2 cursor-pointer">
            Start Analyzing Now
            <ArrowRight className="w-5 h-5" />
          </button>
          </Link>
        </div>
      </section>
       <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-300 text-sm">
          <p>© 2025 JobAnalyzer. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
