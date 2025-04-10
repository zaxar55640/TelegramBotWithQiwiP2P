// pages/api/solana.js (Next.js) или /api/solana.js (если не используете страницы Next)
export default async function handler(req, res) {
  // Разрешаем CORS
  // Добавляем "solana-client" в список заголовков
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  // Если хотите вообще не заморачиваться со списком, можно поставить "*"
  // Но обычно браузеры требуют конкретный список или "*".
  // Например, так:
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, solana-client');

  // Preflight запрос (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Укажите любой RPC-эндпоинт (GenesysGo, Alchemy, QuickNode), который хотите использовать
    const rpcUrl = "https://ssc-dao.genesysgo.net/";

    // Пересылаем JSON-RPC запрос на узел
    const resp = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    // Передаём ответ обратно
    const text = await resp.text();
    res.status(resp.status).send(text);

  } catch (err) {
    console.error("RPC proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}
