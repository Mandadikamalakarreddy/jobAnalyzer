# 🎯 Resumind - AI-Powered Resume Analyzer

**Smart feedback for your dream jobs** - An intelligent resume analysis platform that helps job seekers optimize their resumes using AI-powered insights and ATS (Applicant Tracking System) compatibility scoring.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

## ✨ Features

### 🤖 AI-Powered Analysis
- **Comprehensive Resume Scoring** - Get detailed feedback across multiple dimensions
- **ATS Compatibility Check** - Ensure your resume passes through Applicant Tracking Systems
- **Smart Recommendations** - AI-generated tips to improve your resume's effectiveness

### 📊 Multi-Dimensional Scoring
- **Overall Score** - Comprehensive resume rating (0-100)
- **ATS Score** - Applicant Tracking System compatibility
- **Tone & Style** - Professional language and presentation assessment
- **Content Quality** - Relevance and impact of your content
- **Structure & Format** - Organization and visual appeal
- **Skills Matching** - Alignment with job requirements

### 🎨 Modern User Experience
- **Intuitive Interface** - Clean, modern design with TailwindCSS
- **Drag & Drop Upload** - Easy PDF resume upload with validation
- **Real-time Processing** - Live feedback and analysis
- **Responsive Design** - Works seamlessly on all devices
- **Visual Analytics** - Score gauges, progress indicators, and detailed breakdowns

### 🔐 Secure & Private
- **User Authentication** - Secure access to your resume data
- **Data Privacy** - Your resumes are stored securely
- **Session Management** - Persistent user sessions with Zustand

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mandadikamalakarreddy/ai-resume-analyzer.git
cd ai-resume-analyzer
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
Navigate to `http://localhost:5173` to see the application in action.

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **React Router 7** - Modern routing with data loading
- **TypeScript** - Type-safe development
- **TailwindCSS 4** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool

### AI & Processing
- **PDF.js** - Client-side PDF processing and text extraction
- **AI Integration** - Resume analysis and scoring algorithms
- **Image Processing** - PDF to image conversion for previews

### State Management
- **Zustand** - Lightweight state management
- **React Dropzone** - File upload handling

### Build & Development
- **Vite** - Modern build tool with HMR
- **ESBuild** - Fast JavaScript bundling
- **TypeScript Compiler** - Type checking and compilation

## 📁 Project Structure

```
resumeanalyser/
├── app/                          # Main application code
│   ├── components/              # Reusable UI components
│   │   ├── ATS.tsx             # ATS score display component
│   │   ├── FileUploader.tsx    # Drag & drop file upload
│   │   ├── ScoreGauge.tsx      # Visual score indicators
│   │   └── ...
│   ├── routes/                  # Route components
│   │   ├── home.tsx            # Dashboard with resume list
│   │   ├── upload.tsx          # Resume upload page
│   │   ├── resume.tsx          # Detailed analysis view
│   │   └── auth.tsx            # Authentication
│   ├── lib/                     # Utility libraries
│   │   ├── pdf2image.ts        # PDF processing utilities
│   │   ├── puter.ts            # Data storage and AI
│   │   └── utils.ts            # Common utilities
│   └── constants/              # App constants and types
├── public/                      # Static assets
│   ├── images/                 # UI images and backgrounds
│   └── icons/                  # SVG icons
├── types/                       # TypeScript definitions
└── build/                      # Production build output
```

## 🎯 How It Works

1. **Upload Resume** - Users upload their PDF resume through the drag-and-drop interface
2. **AI Processing** - The system extracts text and analyzes content using AI algorithms
3. **Multi-Dimensional Scoring** - Resume is scored across 5 key dimensions
4. **Detailed Feedback** - Users receive specific, actionable recommendations
5. **Track Progress** - Compare multiple resume versions and track improvements

## 📸 Screenshots

The application features a modern, intuitive interface with:
- Clean dashboard showing all analyzed resumes
- Detailed scoring breakdowns with visual indicators
- Professional color-coded feedback system
- Responsive design that works on all devices

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
npm run postinstall     # Copy PDF.js worker files
```

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t resumind .

# Run the container
docker run -p 3000:3000 resumind
```

### Deployment Platforms
The containerized application can be deployed to:
- **AWS ECS** - Elastic Container Service
- **Google Cloud Run** - Serverless containers
- **Azure Container Apps** - Managed container platform
- **Heroku** - Platform as a Service
- **Railway** - Modern deployment platform
- **Fly.io** - Global application platform

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React Router architecture
- Powered by AI for intelligent resume analysis
- Designed with user experience in mind
- Open source and community-driven

---

**Built with ❤️ for job seekers worldwide** | [Report Bug](https://github.com/Mandadikamalakarreddy/ai-resume-analyzer/issues) | [Request Feature](https://github.com/Mandadikamalakarreddy/ai-resume-analyzer/issues)
