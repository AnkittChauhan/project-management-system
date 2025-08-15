import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import TaskBoard from './pages/TaskBoard';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  useEffect(() => {
    // Set default organization slug if not exists
    if (!localStorage.getItem('organizationSlug')) {
      localStorage.setItem('organizationSlug', 'demo-org');
    }
  }, []);

  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="space-y-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/tasks" element={<TaskBoard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </Router>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

// Not Found Component
const NotFound: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default App;