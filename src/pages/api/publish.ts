import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SOURCE_REPO = "felipekiwi90/KiwibotMemo";
const PUBLISH_REPO = "miguelreng/robot-build-blog";
const SOURCE_PATH = "Data/Builders";

export async function GET() {
  try {
    if (!GITHUB_TOKEN) {
      return new Response(JSON.stringify({ error: 'GITHUB_TOKEN missing' }), { status: 500 });
    }

    const response = await fetch(`https://api.github.com/repos/${SOURCE_REPO}/contents/${SOURCE_PATH}`, {
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
    });

    if (!response.ok) return new Response(JSON.stringify({ error: 'GitHub API failed' }), { status: response.status });

    const data = await response.json();
    const files = data.filter((f: any) => f.name.endsWith('.md')).map((f: any) => f.name);

    return new Response(JSON.stringify(files));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const { fileName, content, action, title } = await request.json();

    if (action === 'load') {
      const response = await fetch(`https://api.github.com/repos/${SOURCE_REPO}/contents/${SOURCE_PATH}/${fileName}`, {
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
      });
      const data = await response.json();
      const rawContent = Buffer.from(data.content, 'base64').toString('utf-8');

      // EXTRA POINT: Get contributor info to find GitHub avatar
      const commitsResp = await fetch(`https://api.github.com/repos/${SOURCE_REPO}/commits?path=${SOURCE_PATH}/${fileName}&per_page=1`, {
          headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
      });
      const commitData = await commitsResp.json();
      const avatarUrl = commitData[0]?.author?.avatar_url || "https://github.com/identicons/robot.png";
      const ghUser = commitData[0]?.author?.login || "robot-builder";

      return new Response(JSON.stringify({ content: rawContent, avatar: avatarUrl, username: ghUser }));
    }

    if (action === 'publish') {
      // Automatic detection of builder info via GitHub History
      const commitsResp = await fetch(`https://api.github.com/repos/${SOURCE_REPO}/commits?path=${SOURCE_PATH}/${fileName}&per_page=1`, {
          headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
      });
      const commitData = await commitsResp.json();
      const builderAvatar = commitData[0]?.author?.avatar_url || "";
      const builderNamePart = fileName.match(/_([A-Z][a-z]+)([A-Z][a-z]+)-/);
      const builderName = builderNamePart ? `${builderNamePart[1]} ${builderNamePart[2]}` : (commitData[0]?.commit?.author?.name || "Robot Builder");
      
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const fullMDX = `---
title: "${title}"
pubDate: ${new Date().toISOString().split('T')[0]}
author: "${builderName}"
builderImage: "${builderAvatar}"
description: "${title} update by ${builderName}."
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
          message: `Content: ${title} published via Console`,
          content: Buffer.from(fullMDX).toString('base64'),
          branch: "main"
        })
      });

      if (ghResponse.ok) return new Response(JSON.stringify({ success: true, slug }));
      return new Response(JSON.stringify({ error: 'GitHub push failed' }), { status: 500 });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
