// api/jupiter-quote.js

export default async function handler(req, res) {
  // Получаем параметры запроса
  const { inputMint, outputMint, amount, slippage } = req.query;

  // Проверяем наличие обязательных параметров
  if (!inputMint || !outputMint || !amount || !slippage) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Формируем URL запроса к Jupiter API
  const jupiterUrl = `https://quote-api.jup.ag/v1/quote?inputMint=${encodeURIComponent(inputMint)}&outputMint=${encodeURIComponent(outputMint)}&amount=${encodeURIComponent(amount)}&slippage=${encodeURIComponent(slippage)}`;

  try {
    const response = await fetch(jupiterUrl);
    // Если ответ не 200 OK, возвращаем ошибку
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }
    const jsonData = await response.json();
    // Возвращаем данные клиенту
    res.status(200).json(jsonData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

