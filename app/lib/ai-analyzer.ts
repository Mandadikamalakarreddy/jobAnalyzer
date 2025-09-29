/**
 * AI-powered job description analysis service
 * Analyzes job postings and generates interview questions
 */

// Sample coding questions database (in production, this would be in a database)
const CODING_QUESTIONS: CodingQuestion[] = [
  {
    id: '1',
    question: 'Find the maximum product of two integers in an array',
    difficulty: 'easy',
    category: 'Arrays',
    tags: ['arrays', 'math', 'optimization'],
    solution: `function maxProduct(arr) {
  if (arr.length < 2) return -1;
  
  let max1 = -Infinity, max2 = -Infinity;
  let min1 = Infinity, min2 = Infinity;
  
  for (let num of arr) {
    if (num > max1) {
      max2 = max1;
      max1 = num;
    } else if (num > max2) {
      max2 = num;
    }
    
    if (num < min1) {
      min2 = min1;
      min1 = num;
    } else if (num < min2) {
      min2 = num;
    }
  }
  
  return Math.max(max1 * max2, min1 * min2);
}`,
    codeExample: 'maxProduct([1, 5, 3, 2, 9, 7, 6]); // Returns 63 (9 * 7)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    explanation: 'Track the two largest and two smallest numbers to handle negative numbers that might produce the maximum product.',
    hints: ['Consider negative numbers', 'You need to track both largest and smallest values']
  },
  {
    id: '2',
    question: 'Implement a rate limiter class',
    difficulty: 'medium',
    category: 'System Design',
    tags: ['rate-limiting', 'data-structures', 'system-design'],
    solution: `class RateLimiter {
  constructor(maxRequests, windowSize) {
    this.maxRequests = maxRequests;
    this.windowSize = windowSize;
    this.requests = new Map();
  }

  isAllowed(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove expired requests
    const validRequests = userRequests.filter(time => 
      now - time < this.windowSize
    );
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(userId, validRequests);
    return true;
  }
}`,
    codeExample: 'const limiter = new RateLimiter(5, 60000); // 5 requests per minute',
    timeComplexity: 'O(n) where n is the number of requests in the window',
    spaceComplexity: 'O(u*r) where u is users and r is requests per window',
    explanation: 'Uses a sliding window approach to track requests per user within a time window.',
    hints: ['Use timestamps to track request times', 'Clean up expired requests']
  },
  {
    id: '3',
    question: 'Design and implement a LRU (Least Recently Used) cache',
    difficulty: 'hard',
    category: 'Data Structures',
    tags: ['cache', 'linked-list', 'hash-map', 'design'],
    solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}`,
    codeExample: 'const cache = new LRUCache(2); cache.put(1, 1); cache.put(2, 2);',
    timeComplexity: 'O(1) for both get and put operations',
    spaceComplexity: 'O(capacity)',
    explanation: 'Uses JavaScript Map which maintains insertion order, making it perfect for LRU implementation.',
    hints: ['Consider using both HashMap and LinkedList', 'Map maintains insertion order in JS']
  }
];

/**
 * Analyzes a job description using AI and generates comprehensive analysis
 */
export const analyzeJobDescription = async (jobData: JobUploadData): Promise<JobAnalysis> => {
  // In a real implementation, this would call an AI service like OpenAI, Anthropic, etc.
  // For now, we'll simulate the analysis with structured data
  
  const prompt = createAnalysisPrompt(jobData);
  
  // Simulate AI analysis (replace with actual AI service call)
  const aiResponse = await simulateAIAnalysis(jobData);
  
  const analysis: JobAnalysis = {
    id: generateId(),
    jobTitle: jobData.jobTitle,
    jobDescription: jobData.jobDescription,
    company: jobData.company,
    analysisDate: new Date().toISOString(),
    analysis: aiResponse
  };

  return analysis;
};

/**
 * Creates a comprehensive prompt for AI analysis
 */
const createAnalysisPrompt = (jobData: JobUploadData): string => {
  return `Analyze the following job description and provide a comprehensive analysis:

Job Title: ${jobData.jobTitle}
Company: ${jobData.company}
Description: ${jobData.jobDescription}

Please provide:
1. Required technical skills (programming languages, frameworks, tools)
2. Preferred qualifications and nice-to-have skills
3. Experience level (entry, mid, senior, lead)
4. Technical stack and architecture mentioned
5. Role type (frontend, backend, fullstack, devops, data, mobile)
6. Key responsibilities and day-to-day tasks
7. Company culture insights from the description

Based on this analysis, generate appropriate interview questions including:
- 5 behavioral questions focused on the role's responsibilities
- 5 technical questions testing the required skills
- 3 coding challenges with solutions (include time/space complexity)
- 2 system design questions relevant to the role

Also provide a compatibility scoring framework and recommendations for candidates.`;
};

/**
 * Simulates AI analysis response (replace with actual AI service)
 */
const simulateAIAnalysis = async (jobData: JobUploadData) => {
  // This would be replaced with actual AI service call
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call delay

  // Extract keywords and patterns from job description
  const description = jobData.jobDescription.toLowerCase();
  const title = jobData.jobTitle.toLowerCase();

  // Determine technical skills based on common patterns
  const requiredSkills = extractSkills(description, 'required');
  const preferredSkills = extractSkills(description, 'preferred');
  const technicalStack = extractTechnicalStack(description);
  const roleType = determineRoleType(title, description);
  const experienceLevel = determineExperienceLevel(title, description);

  // Generate interview questions
  const interviewQuestions = generateInterviewQuestions(jobData, roleType, technicalStack);
  
  // Calculate compatibility score
  const compatibilityScore = calculateCompatibilityScore(requiredSkills, preferredSkills, experienceLevel);

  return {
    requiredSkills,
    preferredSkills,
    experienceLevel,
    technicalStack,
    roleType,
    keyResponsibilities: extractResponsibilities(description),
    companyInfo: extractCompanyInfo(description, jobData.company),
    interviewQuestions,
    compatibilityScore
  };
};

/**
 * Extracts skills from job description
 */
const extractSkills = (description: string, type: 'required' | 'preferred'): string[] => {
  const skillPatterns = {
    languages: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby'],
    frameworks: ['react', 'angular', 'vue', 'nodejs', 'express', 'django', 'flask', 'spring', 'laravel'],
    databases: ['mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'dynamodb'],
    cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform'],
    tools: ['git', 'jenkins', 'jira', 'figma', 'webpack', 'babel']
  };

  const foundSkills: string[] = [];
  
  Object.values(skillPatterns).flat().forEach(skill => {
    if (description.includes(skill)) {
      foundSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });

  return foundSkills;
};

/**
 * Extracts technical stack information
 */
const extractTechnicalStack = (description: string): string[] => {
  const stackPatterns = [
    'mern', 'mean', 'lamp', 'django', 'rails', 'spring boot', 
    'microservices', 'serverless', 'jamstack', 'rest api', 'graphql'
  ];

  return stackPatterns.filter(stack => 
    description.includes(stack.toLowerCase())
  ).map(stack => stack.toUpperCase());
};

/**
 * Determines role type from title and description
 */
const determineRoleType = (title: string, description: string): JobAnalysis['analysis']['roleType'] => {
  if (title.includes('frontend') || description.includes('frontend') || description.includes('ui/ux')) {
    return 'frontend';
  }
  if (title.includes('backend') || description.includes('backend') || description.includes('api')) {
    return 'backend';
  }
  if (title.includes('fullstack') || title.includes('full-stack') || title.includes('full stack')) {
    return 'fullstack';
  }
  if (title.includes('devops') || description.includes('devops') || description.includes('infrastructure')) {
    return 'devops';
  }
  if (title.includes('data') || description.includes('data science') || description.includes('machine learning')) {
    return 'data';
  }
  if (title.includes('mobile') || description.includes('mobile') || description.includes('ios') || description.includes('android')) {
    return 'mobile';
  }
  return 'other';
};

/**
 * Determines experience level from title and description
 */
const determineExperienceLevel = (title: string, description: string): JobAnalysis['analysis']['experienceLevel'] => {
  if (title.includes('senior') || title.includes('sr.') || description.includes('5+ years')) {
    return 'senior';
  }
  if (title.includes('lead') || title.includes('principal') || title.includes('staff')) {
    return 'lead';
  }
  if (title.includes('junior') || title.includes('jr.') || description.includes('entry level')) {
    return 'entry';
  }
  return 'mid';
};

/**
 * Extracts key responsibilities from job description
 */
const extractResponsibilities = (description: string): string[] => {
  // This is a simplified extraction - in reality, you'd use NLP
  const responsibilities = [
    'Develop and maintain software applications',
    'Collaborate with cross-functional teams',
    'Write clean, maintainable code',
    'Participate in code reviews',
    'Debug and troubleshoot issues'
  ];

  return responsibilities;
};

/**
 * Extracts company information
 */
const extractCompanyInfo = (description: string, companyName: string) => {
  return {
    size: description.includes('startup') ? 'startup' : description.includes('enterprise') ? 'large' : 'medium',
    industry: 'Technology', // Would extract from description
    culture: ['collaborative', 'innovative', 'fast-paced']
  };
};

/**
 * Generates interview questions based on job analysis
 */
const generateInterviewQuestions = (jobData: JobUploadData, roleType: string, technicalStack: string[]) => {
  const behavioral = generateBehavioralQuestions(jobData.jobTitle);
  const technical = generateTechnicalQuestions(roleType, technicalStack);
  const coding = selectCodingQuestions(roleType);
  const systemDesign = generateSystemDesignQuestions(roleType);

  return {
    behavioral,
    technical,
    coding,
    systemDesign
  };
};

/**
 * Generates behavioral questions
 */
const generateBehavioralQuestions = (jobTitle: string): string[] => {
  return [
    "Tell me about a challenging project you worked on and how you overcame obstacles.",
    "Describe a time when you had to learn a new technology quickly. How did you approach it?",
    "How do you handle conflicting priorities and tight deadlines?",
    "Tell me about a time you had to work with a difficult team member. How did you handle it?",
    "Describe a situation where you had to make a technical decision with incomplete information."
  ];
};

/**
 * Generates technical questions based on role type
 */
const generateTechnicalQuestions = (roleType: string, technicalStack: string[]): string[] => {
  const baseQuestions = [
    "Explain the difference between SQL and NoSQL databases.",
    "What are the key principles of RESTful API design?",
    "How do you ensure code quality in your projects?",
    "Explain the concept of version control and branching strategies.",
    "What are some common security vulnerabilities in web applications?"
  ];

  // Customize based on role type
  if (roleType === 'frontend') {
    return [
      ...baseQuestions.slice(0, 3),
      "What are the differences between React class components and functional components?",
      "How do you optimize web application performance?"
    ];
  }

  return baseQuestions;
};

/**
 * Selects appropriate coding questions based on role type
 */
const selectCodingQuestions = (roleType: string): CodingQuestion[] => {
  // Return different questions based on role type
  return CODING_QUESTIONS.slice(0, 3);
};

/**
 * Generates system design questions
 */
const generateSystemDesignQuestions = (roleType: string): string[] => {
  return [
    "Design a URL shortening service like bit.ly",
    "How would you design a chat application like WhatsApp?"
  ];
};

/**
 * Calculates compatibility score
 */
const calculateCompatibilityScore = (requiredSkills: string[], preferredSkills: string[], experienceLevel: string): CompatibilityScore => {
  // This would be more sophisticated in a real implementation
  return {
    overall: 75,
    skillsMatch: 80,
    experienceLevel: 70,
    technicalStack: 75,
    cultureFit: 75,
    breakdown: {
      requiredSkillsMatched: requiredSkills.slice(0, Math.floor(requiredSkills.length * 0.8)),
      missingSkills: requiredSkills.slice(Math.floor(requiredSkills.length * 0.8)),
      additionalSkills: preferredSkills
    },
    recommendations: [
      "Focus on strengthening backend development skills",
      "Consider gaining experience with cloud platforms",
      "Practice system design concepts"
    ]
  };
};

/**
 * Generates a unique ID
 */
const generateId = (): string => {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get coding questions by difficulty
 */
export const getCodingQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): CodingQuestion[] => {
  return CODING_QUESTIONS.filter(q => q.difficulty === difficulty);
};

/**
 * Get coding questions by category
 */
export const getCodingQuestionsByCategory = (category: string): CodingQuestion[] => {
  return CODING_QUESTIONS.filter(q => q.category.toLowerCase() === category.toLowerCase());
};

/**
 * Search coding questions by tags
 */
export const searchCodingQuestions = (tags: string[]): CodingQuestion[] => {
  return CODING_QUESTIONS.filter(q => 
    tags.some(tag => q.tags.includes(tag.toLowerCase()))
  );
};