import React, { useEffect, useMemo, useRef, useState } from 'react';

const kanaList = [
  // Hiragana
  { type: 'hiragana', kana: 'あ', romaji: 'a' }, { type: 'hiragana', kana: 'い', romaji: 'i' }, { type: 'hiragana', kana: 'う', romaji: 'u' }, { type: 'hiragana', kana: 'え', romaji: 'e' }, { type: 'hiragana', kana: 'お', romaji: 'o' },
  { type: 'hiragana', kana: 'か', romaji: 'ka' }, { type: 'hiragana', kana: 'き', romaji: 'ki' }, { type: 'hiragana', kana: 'く', romaji: 'ku' }, { type: 'hiragana', kana: 'け', romaji: 'ke' }, { type: 'hiragana', kana: 'こ', romaji: 'ko' },
  { type: 'hiragana', kana: 'さ', romaji: 'sa' }, { type: 'hiragana', kana: 'し', romaji: 'shi' }, { type: 'hiragana', kana: 'す', romaji: 'su' }, { type: 'hiragana', kana: 'せ', romaji: 'se' }, { type: 'hiragana', kana: 'そ', romaji: 'so' },
  { type: 'hiragana', kana: 'た', romaji: 'ta' }, { type: 'hiragana', kana: 'ち', romaji: 'chi' }, { type: 'hiragana', kana: 'つ', romaji: 'tsu' }, { type: 'hiragana', kana: 'て', romaji: 'te' }, { type: 'hiragana', kana: 'と', romaji: 'to' },
  { type: 'hiragana', kana: 'な', romaji: 'na' }, { type: 'hiragana', kana: 'に', romaji: 'ni' }, { type: 'hiragana', kana: 'ぬ', romaji: 'nu' }, { type: 'hiragana', kana: 'ね', romaji: 'ne' }, { type: 'hiragana', kana: 'の', romaji: 'no' },
  { type: 'hiragana', kana: 'は', romaji: 'ha' }, { type: 'hiragana', kana: 'ひ', romaji: 'hi' }, { type: 'hiragana', kana: 'ふ', romaji: 'fu' }, { type: 'hiragana', kana: 'へ', romaji: 'he' }, { type: 'hiragana', kana: 'ほ', romaji: 'ho' },
  { type: 'hiragana', kana: 'ま', romaji: 'ma' }, { type: 'hiragana', kana: 'み', romaji: 'mi' }, { type: 'hiragana', kana: 'む', romaji: 'mu' }, { type: 'hiragana', kana: 'め', romaji: 'me' }, { type: 'hiragana', kana: 'も', romaji: 'mo' },
  { type: 'hiragana', kana: 'や', romaji: 'ya' }, { type: 'hiragana', kana: 'ゆ', romaji: 'yu' }, { type: 'hiragana', kana: 'よ', romaji: 'yo' },
  { type: 'hiragana', kana: 'ら', romaji: 'ra' }, { type: 'hiragana', kana: 'り', romaji: 'ri' }, { type: 'hiragana', kana: 'る', romaji: 'ru' }, { type: 'hiragana', kana: 'れ', romaji: 're' }, { type: 'hiragana', kana: 'ろ', romaji: 'ro' },
  { type: 'hiragana', kana: 'わ', romaji: 'wa' }, { type: 'hiragana', kana: 'を', romaji: 'wo' }, { type: 'hiragana', kana: 'ん', romaji: 'n' },
  // Katakana
  { type: 'katakana', kana: 'ア', romaji: 'a' }, { type: 'katakana', kana: 'イ', romaji: 'i' }, { type: 'katakana', kana: 'ウ', romaji: 'u' }, { type: 'katakana', kana: 'エ', romaji: 'e' }, { type: 'katakana', kana: 'オ', romaji: 'o' },
  { type: 'katakana', kana: 'カ', romaji: 'ka' }, { type: 'katakana', kana: 'キ', romaji: 'ki' }, { type: 'katakana', kana: 'ク', romaji: 'ku' }, { type: 'katakana', kana: 'ケ', romaji: 'ke' }, { type: 'katakana', kana: 'コ', romaji: 'ko' },
  { type: 'katakana', kana: 'サ', romaji: 'sa' }, { type: 'katakana', kana: 'シ', romaji: 'shi' }, { type: 'katakana', kana: 'ス', romaji: 'su' }, { type: 'katakana', kana: 'セ', romaji: 'se' }, { type: 'katakana', kana: 'ソ', romaji: 'so' },
  { type: 'katakana', kana: 'タ', romaji: 'ta' }, { type: 'katakana', kana: 'チ', romaji: 'chi' }, { type: 'katakana', kana: 'ツ', romaji: 'tsu' }, { type: 'katakana', kana: 'テ', romaji: 'te' }, { type: 'katakana', kana: 'ト', romaji: 'to' },
  { type: 'katakana', kana: 'ナ', romaji: 'na' }, { type: 'katakana', kana: 'ニ', romaji: 'ni' }, { type: 'katakana', kana: 'ヌ', romaji: 'nu' }, { type: 'katakana', kana: 'ネ', romaji: 'ne' }, { type: 'katakana', kana: 'ノ', romaji: 'no' },
  { type: 'katakana', kana: 'ハ', romaji: 'ha' }, { type: 'katakana', kana: 'ヒ', romaji: 'hi' }, { type: 'katakana', kana: 'フ', romaji: 'fu' }, { type: 'katakana', kana: 'ヘ', romaji: 'he' }, { type: 'katakana', kana: 'ホ', romaji: 'ho' },
  { type: 'katakana', kana: 'マ', romaji: 'ma' }, { type: 'katakana', kana: 'ミ', romaji: 'mi' }, { type: 'katakana', kana: 'ム', romaji: 'mu' }, { type: 'katakana', kana: 'メ', romaji: 'me' }, { type: 'katakana', kana: 'モ', romaji: 'mo' },
  { type: 'katakana', kana: 'ヤ', romaji: 'ya' }, { type: 'katakana', kana: 'ユ', romaji: 'yu' }, { type: 'katakana', kana: 'ヨ', romaji: 'yo' },
  { type: 'katakana', kana: 'ラ', romaji: 'ra' }, { type: 'katakana', kana: 'リ', romaji: 'ri' }, { type: 'katakana', kana: 'ル', romaji: 'ru' }, { type: 'katakana', kana: 'レ', romaji: 're' }, { type: 'katakana', kana: 'ロ', romaji: 'ro' },
  { type: 'katakana', kana: 'ワ', romaji: 'wa' }, { type: 'katakana', kana: 'ヲ', romaji: 'wo' }, { type: 'katakana', kana: 'ン', romaji: 'n' },
];

