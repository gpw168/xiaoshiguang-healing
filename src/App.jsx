import { useState, useEffect, useRef } from "react";

const CHAKRA_DB = {
  root: {
    name: "海底輪", english: "Root", color: "#C8784A",
    actions: [
      { title: "好好吃一頓飯", desc: "選一餐認真吃，放下手機。不需要特別的食物，只需要你全心在這一刻。", prompt: "吃飯時，注意食物的味道、溫度與口感。如果分心了，輕輕把注意力帶回來。", support: "照顧自己，從最基本的事開始。" },
      { title: "整理一個小角落", desc: "選桌面、書架或床頭的一個小角落，花 10 分鐘整理它。", prompt: "環境的秩序，有時能幫助內心找到一點喘息的空間。", support: "你不需要整理整個房間，一個角落就夠了。" },
      { title: "赤腳踩地板一分鐘", desc: "脫下鞋襪，感受腳底踩在地板上的踏實感。站著或坐著都可以。", prompt: "感受地面的溫度與質地。你此刻是被支撐著的。", support: "當一切不確定時，地面永遠在這裡。" },
      { title: "寫下今天完成的三件事", desc: "不論大小，寫下今天你做到的三件事。", prompt: "你比自己以為的更努力。這個練習是提醒你，看見自己。", support: "每一個小小的完成，都是真實的。" },
      { title: "散步 10 分鐘", desc: "不需要目的地，慢慢走，注意腳踩在地上的感覺。", prompt: "你走的每一步，都是真實存在的證明。", support: "有時候，移動身體比思考更能帶來安定。" },
    ],
  },
  sacral: {
    name: "生殖輪", english: "Sacral", color: "#C8904A",
    actions: [
      { title: "聽一首你喜歡的歌", desc: "選一首讓你有感覺的歌，什麼感覺都好——放下手邊的事，只是聽。", prompt: "讓身體隨著音樂微微移動也可以。你的感受不需要理由。", support: "允許自己被音樂觸動，是一種勇氣。" },
      { title: "塗鴉五分鐘", desc: "拿紙筆，不需要畫得好，隨意塗鴉、寫字、或者只是亂畫線條。", prompt: "創作不是為了成品，而是為了讓什麼東西流動起來。", support: "你不需要是藝術家，才能讓自己表達。" },
      { title: "做一件「只是因為想要」的小事", desc: "想吃什麼、想喝什麼、想看什麼——選一件小事，只因為你想要。", prompt: "你的渴望是真實的，它值得被回應。", support: "照顧自己的需求，不需要任何理由。" },
      { title: "拉伸身體三分鐘", desc: "站起來，伸展手臂、轉動頸部、或是彎腰碰碰腳踝。", prompt: "身體是感受的容器。讓它有一點空間流動。", support: "你的身體需要被記得。" },
    ],
  },
  solar: {
    name: "太陽神經叢", english: "Solar Plexus", color: "#B8955A",
    actions: [
      { title: "寫下三件「我做到了」", desc: "不論大小，寫下最近三件你完成或處理好的事。", prompt: "你比自己以為的更有能力。這個練習不是在說服你，而是幫你看見已經存在的事實。", support: "你的努力是真實的，即使沒有人看見。" },
      { title: "練習說一次「不」", desc: "想想有沒有什麼你一直說好、但其實不想做的事。今天試試說：「我需要多想一下。」", prompt: "界線不是拒絕別人，而是照顧自己的方式。", support: "你有權利考慮自己的需求。" },
      { title: "做一件你一直在拖延的小事", desc: "選一件小的、拖著沒做的事，今天花 5 分鐘完成它。", prompt: "完成一件事的感覺，能幫助你重新感受到自己的力量。", support: "從小的地方開始，慢慢找回節奏。" },
      { title: "對自己說一句話", desc: "把手放在胸口，對自己說：「我已經盡力了。我允許自己慢下來。」", prompt: "不需要相信，只需要說出來。語言有時候能走在感受前面。", support: "你值得被溫柔對待，包括被自己。" },
    ],
  },
  heart: {
    name: "心輪", english: "Heart", color: "#9AB89A",
    actions: [
      { title: "寫一封不需要寄出的信", desc: "寫給任何人——包括過去的自己、或一段你還沒放下的關係。不需要寄出。", prompt: "有些話不是說給對方聽的，而是說給自己聽的。", support: "讓情緒流動，是一種療癒。" },
      { title: "想起一個讓你感謝的人", desc: "想一個曾經幫助過你的人。不需要聯絡，只是靜靜想起他。", prompt: "感恩不是為了欠債，而是提醒自己：曾有人在你身邊。", support: "你不是一個人走到今天的。" },
      { title: "把手放在胸口，深呼吸三次", desc: "感受心臟的跳動。吸氣時想：「我接受此刻的自己。」", prompt: "你不需要先變好，才值得被愛。", support: "你現在的樣子，已經足夠了。" },
      { title: "做一件讓自己感覺被照顧的事", desc: "泡杯茶、敷個臉、或只是蓋上一條喜歡的毯子。", prompt: "照顧自己不是奢侈，是必要。", support: "你也值得被溫柔對待。" },
    ],
  },
  throat: {
    name: "喉輪", english: "Throat", color: "#7A9DC8",
    actions: [
      { title: "寫下今天真正的感受", desc: "不需要整理，不需要漂亮，就只是寫下此刻你真正感覺到的是什麼。", prompt: "你的感受不需要理由，也不需要合理。它只需要被你承認。", support: "說出來，就已經是一種勇氣。" },
      { title: "唱一首歌（哪怕是哼哼）", desc: "不需要唱好，哼一首腦海裡的旋律，或跟著音樂唱。", prompt: "聲音是你存在的方式之一。讓自己被自己聽見。", support: "你的聲音，值得佔據空間。" },
      { title: "說一件你一直沒說的事", desc: "對著空氣說，或寫在紙上。不需要說給任何人聽。", prompt: "有些事悶在心裡太久，只是說出來，就能輕一點。", support: "你不需要永遠沉默。" },
      { title: "靜下來聽 5 分鐘", desc: "不開音樂，讓自己靜靜坐著，注意身邊的聲音。", prompt: "傾聽也是表達的一部分。先聽見外面，有時候能幫助聽見裡面。", support: "安靜，不等於什麼都沒有。" },
    ],
  },
  third_eye: {
    name: "眉心輪", english: "Third Eye", color: "#9A8DC8",
    actions: [
      { title: "把腦海中的想法全部寫出來", desc: "設一個計時器 5 分鐘，把所有在腦子裡轉的念頭寫下來，不管有沒有邏輯。", prompt: "把想法從腦袋移到紙上，能讓思緒稍微安靜一點。", support: "你不需要現在就想清楚。" },
      { title: "離線 30 分鐘", desc: "放下手機、關掉通知，讓大腦休息 30 分鐘。做什麼都好，或什麼都不做。", prompt: "當資訊太多的時候，暫停才能看清楚。", support: "你不會錯過任何重要的事。" },
      { title: "問自己：此刻最重要的一件事是什麼？", desc: "只選一件。不是最緊急的，是對你最重要的。", prompt: "在很多事情裡，找到那一件，你才能真正開始。", support: "清晰，不是同時看見全部，而是先看見最重要的那個。" },
      { title: "閉眼深呼吸，什麼都不做", desc: "閉上眼睛，深呼吸十次。如果思緒跑掉了，再輕輕把它帶回來。", prompt: "你不需要「想通」才能繼續。有時候，暫停本身就是答案。", support: "讓自己安靜下來，比找到答案更重要。" },
    ],
  },
  crown: {
    name: "頂輪", english: "Crown", color: "#C8B8A0",
    actions: [
      { title: "坐在窗邊看天空五分鐘", desc: "不需要想任何事，只是看。雲、光、或夜空都好。", prompt: "有些事，不需要我們去控制，它本來就在運行。", support: "你允許自己停下來，就已經是一種勇氣。" },
      { title: "寫下你現在還不知道答案的一個問題", desc: "不需要找答案，只是把問題寫下來。", prompt: "有些問題，是陪著走的，不是解決的。", support: "帶著問題生活，也是一種活著的方式。" },
      { title: "回想一件曾經讓你有意義感的事", desc: "不需要是大事，可能只是一段對話、一個瞬間、或某次感到自己做了對的事。", prompt: "意義感不是從天而降的，它藏在過去你已經有過的時刻裡。", support: "你有過那樣的時刻，意味著你還能再有。" },
      { title: "允許自己今天不要有答案", desc: "把「我不知道」說出來，或寫下來。不是放棄，而是承認真實的狀態。", prompt: "不知道，是誠實的起點。", support: "你不需要今天就想清楚人生的方向。" },
    ],
  },
};

