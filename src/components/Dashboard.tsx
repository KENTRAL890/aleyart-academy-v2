import { useState } from 'react';
import type { User } from '../types';
import { logout, getConnectionStatus } from '../store';
import ExamGenerator from './ExamGenerator';
import SavedExams from './SavedExams';
import EarlyChildhood from './EarlyChildhood';
import OMRGenerator from './OMRGenerator';
import AnswerBooklet from './AnswerBookletGen';
import GraphPaper from './GraphPaper';

type Page = 'home' | 'generate' | 'saved' | 'early' | 'omr' | 'booklet' | 'special' | 'graphpaper';

interface Props {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: Props) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const menuGroups = [
    {
      category: 'Main Overview',
      items: [
        { id: 'home' as Page, label: 'Dashboard Overview', icon: '🏠', desc: 'System statistics & quick links' },
      ],
    },
    {
      category: 'Exam Generation (SBC & CCP)',
      items: [
        { id: 'generate' as Page, label: 'Generate Standard Exam', icon: '📝', desc: 'Basic 1–9 custom test builder' },
        { id: 'special' as Page, label: 'Special Exams Studio', icon: '🏆', desc: 'BECE / Entrance / Transitional' },
      ],
    },
    {
      category: 'Exam Repository & Marking',
      items: [
        { id: 'saved' as Page, label: 'Saved Exams & Schemes', icon: '💾', desc: 'Access stored exams & marking schemes' },
      ],
    },
    {
      category: 'Assessment & Print Supplies',
      items: [
        { id: 'early' as Page, label: 'Early Childhood Tracking', icon: '🧒', desc: 'Crèche – KG2 NaCCA SBA' },
        { id: 'omr' as Page, label: 'BECE Box OMR Sheets', icon: '📋', desc: 'Standard A4 horizontal shading' },
        { id: 'booklet' as Page, label: 'Exam Answer Booklets', icon: '📖', desc: 'Ruled booklets with margin lines' },
        { id: 'graphpaper' as Page, label: 'Graph Paper Sheets', icon: '📊', desc: 'A4 graph paper for maths exams' },
      ],
    },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'generate':
        return <ExamGenerator user={user} />;
      case 'saved':
        return <SavedExams user={user} />;
      case 'early':
        return <EarlyChildhood user={user} />;
      case 'omr':
        return <OMRGenerator />;
      case 'booklet':
        return <AnswerBooklet />;
      case 'special':
        return <ExamGenerator user={user} specialMode={true} />;
      case 'graphpaper':
        return <GraphPaper />;
      case 'home':
      default:
        return <HomePage user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{
        background: 'linear-gradient(180deg, #1a237e 0%, #0d1642 100%)',
      }}>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #ff6f00, #ffa040)'
            }}>
              <span className="text-lg">🎓</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">ALEYART ACADEMY</h2>
              <p className="text-blue-300 text-[9px] italic">Seeking Wisdom</p>
            </div>
            <button className="lg:hidden ml-auto text-white text-xl" onClick={() => setSidebarOpen(false)}>✕</button>
          </div>

          <nav className="space-y-4 pb-24 overflow-y-auto max-h-[calc(100vh-210px)]">
            {menuGroups.map(group => (
              <div key={group.category} className="space-y-1">
                <p className="px-3 text-[10px] font-bold text-blue-300 uppercase tracking-wider opacity-80 mb-1">{group.category}</p>
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-white/20 text-white font-semibold shadow-md border-l-4 border-orange-400'
                        : 'text-blue-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <div>
                      <p className="text-xs font-semibold leading-tight">{item.label}</p>
                      <p className="text-[9px] opacity-75 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="bg-white/10 rounded-xl p-3 mb-3">
            <p className="text-white text-xs font-medium">{user.name}</p>
            <p className="text-blue-300 text-[10px] capitalize">{user.role}{user.subject ? ` • ${user.subject}` : ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-300 hover:bg-red-500/20 rounded-lg transition text-sm"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setSidebarOpen(true)}>
              <span className="text-xl">☰</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              {menuGroups.flatMap(g => g.items).find(m => m.id === currentPage)?.label || 'Dashboard Overview'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[10px] ${
              getConnectionStatus() === 'supabase' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              <span>{getConnectionStatus() === 'supabase' ? '🌐' : '💾'}</span>
              <span>{getConnectionStatus() === 'supabase' ? 'Cloud Sync' : 'Local'}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
              <span className="text-xs">👤</span>
              <span className="text-xs font-medium text-blue-700">{user.name}</span>
              <span className="text-[10px] bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full capitalize">{user.role}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function HomePage({ user, onNavigate }: { user: User; onNavigate: (page: Page) => void }) {
  const quickActions = [
    { icon: '📝', title: 'Generate Exam', desc: 'Create new exam papers for any class', color: '#1a237e', page: 'generate' as Page },
    { icon: '💾', title: 'Saved Exams', desc: 'View and print stored exams', color: '#2e7d32', page: 'saved' as Page },
    { icon: '🧒', title: 'Early Childhood', desc: 'Assessment for Crèche to KG2', color: '#e65100', page: 'early' as Page },
    { icon: '🏆', title: 'Special Exams', desc: 'BECE, Entrance, Transitional', color: '#6a1b9a', page: 'special' as Page },
    { icon: '📋', title: 'OMR Sheets', desc: 'Generate answer shading papers', color: '#00695c', page: 'omr' as Page },
    { icon: '📖', title: 'Answer Booklets', desc: 'Create answer booklets', color: '#bf360c', page: 'booklet' as Page },
  ];

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 lg:p-8 mb-6 text-white" style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
      }}>
        <h2 className="text-2xl lg:text-3xl font-bold mb-2">Welcome, {user.name}! 👋</h2>
        <p className="text-blue-200 text-sm lg:text-base">
          Generate exam papers aligned with Ghana's NaCCA Standards-Based Curriculum (SBC) and Common Core Programme (CCP).
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="text-[11px] bg-white/20 px-3 py-1 rounded-full">📚 Crèche to Basic 9</span>
          <span className="text-[11px] bg-white/20 px-3 py-1 rounded-full">📋 NaCCA Aligned</span>
          <span className="text-[11px] bg-white/20 px-3 py-1 rounded-full">🖨️ A4 Print Ready</span>
          <span className="text-[11px] bg-white/20 px-3 py-1 rounded-full">✏️ Editable Questions</span>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => onNavigate(action.page)}
            className="bg-white rounded-xl p-5 text-left hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-transparent group"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{
              background: `${action.color}15`,
            }}>
              <span className="text-2xl">{action.icon}</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">{action.title}</h4>
            <p className="text-xs text-gray-500">{action.desc}</p>
          </button>
        ))}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📊</span> Supported Levels
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              Early Childhood: Crèche, N1, N2, KG1, KG2
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Primary: Basic 1 – Basic 6 (SBC)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              JHS: Basic 7 – Basic 9 (CCP)
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📝</span> Question Types
          </h4>
          <div className="flex flex-wrap gap-2">
            {['Multiple Choice (A-D)', 'Short Answer', 'Essay/Theory', 'Fill in the Blank', 'True or False', 'Subjective'].map(t => (
              <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
