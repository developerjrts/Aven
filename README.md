# Aven Notes

A modern, lightweight notes and code-snippet manager built with **React Native, Expo, and TypeScript**, featuring AI-powered note summarization.

Aven Notes helps you organize everyday notes and reusable code snippets in one place. It combines a clean, mobile-first interface with local data persistence, theme support, and AI-assisted productivity.

## ✨ Features

### 📝 Notes Management

- Create, edit, and delete notes
- Pin important notes for quick access
- Rich-text note editing
- Persistent local storage using AsyncStorage
- Clean, distraction-free writing experience

### 🤖 AI Note Summarizer

- Generate concise summaries of lengthy notes
- Extract key points from your notes
- Identify actionable items from note content
- View results in a structured format
- Copy generated summaries to the clipboard
- Access AI summarization directly from the note editor

AI summarization is powered by **Groq** through a separate Express and TypeScript backend. The backend keeps the API key out of the mobile application.

> AI summarization requires an internet connection and a running, reachable backend. Your original note remains stored locally and is not automatically replaced by the generated summary.

### 💻 Code Snippets

- Create, edit, and delete reusable code snippets
- Syntax-aware code presentation
- Pin frequently used snippets
- Copy snippets to the clipboard
- VS Code-inspired code viewer

**Supported languages:**

- JavaScript
- TypeScript
- Python
- JSON
- Bash
- Plain Text

### 🎨 User Experience

- Light and dark themes
- Responsive mobile UI
- Keyboard-aware forms
- Safe-area support
- Smooth navigation with Expo Router
- Native-feeling interactions
- Consistent typography and component styling

### 💾 Local-First Data Persistence

- Store notes and snippets locally on the device using AsyncStorage
- Access saved content without an internet connection
- No account required for core note-taking and snippet management
- Validation and migration handling for legacy stored data formats

---

## 🛠️ Tech Stack

| Technology                       | Purpose                                 |
| -------------------------------- | --------------------------------------- |
| React Native                     | Mobile application framework            |
| Expo                             | Development and native tooling          |
| Expo Router                      | File-based navigation                   |
| TypeScript                       | Type-safe development                   |
| AsyncStorage                     | Local notes and snippet persistence     |
| React Query                      | Asynchronous state and query management |
| React Native Gesture Handler     | Gesture support                         |
| React Native Keyboard Controller | Keyboard interactions                   |
| React Native Safe Area Context   | Safe-area handling                      |
| Expo Google Fonts                | Inter typography                        |
| Prism React Renderer             | Syntax highlighting                     |
| Express.js                       | Backend API framework                   |
| Node.js                          | Backend runtime                         |
| Groq API                         | AI-powered note summarization           |
| Zod                              | Request and AI-response validation      |

---

## 📁 Project Structure

