export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        let { prompt, content, apiKey } = await request.json();

        // Use environment variable for API key
        apiKey = apiKey?.trim() || import.meta.env.OPENROUTER_API_KEY;

        if (!content) {
            return new Response(JSON.stringify({ error: "No content to tune" }), { status: 400 });
        }

        const systemPrompt = "You are an expert editor for engineering memos. Your goal is to improve the clarity, professionalism, and flow of the text while maintaining the original technical meaning. Do not change the overall structure unless necessary. Return ONLY the improved text, no conversational filler.";

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "https://robot.com", // Optional, for OpenRouter rankings
                "X-Title": "RobotBuildBlog", // Optional
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": content }
                ]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            return new Response(JSON.stringify({ error: `OpenRouter Service Error: ${errText}` }), { status: response.status });
        }

        const data = await response.json();
        const improvedContent = data.choices[0]?.message?.content || content;

        return new Response(JSON.stringify({ content: improvedContent }));

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
