import { Routes, Route } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import AppLayout from '@/layouts/AppLayout';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/routing/ProtectedRoute';
import LandingPage from '@/pages/LandingPage/LandingPage';
import LoginPage from '@/pages/Auth/LoginPage';
import SignupPage from '@/pages/Auth/SignupPage';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import AIDebuggerPage from '@/pages/AIDebugger/AIDebuggerPage';
import GitAnalyzerPage from '@/pages/GitAnalyzer/GitAnalyzerPage';
import GitHubRepositoryPage from '@/pages/GitHubRepository/GitHubRepositoryPage';
import DockerAnalyzerPage from '@/pages/DockerAnalyzer/DockerAnalyzerPage';
import KubernetesPage from '@/pages/Kubernetes/KubernetesPage';
import CICDPage from '@/pages/CICD/CICDPage';
import KnowledgeBasePage from '@/pages/KnowledgeBase/KnowledgeBasePage';
import HistoryPage from '@/pages/History/HistoryPage';
import AnalyticsPage from '@/pages/Analytics/AnalyticsPage';
import SettingsPage from '@/pages/Settings/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/debugger" element={<AIDebuggerPage />} />
          <Route path="/git-analyzer" element={<GitAnalyzerPage />} />
          <Route path="/github-repository" element={<GitHubRepositoryPage />} />
          <Route path="/docker-analyzer" element={<DockerAnalyzerPage />} />
          <Route path="/kubernetes" element={<KubernetesPage />} />
          <Route path="/cicd" element={<CICDPage />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
