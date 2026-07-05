import { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function SetupGuide() {
  const [showGuide, setShowGuide] = useState(!isSupabaseConfigured());

  if (!showGuide || isSupabaseConfigured()) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">🚀 Setup Cloud Sync (Supabase)</h2>
          <button 
            onClick={() => setShowGuide(false)} 
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>📍 Current Mode:</strong> Local Storage Only<br/>
            Data is saved only on this device/browser. To sync across all devices, set up Supabase.
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Step 1: Create Supabase Account</h3>
            <p className="text-gray-600">
              Go to <a href="https://supabase.com" target="_blank" rel="noopener" className="text-blue-600 underline">supabase.com</a> and create a free account.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Step 2: Create a New Project</h3>
            <p className="text-gray-600">Click "New Project" and wait for it to be ready.</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Step 3: Run SQL to Create Tables</h3>
            <p className="text-gray-600 mb-2">Go to SQL Editor and run this:</p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto max-h-40">
{`-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  subject TEXT,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Default users
INSERT INTO users (name, role, password, subject) VALUES 
  ('Admin', 'admin', 'admin123', NULL),
  ('Mr. Mensah', 'teacher', 'teacher123', 'Mathematics'),
  ('Mrs. Addo', 'teacher', 'teacher123', 'English Language')
ON CONFLICT (name) DO NOTHING;

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_data JSONB NOT NULL,
  marking_scheme JSONB NOT NULL,
  class_level TEXT NOT NULL,
  subject TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_data JSONB NOT NULL,
  class_level TEXT NOT NULL,
  child_name TEXT NOT NULL,
  assessed_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable public access (for demo)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access" ON users FOR ALL USING (true);
CREATE POLICY "Public access" ON exams FOR ALL USING (true);
CREATE POLICY "Public access" ON assessments FOR ALL USING (true);`}
            </pre>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Step 4: Get API Keys</h3>
            <p className="text-gray-600">
              Go to Settings → API and copy:<br/>
              • <strong>Project URL</strong><br/>
              • <strong>anon public</strong> key
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Step 5: Create .env File</h3>
            <p className="text-gray-600 mb-2">Create a file named <code className="bg-gray-200 px-1 rounded">.env</code> with:</p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
            </pre>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Step 6: Rebuild & Deploy</h3>
            <p className="text-gray-600">
              Run <code className="bg-gray-200 px-1 rounded">npm run build</code> and redeploy.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowGuide(false)}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
          >
            Continue with Local Storage
          </button>
        </div>
      </div>
    </div>
  );
}
