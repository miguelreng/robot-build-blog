import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Intentamos varias rutas comunes para encontrar la carpeta en Vercel vs Local
    const possiblePaths = [
      path.resolve('external-memos/Data/Builders'),
      path.resolve(process.cwd(), 'external-memos/Data/Builders'),
      path.join(process.cwd(), 'robot-blog/external-memos/Data/Builders')
    ];

    let memosPath = "";
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        memosPath = p;
        break;
      }
    }

    if (!memosPath) {
      return new Response(JSON.stringify({ error: 'Memos path not found', debug: process.cwd() }), { status: 404 });
    }
    
    const files = fs.readdirSync(memosPath).filter(f => f.endsWith('.md'));
    return new Response(JSON.stringify(files));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const { fileName, content, action, title, author } = await request.json();
    
    // Misma lógica de búsqueda de ruta para el POST
    const possiblePaths = [
      path.resolve('external-memos/Data/Builders'),
      path.resolve(process.cwd(), 'external-memos/Data/Builders')
    ];
    let memosPath = "";
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        memosPath = p;
        break;
      }
    }

    if (action === 'load') {
      const filePath = path.join(memosPath, fileName);
      if (!fs.existsSync(filePath)) return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
      const memoContent = fs.readFileSync(filePath, 'utf-8');
      return new Response(JSON.stringify({ content: memoContent }));
    }

    if (action === 'publish') {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const outputPath = path.resolve(process.cwd(), `src/content/posts/${slug}.mdx`);
      
      const fullContent = `---
title: "${title}"
pubDate: ${new Date().toISOString().split('T')[0]}
author: "${author}"
description: "${title} engineering update."
quarter: "2026-Q1"
---
${content}`;

      fs.writeFileSync(outputPath, fullContent);
      return new Response(JSON.stringify({ success: true, slug }));
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
