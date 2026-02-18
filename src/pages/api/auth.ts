export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { password } = await request.json();
        const correctPassword = import.meta.env.PUBLISH_PASSWORD;

        if (password === correctPassword) {
            return new Response(JSON.stringify({ success: true }));
        } else {
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
        }
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
