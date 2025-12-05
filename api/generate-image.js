// Vercel Edge Function untuk generate gambar via Gemini API

export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY belum diset di Vercel" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { prompt, aspectRatio } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt wajib diisi" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ratio = aspectRatio || "1:1";

    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            imageConfig: {
              aspectRatio: ratio,
            },
          },
        }),
      }
    );

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Gemini error:", text);
      return new Response(
        JSON.stringify({ error: "Gemini API error", detail: text }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData);

    if (!imagePart) {
      return new Response(
        JSON.stringify({ error: "Tidak ada gambar di response Gemini" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: base64, mimeType } = imagePart.inlineData;

    return new Response(
      JSON.stringify({
        image: base64,
        mimeType: mimeType || "image/png",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
