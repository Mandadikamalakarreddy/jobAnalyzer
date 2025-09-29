import JobUploader from "~/components/JobUploader";
import Navbar from "~/components/Navbar";

export const meta = () => [
  { title: "JobAnalyzer | Analyze Job" },
  { name: "description", content: "Analyze job postings with AI-powered insights" },
];

export default function AnalyzeJob() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <JobUploader />
      </main>
    </div>
  );
}