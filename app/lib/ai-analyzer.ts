/**
 * AI-powered job description analysis service
 * Analyzes job postings and generates interview questions
 */


const CODING_QUESTIONS: CodingQuestion[] = [
  {
    id: '1',
    question: 'Find the maximum product of two integers in an array',
    difficulty: 'easy',
    category: 'Arrays',
    tags: ['arrays', 'math', 'optimization'],
    solution: `function maxProduct(arr) {
  if (arr.length < 2) return null;
  
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
  
  // Clean up old entries periodically
  cleanup() {
    const now = Date.now();
    for (const [userId, times] of this.requests.entries()) {
      const validTimes = times.filter(t => now - t < this.windowSize);
      if (validTimes.length === 0) {
        this.requests.delete(userId);
      } else {
        this.requests.set(userId, validTimes);
      }
    }
  }
}`,
    codeExample: 'const limiter = new RateLimiter(5, 60000); // 5 requests per minute',
    timeComplexity: 'O(n) where n is the number of requests in the window',
    spaceComplexity: 'O(u*r) where u is users and r is requests per window',
    explanation: 'Uses a sliding window approach to track requests per user within a time window.',
    hints: ['Use timestamps to track request times', 'Clean up expired requests', 'Consider memory efficiency for large user bases']
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
    if (!this.cache.has(key)) {
      return -1;
    }
    const value = this.cache.get(key);
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
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
    codeExample: 'const cache = new LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1); // Returns 1',
    timeComplexity: 'O(1) for both get and put operations',
    spaceComplexity: 'O(capacity)',
    explanation: 'Uses JavaScript Map which maintains insertion order, making it perfect for LRU implementation.',
    hints: ['Consider using both HashMap and LinkedList', 'Map maintains insertion order in JS', 'Think about thread safety in production']
  },
  {
    id: '4',
    question: 'Implement debounce function',
    difficulty: 'easy',
    category: 'Functions',
    tags: ['functions', 'closures', 'timing'],
    solution: `function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}`,
    codeExample: 'const debouncedSearch = debounce(searchAPI, 300);',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    explanation: 'Delays function execution until after a specified time has elapsed since the last call.',
    hints: ['Use setTimeout and clearTimeout', 'Remember to preserve this context', 'Handle function arguments properly']
  },
  {
    id: '5',
    question: 'Find all pairs in array that sum to target',
    difficulty: 'easy',
    category: 'Arrays',
    tags: ['arrays', 'hash-map', 'two-pointer'],
    solution: `function findPairs(arr, target) {
  const seen = new Set();
  const pairs = [];
  
  for (let num of arr) {
    const complement = target - num;
    if (seen.has(complement)) {
      pairs.push([complement, num]);
    }
    seen.add(num);
  }
  
  return pairs;
}`,
    codeExample: 'findPairs([1, 2, 3, 4, 5], 5); // Returns [[1,4], [2,3]]',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    explanation: 'Uses a hash set to track seen numbers and find complements in constant time.',
    hints: ['Use a hash set for O(1) lookups', 'Calculate complement for each number']
  },
  {
    id: '6',
    question: 'Implement a binary search tree with insert and search',
    difficulty: 'medium',
    category: 'Trees',
    tags: ['trees', 'bst', 'recursion'],
    solution: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  
  insert(val) {
    const node = new TreeNode(val);
    if (!this.root) {
      this.root = node;
      return;
    }
    
    let current = this.root;
    while (true) {
      if (val < current.val) {
        if (!current.left) {
          current.left = node;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          break;
        }
        current = current.right;
      }
    }
  }
  
  search(val) {
    let current = this.root;
    while (current) {
      if (val === current.val) return true;
      current = val < current.val ? current.left : current.right;
    }
    return false;
  }
}`,
    codeExample: 'const bst = new BST(); bst.insert(5); bst.insert(3); bst.search(3); // true',
    timeComplexity: 'O(log n) average, O(n) worst case',
    spaceComplexity: 'O(n)',
    explanation: 'Binary search tree maintains sorted order and allows efficient search, insert, and delete operations.',
    hints: ['Compare values to decide left or right', 'Handle the root node case', 'Consider iterative vs recursive approaches']
  }
];

// ============================================================================
// Skill and Technology Patterns
// ============================================================================

const SKILL_PATTERNS = {
  languages: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 
    'php', 'ruby', 'swift', 'kotlin', 'scala', 'r', 'matlab'
  ],
  frontend: [
    'react', 'angular', 'vue', 'svelte', 'nextjs', 'nuxt', 'gatsby',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'material-ui'
  ],
  backend: [
    'nodejs', 'express', 'nestjs', 'django', 'flask', 'fastapi',
    'spring', 'spring boot', 'laravel', 'rails', 'asp.net'
  ],
  databases: [
    'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'dynamodb', 'cassandra', 'oracle', 'sql server'
  ],
  cloud: [
    'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes',
    'terraform', 'ansible', 'jenkins', 'gitlab ci', 'github actions'
  ],
  tools: [
    'git', 'jira', 'confluence', 'figma', 'webpack', 'vite',
    'babel', 'eslint', 'prettier', 'jest', 'cypress', 'selenium'
  ],
  concepts: [
    'microservices', 'serverless', 'rest api', 'graphql', 'websocket',
    'oauth', 'jwt', 'ci/cd', 'agile', 'scrum', 'tdd', 'solid'
  ]
};

// ============================================================================
// Main Analysis Function
// ============================================================================

/**
 * Analyzes a job description and generates comprehensive analysis
 * @param jobData - The job posting data to analyze
 * @returns Complete job analysis with interview questions
 */
export const analyzeJobDescription = async (jobData: JobUploadData): Promise<JobAnalysis> => {
  try {
    validateJobData(jobData);
    
    // Perform analysis
    const analysisResult = await performAnalysis(jobData);
    
    const analysis: JobAnalysis = {
      id: generateId(),
      jobTitle: jobData.jobTitle,
      jobDescription: jobData.jobDescription,
      company: jobData.company,
      analysisDate: new Date().toISOString(),
      analysis: analysisResult
    };

    return analysis;
  } catch (error) {
    console.error('Error analyzing job description:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to analyze job description: ${errorMessage}`);
  }
};

