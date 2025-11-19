# Momentum Frontend

A modern React TypeScript frontend for the Momentum goal tracking application.

## Features

- 🔐 **Authentication** - Login and registration with JWT
- 📊 **Dashboard** - Overview of goals and progress with charts
- 🎯 **Goal Management** - Create, edit, delete, and filter goals
- 📈 **Progress Tracking** - Log and view daily progress entries
- 📉 **Analytics** - Visual charts and statistics
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- ⚡ **TypeScript** - Type-safe codebase

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **React Chart.js 2** - React wrapper for Chart.js

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   
   The `.env` file is already configured:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
