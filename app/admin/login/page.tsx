'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError('Invalid email or password.');
      return;
    }
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-sm border border-border bg-surface p-8">
        <div className="mb-6 font-serif text-lg font-semibold text-canopy">
          Cliffside Motari <span className="text-mist">ADMIN</span>
        </div>

        <label className="mb-1.5 block text-sm font-semibold text-mist">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
        />

        <label className="mb-1.5 block text-sm font-semibold text-mist">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
        />

        {error && <p className="mb-4 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-canopy px-6 py-3 font-semibold text-white hover:bg-canopy-dark disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
