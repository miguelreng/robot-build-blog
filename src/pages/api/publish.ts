import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const possiblePaths = [
      path.resolve('external-memos/Data/Builders'),
      path.resolve(process.cwd(), 'external-memos/Data/Builders'),
      path.join(process.cwd(), 'robot-blog/external-memos/Data/Builders')
    ];

    let memosPath = "";
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) { memosPath = p; break; }
    }

    if (!memosPath) return new Response(JSON.stringify({ error: 'Memos path not found' }), { status: 404 });
    const files = fs.readdirSync(memosPath).filter(f => f.endsWith('.md'));
    return new Response(JSON.stringify(files));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const { fileName, content, action, title, authorOverride } = await request.json();
    const possiblePaths = [
      path.resolve('external-memos/Data/Builders'),
      path.resolve(process.cwd(), 'external-memos/Data/Builders')
    ];
    let memosPath = "";
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) { memosPath = p; break; }
    }

    if (action === 'load') {
      const filePath = path.join(memosPath, fileName || "");
      if (!fs.existsSync(filePath)) return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
      const memoContent = fs.readFileSync(filePath, 'utf-8');
      return new Response(JSON.stringify({ content: memoContent }));
    }

    if (action === 'publish') {
      const nameMatch = fileName.match(/_([A-Z][a-z]+)([A-Z][a-z]+)-/);
      const builderName = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : authorOverride || "Robot Builder";
      const builderAvatar = `/builders/${builderName.toLowerCase().replace(' ', '-')}.png`;
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

      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
      const REPO = "miguelreng/robot-build-blog";
      const FILE_PATH = `src/content/posts/${slug}.mdx`;

      const ghResponse = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Content: Publish via Robot Memos Console`,
          content: btoa(unescape(encodeURIComponent(fullMDX))),
          branch: "main"
        })
      });

      if (ghResponse.ok) return new Response(JSON.stringify({ success: true, slug }));
      else return new Response(JSON.stringify({ error: 'GitHub Push Failed' }), { status: 500 });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
