# DevOps & SRE Voice Interview Coach

An advanced, AI-powered voice interview simulator designed to help you master your DevOps and Site Reliability Engineering interviews. This application provides a realistic practice environment where you can speak your answers and receive instant, detailed feedback on your technical knowledge, communication skills, and delivery.

![DevOps & SRE Voice Interview Coach UI](https://storage.googleapis.com/aistudio-ux-team/prompts/589584e0-f203-455b-bfa1-e6f4325a7a7a.png)

## ✨ Features

### 🚀 Dynamic Interview Setup
- **Custom-Tailored Sessions**: Configure your interview practice by specifying a target company and role (e.g., Senior SRE at Google).
- **Flexible Question Sources**:
    - **AI-Generated**: Let the AI generate relevant questions based on your configuration.
    - **Manual Input**: Practice with your own list of questions by simply pasting them in.
- **AI Question Tuning**:
    - **Difficulty Levels**: Choose from 'Easy', 'Intermediate', or 'Advanced' to match your skill level.
    - **Topic Focus**: Specify key topics like `Kubernetes, CI/CD, Terraform, Observability` to get highly relevant questions.

### 🎙️ Realistic Voice Simulation
- **Speak, Don't Type**: Answer questions using your voice with a simple and intuitive record/stop interface, mimicking a real-world interview.
- **Accurate AI Transcription**: Leverages the Gemini API to accurately transcribe your spoken answers into text for analysis.

### 🧠 Instant, Multi-Faceted Feedback
Immediately after each answer, receive a detailed performance analysis broken down into five key categories:
1.  **Overall Performance**: A holistic score and summary.
2.  **Technical Depth & Accuracy**: Assesses the correctness and depth of your technical knowledge.
3.  **Communication**: Evaluates the clarity and structure of your explanation.
4.  **Answering**: Measures how directly and effectively you addressed the question.
5.  **Flow**: Rates how well-structured and easy-to-follow your answer was.

For each category, you receive:
- **A Score (1-10)**: For quick performance assessment.
- **A Constructive Comment**: Detailed feedback on what you did well and where you can improve.
- **A Pro Tip for a 10/10**: A specific, actionable tip to help you achieve a perfect score.

### 💡 Learn from the Best
- **Get Ideal Answers**: If you're stuck or want to see an expert response, use the "Get Ideal Answer" feature. The AI will generate a comprehensive, well-structured answer to the current question, providing a benchmark for excellence.

### 📊 Comprehensive Post-Interview Dashboard
- **Performance Summary**: A beautiful dashboard summarizing your performance, including your average overall score and a breakdown of scores by category.
- **Full Interview Review**: Revisit the entire interview transcript, including every question, your answer, and the detailed feedback card for each response.
- **AI-Identified Improvement Areas**: The AI analyzes your performance across all questions to identify the top 3 technical concepts you should focus on studying.
- **Track Your Progress**: A score trend chart visualizes your overall performance across multiple interview sessions, allowing you to see your improvement over time. All session history is saved locally in your browser.

## 🛠️ How It Works

1.  **Configure**: Set up your mock interview by defining the role, company, and question source.
2.  **Speak**: Record your answer to each question presented by the AI interviewer.
3.  **Review**: Get instant, detailed feedback on your performance after each answer.
4.  **Learn**: Use the feedback and "Get Ideal Answer" feature to refine your knowledge and delivery.
5.  **Analyze**: After the interview, dive into the dashboard to review your full performance, identify weak spots, and track your long-term progress.

## 💻 Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI Engine**: Google Gemini API (`gemini-2.5-flash` for speed and `gemini-2.5-pro` for high-quality answers)
-   **Browser APIs**: Web Audio API (`getUserMedia`, `MediaRecorder`) for voice capture.

## 🚀 Getting Started

This is a web-based application. No installation is required.

1.  Open the application in your browser.
2.  Grant the necessary microphone permissions when prompted.
3.  Configure your first interview and start practicing!
