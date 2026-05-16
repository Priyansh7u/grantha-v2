import { useEffect, useState } from 'react';
import { getTransactions, issueBook, returnBook, renewBook, getBooks, getMembers } from '../services/api';
import { useToast, Toasts } from '../hooks/useToast.jsx';
import './Transactions.css';

export default function Transactions() {
  const [txns, setTxns]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState('all');
  const [modal, setModal]       = useState(null);
  const [books, setBooks]       = useState([]);
  const [members, setMembers]   = useState([]);
  const [form, setForm]         = useState({ bookId:'', memberId:'', daysAllowed:14 });
  const [saving, setSaving]     = useState(false);
  const { toasts, toast }       = useToast();

  const load = () => {
    setLoading(true);
    getTransactions({ status })
      .then(r => setTxns(r.data))
      .catch(() => toast('Failed to load','error'))
      .finally(() => setLoading(false));
  };
  useEffect(load, [status]);

  const openIssue = async () => {
    setForm({ bookId:'', memberId:'', daysAllowed:14 });
    setModal('issue');
    const [bRes, mRes] = await Promise.all([getBooks({ available: true }), getMembers()]);
    setBooks(bRes.data); setMembers(mRes.data);
  };

  const handleIssue = async () => {
    if (!form.bookId || !form.memberId) return toast('Select book & member','error');
    setSaving(true);
    try {
      await issueBook(form);
      toast('Book issued successfully!','success');
      setModal(null); load();
    } catch(e) { toast(e.response?.data?.error||'Issue failed','error'); }
    finally { setSaving(false); }
  };

  const handleReturn = async (id) => {
    if (!confirm('Mark this book as returned?')) return;
    try {
      const r = await returnBook(id);
      const fine = r.data.fine;
      toast(fine>0 ? `Returned! Fine: ₹${fine}` : 'Returned successfully','success');
      load();
    } catch(e) { toast(e.response?.data?.error||'Return failed','error'); }
  };

  const handleRenew = async (id) => {
    try {
      await renewBook(id);
      toast('Renewed for 14 more days','success');
      load();
    } catch(e) { toast(e.response?.data?.error||'Renewal failed','error'); }
  };

  const dueDate = () => {
    if (!form.daysAllowed) return null;
    return new Date(Date.now() + form.daysAllowed*86400000)
      .toLocaleDateString('en-IN',{ weekday:'short', day:'numeric', month:'short', year:'numeric' });
  };

  const statusBadge = s => {
    const m = { issued:'b-blue', returned:'b-green', overdue:'b-red' };
    return <span className={`badge ${m[s]||'b-muted'}`}>{s}</span>;
  };

  const counts = {
    all: txns.length,
    issued: txns.filter(t=>t.status==='issued').length,
    overdue: txns.filter(t=>t.status==='overdue').length,
    returned: txns.filter(t=>t.status==='returned').length,
  };

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-left"><h1>Book <em>Transactions</em></h1><p>Manage issuances and returns</p></div>
        <button className="btn btn-amber" onClick={openIssue}>＋ Issue Book</button>
      </div>

      {/* Status filter tabs */}
      <div className="txn-tabs mb20">
        {['all','issued','overdue','returned'].map(s => (
          <button key={s} className={`txn-tab${status===s?' active':''} ${s==='overdue'&&counts.overdue>0?'warn':''}`}
            onClick={()=>setStatus(s)}>
            <span>{s.charAt(0).toUpperCase()+s.slice(1)}</span>
            <span className="txn-count">{counts[s]}</span>
          </button>
        ))}
      </div>

      {loading
        ? <div className="loader"><div className="spin"/>Loading…</div>
        : txns.length===0
          ? <div className="empty"><span className="empty-icon">↕</span><h3>No transactions</h3><p>Issue a book to get started</p></div>
          : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Book</th><th>Member</th>
                  <th>Issue Date</th><th>Due Date</th><th>Return</th>
                  <th>Renewals</th><th>Fine</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t,i) => {
                  const overdue = t.status!=='returned' && t.dueDate < new Date().toISOString().split('T')[0];
                  return (
                    <tr key={t.id} style={overdue?{background:'rgba(239,68,68,.04)'}:{}}>
                      <td className="xs t3 mono">{i+1}</td>
                      <td style={{ maxWidth:180 }}>
                        <div className="sm ellipsis" style={{ fontWeight:500 }}>{t.bookTitle}</div>
                      </td>
                      <td className="sm t2">{t.memberName}</td>
                      <td className="xs mono t3">{t.issueDate}</td>
                      <td className={`xs mono${overdue?' overdue-text':' t3'}`}>{t.dueDate}</td>
                      <td className="xs mono t3">{t.returnDate||'—'}</td>
                      <td>
                        <span className="xs mono t2">{t.renewals}/{t.maxRenewals}</span>
                      </td>
                      <td style={{ color: t.fine>0?'var(--amber)':'var(--text-3)', fontWeight: t.fine>0?600:400 }}>
                        {t.fine>0?`₹${t.fine}`:'—'}
                      </td>
                      <td>{statusBadge(overdue&&t.status!=='returned'?'overdue':t.status)}</td>
                      <td>
                        <div className="row" style={{ gap:4 }}>
                          {t.status!=='returned' && <>
                            <button className="btn btn-green btn-xs" onClick={()=>handleReturn(t.id)}>Return</button>
                            {t.renewals<t.maxRenewals && (
                              <button className="btn btn-ghost btn-xs" onClick={()=>handleRenew(t.id)}>Renew</button>
                            )}
                          </>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      }

      {/* Issue Modal */}
      {modal==='issue' && (
        <div className="overlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="mh"><h2>Issue a Book</h2><button className="btn-close" onClick={()=>setModal(null)}>✕</button></div>
            <div className="mb">
              <div className="fg">
                <label className="fl">Select Book *</label>
                <select className="fc" value={form.bookId} onChange={e=>setForm(p=>({...p,bookId:e.target.value}))}>
                  <option value="">— Choose available book —</option>
                  {books.map(b => <option key={b.id} value={b.id}>{b.title} — {b.author} ({b.available} avail.)</option>)}
                </select>
              </div>
              <div className="fg">
                <label className="fl">Select Member *</label>
                <select className="fc" value={form.memberId} onChange={e=>setForm(p=>({...p,memberId:e.target.value}))}>
                  <option value="">— Choose member —</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.membershipType}) — {m.booksIssued} books</option>)}
                </select>
              </div>
              <div className="fg">
                <label className="fl">Loan Period (days)</label>
                <input className="fc" type="number" min="1" max="90" value={form.daysAllowed}
                  onChange={e=>setForm(p=>({...p,daysAllowed:e.target.value}))} />
              </div>
              {form.daysAllowed && (
                <div className="issue-info">
                  <div className="row" style={{ gap:8 }}>
                    <span className="xs t3">📅 Due date:</span>
                    <span className="sm" style={{ color:'var(--amber)', fontWeight:500 }}>{dueDate()}</span>
                  </div>
                  <div className="row mt8" style={{ gap:8 }}>
                    <span className="xs t3">💰 Fine rate:</span>
                    <span className="sm t2">₹5 per day after due</span>
                  </div>
                  <div className="row mt8" style={{ gap:8 }}>
                    <span className="xs t3">🔄 Max renewals:</span>
                    <span className="sm t2">2 times (14 days each)</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mf">
              <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-amber" onClick={handleIssue} disabled={saving}>{saving?'Issuing…':'Issue Book'}</button>
            </div>
          </div>
        </div>
      )}

      <Toasts toasts={toasts} />
    </div>
  );
}
