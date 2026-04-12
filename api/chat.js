// File ini berfungsi sebagai perantara (Proxy) agar API Key tetap rahasia di sisi server
export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;
    const apiKey = process.env.GROQ_API_KEY; // Diambil dari environment variable Vercel

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key tidak dikonfigurasi di Vercel' });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: messages,
                temperature: 0.8,
                max_tokens: 1024
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Gagal menghubungi Groq API' });
    }
}