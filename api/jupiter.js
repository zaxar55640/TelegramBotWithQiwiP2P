// pages/api/solana.js (в Next.js)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Выбираем RPC, например, GenesysGo (или Alchemy):
    const rpcUrl = "https://ssc-dao.genesysgo.net/";

    // Пересылаем запрос
    const resp = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const text = await resp.text();
    res.status(resp.status).send(text);
  } catch (e) {
    console.error("RPC proxy error:", e);
    res.status(500).json({ error: e.message });
  }
}
