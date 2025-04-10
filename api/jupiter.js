// File: /api/jupiter.js
export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Preflight (OPTIONS) запрос
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Параметры запроса
  const { method, query, body } = req;
  // Напр.: ?mode=quote ... или mode=swap

  try {
    if (method === 'GET') {
      // Предположим, для котировки вы вызываете:
      // https://YOUR_VERCEL_APP.vercel.app/api/jupiter?mode=quote&inputMint=...&outputMint=...&amount=...&slippageBps=...
      if (query.mode === 'quote') {
        const { inputMint, outputMint, amount, slippageBps } = query;
        // Формируем URL для Jupiter /v6/quote
        const quoteUrl = `https://quote-api.jup.ag/v6/quote?` +
          `inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
        console.log("Proxy GET ->", quoteUrl);

        const jupiterResp = await fetch(quoteUrl);
        const data = await jupiterResp.text();
        res.status(jupiterResp.status).send(data);
      } else {
        // Если mode не 'quote', вернём ошибку
        res.status(400).json({ error: "Missing or invalid mode in query" });
      }
    } else if (method === 'POST') {
      // Для swap-транзакции:
      // Вы отправляете POST на /api/jupiter c полем {mode: "swap", route: {...}, userPublicKey, wrapAndUnwrapSol ...}
      if (!body.mode) {
        return res.status(400).json({ error: 'Missing "mode" in body' });
      }
      if (body.mode === 'swap') {
        // Формируем POST-запрос к https://quote-api.jup.ag/v6/swap
        const jupiterResp = await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteResponse: body.quoteResponse,
            userPublicKey: body.userPublicKey,
            wrapAndUnwrapSol: body.wrapAndUnwrapSol,
            // asLegacyTransaction: body.asLegacyTransaction || false,
            // др. параметры по необходимости
          })
        });
        const data = await jupiterResp.text();
        res.status(jupiterResp.status).send(data);
      } else {
        res.status(400).json({ error: 'Unsupported "mode" for POST' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error("Proxy error =>", err);
    res.status(500).json({ error: err.message });
  }
}
