interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
}

interface ResumeData {
  content: string;
  lastUpdated: Date;
}

class ChatService {
  private resumeData: ResumeData | null = null;
  private readonly RESUME_PDF_PATH = '/resume.pdf'; // Place your resume.pdf in public folder
  private readonly OLLAMA_API_URL = 'http://localhost:5173/api/chat'; // Ollama server endpoint

  private readonly TOGETHER_API_KEY = "YOUR_TOGETHER_API_KEY"; 
private readonly TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";


  constructor() {
    this.loadResumeData();
  }

  private async loadResumeData(): Promise<void> {
    try {
      const response = await fetch(this.RESUME_PDF_PATH);
      if (!response.ok) {
        throw new Error('Resume PDF not found. Please add your resume.pdf to the public folder.');
      }

      const arrayBuffer = await response.arrayBuffer();
      const pdfText = await this.extractTextFromPDF(arrayBuffer);

      this.resumeData = {
        content: pdfText,
        lastUpdated: new Date()
      };

      console.log('✅ Resume loaded and parsed successfully');
    } catch (error) {
      console.error('❌ Error loading resume:', error);
      this.resumeData = {
        content: "Resume data could not be loaded. Please ensure your resume.pdf is in the public folder.",
        lastUpdated: new Date()
      };
    }
  }

  private async extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
    try {
      const pdfParse = await import('pdf-parse');
      const pdf = await pdfParse.default(arrayBuffer);
      return pdf.text;
    } catch (error) {
      console.error('❌ Error parsing PDF:', error);
      return "Error parsing resume PDF. Please ensure the file is a valid PDF.";
    }
  }


private async callLLaMA(userQuestion: string, resumeContent: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userQuestion })
    });

    const data = await response.json();
    return data.answer || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("❌ API call to Python backend failed:", error);
    return "I'm experiencing technical difficulties. Please try again later.";
  }
}



  async sendMessage(message: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    if (!this.resumeData) {
      return "Resume data is still loading. Please try again in a moment.";
    }

    if (!this.resumeData.content || this.resumeData.content.includes("could not be loaded")) {
      return "I'm sorry, but I couldn't load the resume data. Please ensure your resume.pdf file is placed in the public folder of this application.";
    }

    return await this.callLLaMA(message, this.resumeData.content);
  }

  async reloadResume(): Promise<void> {
    await this.loadResumeData();
  }

  isResumeLoaded(): boolean {
    return this.resumeData !== null && !this.resumeData.content.includes("could not be loaded");
  }
}

export const chatService = new ChatService();
export type { ChatMessage };
