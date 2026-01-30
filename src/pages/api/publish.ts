import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const memosPath = path.resolve('external-memos/Data/Builders');
    if (!fs.existsSync(memosPath)) {
      return new Response(JSON.stringify({ error: 'Memos directory not found' }), { status: 404 });
    }
    
    // Lista recursiva para encontrar todos los .md dentro de la carpeta Builders
    const getFiles = (dir) => {
      let results = [];
      const list = fs.readdirSync(dir);
      list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
          results = results.concat(getFiles(file));
        } else if (file.endsWith('.md')) {
          results.push(file);
        }
      });
      return results;
    };

    const absoluteFiles = getFiles(memosPath);
    const files = absoluteFiles.map(f => path.relative(memosPath, f));
    
    return new Response(JSON.stringify(files));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const { fileName, content, action, title, author } = await request.json();
    const memosPath = path.resolve('external-memos/Data/Builders');

    if (action === 'load') {
      const filePath = path.join(memosPath, fileName);
      if (!fs.existsSync(filePath)) return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
      const memoContent = fs.readFileSync(filePath, 'utf-8');
      return new Response(JSON.stringify({ content: memoContent }));
    }

    if (action === 'publish') {
      // Sistema de slug simple basado en el título
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const outputPath = path.resolve(`src/content/posts/${slug}.mdx`);
      
      // Creamos el frontmatter profesional
      const fullContent = `---
title: "${title}"
pubDate: ${new Date().toISOString().split('T')[0]}
author: "${author}"
description: "${title} engineering update from the Robot.com builders."
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
