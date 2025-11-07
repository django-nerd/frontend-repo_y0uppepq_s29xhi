import React, { useEffect, useMemo, useState } from 'react';

const kanaPool = [
  { type: 'hiragana', kana: 'あ', romaji: 'a' }, { type: 'hiragana', kana: 'い', romaji: 'i' }, { type: 'hiragana', kana: 'う', romaji: 'u' }, { type: 'hiragana', kana: 'え', romaji: 'e' }, { type: 'hiragana', kana: 'お', romaji: 'o' },
  { type: 'hiragana', kana: 'か', romaji: 'ka' }, { type: 'hiragana', kana: 'き', romaji: 'ki' }, { type: 'hiragana', kana: 'く', romaji: 'ku' }, { type: 'hiragana', kana: 'け', romaji: 'ke' }, { type: 'hiragana', kana: 'こ', romaji: 'ko' },
  { type: 'hiragana', kana: 'さ', romaji: 'sa' }, { type: 'hiragana', kana: 'し', romaji: 'shi' }, { type: 'hiragana', kana: 'す', romaji: 'su' }, { type: 'hiragana', kana: 'せ', romaji: 'se' }, { type: 'hiragana', kana: 'そ', romaji: 'so' },
  { type: 'katakana', kana: 'ア', romaji: 'a' }, { type: 'katakana', kana: 'イ', romaji: 'i' }, { type: 'katakana', kana: 'ウ', romaji: 'u' }, { type: 'katakana', kana: 'エ', romaji: 'e' }, { type: 'katakana', kana: 'オ', romaji: 'o' },
  { type: 'katakana', kana: 'カ', romaji: 'ka' }, { type: 'katakana', kana: 'キ', romaji: 'ki' }, { type: 'katakana', kana: 'ク', romaji: 'ku' }, { type: 'katakana', kana: 'ケ', romaji: 'ke' }, { type: 'katakana', kana: 'コ', romaji: 'ko' },
  { type: 'katakana', kana: 'サ', romaji: 'sa' }, { type: 'katakana', kana: 'シ', romaji: 'shi' }, { type: 'katakana', kana: 'ス', romaji: 'su' }, { type: 'katakana', kana: 'セ', romaji: 'se' }, { type: 'katakana', kana: 'ソ', romaji: 'so' },
];

const getDayKey = () => new Date().toISOString().slice(0,10);

function choice(arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i,1)[0]);
  }
  return out;
}

function buildQuestions() {
  const items = choice(kanaPool, 5);
  return items.map((it) => {
    const mode = Math.random() < 0.5 ? 'kanaToRomaji' : 'audioToKana';
    if (mode === 'kanaToRomaji') {
      // 4 options with one correct romaji
      const distract = choice(kanaPool.filter(k=>k.romaji!==it.romaji), 3).map(d=>d.romaji);
      const options = choice([it.romaji, ...distract], 4);
      return { id: `${it.type}-${it.kana}`, mode, prompt: it.kana, answer: it.romaji, options };
    } else {
      const distract = choice(kanaPool.filter(k=>k.kana!==it.kana), 3).map(d=>d.kana);
      const options = choice([it.kana, ...distract], 4);
      return { id: `${it.type}-${it.kana}`, mode, prompt: it.kana, answer: it.kana, options };
    }
  });
}

export default function Quiz() {
  const [seed, setSeed] = useState(getDayKey());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [questions, setQuestions] = useState(() => buildQuestions());

  useEffect(() => {
    // rebuild once per day
    setQuestions(buildQuestions());
    setIndex(0); setScore(0); setDone(false);
  }, [seed]);

  const q = questions[index];

  const speak = () => {
    if (!q) return;
    const utter = new SpeechSynthesisUtterance(q.prompt);
    utter.lang = 'ja-JP';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const pick = (opt) => {
    const correct = q.mode === 'kanaToRomaji' ? opt === q.answer : opt === q.answer;
    if (correct) setScore((s)=>s+1);
    if (index + 1 >= questions.length) {
      setDone(true);
      localStorage.setItem('quiz-last', JSON.stringify({ date: getDayKey(), score: correct ? score+1 : score }));
    } else {
      setIndex((i)=>i+1);
    }
  };

  if (done) {
    return (
      <div className="space-y-3">
        <div className="text-lg">Kuis selesai! Skor: {score}/5</div>
        <button className="px-3 py-1.5 rounded-md bg-indigo-600 text-white" onClick={() => setSeed(Date.now().toString())}>Ulangi Kuis</button>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Soal {index+1} dari {questions.length}</div>
        {q.mode === 'audioToKana' && (
          <button onClick={speak} className="px-3 py-1.5 rounded-md bg-indigo-100 text-indigo-700">▶️ Putar Bunyi</button>
        )}
      </div>

      <div className="p-5 rounded-xl bg-white shadow">
        {q.mode === 'kanaToRomaji' ? (
          <div className="text-8xl text-center font-semibold">{q.prompt}</div>
        ) : (
          <div className="text-center text-gray-600">Dengarkan bunyi, pilih huruf yang benar.</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((o) => (
          <button key={o} onClick={() => pick(o)} className="px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-lg">
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
