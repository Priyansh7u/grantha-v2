const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

/* ─────────────────────────────────────────────────────────
   SEED DATA
───────────────────────────────────────────────────────── */
let books = [
  { id: uuidv4(), title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic Fiction', isbn: '978-0743273565', year: 1925, copies: 3, available: 2, description: 'A story of the fabulously wealthy Jay Gatsby and his love for Daisy Buchanan.', coverColor: '#2D6A4F', rating: 4.5, pages: 180, publisher: 'Scribner', language: 'English', tags: ['classic', 'american', 'romance'], views: 142 },
  { id: uuidv4(), title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic Fiction', isbn: '978-0061935466', year: 1960, copies: 5, available: 4, description: 'An unforgettable novel of a childhood in a sleepy Southern town.', coverColor: '#E76F51', rating: 4.8, pages: 281, publisher: 'HarperCollins', language: 'English', tags: ['classic', 'justice', 'americana'], views: 289 },
  { id: uuidv4(), title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', isbn: '978-0441013593', year: 1965, copies: 4, available: 4, description: 'The interstellar empire and Arrakis — source of the most valuable substance in the universe.', coverColor: '#E9C46A', rating: 4.7, pages: 412, publisher: 'Ace Books', language: 'English', tags: ['scifi', 'epic', 'politics'], views: 198 },
  { id: uuidv4(), title: '1984', author: 'George Orwell', genre: 'Dystopian', isbn: '978-0451524935', year: 1949, copies: 6, available: 5, description: 'A chilling portrait of a totalitarian society.', coverColor: '#264653', rating: 4.6, pages: 328, publisher: 'Secker & Warburg', language: 'English', tags: ['dystopia', 'politics', 'classic'], views: 312 },
  { id: uuidv4(), title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Philosophical Fiction', isbn: '978-0062315007', year: 1988, copies: 4, available: 3, description: 'A young Andalusian shepherd journeys to find treasure.', coverColor: '#8338EC', rating: 4.3, pages: 163, publisher: 'HarperOne', language: 'English', tags: ['philosophy', 'journey', 'spiritual'], views: 223 },
  { id: uuidv4(), title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-Fiction', isbn: '978-0062316097', year: 2011, copies: 3, available: 2, description: 'A brief history of humankind.', coverColor: '#FB5607', rating: 4.4, pages: 443, publisher: 'Harper', language: 'English', tags: ['history', 'science', 'humans'], views: 176 },
  { id: uuidv4(), title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', isbn: '978-0735211292', year: 2018, copies: 5, available: 5, description: 'An easy and proven way to build good habits.', coverColor: '#3A86FF', rating: 4.6, pages: 271, publisher: 'Avery', language: 'English', tags: ['habits', 'productivity', 'psychology'], views: 445 },
  { id: uuidv4(), title: 'The Midnight Library', author: 'Matt Haig', genre: 'Contemporary Fiction', isbn: '978-0525559474', year: 2020, copies: 3, available: 3, description: 'Between life and death there is a library with infinite shelves.', coverColor: '#118AB2', rating: 4.2, pages: 304, publisher: 'Viking', language: 'English', tags: ['fantasy', 'life', 'choices'], views: 134 },
  { id: uuidv4(), title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', genre: 'Finance', isbn: '978-1612680194', year: 1997, copies: 4, available: 3, description: 'What the rich teach their kids about money.', coverColor: '#B85C38', rating: 4.1, pages: 207, publisher: 'Plata Publishing', language: 'English', tags: ['finance', 'investing', 'wealth'], views: 389 },
  { id: uuidv4(), title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Finance', isbn: '978-0857197689', year: 2020, copies: 3, available: 2, description: 'Timeless lessons on wealth, greed, and happiness.', coverColor: '#4A7C59', rating: 4.7, pages: 242, publisher: 'Harriman House', language: 'English', tags: ['finance', 'psychology', 'behavior'], views: 267 },
  { id: uuidv4(), title: 'Deep Work', author: 'Cal Newport', genre: 'Self-Help', isbn: '978-1455586691', year: 2016, copies: 2, available: 1, description: 'Rules for focused success in a distracted world.', coverColor: '#6A4C93', rating: 4.5, pages: 296, publisher: 'Grand Central Publishing', language: 'English', tags: ['productivity', 'focus', 'work'], views: 198 },
  { id: uuidv4(), title: 'The Lean Startup', author: 'Eric Ries', genre: 'Business', isbn: '978-0307887894', year: 2011, copies: 3, available: 3, description: 'How constant innovation creates radically successful businesses.', coverColor: '#F4A261', rating: 4.3, pages: 336, publisher: 'Crown Business', language: 'English', tags: ['startup', 'business', 'innovation'], views: 156 },
];

let members = [
  { id: uuidv4(), name: 'Arjun Sharma', email: 'arjun.sharma@email.com', phone: '+91 98765 43210', joinDate: '2024-01-15', membershipType: 'Premium', membershipExpiry: '2025-01-15', booksIssued: 1, totalBooksRead: 12, address: 'Connaught Place, New Delhi', status: 'active', finesDue: 0, notes: '' },
  { id: uuidv4(), name: 'Priya Patel', email: 'priya.patel@email.com', phone: '+91 87654 32109', joinDate: '2024-02-20', membershipType: 'Standard', membershipExpiry: '2025-02-20', booksIssued: 2, totalBooksRead: 7, address: 'Bandra West, Mumbai', status: 'active', finesDue: 30, notes: 'Overdue fine pending' },
  { id: uuidv4(), name: 'Rahul Verma', email: 'rahul.verma@email.com', phone: '+91 76543 21098', joinDate: '2024-03-10', membershipType: 'Standard', membershipExpiry: '2025-03-10', booksIssued: 0, totalBooksRead: 4, address: 'Koramangala, Bangalore', status: 'active', finesDue: 0, notes: '' },
  { id: uuidv4(), name: 'Sneha Gupta', email: 'sneha.gupta@email.com', phone: '+91 65432 10987', joinDate: '2024-04-05', membershipType: 'Premium', membershipExpiry: '2025-04-05', booksIssued: 1, totalBooksRead: 19, address: 'Salt Lake, Kolkata', status: 'active', finesDue: 0, notes: 'VIP member' },
  { id: uuidv4(), name: 'Vikram Singh', email: 'vikram.singh@email.com', phone: '+91 54321 09876', joinDate: '2024-05-01', membershipType: 'Student', membershipExpiry: '2025-05-01', booksIssued: 0, totalBooksRead: 3, address: 'Sector 15, Noida', status: 'active', finesDue: 0, notes: '' },
  { id: uuidv4(), name: 'Anjali Mehta', email: 'anjali.mehta@email.com', phone: '+91 43210 98765', joinDate: '2023-11-20', membershipType: 'Standard', membershipExpiry: '2024-11-20', booksIssued: 0, totalBooksRead: 8, address: 'Jubilee Hills, Hyderabad', status: 'expired', finesDue: 0, notes: '' },
];

let transactions = [];
let reservations = [];
let notifications = [];

// Seed transactions
const b = books, m = members;
const makeDate = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];

transactions.push({ id: uuidv4(), bookId: b[1].id, memberId: m[0].id, bookTitle: b[1].title, memberName: m[0].name, issueDate: makeDate(7), dueDate: makeDate(-7), returnDate: null, status: 'issued', fine: 0, renewals: 0, maxRenewals: 2 });
transactions.push({ id: uuidv4(), bookId: b[4].id, memberId: m[1].id, bookTitle: b[4].title, memberName: m[1].name, issueDate: makeDate(20), dueDate: makeDate(6), returnDate: null, status: 'overdue', fine: 30, renewals: 1, maxRenewals: 2 });
transactions.push({ id: uuidv4(), bookId: b[5].id, memberId: m[1].id, bookTitle: b[5].title, memberName: m[1].name, issueDate: makeDate(5), dueDate: makeDate(-9), returnDate: null, status: 'issued', fine: 0, renewals: 0, maxRenewals: 2 });
transactions.push({ id: uuidv4(), bookId: b[3].id, memberId: m[3].id, bookTitle: b[3].title, memberName: m[3].name, issueDate: makeDate(14), dueDate: makeDate(-7), returnDate: null, status: 'issued', fine: 0, renewals: 0, maxRenewals: 2 });
transactions.push({ id: uuidv4(), bookId: b[0].id, memberId: m[2].id, bookTitle: b[0].title, memberName: m[2].name, issueDate: makeDate(30), dueDate: makeDate(16), returnDate: makeDate(15), status: 'returned', fine: 0, renewals: 1, maxRenewals: 2 });
transactions.push({ id: uuidv4(), bookId: b[6].id, memberId: m[0].id, bookTitle: b[6].title, memberName: m[0].name, issueDate: makeDate(45), dueDate: makeDate(31), returnDate: makeDate(28), status: 'returned', fine: 0, renewals: 0, maxRenewals: 2 });
transactions.push({ id: uuidv4(), bookId: b[8].id, memberId: m[3].id, bookTitle: b[8].title, memberName: m[3].name, issueDate: makeDate(60), dueDate: makeDate(46), returnDate: makeDate(40), status: 'returned', fine: 0, renewals: 2, maxRenewals: 2 });

// Adjust availability
b[1].available = 4; b[4].available = 3; b[5].available = 2; b[3].available = 4;

// Seed reservations
reservations.push({ id: uuidv4(), bookId: b[10].id, memberId: m[2].id, bookTitle: b[10].title, memberName: m[2].name, reservedDate: makeDate(2), expiryDate: makeDate(-5), status: 'pending', notified: false });

// Seed notifications
notifications.push({ id: uuidv4(), type: 'overdue', message: `Overdue reminder sent to ${m[1].name}`, date: makeDate(1), read: false });
notifications.push({ id: uuidv4(), type: 'return', message: `${m[2].name} returned "${b[0].title}"`, date: makeDate(15), read: true });
notifications.push({ id: uuidv4(), type: 'new_member', message: `${m[4].name} joined as a new member`, date: makeDate(10), read: false });

/* ─────────────────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────────────────── */
app.get('/api/dashboard', (req, res) => {
  const totalBooks = books.reduce((s, b) => s + b.copies, 0);
  const availableBooks = books.reduce((s, b) => s + b.available, 0);
  const issuedBooks = totalBooks - availableBooks;
  const overdueCount = transactions.filter(t => t.status === 'overdue').length;
  const totalFines = transactions.reduce((s, t) => s + (t.fine || 0), 0);
  const paidFines = transactions.filter(t => t.status === 'returned').reduce((s, t) => s + (t.fine || 0), 0);
  const pendingFines = totalFines - paidFines;

  // Monthly stats (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i);
    const monthStr = d.toISOString().slice(0, 7);
    const issued = transactions.filter(t => t.issueDate.startsWith(monthStr)).length;
    const returned = transactions.filter(t => t.returnDate?.startsWith(monthStr)).length;
    monthlyData.push({ month: d.toLocaleString('en', { month: 'short' }), issued, returned });
  }

  // Genre distribution
  const genreStats = {};
  books.forEach(b => { genreStats[b.genre] = (genreStats[b.genre] || 0) + 1; });

  // Top books by views
  const topBooks = [...books].sort((a, b) => b.views - a.views).slice(0, 5);

  // Active members (with books issued)
  const activeMembers = members.filter(m => m.booksIssued > 0).length;

  // Recent activity
  const recentTransactions = [...transactions].reverse().slice(0, 8);

  // Upcoming dues (next 7 days)
  const today = new Date();
  const upcoming = transactions.filter(t => {
    if (t.status !== 'issued') return false;
    const due = new Date(t.dueDate);
    const diff = (due - today) / 86400000;
    return diff >= 0 && diff <= 7;
  });

  res.json({ stats: { totalBooks, availableBooks, issuedBooks, overdueCount, totalMembers: members.length, activeMembers, totalFines, pendingFines, totalReservations: reservations.length, uniqueTitles: books.length }, monthlyData, genreStats, topBooks, recentTransactions, upcoming, unreadNotifications: notifications.filter(n => !n.read).length });
});

/* ─────────────────────────────────────────────────────────
   BOOKS
───────────────────────────────────────────────────────── */
app.get('/api/books', (req, res) => {
  let result = [...books];
  const { search, genre, sort, available } = req.query;
  if (search) { const q = search.toLowerCase(); result = result.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q) || b.tags?.some(t => t.includes(q))); }
  if (genre && genre !== 'all') result = result.filter(b => b.genre === genre);
  if (available === 'true') result = result.filter(b => b.available > 0);
  if (sort === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'author') result.sort((a, b) => a.author.localeCompare(b.author));
  else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  else if (sort === 'views') result.sort((a, b) => b.views - a.views);
  else if (sort === 'year') result.sort((a, b) => b.year - a.year);
  res.json(result);
});

app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  book.views++;
  const bookTransactions = transactions.filter(t => t.bookId === req.params.id).reverse().slice(0, 10);
  res.json({ ...book, transactions: bookTransactions });
});

app.post('/api/books', (req, res) => {
  const { title, author, genre, isbn, year, copies, description, coverColor, pages, publisher, language, tags, rating } = req.body;
  if (!title || !author || !isbn) return res.status(400).json({ error: 'Title, author and ISBN required' });
  const book = { id: uuidv4(), title, author, genre: genre || 'General', isbn, year: +year || new Date().getFullYear(), copies: +copies || 1, available: +copies || 1, description: description || '', coverColor: coverColor || '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0'), pages: +pages || 0, publisher: publisher || '', language: language || 'English', tags: tags || [], rating: +rating || 0, views: 0 };
  books.push(book);
  res.status(201).json(book);
});

app.put('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });
  books[idx] = { ...books[idx], ...req.body, id: req.params.id };
  res.json(books[idx]);
});

