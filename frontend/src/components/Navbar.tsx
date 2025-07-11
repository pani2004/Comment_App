import NotificationPanel from './NotificationPanel';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gray-100 shadow">
      <div className="text-lg font-bold text-gray-800">
        🗨️ Comments App
      </div>

      <div className="flex items-center gap-4">
        <NotificationPanel />
      </div>
    </nav>
  );
}
