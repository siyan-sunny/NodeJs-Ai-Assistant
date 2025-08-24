# AI Resume Chat Assistant

An intelligent chat assistant that analyzes your resume PDF and answers questions about your professional background using AI.

## Setup Instructions

### 1. Add Your Resume
- Place your resume PDF file as `resume.pdf` in the `public` folder
- The AI will automatically parse and analyze your resume content

### 2. Configure AI API
- Copy `.env.example` to `.env`
- Add your API key for either:
  - **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
  - **Anthropic Claude**: Get your API key from [Anthropic Console](https://console.anthropic.com/)

```bash
# For OpenAI (recommended)
VITE_OPENAI_API_KEY=s

# OR for Anthropic Claude
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

## Features

- **AI-Powered Analysis**: Uses GPT-3.5 or Claude to understand your resume
- **Natural Conversations**: Ask questions in natural language
- **Professional Focus**: Optimized for showcasing professional qualifications
- **Real-time Responses**: Instant, intelligent answers about your background
- **Responsive Design**: Works perfectly on all devices

## How It Works

1. The app automatically loads and parses your `resume.pdf`
2. AI models analyze the content and understand your professional profile
3. Users can ask questions about your experience, skills, education, projects, etc.
4. The AI provides detailed, accurate responses based on your resume

## Supported Question Types

- Work experience and career history
- Technical skills and expertise
- Educational background
- Projects and achievements
- Certifications and qualifications
- Contact information
- Career goals and objectives

## API Costs

- OpenAI GPT-3.5: ~$0.002 per conversation
- Anthropic Claude: ~$0.003 per conversation

Both services offer free tiers for testing.