# 🎯 JobAnalyzer - AI-Powered Job Analysis Platform

**Transform any job posting into your personal interview preparation toolkit** - An intelligent job analysis platform that helps job seekers analyze job descriptions, generate personalized interview questions, practice coding challenges, and get compatibility scores to land their dream job.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

## ✨ Features

### 🔍 **Intelligent Job Analysis**
- **Skills Extraction** - Automatically identify required and preferred skills from any job posting
- **Experience Level Detection** - Determine the seniority level (entry, mid, senior, lead)
- **Tech Stack Analysis** - Extract specific technologies and frameworks mentioned
- **Company Insights** - Analyze company size, industry, and culture indicators
- **Role Type Classification** - Categorize roles (frontend, backend, fullstack, devops, etc.)

### ❓ **Smart Interview Question Generation**
- **Behavioral Questions** - Role-specific scenarios and competency-based questions
- **Technical Questions** - In-depth technical knowledge assessment based on job requirements
- **Coding Challenges** - Interactive programming problems with difficulty levels (Easy/Medium/Hard)
- **System Design Questions** - Architecture and design thinking challenges for senior roles
- **Copy-to-Clipboard** - Easy sharing and note-taking functionality

### 💻 **Interactive Coding Practice**
- **Curated Challenges** - Programming problems tailored to the specific job role
- **Detailed Solutions** - Step-by-step explanations with optimal approaches
- **Complexity Analysis** - Time and space complexity breakdowns
- **Progress Tracking** - Monitor completed challenges and preparation progress
- **Hints System** - Guided assistance when you're stuck

### 📊 **Multi-Dimensional Compatibility Scoring**
- **Overall Match** - Comprehensive compatibility percentage with the role
- **Skills Alignment** - How well your skills match the requirements
- **Experience Level Fit** - Seniority level compatibility assessment
- **Tech Stack Match** - Technology alignment scoring
- **Culture Fit** - Soft skills and company culture compatibility
- **Visual Analytics** - Interactive charts and detailed breakdowns

### 🎯 **Comprehensive Interview Preparation**
- **Preparation Dashboard** - Centralized view of all interview materials
- **Practice Sessions** - Focused practice with different question types
- **Progress Monitoring** - Track your preparation across multiple dimensions
- **Quick Navigation** - Seamless switching between analysis and practice modes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mandadikamalakarreddy/jobAnalyzer.git
cd jobAnalyzer
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173` to start analyzing job postings.

## 🎯 How It Works

### 1. **Paste Job Description**
Simply copy and paste any job posting from LinkedIn, Indeed, company websites, or recruitment emails. The platform accepts job descriptions of any length and format.

### 2. **AI-Powered Analysis**
Our intelligent analysis engine:
- Extracts key skills and technologies
- Identifies experience requirements
- Analyzes company culture indicators
- Generates role-specific interview questions
- Creates personalized coding challenges

### 3. **Comprehensive Results**
Get detailed insights including:
- Skills breakdown (required vs. preferred)
- Experience level assessment
- Technical stack analysis
- Interview question categories
- Compatibility scoring

### 4. **Interview Preparation**
Access your personalized preparation toolkit:
- Practice behavioral questions
- Solve coding challenges
- Review technical concepts
- Track your progress

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **React Router 7** - Modern routing with data loading
- **TypeScript** - Type-safe development with comprehensive interfaces
- **TailwindCSS 4** - Utility-first CSS framework for modern UI
- **Vite** - Lightning-fast build tool with HMR

### AI & Analysis
- **Natural Language Processing** - Job description parsing and skill extraction
- **Pattern Recognition** - Experience level and role type classification
- **Question Generation** - Context-aware interview question creation
- **Compatibility Algorithms** - Multi-dimensional scoring system

### Data & Storage
- **Puter KV Store** - Secure, persistent data storage
- **Local Storage** - Client-side session management
- **JSON Processing** - Structured data handling

### Build & Development
- **Vite** - Modern build tool with HMR
- **ESBuild** - Fast JavaScript bundling
- **TypeScript Compiler** - Type checking and compilation
- **PostCSS** - CSS processing and optimization

## 📁 Project Structure

```
jobanalyzer/
├── app/                          # Main application code
│   ├── components/              # Reusable UI components
│   │   ├── JobUploader.tsx     # Job description input component
│   │   ├── JobAnalysis.tsx     # Analysis results display
│   │   ├── QuestionGenerator.tsx # Interview questions interface
│   │   ├── CodingChallenge.tsx # Interactive coding problems
│   │   ├── CompatibilityScore.tsx # Scoring visualization
│   │   └── Navbar.tsx          # Navigation component
│   ├── routes/                  # Route components
│   │   ├── home.tsx            # Dashboard with recent analyses
│   │   ├── analyze-job.tsx     # Job description input page
│   │   ├── job-analysis.tsx    # Detailed analysis view
│   │   ├── interview-prep.tsx  # Interview preparation interface
│   │   ├── auth.tsx            # Authentication
│   │   └── wipe.tsx            # Data cleanup utility
│   ├── lib/                     # Utility libraries
│   │   ├── ai-analyzer.ts      # AI analysis engine
│   │   ├── puter.ts            # Data storage and authentication
│   │   └── utils.ts            # Common utilities
│   └── constants/              # App constants and configurations
├── public/                      # Static assets
│   ├── images/                 # UI images and backgrounds
│   └── icons/                  # SVG icons and graphics
├── types/                       # TypeScript definitions
│   └── index.d.ts              # Global type definitions
└── build/                      # Production build output
```

## � User Interface

The platform features a modern, gradient-based design with:
- **Intuitive Dashboard** - Overview of all analyzed jobs with quick access
- **Interactive Analysis** - Tabbed interface for different analysis aspects
- **Visual Scoring** - Canvas-based charts and progress indicators
- **Responsive Design** - Seamless experience across all devices
- **Smooth Animations** - Hover effects and transitions for better UX

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with HMR

# Building
npm run build           # Create production build
npm run start           # Start production server

# Type Checking
npm run typecheck       # Run TypeScript type checking

# Post Install
npm run postinstall     # Setup post-installation tasks
```

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t jobanalyzer .

