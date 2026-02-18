export async function performRequest({ query, variables = {}, includeDrafts = false }: { query: string; variables?: any; includeDrafts?: boolean }) {
    const token = import.meta.env.DATOCMS_API_TOKEN;

    if (!token) {
        throw new Error("DATOCMS_API_TOKEN is not defined in your environment variables. Please add it to your .env file.");
    }

    const response = await fetch("https://graphql.datocms.com/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(includeDrafts ? { "X-Include-Drafts": "true" } : {}),
        },
        body: JSON.stringify({ query, variables }),
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(
            `${response.status} ${response.statusText}: ${JSON.stringify(responseBody)}`
        );
    }

    if (responseBody.errors) {
        throw new Error(
            `GraphQL Errors: ${JSON.stringify(responseBody.errors, null, 2)}`
        );
    }

    return responseBody.data || {};
}
