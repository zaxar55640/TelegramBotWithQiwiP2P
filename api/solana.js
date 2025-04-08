// /api/solana.js

// Отключаем автоматический JSON Body Parser Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    // Проверяем, что метод запроса POST
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Считываем "сырое" тело запроса (raw body)
    const rawBody = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        resolve(data);
      });
      req.on("error", (err) => reject(err));
    });

    // Логирование rawBody, длины и типа запроса
    console.log("Incoming request method:", req.method);
    console.log("Incoming request headers:", req.headers);
    console.log("Raw body length:", rawBody.length);
    console.log("Raw body:", rawBody);

    // Проверяем, что rawBody не пустой
    if (!rawBody || rawBody.length === 0) {
      console.error("Empty request body detected.");
      return res.status(400).json({ error: "Empty request body" });
    }

    // Проксируем запрос на Solana RPC
    const rpcResponse = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: rawBody,
    });

    // Логирование ответа от RPC-ноде
    const rpcResponseText = await rpcResponse.text();
    console.log("RPC raw response:", rpcResponseText);

    // Попытка парсинга ответа в JSON
    let rpcData;
    try {
      rpcData = JSON.parse(rpcResponseText);
    } catch (parseError) {
      console.error("Error parsing RPC response:", parseError);
      return res.status(500).json({ error: "Failed to parse RPC response" });
    }

    // Отправляем клиенту ответ в виде JSON
    res.status(200).json(rpcData);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: String(err) });
  }
}
