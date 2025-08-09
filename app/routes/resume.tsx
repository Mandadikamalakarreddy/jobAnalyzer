import { Link, useNavigate, useParams } from "react-router";
import type { Route } from "./+types/resume";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS"
import Details from "~/components/Details";

export function meta({ params }: Route.MetaArgs) {
  const resumeId = (params as any).id || "Unknown";
  return [
    { title: `Resumind | Resume ${resumeId}` },
    {
      name: "description",
      content: "View and analyze your resume with AI-powered insights",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

const resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate(`/auth/?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);

      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
      setFeedback(typeof data.feedback === 'string' ? JSON.parse(data.feedback) : data.feedback);

      // console.log({ imageUrl, resumeUrl, feedback: data.feedback });
    };

    loadResume();
  }, [id]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="backLogo" className="w-3 h-3" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Home
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('images/bg-small.svg) bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className=" animation-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-xl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  title="resume"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section mb-28">
          <h2 className="!text-black text-4xl font-semibold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animation-in fade-in duration-1000 gra">
            <Summary feedback={feedback}/>
            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
            <Details feedback={feedback}/>
            </div>
          ) : (
        
              <img
                src="/images/resume-scan-2.gif"
                alt="scan"
                className="w-full"
              />
     
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
