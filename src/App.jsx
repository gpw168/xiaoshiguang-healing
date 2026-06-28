import { useState, useEffect, useRef } from "react";

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
        <button className="choice-pill" onClick={() => onChoose("primary")}>
          <span className="chakra-dot" style={{ backgroundColor: aiData.primaryColor }} />
          {aiData.primary_label}
        </button>
        {aiData.secondary_chakra && aiData.secondary_label && (
          <button className="choice-pill" onClick={() => onChoose("secondary")}>
            <span className="chakra-dot" style={{ backgroundColor: "#C8B8A0" }} />
            {aiData.secondary_label}
          </button>
        )}
      </div>
    </div>
  );
}

function ActionCardPage({ aiData, choice, onNext }) {
  const CHAKRA_COLORS = { root:"#C8784A", sacral:"#C8904A", solar:"#B8955A", heart:"#9AB89A", throat:"#7A9DC8", third_eye:"#9A8DC8", crown:"#C8B8A0" };
  const CHAKRA_NAMES = { root:"海底輪", sacral:"生殖輪", solar:"太陽神經叢", heart:"心輪", throat:"喉輪", third_eye:"眉心輪", crown:"頂輪" };

  const card = aiData.actionCard;
  const color = choice === "secondary" ? (CHAKRA_COLORS[aiData.secondary_chakra] || "#B8955A") : (aiData.primaryColor || "#B8955A");
  const chakraName = choice === "secondary" ? (CHAKRA_NAMES[aiData.secondary_chakra] || "") : (aiData.primaryChakraName || "");
  const subName = choice === "secondary" ? (aiData.secondary_sub || "") : (aiData.primary_sub || "");

  if (!card) {
    return (
      <div className="page-wrap flex flex-col px-7 py-12" style={{ maxWidth: "480px", margin: "0 auto" }}>
        <p className="body-text">今天沒有找到對應的行動卡，但你願意停下來覺察，已經是很重要的一步。</p>
        <div style={{ marginTop: "2.5rem" }}>
          <button className="btn-gold w-full" onClick={onNext}>繼　續</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap flex flex-col px-7 py-12" style={{ maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
        <span className="chakra-dot" style={{ backgroundColor: color }} />
        <span className="section-label" style={{ marginBottom: 0 }}>{chakraName}</span>
      </div>
      <p className="hint-text mb-5" style={{ paddingLeft: "17px" }}>{subName} · 今日療癒行動</p>
      <div className="action-card mb-5" style={{ borderTopColor: color }}>
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
  const [aiData, setAiData] = useState(null);
  const [choice, setChoice] = useState(null);
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
      setAiData({ ...parsed, userText: text });
      setPage("response");
    } catch (e) {
      setError(e.message || "有點小問題，可以再試一次嗎？");
    } finally {
      setLoading(false);
    }
  };

   const handleChoose = async (c) => {
    setChoice(c);
    setPage("card");

    if (!aiData) return;

    const chakra = c === "primary" ? aiData.primary_chakra : aiData.secondary_chakra;
    const sub = c === "primary" ? aiData.primary_sub : aiData.secondary_sub;
    const choiceLabel = c === "primary" ? aiData.primary_label : aiData.secondary_label;
    const userText = aiData.userText || "";

    try {
      const res = await fetch("/api/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chakra, sub }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiData(prev => ({ ...prev, actionCard: data.actionCard }));

        fetch("/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: userText,
            choice: choiceLabel,
            actionTitle: data.actionCard?.title || "",
          }),
        }).catch(e => console.error("log error:", e));
      }
    } catch (e) {
      console.error("draw error:", e);
    }
  };

  const handleRestart = () => {
    setPage("home"); setAiData(null); setChoice(null); setError(null);
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
        .flex { display: flex; } .flex-col { flex-direction: column; } .items-center { align-items: center; } .justify-center { justify-content: center; } .text-center { text-align: center; } .text-right { text-align: right; } .w-full { width: 100%; } .italic { font-style: italic; }
        .mt-2 { margin-top: 0.5rem; } .mt-4 { margin-top: 1rem; } .mt-5 { margin-top: 1.25rem; } .mt-8 { margin-top: 2rem; }
        .mb-3 { margin-bottom: 0.75rem; } .mb-4 { margin-bottom: 1rem; } .mb-5 { margin-bottom: 1.25rem; } .mb-6 { margin-bottom: 1.5rem; } .mb-7 { margin-bottom: 1.75rem; } .mb-8 { margin-bottom: 2rem; } .mb-10 { margin-bottom: 2.5rem; }
        .px-7 { padding-left: 1.75rem; padding-right: 1.75rem; } .px-8 { padding-left: 2rem; padding-right: 2rem; }
        .py-12 { padding-top: 3rem; padding-bottom: 3rem; } .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
        body::before { content: ''; position: fixed; inset: 0; background-image: radial-gradient(circle at 15% 20%, rgba(212,184,128,0.06) 0%, transparent 40%), radial-gradient(circle at 85% 75%, rgba(184,149,90,0.05) 0%, transparent 40%); pointer-events: none; z-index: 0; }
        #root { position: relative; z-index: 1; }
      `}</style>

      {page !== "home" && page !== "ending" && (
        <div className="progress-bar">
          {["input", "response", "card"].map(p => (
            <div key={p} className={`prog-dot ${page === p ? "on" : ""}`} />
          ))}
        </div>
      )}

      {page === "home"     && <HomePage onStart={() => setPage("input")} />}
      {page === "input"    && (
        <>
          <InputPage onSubmit={t => callAnalyze(t)} loading={loading} />
          {error && <div className="error-box">{error}</div>}
        </>
      )}
      {page === "response" && aiData && <ResponsePage aiData={aiData} onChoose={handleChoose} />}
      {page === "card"     && aiData && <ActionCardPage aiData={aiData} choice={choice} onNext={() => setPage("ending")} />}
      {page === "ending"   && <EndingPage onRestart={handleRestart} />}
    </>
  );
}