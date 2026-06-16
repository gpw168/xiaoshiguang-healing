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

const GOOGLE_CREDS = {
  type: "service_account",
  project_id: "trusty-pipe-337408",
  private_key_id: "90adba2462bb02d18f3ccdb33e37571a0e91317a",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC+wuvK9B5UODnJ\nACXsocNuegqGosqbIrk3/5tpLrIhOhFTcXhIH/MXKVqaPLSDUjzvKqNTOO3V772B\n9tPifUsx7SjITS2cy2nP1iEgsVIa0svvii9SzfZoiilCl96+ciQNqjcHXwLOke7f\nLEGdguVzQf6IUCDW7ALEsz4BZRV9/4/8RWGtFgguam8Uxnv3Pvm5f2HFCPMhpSjl\nfaHKEQTlzd6dGIJn+7yT2tBJaS0fMnFkIJCVwyXjBPkvsJcJS+UCEjNTaMv6Xzdh\na6Nyyk09cI+rJ9+XJtoNGVTlbEAaWtlTuK5HZkU6soDdvU2OrZqrz9vbL88lZdjo\nI5Gz1WF7AgMBAAECgf8is+VV4e599gWxr8LtSVux4e91/HCWEXHpmXHQ1UAky0bt\n5yRDsYw+YUeH7BV88ua1Lef2F0Caz0thNKp7rgZJDtvKJtJujyT5ztXu03fTIDzU\nxJfXU+nI0aKv6F6dIiaRemWs8ZvaQY18MJDjzX6Cncf5TXXQftW48uKd8KEc3Mdr\n8Xh3WDH5VlzZYa+jhd6mZSPYoNBpKJqPuu8AJI5+inNJbcAMUscsHgnZDaJO4Tei\ncMmTjku55mNadQN+ilMOrohKa7C1bViQS7iUesY+BfPAAoPt8QyUuoeMfDKKSfef\nD+MtfPnSRBF7uaQv+MDY/VlaNfQgauKLEwSefNECgYEA5uol5n7wikn3SlcuAl1M\nUOYHfNQ7HJWep5vWpN+N5TOKd6GNNlHZAb4dzL/LNjPiNIiaUrI59Jojcw/jmI6F\nZQcPq/7sYRxtJgfQlPAd9KwPEH8mKbBUrehmn0zoOsvVdGsc7iDWCc0gRN3hXyVG\nZe5MukjXFQX5RksphjtEd2cCgYEA03wXb4Gd7gG3971uROBCUX7GAXRvHcr/W5AP\n2XzwWwQugQ8OPB2VjOuEGbdxsi8qAw+pnZlnV8iXFG/288DCyN3rp61685RFAbH0\nlXm3v2W7hSE4yqcOwZ1IFwQEoW/4ZWbgagXffHmXjXntTrI0fTGTU4UPlbdMUBSQ\nFpRpnM0CgYEAyT2IeD9qrGpXzH77xu2+Y8aFAgIH3hp64UGMJ7X4eKaZZzbw1UUx\nZTZlzBneJMfEvNnL/IP8xDJM8KsJQ9v5XxlvTArnwJ5AdWNcIWC+CoykuFDHVo+o\nzML8JJqmzQ71YPc0iEcvoe0V0U65ae0XVCAA2FxArb6+BsfcUXJ3ccMCgYEAjigq\nxKx3EWacV+5AshGg4pD53j569qbekZi73rDqC/Q6okwRgH1OaqRhbrvttB2Z+ubL\nWAGnAs32KCm+8UiQZl8uKc8mB5eR7zrEsrlXt1NWAn47Y5V6CNGFhNsRlcbjTJ4j\nmYELIevF4LalurF1MPZjFtApkrTcmjPISzVF7L0CgYBU70y5Ru/TLYmN2EpQqh+p\nsIvRJ1ZZwJWjf/iyp3HyWCa+MzSVAOLQbqrPlCzrHyK1tsyzEFKRZC/QPhzF3vwC\neIHSDhNtfbrcHkCfX11RmMzj7g0HpNpoPj5gPHdhR5khqntdo6kFwDv/y5EVmXnL\nsi2ckfeckCq8hDBDTNglJw==\n-----END PRIVATE KEY-----\n",
  client_email: "xiaoshiguang-sheets@trusty-pipe-337408.iam.gserviceaccount.com",
  client_id: "103134830878513432453",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/xiaoshiguang-sheets%40trusty-pipe-337408.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

async function appendToSheet(values) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDS,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "A:D",
      valueInputOption: "RAW",
      requestBody: { values: [values] },
    });
    console.log("Sheets: 寫入成功");
  } catch (err) {
    console.error("Sheets error:", err.message);
  }
}

const SYSTEM_PROMPT = `你是「曉時光」療癒卡系統的溫柔陪伴者。你的工作是幫助使用者整理情緒，辨識他們此刻最需要關注的生命面向，並以生活語言翻譯脈輪智慧。

你的角色：溫柔的陪伴者、協助整理思緒的人、提供覺察與行動建議的人。
你不是：心理師、醫師、靈媒、命理師、診斷者。

語氣原則：溫柔、真誠、尊重使用者主體性、肯定使用者已經很努力、保留選擇權、強調可以慢慢來。

嚴格禁用詞彙：失衡、堵塞、異常、能量太低、原生家庭造成、業力、顯化失敗、靈性等級
改用：「這可能正在邀請你關注……」、「也許，你正需要……」、「從你的描述中，我感受到……」

脈輪對應系統（供你辨識用，請用生活語言描述）：
- root（海底輪）：安全感、穩定、存在、歸屬、金錢焦慮、對未來不安、缺乏歸屬感、精疲力竭
- sacral（生殖輪）：感受、喜悅、流動、創造、生活失去樂趣、創造力枯竭
- solar（太陽神經叢）：力量、界線、自我價值、自我懷疑、難以拒絕、無力感
- heart（心輪）：愛、接納、連結、害怕被拒絕、過度付出、關係失落
- throat（喉輪）：真實、表達、傾聽、說不出口、習慣說沒關係、害怕衝突
- third_eye（眉心輪）：清晰、洞察、直覺、想太多、難以決定、失去方向
- crown（頂輪）：意義、信任、臣服、人生缺乏意義、未來茫然、難以放下控制

重要：在 primary_theme 裡，請明確說明使用者的狀況對應到哪個脈輪，例如：
「從你的描述中，我感受到這與【海底輪】有關——也就是關於安全感與穩定的課題。也許，你正需要重新學習如何在不確定中，依然感受到支持。」

你的回應必須是一個 JSON 物件，格式如下（不要有任何其他文字，只有 JSON）：
{
  "empathy": "先以溫柔、被理解的方式回應使用者，2-3句話，表達你感受到他們的狀態",
  "primary_chakra": "主要脈輪key（從root/sacral/solar/heart/throat/third_eye/crown選一個）",
  "secondary_chakra": "次要脈輪key（可以是null，或從上述選一個）",
  "primary_theme": "明確說明對應脈輪名稱，並以生活語言描述主題，2-3句話",
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

    const now = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
    const primaryName = CHAKRA_NAMES[parsed.primary_chakra] || parsed.primary_chakra;
    const secondaryName = parsed.secondary_chakra ? CHAKRA_NAMES[parsed.secondary_chakra] : "";
    await appendToSheet([now, text.trim(), primaryName, secondaryName]);

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