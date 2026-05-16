import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getNotifications, markAllRead } from '../services/api';
import './Sidebar.css';

const nav = [
  { to: '/', label: 'Dashboard', icon: '⊞', end: true },
  { to: '/books', label: 'Books', icon: '📚' },
  { to: '/members', label: 'Members', icon: '👥' },
  { to: '/transactions', label: 'Transactions', icon: '↕' },
  { to: '/reservations', label: 'Reservations', icon: '🔖' },
  { to: '/fines', label: 'Fines', icon: '💰' },
  { to: '/analytics', label: 'Analytics', icon: '📊' },
];

export default function Sidebar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    getNotifications().then(r => setNotifs(r.data)).catch(() => {});
  }, []);

  const handleReadAll = async () => {
    await markAllRead();
    setNotifs(p => p.map(n => ({ ...n, read: true })));
  };

  const typeColor = { issue: '#3B82F6', return: '#10B981', overdue: '#EF4444', new_member: '#8B5CF6' };
  const typeIcon  = { issue: '📤', return: '📥', overdue: '⚠️', new_member: '👤' };

  return (
    <>
      <aside className="sidebar">
        {/* Brand */}
        <div className="sb-brand">
          <div className="sb-logo">G</div>
          <div>
            <div className="sb-name">Grantha</div>
            <div className="sb-sub">Library v2</div>
          </div>
        </div>

        <div className="sb-divider" />

        {/* Nav */}
        <nav className="sb-nav">
          <div className="sb-section">Menu</div>
          {nav.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`}>
              <span className="sb-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ flex: 1 }} />
        <div className="sb-divider" />

        {/* Bottom */}
        <div className="sb-bottom">
          <button className="sb-notif-btn" onClick={() => setNotifOpen(p => !p)}>
            <span>🔔</span>
            <span>Notifications</span>
            {unread > 0 && <span className="sb-badge">{unread}</span>}
          </button>
          <div className="sb-status">
            <span className="sb-dot" />
            <span className="xs t3">System online</span>
          </div>
        </div>
      </aside>

      {/* Notification Panel */}
      {notifOpen && (
        <div className="notif-overlay" onClick={() => setNotifOpen(false)}>
          <div className="notif-panel" onClick={e => e.stopPropagation()}>
            <div className="notif-header">
              <span style={{ fontWeight: 600 }}>Notifications</span>
              <button className="btn btn-ghost btn-xs" onClick={handleReadAll}>Mark all read</button>
            </div>
            <div className="notif-list">
              {notifs.length === 0
                ? <div className="notif-empty">No notifications</div>
                : notifs.map(n => (
                  <div key={n.id} className={`notif-item${n.read ? ' read' : ''}`}>
                    <div className="notif-icon" style={{ background: typeColor[n.type] + '22', color: typeColor[n.type] }}>
                      {typeIcon[n.type]}
                    </div>
                    <div>
                      <div className="notif-msg">{n.message}</div>
                      <div className="notif-date xs t3">{n.date}</div>
                    </div>
                    {!n.read && <div className="notif-dot" />}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
