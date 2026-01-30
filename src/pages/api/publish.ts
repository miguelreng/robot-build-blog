import fs from 'fs';
import path from 'path';

// Endpoint simulado para listar memos de GitHub
export async function GET() {
  const memosPath = 'external-memos/Data/Builders';
  if (!fs.existsSync(memosPath)) return new Response(JSON.stringify([]));
  
  const files = fs.readdirSync(memosPath).filter(f => f.endsWith('.md'));
  return new Response(JSON.stringify(files));
}

// Endpoint para generar borrador con AI
export async function POST({ request }) {
  const { fileName } = await request.json();
  const filePath = path.join('external-memos/Data/Builders', fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Aquí llamaríamos a Gemini
  const draft = `---
title: "Draft for ${fileName}"
pubDate: ${new Date().toISOString().split('T')[0]}
author: "Auto-generated"
description: "Review this AI generated description."
---
  
# Processed Content
${content.substring(0, 500)}...

[Hanu: I've prepared the draft. You can now add components like <BeforeAfterSlider /> here.]
`;

  return new Response(JSON.stringify({ draft }));
}
