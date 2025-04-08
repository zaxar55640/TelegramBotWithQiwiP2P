// /api/solana.js

// Отключаем автоматический JSON Body Parser Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Обработка preflight OPTIONS-запроса
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  // Если метод не POST, возвращаем 405
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Чтение raw тела запроса
    const rawBody = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => { data += chunk; });
      req.on("end", () => resolve(data));
      req.on("error", (err) => reject(err));
    });

    // Логирование для проверки
    console.log("Incoming request method:", req.method);
    console.log("Incoming request headers:", req.headers);
    console.log("Raw body length:", rawBody.length);
    console.log("Raw body:", rawBody);

    if (!rawBody || rawBody.length === 0) {
      console.error("Empty request body detected.");
      return res.status(400).json({ error: "Empty request body" });
    }

    // Проксирование запроса к Solana RPC
    const rpcResponse = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: rawBody,
    });

    const rpcResponseText = await rpcResponse.text();
    console.log("RPC raw response:", rpcResponseText);

    let rpcData;
    try {
      rpcData = JSON.parse(rpcResponseText);
    } catch (parseError) {
      console.error("Error parsing RPC response:", parseError);
      return res.status(500).json({ error: "Failed to parse RPC response" });
    }

    // Возвращаем ответ клиенту и добавляем нужный CORS заголовок
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(rpcData);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: String(err) });
  }
}
