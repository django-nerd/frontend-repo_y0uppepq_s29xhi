import React, { useState } from 'react';
import { Book, BarChart2, Settings, PenTool } from 'lucide-react';
import Trainer from './components/Trainer';
import Quiz from './components/Quiz';
import Progress from './components/Progress';
import DataManager from './components/DataManager';

export default function App() {
  const [tab, setTab] = useState('latihan');

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white text-gray-900">
      <header className="sticky top-0 backdrop-blur bg-white/70 border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-semibold text-lg">Kana Tracer + Audio</div>
          <nav className="flex gap-2">
            <Tab label="Latihan" icon={<PenTool size={16} />} active={tab==='latihan'} onClick={()=>setTab('latihan')} />
            <Tab label="Kuis" icon={<Book size={16} />} active={tab==='kuis'} onClick={()=>setTab('kuis')} />
            <Tab label="Progres" icon={<BarChart2 size={16} />} active={tab==='progres'} onClick={()=>setTab('progres')} />
            <Tab label="Data" icon={<Settings size={16} />} active={tab==='data'} onClick={()=>setTab('data')} />
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'latihan' && <Trainer />}
        {tab === 'kuis' && <Quiz />}
        {tab === 'progres' && <Progress />}
        {tab === 'data' && <DataManager />}

        <div className="mt-8 text-sm text-gray-500">Durasi belajar harian disarankan: sekitar 5 menit. Antarmuka dalam Bahasa Indonesia.</div>
      </main>
    </div>
  );
}

function Tab({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${active? 'bg-indigo-600 text-white':'bg-gray-100 hover:bg-gray-200'}`}>
      {icon}{label}
    </button>
  );
}
