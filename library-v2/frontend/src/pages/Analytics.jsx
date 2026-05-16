import { useEffect, useState } from 'react';
import { getAnalytics, getDashboard } from '../services/api';
import './Analytics.css';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([getAnalytics(), getDashboard()])
      .then(([a, d]) => { setAnalytics(a.data); setDashboard(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="loader"><div className="spin"/>Loading analytics…</div></div>;

  const { membershipDist, genrePopularity, avgRating, mostActiveMembers, overdueRate, totalTransactions } = analytics;
  const { stats, monthlyData } = dashboard;

  const maxMonthly = Math.max(...monthlyData.map(m => Math.max(m.issued, m.returned)), 1);
  const maxGenrePop = Math.max(...Object.values(genrePopularity), 1);
  const maxMemDist  = Math.max(...Object.values(membershipDist), 1);

  const memberColors = { Premium:'var(--amber)', Standard:'var(--blue)', Student:'var(--purple)' };

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-left"><h1>Library <em>Analytics</em></h1><p>Insights and performance metrics</p></div>
      </div>

      {/* KPI Row */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ color:'var(--amber)' }}>📊</div>
          <div className="kpi-val">{totalTransactions}</div>
          <div className="kpi-lbl">Total Transactions</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ color:'var(--green)' }}>⭐</div>
          <div className="kpi-val">{avgRating}</div>
          <div className="kpi-lbl">Avg Book Rating</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ color:'var(--red)' }}>⚠</div>
          <div className="kpi-val">{overdueRate}%</div>
          <div className="kpi-lbl">Overdue Rate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ color:'var(--blue)' }}>📚</div>
          <div className="kpi-val">{stats.uniqueTitles}</div>
          <div className="kpi-lbl">Unique Titles</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ color:'var(--purple)' }}>👥</div>
          <div className="kpi-val">{stats.totalMembers}</div>
          <div className="kpi-lbl">Total Members</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ color:'var(--amber)' }}>💰</div>
          <div className="kpi-val">₹{stats.totalFines}</div>
          <div className="kpi-lbl">Total Fines</div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Monthly Trend */}
        <div className="card" style={{ gridColumn:'span 2' }}>
          <div className="card-title">Monthly Issuance vs Returns</div>
          <div className="monthly-chart">
            {monthlyData.map((m, i) => (
              <div key={i} className="month-col">
                <div className="month-bars">
                  <div className="mc-bar" style={{ height:`${(m.issued/maxMonthly)*110}px`, background:'var(--blue)', opacity:.85 }}>
                    <span className="mc-tip">{m.issued}</span>
                  </div>
                  <div className="mc-bar" style={{ height:`${(m.returned/maxMonthly)*110}px`, background:'var(--green)', opacity:.85 }}>
                    <span className="mc-tip">{m.returned}</span>
                  </div>
                </div>
                <div className="month-label">{m.month}</div>
              </div>
            ))}
          </div>
          <div className="row mt12" style={{ gap:16 }}>
            <div className="row" style={{ gap:6 }}><div className="legend-dot" style={{ background:'var(--blue)' }} /><span className="xs t2">Issued</span></div>
            <div className="row" style={{ gap:6 }}><div className="legend-dot" style={{ background:'var(--green)' }} /><span className="xs t2">Returned</span></div>
          </div>
        </div>

        {/* Membership Distribution */}
        <div className="card">
          <div className="card-title">Membership Types</div>
          <div className="donut-wrap">
            <svg viewBox="0 0 120 120" className="donut-svg">
              {(() => {
                const total = Object.values(membershipDist).reduce((a,b)=>a+b,0);
                let offset = 0;
                const r = 40; const cx = 60; const cy = 60;
                const circum = 2 * Math.PI * r;
                return Object.entries(membershipDist).map(([type, count], i) => {
                  const pct = count/total;
                  const dash = pct * circum;
                  const gap  = circum - dash;
                  const el = (
                    <circle key={type} cx={cx} cy={cy} r={r} fill="none"
                      stroke={memberColors[type]||'var(--text-3)'} strokeWidth="18"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={-offset * circum}
                      style={{ transition:'stroke-dasharray .5s' }} />
                  );
                  offset += pct;
                  return el;
                });
              })()}
              <text x="60" y="64" textAnchor="middle" style={{ fill:'var(--text-1)', fontSize:10, fontWeight:600 }}>
                {Object.values(membershipDist).reduce((a,b)=>a+b,0)}
              </text>
              <text x="60" y="74" textAnchor="middle" style={{ fill:'var(--text-3)', fontSize:6 }}>members</text>
            </svg>
            <div className="donut-legend">
              {Object.entries(membershipDist).map(([type,count]) => (
                <div key={type} className="donut-item">
                  <div className="donut-dot" style={{ background: memberColors[type]||'var(--text-3)' }} />
                  <span className="sm">{type}</span>
                  <span className="xs t3 mono">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Genre Popularity */}
        <div className="card">
          <div className="card-title">Genre Popularity (by loans)</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {Object.entries(genrePopularity).sort((a,b)=>b[1]-a[1]).map(([genre, count]) => (
              <div key={genre}>
                <div className="row-between mb4">
                  <span className="xs t2 ellipsis" style={{ maxWidth:140 }}>{genre}</span>
                  <span className="xs mono t3">{count} loans</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width:`${(count/maxGenrePop)*100}%`, background:'var(--purple)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Members */}
        <div className="card">
          <div className="card-title">Most Active Members</div>
          {mostActiveMembers.map((m,i) => (
            <div key={m.id} className="top-member">
              <div className="top-rank-num" style={{ color: i===0?'var(--amber)':i===1?'var(--text-2)':'var(--text-3)' }}>
                {i+1}
              </div>
              <div style={{ flex:1, overflow:'hidden' }}>
                <div className="sm ellipsis" style={{ fontWeight:500 }}>{m.name}</div>
                <div className="xs t3">{m.membershipType}</div>
              </div>
              <div className="top-read">
                <span style={{ fontWeight:600, color:'var(--amber)' }}>{m.totalBooksRead}</span>
                <span className="xs t3"> books</span>
              </div>
            </div>
          ))}
        </div>

        {/* Collection Stats */}
        <div className="card">
          <div className="card-title">Collection Health</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <HealthRow label="Availability Rate" value={Math.round(stats.availableBooks/stats.totalBooks*100)} color="var(--green)" />
            <HealthRow label="Issue Rate" value={Math.round(stats.issuedBooks/stats.totalBooks*100)} color="var(--blue)" />
            <HealthRow label="Overdue Rate" value={Math.round(stats.overdueCount/Math.max(stats.issuedBooks,1)*100)} color="var(--red)" />
            <HealthRow label="Member Activity" value={Math.round(stats.activeMembers/stats.totalMembers*100)} color="var(--purple)" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthRow({ label, value, color }) {
  return (
    <div>
      <div className="row-between mb4">
        <span className="xs t2">{label}</span>
        <span className="xs mono" style={{ color }}>{value}%</span>
      </div>
      <div className="progress">
        <div className="progress-bar" style={{ width:`${value}%`, background:color }} />
      </div>
    </div>
  );
}
