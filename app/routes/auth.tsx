import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description ", content: "Log into your account " },
];

const auth = () => {
  const { isLoading, auth, error } = usePuterStore();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const next = urlParams.get('next') || '/';
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check demo mode only once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDemoMode(!!(window as any).puterLoadError);
    }
  }, []);

  // Handle navigation only once when authenticated
  useEffect(() => {
    if (auth.isAuthenticated && !hasNavigated && !isLoading) {
      setHasNavigated(true);
      // Small delay to prevent navigation throttling
      setTimeout(() => {
        navigate(next, { replace: true });
      }, 100);
    }
  }, [auth.isAuthenticated, hasNavigated, isLoading, next, navigate]);

  const handleSignIn = async () => {
    await auth.signIn();
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover  min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10 ">
          <div className="flex flex-col gap-4 item-center text-center">
            <h1>Welcome</h1>
            <h2>{isDemoMode ? "Demo Mode - Resume Analyzer" : "Log In to Continue Your Job Journey"}</h2>
            {isDemoMode && (
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                Running in demo mode. All features are available for testing.
              </p>
            )}
          </div>
          <div>
            {
                isLoading ? (
                    <button className="auth-button animate-pulse">
                        <p>{isDemoMode ? "Setting up demo..." : "Signing you in..."}</p>
                    </button>
                ) : (
                    <>
                    {auth.isAuthenticated ? (
                        <button className="auth-button" onClick={auth.signOut}>
                            <p>{isDemoMode ? "Exit Demo" : "Log Out"}</p>
                             </button>
                    ):(
                        <button className="auth-button" onClick={handleSignIn}> 
                            <p>{isDemoMode ? "Enter Demo Mode" : "Log In"}</p>
                        </button>
                    )}
                    </>
                )
            }
          </div>
        </section>
      </div>
    </main>
  );
};

export default auth;