# Run the container
docker run -p 3000:3000 jobanalyzer
```


##  Deploy to Vercel

### One-Click Deploy

The easiest way to deploy this application is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Mandadikamalakarreddy/jobAnalyzer)

### Manual Deployment

1. **Install Vercel CLI** (if not already installed)
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from your project directory**
```bash
vercel
```

4. **For production deployment**
```bash
vercel --prod
```

### Vercel Configuration

The project includes a pre-configured `vercel.json` file with optimal settings:
- **Build Command**: `npm run build`
- **Output Directory**: `build/client`
- **SPA Routing**: Configured to handle client-side routing
- **Asset Caching**: Optimized cache headers for static assets

### Environment Setup (Optional)

If your application requires environment variables:

1. In your Vercel dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add any required variables (e.g., API keys)
4. Redeploy the application

### Post-Deployment

After deployment:
- Your app will be available at `https://your-project.vercel.app`
- Automatic deployments on every push to main branch
- Preview deployments for pull requests
- Zero-config SSL/HTTPS

### Deployment Platforms

The application can be deployed to:
- **Vercel** - Optimal for React applications (recommended)
- **Netlify** - JAMstack deployment platform
- **AWS ECS** - Elastic Container Service
- **Google Cloud Run** - Serverless containers
- **Azure Container Apps** - Managed container platform
- **Railway** - Modern deployment platform
- **Fly.io** - Global application platform

## 📊 Use Cases

### For Job Seekers
- **Interview Preparation** - Get role-specific questions and practice materials
- **Skill Gap Analysis** - Identify missing skills and learning opportunities
- **Application Strategy** - Understand job requirements better before applying
- **Confidence Building** - Practice with realistic interview scenarios

### For Career Coaches
- **Client Preparation** - Generate customized interview materials
- **Skills Assessment** - Analyze job market requirements
- **Training Programs** - Create targeted learning paths

### For Recruiters
- **Question Banks** - Generate interview questions for different roles
- **Candidate Assessment** - Understand role requirements better
- **Process Optimization** - Standardize interview preparation

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Test new features thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React Router architecture
- Powered by AI for intelligent job analysis
- Designed with user experience and interview success in mind
- Open source and community-driven

---

**Built with  for job seekers worldwide** | [Report Bug](https://github.com/Mandadikamalakarreddy/jobAnalyzer/issues) | [Request Feature](https://github.com/Mandadikamalakarreddy/jobAnalyzer/issues)
