import { useState, useEffect } from 'react';
import type { User } from '../types';
import { getUsers } from '../store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Props {
  user: User;
}

export default function TeacherAdmin({ user }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher'>('teacher');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const u = await getUsers();
    setUsers(u);
  };

  const handleCreate = async () => {
    if (!name || !password) { setMsg('⚠️ Name and password required.'); return; }
    setLoading(true); setMsg('');
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('users').insert({
          name, password, role, subject: subject || null,
        });
        if (error) throw error;
      }
      // Also save locally
      const local = JSON.parse(localStorage.getItem('aleyart_users') || '[]');
      local.push({ id: `user_${Date.now()}`, name, password, role, subject: subject || undefined });
      localStorage.setItem('aleyart_users', JSON.stringify(local));

      setMsg(`✅ ${role === 'admin' ? 'Admin' : 'Teacher'} "${name}" created successfully!`);
      setName(''); setPassword(''); setSubject('');
      await loadUsers();
    } catch (e: any) {
      setMsg(`❌ Error: ${e?.message || 'Failed to create user.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (user.role !== 'admin') {
    return <div className="bg-red-50 p-6 rounded-xl text-red-700 text-center">⚠️ Only admins can manage teacher accounts.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Create New Teacher / Admin Account</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mrs. Osei" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Create password" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
            <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Subject (optional)</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Science" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        {msg && <p className={`text-sm mb-3 ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
        <button onClick={handleCreate} disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium transition">
          {loading ? '⏳ Creating...' : '➕ Create Account'}
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Existing Users ({users.length})</h3>
        <div className="space-y-2">
          {users.map((u, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
              <div>
                <p className="font-medium text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-500 capitalize">{u.role}{u.subject ? ` • ${u.subject}` : ''}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
