import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SOURCE_REPO = "felipekiwi90/KiwibotMemo";
const PUBLISH_REPO = "miguelreng/robot-build-blog";
const SOURCE_PATH = "Data/Builders";

export async function GET() {
  try {
    // 1. Pedimos la lista de archivos directamente al API de GitHub (Data/Builders)
    const response = await fetch(`https://api.github.com/repos/${SOURCE_REPO}/contents/${SOURCE_PATH}`, {
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
    });

    if (!response.ok) {
      const err = await response.json();
      return new Response(JSON.stringify({ error: 'GitHub API call failed', detail: err }), { status: response.status });
    }

    const data = await response.json();
    const files = data
      .filter((f: any) => f.name.endsWith('.md'))
      .map((f: any) => f.name);

    return new Response(JSON.stringify(files), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const { fileName, content, action, title } = await request.json();

    // ACCIÓN: CARGAR CONTENIDO DESDE GITHUB SOURCE
    if (action === 'load') {
      const response = await fetch(`https://api.github.com/repos/${SOURCE_REPO}/contents/${SOURCE_PATH}/${fileName}`, {
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
      });
      const data = await response.json();
      // El contenido viene en base64
      const rawContent = Buffer.from(data.content, 'base64').toString('utf-8');
      return new Response(JSON.stringify({ content: rawContent }));
    }

    // ACCIÓN: PUBLICAR EN REPO DEL BLOG (MDX)
    if (action === 'publish') {
      const nameMatch = fileName.match(/_([A-Z][a-z]+)([A-Z][a-z]+)-/);
      const builderName = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : "Robot Builder";
      const builderAvatar = `/builders/${builderName.toLowerCase().replace(/\s+/g, '-')}.png`;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const fullMDX = `---
title: "${title}"
pubDate: ${new Date().toISOString().split('T')[0]}
author: "${builderName}"
builderImage: "${builderAvatar}"
description: "${title} update."
quarter: "2026-Q1"
---
import BeforeAfterSlider from '../../components/BeforeAfterSlider';
import TelemetryChart from '../../components/TelemetryChart';

${content}`;

      const ghResponse = await fetch(`https://api.github.com/repos/${PUBLISH_REPO}/contents/src/content/posts/${slug}.mdx`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Content: ${title} via Robot Memos Console`,
          content: Buffer.from(fullMDX).toString('base64'),
          branch: "main"
        })
      });

      if (ghResponse.ok) return new Response(JSON.stringify({ success: true, slug }));
      return new Response(JSON.stringify({ error: 'Production Hub push failed' }), { status: 500 });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
