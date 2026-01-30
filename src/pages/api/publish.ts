import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Definimos las rutas posibles con mayor robustez para Vercel
    const cwd = process.cwd();
    const possiblePaths = [
      path.join(cwd, 'external-memos', 'Data', 'Builders'),
      path.resolve(cwd, 'external-memos/Data/Builders'),
      // Ruta absoluta común en despliegues Astro/Vercel
      '/vercel/path0/external-memos/Data/Builders'
    ];

    let memosPath = "";
    let checked = [];
    for (const p of possiblePaths) {
      checked.push(p);
      if (fs.existsSync(p)) {
        memosPath = p;
        break;
      }
    }

    if (!memosPath) {
      return new Response(JSON.stringify({ 
        error: 'Memos path not found', 
        cwd: cwd,
        checked: checked,
        structure: fs.existsSync(cwd) ? fs.readdirSync(cwd) : 'cwd not readable'
      }), { status: 404 });
    }
    
    // Leemos archivos y filtramos solo los .md
    const files = fs.readdirSync(memosPath)
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a)); // Memos más recientes primero por nombre

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
    const cwd = process.cwd();
    const memosPath = path.join(cwd, 'external-memos', 'Data', 'Builders');

    if (action === 'load') {
      const filePath = path.join(memosPath, fileName || "");
      if (!fs.existsSync(filePath)) {
        return new Response(JSON.stringify({ error: `File not found: ${fileName}` }), { status: 404 });
      }
      const memoContent = fs.readFileSync(filePath, 'utf-8');
      return new Response(JSON.stringify({ content: memoContent }));
    }

    if (action === 'publish') {
      // Detección de autor basada en el nombre del archivo (ej: 2024Q4_W44_JonathanDeiloff-...)
      const parts = fileName.split('_');
      const authorPart = parts.length > 2 ? parts[2].split('-')[0] : "Robot Builder";
      // Split CamelCase names (JonathanDeiloff -> Jonathan Deiloff)
      const builderName = authorPart.replace(/([A-Z])/g, ' $1').trim();
      const builderAvatar = `/builders/${builderName.toLowerCase().replace(/\s+/g, '-')}.png`;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const fullMDX = `---
title: "${title}"
pubDate: ${new Date().toISOString().split('T')[0]}
author: "${builderName}"
builderImage: "${builderAvatar}"
description: "${title} engineering update from the team."
quarter: "2026-Q1"
---
import BeforeAfterSlider from '../../components/BeforeAfterSlider';
import TelemetryChart from '../../components/TelemetryChart';

${content}`;

      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
      const REPO = "miguelreng/robot-build-blog";
      
      const ghResponse = await fetch(`https://api.github.com/repos/${REPO}/contents/src/content/posts/${slug}.mdx`, {
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
      const errorData = await ghResponse.json();
      return new Response(JSON.stringify({ error: 'GitHub Push Failed', details: errorData }), { status: 500 });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
