// файл: /api/jupiter.js
export default async function handler(req, res) {
  try {
    const { method } = req;
    const query = req.query;

    if (method === 'GET') {
      // Пример запроса котировки (quote)
      // Ожидаем, что Tilda будет звать: 
      // https://my-jupiter-proxy.vercel.app/api/jupiter?mode=quote&inputMint=...&outputMint=...&amount=...&slippage=...

      if (query.mode === 'quote') {
        const { inputMint, outputMint, amount, slippage } = query;
        if (!inputMint || !outputMint || !amount || !slippage) {
          return res.status(400).json({ error: 'Missing required parameters' });
        }
        const jupiterUrl = `https://quote-api.jup.ag/v1/quote?inputMint=${encodeURIComponent(inputMint)}&outputMint=${encodeURIComponent(outputMint)}&amount=${encodeURIComponent(amount)}&slippage=${encodeURIComponent(slippage)}`;

        console.log("Proxy GET to Jupiter:", jupiterUrl);
        const r = await fetch(jupiterUrl);
        if (!r.ok) {
          return res.status(r.status).send(await r.text());
        }
        const data = await r.json();
        return res.status(200).json(data);
      }

      // Если mode не 'quote', отдаём ошибку
      return res.status(400).json({ error: 'Unsupported mode or missing parameters' });
    }

    if (method === 'POST') {
      // Пример запроса swap-транзакции (swap)
      // Ожидаем body вида:
      // {
      //   "mode": "swap",
      //   "route": {...},
      //   "userPublicKey": "...",
      //   "wrapUnwrapSOL": true
      // }

      const body = req.body;
      if (!body.mode) {
        return res.status(400).json({ error: 'Missing "mode" in body' });
      }

      if (body.mode === 'swap') {
        const swapUrl = 'https://quote-api.jup.ag/v1/swap';
        console.log("Proxy POST to Jupiter:", swapUrl, body);
        
        const r = await fetch(swapUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            route: body.route,
            userPublicKey: body.userPublicKey,
            wrapUnwrapSOL: body.wrapUnwrapSOL
          })
        });
        if (!r.ok) {
          return res.status(r.status).send(await r.text());
        }
        const data = await r.json();
        return res.status(200).json(data);
      }

      return res.status(400).json({ error: 'Unsupported mode for POST' });
    }

    // Если это не GET и не POST, метод не поддерживается
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error("Error in jupiter proxy:", err);
    return res.status(500).json({ error: err.message });
  }
}
