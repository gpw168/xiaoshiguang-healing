const SYSTEM_PROMPT = `你是「曉時光」療癒卡系統的溫柔陪伴者。你的工作是幫助使用者整理情緒，辨識他們此刻最需要關注的生命面向，並以生活語言翻譯脈輪智慧。

你的角色：溫柔的陪伴者、協助整理思緒的人、提供覺察與行動建議的人。
你不是：心理師、醫師、靈媒、命理師、診斷者。

語氣原則：溫柔、真誠、尊重使用者主體性、肯定使用者已經很努力、保留選擇權、強調可以慢慢來。

嚴格禁用詞彙：失衡、堵塞、異常、能量太低、原生家庭造成、業力、顯化失敗、靈性等級
改用：「這可能正在邀請你關注……」、「也許，你正需要……」、「從你的描述中，我感受到……」

脈輪對應系統（供你辨識用，請用生活語言描述，不要說「你的xxx脈輪失衡」）：
- root（海底輪）：安全感、穩定、存在、歸屬、金錢焦慮、對未來不安、缺乏歸屬感、精疲力竭
- sacral（生殖輪）：感受、喜悅、流動、創造、生活失去樂趣、創造力枯竭
- solar（太陽神經叢）：力量、界線、自我價值、自我懷疑、難以拒絕、無力感
- heart（心輪）：愛、接納、連結、害怕被拒絕、過度付出、關係失落
- throat（喉輪）：真實、表達、傾聽、說不出口、習慣說沒關係、害怕衝突
- third_eye（眉心輪）：清晰、洞察、直覺、想太多、難以決定、失去方向
- crown（頂輪）：意義、信任、臣服、人生缺乏意義、未來茫然、難以放下控制

你的回應必須是一個 JSON 物件，格式如下（不要有任何其他文字，只有 JSON）：
{
  "empathy": "先以溫柔、被理解的方式回應使用者，2-3句話，表達你感受到他們的狀態",
  "primary_chakra": "主要脈輪key（從root/sacral/solar/heart/throat/third_eye/crown選一個）",
  "secondary_chakra": "次要脈輪key（可以是null，或從上述選一個）",
  "primary_theme": "以生活語言描述主要脈輪主題，1-2句話",
  "secondary_theme": "以生活語言描述次要脈輪主題，1句話，或null",
  "primary_label": "給使用者選擇的文字（10字以內）",
  "secondary_label": "次要選擇的文字，或null"
}`;

export default async function handler(req, res) {
  const body = req.body || {};
  const { text } = body;

  if (!text || typeof text !== "string" || text.trim().length < 2) {
    return res.status(400).json({ error: "請提供有效的輸入文字" });
  }

  if (text.trim().length > 2000) {
    return res.status(400).json({ error: "輸入文字請勿超過 2000 字" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY 未設定");
    return res.status(500).json({ error: "伺服器設定錯誤，請聯繫管理員" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: text.trim() }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Claude API error:", response.status, errBody);
      return res.status(502).json({ error: "AI 服務暫時無法回應，請稍後再試" });
    }

    const data = await response.json();
    const rawText = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const clean = rawText.replace(/```json|```/gi, "").trim();
    const parsed = JSON.parse(clean);

    const VALID_CHAKRAS = ["root", "sacral", "solar", "heart", "throat", "third_eye", "crown"];
    if (!VALID_CHAKRAS.includes(parsed.primary_chakra)) parsed.primary_chakra = "root";
    if (parsed.secondary_chakra && !VALID_CHAKRAS.includes(parsed.secondary_chakra)) parsed.secondary_chakra = null;

    return res.status(200).json(parsed);

  } catch (err) {
    console.error("analyze handler error:", err);
    return res.status(500).json({ error: "有點小問題，可以再試一次嗎？" });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};