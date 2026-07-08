import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './store/authSlice';
import { Stethoscope, LogOut, Home, Settings as SettingsIcon, Users, PenTool } from 'lucide-react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import MyHCPs from './components/MyHCPs';
import LogInteractionScreen from './components/LogInteractionScreen';
import Settings from './components/Settings';

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Stethoscope size={28} />
        LifeSci CRM
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Home size={20} /> Dashboard
        </NavLink>
        <NavLink to="/hcps" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Users size={20} /> My HCPs
        </NavLink>
        <NavLink to="/log" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <PenTool size={20} /> Log Interaction
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <SettingsIcon size={20} /> Settings
        </NavLink>
        <button className="sidebar-link logout-btn" onClick={() => dispatch(logout())}>
          <LogOut size={20} /> Logout
        </button>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user?.name?.charAt(0) || 'F'}</div>
          <div>
            <div className="sidebar-user-name">{user?.name || 'Field Rep'}</div>
            <div className="sidebar-user-email">{user?.email || ''}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const AppLayout = ({ children, title }) => {
  const user = useSelector(state => state.auth.user);
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <h1 className="page-title">{title}</h1>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="topbar-avatar">{user?.name?.charAt(0) || 'F'}</div>
            <div>
              <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{user?.name || 'Field Rep'}</div>
              <div style={{ color: 'var(--success-color)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="online-dot" /> Online
              </div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const isDark = useSelector(state => state.theme.isDark);

  return (
    <div className={isDark ? 'theme-dark' : 'theme-light'}>
      <BrowserRouter>
        {!isAuthenticated ? (
          <LoginPage />
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AppLayout title="Dashboard"><Dashboard /></AppLayout>} />
            <Route path="/hcps" element={<AppLayout title="My HCPs"><MyHCPs /></AppLayout>} />
            <Route path="/log" element={<AppLayout title="Log New Interaction"><LogInteractionScreen /></AppLayout>} />
            <Route path="/settings" element={<AppLayout title="Settings"><Settings /></AppLayout>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