app.delete('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });
  const active = transactions.find(t => t.bookId === req.params.id && t.status !== 'returned');
  if (active) return res.status(400).json({ error: 'Cannot delete — book has active transactions' });
  books.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

/* ─────────────────────────────────────────────────────────
   MEMBERS
───────────────────────────────────────────────────────── */
app.get('/api/members', (req, res) => {
  let result = [...members];
  const { search, type, status } = req.query;
  if (search) { const q = search.toLowerCase(); result = result.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q)); }
  if (type && type !== 'all') result = result.filter(m => m.membershipType === type);
  if (status && status !== 'all') result = result.filter(m => m.status === status);
  res.json(result);
});

app.get('/api/members/:id', (req, res) => {
  const member = members.find(m => m.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  const memberTransactions = transactions.filter(t => t.memberId === req.params.id).reverse();
  const memberReservations = reservations.filter(r => r.memberId === req.params.id);
  res.json({ ...member, transactions: memberTransactions, reservations: memberReservations });
});

app.post('/api/members', (req, res) => {
  const { name, email, phone, address, membershipType, notes } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  if (members.find(m => m.email === email)) return res.status(400).json({ error: 'Email already registered' });
  const expiry = new Date(); expiry.setFullYear(expiry.getFullYear() + 1);
  const member = { id: uuidv4(), name, email, phone: phone || '', address: address || '', membershipType: membershipType || 'Standard', membershipExpiry: expiry.toISOString().split('T')[0], joinDate: new Date().toISOString().split('T')[0], booksIssued: 0, totalBooksRead: 0, status: 'active', finesDue: 0, notes: notes || '' };
  members.push(member);
  notifications.push({ id: uuidv4(), type: 'new_member', message: `${name} joined as a new member`, date: new Date().toISOString().split('T')[0], read: false });
  res.status(201).json(member);
});

app.put('/api/members/:id', (req, res) => {
  const idx = members.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Member not found' });
  members[idx] = { ...members[idx], ...req.body, id: req.params.id };
  res.json(members[idx]);
});

app.delete('/api/members/:id', (req, res) => {
  const idx = members.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Member not found' });
  const active = transactions.find(t => t.memberId === req.params.id && t.status !== 'returned');
  if (active) return res.status(400).json({ error: 'Cannot delete — member has active transactions' });
  members.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

/* ─────────────────────────────────────────────────────────
   TRANSACTIONS
───────────────────────────────────────────────────────── */
app.get('/api/transactions', (req, res) => {
  let result = [...transactions];
  const { status, memberId, bookId } = req.query;
  if (status && status !== 'all') result = result.filter(t => t.status === status);
  if (memberId) result = result.filter(t => t.memberId === memberId);
  if (bookId) result = result.filter(t => t.bookId === bookId);

  // Auto-mark overdue
  const today = new Date().toISOString().split('T')[0];
  result.forEach(t => { if (t.status === 'issued' && t.dueDate < today) { t.status = 'overdue'; t.fine = Math.floor((new Date(today) - new Date(t.dueDate)) / 86400000) * 5; } });

  res.json(result.reverse());
});

app.post('/api/transactions/issue', (req, res) => {
  const { bookId, memberId, daysAllowed } = req.body;
  const book = books.find(b => b.id === bookId);
  const member = members.find(m => m.id === memberId);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  if (!member) return res.status(404).json({ error: 'Member not found' });
  if (book.available <= 0) return res.status(400).json({ error: 'No copies available' });
  if (member.status !== 'active') return res.status(400).json({ error: 'Membership is not active' });
  const maxBooks = member.membershipType === 'Premium' ? 5 : member.membershipType === 'Student' ? 3 : 2;
  if (member.booksIssued >= maxBooks) return res.status(400).json({ error: `Member can borrow max ${maxBooks} books` });

  const days = +daysAllowed || 14;
  const issueDate = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
  const txn = { id: uuidv4(), bookId, memberId, bookTitle: book.title, memberName: member.name, issueDate, dueDate, returnDate: null, status: 'issued', fine: 0, renewals: 0, maxRenewals: 2 };
  transactions.push(txn);
  book.available--; member.booksIssued++;

  // Remove reservation if exists
  const resIdx = reservations.findIndex(r => r.bookId === bookId && r.memberId === memberId);
  if (resIdx !== -1) reservations.splice(resIdx, 1);

  notifications.push({ id: uuidv4(), type: 'issue', message: `"${book.title}" issued to ${member.name}`, date: issueDate, read: false });
  res.status(201).json(txn);
});

app.post('/api/transactions/return/:id', (req, res) => {
  const txn = transactions.find(t => t.id === req.params.id);
  if (!txn) return res.status(404).json({ error: 'Transaction not found' });
  if (txn.status === 'returned') return res.status(400).json({ error: 'Already returned' });
  const returnDate = new Date().toISOString().split('T')[0];
  const overdueDays = Math.max(0, Math.floor((new Date(returnDate) - new Date(txn.dueDate)) / 86400000));
  const fine = overdueDays * 5;
  txn.returnDate = returnDate; txn.status = 'returned'; txn.fine = fine;
  const book = books.find(b => b.id === txn.bookId);
  const member = members.find(m => m.id === txn.memberId);
  if (book) book.available++;
  if (member) { member.booksIssued = Math.max(0, member.booksIssued - 1); member.totalBooksRead++; if (fine > 0) member.finesDue += fine; }
  notifications.push({ id: uuidv4(), type: 'return', message: `"${txn.bookTitle}" returned by ${txn.memberName}${fine ? ` — Fine: ₹${fine}` : ''}`, date: returnDate, read: false });
  res.json(txn);
});

app.post('/api/transactions/renew/:id', (req, res) => {
  const txn = transactions.find(t => t.id === req.params.id);
  if (!txn) return res.status(404).json({ error: 'Transaction not found' });
  if (txn.status !== 'issued') return res.status(400).json({ error: 'Can only renew active transactions' });
  if (txn.renewals >= txn.maxRenewals) return res.status(400).json({ error: 'Maximum renewals reached' });
  const newDue = new Date(txn.dueDate);
  newDue.setDate(newDue.getDate() + 14);
  txn.dueDate = newDue.toISOString().split('T')[0];
  txn.renewals++;
  txn.status = 'issued';
  txn.fine = 0;
  res.json(txn);
});

/* ─────────────────────────────────────────────────────────
   RESERVATIONS
───────────────────────────────────────────────────────── */
app.get('/api/reservations', (req, res) => res.json([...reservations].reverse()));

app.post('/api/reservations', (req, res) => {
  const { bookId, memberId } = req.body;
  const book = books.find(b => b.id === bookId);
  const member = members.find(m => m.id === memberId);
  if (!book || !member) return res.status(404).json({ error: 'Book or member not found' });
  const exists = reservations.find(r => r.bookId === bookId && r.memberId === memberId && r.status === 'pending');
  if (exists) return res.status(400).json({ error: 'Already reserved by this member' });
  const expiry = new Date(); expiry.setDate(expiry.getDate() + 7);
  const reservation = { id: uuidv4(), bookId, memberId, bookTitle: book.title, memberName: member.name, reservedDate: new Date().toISOString().split('T')[0], expiryDate: expiry.toISOString().split('T')[0], status: 'pending', notified: book.available > 0 };
  reservations.push(reservation);
  res.status(201).json(reservation);
});

app.delete('/api/reservations/:id', (req, res) => {
  const idx = reservations.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  reservations.splice(idx, 1);
  res.json({ message: 'Cancelled' });
});

/* ─────────────────────────────────────────────────────────
   FINES
───────────────────────────────────────────────────────── */
app.get('/api/fines', (req, res) => {
  const fineTransactions = transactions.filter(t => t.fine > 0).map(t => ({ ...t, paid: t.status === 'returned' }));
  const totalCollected = fineTransactions.filter(t => t.paid).reduce((s, t) => s + t.fine, 0);
  const totalPending = fineTransactions.filter(t => !t.paid).reduce((s, t) => s + t.fine, 0);
  res.json({ transactions: fineTransactions.reverse(), totalCollected, totalPending });
});

app.post('/api/fines/pay/:transactionId', (req, res) => {
  const txn = transactions.find(t => t.id === req.params.transactionId);
  if (!txn) return res.status(404).json({ error: 'Not found' });
  const member = members.find(m => m.id === txn.memberId);
  if (member) member.finesDue = Math.max(0, member.finesDue - txn.fine);
  txn.finePaid = true;
  res.json({ message: `Fine of ₹${txn.fine} marked as paid` });
});

/* ─────────────────────────────────────────────────────────
   NOTIFICATIONS
───────────────────────────────────────────────────────── */
app.get('/api/notifications', (req, res) => res.json([...notifications].reverse()));

app.put('/api/notifications/read-all', (req, res) => {
  notifications.forEach(n => n.read = true);
  res.json({ message: 'All read' });
});

/* ─────────────────────────────────────────────────────────
   ANALYTICS
───────────────────────────────────────────────────────── */
app.get('/api/analytics', (req, res) => {
  const membershipDist = {};
  members.forEach(m => { membershipDist[m.membershipType] = (membershipDist[m.membershipType] || 0) + 1; });

  const genrePopularity = {};
  books.forEach(b => {
    const issued = transactions.filter(t => t.bookId === b.id).length;
    genrePopularity[b.genre] = (genrePopularity[b.genre] || 0) + issued;
  });

  const avgRating = (books.reduce((s, b) => s + (b.rating || 0), 0) / books.length).toFixed(1);
  const mostActiveMembers = [...members].sort((a, b) => b.totalBooksRead - a.totalBooksRead).slice(0, 5);
  const overdueRate = transactions.length ? Math.round((transactions.filter(t => t.status === 'overdue').length / transactions.length) * 100) : 0;

  res.json({ membershipDist, genrePopularity, avgRating, mostActiveMembers, overdueRate, totalTransactions: transactions.length });
});

/* ─────────────────────────────────────────────────────────
   MISC
───────────────────────────────────────────────────────── */
app.get('/api/genres', (req, res) => res.json([...new Set(books.map(b => b.genre))]));
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q) return res.json({ books: [], members: [] });
  res.json({ books: books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)).slice(0, 5), members: members.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)).slice(0, 5) });
});

app.listen(PORT, () => console.log(`\n📚 Grantha API v2 → http://localhost:${PORT}\n`));
