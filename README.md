# 💫 Goals Planner

A modern desktop application for managing your goals and objectives, built with Electron and TypeScript.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Electron](https://img.shields.io/badge/Electron-39.2-47848F)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ Features

- 🎯 **Goal Management**: Create, edit, complete, and delete your objectives
- 📅 **Integrated Calendar**: Visualize your goals in a monthly calendar
- 🎨 **Customizable Themes**: 6 different themes (Pink, Lavander, Blue) with light/dark modes
- 💾 **Export/Import**: Save and share your goals in JSON format
- 📆 **ICS Export**: Export your goals with dates to calendar files
- 🗑️ **Bulk Delete**: Delete all goals at once with confirmation

<p align="center">
<img src="https://raw.githubusercontent.com/Alexdaz/GoalsPlanner/main/assets/SSGoalsPlanner.png" />
</p>

## 📋 Requirements

- Node.js 18+
- npm
- Git (optional, for cloning the repository)

## 🚀 Installation

1. **Clone the repository** (or download the code):
```bash
git clone https://github.com/Alexdaz/GoalsPlanner
cd "GoalsPlanner"
```

2. **Install dependencies**:
```bash
npm install
```

3. **Build the project**:
```bash
npm run build
```

4. **Run the application**:
```bash
npm start
```

## 📜 Available Scripts

- `npm run build` - Compiles TypeScript to JavaScript
- `npm run build:watch` - Compiles in watch mode (auto-compiles on save)
- `npm start` - Builds and runs the application
- `npm run dist` - Builds and creates the executable for distribution
- `npm run dist:mac` - Builds macOS executable (DMG and ZIP)
- `npm run dist:win` - Builds Windows executable (NSIS Installer)
- `npm run dist:linux` - Builds Linux executable (AppImage)

## 🎨 Available Themes

The application includes 6 different themes:

- **🔵 Blue** (light and dark)
- **🌸 Pink** (light and dark)
- **💜 Lavender** (light and dark)

Each theme automatically adapts to all components, including the custom title bar.

## 🔒 Security

The application implements multiple security measures:

- ✅ Strict JSON file validation
- ✅ File size limits (5MB maximum)
- ✅ Input data sanitization
- ✅ Context Isolation and Sandbox enabled
- ✅ Node Integration disabled
- ✅ Type and data structure validation
- ✅ Special character escaping in ICS exports

## 📦 Distribution

To create an executable:

```bash
npm run dist
```

Executables will be generated in the `dist/` folder:
- **Linux**: AppImage
- **Windows**: NSIS Installer
- **macOS**: DMG and ZIP (x64 and arm64)

## 🎯 Usage

1. **Add a goal**: Click the floating button (FAB) ➕ and select "Add goal"
   - Fill in the title, description, and due date (all fields are required)
2. **Complete a goal**: Click the "Complete" button on any card
3. **Delete a goal**: Click the "x" button on any card and confirm deletion
4. **Delete all goals**: FAB → "🗑️ Delete all goals" (with confirmation)
5. **View calendar**: Click "📅 Show" in the header
6. **Change theme**: Use the palette selector and the light/dark mode button
7. **Export goals**: FAB → "💾 Save JSON"
8. **Import goals**: FAB → "📂 Import JSON"

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

### Third-Party Licenses

This project uses several open-source libraries. For detailed license information of all third-party components, please see the `THIRD_PARTY_LICENSES.txt` file.

## 🙏 Acknowledgments

- [Lit](https://lit.dev/) - Web Components framework
- [Electron](https://www.electronjs.org/) - Desktop application framework
- [canvas-confetti](https://github.com/catdad/canvas-confetti) - Confetti library