const ENDINGS = [
  "真正的療癒，不一定是找到所有答案。有時候，只是願意為自己做一件小小的事。",
  "不需要一次變得更好。你已經在路上了。",
  "願今天的這個小行動，成為照顧自己的開始。",
  "你不需要獨自完成所有事情。請記得，也照顧自己。",
];

function BreathOrb({ size = 140 }) {
  return (
    <div style={{ width: size, height: size, position: "relative" }} className="flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", top: 0, left: 0 }}>
        <circle cx="70" cy="70" r="60" fill="rgba(184,149,90,0.07)" style={{ animation: "breathe 5s ease-in-out infinite" }} />
        <circle cx="70" cy="70" r="44" fill="rgba(184,149,90,0.10)" style={{ animation: "breathe 5s ease-in-out infinite 0.6s" }} />
        <circle cx="70" cy="70" r="28" fill="rgba(184,149,90,0.16)" style={{ animation: "breathe 5s ease-in-out infinite 1.2s" }} />
        <ellipse cx="70" cy="32" rx="6" ry="12" fill="rgba(184,149,90,0.12)" style={{ animation: "petalFade 5s ease-in-out infinite" }} />
        <ellipse cx="70" cy="108" rx="6" ry="12" fill="rgba(184,149,90,0.12)" style={{ animation: "petalFade 5s ease-in-out infinite 0.3s" }} />
        <ellipse cx="32" cy="70" rx="12" ry="6" fill="rgba(184,149,90,0.12)" style={{ animation: "petalFade 5s ease-in-out infinite 0.6s" }} />
        <ellipse cx="108" cy="70" rx="12" ry="6" fill="rgba(184,149,90,0.12)" style={{ animation: "petalFade 5s ease-in-out infinite 0.9s" }} />
      </svg>
    </div>
  );
}

