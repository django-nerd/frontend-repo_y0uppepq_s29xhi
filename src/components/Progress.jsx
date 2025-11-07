import React, { useEffect, useMemo, useState } from 'react';

const getData = () => {
  const raw = localStorage.getItem('kanaTracerData');
  if (!raw) return null;
  return JSON.parse(raw);
};

const dateRange = (days) => {
  const arr = [];
  const d = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const t = new Date(d);
    t.setDate(t.getDate() - i);
    arr.push(t.toISOString().slice(0,10));
  }
  return arr;
};

export default function Progress() {
  const [snapshot, setSnapshot] = useState(getData());
  useEffect(() => {
    const onStorage = () => setSnapshot(getData());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!snapshot) return <div className="text-gray-600">Belum ada data. Mulai latihan untuk melihat progres.</div>;

  const days = dateRange(7);
  const daily = days.map((day) => {
    let correct = 0; let total = 0;
    Object.values(snapshot.items).forEach((it) => {
      (it.history||[]).forEach((h) => { if (h.date === day) { total++; if (h.result === 'ingat') correct++; } });
    });
    return { day, correct, total };
  });

  const totalLearned = Object.values(snapshot.items).filter(it => it.stage>0).length;

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-indigo-50 text-indigo-800">
        Total huruf pernah diingat: {totalLearned}
      </div>

      <div>
        <div className="mb-2 text-sm text-gray-600">Progres 7 hari terakhir</div>
        <div className="grid grid-cols-7 gap-2">
          {daily.map(({ day, correct, total }) => {
            const pct = total ? Math.round((correct/total)*100) : 0;
            return (
              <div key={day} className="flex flex-col items-center">
                <div className="w-full h-24 bg-gray-100 rounded-md overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ height: '100%', width: pct + '%' }} />
                </div>
                <div className="text-[10px] text-gray-500 mt-1">{day.slice(5)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Reflection />
    </div>
  );
}

function Reflection() {
  const [text, setText] = useState('');
  const [savedToday, setSavedToday] = useState(() => {
    const d = localStorage.getItem('kanaTracerReflections');
    const s = d ? JSON.parse(d) : {};
    const key = new Date().toISOString().slice(0,10);
    return s[key] || '';
  });

  useEffect(() => {
    setText(savedToday);
  }, [savedToday]);

  const save = () => {
    const key = new Date().toISOString().slice(0,10);
    const d = localStorage.getItem('kanaTracerReflections');
    const s = d ? JSON.parse(d) : {};
    s[key] = text;
    localStorage.setItem('kanaTracerReflections', JSON.stringify(s));
    setSavedToday(text);
  };

  return (
    <div className="p-4 rounded-xl bg-white shadow space-y-3">
      <div className="text-sm font-medium">Refleksi singkat: Huruf apa yang paling sulit hari ini?</div>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full p-3 border rounded-md" rows={3} placeholder="Tulis singkat..." />
      <div className="flex gap-2">
        <button onClick={save} className="px-3 py-1.5 rounded-md bg-indigo-600 text-white">Simpan</button>
        {savedToday && <span className="text-sm text-gray-500 self-center">Tersimpan untuk hari ini.</span>}
      </div>
    </div>
  );
}
