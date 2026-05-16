import { useEffect, useState } from 'react';
import { getFines, payFine } from '../services/api';
import { useToast, Toasts } from '../hooks/useToast.jsx';
import './Fines.css';

export default function Fines() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const { toasts, toast }     = useToast();

  const load = () => {
    setLoading(true);
    getFines().then(r => setData(r.data)).catch(() => toast('Failed to load','error')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handlePay = async (txnId, amount) => {
    if (!confirm(`Mark ₹${amount} fine as paid?`)) return;
    try { await payFine(txnId); toast(`₹${amount} marked as paid`,'success'); load(); }
    catch { toast('Failed','error'); }
  };

  if (loading) return <div className="page"><div className="loader"><div className="spin"/>Loading…</div></div>;

  const txns = data.transactions.filter(t => filter==='all'||( filter==='pending'&&!t.paid)||(filter==='paid'&&t.paid));

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-left"><h1>Fine <em>Management</em></h1><p>Track & collect overdue fines</p></div>
      </div>

      {/* Summary */}
      <div className="fines-summary">
        <div className="fine-stat">
          <div className="fine-stat-icon" style={{ background:'rgba(239,68,68,.12)', color:'var(--red)' }}>⚠</div>
          <div>
            <div style={{ fontSize:'1.6rem', fontWeight:600, color:'var(--red)' }}>₹{data.totalPending}</div>
            <div className="xs t3">Pending Fines</div>
          </div>
        </div>
        <div className="fine-stat">
          <div className="fine-stat-icon" style={{ background:'rgba(16,185,129,.12)', color:'var(--green)' }}>✓</div>
          <div>
            <div style={{ fontSize:'1.6rem', fontWeight:600, color:'var(--green)' }}>₹{data.totalCollected}</div>
            <div className="xs t3">Collected</div>
          </div>
        </div>
        <div className="fine-stat">
          <div className="fine-stat-icon" style={{ background:'var(--amber-glow)', color:'var(--amber)' }}>₹</div>
          <div>
            <div style={{ fontSize:'1.6rem', fontWeight:600 }}>₹{data.totalPending + data.totalCollected}</div>
            <div className="xs t3">Total Fines</div>
          </div>
        </div>
        <div className="fine-stat">
          <div className="fine-stat-icon" style={{ background:'var(--blue-dim)', color:'var(--blue)' }}>📋</div>
          <div>
            <div style={{ fontSize:'1.6rem', fontWeight:600 }}>{data.transactions.length}</div>
            <div className="xs t3">Fine Records</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs mb20">
        {['all','pending','paid'].map(f => (
          <button key={f} className={`tab${filter===f?' active':''}`} onClick={()=>setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {txns.length===0
        ? <div className="empty"><span className="empty-icon">💰</span><h3>No fines here</h3><p>All clear in this category</p></div>
        : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Book</th><th>Member</th><th>Issue Date</th><th>Due Date</th><th>Returned</th><th>Days Late</th><th>Fine</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {txns.map(t => {
                const daysLate = t.returnDate
                  ? Math.max(0,Math.floor((new Date(t.returnDate)-new Date(t.dueDate))/86400000))
                  : Math.max(0,Math.floor((new Date()-new Date(t.dueDate))/86400000));
                return (
                  <tr key={t.id}>
                    <td style={{ fontWeight:500, maxWidth:160 }} className="ellipsis">{t.bookTitle}</td>
                    <td className="sm t2">{t.memberName}</td>
                    <td className="xs mono t3">{t.issueDate}</td>
                    <td className="xs mono" style={{ color:'var(--red)' }}>{t.dueDate}</td>
                    <td className="xs mono t3">{t.returnDate||'Not returned'}</td>
                    <td><span className="badge b-red">{daysLate}d</span></td>
                    <td style={{ fontWeight:700, color:'var(--amber)' }}>₹{t.fine}</td>
                    <td><span className={`badge ${t.paid?'b-green':'b-red'}`}>{t.paid?'Paid':'Pending'}</span></td>
                    <td>
                      {!t.paid && (
                        <button className="btn btn-green btn-xs" onClick={()=>handlePay(t.id, t.fine)}>Mark Paid</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Toasts toasts={toasts} />
    </div>
  );
}
