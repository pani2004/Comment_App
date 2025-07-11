import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar'; 
import CommentList from './components/comments/CommentList';

function ProtectedLayout() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Requires token in localStorage) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={
            <CommentList />
          } />
        </Route>
      </Routes>
    </Router>
  );
}
