import { useEffect, useState } from 'react';
import { getMembers, addMember, updateMember, deleteMember, getMember } from '../services/api';
import { useToast, Toasts } from '../hooks/useToast.jsx';
import './Members.css';

const BLANK = { name:'', email:'', phone:'', address:'', membershipType:'Standard', notes:'' };
const TYPES = ['Standard','Premium','Student'];
const AVATAR_COLORS = ['#E76F51','#2D6A4F','#8338EC','#3A86FF','#F59E0B','#10B981','#EF4444','#6366F1'];

function initials(name) { return name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase(); }
function avatarColor(name) { let h=0; for(let c of name) h+=c.charCodeAt(0); return AVATAR_COLORS[h % AVATAR_COLORS.length]; }

export default function Members() {
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [typeFilter, setType]   = useState('all');
  const [statusFilter, setStatus] = useState('all');
  const [modal, setModal]       = useState(null); // 'form'|'profile'
  const [selected, setSelected] = useState(null);
  const [profile, setProfile]   = useState(null);
  const [form, setForm]         = useState(BLANK);
  const [saving, setSaving]     = useState(false);
  const { toasts, toast }       = useToast();

  const load = () => {
    setLoading(true);
    getMembers({ search: search||undefined, type: typeFilter, status: statusFilter })
      .then(r => setMembers(r.data))
      .catch(() => toast('Failed to load members','error'))
      .finally(() => setLoading(false));
  };
  useEffect(load, [search, typeFilter, statusFilter]);

  const openAdd  = () => { setForm(BLANK); setSelected(null); setModal('form'); };
  const openEdit = (m) => { setSelected(m); setForm({...m}); setModal('form'); };
  const openProfile = async (m) => {
    setModal('profile'); setProfile(null);
    try { const r = await getMember(m.id); setProfile(r.data); }
    catch { toast('Failed to load profile','error'); }
  };
  const close = () => { setModal(null); setSelected(null); setProfile(null); };
  const fv = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const save = async () => {
    if (!form.name || !form.email) return toast('Name & email required','error');
    setSaving(true);
    try {
      if (selected) { await updateMember(selected.id, form); toast('Member updated','success'); }
      else { await addMember(form); toast('Member added!','success'); }
      close(); load();
    } catch(e) { toast(e.response?.data?.error || 'Save failed','error'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Remove this member?')) return;
    try { await deleteMember(id); toast('Member removed','success'); load(); }
    catch(e) { toast(e.response?.data?.error || 'Delete failed','error'); }
  };

  const membershipColor = { Premium:'b-amber', Standard:'b-blue', Student:'b-purple' };
  const statusColor = { active:'b-green', expired:'b-red', suspended:'b-red' };

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-left"><h1>Library <em>Members</em></h1><p>{members.length} members registered</p></div>
        <button className="btn btn-amber" onClick={openAdd}>＋ Add Member</button>
      </div>

      {/* Filters */}
      <div className="row mb20" style={{ gap:10 }}>
        <div className="search-bar" style={{ flex:1 }}>
          <span className="si">🔍</span>
          <input className="fc" placeholder="Search name, email, phone…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="fc" style={{ width:140 }} value={typeFilter} onChange={e=>setType(e.target.value)}>
          <option value="all">All Types</option>
          {TYPES.map(t=><option key={t}>{t}</option>)}
        </select>
        <select className="fc" style={{ width:130 }} value={statusFilter} onChange={e=>setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Summary Chips */}
      <div className="row mb20" style={{ gap:8 }}>
        {TYPES.map(t => {
          const cnt = members.filter(m=>m.membershipType===t).length;
          return <div key={t} className="mem-chip"><span className={`badge ${membershipColor[t]}`}>{t}</span><span className="xs t3">{cnt} members</span></div>;
        })}
        <div className="mem-chip"><span className="badge b-red">⚠ Fines</span><span className="xs t3">{members.filter(m=>m.finesDue>0).length} members</span></div>
      </div>

      {loading
        ? <div className="loader"><div className="spin"/>Loading members…</div>
        : members.length === 0
          ? <div className="empty"><span className="empty-icon">👥</span><h3>No members found</h3></div>
          : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Member</th><th>Contact</th><th>Type</th><th>Books Issued</th><th>Total Read</th><th>Fines Due</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="row" style={{ gap:10 }}>
                        <div className="avatar" style={{ background: avatarColor(m.name) }}>{initials(m.name)}</div>
                        <div>
                          <div style={{ fontWeight:500 }}>{m.name}</div>
                          {m.notes && <div className="xs t3">{m.notes}</div>}
                        </div>
                      </div>
                    </td>
                    <td><div className="sm t2">{m.email}</div><div className="xs t3 mt4">{m.phone||'—'}</div></td>
                    <td><span className={`badge ${membershipColor[m.membershipType]||'b-muted'}`}>{m.membershipType}</span></td>
                    <td>
                      <div className="row" style={{ gap:6 }}>
                        <span style={{ fontWeight:600, color: m.booksIssued>0?'var(--amber)':'var(--text-2)' }}>{m.booksIssued}</span>
                        <span className="xs t3">/ max {m.membershipType==='Premium'?5:m.membershipType==='Student'?3:2}</span>
                      </div>
                    </td>
                    <td className="sm t2">{m.totalBooksRead}</td>
                    <td style={{ color: m.finesDue>0?'var(--red)':'var(--text-3)', fontWeight: m.finesDue>0?600:400 }}>
                      {m.finesDue>0 ? `₹${m.finesDue}` : '—'}
                    </td>
                    <td><span className={`badge ${statusColor[m.status]||'b-muted'}`}>{m.status}</span></td>
                    <td className="xs t3 mono">{m.joinDate}</td>
                    <td>
                      <div className="row" style={{ gap:5 }}>
                        <button className="btn btn-ghost btn-xs" onClick={()=>openProfile(m)}>Profile</button>
                        <button className="btn btn-ghost btn-xs" onClick={()=>openEdit(m)}>Edit</button>
                        <button className="btn btn-danger btn-xs" onClick={()=>del(m.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      {/* Add/Edit Modal */}
      {modal === 'form' && (
        <div className="overlay" onClick={close}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="mh"><h2>{selected?'Edit Member':'Add Member'}</h2><button className="btn-close" onClick={close}>✕</button></div>
            <div className="mb">
              {!selected && (
                <div className="mem-avatar-preview" style={{ background: form.name ? avatarColor(form.name) : 'var(--bg-4)' }}>
                  {form.name ? initials(form.name) : '?'}
                </div>
              )}
              <div className="g2">
                <div className="fg"><label className="fl">Full Name *</label><input className="fc" value={form.name} onChange={fv('name')} placeholder="Full name" /></div>
                <div className="fg"><label className="fl">Email *</label><input className="fc" type="email" value={form.email} onChange={fv('email')} placeholder="email@example.com" /></div>
              </div>
              <div className="g2">
                <div className="fg"><label className="fl">Phone</label><input className="fc" value={form.phone} onChange={fv('phone')} placeholder="+91 …" /></div>
                <div className="fg">
                  <label className="fl">Membership Type</label>
                  <select className="fc" value={form.membershipType} onChange={fv('membershipType')}>
                    {TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="fg"><label className="fl">Address</label><input className="fc" value={form.address} onChange={fv('address')} placeholder="City, State" /></div>
              <div className="fg"><label className="fl">Notes</label><textarea className="fc" value={form.notes} onChange={fv('notes')} placeholder="Any notes…" style={{ minHeight:60 }} /></div>
              <div className="mem-limits-info">
                <span className="xs t3">📋 Borrow limits:</span>
                <span className="xs t2">Standard: 2 books &nbsp;|&nbsp; Student: 3 books &nbsp;|&nbsp; Premium: 5 books</span>
              </div>
            </div>
            <div className="mf">
              <button className="btn btn-ghost" onClick={close}>Cancel</button>
              <button className="btn btn-amber" onClick={save} disabled={saving}>{saving?'Saving…':selected?'Save Changes':'Add Member'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {modal === 'profile' && (
        <div className="overlay" onClick={close}>
          <div className="modal" style={{ maxWidth:580 }} onClick={e=>e.stopPropagation()}>
            <div className="mh"><h2>Member Profile</h2><button className="btn-close" onClick={close}>✕</button></div>
            <div className="mb">
              {!profile ? <div className="loader"><div className="spin"/>Loading…</div> : (
                <>
                  <div className="profile-hero">
                    <div className="profile-avatar" style={{ background: avatarColor(profile.name) }}>{initials(profile.name)}</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'1.1rem' }}>{profile.name}</div>
                      <div className="sm t2 mt4">{profile.email}</div>
                      <div className="row mt8" style={{ gap:6 }}>
                        <span className={`badge ${membershipColor[profile.membershipType]||'b-muted'}`}>{profile.membershipType}</span>
                        <span className={`badge ${statusColor[profile.status]||'b-muted'}`}>{profile.status}</span>
                        {profile.finesDue>0 && <span className="badge b-red">₹{profile.finesDue} due</span>}
                      </div>
                    </div>
                  </div>
                  <div className="g3 mt16" style={{ gap:8 }}>
                    <div className="stat-mini"><div className="sm t3">Books Issued</div><div style={{ fontSize:'1.4rem', fontWeight:600, color:'var(--amber)' }}>{profile.booksIssued}</div></div>
                    <div className="stat-mini"><div className="sm t3">Total Read</div><div style={{ fontSize:'1.4rem', fontWeight:600 }}>{profile.totalBooksRead}</div></div>
                    <div className="stat-mini"><div className="sm t3">Member Since</div><div className="sm" style={{ fontWeight:500 }}>{profile.joinDate}</div></div>
                  </div>
                  {profile.address && <div className="mt12 sm t2">📍 {profile.address}</div>}
                  {profile.phone && <div className="mt4 sm t2">📞 {profile.phone}</div>}
                  {profile.notes && <div className="mt4 sm t2">📝 {profile.notes}</div>}
                  {profile.transactions?.length > 0 && (
                    <div className="mt16">
                      <div className="card-title">Transaction History</div>
                      <div className="profile-txns">
                        {profile.transactions.slice(0,5).map(t => (
                          <div key={t.id} className="ptxn">
                            <div style={{ flex:1, overflow:'hidden' }}>
                              <div className="sm ellipsis" style={{ fontWeight:500 }}>{t.bookTitle}</div>
                              <div className="xs t3 mt4">{t.issueDate} → {t.returnDate||t.dueDate}</div>
                            </div>
                            <div className="row" style={{ gap:6 }}>
                              <span className={`badge ${t.status==='returned'?'b-green':t.status==='overdue'?'b-red':'b-blue'}`}>{t.status}</span>
                              {t.fine>0 && <span className="xs" style={{ color:'var(--amber)' }}>₹{t.fine}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="mf">
              <button className="btn btn-ghost" onClick={close}>Close</button>
              {profile && <button className="btn btn-amber" onClick={()=>{ close(); openEdit(profile); }}>Edit Member</button>}
            </div>
          </div>
        </div>
      )}

      <Toasts toasts={toasts} />
    </div>
  );
}
