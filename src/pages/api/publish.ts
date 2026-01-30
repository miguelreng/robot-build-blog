import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const memosPath = path.resolve('external-memos/Data/Builders');
    if (!fs.existsSync(memosPath)) {
      return new Response(JSON.stringify({ error: 'Memos directory not found' }), { status: 404 });
    }
    
    const files = fs.readdirSync(memosPath).filter(f => f.endsWith('.md'));
    return new Response(JSON.stringify(files));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const { fileName } = await request.json();
    const filePath = path.resolve('external-memos/Data/Builders', fileName);
    
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    return new Response(JSON.stringify({ content }));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
