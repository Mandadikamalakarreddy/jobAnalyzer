import JobUploader from "~/components/JobUploader";
import Navbar from "~/components/Navbar";

export const meta = () => [
  { title: "JobAnalyzer | Analyze Job" },
  { name: "description", content: "Analyze job postings with AI-powered insights" },
];

export default function AnalyzeJob() {
  return (
    <main className="min-h-screen bg-[#1B1B1B] text-white">
      <Navbar />
      <section className="mx-auto w-[95%] max-w-5xl px-6 pt-40 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121212] p-8 md:p-12 shadow-[0_20px_60px_-30px_rgba(59,130,246,0.6)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" aria-hidden />
          <div className="relative">
            <JobUploader />
          </div>
        </div>
      </section>
    </main>
  );
}