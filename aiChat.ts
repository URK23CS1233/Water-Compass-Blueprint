/**
 * AI Chat utility - integrates with Together AI for chatbot responses
 */

export async function getAIResponse(message: string): Promise<string> {
  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant for Water Compass Blueprint, an app that helps communities manage water resources sustainably. Provide concise, practical advice about water conservation, groundwater levels, and sustainability practices.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "Sorry, I couldn't respond right now.";
  } catch (error) {
    console.error("AI Chat error:", error);
    return "Sorry, I'm having trouble connecting. Please try again later.";
  }
}