```text
aven-notes/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── snippets.tsx
│   │   └── ...
│   ├── new-note.tsx
│   ├── edit-note.tsx
│   ├── new-snippet.tsx
│   ├── edit-snippet.tsx
│   └── _layout.tsx
│
├── src/
│   ├── components/
│   ├── context/
│   │   ├── notes.tsx
│   │   ├── snippets.tsx
│   │   └── theme.tsx
│   ├── hooks/
│   ├── services/
│   │   └── aiSummarizer.ts
│   ├── styles/
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── groq.ts
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   │   └── summary.service.ts
│   │   └── ...
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── assets/
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

_The structure above illustrates the intended organization. Keep filenames consistent with the actual files in your repository._

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Expo tooling
- Expo Go or an Android/iOS development environment
- A Groq API key to use AI summarization

### 1. Clone the repository

```bash
git clone https://github.com/developerjrts/aven-notes.git
cd aven-notes
```

Replace the repository URL if your project uses a different GitHub URL.

### 2. Install mobile dependencies

From the project root:

```bash
npm install
```

### 3. Start the mobile application

```bash
npx expo start
```

To clear the Metro cache when troubleshooting:

```bash
npx expo start -c
```

Open the app using Expo Go, an Android emulator, an iOS simulator, or a compatible development build.

---

## 🤖 Setting Up the AI Backend

The AI summarizer uses Groq through an Express and TypeScript API. Keep the backend separate from the Expo mobile application.

### 1. Install backend dependencies

```bash
cd server
npm install
```

### 2. Configure environment variables

Create a `.env` file inside `server/` using `.env.example` as a template.

Example:

```env
PORT=3000
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Get your API key from the [Groq Console](https://console.groq.com/).

**Never commit your actual `.env` file or expose your Groq API key in the React Native application.**

### 3. Start the backend

Use the development command configured in `server/package.json`. For example, if the project uses `tsx`:

```bash
npm run dev
```

The backend should be running before you test AI summarization.

### 4. Configure the API URL

The mobile application must be able to reach the backend.

- **Android emulator:** `http://10.0.2.2:3000`
- **Physical device:** Use your computer's LAN IP address while both devices are on the same network.
- **Production:** Use a deployed backend with HTTPS.

The backend must be reachable from the device. Do not ship a development-only IP address in the production app.

### 5. Test the summarization endpoint

Send a POST request to:

```text
/api/v1/summarize
```

Example request body:

```json
{
  "title": "Study Notes",
  "content": "Your note content goes here."
}
```

The API returns a structured result containing:

```json
{
  "summary": "A concise summary of the note.",
  "keyPoints": ["An important point from the note."],
  "actionItems": ["A task identified in the note."]
}
```

Actual output depends on the note content.

---

## 🧩 Application Architecture

Aven Notes separates its local mobile functionality from AI processing.

### Mobile application

- Expo Router handles navigation.
- React Context manages notes, snippets, and theme state.
- AsyncStorage persists notes and snippets locally.
- The AI summarizer service sends requests to the backend.
- Generated summaries can be viewed and copied without replacing the original note.

### Backend

- Express.js exposes the summarization endpoint.
- TypeScript provides type-safe application logic.
- Groq processes AI summarization requests.
- Zod validates structured AI output.
- Environment variables keep API credentials on the server.
- Request validation and rate limiting help control misuse.

### Request flow

```text
Note Editor
    ↓
AI Summarizer Service
    ↓
Express API
    ↓
Groq API
    ↓
Structured Summary Response
    ↓
Summary Modal
```

---

## 💾 Local Storage

Notes and snippets are persisted on the device using AsyncStorage.

### Current storage keys

```text
notes
snippets
```

Legacy versions used:

```text
aven.notes.v1
aven.snippets.v1
```

The application includes migration handling for legacy data formats where supported by the implementation.

AI summaries are generated through the backend. Their persistence depends on how the app is configured; generating a summary does not automatically mean it is saved as a separate local record.

---

## 🎨 Theming

Aven Notes supports light and dark themes through a centralized theme system.

Components use shared theme colors wherever possible to keep the interface consistent across:

- Backgrounds and cards
- Text and placeholders
- Borders and inputs
- Navigation elements
- Code blocks and editor surfaces
- AI summary views

---

## 🔐 Privacy and Security

Aven Notes follows a local-first approach for core note-taking and snippet management.

- Notes and snippets are stored locally using AsyncStorage.
- An account is not required for core app functionality.
- The Groq API key is kept on the backend rather than bundled into the mobile app.
- AI summarization sends the selected note's title and content to the configured backend, which forwards the content to Groq for processing.
- AI summarization requires an internet connection.
- Local storage is not the same as encrypted storage; users should avoid storing highly sensitive information unless appropriate protections are implemented.

**Privacy notice:** If AI summarization is enabled, disclose this external processing clearly to users. Review the applicable Groq terms, data handling practices, and retention settings before public release.

---

## 📱 Supported Platforms

Aven Notes is built with Expo and React Native, with intended support for:

- Android
- iOS
- Web development

Platform support may vary depending on the Expo SDK, dependencies, and configured native capabilities. The AI backend must be reachable from the selected platform.

---

## 🏗️ Builds and Deployment

### Expo and EAS

Log in to your Expo account:

```bash
npx eas login
```

Inspect the configured EAS project:

```bash
npx eas project:info
```

Create a development build:

```bash
npx eas build --profile development
```

Create a preview build:

```bash
npx eas build --profile preview
```

Create a production build:

```bash
npx eas build --profile production
```

### Backend deployment

Before releasing AI summarization publicly:

- Deploy the Express backend to a suitable hosting provider.
- Configure `GROQ_API_KEY` as a server-side environment variable.
- Configure the production model and port.
- Use HTTPS for the public API.
