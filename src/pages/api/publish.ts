
export const prerender = false;


const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
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

    if (!response.ok) return new Response(JSON.stringify({ error: 'GitHub API failed', status: response.status }), { status: response.status });

    const data = await response.json();
    if (!Array.isArray(data)) return new Response(JSON.stringify({ error: 'Invalid data from GitHub' }), { status: 500 });
    const files = data.filter((f: any) => f.name.endsWith('.md')).map((f: any) => f.name);

    return new Response(JSON.stringify(files));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { fileName, content, action, title, department, targetFile } = body;

    if (action === 'get-published-list') {
      const fs = await import('fs/promises');
      const path = await import('path');
      const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
      const files = await fs.readdir(postsDir);
      const mdxFiles = files.filter(f => f.endsWith('.mdx'));
      return new Response(JSON.stringify(mdxFiles));
    }

    if (action === 'load-published') {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'src', 'content', 'posts', fileName);
      const rawContent = await fs.readFile(filePath, 'utf-8');

      // Basic frontmatter extraction
      const match = rawContent.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
      if (!match) return new Response(JSON.stringify({ error: 'Invalid MDX format' }), { status: 400 });

      const frontmatterRaw = match[1];
      let content = match[2].trim();

      // Strip standard imports to prevent duplicates when re-publishing
      const standardImports = [
        "import BeforeAfterSlider from '../../components/BeforeAfterSlider';",
        "import TelemetryChart from '../../components/TelemetryChart';",
        "import VideoPlayer from '../../components/VideoPlayer';",
        "import ImageGallery from '../../components/ImageGallery';",
        "import MetricCard from '../../components/MetricCard';",
        "import CalloutBox from '../../components/CalloutBox';",
        "import TabsComponent from '../../components/TabsComponent';"
      ];

      standardImports.forEach(imp => {
        content = content.replace(imp, '').trim();
      });

      const frontmatter: any = {};
      frontmatterRaw.split('\n').forEach(line => {
        const [key, ...val] = line.split(':');
        if (key && val) {
          frontmatter[key.trim()] = val.join(':').trim().replace(/^"(.*)"$/, '$1');
        }
      });

      return new Response(JSON.stringify({
        content: content,
        title: frontmatter.title,
        department: frontmatter.department,
        coverImage: frontmatter.coverImage,
        author: frontmatter.author,
        builderImage: frontmatter.builderImage
      }));
    }

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
      const { fileName, content, title, department, coverImage, isEdit, slug: existingSlug, author, builderImage: bImg } = body;

      // Automatic detection of builder info via GitHub History
      let builderAvatar = "";
      let builderName = "Robot Builder";

      if (fileName && !isEdit) {
        const commitsResp = await fetch(`https://api.github.com/repos/${SOURCE_REPO}/commits?path=${SOURCE_PATH}/${fileName}&per_page=1`, {
          headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
        });
        const commitData = await commitsResp.json();
        builderAvatar = commitData[0]?.author?.avatar_url || "";
        const builderNamePart = fileName.match(/_([A-Z][a-z]+)([A-Z][a-z]+)-/);
        builderName = builderNamePart ? `${builderNamePart[1]} ${builderNamePart[2]}` : (commitData[0]?.commit?.author?.name || "Robot Builder");
      } else if (isEdit) {
        // Keep existing info from edit data if provided
        builderName = author || "Robot Builder";
        builderAvatar = bImg || "";
      }

      const slug = existingSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const fullMDX = `---
title: "${title}"
pubDate: ${new Date().toISOString().split('T')[0]}
author: "${builderName}"
builderImage: "${builderAvatar}"
coverImage: "${coverImage || ""}"
description: "${title} update by ${builderName}."
department: "${department}"
quarter: "2026-Q1"
---
import BeforeAfterSlider from '../../components/BeforeAfterSlider';
import TelemetryChart from '../../components/TelemetryChart';
import VideoPlayer from '../../components/VideoPlayer';
import ImageGallery from '../../components/ImageGallery';
import MetricCard from '../../components/MetricCard';
import CalloutBox from '../../components/CalloutBox';
import TabsComponent from '../../components/TabsComponent';

${content}`;

      // Write file locally first so it's immediately available
      const fs = await import('fs/promises');
      const path = await import('path');
      const localFilePath = path.join(process.cwd(), 'src', 'content', 'posts', `${slug}.mdx`);

      try {
        await fs.writeFile(localFilePath, fullMDX, 'utf-8');
        return new Response(JSON.stringify({ success: true, slug }));
      } catch (writeError: any) {
        console.error('Failed to write local file:', writeError);
        return new Response(JSON.stringify({ error: 'Failed to create article: ' + writeError.message }), { status: 500 });
      }


    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
