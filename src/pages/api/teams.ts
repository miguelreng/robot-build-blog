export const prerender = false;

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
const REPO = "miguelreng/robot-build-blog"; // Assuming this is the main repo
const FILE_PATH = "src/data/teams.json";

async function getFile() {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
    });
    if (!res.ok) throw new Error("Could not fetch teams data from GitHub");
    const data = await res.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { content: JSON.parse(content), sha: data.sha };
}

export async function GET() {
    try {
        const { content } = await getFile();
        return new Response(JSON.stringify(content));
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

export async function POST({ request }: { request: Request }) {
    try {
        const body = await request.json();
        const { action, payload } = body;

        // Fetch current state and SHA
        const { content: data, sha } = await getFile();

        if (action === 'save-all') {
            data.teams = payload.teams;
            data.members = payload.members;
        } else {
            return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
        }

        const updatedContent = JSON.stringify(data, null, 2);
        const commitRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: "Update teams and members [skip ci]",
                content: Buffer.from(updatedContent).toString('base64'),
                sha: sha
            })
        });

        if (!commitRes.ok) {
            const error = await commitRes.json();
            throw new Error(error.message || "Failed to commit to GitHub");
        }

        return new Response(JSON.stringify({ success: true }));
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
