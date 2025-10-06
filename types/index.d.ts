// Legacy interfaces (keeping for backward compatibility)
interface Job {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
}

interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  resumePath: string;
  feedback: Feedback;
}

interface Feedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}

interface CodingQuestion {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  solution: string;
  codeExample: string;
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  hints: string[];
}

interface QuestionWithAnswer {
  question: string;
  answer: string;
  tips?: string[];
}

interface JobUploadData {
  jobTitle: string;
  jobDescription: string;
  company: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
}

interface CompatibilityScore {
  overall: number;
  skillsMatch: number;
  experienceLevel: number;
  technicalStack: number;
  cultureFit: number;
  breakdown: {
    requiredSkillsMatched: string[];
    missingSkills: string[];
    additionalSkills: string[];
  };
  recommendations: string[];
}

interface InterviewQuestions {
  behavioral: string[] | QuestionWithAnswer[];
  technical: string[] | QuestionWithAnswer[];
  coding: CodingQuestion[];
  systemDesign: string[] | QuestionWithAnswer[];
}

interface JobAnalysis {
  id: string;
  jobTitle: string;
  jobDescription: string;
  company: string;
  analysisDate: string;
  analysis: {
    requiredSkills: string[];
    preferredSkills: string[];
    experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
    technicalStack: string[];
    roleType: 'frontend' | 'backend' | 'fullstack' | 'devops' | 'data' | 'mobile' | 'other';
    keyResponsibilities: string[];
    companyInfo: {
      size: string;
      industry: string;
      culture: string[];
    };
    interviewQuestions: InterviewQuestions;
    compatibilityScore: CompatibilityScore;
  };
}