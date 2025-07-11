import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
      <div className="w-full max-w-md bg-white shadow-md p-6 rounded">
        <h1 className="text-2xl font-semibold mb-4 text-center">Comment App</h1>
        {children}
      </div>
    </div>
  );
}
