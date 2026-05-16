import { useEffect, useState } from 'react';
import { getReservations, addReservation, cancelReservation, getBooks, getMembers } from '../services/api';
import { useToast, Toasts } from '../hooks/useToast.jsx';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [books, setBooks]     = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm]       = useState({ bookId:'', memberId:'' });
  const [saving, setSaving]   = useState(false);
  const { toasts, toast }     = useToast();

  const load = () => {
    setLoading(true);
    getReservations().then(r => setReservations(r.data)).catch(() => toast('Failed to load','error')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openModal = async () => {
    setForm({ bookId:'', memberId:'' }); setModal(true);
    const [bRes, mRes] = await Promise.all([getBooks(), getMembers()]);
    setBooks(bRes.data); setMembers(mRes.data.filter(m=>m.status==='active'));
  };

  const save = async () => {
    if (!form.bookId||!form.memberId) return toast('Select book & member','error');
    setSaving(true);
    try { await addReservation(form); toast('Reserved!','success'); setModal(false); load(); }
    catch(e) { toast(e.response?.data?.error||'Failed','error'); }
    finally { setSaving(false); }
  };

  const cancel = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    try { await cancelReservation(id); toast('Reservation cancelled','info'); load(); }
    catch { toast('Failed','error'); }
  };

  const isExpired = r => r.expiryDate < new Date().toISOString().split('T')[0];

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-left"><h1>Book <em>Reservations</em></h1><p>Hold books for members</p></div>
        <button className="btn btn-amber" onClick={openModal}>＋ Reserve</button>
      </div>

      {loading
        ? <div className="loader"><div className="spin"/>Loading…</div>
        : reservations.length===0
          ? <div className="empty"><span className="empty-icon">🔖</span><h3>No reservations</h3><p>Reserve a book for a member</p></div>
          : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Book</th><th>Member</th><th>Reserved On</th><th>Expires</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight:500 }}>{r.bookTitle}</td>
                    <td className="t2 sm">{r.memberName}</td>
                    <td className="xs mono t3">{r.reservedDate}</td>
                    <td className={`xs mono${isExpired(r)?' overdue-text':' t3'}`}>{r.expiryDate}</td>
                    <td>
                      <span className={`badge ${isExpired(r)?'b-red':r.notified?'b-green':'b-amber'}`}>
                        {isExpired(r)?'expired':r.notified?'ready':'pending'}
                      </span>
                    </td>
                    <td><button className="btn btn-danger btn-xs" onClick={()=>cancel(r.id)}>Cancel</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      {modal && (
        <div className="overlay" onClick={()=>setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="mh"><h2>Reserve a Book</h2><button className="btn-close" onClick={()=>setModal(false)}>✕</button></div>
            <div className="mb">
              <div className="fg">
                <label className="fl">Book *</label>
                <select className="fc" value={form.bookId} onChange={e=>setForm(p=>({...p,bookId:e.target.value}))}>
                  <option value="">— Select book —</option>
                  {books.map(b=><option key={b.id} value={b.id}>{b.title} ({b.available} avail.)</option>)}
                </select>
              </div>
              <div className="fg">
                <label className="fl">Member *</label>
                <select className="fc" value={form.memberId} onChange={e=>setForm(p=>({...p,memberId:e.target.value}))}>
                  <option value="">— Select member —</option>
                  {members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="issue-info">
                <div className="xs t3">📌 Reservation holds a book for 7 days. Member will be notified when available.</div>
              </div>
            </div>
            <div className="mf">
              <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-amber" onClick={save} disabled={saving}>{saving?'Reserving…':'Reserve'}</button>
            </div>
          </div>
        </div>
      )}
      <Toasts toasts={toasts} />
    </div>
  );
}
