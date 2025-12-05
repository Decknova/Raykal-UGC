export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing FAL_KEY" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { prompt } = await req.json();

  const response = await fetch(
    "https://fal.run/fal-ai/flux/dev/image/generate",
    {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        steps: 24,
        aspect_ratio: "9:16",
      }),
    }
  );

  const data = await response.json();

  return new Response(
    JSON.stringify({
      image: data.image?.url || data.images?.[0]?.url,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