function Divider() {
  return <div style={{ width: "40px", height: "1px", background: "var(--gold-light)", margin: "0 auto", opacity: 0.5 }} />;
}

function HomePage({ onStart }) {
  return (
    <div className="page-wrap flex flex-col items-center justify-center text-center px-8 py-16">
      <BreathOrb size={150} />
      <div style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>
        <span className="brand-tag">曉時光</span>
      </div>
      <h1 className="headline mt-5 mb-4">此刻的你，<br />需要什麼樣的支持？</h1>
      <div style={{ margin: "1.2rem 0" }}><Divider /></div>
      <p className="body-text mb-10" style={{ maxWidth: "280px" }}>
        這不是測驗，也不是診斷。<br />只是邀請你停下來，<br />聽聽自己真正需要的是什麼。
      </p>
      <button className="btn-gold" onClick={onStart}>開　始</button>
      <p className="hint-text mt-8">整個流程約 2 分鐘 · 不儲存任何資料</p>
    </div>
  );
}

function InputPage({ onSubmit, loading }) {
  const [text, setText] = useState("");
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div className="page-wrap flex flex-col px-7 py-12" style={{ maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ flex: 1 }}>
        <span className="section-label">說說看</span>
        <h2 className="headline mt-4 mb-3">最近最困擾你的事情<br />是什麼？</h2>
        <p className="body-text mb-7">不需要整理，不需要邏輯。<br />就像跟一個朋友說話一樣。</p>
        <textarea ref={ref} value={text} onChange={e => setText(e.target.value)}
          placeholder="例如：最近工作壓力很大，總覺得自己不夠好……"
          className="text-area" rows={6} disabled={loading} />
        <div className="hint-text text-right mt-2">{text.length} 字</div>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <button className="btn-gold w-full" onClick={() => onSubmit(text)}
          disabled={text.trim().length < 5 || loading}
          style={{ opacity: text.trim().length < 5 || loading ? 0.45 : 1, cursor: text.trim().length < 5 || loading ? "not-allowed" : "pointer" }}>
          {loading
            ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}><span className="spinner" />整理中，請稍候……</span>
            : "繼　續"}
        </button>
      </div>
    </div>
  );
}

