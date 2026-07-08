import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Users, Clock, TrendingUp, ChevronRight } from 'lucide-react';

const MyHCPs = () => {
  const [interactions, setInteractions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/interactions')
      .then(res => { setInteractions(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Group by HCP name
  const hcpMap = {};
  interactions.forEach(item => {
    const name = item.hcp_name || 'Unknown';
    if (!hcpMap[name]) {
      hcpMap[name] = { name, specialty: item.specialty, interactions: [], lastSentiment: item.sentiment };
    }
    hcpMap[name].interactions.push(item);
    hcpMap[name].lastSentiment = item.sentiment;
  });

  const hcps = Object.values(hcpMap).filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    (h.specialty || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-heading">My HCPs</h2>
        <p className="page-subheading">All Healthcare Professionals you have engaged with.</p>
      </div>

      <div className="search-bar">
        <Search size={18} color="var(--text-secondary)" />
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)', marginTop: '2rem' }}>Loading...</p>
      ) : hcps.length === 0 ? (
        <div className="empty-state">
          <Users size={48} color="var(--text-secondary)" />
          <p>No HCPs found. Log some interactions first!</p>
        </div>
      ) : (
        <div className="hcp-grid">
          {hcps.map(hcp => (
            <div key={hcp.name} className="hcp-card">
              <div className="hcp-card-header">
                <div className="hcp-avatar">{hcp.name.charAt(0)}</div>
                <div>
                  <div className="hcp-name">{hcp.name}</div>
                  <div className="hcp-specialty">{hcp.specialty || 'Specialty N/A'}</div>
                </div>
                <span className={`badge badge-${(hcp.lastSentiment || 'Neutral').toLowerCase()}`} style={{ marginLeft: 'auto' }}>
                  {hcp.lastSentiment || 'Neutral'}
                </span>
              </div>
              <div className="hcp-card-stats">
                <div className="hcp-stat">
                  <TrendingUp size={14} />
                  <span>{hcp.interactions.length} interaction{hcp.interactions.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="hcp-interactions-list">
                {hcp.interactions.slice(-2).reverse().map(item => (
                  <div key={item.id} className="hcp-interaction-item">
                    <Clock size={12} color="var(--text-secondary)" />
                    <span>{item.discussion_topics || 'General Discussion'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHCPs;
