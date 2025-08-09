import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { prepareInstructions } from "~/constants";
import { convertPdfToImage } from "~/lib/pdf2image";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

export const meta = () => [
  { title: "Resumind | Upload" },
  { name: "description", content: "Upload your resume" },
];

const upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProgressing, setIsProgressing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string>("");

  const handleFileSelect = (file: File | null) => {
    setFile(file);
    // Clear validation error when file is selected
    if (file && validationError) {
      setValidationError("");
    }
  };

  const handleAnalyses = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    file: File;
  }) => {
    setIsProgressing(true);
    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile)
      return setStatusText("Error: failed to upload the file ");

    setStatusText("Converting to Image...");
    const imageFile = await convertPdfToImage(file);

    if (!imageFile.file || imageFile.error) {
      const errorMessage = imageFile.error || "Unknown error during PDF conversion";
      console.error("PDF conversion error:", errorMessage);
      return setStatusText(`Error: Failed to convert PDF to image - ${errorMessage}`);
    }

    setStatusText("Uploading the image...");

    const uploadedImage = await fs.upload([imageFile.file]);

        if (!uploadedImage) return setStatusText("Error : Failed to upload the image ");

        setStatusText("Preparing data...")
        
        const uuid = generateUUID()

        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName: companyName || '', 
            jobTitle: jobTitle || '', 
            jobDescription: jobDescription || '', 
            feedback :'',
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data))

        setStatusText("Analyzing...")

        // Only use job-specific analysis if both job title and description are provided
        const useJobSpecificAnalysis = jobTitle && jobDescription;
        const feedback = await ai.feedback(
            uploadedFile.path,
            useJobSpecificAnalysis 
                ? prepareInstructions({jobDescription, jobTitle})
                : prepareInstructions({jobDescription: "General resume analysis", jobTitle: "General"})
        )

        if(!feedback) return setStatusText("Error : Failed to analysis the resume ")

            const feedbackText = typeof feedback.message.content === "string"
            ? feedback.message.content : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);
            await kv.set(`resume:${uuid}`, JSON.stringify(data))
            setStatusText("Analysis complete redirecting...")
            // console.log(data)
            navigate(`/resume/${uuid}`)

  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    // Clear previous validation errors
    setValidationError("");

    // Validation logic
    if (!file) {
      setValidationError("Please upload a resume file.");
      return;
    }

    // If company name is provided, then job title and job description are required
    if (companyName?.trim()) {
      if (!jobTitle?.trim() || !jobDescription?.trim()) {
        setValidationError("If you provide a company name, both Job Title and Job Description are required.");
        return;
      }
    }

    // If any job field is provided, all should be provided
    const hasAnyJobField = companyName?.trim() || jobTitle?.trim() || jobDescription?.trim();
    const hasAllJobFields = companyName?.trim() && jobTitle?.trim() && jobDescription?.trim();
    
    if (hasAnyJobField && !hasAllJobFields) {
      setValidationError("Please either fill in all job details (Company Name, Job Title, and Job Description) or leave them all empty for general resume analysis.");
      return;
    }

    handleAnalyses({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProgressing ? (
            <>
              <h2>{statusText} </h2>
              <img
                src="/images/resume-scan.gif"
                alt="Resume scanning animation"
                className="w-[50%]"
              />
            </>
          ) : (
            <h2>Drop resume for an ATS score and improvement tips</h2>
          )}
          
          {/* Validation Error Alert */}
          {validationError && !isProgressing && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-4 max-w-2xl mx-auto">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Validation Error:</span>
                <span className="ml-1">{validationError}</span>
              </div>
            </div>
          )}
          
          {!isProgressing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name"> Company Name </label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title"> Job Title </label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description"> Job Description </label>
                <textarea
                  rows={8}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader"> Upload Resume <span className="text-red-500">*</span> </label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
