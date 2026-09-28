import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import PaperComparison from './pages/PaperComparison';
import GapAnalysis from './pages/GapAnalysis';
import ClaimVerification from './pages/ClaimVerification';
import LiteratureReview from './pages/LiteratureReview';
import WorkspaceSettings from './pages/Settings';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'chat':
        return <ChatPage />;
      case 'comparison':
        return <PaperComparison />;
      case 'gap-analysis':
        return <GapAnalysis />;
      case 'claim-verification':
        return <ClaimVerification />;
      case 'literature-review':
        return <LiteratureReview />;
      case 'history':
        return <Dashboard setActivePage={setActivePage} />;
      case 'settings':
        return <WorkspaceSettings />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderCurrentPage()}
    </Layout>
  );
}
