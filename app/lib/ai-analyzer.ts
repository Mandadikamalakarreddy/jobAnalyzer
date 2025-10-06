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
const generateBehavioralQuestions = (jobTitle: string, roleType: string): QuestionWithAnswer[] => {
  const baseQuestions: QuestionWithAnswer[] = [
    {
      question: "Tell me about a challenging project you worked on and how you overcame obstacles.",
      answer: "Use the STAR method: Describe the Situation (project context), Task (your responsibility), Action (steps you took to overcome obstacles), and Result (outcome and lessons learned). Focus on technical challenges, team collaboration, and problem-solving approaches.",
      tips: ["Be specific about the obstacles you faced", "Highlight your problem-solving process", "Mention measurable outcomes or improvements"]
    },
    {
      question: "Describe a time when you had to learn a new technology quickly. How did you approach it?",
      answer: "Explain your learning strategy: reading documentation, building small projects, following tutorials, and practicing. Emphasize how you applied this new knowledge to solve a real problem and the timeline in which you became proficient.",
      tips: ["Show your learning methodology", "Mention resources you used (docs, courses, tutorials)", "Demonstrate the practical application of what you learned"]
    },
    {
      question: "How do you handle conflicting priorities and tight deadlines?",
      answer: "Discuss your prioritization framework (e.g., impact vs. effort matrix), communication with stakeholders, breaking down tasks, and time management strategies. Include how you negotiate deadlines and manage expectations.",
      tips: ["Show your organizational skills", "Mention specific tools or techniques you use", "Highlight communication with team and stakeholders"]
    },
    {
      question: "Tell me about a time you had to work with a difficult team member. How did you handle it?",
      answer: "Focus on empathy, active listening, and finding common ground. Describe how you addressed concerns professionally, sought to understand their perspective, and worked towards a collaborative solution that benefited the project.",
      tips: ["Avoid speaking negatively about others", "Emphasize professional communication and conflict resolution", "Show how you maintained team productivity"]
    },
    {
      question: "Describe a situation where you had to make a technical decision with incomplete information.",
      answer: "Explain your decision-making process: gathering available data, consulting with team members, weighing pros and cons, considering risks, and making an informed choice. Discuss the outcome and what you learned from the experience.",
      tips: ["Show your analytical thinking", "Mention how you mitigated risks", "Explain how you validated your decision afterwards"]
    }
  ];

  const roleSpecific: Record<string, QuestionWithAnswer[]> = {
    frontend: [
      {
        question: "Describe a time when you had to optimize a web application's performance.",
        answer: "Describe the performance issues you identified (e.g., slow load times, high bounce rate), tools used for profiling (Lighthouse, Chrome DevTools), optimizations implemented (code splitting, lazy loading, image optimization), and measurable improvements achieved.",
        tips: ["Mention specific metrics before and after", "Discuss tools used for performance monitoring", "Highlight user impact of your optimizations"]
      },
      {
        question: "How do you balance user experience with development timelines?",
        answer: "Discuss prioritization strategies, MVP approach, iterative development, and stakeholder communication. Explain how you identify must-have vs. nice-to-have features and advocate for user experience while meeting business deadlines.",
        tips: ["Show understanding of business constraints", "Mention user research or feedback incorporation", "Demonstrate pragmatic decision-making"]
      }
    ],
    backend: [
      {
        question: "Tell me about a time you designed and implemented a scalable API.",
        answer: "Describe the API requirements, design decisions (REST/GraphQL), scalability considerations (caching, rate limiting, load balancing), technologies used, and how you tested and validated scalability under load.",
        tips: ["Mention specific scalability patterns used", "Discuss performance metrics and benchmarks", "Highlight design trade-offs you considered"]
      },
      {
        question: "Describe how you handled a critical production bug.",
        answer: "Walk through your incident response: detection, immediate mitigation, root cause analysis, permanent fix, and preventive measures. Emphasize communication with stakeholders, documentation, and lessons learned.",
        tips: ["Show your debugging methodology", "Mention monitoring and alerting systems", "Highlight how you prevented similar issues"]
      }
    ],
    fullstack: [
      {
        question: "How do you decide between implementing logic on the frontend vs backend?",
        answer: "Discuss factors like security (sensitive operations on backend), performance (reduce server load), user experience (immediate feedback), and maintainability. Provide specific examples of decisions you've made and their rationale.",
        tips: ["Mention security considerations", "Discuss performance implications", "Show understanding of separation of concerns"]
      },
      {
        question: "Describe a project where you owned both frontend and backend development.",
        answer: "Detail the project scope, architecture decisions, how you ensured consistency across layers, challenges faced (context switching, different tech stacks), and the successful delivery. Highlight coordination and full-stack thinking.",
        tips: ["Show your versatility across the stack", "Mention how you ensured API contract consistency", "Highlight project management and prioritization"]
      }
    ]
  };

  return [...baseQuestions, ...(roleSpecific[roleType] || [])].slice(0, 7);
};

