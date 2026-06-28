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

const VALID_CHAKRAS = ["root", "sacral", "solar", "heart", "throat", "third_eye", "crown"];

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

export default async function handler(req, res) {
  const body = req.body || {};
  const { chakra, sub } = body;

  if (!VALID_CHAKRAS.includes(chakra) || !sub || typeof sub !== "string") {
    return res.status(400).json({ error: "請提供有效的脈輪與次議題" });
  }

  try {
    const rows = await getSheetData();
    const matchedCards = rows.filter(r => r[0] === chakra && r[1] === sub);

    let actionCard = null;
    if (matchedCards.length > 0) {
      const picked = matchedCards[Math.floor(Math.random() * matchedCards.length)];
      actionCard = {
        title: picked[2] || "",
        desc: picked[3] || "",
        prompt: picked[4] || "",
        support: picked[5] || "",
      };
    }

    return res.status(200).json({
      actionCard,
      chakraName: CHAKRA_NAMES[chakra] || chakra,
    });
  } catch (err) {
    console.error("draw handler error:", err);
    return res.status(500).json({ error: "有點小問題，可以再試一次嗎？" });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
