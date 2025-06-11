import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import HomePage from '@/components/pages/HomePage';
import BoardPage from '@/components/pages/BoardPage';
import BacklogPage from '@/components/pages/BacklogPage';
import SprintsPage from '@/components/pages/SprintsPage';
import ReportsPage from '@/components/pages/ReportsPage';
import SettingsPage from '@/components/pages/SettingsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/board" replace />} />
<Route path="home" element={<HomePage />} />
            <Route path="board" element={<BoardPage />} />
            <Route path="backlog" element={<BacklogPage />} />
            <Route path="sprints" element={<SprintsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
          progressStyle={{ backgroundColor: '#0052CC' }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;