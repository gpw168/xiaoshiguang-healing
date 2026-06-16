import { google } from "googleapis";

const SHEET_ID = "1hG1TAw51o04oioZLsH9t_JAz6xUBNjGQn2bOvqnfiF4";

async function updateLog(rowData) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // 找到最後一筆符合的資料，更新 G 和 H 欄
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "工作表1!A:H",
    });

    const rows = result.data.values || [];
    // 從最後一筆往前找，找到 B 欄符合使用者輸入的那行
    let targetRow = -1;
    for (let i = rows.length - 1; i >= 1; i--) {
      if (rows[i][1] === rowData.text) {
        targetRow = i + 1; // Google Sheets 從 1 開始
        break;
      }
    }

    if (targetRow > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `工作表1!G${targetRow}:H${targetRow}`,
        valueInputOption: "RAW",
        requestBody: { values: [[rowData.choice, rowData.actionTitle]] },
      });
    }
  } catch (err) {
    console.error("Log update error:", err.message);
  }
}

export default async function handler(req, res) {
  const body = req.body || {};
  const { text, choice, actionTitle } = body;

  if (!text || !choice || !actionTitle) {
    return res.status(400).json({ error: "缺少必要資料" });
  }

  await updateLog({ text, choice, actionTitle });
  return res.status(200).json({ ok: true });
}

export const config = {
  api: { bodyParser: true },
};