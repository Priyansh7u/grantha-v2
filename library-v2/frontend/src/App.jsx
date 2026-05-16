import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard    from './pages/Dashboard';
import Books        from './pages/Books';
import Members      from './pages/Members';
import Transactions from './pages/Transactions';
import Reservations from './pages/Reservations';
import Fines        from './pages/Fines';
import Analytics    from './pages/Analytics';

export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/books"        element={<Books />} />
          <Route path="/members"      element={<Members />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/fines"        element={<Fines />} />
          <Route path="/analytics"    element={<Analytics />} />
        </Routes>
      </main>
    </div>
  );
}