/**
 * Validates job data input
 */
const validateJobData = (jobData: JobUploadData): void => {
  if (!jobData.jobTitle || jobData.jobTitle.trim().length === 0) {
    throw new Error('Job title is required');
  }
  if (!jobData.jobDescription || jobData.jobDescription.trim().length < 50) {
    throw new Error('Job description must be at least 50 characters');
  }
  if (!jobData.company || jobData.company.trim().length === 0) {
    throw new Error('Company name is required');
  }
};

/**
 * Performs the actual analysis of the job description
 */
const performAnalysis = async (jobData: JobUploadData) => {
  const description = jobData.jobDescription.toLowerCase();
  const title = jobData.jobTitle.toLowerCase();

  // Extract information from job posting
  const requiredSkills = extractSkills(description, title, true);
  const preferredSkills = extractSkills(description, title, false);
  const technicalStack = extractTechnicalStack(description);
  const roleType = determineRoleType(title, description);
  const experienceLevel = determineExperienceLevel(title, description);
  const keyResponsibilities = extractResponsibilities(description);
  const companyInfo = extractCompanyInfo(description, jobData.company);

  // Generate interview questions
  const interviewQuestions = generateInterviewQuestions(
    jobData,
    roleType,
    technicalStack,
    requiredSkills
  );
  
  // Calculate compatibility score
  const compatibilityScore = calculateCompatibilityScore(
    requiredSkills,
    preferredSkills,
    experienceLevel
  );

  return {
    requiredSkills,
    preferredSkills,
    experienceLevel,
    technicalStack,
    roleType,
    keyResponsibilities,
    companyInfo,
    interviewQuestions,
    compatibilityScore
  };
};

