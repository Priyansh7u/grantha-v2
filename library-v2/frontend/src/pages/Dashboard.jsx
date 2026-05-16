import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="loader"><div className="spin" />Loading dashboard…</div></div>;

  const { stats, monthlyData, genreStats, topBooks, recentTransactions, upcoming } = data;

  const statCards = [
    { label: 'Total Titles', value: stats.uniqueTitles, icon: '📚', color: '#F59E0B', badge: `${stats.totalBooks} copies`, barPct: 100 },
    { label: 'Available Now', value: stats.availableBooks, icon: '✅', color: '#10B981', badge: `${Math.round(stats.availableBooks/stats.totalBooks*100)}%`, barPct: stats.availableBooks/stats.totalBooks*100 },
    { label: 'Currently Issued', value: stats.issuedBooks, icon: '📤', color: '#3B82F6', badge: 'active', barPct: stats.issuedBooks/stats.totalBooks*100 },
    { label: 'Overdue', value: stats.overdueCount, icon: '⚠️', color: '#EF4444', badge: stats.overdueCount > 0 ? 'urgent' : 'clear', barPct: Math.min(100, stats.overdueCount*10) },
    { label: 'Total Members', value: stats.totalMembers, icon: '👥', color: '#8B5CF6', badge: `${stats.activeMembers} active`, barPct: stats.activeMembers/stats.totalMembers*100 },
    { label: 'Pending Fines', value: `₹${stats.pendingFines}`, icon: '💰', color: '#F59E0B', badge: 'pending', barPct: 60 },
  ];

  const maxMonthly = Math.max(...monthlyData.map(m => Math.max(m.issued, m.returned)), 1);
  const maxGenre = Math.max(...Object.values(genreStats), 1);

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-left">
          <h1>Good morning, <em>Librarian</em></h1>
          <p>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="row">
          <Link to="/transactions" className="btn btn-ghost btn-sm">Issue Book</Link>
          <Link to="/books" className="btn btn-amber btn-sm">＋ Add Book</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statCards.map(s => (
          <div className="stat" key={s.label} style={{ '--c': s.color }}>
            <div className="stat-top">
              <div className="stat-icon" style={{ background: s.color + '18' }}>{s.icon}</div>
              <span className="stat-badge" style={{ background: s.color + '18', color: s.color }}>{s.badge}</span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-bar">
              <div style={{ height: '100%', width: `${s.barPct}%`, background: s.color, borderRadius: 99, opacity: .6, transition: 'width .6s ease' }} />
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Monthly Chart */}
        <div className="card dash-chart-card">
          <div className="card-title">Monthly Activity</div>
          <div className="chart-legend">
            <span className="legend-dot" style={{ background: '#3B82F6' }} /> Issued
            <span className="legend-dot" style={{ background: '#10B981', marginLeft: 12 }} /> Returned
          </div>
          <div className="bar-chart">
            {monthlyData.map((m, i) => (
              <div key={i} className="bar-group">
                <div className="bar-col">
                  <div className="bar issued" style={{ height: `${(m.issued / maxMonthly) * 100}%`, background: '#3B82F6' }} title={`${m.issued} issued`} />
                  <div className="bar returned" style={{ height: `${(m.returned / maxMonthly) * 100}%`, background: '#10B981' }} title={`${m.returned} returned`} />
                </div>
                <div className="bar-label">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="card">
          <div className="card-title">Genre Distribution</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(genreStats).sort((a,b) => b[1]-a[1]).map(([genre, count]) => (
              <div key={genre}>
                <div className="row-between mb4">
                  <span className="sm">{genre}</span>
                  <span className="xs mono t3">{count}</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${(count/maxGenre)*100}%`, background: 'var(--amber)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Due */}
        <div className="card">
          <div className="card-title">Due Soon (Next 7 Days)</div>
          {upcoming.length === 0
            ? <div className="empty"><span className="empty-icon">✓</span><h3>All clear!</h3><p>No books due soon</p></div>
            : upcoming.map(t => {
                const daysLeft = Math.ceil((new Date(t.dueDate) - new Date()) / 86400000);
                return (
                  <div key={t.id} className="due-item">
                    <div>
                      <div className="sm" style={{ fontWeight: 500 }}>{t.bookTitle}</div>
                      <div className="xs t3 mt4">{t.memberName}</div>
                    </div>
                    <span className={`badge ${daysLeft <= 2 ? 'b-red' : 'b-amber'}`}>
                      {daysLeft === 0 ? 'Today' : `${daysLeft}d`}
                    </span>
                  </div>
                );
              })}
        </div>

        {/* Top Books */}
        <div className="card">
          <div className="card-title">Most Viewed Books</div>
          {topBooks.map((b, i) => (
            <div key={b.id} className="top-book">
              <div className="top-rank" style={{ background: i === 0 ? 'var(--amber)' : i === 1 ? 'var(--text-3)' : 'var(--bg-4)', color: i < 2 ? '#000' : 'var(--text-2)' }}>{i+1}</div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div className="sm ellipsis" style={{ fontWeight: 500 }}>{b.title}</div>
                <div className="xs t3">{b.author}</div>
              </div>
              <div className="xs mono t3">{b.views} views</div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="row-between mb16">
            <div className="card-title" style={{ margin: 0 }}>Recent Transactions</div>
            <Link to="/transactions" className="btn btn-ghost btn-xs">View all →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Book</th><th>Member</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Fine</th></tr></thead>
              <tbody>
                {recentTransactions.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500, maxWidth: 200 }} className="ellipsis">{t.bookTitle}</td>
                    <td className="t2">{t.memberName}</td>
                    <td className="t3 xs mono">{t.issueDate}</td>
                    <td className="xs mono" style={{ color: t.status === 'overdue' ? 'var(--red)' : 'var(--text-3)' }}>{t.dueDate}</td>
                    <td><StatusBadge s={t.status} /></td>
                    <td className={t.fine > 0 ? 'sm' : 't3 sm'} style={{ color: t.fine > 0 ? 'var(--amber)' : undefined }}>{t.fine > 0 ? `₹${t.fine}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ s }) {
  const m = { issued: 'b-blue', returned: 'b-green', overdue: 'b-red' };
  return <span className={`badge ${m[s] || 'b-muted'}`}>{s}</span>;
}