function ResponsePage({ aiData, onChoose }) {
  const primary = CHAKRA_DB[aiData.primary_chakra];
  const secondary = aiData.secondary_chakra ? CHAKRA_DB[aiData.secondary_chakra] : null;
  return (
    <div className="page-wrap flex flex-col px-7 py-12" style={{ maxWidth: "480px", margin: "0 auto" }}>
      <span className="section-label">你說的，我聽到了</span>
      <div className="paper-card mt-5 mb-6"><p className="serif-body">{aiData.empathy}</p></div>
      <Divider />
      <div style={{ margin: "1.5rem 0" }}>
        <p className="body-text mb-3">{aiData.primary_theme}</p>
        {aiData.secondary_theme && <p className="body-text">{aiData.secondary_theme}</p>}
      </div>
      <p className="hint-text mb-4" style={{ textAlign: "center" }}>你想先照顧哪個部分？</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button className="choice-pill" onClick={() => onChoose(aiData.primary_chakra)}>
          <span className="chakra-dot" style={{ backgroundColor: primary?.color }} />{aiData.primary_label}
        </button>
        {secondary && aiData.secondary_label && (
          <button className="choice-pill" onClick={() => onChoose(aiData.secondary_chakra)}>
            <span className="chakra-dot" style={{ backgroundColor: secondary?.color }} />{aiData.secondary_label}
          </button>
        )}
      </div>
    </div>
  );
}

function ActionCardPage({ chakraKey, onNext }) {
  const chakra = CHAKRA_DB[chakraKey];
  const [card] = useState(() => { const a = chakra.actions; return a[Math.floor(Math.random() * a.length)]; });
  return (
    <div className="page-wrap flex flex-col px-7 py-12" style={{ maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }}>
        <span className="chakra-dot" style={{ backgroundColor: chakra.color }} />
        <span className="section-label" style={{ marginBottom: 0 }}>{chakra.name} · 今日療癒行動</span>
      </div>
      <div className="action-card mb-5" style={{ borderTopColor: chakra.color }}>
        <h3 className="action-title mb-4">{card.title}</h3>
        <p className="body-text mb-5">{card.desc}</p>
        <div style={{ borderTop: "1px solid rgba(184,149,90,0.2)", paddingTop: "1.2rem" }}>
          <p className="hint-text mb-1">覺察提問</p>
          <p className="serif-body italic">{card.prompt}</p>
        </div>
      </div>
      <div className="support-strip">
        <span style={{ color: "var(--gold)", opacity: 0.7, marginRight: "6px" }}>✦</span>
        <span className="serif-body">{card.support}</span>
      </div>
      <p className="hint-text text-center mt-4">5 到 30 分鐘內可以完成 · 在家就可以做</p>
      <div style={{ marginTop: "2.5rem" }}>
        <button className="btn-gold w-full" onClick={onNext}>繼　續</button>
      </div>
    </div>
  );
}