/**
 * Generates technical questions based on role and skills
 */
const generateTechnicalQuestions = (roleType: string, requiredSkills: string[]): QuestionWithAnswer[] => {
  const questionBank: Record<string, QuestionWithAnswer[]> = {
    frontend: [
      {
        question: "Explain the virtual DOM and how React uses it for performance optimization.",
        answer: "The Virtual DOM is a lightweight copy of the actual DOM. React uses it to batch updates: when state changes, React creates a new Virtual DOM tree, compares it with the previous one (diffing), calculates the minimal set of changes needed, and updates only those parts of the real DOM. This reduces expensive DOM manipulations and improves performance.",
        tips: ["Mention reconciliation algorithm", "Discuss batching of updates", "Explain the performance benefits over direct DOM manipulation"]
      },
      {
        question: "What are the differences between CSS Grid and Flexbox? When would you use each?",
        answer: "Flexbox is one-dimensional (row or column) and best for component-level layouts, navigation bars, or distributing space among items. CSS Grid is two-dimensional (rows and columns) and ideal for page-level layouts, complex designs, or when you need precise control over both dimensions. Often used together: Grid for overall layout, Flexbox for components within grid cells.",
        tips: ["Mention one-dimensional vs two-dimensional", "Provide specific use cases for each", "Discuss when to combine both"]
      },
      {
        question: "How do you optimize web application performance and reduce bundle size?",
        answer: "Key strategies include: code splitting (dynamic imports), lazy loading components, tree shaking to remove unused code, optimizing images (WebP format, compression), minification, using CDN, implementing caching strategies, and analyzing bundles with tools like webpack-bundle-analyzer. Also consider using performance budgets and monitoring Core Web Vitals.",
        tips: ["Mention specific tools and techniques", "Discuss measurable metrics (LCP, FID, CLS)", "Highlight the importance of monitoring and measurement"]
      },
      {
        question: "Explain the concept of Web Accessibility (a11y) and its importance.",
        answer: "Web accessibility ensures websites are usable by people with disabilities. Key aspects include: semantic HTML, keyboard navigation, ARIA labels, proper contrast ratios, screen reader compatibility, and alt text for images. It's important for inclusivity, legal compliance (ADA, WCAG), SEO benefits, and reaching a wider audience. Accessibility also improves overall usability for all users.",
        tips: ["Mention WCAG guidelines", "Discuss testing tools (axe, Lighthouse)", "Highlight both moral and business reasons"]
      },
      {
        question: "What are Progressive Web Apps (PWAs) and their key features?",
        answer: "PWAs are web applications that use modern web capabilities to provide an app-like experience. Key features include: offline functionality (service workers), installability (add to home screen), responsive design, push notifications, fast loading, and HTTPS requirement. They bridge the gap between web and native apps, offering better performance and engagement without app store distribution.",
        tips: ["Mention service workers and manifest file", "Discuss advantages over traditional web apps", "Explain the installation process"]
      }
    ],
    backend: [
      {
        question: "Explain the difference between SQL and NoSQL databases and when to use each.",
        answer: "SQL databases (MySQL, PostgreSQL) are relational, use structured schemas, support ACID transactions, and are ideal for complex queries and relationships. NoSQL databases (MongoDB, Redis) are non-relational, schema-flexible, horizontally scalable, and better for unstructured data, high-volume operations, and rapid development. Choose SQL for complex transactions and data integrity; NoSQL for scalability, flexibility, and high-speed operations.",
        tips: ["Compare ACID vs BASE properties", "Mention specific use cases for each", "Discuss scalability considerations"]
      },
      {
        question: "What are the key principles of RESTful API design?",
        answer: "REST principles include: statelessness (each request contains all needed information), client-server separation, uniform interface (standard HTTP methods), cacheability, layered system, and resource-based URLs. Best practices: use proper HTTP methods (GET, POST, PUT, DELETE), meaningful URLs, appropriate status codes, versioning, pagination for large datasets, and comprehensive documentation.",
        tips: ["Mention HTTP methods and status codes", "Discuss resource naming conventions", "Highlight importance of consistency"]
      },
      {
        question: "How do you handle authentication and authorization in your applications?",
        answer: "Authentication verifies identity (who you are) using methods like JWT tokens, OAuth, or session cookies. Authorization determines permissions (what you can access) using role-based (RBAC) or attribute-based (ABAC) access control. Implement secure password hashing (bcrypt), HTTPS, token expiration, refresh tokens, and protect against common attacks (XSS, CSRF). Store sensitive data securely and never expose credentials.",
        tips: ["Differentiate authentication from authorization", "Mention security best practices", "Discuss token management strategies"]
      },
      {
        question: "Explain database indexing and its impact on performance.",
        answer: "Indexes are data structures (typically B-trees) that improve query performance by creating a searchable path to data. They speed up SELECT queries and WHERE clauses but slow down INSERT/UPDATE/DELETE operations due to index maintenance. Best practices: index foreign keys, frequently queried columns, and JOIN columns. Avoid over-indexing. Use EXPLAIN to analyze query performance and choose appropriate index types (B-tree, Hash, Full-text).",
        tips: ["Explain the trade-offs of indexing", "Mention different index types", "Discuss query optimization strategies"]
      },
      {
        question: "What are microservices and what are their advantages and disadvantages?",
        answer: "Microservices architecture splits applications into small, independent services that communicate via APIs. Advantages: independent deployment, technology flexibility, scalability, fault isolation. Disadvantages: increased complexity, network latency, distributed data management, harder testing and debugging. Best for large, complex applications with multiple teams. Requires strong DevOps practices, monitoring, and orchestration (Kubernetes).",
        tips: ["Compare with monolithic architecture", "Mention communication patterns (REST, gRPC, message queues)", "Discuss when microservices are appropriate"]
      }
    ],
    fullstack: [
      {
        question: "How do you ensure data consistency between frontend and backend?",
        answer: "Strategies include: defining clear API contracts, using TypeScript for type safety across layers, implementing optimistic updates with rollback mechanisms, WebSocket for real-time sync, state management (Redux, Zustand), API validation on both sides, versioning, and comprehensive testing. Consider eventual consistency for distributed systems and use proper error handling to maintain data integrity.",
        tips: ["Mention specific tools and patterns", "Discuss optimistic vs pessimistic updates", "Highlight importance of validation"]
      },
      {
        question: "Explain the concept of server-side rendering vs client-side rendering.",
        answer: "CSR: JavaScript renders content in browser, better for interactive SPAs, slower initial load, worse SEO. SSR: Server generates HTML, faster first paint, better SEO and social media sharing. Modern approaches include Static Site Generation (SSG) and Incremental Static Regeneration (ISR). Next.js and similar frameworks offer hybrid approaches, combining SSR/SSG/CSR benefits based on page requirements.",
        tips: ["Discuss performance implications", "Mention SEO considerations", "Explain hybrid approaches (Next.js, Remix)"]
      },
      {
        question: "What strategies do you use for API versioning?",
        answer: "Common strategies: URL versioning (/api/v1/users), header versioning (Accept: application/vnd.api+json;version=1), query parameter versioning (?version=1). Best practices: maintain backward compatibility when possible, deprecate old versions gradually with clear timelines, document changes thoroughly, use semantic versioning, and communicate changes to API consumers well in advance.",
        tips: ["Compare different versioning approaches", "Discuss deprecation strategies", "Mention documentation importance"]
      },
      {
        question: "How do you handle state management in large applications?",
        answer: "Approaches depend on complexity: React Context for simple shared state, Redux/Redux Toolkit for complex global state with predictable updates, Zustand for lightweight centralized state, React Query/SWR for server state management. Key principles: separate UI state from server state, avoid prop drilling, use selectors for performance, implement proper state normalization, and choose tools appropriate to application scale.",
        tips: ["Mention different state management solutions", "Discuss when to use each approach", "Highlight performance considerations"]
      },
      {
        question: "Explain caching strategies at different layers of an application.",
        answer: "Client-side: browser cache (Cache-Control headers), service workers, local/session storage. Server-side: application-level caching (Redis, Memcached), database query caching. CDN caching for static assets. Strategies include: cache invalidation (time-based, event-based), cache-aside pattern, write-through cache. Consider cache coherence in distributed systems and implement proper cache warming and monitoring.",
        tips: ["Describe caching at multiple layers", "Mention cache invalidation strategies", "Discuss CDN usage"]
      }
    ],
    devops: [
      {
        question: "Explain the CI/CD pipeline and its components.",
        answer: "CI/CD automates software delivery. CI (Continuous Integration): developers merge code frequently, automated builds and tests run on each commit. CD (Continuous Deployment/Delivery): automated deployment to staging/production. Components include: version control, build automation, automated testing, artifact repository, deployment automation, monitoring. Tools: Jenkins, GitHub Actions, GitLab CI, CircleCI.",
        tips: ["Explain CI vs CD distinction", "Mention specific tools and stages", "Discuss benefits and best practices"]
      },
      {
        question: "What is Infrastructure as Code (IaC) and why is it important?",
        answer: "IaC manages infrastructure through code rather than manual processes. Tools like Terraform, CloudFormation, or Ansible define infrastructure declaratively. Benefits: version control for infrastructure, reproducibility, consistency across environments, automated provisioning, documentation through code, and easier disaster recovery. Enables GitOps workflows and treats infrastructure changes like application code with reviews and testing.",
        tips: ["Mention specific IaC tools", "Discuss declarative vs imperative approaches", "Highlight version control benefits"]
      },
      {
        question: "How do you monitor and debug issues in a distributed system?",
        answer: "Use comprehensive observability: logging (centralized with ELK/Splunk), metrics (Prometheus, Grafana), distributed tracing (Jaeger, Zipkin), APM tools (New Relic, Datadog). Implement correlation IDs for request tracking, health checks, alerting with proper thresholds, and post-mortem analysis. Challenges include: clock synchronization, complex failure modes, and cascading failures. Use structured logging and proper instrumentation.",
        tips: ["Mention the three pillars of observability", "Discuss distributed tracing", "Highlight importance of correlation IDs"]
      },
      {
        question: "Explain containerization and orchestration with Docker and Kubernetes.",
        answer: "Docker packages applications with dependencies into containers for consistency across environments. Kubernetes orchestrates containers at scale: automatic scaling, self-healing, load balancing, rolling updates, service discovery. Key concepts: Pods (container groups), Services (networking), Deployments (desired state), ConfigMaps/Secrets (configuration). Benefits: portability, resource efficiency, microservices support, and simplified deployment.",
        tips: ["Explain containers vs VMs", "Describe Kubernetes key concepts", "Discuss benefits for production deployments"]
      },
      {
        question: "What are blue-green deployments and canary releases?",
        answer: "Blue-green: maintain two identical production environments. Deploy to inactive environment (green), test, then switch traffic from active (blue). Instant rollback if issues arise. Canary: gradually roll out changes to small subset of users, monitor metrics, then progressively increase traffic. Both reduce deployment risk. Canary is better for incremental validation; blue-green for instant rollback capability.",
        tips: ["Compare both deployment strategies", "Mention when to use each", "Discuss monitoring requirements"]
      }
    ]
  };

  const baseQuestions: QuestionWithAnswer[] = [
    {
      question: "Explain the concept of version control and branching strategies.",
      answer: "Version control (Git) tracks code changes over time. Common branching strategies: Git Flow (master, develop, feature branches), GitHub Flow (main branch with feature branches), trunk-based development (short-lived branches). Best practices: meaningful commit messages, frequent commits, code reviews via pull requests, protected main branch, and clear branching conventions for features, hotfixes, and releases.",
      tips: ["Mention specific branching models", "Discuss merge vs rebase", "Highlight importance of code reviews"]
    },
    {
      question: "What are some common security vulnerabilities in web applications and how do you prevent them?",
      answer: "OWASP Top 10 includes: SQL Injection (use parameterized queries), XSS (sanitize input, Content Security Policy), CSRF (tokens, SameSite cookies), insecure authentication, sensitive data exposure, broken access control. Prevention: input validation, output encoding, HTTPS, security headers, regular updates, security audits, principle of least privilege, and proper error handling without exposing system details.",
      tips: ["Reference OWASP Top 10", "Mention specific prevention techniques", "Discuss security testing tools"]
    },
    {
      question: "How do you ensure code quality in your projects?",
      answer: "Multiple approaches: code reviews, linting (ESLint, Prettier), static analysis, unit/integration tests with good coverage, TypeScript for type safety, CI/CD with automated testing, consistent coding standards, documentation, pair programming, and regular refactoring. Use tools like SonarQube for code quality metrics. Emphasize test-driven development (TDD) and maintain a definition of done that includes quality criteria.",
      tips: ["Mention specific tools and practices", "Discuss automated vs manual quality checks", "Highlight continuous improvement mindset"]
    }
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
const generateSystemDesignQuestions = (roleType: string): QuestionWithAnswer[] => {
  const questionBank: Record<string, QuestionWithAnswer[]> = {
    frontend: [
      {
        question: "Design a real-time collaborative document editor like Google Docs.",
        answer: "Key components: WebSocket/WebRTC for real-time communication, Operational Transformation (OT) or CRDT for conflict resolution, efficient diffing algorithm, presence indicators, version history with snapshots. Architecture: client-side editor (e.g., Quill, Slate), backend coordination server, database for persistence, caching layer. Consider: cursor positions, selection sync, offline mode, scalability with rooms/channels, and conflict-free merging of concurrent edits.",
        tips: ["Discuss conflict resolution algorithms (OT vs CRDT)", "Mention scalability for multiple users", "Consider offline capabilities and sync", "Explain how to handle concurrent edits"]
      },
      {
        question: "How would you implement infinite scrolling with optimal performance?",
        answer: "Use Intersection Observer API to detect when user approaches bottom, implement virtual scrolling/windowing (only render visible items), pagination with cursor-based approach, debounce scroll events, lazy load images, maintain fixed item heights for performance. Libraries: react-window, react-virtualized. Consider: skeleton loading states, error handling, 'load more' button fallback, SEO implications (hydration), and memory management for large lists.",
        tips: ["Explain virtual scrolling concept", "Discuss Intersection Observer API", "Mention performance optimization techniques", "Consider accessibility and SEO"]
      }
    ],
    backend: [
      {
        question: "Design a URL shortening service like bit.ly with analytics.",
        answer: "Components: API for creating/retrieving URLs, hash generation (base62 encoding), database (key-value store like Redis for cache, SQL/NoSQL for persistence), analytics tracking (clicks, locations, referrers). Architecture: load balancer, stateless API servers, distributed cache, database with replication. Consider: collision handling, custom aliases, expiration, rate limiting, global distribution (CDN), and real-time analytics with message queues.",
        tips: ["Discuss hash generation strategies", "Explain database choice and schema", "Consider scalability and caching", "Mention analytics tracking approach"]
      },
      {
        question: "Design a distributed cache system like Redis.",
        answer: "Features: in-memory key-value store, data structures (strings, lists, sets, hashes), persistence (RDB snapshots, AOF logs), replication for high availability, clustering for horizontal scaling, pub/sub messaging. Architecture: master-replica setup, consistent hashing for data distribution, eviction policies (LRU, LFU), TTL support. Challenges: cache invalidation, cache stampede prevention, network partitioning (split-brain), and ensuring data consistency.",
        tips: ["Explain caching strategies and eviction policies", "Discuss replication and consistency", "Mention partitioning and sharding", "Consider failure scenarios"]
      }
    ],
    fullstack: [
      {
        question: "Design a social media platform like Twitter.",
        answer: "Components: user service, tweet service, timeline service (feed generation), notification service, media service, search service. Architecture: microservices, message queues (Kafka), databases (SQL for users, NoSQL for tweets), caching (Redis), CDN for media, search engine (Elasticsearch). Key challenges: feed generation at scale (fan-out on write vs read), real-time updates, trending topics, load balancing, and handling viral content spikes.",
        tips: ["Discuss feed generation strategies", "Explain microservices architecture", "Consider scalability for millions of users", "Mention real-time features implementation"]
      },
      {
        question: "Design a ride-sharing application like Uber.",
        answer: "Components: user service, driver service, matching service, location tracking (GPS), pricing service, payment service, notifications. Architecture: microservices, real-time location updates (WebSocket), geospatial database (PostGIS), surge pricing algorithm, route optimization, ETAs. Key aspects: matching algorithm (nearest drivers), real-time tracking with high frequency updates, handling peak demand, payment processing, driver/rider safety features, and global scalability.",
        tips: ["Discuss geolocation and mapping services", "Explain matching algorithm", "Consider real-time tracking at scale", "Mention surge pricing mechanism"]
      }
    ],
    devops: [
      {
        question: "Design a CI/CD pipeline for a microservices architecture.",
        answer: "Pipeline stages: source control trigger, automated build (Docker images), unit/integration tests, security scanning, artifact storage, deployment to staging, automated tests in staging, approval gates, production deployment (blue-green/canary). Tools: Jenkins/GitLab CI, Kubernetes for orchestration, Helm for packaging, ArgoCD for GitOps. Challenges: service dependencies, versioning, rollback strategies, environment parity, secrets management, and coordinating multi-service releases.",
        tips: ["Describe each pipeline stage", "Mention tools and technologies", "Discuss deployment strategies", "Consider rollback and monitoring"]
      },
      {
        question: "Design a monitoring and alerting system for a distributed application.",
        answer: "Components: metrics collection (Prometheus), log aggregation (ELK/Loki), distributed tracing (Jaeger), visualization (Grafana), alerting (PagerDuty, Opsgenie). Collect: application metrics, infrastructure metrics, business metrics, error rates, latency. Architecture: agents on each service, time-series database, alert manager, dashboard. Key aspects: correlation IDs, SLIs/SLOs/SLAs, anomaly detection, alert fatigue prevention, on-call rotation, and incident response workflows.",
        tips: ["Explain the three pillars of observability", "Discuss metrics to track", "Mention alerting strategies", "Consider reducing false positives"]
      }
    ],
    data: [
      {
        question: "Design a recommendation system for an e-commerce platform.",
        answer: "Approaches: collaborative filtering (user-based, item-based), content-based filtering, hybrid models. Components: data collection layer, feature engineering, ML models (matrix factorization, deep learning), real-time serving layer, A/B testing framework. Architecture: data pipeline (batch/streaming), model training infrastructure, feature store, recommendation API, caching. Consider: cold start problem, diversity vs relevance, explainability, personalization, and handling sparse data.",
        tips: ["Discuss different recommendation algorithms", "Explain offline vs online learning", "Mention cold start solutions", "Consider evaluation metrics"]
      },
      {
        question: "Design a data pipeline for processing real-time analytics.",
        answer: "Components: data ingestion (Kafka, Kinesis), stream processing (Flink, Spark Streaming), storage (data lake, data warehouse), analytics engine, visualization layer. Architecture: Lambda (batch + stream) or Kappa (stream only) architecture, event sourcing, CDC (Change Data Capture), data quality checks, schema evolution. Challenges: exactly-once processing, late-arriving data, windowing strategies, state management, backpressure handling, and maintaining data lineage.",
        tips: ["Explain Lambda vs Kappa architecture", "Discuss stream processing frameworks", "Mention data consistency challenges", "Consider scalability and fault tolerance"]
      }
    ]
  };

  const baseQuestions: QuestionWithAnswer[] = [
    {
      question: "Design a chat application with real-time messaging capabilities.",
      answer: "Components: WebSocket server for bi-directional communication, message queue (Kafka/RabbitMQ), database (NoSQL for messages, SQL for users), media storage (S3), presence service, notification service. Architecture: horizontal scaling with session affinity, message persistence, delivery guarantees (at-least-once), read receipts, typing indicators. Consider: group chats, message history, search functionality, end-to-end encryption, offline support, and handling message ordering in distributed systems.",
      tips: ["Discuss WebSocket scaling challenges", "Explain message delivery guarantees", "Consider presence and typing indicators", "Mention security and encryption"]
    },
    {
      question: "How would you design a rate limiting system for an API?",
      answer: "Algorithms: Token Bucket (smooth rate), Leaky Bucket (constant rate), Fixed Window (simple but bursty), Sliding Window Log (accurate but memory-intensive), Sliding Window Counter (balanced). Implementation: in-memory (Redis), middleware layer, per-user/IP/API key. Architecture: distributed rate limiting with Redis, graceful degradation, return 429 status, include rate limit headers. Consider: burst allowance, different tiers, bypass for internal services, and monitoring rate limit hits.",
      tips: ["Compare different rate limiting algorithms", "Discuss distributed implementation", "Mention HTTP headers and status codes", "Consider different rate limit tiers"]
    }
  ];

  return [...(questionBank[roleType] || baseQuestions), ...baseQuestions].slice(0, 2);
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
