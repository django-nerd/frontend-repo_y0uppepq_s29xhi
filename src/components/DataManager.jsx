import React, { useRef, useState } from 'react';

export default function DataManager() {
  const fileRef = useRef(null);
  const [status, setStatus] = useState('');

  const doExport = () => {
    const data = {
      tracer: JSON.parse(localStorage.getItem('kanaTracerData') || '{}'),
      reflections: JSON.parse(localStorage.getItem('kanaTracerReflections') || '{}'),
      quiz: JSON.parse(localStorage.getItem('quiz-last') || 'null'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'kana-tracer-backup.json'; a.click();
    URL.revokeObjectURL(url);
    setStatus('Data diekspor. Simpan file ini untuk cadangan.');
  };

  const doImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const obj = JSON.parse(ev.target.result);
        if (obj.tracer) localStorage.setItem('kanaTracerData', JSON.stringify(obj.tracer));
        if (obj.reflections) localStorage.setItem('kanaTracerReflections', JSON.stringify(obj.reflections));
        if (obj.quiz) localStorage.setItem('quiz-last', JSON.stringify(obj.quiz));
        setStatus('Impor berhasil. Segarkan halaman jika perlu.');
      } catch (err) {
        setStatus('Gagal mengimpor: format tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">Semua data disimpan lokal (offline). Anda dapat mengekspor atau mengimpor cadangan di sini.</div>
      <div className="flex gap-2">
        <button onClick={doExport} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white">Ekspor Data</button>
        <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 rounded-md bg-indigo-600 text-white">Impor Data</button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={doImport} />
      </div>
      {status && <div className="text-sm text-gray-700">{status}</div>}
    </div>
  );
}
