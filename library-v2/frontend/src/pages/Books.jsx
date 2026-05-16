import { useEffect, useState } from 'react';
import { getBooks, addBook, updateBook, deleteBook, getGenres } from '../services/api';
import { useToast, Toasts } from '../hooks/useToast.jsx';
import './Books.css';

const COLORS = ['#2D6A4F','#E76F51','#E9C46A','#264653','#8338EC','#FB5607','#3A86FF','#118AB2','#B85C38','#4A7C59','#6A4C93','#F4A261'];
const GENRES = ['Classic Fiction','Science Fiction','Dystopian','Philosophical Fiction','Non-Fiction','Self-Help','Contemporary Fiction','Finance','Business','History','Biography','Mystery'];
const BLANK = { title:'', author:'', genre:'', isbn:'', year:'', copies:1, description:'', coverColor: COLORS[0], pages:'', publisher:'', language:'English', tags:'', rating:0 };

function Stars({ rating, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars" style={{ cursor: onChange ? 'pointer' : 'default' }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`star${(hover||rating) >= n ? ' on' : ''}`}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(n)}>★</span>
      ))}
    </div>
  );
}

export default function Books() {
  const [books, setBooks]     = useState([]);
  const [genres, setGenres]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [genre, setGenre]     = useState('all');
  const [sort, setSort]       = useState('');
  const [availOnly, setAvailOnly] = useState(false);
  const [view, setView]       = useState('grid'); // 'grid' | 'list'
  const [modal, setModal]     = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]       = useState(BLANK);
  const [saving, setSaving]   = useState(false);
  const { toasts, toast }     = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [bRes, gRes] = await Promise.all([getBooks({ search: search || undefined, genre, sort: sort || undefined, available: availOnly || undefined }), getGenres()]);
      setBooks(bRes.data); setGenres(gRes.data);
    } catch { toast('Failed to load books', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, genre, sort, availOnly]);

  const openAdd  = () => { setForm(BLANK); setSelected(null); setModal('form'); };
  const openEdit = (b) => { setSelected(b); setForm({ ...b, tags: (b.tags||[]).join(', ') }); setModal('form'); };
  const openView = (b) => { setSelected(b); setModal('view'); };
  const close    = () => { setModal(null); setSelected(null); };

  const fv = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    if (!form.title || !form.author || !form.isbn) return toast('Title, author & ISBN required', 'error');
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [], rating: +form.rating, copies: +form.copies, pages: +form.pages, year: +form.year };
      if (selected) { await updateBook(selected.id, payload); toast('Book updated', 'success'); }
      else { await addBook(payload); toast('Book added!', 'success'); }
      close(); load();
    } catch (e) { toast(e.response?.data?.error || 'Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this book?')) return;
    try { await deleteBook(id); toast('Book deleted', 'success'); load(); }
    catch (e) { toast(e.response?.data?.error || 'Delete failed', 'error'); }
  };

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-left"><h1>Book <em>Catalog</em></h1><p>{books.length} books found</p></div>
        <button className="btn btn-amber" onClick={openAdd}>＋ Add Book</button>
      </div>

      {/* Controls */}
      <div className="books-controls">
        <div className="search-bar" style={{ flex: 1 }}>
          <span className="si">🔍</span>
          <input className="fc" placeholder="Search title, author, ISBN, tag…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="fc" style={{ width: 160 }} value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="all">All Genres</option>
          {genres.map(g => <option key={g}>{g}</option>)}
        </select>
        <select className="fc" style={{ width: 140 }} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Sort: Default</option>
          <option value="title">Title A–Z</option>
          <option value="author">Author A–Z</option>
          <option value="rating">Top Rated</option>
          <option value="views">Most Viewed</option>
          <option value="year">Newest</option>
        </select>
        <label className="avail-toggle">
          <input type="checkbox" checked={availOnly} onChange={e => setAvailOnly(e.target.checked)} />
          <span>Available only</span>
        </label>
        <div className="view-toggle">
          <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>⊞</button>
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>☰</button>
        </div>
      </div>

      {loading
        ? <div className="loader"><div className="spin" />Loading books…</div>
        : books.length === 0
          ? <div className="empty"><span className="empty-icon">📚</span><h3>No books found</h3><p>Try a different search or genre</p></div>
          : view === 'grid'
            ? (
              <div className="books-grid">
                {books.map(b => <BookCard key={b.id} book={b} onView={openView} onEdit={openEdit} onDel={del} />)}
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Cover</th><th>Title</th><th>Author</th><th>Genre</th><th>Rating</th><th>Year</th><th>Availability</th><th>Actions</th></tr></thead>
                  <tbody>
                    {books.map(b => (
                      <tr key={b.id}>
                        <td><div className="list-cover" style={{ background: b.coverColor }} /></td>
                        <td><div style={{ fontWeight:500, maxWidth:180 }} className="ellipsis">{b.title}</div></td>
                        <td className="t2 sm">{b.author}</td>
                        <td><span className="badge b-muted">{b.genre}</span></td>
                        <td><Stars rating={b.rating} /></td>
                        <td className="t3 xs mono">{b.year}</td>
                        <td>
                          <span className={`badge ${b.available > 0 ? 'b-green' : 'b-red'}`}>{b.available}/{b.copies}</span>
                        </td>
                        <td>
                          <div className="row" style={{ gap: 5 }}>
                            <button className="btn btn-ghost btn-xs" onClick={() => openView(b)}>View</button>
                            <button className="btn btn-ghost btn-xs" onClick={() => openEdit(b)}>Edit</button>
                            <button className="btn btn-danger btn-xs" onClick={() => del(b.id)}>Del</button>
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
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="mh">
              <h2>{selected ? 'Edit Book' : 'Add New Book'}</h2>
              <button className="btn-close" onClick={close}>✕</button>
            </div>
            <div className="mb">
              <div className="g2">
                <div className="fg"><label className="fl">Title *</label><input className="fc" value={form.title} onChange={fv('title')} placeholder="Book title" /></div>
                <div className="fg"><label className="fl">Author *</label><input className="fc" value={form.author} onChange={fv('author')} placeholder="Author name" /></div>
              </div>
              <div className="g2">
                <div className="fg"><label className="fl">ISBN *</label><input className="fc" value={form.isbn} onChange={fv('isbn')} placeholder="978-…" /></div>
                <div className="fg">
                  <label className="fl">Genre</label>
                  <input className="fc" value={form.genre} onChange={fv('genre')} placeholder="Genre" list="gl" />
                  <datalist id="gl">{GENRES.map(g => <option key={g} value={g} />)}</datalist>
                </div>
              </div>
              <div className="g3">
                <div className="fg"><label className="fl">Year</label><input className="fc" type="number" value={form.year} onChange={fv('year')} /></div>
                <div className="fg"><label className="fl">Pages</label><input className="fc" type="number" value={form.pages} onChange={fv('pages')} /></div>
                <div className="fg"><label className="fl">Copies</label><input className="fc" type="number" min="1" value={form.copies} onChange={fv('copies')} /></div>
              </div>
              <div className="g2">
                <div className="fg"><label className="fl">Publisher</label><input className="fc" value={form.publisher} onChange={fv('publisher')} /></div>
                <div className="fg"><label className="fl">Language</label><input className="fc" value={form.language} onChange={fv('language')} /></div>
              </div>
              <div className="fg"><label className="fl">Tags (comma separated)</label><input className="fc" value={form.tags} onChange={fv('tags')} placeholder="fiction, classic, …" /></div>
              <div className="fg"><label className="fl">Description</label><textarea className="fc" value={form.description} onChange={fv('description')} /></div>
              <div className="fg">
                <label className="fl">Rating</label>
                <Stars rating={+form.rating} onChange={r => setForm(p => ({ ...p, rating: r }))} />
              </div>
              <div className="fg">
                <label className="fl">Cover Color</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm(p => ({ ...p, coverColor: c }))}
                      style={{ width:28, height:28, borderRadius:'50%', background:c, border: form.coverColor===c ? '2px solid #fff' : '2px solid transparent', cursor:'pointer', transition:'transform .15s' }}
                      className={form.coverColor===c ? 'color-sel' : ''} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mf">
              <button className="btn btn-ghost" onClick={close}>Cancel</button>
              <button className="btn btn-amber" onClick={save} disabled={saving}>{saving ? 'Saving…' : selected ? 'Save Changes' : 'Add Book'}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="overlay" onClick={close}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="mh">
              <h2>Book Details</h2>
              <button className="btn-close" onClick={close}>✕</button>
            </div>
            <div className="mb">
              <div className="book-view-header" style={{ background: selected.coverColor }}>
                <div className="bvh-title">{selected.title}</div>
                <div className="bvh-author">{selected.author}</div>
                <Stars rating={selected.rating} />
              </div>
              <div style={{ marginTop: 16 }}>
                <div className="row mb12">
                  <span className="badge b-muted">{selected.genre}</span>
                  <span className={`badge ${selected.available > 0 ? 'b-green' : 'b-red'}`}>{selected.available}/{selected.copies} available</span>
                  {selected.year && <span className="badge b-muted">{selected.year}</span>}
                </div>
                <div className="g2" style={{ gap:8 }}>
                  {selected.pages && <div className="detail-chip"><span className="xs t3">Pages</span><span className="sm">{selected.pages}</span></div>}
                  {selected.publisher && <div className="detail-chip"><span className="xs t3">Publisher</span><span className="sm">{selected.publisher}</span></div>}
                  {selected.language && <div className="detail-chip"><span className="xs t3">Language</span><span className="sm">{selected.language}</span></div>}
                  <div className="detail-chip"><span className="xs t3">Views</span><span className="sm mono">{selected.views}</span></div>
                </div>
                {selected.description && <p className="sm t2 mt12" style={{ lineHeight:1.7 }}>{selected.description}</p>}
                {selected.tags?.length > 0 && (
                  <div className="row mt12">{selected.tags.map(t => <span key={t} className="tag">#{t}</span>)}</div>
                )}
              </div>
            </div>
            <div className="mf">
              <button className="btn btn-ghost" onClick={close}>Close</button>
              <button className="btn btn-amber" onClick={() => { close(); openEdit(selected); }}>Edit Book</button>
            </div>
          </div>
        </div>
      )}

      <Toasts toasts={toasts} />
    </div>
  );
}

function BookCard({ book, onView, onEdit, onDel }) {
  return (
    <div className="book-card">
      <div className="book-cover" style={{ background: book.coverColor }} onClick={() => onView(book)}>
        <div className="bc-overlay">
          <div className="bc-title">{book.title}</div>
          <div className="bc-author">{book.author}</div>
          <Stars rating={book.rating} />
        </div>
        <div className="bc-avail">
          <span className={`badge ${book.available > 0 ? 'b-green' : 'b-red'}`} style={{ fontSize:'.62rem' }}>
            {book.available > 0 ? `${book.available} avail` : 'Out'}
          </span>
        </div>
      </div>
      <div className="book-body">
        <div className="sm ellipsis" style={{ fontWeight:500 }}>{book.title}</div>
        <div className="xs t3 mt4 ellipsis">{book.author}</div>
        <div className="row mt8" style={{ gap:5, flexWrap:'wrap' }}>
          <span className="badge b-muted" style={{ fontSize:'.62rem' }}>{book.genre}</span>
          {book.year && <span className="xs t3 mono">{book.year}</span>}
        </div>
        {book.tags?.slice(0,2).map(t => <span key={t} className="tag">#{t}</span>)}
        <div className="book-actions">
          <button className="btn btn-ghost btn-xs" onClick={() => onView(book)}>View</button>
          <button className="btn btn-ghost btn-xs" onClick={() => onEdit(book)}>Edit</button>
          <button className="btn btn-danger btn-xs" onClick={() => onDel(book.id)}>✕</button>
        </div>
      </div>
    </div>
  );
}