const getTodayKey = () => new Date().toISOString().slice(0, 10);

function useLocalData() {
  const [data, setData] = useState(() => {
    const raw = localStorage.getItem('kanaTracerData');
    if (raw) return JSON.parse(raw);
    const items = {};
    const today = getTodayKey();
    kanaList.forEach((k) => {
      const id = `${k.type}-${k.kana}`;
      items[id] = { id, ...k, stage: 0, lastReview: null, nextDue: today, history: [] };
    });
    return { items, reflections: {}, quizLog: {} };
  });

  useEffect(() => {
    localStorage.setItem('kanaTracerData', JSON.stringify(data));
  }, [data]);

  const updateItem = (id, patch) => {
    setData((d) => ({ ...d, items: { ...d.items, [id]: { ...d.items[id], ...patch } } }));
  };

  return { data, setData, updateItem };
}

function speakKana(kana) {
  try {
    const utter = new SpeechSynthesisUtterance(kana);
    utter.lang = 'ja-JP';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch (e) {
    // ignore if not available
  }
}

function DrawingCanvas({ width = 280, height = 280 }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111827';
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y };
  };

  const start = (e) => {
    drawing.current = true;
    lastPos.current = pos(e);
  };
  const move = (e) => {
    if (!drawing.current) return;
    const p = pos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPos.current = p;
  };
  const end = () => {
    drawing.current = false;
  };
  const clear = () => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, c.width, c.height);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-xl shadow-inner bg-gray-100 touch-none"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <button onClick={clear} className="px-3 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300">Bersihkan</button>
    </div>
  );
}

export default function Trainer() {
  const { data, updateItem } = useLocalData();
  const [script, setScript] = useState('hiragana');

  const dueList = useMemo(() => {
    const today = getTodayKey();
    return Object.values(data.items)
      .filter((i) => i.type === script && (!i.nextDue || i.nextDue <= today))
      .sort((a, b) => (a.stage - b.stage) || a.kana.localeCompare(b.kana));
  }, [data.items, script]);

  const current = dueList[0] || null;

  const onResult = (remembered) => {
    if (!current) return;
    const today = getTodayKey();
    let stage = current.stage;
    if (remembered) {
      stage = Math.min(3, stage + 1);
    } else {
      stage = 0;
    }
    const intervalDays = stage === 0 ? 0 : stage === 1 ? 1 : stage === 2 ? 3 : 7;
    const next = new Date();
    next.setDate(next.getDate() + intervalDays);
    const nextDue = next.toISOString().slice(0, 10);
    updateItem(current.id, {
      stage,
      lastReview: today,
      nextDue,
      history: [...current.history, { date: today, result: remembered ? 'ingat' : 'belum' }],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => setScript('hiragana')} className={`px-3 py-1.5 rounded-md ${script==='hiragana'?'bg-indigo-600 text-white':'bg-gray-200'}`}>Hiragana</button>
          <button onClick={() => setScript('katakana')} className={`px-3 py-1.5 rounded-md ${script==='katakana'?'bg-indigo-600 text-white':'bg-gray-200'}`}>Katakana</button>
        </div>
        <div className="text-sm text-gray-600">Jatuh tempo: {dueList.length} huruf</div>
      </div>

      {current ? (
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="text-8xl md:text-9xl font-semibold leading-none select-none">{current.kana}</div>
            <div className="text-gray-500 text-xl tracking-widest">{current.romaji}</div>
            <div className="flex gap-2">
              <button onClick={() => speakKana(current.kana)} className="px-3 py-1.5 rounded-md bg-indigo-100 text-indigo-700">▶️ Dengarkan</button>
              <span className="text-sm self-center text-gray-500">Level: {current.stage}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <DrawingCanvas />
            <div className="flex gap-3 mt-2">
              <button onClick={() => onResult(false)} className="px-4 py-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200">Belum</button>
              <button onClick={() => onResult(true)} className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Ingat</button>
            </div>
            <p className="text-xs text-gray-500">Jadwal ulang otomatis: 1, 3, 7 hari</p>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-green-50 text-green-800">Semua huruf untuk {script} sudah dipelajari hari ini. Bagus!</div>
      )}
    </div>
  );
}
