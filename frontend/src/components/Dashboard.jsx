import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Users, Calendar, TrendingUp, CheckCircle, Clock, Stethoscope } from 'lucide-react';

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: `${color}22`, color }}>
      {icon}
    </div>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/interactions')
      .then(res => { setInteractions(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const positive = interactions.filter(i => i.sentiment === 'Positive').length;
  const pending = interactions.filter(i => i.follow_up_date).length;

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-heading">Dashboard Overview</h2>
        <p className="page-subheading">Welcome back! Here's your HCP engagement summary.</p>
      </div>

      <div className="stats-grid">
        <StatCard icon={<Activity size={24} />} label="Total Interactions" value={interactions.length} color="#3b82f6" />
        <StatCard icon={<Users size={24} />} label="Unique HCPs" value={new Set(interactions.map(i => i.hcp_name)).size} color="#10b981" />
        <StatCard icon={<TrendingUp size={24} />} label="Positive Sentiment" value={positive} color="#f59e0b" />
        <StatCard icon={<Calendar size={24} />} label="Follow-ups Pending" value={pending} color="#8b5cf6" />
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">Recent Interactions</h3>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        ) : interactions.length === 0 ? (
          <div className="empty-state">
            <Stethoscope size={48} color="var(--text-secondary)" />
            <p>No interactions logged yet. Go to "Log Interaction" to get started!</p>
          </div>
        ) : (
          <div className="interactions-list">
            {interactions.slice().reverse().map(item => (
              <div key={item.id} className="interaction-card">
                <div className="interaction-avatar">{item.hcp_name?.charAt(0) || '?'}</div>
                <div className="interaction-info">
                  <div className="interaction-name">{item.hcp_name}</div>
                  <div className="interaction-meta">{item.specialty} &bull; {item.discussion_topics}</div>
                </div>
                <div className="interaction-badges">
                  <span className={`badge badge-${(item.sentiment || 'Neutral').toLowerCase()}`}>{item.sentiment || 'Neutral'}</span>
                  {item.follow_up_date && (
                    <span className="badge badge-followup"><Clock size={12} /> {item.follow_up_date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