// ============================================================================
// Extraction Functions
// ============================================================================

/**
 * Extracts skills from job description with improved pattern matching
 */
const extractSkills = (description: string, title: string, isRequired: boolean): string[] => {
  const foundSkills = new Set<string>();
  const context = `${title} ${description}`;
  
  // Check for skills in all categories
  Object.values(SKILL_PATTERNS).flat().forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(context)) {
      // Capitalize properly
      const formatted = skill.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      foundSkills.add(formatted);
    }
  });

  // Look for required vs preferred context
  if (isRequired) {
    const requiredSection = extractSection(description, ['required', 'must have', 'essential']);
    if (requiredSection) {
      return Array.from(foundSkills).filter(skill => 
        requiredSection.includes(skill.toLowerCase())
      );
    }
  } else {
    const preferredSection = extractSection(description, ['preferred', 'nice to have', 'bonus']);
    if (preferredSection) {
      return Array.from(foundSkills).filter(skill => 
        preferredSection.includes(skill.toLowerCase())
      );
    }
  }

  return Array.from(foundSkills);
};

/**
 * Extracts a specific section from the description
 */
const extractSection = (description: string, keywords: string[]): string | null => {
  for (const keyword of keywords) {
    const regex = new RegExp(`${keyword}[:\\s]([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
    const match = description.match(regex);
    if (match) {
      return match[1];
    }
  }
  return null;
};

/**
 * Extracts technical stack information with better detection
 */
const extractTechnicalStack = (description: string): string[] => {
  const stacks = new Set<string>();
  
  // Check for specific stack mentions
  const stackPatterns = {
    'MERN': ['mongodb', 'express', 'react', 'node'],
    'MEAN': ['mongodb', 'express', 'angular', 'node'],
    'LAMP': ['linux', 'apache', 'mysql', 'php'],
    'JAMstack': ['jamstack', 'static site'],
    'Microservices': ['microservices', 'micro-services'],
    'Serverless': ['serverless', 'lambda', 'cloud functions'],
    'REST API': ['rest api', 'restful'],
    'GraphQL': ['graphql']
  };

  for (const [stackName, patterns] of Object.entries(stackPatterns)) {
    if (patterns.some(pattern => description.includes(pattern))) {
      stacks.add(stackName);
    }
  }

  return Array.from(stacks);
};

/**
 * Determines role type with improved detection
 */
const determineRoleType = (title: string, description: string): JobAnalysis['analysis']['roleType'] => {
  const context = `${title} ${description}`;
  
  const roleIndicators = {
    frontend: ['frontend', 'front-end', 'ui', 'ux', 'web designer'],
    backend: ['backend', 'back-end', 'server', 'api developer'],
    fullstack: ['fullstack', 'full-stack', 'full stack'],
    devops: ['devops', 'dev ops', 'infrastructure', 'site reliability', 'sre'],
    data: ['data scientist', 'data engineer', 'machine learning', 'ml engineer', 'ai'],
    mobile: ['mobile', 'ios', 'android', 'react native', 'flutter']
  };

  for (const [role, indicators] of Object.entries(roleIndicators)) {
    if (indicators.some(indicator => context.includes(indicator))) {
      return role as JobAnalysis['analysis']['roleType'];
    }
  }

  return 'other';
};

/**
 * Determines experience level with better heuristics
 */
const determineExperienceLevel = (title: string, description: string): JobAnalysis['analysis']['experienceLevel'] => {
  const context = `${title} ${description}`;
  
  // Senior level indicators
  if (/senior|sr\.|staff|lead|principal|architect|5\+\s*years|7\+\s*years/i.test(context)) {
    return 'senior';
  }
  
  // Lead/Principal level
  if (/lead|principal|staff|architect|10\+\s*years/i.test(context)) {
    return 'lead';
  }
  
  // Entry level indicators
  if (/junior|jr\.|entry|graduate|intern|0-2\s*years|new grad/i.test(context)) {
    return 'entry';
  }
  
  // Default to mid-level
  return 'mid';
};

/**
 * Extracts key responsibilities with better parsing
 */
const extractResponsibilities = (description: string): string[] => {
  const responsibilities: string[] = [];
  
  // Look for responsibility section
  const respSection = extractSection(description, [
    'responsibilities',
    'you will',
    'role',
    'what you\'ll do'
  ]);
  
  if (respSection) {
    // Split by bullet points or newlines
    const lines = respSection.split(/[•\-\*\n]/).filter(line => line.trim().length > 10);
    responsibilities.push(...lines.map(line => line.trim()).slice(0, 8));
  }
  
  // Fallback to generic responsibilities if nothing found
  if (responsibilities.length === 0) {
    return [
      'Develop and maintain software applications',
      'Collaborate with cross-functional teams',
      'Write clean, maintainable, and well-documented code',
      'Participate in code reviews and technical discussions',
      'Debug and troubleshoot production issues'
    ];
  }
  
  return responsibilities;
};

/**
 * Extracts company information
 */
const extractCompanyInfo = (description: string, companyName: string) => {
  let size = 'medium';
  if (/startup|early-stage/i.test(description)) size = 'startup';
  if (/enterprise|fortune|large company/i.test(description)) size = 'large';
  
  let industry = 'Technology';
  if (/fintech|finance/i.test(description)) industry = 'Financial Technology';
  if (/healthcare|health tech/i.test(description)) industry = 'Healthcare';
  if (/e-commerce|ecommerce/i.test(description)) industry = 'E-commerce';
  
  const culture: string[] = [];
  if (/collaborative|team/i.test(description)) culture.push('Collaborative');
  if (/innovative|cutting-edge/i.test(description)) culture.push('Innovative');
  if (/fast-paced|agile/i.test(description)) culture.push('Fast-paced');
  if (/flexible|remote|work-life/i.test(description)) culture.push('Flexible');
  
  return { size, industry, culture };
};

// ============================================================================
// Interview Question Generation
// ============================================================================

/**
 * Generates comprehensive interview questions
 */
const generateInterviewQuestions = (
  jobData: JobUploadData,
  roleType: string,
  technicalStack: string[],
  requiredSkills: string[]
): InterviewQuestions => {
  return {
    behavioral: generateBehavioralQuestions(jobData.jobTitle, roleType),
    technical: generateTechnicalQuestions(roleType, requiredSkills),
    coding: selectCodingQuestions(roleType, requiredSkills),
    systemDesign: generateSystemDesignQuestions(roleType)
  };
};

/**
 * Generates role-specific behavioral questions
 */
const generateBehavioralQuestions = (jobTitle: string, roleType: string): string[] => {
  const baseQuestions = [
    "Tell me about a challenging project you worked on and how you overcame obstacles.",
    "Describe a time when you had to learn a new technology quickly. How did you approach it?",
    "How do you handle conflicting priorities and tight deadlines?",
    "Tell me about a time you had to work with a difficult team member. How did you handle it?",
    "Describe a situation where you had to make a technical decision with incomplete information."
  ];

  const roleSpecific: Record<string, string[]> = {
    frontend: [
      "Describe a time when you had to optimize a web application's performance.",
      "How do you balance user experience with development timelines?"
    ],
    backend: [
      "Tell me about a time you designed and implemented a scalable API.",
      "Describe how you handled a critical production bug."
    ],
    fullstack: [
      "How do you decide between implementing logic on the frontend vs backend?",
      "Describe a project where you owned both frontend and backend development."
    ]
  };

  return [...baseQuestions, ...(roleSpecific[roleType] || [])].slice(0, 7);
};

/**
 * Generates technical questions based on role and skills
 */
const generateTechnicalQuestions = (roleType: string, requiredSkills: string[]): string[] => {
  const questionBank: Record<string, string[]> = {
    frontend: [
      "Explain the virtual DOM and how React uses it for performance optimization.",
      "What are the differences between CSS Grid and Flexbox? When would you use each?",
      "How do you optimize web application performance and reduce bundle size?",
      "Explain the concept of Web Accessibility (a11y) and its importance.",
      "What are Progressive Web Apps (PWAs) and their key features?"
    ],
    backend: [
      "Explain the difference between SQL and NoSQL databases and when to use each.",
      "What are the key principles of RESTful API design?",
      "How do you handle authentication and authorization in your applications?",
      "Explain database indexing and its impact on performance.",
      "What are microservices and what are their advantages and disadvantages?"
    ],
    fullstack: [
      "How do you ensure data consistency between frontend and backend?",
      "Explain the concept of server-side rendering vs client-side rendering.",
      "What strategies do you use for API versioning?",
      "How do you handle state management in large applications?",
      "Explain caching strategies at different layers of an application."
    ],
    devops: [
      "Explain the CI/CD pipeline and its components.",
      "What is Infrastructure as Code (IaC) and why is it important?",
      "How do you monitor and debug issues in a distributed system?",
      "Explain containerization and orchestration with Docker and Kubernetes.",
      "What are blue-green deployments and canary releases?"
    ]
  };

  const baseQuestions = [
    "Explain the concept of version control and branching strategies.",
    "What are some common security vulnerabilities in web applications and how do you prevent them?",
    "How do you ensure code quality in your projects?"
  ];

  const roleQuestions = questionBank[roleType] || questionBank.fullstack;
  return [...roleQuestions.slice(0, 4), ...baseQuestions].slice(0, 7);
};

/**
 * Selects appropriate coding questions based on role and skills
 */
const selectCodingQuestions = (roleType: string, requiredSkills: string[]): CodingQuestion[] => {
  const selectedQuestions: CodingQuestion[] = [];
  
  // Always include one easy question
  selectedQuestions.push(CODING_QUESTIONS.find(q => q.difficulty === 'easy')!);
  
  // Add medium questions based on role
  if (roleType === 'backend' || roleType === 'fullstack') {
    selectedQuestions.push(
      CODING_QUESTIONS.find(q => q.id === '2')!, // Rate limiter
      CODING_QUESTIONS.find(q => q.id === '6')!  // BST
    );
  } else {
    selectedQuestions.push(
      CODING_QUESTIONS.find(q => q.id === '4')!, // Debounce
      CODING_QUESTIONS.find(q => q.id === '5')!  // Find pairs
    );
  }
  
  // Add one hard question
  if (selectedQuestions.length < 4) {
    selectedQuestions.push(CODING_QUESTIONS.find(q => q.difficulty === 'hard')!);
  }
  
  return selectedQuestions.slice(0, 3);
};

/**
 * Generates system design questions based on role
 */
const generateSystemDesignQuestions = (roleType: string): string[] => {
  const questionBank: Record<string, string[]> = {
    frontend: [
      "Design a real-time collaborative document editor like Google Docs.",
      "How would you implement infinite scrolling with optimal performance?"
    ],
    backend: [
      "Design a URL shortening service like bit.ly with analytics.",
      "Design a distributed cache system like Redis."
    ],
    fullstack: [
      "Design a social media platform like Twitter.",
      "Design a ride-sharing application like Uber."
    ],
    devops: [
      "Design a CI/CD pipeline for a microservices architecture.",
      "Design a monitoring and alerting system for a distributed application."
    ],
    data: [
      "Design a recommendation system for an e-commerce platform.",
      "Design a data pipeline for processing real-time analytics."
    ]
  };

  const baseQuestions = [
    "Design a chat application with real-time messaging capabilities.",
    "How would you design a rate limiting system for an API?"
  ];

  return (questionBank[roleType] || baseQuestions).slice(0, 2);
};

// ============================================================================
// Scoring and Recommendations
// ============================================================================

/**
 * Calculates compatibility score with detailed breakdown
 */
const calculateCompatibilityScore = (
  requiredSkills: string[],
  preferredSkills: string[],
  experienceLevel: string
): CompatibilityScore => {
  // In a real implementation, this would compare against user's profile
  const matchPercentage = 0.75; // Placeholder
  
  const matched = Math.floor(requiredSkills.length * matchPercentage);
  const requiredSkillsMatched = requiredSkills.slice(0, matched);
  const missingSkills = requiredSkills.slice(matched);
  
  const skillsMatch = Math.round((matched / requiredSkills.length) * 100);
  const experienceScore = experienceLevel === 'senior' ? 85 : experienceLevel === 'mid' ? 75 : 65;
  
  const overall = Math.round((skillsMatch + experienceScore + 75) / 3);
  
  const recommendations = generateRecommendations(
    missingSkills,
    experienceLevel,
    preferredSkills
  );
  
  return {
    overall,
    skillsMatch,
    experienceLevel: experienceScore,
    technicalStack: 75,
    cultureFit: 75,
    breakdown: {
      requiredSkillsMatched,
      missingSkills,
      additionalSkills: preferredSkills
    },
    recommendations
  };
};

/**
 * Generates personalized recommendations
 */
const generateRecommendations = (
  missingSkills: string[],
  experienceLevel: string,
  preferredSkills: string[]
): string[] => {
  const recommendations: string[] = [];
  
  if (missingSkills.length > 0) {
    recommendations.push(
      `Focus on learning: ${missingSkills.slice(0, 3).join(', ')}`
    );
  }
  
  if (preferredSkills.length > 0) {
    recommendations.push(
      `Consider gaining experience with: ${preferredSkills.slice(0, 2).join(', ')}`
    );
  }
  
  if (experienceLevel === 'entry') {
    recommendations.push(
      'Work on building a strong portfolio of personal projects',
      'Practice coding challenges on platforms like LeetCode'
    );
  } else if (experienceLevel === 'mid') {
    recommendations.push(
      'Focus on system design and architectural concepts',
      'Develop leadership and mentoring skills'
    );
  } else {
    recommendations.push(
      'Prepare to discuss past technical leadership experiences',
      'Review high-level system architecture patterns'
    );
  }
  
  return recommendations.slice(0, 5);
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generates a unique ID for job analysis
 */
const generateId = (): string => {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Get coding questions filtered by difficulty
 */
export const getCodingQuestionsByDifficulty = (
  difficulty: 'easy' | 'medium' | 'hard'
): CodingQuestion[] => {
  return CODING_QUESTIONS.filter(q => q.difficulty === difficulty);
};

/**
 * Get coding questions filtered by category
 */
export const getCodingQuestionsByCategory = (category: string): CodingQuestion[] => {
  return CODING_QUESTIONS.filter(
    q => q.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Search coding questions by tags
 */
export const searchCodingQuestions = (tags: string[]): CodingQuestion[] => {
  if (tags.length === 0) return CODING_QUESTIONS;
  
  return CODING_QUESTIONS.filter(q =>
    tags.some(tag => q.tags.includes(tag.toLowerCase()))
  );
};

/**
 * Get all available coding questions
 */
export const getAllCodingQuestions = (): CodingQuestion[] => {
  return [...CODING_QUESTIONS];
};

/**
 * Get a random coding question by difficulty
 */
export const getRandomCodingQuestion = (
  difficulty?: 'easy' | 'medium' | 'hard'
): CodingQuestion => {
  const questions = difficulty
    ? CODING_QUESTIONS.filter(q => q.difficulty === difficulty)
    : CODING_QUESTIONS;
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

/**
 * Get question statistics
 */
export const getQuestionStats = () => {
  return {
    total: CODING_QUESTIONS.length,
    byDifficulty: {
      easy: CODING_QUESTIONS.filter(q => q.difficulty === 'easy').length,
      medium: CODING_QUESTIONS.filter(q => q.difficulty === 'medium').length,
      hard: CODING_QUESTIONS.filter(q => q.difficulty === 'hard').length
    },
    categories: [...new Set(CODING_QUESTIONS.map(q => q.category))],
    allTags: [...new Set(CODING_QUESTIONS.flatMap(q => q.tags))]
  };
};
