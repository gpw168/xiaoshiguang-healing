import { google } from "googleapis";

const SHEET_ID = "1hG1TAw51o04oioZLsH9t_JAz6xUBNjGQn2bOvqnfiF4";

const CHAKRA_NAMES = {
  root: "海底輪",
  sacral: "生殖輪",
  solar: "太陽神經叢",
  heart: "心輪",
  throat: "喉輪",
  third_eye: "眉心輪",
  crown: "頂輪",
};

const CHAKRA_COLORS = {
  root: "#C8784A",
  sacral: "#C8904A",
  solar: "#B8955A",
  heart: "#9AB89A",
  throat: "#7A9DC8",
  third_eye: "#9A8DC8",
  crown: "#C8B8A0",
};

async function getSheetData() {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "行動卡內容!A2:F",
  });
  return result.data.values || [];
}

async function appendToLog(values) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "工作表1!A:F",
      valueInputOption: "RAW",
      requestBody: { values: [values] },
    });
  } catch (err) {
    console.error("Log error:", err.message);
  }
}

const SYSTEM_PROMPT = `你是「曉時光」療癒卡系統的溫柔陪伴者。

你的角色：溫柔的陪伴者、協助整理思緒的人。
你不是：心理師、醫師、靈媒、診斷者。

語氣原則：溫柔、真誠、尊重使用者主體性、保留選擇權。

嚴格禁用詞彙：失衡、堵塞、異常、能量太低、業力、顯化失敗
改用：「這可能正在邀請你關注……」、「也許，你正需要……」、「從你的描述中，我感受到……」

脈輪與次議題對應系統：
- root（海底輪）次議題：金錢匱乏感、缺乏歸屬感、身體能量枯竭
- sacral（生殖輪）次議題：情感冷漠、創造力阻塞、過度依附
- solar（太陽神經叢）次議題：受害者心態、權力欲過強、自尊低落
- heart（心輪）次議題：關係控制、嫉妒與批判、防衛心重
- throat（喉輪）次議題：溝通障礙、自以為是、缺乏創造表達
- third_eye（眉心輪）次議題：迷失方向、偏執與幻想、注意力不集中
- crown（頂輪）次議題：生活無聊感、優柔寡斷、執著形式

重要：
1. 在 primary_theme 裡，明確說明對應的脈輪和次議題，例如：「從你的描述中，我感受到這與【海底輪】的【缺乏歸屬感】有關。也許，你正需要重新找回與世界的連結。」
2. 在 secondary_theme 裡，也要明確說出次要脈輪和次議題名稱，例如：「這也與【太陽神經叢】的【自尊低落】有關，也許你正需要重新相信自己的價值。」
3. primary_sub 和 secondary_sub 必須完全符合上方列出的次議題名稱（完全一致）

你的回應必須是一個 JSON 物件（不要有任何其他文字，只有 JSON）：
{
  "empathy": "溫柔回應使用者，2-3句話",
  "primary_chakra": "主要脈輪key（從root/sacral/solar/heart/throat/third_eye/crown選一個）",
  "primary_sub": "主要次議題（必須完全符合上方列出的名稱）",
  "secondary_chakra": "次要脈輪key或null",
  "secondary_sub": "次要次議題（必須完全符合上方列出的名稱）或null",
  "primary_theme": "明確說明脈輪和次議題，2-3句話",
  "secondary_theme": "次要主題，1句話或null",
  "primary_label": "給使用者選擇的文字（10字以內）",
  "secondary_label": "次要選擇文字或null"
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
    return res.status(500).json({ error: "伺服器設定錯誤，請聯繫管理員" });
  }

  try {
    // 1. 呼叫 Claude 分析
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
      return res.status(502).json({ error: "AI 服務暫時無法回應，請稍後再試" });
    }

    const data = await response.json();
    const rawText = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const clean = rawText.replace(/```json|```/gi, "").trim();
    const parsed = JSON.parse(clean);

    const VALID_CHAKRAS = ["root", "sacral", "solar", "heart", "throat", "third_eye", "crown"];
    if (!VALID_CHAKRAS.includes(parsed.primary_chakra)) parsed.primary_chakra = "root";
    if (parsed.secondary_chakra && !VALID_CHAKRAS.includes(parsed.secondary_chakra)) parsed.secondary_chakra = null;

    // 2. 從 Google Sheets 讀取行動卡
    const rows = await getSheetData();

    // 篩選主要次議題的行動卡
    const primaryCards = rows.filter(r => r[0] === parsed.primary_chakra && r[1] === parsed.primary_sub);
    let actionCard = null;
    if (primaryCards.length > 0) {
      const picked = primaryCards[Math.floor(Math.random() * primaryCards.length)];
      actionCard = {
        title: picked[2] || "",
        desc: picked[3] || "",
        prompt: picked[4] || "",
        support: picked[5] || "",
      };
    }

    // 3. 記錄到工作表1（6欄）
    const now = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
    const primaryName = CHAKRA_NAMES[parsed.primary_chakra] || parsed.primary_chakra;
    const secondaryName = parsed.secondary_chakra ? CHAKRA_NAMES[parsed.secondary_chakra] : "";
    const primarySub = parsed.primary_sub || "";
    const secondarySub = parsed.secondary_sub || "";
    await appendToLog([now, text.trim(), primaryName, primarySub, secondaryName, secondarySub]);

    return res.status(200).json({
      ...parsed,
      actionCard,
      primaryColor: CHAKRA_COLORS[parsed.primary_chakra] || "#B8955A",
      primaryChakraName: primaryName,
    });

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
