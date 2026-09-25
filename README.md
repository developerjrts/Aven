# Aven Notes

A modern, lightweight notes and code-snippet manager built with **React Native, Expo, and TypeScript**.

Aven Notes is designed to keep everyday notes and reusable code snippets organized in one place, with a clean interface, local persistence, theme support, and a mobile-first experience.

## ✨ Features

### 📝 Notes

* Create and edit notes
* Delete notes
* Pin important notes
* Persistent local storage
* Clean and distraction-free editor

### 💻 Code Snippets

* Create and edit reusable code snippets
* Syntax-aware code presentation
* Supported languages:

  * JavaScript
  * TypeScript
  * Python
  * JSON
  * Bash
  * Plain Text
* Pin frequently used snippets
* Copy snippets easily
* VS Code-inspired code viewer

### 🎨 User Experience

* Light and dark themes
* Responsive mobile UI
* Keyboard-aware forms
* Safe-area support
* Smooth navigation with Expo Router
* Native-feeling interactions
* Consistent typography and component styling

### 💾 Data Persistence

Aven Notes stores notes and snippets locally on the device using **AsyncStorage**.

This means your notes remain available between app launches without requiring an internet connection or a backend service.

The project also includes validation and migration handling for older stored data formats.

---

## 🛠️ Tech Stack

| Technology                       | Purpose                        |
| -------------------------------- | ------------------------------ |
| React Native                     | Mobile application framework   |
| Expo                             | Development and native tooling |
| Expo Router                      | File-based navigation          |
| TypeScript                       | Type-safe development          |
| AsyncStorage                     | Local data persistence         |
| React Query                      | Async state/query management   |
| React Native Gesture Handler     | Gesture support                |
| React Native Keyboard Controller | Keyboard interactions          |
| React Native Safe Area Context   | Safe-area handling             |
| Expo Google Fonts                | Inter typography               |
| Prism React Renderer             | Syntax highlighting            |

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
│   ├── styles/
│   └── ...
│
├── assets/
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Expo CLI / Expo tooling
* Expo Go or an Android/iOS development environment

### 1. Clone the repository

```bash
git clone https://github.com/developerjrts/aven-notes.git
```

```bash
cd aven-notes
```

> Replace the repository URL if your actual GitHub repository uses a different name.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npx expo start
```

### 4. Run the application

You can then open the project using:

* **Expo Go**
* Android Emulator
* iOS Simulator
* Development build

For a clean Metro cache:

```bash
npx expo start -c
```

---

## 🧩 Development

Aven Notes uses **Expo Router** for navigation.

Screens are organized inside the `app/` directory, while reusable application logic and UI components are maintained under `src/`.

The application uses React Context for core local state:

```text
NotesProvider
    ↓
Notes state + persistence

SnippetsProvider
    ↓
Snippets state + persistence

ThemeProvider
    ↓
Light / Dark theme
```

---

## 💾 Local Storage

Aven Notes currently uses AsyncStorage for local persistence.

### Notes

```text
notes
```

### Snippets

```text
snippets
```

Older versions of the application used legacy storage keys:

```text
aven.notes.v1
aven.snippets.v1
```

The application can migrate legacy data into the current storage format when available.

---

## 🎨 Theming

Aven Notes supports light and dark themes through a centralized theme system.

Components use the application's theme colors instead of hard-coded colors wherever possible.

This keeps the UI consistent across:

* Backgrounds
* Cards
* Text
* Borders
* Inputs
* Placeholders
* Code blocks
* Navigation elements

---

## 🔐 Privacy

Aven Notes is designed around local-first data storage.

Notes and snippets are stored locally on the user's device using AsyncStorage. The application does not require an account or backend server for its core note-taking functionality.

> The exact privacy behavior of a released build depends on the services and configuration included in that build.

---

## 📱 Platform

Aven Notes is built with Expo and React Native with support for:

* Android
* iOS
* Web development

Platform-specific behavior may vary depending on the Expo SDK version and configured native capabilities.

---

## 🏗️ Build

For EAS builds, make sure you are authenticated with your Expo account.

```bash
npx eas login
```

Check the configured EAS project:

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

---

## 📦 Production

Before creating a production build, verify:

* App name
* Android package name
* iOS bundle identifier
* App version
* EAS `projectId`
* App icon
* Splash screen
* Build configuration
* Environment variables
* Store metadata

---

## 🧪 Code Quality

The project is written in TypeScript with a focus on:

* Strong typing
* Reusable components
* Centralized state management
* Separation of UI and data logic
* Defensive local-data validation
* Maintainable project structure

---

## 🗺️ Roadmap

Potential future improvements include:

* [ ] Rich text note editing
* [ ] Markdown support
* [ ] Note search
* [ ] Snippet search
* [ ] Tags and categories
* [ ] Note sorting and filtering
* [ ] Import/export
* [ ] Backup and restore
* [ ] Cloud synchronization
* [ ] Cross-device synchronization
* [ ] Additional programming languages
* [ ] Improved code editor
* [ ] Offline-first synchronization
* [ ] Automated testing

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you find a bug or have an idea for a feature, open an issue or submit a pull request.

### Development workflow

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Clear Metro cache when needed
npx expo start -c
```

---

## 📄 License

This project is currently intended as a personal/portfolio project.

If you plan to distribute the source code publicly, add an appropriate open-source license such as MIT.

---

## 👨‍💻 Developer

**Developer JRTS**

Building modern web and mobile experiences.

### Technologies

```text
React
React Native
Expo
TypeScript
Next.js
NestJS
MongoDB
REST APIs
```

---

## ⭐ Acknowledgements

Built with:

* React Native
* Expo
* TypeScript
* Expo Router
* AsyncStorage
* Prism React Renderer

---

<p align="center">
  Built with ❤️ using React Native & Expo
</p>
