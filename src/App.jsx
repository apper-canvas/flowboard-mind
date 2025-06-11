import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import Home from './pages/Home';
import Board from './pages/Board';
import Backlog from './pages/Backlog';
import Sprints from './pages/Sprints';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/board" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="board" element={<Board />} />
            <Route path="backlog" element={<Backlog />} />
            <Route path="sprints" element={<Sprints />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
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