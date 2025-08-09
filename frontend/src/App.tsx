import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import SiteManagement from './pages/SiteManagement';
import SiteSubmission from './pages/SiteSubmission';
import RolePermission from './pages/RolePermission';
import ActivityLog from './pages/ActivityLog';
import Settings from './pages/Settings';
import './i18n';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">{t('home')}</Link>
            </li>
            <li>
              <Link to="/dashboard">{t('dashboard')}</Link>
            </li>
            <li>
              <Link to="/user-management">{t('user_management')}</Link>
            </li>
            <li>
              <Link to="/site-management">{t('site_management')}</Link>
            </li>
            <li>
              <Link to="/site-submission">{t('site_submission')}</Link>
            </li>
            <li>
              <Link to="/role-permission">{t('role_permission')}</Link>
            </li>
            <li>
              <Link to="/activity-log">{t('activity_log')}</Link>
            </li>
            <li>
              <Link to="/settings">{t('settings')}</Link>
            </li>
          </ul>
          <div>
            <button onClick={() => changeLanguage('zh')}>中文</button>
            <button onClick={() => changeLanguage('en')}>English</button>
          </div>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/site-management" element={<SiteManagement />} />
          <Route path="/site-submission" element={<SiteSubmission />} />
          <Route path="/role-permission" element={<RolePermission />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
