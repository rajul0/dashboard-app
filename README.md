# Dashboard App (Angular + Electron)

A desktop dashboard application built using **Angular v14** and **Electron**. This app is designed to support both online and offline usage, including secure local authentication using **PouchDB** and **bcrypt**.

---

## ⚙️ Features

- Built with **Angular v14.2.x**
- Desktop application with **Electron**
- **Offline login** support using PouchDB and bcrypt
- Data visualization using **amCharts**, **Plotly.js**, and **D3.js**
- Responsive UI with **Angular Material** and **Tailwind CSS**

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd dashboard-app
npm install
```

🚀 Running the App
🔹 Run Angular in Development Mode

```bash
npm run start
```

This runs the Angular application in development mode at http://localhost:4200.

🔹 Build Angular and Launch Electron

```bash
ng build
```

This will:

Build the Angular application to the dist/ folder

Start Electron and load the built Angular app

🔹 Run Electron Only (after Angular has been built)

```bash
npm run electron build
```

This starts Electron using the existing Angular build in the dist/ folder.

📁 Project Structure
src/ – Angular application source code

src-electron/app.js – Electron main process file

userDb.js – Local user authentication logic using PouchDB and bcrypt

package.json – Project configuration and build scripts

Offline authentication will only work after the default user has been initialized.

Angular version used: 14.2.0
