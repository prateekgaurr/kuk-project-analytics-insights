# AI Analytics Insights Dashboard

A powerful, AI-driven web application that transforms raw analytics data into actionable insights for cross-functional teams. Built with modern web technologies and powered by Google's Gemini AI.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Overview


The **AI Analytics Insights Dashboard** is designed to bridge the gap between complex data and decision-making. By leveraging the advanced capabilities of **Google's Gemini AI**, this tool analyzes uploaded analytics data (CSV, JSON, Excel) and generates tailored recommendations for specific organizational departments: **Product**, **Business**, **Tech**, and **Marketing**.

This application runs entirely on the client-side, ensuring ease of deployment and privacy, as your data flows directly from your browser to the AI API without intermediate storage.

> **Developed by:** Prateek Gaur  
> **Enrollment No.:** 24DEOJULYMBA00088  
> **Course:** MBA IT 3rd Semester Project

## ✨ Key Features

- **🤖 AI-Powered Analysis**: Utilizes `gemini-2.0-flash` to intelligently parse and interpret complex analytics datasets.
- **📂 Multi-Format Support**: Drag-and-drop support for **CSV**, **JSON**, and **Excel (.xlsx, .xls)** files.
- **🎯 Team-Specific Insights**:
  - **Product Team**: User experience, feature usage, and journey analysis.
  - **Business Team**: Revenue opportunities, conversion rates, and growth metrics.
  - **Tech Team**: Performance bottlenecks, infrastructure health, and load times.
  - **Marketing Team**: Campaign effectiveness, traffic sources, and engagement.
- **⚡ Client-Side Processing**: No backend server required. All processing happens in the browser.
- **💾 Local Configuration**: Persists your API key and team preferences securely in your browser's local storage.
- **📤 Export & Share**: Easily share results via email or export/print professional reports.
- **🎨 Modern UI/UX**: A responsive, clean interface with smooth animations and dark mode aesthetics.

## 🌐 Access the Application

There are two ways to use this application:

1.  **Online (Recommended)**: Visit the live website at  
    � **[https://ai-analytics-dash-kuk.netlify.app/](https://ai-analytics-dash-kuk.netlify.app/)**

2.  **Local Version**: You can run the application locally on your machine by following the installation steps below.

## �🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge).
- A valid **Google Gemini API Key**. You can get one from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Installation & Usage

1.  **Clone the repository** (or download usage files):
    ```bash
    git clone https://github.com/yourusername/ai-analytics-dashboard.git
    cd ai-analytics-dashboard
    ```

2.  **Open the application**:
    Simply open the `index.html` file in your web browser.

3.  **Analyze Data**:
    -   Enter your **Gemini API Key** in the designated field.
    -   **Drag and drop** your analytics file (e.g., specific user behavior logs, traffic reports) into the upload zone.
    -   Select the **Teams** you want insights for.
    -   Click **"Analyze with AI"**.

4.  **View & Export**:
    -   Read through the generated cards for each team.
    -   Use the **Share** button to draft an email with the findings.
    -   Use the **Export** button to print or save the insights as PDF.

## 🛠️ Technology Stack

-   **Frontend**: HTML5, CSS3, JavaScript (ES6+)
-   **AI Integration**: [Google Gemini API](https://ai.google.dev/)
-   **Fonts**: Google Fonts (Inter, JetBrains Mono)
-   **Icons**: Native UTF-8 Emojis (lightweight and universal)

## Deployment on Netlify

This project is configured for easy deployment on Netlify with environment variable support for the API key.

1.  **Connect to Repository:** Push this code to a GitHub/GitLab/Bitbucket repository and connect it to a new site on Netlify.
2.  **Configure Build Settings:**
    *   **Build command:** `node setup-env.js`
    *   **Publish directory:** `.`
    *   (These are already configured in `netlify.toml`, so Netlify should auto-detect them).
3.  **Set Environment Variables:**
    *   Go to **Site configuration > Environment variables**.
    *   Add a new variable:
        *   **Key:** `GEMINI_API_KEY`
        *   **Value:** `Your_Actual_Gemini_API_Key`
4.  **Deploy:** Trigger a deployment. The build script will automatically inject your API key into the configuration.

## 📁 Project Structure

```
├── index.html          # Main application entry point
├── script.js           # Core logic (File handling, API calls, UI updates)
├── styles.css          # Application styling and animations
├── default-config.js   # Default configuration settings
└── config.js           # Runtime configuration handling
```

## 🔒 Privacy & Security

-   **Data Privacy**: This application is client-side only. Your uploaded files are processed in your browser and sent directly to Google's Gemini API for analysis. No data is stored on any intermediate server.
-   **API Key**: Your API key is stored locally in your browser (`localStorage`) for your convenience and is never shared.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built for the Kurukshetra University MBA IT Project.*
