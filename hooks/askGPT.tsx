export const askGpt = async (prompt: string) => {
  const API_KEY = "AIzaSyB2CUMKgK85XmSREn8MgOAKoCI6zF6d8v0";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  return reply || "No response";
};
