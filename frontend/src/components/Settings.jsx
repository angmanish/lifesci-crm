import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import { Bell, Shield, User, Palette, Database, CheckCircle } from 'lucide-react';

const SettingsSection = ({ icon, title, children }) => (
  <div className="settings-section">
    <div className="settings-section-header">
      {icon}
      <h3>{title}</h3>
    </div>
    <div className="settings-section-body">{children}</div>
  </div>
);

const ToggleSetting = ({ label, description, defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="toggle-setting">
      <div>
        <div className="toggle-label">{label}</div>
        {description && <div className="toggle-desc">{description}</div>}
      </div>
      <button className={`toggle-btn ${on ? 'on' : ''}`} onClick={() => setOn(!on)}>
        <span className="toggle-thumb" />
      </button>
    </div>
  );
};

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const isDark = useSelector(state => state.theme.isDark);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-heading">Settings</h2>
        <p className="page-subheading">Manage your account preferences and application settings.</p>
      </div>

      <div className="settings-grid">
        <SettingsSection icon={<User size={20} color="var(--accent-color)" />} title="Profile">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-control" defaultValue={user?.name || 'Field Representative'} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" defaultValue={user?.email || 'rep@company.com'} />
          </div>
          <div className="form-group">
            <label>Territory / Region</label>
            <input type="text" className="form-control" placeholder="e.g. North Region - Cardiology" />
          </div>
        </SettingsSection>

        <SettingsSection icon={<Bell size={20} color="#f59e0b" />} title="Notifications">
          <ToggleSetting label="Follow-up Reminders" description="Get notified when a follow-up date is approaching." defaultOn={true} />
          <ToggleSetting label="Weekly Summary Email" description="Receive a weekly digest of your logged interactions." defaultOn={true} />
          <ToggleSetting label="AI Suggestions" description="Receive AI-generated next-step suggestions after logging." defaultOn={false} />
        </SettingsSection>

        <SettingsSection icon={<Palette size={20} color="#8b5cf6" />} title="Appearance">
          {/* Dark Mode toggle is connected to Redux */}
          <div className="toggle-setting">
            <div>
              <div className="toggle-label">Dark Mode</div>
              <div className="toggle-desc">Currently: {isDark ? '🌙 Dark' : '☀️ Light'}</div>
            </div>
            <button
              className={`toggle-btn ${isDark ? 'on' : ''}`}
              onClick={() => dispatch(toggleTheme())}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
          <ToggleSetting label="Compact View" description="Use a more compact layout for lists." defaultOn={false} />
        </SettingsSection>

        <SettingsSection icon={<Shield size={20} color="#10b981" />} title="Security">
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" className="form-control" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" className="form-control" placeholder="••••••••" />
          </div>
          <ToggleSetting label="Two-Factor Authentication" description="Add an extra layer of security." defaultOn={false} />
        </SettingsSection>

        <SettingsSection icon={<Database size={20} color="#ef4444" />} title="Data & AI">
          <ToggleSetting label="Auto-populate Form from Chat" description="Allow the AI to fill form fields automatically from chat." defaultOn={true} />
          <ToggleSetting label="Save Chat History" description="Retain conversation history between sessions." defaultOn={false} />
        </SettingsSection>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        {saved && (
          <span style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '6px', animation: 'fadeIn 0.3s' }}>
            <CheckCircle size={18} /> Settings saved!
          </span>
        )}
      </div>
    </div>
  );
};

export default Settings;
