# Aleyart Academy Exam Generator - Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click Deploy!

### Option 2: Deploy to Netlify
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Site Settings
6. Deploy!

### Option 3: Static Hosting
The built `dist/index.html` is a single file that can be hosted anywhere:
- GitHub Pages
- AWS S3
- Any static file server

---

## 🗄️ Setting Up Supabase (Cloud Database)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Wait for project to initialize

### Step 2: Create Database Tables
Go to SQL Editor and run:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher')),
  subject TEXT,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default users
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_data JSONB NOT NULL,
  class_level TEXT NOT NULL,
  child_name TEXT NOT NULL,
  assessed_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Allow public access (for demo - in production use proper auth)
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for exams" ON exams FOR ALL USING (true);
CREATE POLICY "Allow all for assessments" ON assessments FOR ALL USING (true);
```

### Step 3: Get API Keys
1. Go to Settings → API
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

### Step 4: Configure Environment
Create `.env` file:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Build and Deploy
```bash
npm run build
```

---

## 📱 Features

### Data Sync
- ✅ All exams sync across all devices
- ✅ Teachers and admins see the same data
- ✅ Works on phones, tablets, laptops, desktops
- ✅ Works on any modern web browser

### Question Configuration
- ✅ Set number of objective questions
- ✅ Set marks per objective question
- ✅ Add multiple subjective sections (B, C, D)
- ✅ Set questions per section
- ✅ Set marks per subjective question
- ✅ Custom section titles
- ✅ Custom section instructions

### Marking Scheme
- ✅ Exact correct answers (not model answers)
- ✅ Full working/solutions
- ✅ Step-by-step calculations
- ✅ Auto-syncs when questions are edited

### Practical Questions (B7-B9)
- ✅ Science: Lab experiment diagrams
- ✅ Computing: Flowchart diagrams
- ✅ Creative Arts: Adinkra symbol images
- ✅ Career Tech: Technical drawings
- ✅ Images are editable

---

## 🔒 Security Notes

For production use:
1. Use Supabase Auth instead of plain passwords
2. Implement proper Row Level Security policies
3. Use HTTPS
4. Consider rate limiting

---

## 📞 Support

For issues or questions, contact Aleyart Academy IT Support.