function EndingPage({ onRestart }) {
  const [ending] = useState(() => ENDINGS[Math.floor(Math.random() * ENDINGS.length)]);
  return (
    <div className="page-wrap flex flex-col items-center justify-center text-center px-8 py-16" style={{ minHeight: "100vh" }}>
      <BreathOrb size={110} />
      <div style={{ margin: "2rem 0 1.2rem" }}><Divider /></div>
      <p className="ending-quote">{ending}</p>
      <div style={{ margin: "1.2rem 0 2.5rem" }}><Divider /></div>
      <p className="body-text mb-8" style={{ maxWidth: "260px" }}>如果這個工具對你有幫助，<br />歡迎分享給也需要的朋友。</p>
      <div style={{ display: "flex", gap: "12px", marginBottom: "2rem" }}>
        <a href="https://www.threads.net/@xiaoshiguang" target="_blank" rel="noopener noreferrer" className="btn-outline">Threads</a>
        <a href="https://www.instagram.com/xiaoshiguang.healing" target="_blank" rel="noopener noreferrer" className="btn-outline">Instagram</a>
      </div>
      <button onClick={onRestart} className="hint-text" style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "4px" }}>
        重新開始
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [userInput, setUserInput] = useState("");
  const [aiData, setAiData] = useState(null);
  const [chosenChakra, setChosenChakra] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callAnalyze = async (text) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "伺服器錯誤");
      }
      const parsed = await res.json();
      setAiData(parsed);
      setPage("response");
    } catch (e) {
      setError(e.message || "有點小問題，可以再試一次嗎？");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setPage("home"); setUserInput(""); setAiData(null); setChosenChakra(null); setError(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Charmonman:wght@400;700&family=Noto+Serif+TC:wght@300;400&family=Noto+Sans+TC:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #F8F4EE; --paper: #FEFCF8; --gold: #A07840; --gold-mid: #B8955A;
          --gold-light: #D4B880; --gold-pale: #EBD9B4; --text-dark: #4A3C28;
          --text-mid: #7A6848; --text-dim: #C4AD90; --border: rgba(160,120,64,0.18);
          --shadow: rgba(120,90,40,0.08);
        }
        html, body, #root { min-height: 100%; background: var(--bg); }
        body { font-family: 'Noto Sans TC', system-ui, sans-serif; font-weight: 300; color: var(--text-dark); line-height: 1.8; -webkit-font-smoothing: antialiased; background: radial-gradient(ellipse at 20% 10%, rgba(212,184,128,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 85%, rgba(184,149,90,0.09) 0%, transparent 55%), var(--bg); }
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes petalFade { 0%, 100% { opacity: 0.12; } 50% { opacity: 0.28; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .page-wrap { min-height: 100vh; animation: fadeUp 0.55s ease-out; }
        .brand-tag { font-family: 'Charmonman', serif; font-size: 17px; font-weight: 400; letter-spacing: 0.35em; color: var(--gold-mid); text-transform: uppercase; }
        .headline { font-family: 'Charmonman', serif; font-size: clamp(22px, 5.5vw, 28px); font-weight: 400; color: var(--text-dark); line-height: 1.65; letter-spacing: 0.04em; }
        .serif-body { font-family: 'Charmonman', serif; font-size: 15px; font-weight: 400; color: var(--text-mid); line-height: 1.9; letter-spacing: 0.03em; }
        .body-text { font-family: 'Noto Sans TC', sans-serif; font-size: 14px; font-weight: 300; color: var(--text-mid); line-height: 1.9; }
        .hint-text { font-family: 'Noto Sans TC', sans-serif; font-size: 13px; font-weight: 300; color: var(--text-dim); letter-spacing: 0.06em; line-height: 1.7; }
        .section-label { display: block; font-family: 'Noto Sans TC', sans-serif; font-size: 14px; font-weight: 400; letter-spacing: 0.28em; color: var(--gold-mid); text-transform: uppercase; margin-bottom: 0.3rem; }
        .action-title { font-family: 'Charmonman', serif; font-size: 20px; font-weight: 700; color: var(--text-dark); letter-spacing: 0.04em; line-height: 1.5; }
        .ending-quote { font-family: 'Charmonman', serif; font-size: 16px; font-weight: 400; color: var(--text-mid); line-height: 2; letter-spacing: 0.05em; max-width: 290px; margin: 0 auto; }
        .btn-gold { display: inline-flex; align-items: center; justify-content: center; background: var(--gold-mid); color: #FEF9F2; border: none; border-radius: 100px; padding: 14px 44px; font-family: 'Charmonman', serif; font-size: 15px; font-weight: 400; letter-spacing: 0.18em; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 2px 16px rgba(160,120,64,0.22); }
        .btn-gold:hover:not(:disabled) { background: var(--gold); transform: translateY(-2px); }
        .btn-gold.w-full { width: 100%; }
        .btn-outline { display: inline-flex; align-items: center; justify-content: center; background: transparent; color: var(--gold-mid); border: 1px solid var(--gold-pale); border-radius: 100px; padding: 10px 26px; font-family: 'Noto Sans TC', sans-serif; font-size: 12px; font-weight: 300; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s ease; text-decoration: none; }
        .btn-outline:hover { border-color: var(--gold-mid); }
        .paper-card { background: var(--paper); border: 1px solid var(--border); border-radius: 18px; padding: 22px 24px; box-shadow: 0 2px 20px var(--shadow); }
        .action-card { background: var(--paper); border: 1px solid var(--border); border-top: 3px solid var(--gold-mid); border-radius: 18px; padding: 24px; box-shadow: 0 2px 20px var(--shadow); }
        .support-strip { background: rgba(212,184,128,0.12); border-radius: 12px; padding: 16px 20px; display: flex; align-items: flex-start; gap: 4px; }
        .choice-pill { width: 100%; display: flex; align-items: center; gap: 12px; background: var(--paper); border: 1px solid var(--border); border-radius: 100px; padding: 15px 24px; font-family: 'Charmonman', serif; font-size: 14.5px; font-weight: 400; color: var(--text-dark); letter-spacing: 0.04em; cursor: pointer; transition: all 0.22s ease; text-align: left; box-shadow: 0 1px 8px var(--shadow); }
        .choice-pill:hover { border-color: var(--gold-pale); transform: translateX(5px); }
        .chakra-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; opacity: 0.85; }
        .text-area { width: 100%; background: var(--paper); border: 1px solid var(--border); border-radius: 16px; padding: 16px 20px; font-family: 'Noto Sans TC', sans-serif; font-size: 14px; font-weight: 300; color: var(--text-dark); line-height: 1.85; resize: none; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-shadow: 0 1px 8px var(--shadow); }
        .text-area:focus { border-color: var(--gold-pale); box-shadow: 0 0 0 3px rgba(212,184,128,0.15); }
        .text-area::placeholder { color: var(--text-dim); font-size: 13px; }
        .progress-bar { display: flex; gap: 6px; justify-content: center; padding: 18px 0 0; }
        .prog-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold-pale); transition: all 0.3s; }
        .prog-dot.on { background: var(--gold-mid); width: 20px; border-radius: 3px; }
        .spinner { display: inline-block; width: 15px; height: 15px; border: 2px solid rgba(254,249,242,0.3); border-top-color: #FEF9F2; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .error-box { background: rgba(200,120,74,0.07); border: 1px solid rgba(200,120,74,0.22); border-radius: 12px; padding: 12px 16px; color: var(--gold); font-size: 13px; text-align: center; margin: 12px 28px 0; font-family: 'Noto Sans TC', sans-serif; }
        body::before { content: ''; position: fixed; inset: 0; background-image: radial-gradient(circle at 15% 20%, rgba(212,184,128,0.06) 0%, transparent 40%), radial-gradient(circle at 85% 75%, rgba(184,149,90,0.05) 0%, transparent 40%); pointer-events: none; z-index: 0; }
        #root { position: relative; z-index: 1; }
		/* ── Layout helpers（取代 Tailwind）── */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .justify-center { justify-content: center; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .w-full { width: 100%; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-5 { margin-top: 1.25rem; }
        .mt-8 { margin-top: 2rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-5 { margin-bottom: 1.25rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-7 { margin-bottom: 1.75rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .px-7 { padding-left: 1.75rem; padding-right: 1.75rem; }
        .px-8 { padding-left: 2rem; padding-right: 2rem; }
        .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
        .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
        .italic { font-style: italic; }
        .underline { text-decoration: underline; }
      `}</style>

      {page !== "home" && page !== "ending" && (
        <div className="progress-bar">
          {["input", "response", "card"].map(p => (
            <div key={p} className={`prog-dot ${page === p ? "on" : ""}`} />
          ))}
        </div>
      )}

      {page === "home"     && <HomePage onStart={() => setPage("input")} />}
      {page === "input"    && (<><InputPage onSubmit={t => { setUserInput(t); callAnalyze(t); }} loading={loading} />{error && <div className="error-box">{error}</div>}</>)}
      {page === "response" && aiData      && <ResponsePage aiData={aiData} onChoose={k => { setChosenChakra(k); setPage("card"); }} />}
      {page === "card"     && chosenChakra && <ActionCardPage chakraKey={chosenChakra} onNext={() => setPage("ending")} />}
      {page === "ending"   && <EndingPage onRestart={handleRestart} />}
    </>
  );
}